define('paywall', ['main'], function (app) {
	"use strict";
	document.addEventListener("touchstart", function(){}, true);
	
	function updatePaywallHeight() {

		// see wich tab is highest
		var arr = [];
		$('.paywall-tab').each(function(){
			var thisOutherHeight = $(this).outerHeight();
			var thisMarginTop = thisOutherHeight / 2;
		    arr.push(thisOutherHeight);
		    $(this).css('margin-top',  -thisMarginTop);    
		});			

		$('#paywall-content').css('height', Math.max.apply( Math, arr ));

		// push paywall Total height 
		var paywallHeight = $('#paywallInner').height();
	    app.bridge.trigger('paywallLoaded', {
	        "height": paywallHeight
	    });
		console.log('paywall height = ' + paywallHeight);		
	}
	
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
	
	if( isMobile.Android() ){
		$('body').addClass('android');		
	};
	

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
		var isLoggedIn = fullName || fullName=="" ? true : false;
		var activePaywallElement = isLoggedIn ? $('#paywall-logged-in') : $('#paywall-login');
		var paywallHeight = $('#paywallInner').height();
		var checkIfFullNameIsEmpty = fullName =="" ? fullName : " " + fullName;
				
		$('.paywall-tab').removeClass('open');
		activePaywallElement.addClass('open');

		var loggedInLink = document.getElementById('paywall-tab-trigger-login');

		if(isLoggedIn) {
			$('.getSpidUserName').text(checkIfFullNameIsEmpty);
			loggedInLink.setAttribute('intern', '#paywall-logged-in');
		} else {
			loggedInLink.setAttribute('intern', '#paywall-login');
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
	
/*
	$('a.forgotPassword').bind('click', function(e) {
		var forgotPasswordUrl = $(this).attr('href');
		console.log('User wants password - forgotPassword ' + forgotPasswordUrl);
		app.bridge.trigger('forgotPassword', {
			"provider": "spid",
			"url": forgotPasswordUrl
		});
		return false;
	});
*/
	                     
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