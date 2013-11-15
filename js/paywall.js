define('paywall', ['main'], function (app) {
	"use strict";

	// PAYWALL 

	var paywall = {};
	paywall.shouldPreventTouch = true;

	app.event.on('showPaywall', function (animated, products) {
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

		$('#paywallInner').addClass('showPaywall');

		console.log('Displaying paywall');
		
		paywall.shouldPreventTouch = true;
	});

	app.event.on('hidePaywall', function (animated) {

		$('#paywallInner').removeClass('showPaywall');

		console.log('Hiding paywall');
		
		paywall.shouldPreventTouch = false;		
	});
	
	$('#chrome').on('touchmove, touchstart', function () {
		console.log('Touched paywall');

		if(paywall.shouldPreventTouch) {
			$('.layer-content').addClass('overflowHidden');
		} else {
			$('.layer-content').removeClass('overflowHidden');
		}
	});

	$('.paywall-buy-product').click(function() {
		var productIdentifier = $(this).attr('productIdentifier');
		productIdentifier = "com.ivyengine.aftenpostenmonthly";
		console.log('User wants access - buy - ' + productIdentifier);
		app.bridge.trigger('userWantsAccess', 'buy', productIdentifier);
	    e.preventDefault();
		return false;
	});

	$('.paywall-restore').click(function() {
		console.log('User wants access - restore');
		app.bridge.trigger('userWantsAccess', 'restore');
	    e.preventDefault();
		return false;
	});

	$('.paywall-subscribe').click(function() {
		console.log('User wants access - subscribe');
		app.bridge.trigger('userWantsAccess', 'subscribe');
	    e.preventDefault();
		return false;
	});
	
	$('.show-user-profile').click(function() {
		console.log('User wants to open - user profile');
		app.bridge.trigger('showUserProfile');
	    e.preventDefault();
		return false;
	});

	$('#paywall-login form').bind('submit', function(e) {
		console.log('User wants access - login');
		var username = $(this).find('input[name="username"]').val();
	    var password = $(this).find('input[name="password"]').val()
		app.bridge.trigger('userWantsAccess', 'login', username, password);
	    e.preventDefault();
		return false;
	});
	                     
	$(".paywall-trigger").bind('click', function(e){
	    e.preventDefault();
	    var toShow = $(this).attr('target');
	    $('.paywall-tab').toggleClass('open');
	    $('.paywall-trigger').toggleClass('open');
	    e.preventDefault();
		return false;
	});

	$(".more-info-trigger").bind('click', function(e){
	    var toShow = $(this).attr('target');
	    $(toShow).addClass('open');
	    e.preventDefault();
		return false;
	});

	$(".close-more-info").bind('click', function(e){
	    var toShow = $(this).attr('target');
	    $(toShow).removeClass('open');
	    e.preventDefault();
		return false;
	});
 
	return paywall;
});