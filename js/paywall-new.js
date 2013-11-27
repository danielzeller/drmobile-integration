define('paywall', ['main'], function (app) {
	"use strict";

	$( document ).ready(function() {
		var paywallHeight = $('#paywallInner').height();
		
		console.log('paywallLoaded ' + paywallHeight);
	    app.bridge.trigger('paywallLoaded', {
	        "height": paywallHeight
	    });
	});

	
	// PAYWALL 

	var paywall = {};

	app.event.on('updatePaywall', function (args) {
		var gotProducts = typeof(args.products) != "undefined" && args.products.length > 0;
		var wall = gotProducts ? $('#purchase-with-products-wall') : $('#login-or-signup-wall');
		var otherWall = !gotProducts ? $('#purchase-with-products-wall') : $('#login-or-signup-wall');
		var animDuration = args.animated ? 300 : 0;
		var paywallHeight = $('#paywallInner').height();
		
		if(gotProducts)
		{
			$.each(args.products, function(i, p) {
				var productEl = $('[pid="'+p.productIdentifier+'"]');
				var productPriceEl = productEl.find('.paywall-product-price');
				productPriceEl.text(p.price + ',-');
			});
		}

		console.log('Updated paywall');		
	});


	$('#chrome').on('touchmove, touchstart', function () {
		console.log('Touched paywall');
		$('.layer-content').removeClass('overflowHidden');
	});

	$('.paywall-buy-product').click(function() {
		var productIdentifier = $(this).attr('productIdentifier');
		productIdentifier = "com.ivyengine.aftenpostenmonthly";
		console.log('User wants access - buy - ' + productIdentifier);
		app.bridge.trigger('buy', {
			"provider": null,
			"productIdentifier": productIdentifier
		});
		return false;
	});

	$('.paywall-restore').click(function() {
		console.log('User wants access - restore');
		app.bridge.trigger('login', {
			"provider": "itunes"
		});
		return false;
	});

	$('.paywall-subscribe').click(function() {
		console.log('User wants access - register');
		app.bridge.trigger('register', {
			"provider": null
		});
		return false;
	});
	
	$('.paywall-logout').click(function() {
		console.log('User wants to logout - logout');
		app.bridge.trigger('logout', {
			"provider": "spid"
		});
		return false;
	});
	
	$('#paywall-login form').bind('submit', function(e) {
		console.log('User wants access - login');
		app.bridge.trigger('login', {
			"provider": "spid",
			"username": $(this).find('input[name="username"]').val(),
			"password": $(this).find('input[name="password"]').val()
		});
		return false;
	});
	
	$('#paywall-forgot-password form').bind('submit', function(e) {
		console.log('User wants password - forgotPassword');
		var username = $(this).find('input[name="username"]').val();
		app.bridge.trigger('forgotPassword', {
			"provider": "spid",
			"username": $(this).find('input[name="username"]').val()
		});
		return false;
	});
	                     
	$(".paywall-tab-trigger").bind('click', function(e){
	    var toShow = $(this).attr('target');
	    console.log('open ' + toShow);
	    $(".paywall-tab.open").removeClass('open');
		$(".paywall-tab-trigger.open").removeClass('open');
	    $(toShow).addClass('open');
	    $(this).addClass('open');
		return false;
	});

	$(".more-info-trigger").bind('click', function(e){
	    var toShow = $(this).attr('target');
	    $(toShow).addClass('open');
		return false;
	});

	$(".close-more-info").bind('click', function(e){
	    var toShow = $(this).attr('target');
	    $(toShow).removeClass('open');
		return false;
	});
 
	return paywall;
});