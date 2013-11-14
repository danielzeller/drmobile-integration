/*
require(['pluss', 'alf', 'hub/display'], function (pluss, Alf, eventDisplay) {
	var $ = Alf.dom;

	eventDisplay.attach();
*/

	/**
	* This is the element that holds the rendered page
	*/
/*
	var pageContentEl = $('#layer-content');

	var initAppCache = function() {
		try {
			var appCache = window.applicationCache;
			appCache.update();

			appCache.addEventListener('updateready', function () {
				appCache.swapCache();
				pluss.bridge.trigger('refreshWhenReady');
			}, false);

			setInterval(function() { appCache.update(); }, 60000);
		} catch (error) {
			log('ApplicationCache error - cache manifest update. ' + error);
		}
	};

	var log = function(data) {
		if (typeof console == "object") {
			console.log(data);
		}			
		pluss.bridge.trigger('log', data);
	}

	pluss.event.on('renderPage', function (compiledPage, contextHash, assetsBaseUrl) {
		window.scrollTo(0);
		pluss.renderCompiledPage(pageContentEl, compiledPage, contextHash, assetsBaseUrl);
	});

	pluss.event.on('applicationInfo', function (info) {
		log('Got applicationInfo:');
	});

	pluss.event.on('visibillity', function(state) {
		log('Got visibillity state: ' + state);
	});

	pluss.event.on('focus', function(state) {
		log('Got focus state: ' + state);
	});

	pluss.event.on('appstate', function(state) {
		log('Got appstate: ' + state);
	});
*/

	$(document).ready(function () {
/*
		window.pluss = pluss;

		window.onerror = function(message, url, linenumber) {
			pluss.bridge.trigger('error', url + ':' + linenumber + ' - ' + message);
		}
*/

		$('body').on('tap', 'a', function (event) {
			url = $(this).attr('href');

			log('tapped link with text: ' + a.text());
			pluss.bridge.trigger('closedBrowser', { url: url });
		});
							
		$(".paywall-trigger").bind('click', function(e){
		    e.preventDefault();
		    var toShow = $(this).attr('target');
		    $('.paywall-tab').toggleClass('open');
		    $('.paywall-trigger').toggleClass('open');
		});
		
		$(".more-info-trigger").bind('click', function(e){
		    var toShow = $(this).attr('target');
		    $(toShow).toggleClass('open');
		    e.preventDefault();
		});
		$(".more-info-trigger").bind('click', function(e){
		    var toShow = $(this).attr('target');
		    $(toShow).addClass('open');
		    e.preventDefault();
		});
		$(".close-more-info").bind('click', function(e){
		    var toShow = $(this).attr('target');
		    $(toShow).removeClass('open');
		    e.preventDefault();
		});


		$('body').on('touchend', 'a', function(event) {
			event.stopPropagation();
			event.preventDefault();
			return false;
		});

		//initAppCache();
		//pluss.bridge.trigger('integrationLoaded');
	});



	// PAYWALL
/*
	pluss.shouldPreventTouch = false;

	$('.paywall').css({opacity:1});

	pluss.event.on('showPaywall', function (animated, products) {
		var gotProducts = typeof(products) != "undefined" && products.length > 0;
		var wall = gotProducts ? $('#purchase-with-products-wall') : $('#login-or-signup-wall');
		var otherWall = !gotProducts ? $('#purchase-with-products-wall') : $('#login-or-signup-wall');
		var animDuration = animated ? 300 : 0;
		if(gotProducts)
		{
			$.each(products, function(i, p) {
				var productEl = $('[pid="'+p.productIdentifier+'"]');
				var productPriceEl = productEl.find('.paywall-product-price');
				productPriceEl.text(p.price + ',-');
			});
		}
		
		wall.css({display:"block"});
		otherWall.hide().css({opacity:0});
		wall.animate({opacity:1}, animDuration);

		log('Displaying paywall');
		
		pluss.shouldPreventTouch = true;
	});

	pluss.event.on('hidePaywall', function (animated) {
		var wall = $('.paywall');
		var animDuration = animated ? 500 : 0;
		wall.animate({opacity: 0}, animDuration).hide();
		log('Hiding paywall');
		
		pluss.shouldPreventTouch = false;		
	});
	
	$('#chrome').on('touchmove, touchstart', function () {
		log('Touched paywall');

		if(pluss.shouldPreventTouch) {
			$('.layer-content').addClass('overflowHidden');
		} else {
			$('.layer-content').removeClass('overflowHidden');
		}
	});



	$('.paywall-buy-product').click(function() {
		var productIdentifier = $(this).attr('productIdentifier');
		log('User wants access - buy - ' + productIdentifier);
		pluss.bridge.trigger('userWantsAccess', 'buy', productIdentifier);
		return false;
	});

	$('.paywall-restore').click(function() {
		log('User wants access - restore');
		pluss.bridge.trigger('userWantsAccess', 'restore');
		return false;
	});

	$('.paywall-subscribe').click(function() {
		log('User wants access - subscribe');
		pluss.bridge.trigger('userWantsAccess', 'subscribe');
		return false;
	});

	$('.paywall-login').click(function() {
		log('User wants access - login');
		pluss.bridge.trigger('userWantsAccess', 'login');
		return false;
	});
	
	$('.show-user-profile').click(function() {
		log('User wants to open - user profile');
		pluss.bridge.trigger('showUserProfile');
		return false;
	});
*/


	// // Fake page renderer for testing
	// var url = 'http://rai-dev.aptoma.no:9000/drmobile.json?articleId=20158858&formatName=ipad_landscape&limit=1&callback=?';

	// $.get(url, function (response) {
	// 	if(response.items.length == 0) {
	// 		alert("No information found in Dr.Lib");
	// 	}
	// 	else {
	// 		var pages = response.items[0].compiled.pages;
	// 		pluss.event.trigger('renderPage', pages[1], 'contextHash');   
	// 	}
	// }, 'jsonp');

/* }); */
