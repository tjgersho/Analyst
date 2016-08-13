(function(){

var app = angular.module('beamSolverTG');


app.controller('contactusController', ['$http', function($http){
var self = this;
 self.error1 = false;
 
self.ctus_submit = function(){

var fname = $("#firstname").val();
var lname = $("#lastname").val();
var eMail = $("#email").val();
var coMment = $("#comment").val();
var cAptcha = $("#letters_code").val();


$http.post('contactus.php', 
       {firstname: fname,
       lastname: lname,
       email: eMail,
       comment: coMment,
       captcha: cAptcha       
       }).
  success(function(data, status, headers, config) {
 
 //alert(data);
 //  var arr = jQuery.parseJSON(data);
 // alert(data.errormsg);
 
      if(data.eRRor === '123'){
       self.error1 = data.errormsg;
    
    }else{ //Success!!!
      self.error1 = false;
      
      $('#contactUs').modal('toggle');
     $('#contactUsthanks').modal('toggle');
      
      
    }
      
      
     


  });




 };
 
}]);

})();