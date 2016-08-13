(function(){

var app = angular.module('beamSolverTG');

app.directive('pointloadModal', ['BeamModel', function(BeamModel){
return{
restrict: 'E',
templateUrl: 'modal/pointloadmodal.html',
controller: function(BeamModel){

var self = this;
self.beam = BeamModel.beam;
	
self.submit = function(){
		
		var formOk = true;
		
		var posX = $("#pointloadposX");
		var load = $("#pointloadvalue");
		
		
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
		
			if(typeof(self.beam.forces.length) === 'undefined'){
			
			self.beam.forces  = [{xpos: Number(posX.val()), val: Number(load.val())}];
			}else{
			self.beam.forces[self.beam.forces.length] = {xpos: Number(posX.val()), val: Number(load.val())};
			
			}
			
			//console.log(self.beam);
			
			$('#PointLoads').modal('toggle');
			$("#pointloadposX").val('');
		         $("#pointloadvalue").val('');
				self.beam.updated = 0;
		}
	};

},
controllerAs: 'pointloadCtrl'
};
}]);

})();