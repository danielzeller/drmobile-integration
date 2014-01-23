define('paywall', ['main'], function (app) {
	"use strict";


	var isMobile = {
	    Android: function() {
	        return navigator.userAgent.match(/Android/i);
	    },
	    iOS: function() {
	        return navigator.userAgent.match(/iPhone|iPad|iPod/i);
	    },
	    any: function() {
	        return (isMobile.Android() || isMobile.iOS() );
	    }
	};
	
	var deviceHeight = window.screen.height;
		
	if( isMobile.Android() ){
		$('body').addClass('android');		
	}

		
	function updatePaywallHeight() {

		// see wich tab is highest
		var arr = [];
		$('.paywall-tab').each(function(){		
			var thisOutherHeight = $(this).outerHeight();
			var thisMarginTop = thisOutherHeight / 2;
		    arr.push(thisOutherHeight);
		    $(this).css('margin-top',  - thisMarginTop);    
		});	
		
		$('#paywall-content').css('height', Math.max.apply( Math, arr ));
		
		// push paywall Total height 
		var paywallHeight = $('#paywallInner').height();
	    app.bridge.trigger('paywallLoaded', {
	        "height": paywallHeight
	    });
		console.log('Paywall height = ' + paywallHeight);	

	}
	
	$(document).ready(function() {
		updatePaywallHeight();
	});
	
	
	// PAYWALL 
	var paywall = {};

	app.event.on('updatePaywall', function (args) {
		var gotProducts = typeof(args.products) != "undefined" && args.products.length > 0;
		var wall = gotProducts ? $('#purchase-with-products-wall') : $('#login-or-signup-wall');
		var otherWall = !gotProducts ? $('#purchase-with-products-wall') : $('#login-or-signup-wall');
		var animDuration = args.animated ? 300 : 0;
		var fullName = args.user;
		var isLoggedIn = fullName || fullName=="" ? true : false;
		var activePaywallElement = isLoggedIn ? $('#paywall-logged-in') : $('#paywall-login');
		var paywallHeight = $('#paywallInner').height();
		var checkIfFullNameIsEmpty = fullName =="" ? fullName : " " + fullName;
				
		$('.paywall-tab').removeClass('open');
		activePaywallElement.addClass('open');

		var subscriberLink = $("a[id*='subscriber-link']");

		if(isLoggedIn) {
			$('.getSpidUserName').text(checkIfFullNameIsEmpty);
			subscriberLink.attr('intern', '#paywall-logged-in');
		} else {
			subscriberLink.attr('intern', '#paywall-login');
		}
		
		if(gotProducts) {
			$.each(args.products, function(i, p) {
				var productEl = $('[pid="'+p.productIdentifier+'"]');
				var productPriceEl = productEl.find('.paywall-product-price');
				productPriceEl.text(p.price + ',-');
			});
		}
		
		console.log('Updated paywall');		

	});
	
	console.log('Device height = ' + deviceHeight);

	if (deviceHeight <= 480) {
		console.log('Device height < 480px');
		$( "input" ).focus(function() {
			console.log('input is focus');	
			$('#paywall-login').addClass('focus');
		});
		$( "input" ).focusout(function() {
			console.log('input is out of focus');	
			$('#paywall-login').removeClass('focus');
		});
	} else {
		console.log('Device height > 480px');
	}

	
	


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
	
	$('.externalBrowser').click(function() {
	    var externalURL = $(this).attr('href');
		console.log('Open external browser = ' + externalURL);
		app.bridge.trigger('externalBrowser', {
			"url": externalURL
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
	                     
	$(".paywall-tab-trigger").bind('click', function(e){
	    var toShow = $(this).attr('intern');
	    console.log('open ' + toShow);
	    $(".paywall-tab.open").removeClass('open');
		$(".paywall-tab-trigger.open").removeClass('open');
	    $(toShow).addClass('open');
	    $(this).addClass('open');
		return false;
	});
	
	$(".active-tab").bind('click', function(e){
		var activeTab = $(this).attr('active-tab');
	    $(activeTab).addClass('open');
		return false;
	});
 
	return paywall;
});