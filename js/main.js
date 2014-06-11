define('main',
    ['alf', 'js/widgets/disqus', 'js/widgets/banner', 'js/widgets/phonebanner', 'js/page-transitions'],
    function (Alf, disqus, banner, phonebanner)
    {
        'use strict';
        var $ = Alf.dom;

        $('.alf-layer-fullscreen').on('singleTap touchstart tap click touchend', 'a', function (ev) {
            ev.stopImmediatePropagation();
        });

        var widgets = [];
        widgets.push(disqus);
        widgets.push(banner);
        widgets.push(phonebanner);

        var app = {
            initialize: function()
            {
                this.context = this.objectifyUrlParams();

                this.isEmbeddedInApp = true;
                if('isEmbeddedInApp' in this.context)
                    this.isEmbeddedInApp = this.context.isEmbeddedInApp;

                this.page = null;
                this.event = null;
                this.bridge = null;
                this.initBridge();
                this.initLayers();

                if('deviceOS' in this.context && this.context.deviceOS == 'android' &&
                   'deviceType' in this.context && this.context.deviceType == 'tablet')
                {
                    $('html').addClass('android-tablet');
                    this.scalePage();
                }
            },

            objectifyUrlParams: function()
            {
                var params = {};
                var search = window.location.search;

                // https://github.com/sindresorhus/query-string
                if(typeof search === 'string')
                {
                    search = search.trim().replace(/^\?/, '');

                    if(search)
                    {
                        params = search.trim().split('&').reduce(function(result, param)
                        {
                            var parts = param.replace(/\+/g, ' ').split('=');
                            // missing `=` should be `null`:
                            // http://w3.org/TR/2012/WD-url-20120524/#collect-url-parameters
                            result[parts[0]] = parts[1] === undefined ? null : decodeURIComponent(parts[1]);
                            return result;
                        }, {});
                    }
                }

                return params;
            },

            logToApp: function (data) {
                this.bridge.trigger('log', {
                    "message": data,
                    "level": 1
                });
            },

            logToConsole: function (data) {
                if (typeof console == "object") {
                    console.log(data);
                }
            },

            logToAll: function (data) {
                this.logToConsole(data);
                this.logToApp(data);
            },

            /**
             * Initialize the bridge used for communication between native and HTML
             *
             * @return {void}
             */
            initBridge: function () {
                // This is used to trigger HTML-events by the native layer
                this.event = _.extend({}, Alf.Events);

                // This is used to send event-data to the native app
                this.bridge = _.extend({}, Alf.Events, {
                    initialize: function () {
                        this.frameIndex = 0;
                        this.eventFrames = $('.event-frame');
                        this.bind('all', this.eventTriggered);
                    },

                    /**
                     * Event triggered
                     *
                     * This works like a proxy for all events triggered on this.bridge
                     * Change the src attribute on any of the iframes so the native wrapper app
                     * can intercept it and decode the JSON payload in the URL
                     *
                     * @return {void}
                     */
                    eventTriggered: function () {
                        console.log([].slice.call(arguments));
                        var eventInfo = JSON.stringify([].slice.call(arguments));

                        this.frameIndex = (this.frameIndex + 1) % this.eventFrames.length;
                        if (app.isEmbeddedInApp) {
                            this.eventFrames[this.frameIndex].src = 'event://' + escape(eventInfo);
                        }
                        else {
                            app.logToConsole('Event: ' + eventInfo);
                        }
                    }
                });

                this.bridge.initialize();
            },

            /**
             * Initialize layers
             *
             * This is to enable fullscreen support
             * The article/pages and fullscreen elements are rendered in different "layers"
             *
             * @return {void}
             */
            initLayers: function () {

                this.layerManager = new Alf.layer.Manager();

                this.pageLayer = new Alf.layer.Page({
                    el: '#alf-layer-content',
                    widgets: widgets,
                    manager: this.layerManager
                });

                this.fullscreenLayer = new Alf.layer.Fullscreen({
                    el: '#alf-layer-fullscreen',
                    manager: this.layerManager
                });

                this.pageLayer.render();
                this.fullscreenLayer.render();
            },


            /**
             * Render the page on screen
             *
             * Takes the compiled content and uses Alf.layout.Page to do rendering
             *
             * @param {HTMLElement} el the element to put the page inside
             * @param {Object} deskedPage
             * @param {String} contextHash used for race conditions
             * @param {String} assetsBaseUrl
             * @param {Function} onDone
             * @return {void}
             */
            renderPage: function (pageContentEl, deskedPage, assetsBaseUrl, onDone) {

                if (this.page) {
                    this.page.tearDown();
                    this.page = null;
                }

                var page;
                //TODO: remove after aptoma fix
                var pixelDensity = parseInt(window.devicePixelRatio || 1, 10) >= 2 ? 2 : 1;

                this.page = page = new Alf.layout.Page({
                    pixelRatio: pixelDensity,
                    layer: this.pageLayer,
                    widgets: widgets,
                    assetsBaseUrl: assetsBaseUrl
                });

                page.on('loadComplete', function () {
                    onDone();
                });

                if (deskedPage.docType == "ad") {
                  console.log("Content is an ad");
                  $(pageContentEl).append(deskedPage.html);
                  page.decompiled = true;
                  page.trigger('loadComplete');
                } else if (deskedPage.docType == "livearticle") {
                  console.log("Content is a live article");
                } else {
                  page.decompile(deskedPage, function () {
                      page.render(pageContentEl);
                  });
                }

            },

            /**
             * Render the page on screen
             *
             * Takes the compiled content and uses Alf.layout.Page to do rendering
             *
             * @param {HTMLElement} el the element to put the page inside
             * @param {Object} deskedPage
             * @param {String} contextHash used for race conditions
             * @param {String} assetsBaseUrl
             * @param {Function} onDone
             * @return {void}
             */
            renderPages: function (pageContentEl, deskedPages, assetsBaseUrl, onDone) {
                var self = this;
                if (this.pages && this.pages.length) {
                    $.each(this.pages, function (i, page) {
                        page.tearDown();
                    });
                }

                this.pages = [];

                //TODO: remove after aptoma fix
                var pixelDensity = parseInt(window.devicePixelRatio || 1, 10) >= 2 ? 2 : 1;
                var loadCompletes = 0;

                var pageDivs = document.createDocumentFragment();
                for (var i = 0; i < deskedPages.length; i++) {
                    var pageDiv = document.createElement('div');
                    pageDiv.className = 'page';
                    pageDivs.appendChild(pageDiv);
                }

                $(pageContentEl).html(pageDivs);//.css('overflow', 'auto');

                $.each(deskedPages, function (i, deskedPage)
                {
                    var page = new Alf.layout.Page({
                        pixelRatio: pixelDensity,
                        layer: self.pageLayer,
                        widgets: widgets,
                        assetsBaseUrl: assetsBaseUrl
                    });

                    self.pages.push(page);

                    page.on('loadComplete', function () {
                        if (++loadCompletes === deskedPages.length)
                        {
                            onDone();

                            // Setup page transitions
                            var PageTransitions = require('js/page-transitions');
                            var pageTransitions = new PageTransitions(
                            {
                                selector: {
                                    chrome: '#chrome',
                                    article: '.article',
                                    page: '.page'
                                },
                                hammer: {
                                    options: {
                                        dragLockToAxis: true,
                                        preventDefault: true
                                    },
                                    events: 'release dragup dragdown swipeup swipedown'
                                }
                            });
                        }
                    });

                    page.decompile(deskedPage, function () {
                        page.render(pageContentEl.find('.page').eq(i));
                    });
                });
            },

            /**
             * Clear the page on screen
             *
             * @param {Function} onDone
             * @return {void}
             */
            clearPage: function (pageContentEl) {
                if (this.page) {
                    this.page.tearDown();
                    this.page = null;
                }

                if (this.pages && this.pages.length) {
                    $.each(this.pages, function (i, page) {
                        page.tearDown();
                    });
                }

                this.pages = [];

                pageContentEl.html("");
            },

            exitFullscreen: function () {
                app.fullscreenLayer.exitFullscreen();
            },

            scalePage: function()
            {
                // Scale webview to fit Android tablets
                var windowWidth = window.innerWidth;
                var windowHeight = window.innerHeight;
                var tooHigh = 768 - windowHeight;
                var tooWide = parseInt((tooHigh / 3) * 4, 10);
                tooWide += tooWide % 2;

                var $metaViewport = $('<meta name="viewport" content="width=' + (windowWidth + tooWide) +', user-scalable=no">');
                $('head').find('meta[name="viewport"]').remove();
                $('head').append($metaViewport);
            }
        };

        app.initialize();
        window.app = app;
        window.onerror = function (message, url, linenumber) {
            var error = url + ':' + linenumber + ' - ' + message;
            app.logToConsole(error);
            app.bridge.trigger('error', {
                "reason": error
            });
        };


        Alf.hub.on('fullscreenWillAppear', function () {
            app.bridge.trigger('displayState', {"event": 'fullscreenWillAppear'});
        }, this);

        Alf.hub.on('fullscreenWillDisappear', function () {
            app.bridge.trigger('displayState', {"event": 'fullscreenWillDisappear'});
        }, this);

        Alf.hub.on('fullscreenDidAppear', function () {
            app.bridge.trigger('displayState', {"event": 'fullscreenDidAppear'});
        });

        Alf.hub.on('fullscreenDidDisappear', function () {
            app.bridge.trigger('displayState', {"event": 'fullscreenDidDisappear'});
        });

        app.event.on('renderPage', function (args) {
            setTimeout(function () { // delay for allowing main thread to continue
                var pageContentEl = $('#alf-layer-content');

                window.scrollTo(0, 0);
                app.renderPage(pageContentEl, args.json, args.assetsBaseUrl, function () {
                    if ('onReadyForDisplay' in args && !!args.onReadyForDisplay) {
                        app.bridge.trigger(args.onReadyForDisplay, {
                            "contextHash": args.contextHash
                        });
                    }
                });
                if ('onRenderCompleted' in args && !!args.onRenderCompleted) {
                    app.bridge.trigger(args.onRenderCompleted, {
                        "contextHash": args.contextHash
                    });
                }
            }, 10);
        });

        app.event.on('renderPages', function (args) {
            setTimeout(function () { // delay for allowing main thread to continue
                var pageContentEl = $('#alf-layer-content');

                window.scrollTo(0, 0);
                app.renderPages(pageContentEl, args.json, args.assetsBaseUrl, function () {
                    if ('onReadyForDisplay' in args && !!args.onReadyForDisplay) {
                        app.bridge.trigger(args.onReadyForDisplay, {
                            "contextHash": args.contextHash
                        });
                    }
                });
                if ('onRenderCompleted' in args && !!args.onRenderCompleted) {
                    app.bridge.trigger(args.onRenderCompleted, {
                        "contextHash": args.contextHash
                    });
                }
            }, 10);
        });

        app.event.on('clearPage', function (args) {
            var pageContentEl = $('#alf-layer-content');
            app.clearPage(pageContentEl);
        });

        app.event.on('clientInfo', function (info) {
            app.logToAll('Got clientInfo:');
        });

        app.event.on('networkReachability', function (state) {
            app.logToAll('Got networkReachability:');
        });

        app.event.on('applicationState', function (state) {
            app.logToAll('Got applicationState: ' + state);
        });

        $(document).ready(function () {
            app.bridge.trigger('integrationLoaded', {});
        });

        return app;
    }
);
