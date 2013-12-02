define('paywall', ['main'], function (app) {
	"use strict";
	
	function updatePaywallHeight() {

		// see wich tab is highest
		var arr = [];
		$('.paywall-tab').each(function(){
		    arr.push($(this).outerHeight());	    
		});			

		$('#paywall-content').css('height', Math.max.apply( Math, arr ));

		// push paywall Total height 
		var paywallHeight = $('#paywallInner').height();
	    app.bridge.trigger('paywallLoaded', {
	        "height": paywallHeight
	    });
		console.log('paywall height = ' + paywallHeight);		


	}
	

	$(document).ready(function() {
		window.setTimeout(updatePaywallHeight, 300);
		
	});
	
	// PAYWALL 

	var paywall = {};

	app.event.on('updatePaywall', function (args) {
		var gotProducts = typeof(args.products) != "undefined" && args.products.length > 0;
		var wall = gotProducts ? $('#purchase-with-products-wall') : $('#login-or-signup-wall');
		var otherWall = !gotProducts ? $('#purchase-with-products-wall') : $('#login-or-signup-wall');
		var animDuration = args.animated ? 300 : 0;
		var fullName = args.user;
		var isLoggedIn = fullName ? true : false;
		var activePaywallElement = isLoggedIn ? $('#paywall-logged-in') : $('#paywall-login');
		var paywallHeight = $('#paywallInner').height();
				
		$('.paywall-tab').removeClass('open');
		activePaywallElement.addClass('open');
		
		if(isLoggedIn) {
			$('.getSpidUserName').text(fullName);
		}
		
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
	
	$('a.forgotPassword').bind('click', function(e) {
		var forgotPasswordUrl = $(this).attr('href');
		console.log('User wants password - forgotPassword ' + forgotPasswordUrl);
		app.bridge.trigger('forgotPassword', {
			"provider": "spid",
			"url": forgotPasswordUrl
		});
		return false;
	});
	                     
	$(".paywall-tab-trigger").bind('click', function(e){
	    var toShow = $(this).attr('intern');
	    console.log('open ' + toShow);
	    $(".paywall-tab.open").removeClass('open');
		$(".paywall-tab-trigger.open").removeClass('open');
	    $(toShow).addClass('open');
	    $(this).addClass('open');
		return false;
	});
 
	return paywall;
});