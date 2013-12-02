<!DOCTYPE html>
<html>
<head>
	<meta http-equiv="content-type" content="text/html; charset=utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no, target-densitydpi=medium-dpi" >
	<meta name="apple-mobile-web-app-capable" content="yes" >
	<meta name="apple-mobile-web-app-status-bar-style" content="black" >
	<meta name="format-detection" content="telephone=no" >
	<title>Aftenposten integration</title>
	<link rel="stylesheet" type="text/css" href="vendor/aptoma/alf/alf.css">
	<link rel="stylesheet" type="text/css" href="paywall.css">
	<link rel="apple-touch-icon-precomposed" href="gfx/appicon.png"/>
	<style type="text/css">
		.event-frame {
			display: none;
		}
		body {
			background-color: #F7F7F7;
		}
		.banner-fullwidth .ad-iframe {
		    margin: 0;
		    padding: 0;
		    border: none;
		    width: 100%;
		    height: 100%;
		    overflow: hidden;
		    background: #e6e6e6 url('gfx/ap-big.png') no-repeat center;
		}
	</style>
</head>
<body>

<?php $android = strstr($_SERVER['HTTP_USER_AGENT'],'Android'); ?>
<div class="chrome" id="chrome">
	<div id="purchase-with-products-wall" class="paywall">
		<div id="paywallInner" class="paywall-inner clearfix">
			<nav id="paywallavigation">
				<div intern="#paywall-login" class="paywall-tab-trigger open">Allerede abonnent?</div>
				<div intern="#paywall-buy" class="paywall-tab-trigger">Bli abonnent</div>
				<a href="http://wp.agens.no/ivy/guide/" class="more-info-trigger round-button"><b>i</b></a>
			</nav>
			<div id="paywall-content">
			    <div id="paywall-login" class="paywall-tab open">
					<header class="paywallHeader">
		                <p>Har du kjøpt tilgang til Aftenposten Digital og har en SPiD-konto. Vennligst logg inn for å få tilgang.</p>
		        	</header>
					<form action="">
						<input type="text" name="username" value="snd.web2@gmail.com" placeholder="SPiD-brukernavn" autocomplete="off">
						<input type="password" name="password" value="paywall12" placeholder="SPiD-passord" autocomplete="off">
						<input type="submit" value=" › ">
					</form>
					<footer class="paywallFooter">
						<a href="http://wp.agens.no/ivy/guide/" class="spid-logo"></a>
						<a target="_blank" href="https://payment.schibsted.no/auth/forgotPassword?redirect=aftenposten.no" class="forgotPassword">Glemt passord?</a>
						<?php if( !$android ){ ?>
							<a href="#" class="paywall-restore icon">Gjenopprette kjøp</a>
						<?php } ?>					
					</footer>
			    </div>
			    <div id="paywall-forgot-password" class="paywall-tab">
					<header class="paywallHeader">
		                <p>Skriv inn din SPiD-brukernavn for å få tilsendt glemt SPiD-passord.</p>
		        	</header>
					<form action="">
						<input type="text" name="username" value="snd.web2@gmail.com" placeholder="SPiD-brukernavn" autocomplete="off">
						<input type="submit" value=" › ">
					</form>
					<footer class="paywallFooter">
						<a href="http://wp.agens.no/ivy/guide/" class="spid-logo"></a>
						
						<?php if( !$android ){ ?>
							<a href="#" class="paywall-restore icon">Gjenopprette kjøp</a>
						<?php } ?>
					</footer>
			    </div>
			    <div id="paywall-logged-in" class="paywall-tab">
					<header class="paywallHeader">
	                	<p>Hei <b><span class="getSpidUserName">Ukjent</span></b>, du er logget på med en SPiD-bruker uten tilgang. Vennligst logg ut og logg deg på med en bruker som har tilgang.</p>
	                	
						<p>På <b>ap.no/produkter</b> finner du en oversikt over tilgjengelige produktpakker og mulighet for utvidelse av abonnement for eksisterende kunder. <a href="https://kundesenter.aftenposten.no/" class="green"><b>Les mer ›</b></a></p>
		        	</header>
					<footer class="paywallFooter">
						<a href="#" class="paywall-logout icon">Logg ut Arild Langtind</a>
						<?php if( !$android ){ ?>
							<a href="#" class="paywall-restore icon">Gjenopprette kjøp</a>
						<?php } ?>
					</footer>
			    </div>
				<?php if( !$android ){ ?>

				    <div id="paywall-buy" class="paywall-tab">
						<header class="paywallHeader">
			                <div class="halfWidth">
				                <p><b>Kjøp abonnement hos Aftenposten</b><br>
		Som abonnent hos Aftenposten får du tilgang til alle våre digitale produkter, samt ubegrenset tilgang til aftenposten.no.</p>
								<a href="https://kundesenter.aftenposten.no/" class="button green-button"> <b>Les mer her</b></a>

			                </div>
			                <div class="halfWidth">
				                <p><b>Kjøp abonnement via App Store</b><br>
		Velger du å abonnere via iTunes, får du kun tilgang til denne appen. Ditt abonnement administrerer du via din Apple ID.</p>
					            <div intern="#paywall-products" class="button white-button paywall-tab-trigger">Kjøp tilgang nå</div>

			                </div>
			        	</header>
				    </div>
				    <div id="paywall-products" class="paywall-tab">
						<header class="paywallHeader">
							<div intern="#paywall-buy" class="green paywall-tab-trigger go-back-button round-button">‹</div>
			                <p>Kjøp abonnement på appen via iTunes</p>
			        	</header>
				        <a href="#buyweekly" class="paywall-buy-product" pid="com.ivyengine.aftenpostenweekly">
				            <div class="button green-button">Kjøp <span class="paywall-product-title">en uke</<span> for <span class="paywall-product-price">35:-</span>*</div>
				        </a>
				        <a href="#buymonthly" class="paywall-buy-product" pid="com.ivyengine.aftenpostenmonthly">
				            <div class="button green-button">Kjøp <span class="paywall-product-title">en måned</<span> for <span class="paywall-product-price">98:-</span>*</div>
				        </a>
						<footer class="paywallFooter">		
							<a href="#" class="paywall-restore icon">Gjenopprette kjøp</a>
							<p><small>*Du administrerer ditt abonnement via din iTunes konto.</small></p>
						</footer>
				    </div>
				<?php } else { ?>
					<div id="paywall-buy" class="paywall-tab">
						<header class="paywallHeader">
			                <p>Kjøp abonnement på appen via SPiD</p>
			        	</header>
				        <a href="#buyweekly" class="paywall-buy-product" pid="com.ivyengine.aftenpostenweekly">
				            <div class="button green-button">Kjøp <span class="paywall-product-title">en uke</<span> for <span class="paywall-product-price">35:-</span>*</div>
				        </a>
				        <a href="#buymonthly" class="paywall-buy-product" pid="com.ivyengine.aftenpostenmonthly">
				            <div class="button green-button">Kjøp <span class="paywall-product-title">en måned</<span> for <span class="paywall-product-price">98:-</span>*</div>
				        </a>
						<footer class="paywallFooter">		
							<p><small>*Du administrerer ditt abonnement via din SPiD-konto.</small></p>
						</footer>
				    </div>
				<?php } ?>						

		    </div>
		    <div class="clear"></div>
		</div>
	</div>
</div>

<iframe width="0" height="0" frameborder="0" class="event-frame"></iframe>
<iframe width="0" height="0" frameborder="0" class="event-frame"></iframe>
<iframe width="0" height="0" frameborder="0" class="event-frame"></iframe>
<iframe width="0" height="0" frameborder="0" class="event-frame"></iframe>

<script type="text/javascript" src="vendor/aptoma/alf/alf.min.js"></script>
<script type="text/javascript" src="js/widget/disqus.js"></script>
<script type="text/javascript" src="js/widget/banner.js"></script>
<script type="text/javascript" src="js/main.js"></script>
<script type="text/javascript" src="js/paywall.js"></script>
<script type="text/javascript">
require(['main', 'paywall'], function(app, paywall){
  "use strict";
  //runs main(app) just by referencing it
});

</script>
</body>
</html>
