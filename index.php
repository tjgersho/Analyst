<?php ?>
<!doctype html>
<html class="no-js" lang="" ng-app="analystjs">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="x-ua-compatible" content="ie=edge">
        <title></title>
        <meta name="description" content="">
        <meta name="viewport" content="width=device-width, initial-scale=1">

        <link rel="apple-touch-icon" href="apple-touch-icon.png">
        <!-- Place favicon.ico in the root directory -->

        <link rel="stylesheet" href="css/normalize.css">
        <link rel="stylesheet" href="css/main.css">
        <script src="js/vendor/modernizr-2.8.3.min.js"></script>

    
		<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/css/bootstrap.min.css" integrity="sha384-1q8mTJOASx8j1Au+a5WDVnPi2lkFfwwEAa8hDDdjZlpLegxhjVME1fgjWPGmkzs7" crossorigin="anonymous">

		<script   src="http://code.jquery.com/jquery-1.12.3.min.js"   integrity="sha256-aaODHAgvwQW1bFOGXMeX+pC4PZIPsvn2h1sArYOhgXQ="   crossorigin="anonymous"></script>
		<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js" integrity="sha384-0mSbJDEHialfmuBBQP6A4Qrprq5OVfW37PRR3j5ELqxss1yVqOtnepnHVP9aJ7xS" crossorigin="anonymous"></script>

		<script src="https://ajax.googleapis.com/ajax/libs/angularjs/1.4.9/angular.min.js"></script>
		
		
		
		<style>

		
		</style>
 
    </head>
    <body>
      
<div ng-controller="beamController as beamCtrl">

<section ng-controller="TabController as tab">

<nav class="navbar navbar-inverse">
  <div class="container-fluid">
    <div class="navbar-header">
       <button type="button" class="navbar-toggle" data-toggle="collapse" data-target="#myNavbar">
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>
        <span class="icon-bar"></span>                        
      </button>
      <img src="pmlogo.png" height="50" style="float:left;"/> <a class="navbar-brand" href="#">AnalystJS</a>   
    </div>
     <div class="collapse navbar-collapse" id="myNavbar">
      <ul class="nav navbar-nav">
           <li ng-class="{ active:tab.isSet(2) }"><a href="BeamSolverTG/">BeamSolverTG</a></li> 
           <!--<li ng-class="{ active:tab.isSet(3) }"><a href ng-click="tab.setTab(2)">Solver Validation </a></li> -->
      </ul> 
    </div>
  </div>
</nav>


	  
	  
	  
<div class="container">
  <div class="jumbotron">
    <h1>AnalystJS</h1> 
    <p>Where useful engineering analysis tools are being built.</p> 
  </div>
  <p>Check Out <a href="BeamSolverTG/">BeamSolverTG</a></p> 
</div>




	  <hr/>

<footer>

<div ng-controller="contactusController as contactusCtrl">
<div ng-include="'modal/contactusmodal.php'"></div>
<div ng-include="'modal/thanks.html'"></div>
</div>


   <div>
   
     <div class="footier">
      <div style="padding:5px; text-align:center;">
      </div>
    </div>


     <div class="footier">
     
      <p>Copyright &copy;  Paradigm Motion, LLC. All Rights Reserved. <br />
              Design by <a href="https://paradigmmotion.com/" target="_blank">Paradigm Motion, LLC</a></p>
       
  
     </div>
     
 
  <div class="footier">


   </div>

  </div>
</footer>  

        <script src="https://code.jquery.com/jquery-1.12.0.min.js"></script>
        <script>window.jQuery || document.write('<script src="js/vendor/jquery-1.12.0.min.js"><\/script>')</script>
        <script src="js/plugins.js"></script>
        <script src="js/main.js"></script>

        <!-- Google Analytics: change UA-XXXXX-X to be your site's ID. -->
       <!-- <script>
            (function(b,o,i,l,e,r){b.GoogleAnalyticsObject=l;b[l]||(b[l]=
            function(){(b[l].q=b[l].q||[]).push(arguments)});b[l].l=+new Date;
            e=o.createElement(i);r=o.getElementsByTagName(i)[0];
            e.src='https://www.google-analytics.com/analytics.js';
            r.parentNode.insertBefore(e,r)}(window,document,'script','ga'));
            ga('create','UA-XXXXX-X','auto');ga('send','pageview');
        </script> -->
    </body>
</html>
