(function(){

var app = angular.module('beamSolverTG');


app.directive('propertyModal', ['BeamModel', function(BeamModel){
return{
restrict: 'E',
templateUrl: 'modal/propertymodal.html',
controller: function(BeamModel){

var self = this;
self.beam = BeamModel.beam;
	
self.submit = function(){
		
		var formOk = true;
		var startX = $("#startX");
		var endX = $("#endX");
		var startI = $("#startI");
		var endI = $("#endI");
		var modulus = $("#modulus");
		
		//console.log(startX.val());
		//console.log(endX.val());
		
		if(Number(startX.val()) === Number(endX.val())){
		formOk = false;
		self.error2 = true;
		}
		
		if( Number(startX.val()) > Number(endX.val())){
		formOk = false;
		self.error4 = true;
		}
		
		if(endI.val() === ""){
		endI = startI;
		}
		
		
		//console.log(formOk);
		var SB;
                var EB;
               // console.log(self.beam.props.length);
                
                if(typeof(self.beam.props.length) !== 'undefined'){
	                EB =-99999999999;
	                SB = 99999999999;    
	
			for(var i=0;i< self.beam.props.length; i++){
			 
			        if(Number(self.beam.props[i].startx) < SB){
			        SB = Number(self.beam.props[i].startx);
			        }
			        if(Number(self.beam.props[i].endx) > EB){
			         EB = Number(self.beam.props[i].endx);
			        }
			}
			
			if(Number(startX.val()) < EB && Number(startX.val()) > SB || Number(endX.val()) >  SB && Number(endX.val()) <  EB ){
			formOk = false;
			self.error1 = true;
			}
			
			if(Number(startX.val()) > EB || Number(endX.val()) < SB){
			formOk = false;
			self.error3 = true;
			}
			
		}
		
		if(formOk){
		var next_prop = self.beam.props.length;
		
		//console.log('Next prop ' + next_prop);
		if(typeof(next_prop) === 'undefined'){
		
		self.beam.props = [{startx: Number(startX.val()), endx: Number(endX.val()), startI: Number(startI.val()), endI: Number(endI.val()), mod:  Number(modulus.val()) }];
		}else{
		self.beam.props[next_prop] = {startx: Number(startX.val()), endx: Number(endX.val()), startI: Number(startI.val()), endI: Number(endI.val()), mod:  Number(modulus.val()) };
		}
		
		
		//console.log(self.beam);
		
		$('#Properties').modal('toggle');
		
		startX.val(endX.val());
		endX.val("");
		startI.val("");
		endI.val("");
		self.error1 = false;
		self.error2 = false;
		self.error3  = false;
		self.beam.updated = 0;
		}
	};

},
controllerAs: 'propCtrl'
};
}]);

})();