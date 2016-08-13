(function(){

var app = angular.module('beamSolverTG');

app.directive('momentModal', ['BeamModel', function(BeamModel){
return{
restrict: 'E',
templateUrl: 'modal/momentmodal.html',
controller: function(BeamModel){

var self = this;
self.beam = BeamModel.beam;
	
self.submit = function(){
		
		var formOk = true;
		
		var posX = $("#momentposX");
		var moment = $("#momentvalue");
		
		
		//console.log(posX.val());
		//console.log(load.val());
		
	
		var SB;
                var EB;
                //console.log('Forces Length ' + self.beam.forces.length);
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
		
		
		if(Number(posX.val()) > EB || Number(posX.val()) <  SB  ){
		formOk = false;
			self.error1 = true;
		}
		
		// console.log('Form Ok ' + formOk);
		
		if(formOk){
		
			if(typeof(self.beam.moments.length) === 'undefined'){
			
			self.beam.moments  = [{xpos: Number(posX.val()), val: Number(moment.val())}];
			}else{
			self.beam.moments[self.beam.moments.length] = {xpos: Number(posX.val()), val: Number(moment.val())};
			
			}
			
			//console.log(self.beam);
			
			$('#Moments').modal('toggle');
			$("#momentposX").val('');
		         $("#momentvalue").val('');
				self.beam.updated = 0;
		}
	};

},
controllerAs: 'momentCtrl'
};
}]);

})();