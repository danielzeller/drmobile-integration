define('js/page-transitions', ['alf'], function(Alf)
{
    var $ = Alf.dom;
    var PageTransitions = function(args)
    {
        var self = this;
        this.args = args;

        // Cache DOM elements
        this.$chrome = $(args.selector.chrome);
        this.$article = this.$chrome.find(args.selector.article);
        this.$pages = this.$article.find(args.selector.page);

        // State
        this.pageHeight = this.$pages.height();
        this.currentPage = 0;
        this.pageCount = this.$pages.length;

        this.setPageDimensions();
        $(window).on('resize orientationchange', function()
        {
            self.setPageDimensions.call(self);
        });

        this.listen();
    };

    PageTransitions.prototype = {
        setPageDimensions: function()
        {
            this.$pages.height(this.pageHeight);
            this.$article.height(this.pageHeight * this.pageCount);
        },

        showPage: function(index, animate)
        {
            this.currentPage = Math.max(0, Math.min(index, this.pageCount - 1));

            var offset = -((100 / this.pageCount) * this.currentPage);
            this.setArticleOffset(offset, animate);
        },

        prev: function() { return this.showPage(this.currentPage - 1, true); },
        next: function() { return this.showPage(this.currentPage + 1, true); },

        setArticleOffset: function(percent, animate)
        {
            this.$article[animate ? 'addClass' : 'removeClass']('animate');
            this.$article.css('transform', 'translate3d(0, ' + percent + '%, 0) scale3d(1, 1, 1)');
        },

        listen: function()
        {
            var self = this;

            new Hammer(this.$chrome[0], this.args.hammer.options).on(this.args.hammer.events, function(e)
            {
                console.log('Event', e.type);
                switch(e.type)
                {
                    // Stick to the finger
                    case 'dragup':
                    case 'dragdown':
                        var pageOffset = -(100 / self.pageCount) * self.currentPage;
                        var dragOffset = ((100 / self.pageHeight) * e.gesture.deltaY) / self.pageCount;

                        self.setArticleOffset(dragOffset + pageOffset);
                        break;

                    // Just navigate
                    case 'swipeup':
                        self.next();
                        e.gesture.stopDetect();
                        break;

                    case 'swipedown':
                        self.prev();
                        e.gesture.stopDetect();
                        break;

                    // If more then 50% moved, navigate
                    case 'release':
                        if(Math.abs(e.gesture.deltaY) > self.pageHeight / 2)
                        {
                            if(e.gesture.direction == 'down')
                                self.prev();
                            else
                                self.next();
                        }
                        else
                            self.showPage(self.currentPage, true);

                        break;
                }
            });
        }
    };

    return PageTransitions;
});
