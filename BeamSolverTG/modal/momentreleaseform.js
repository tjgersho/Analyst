(function(){

var app = angular.module('beamSolverTG');

app.directive('momentreleaseModal', ['BeamModel', function(BeamModel){
return{
restrict: 'E',
templateUrl: 'modal/momentreleasemodal.html',
controller: function(BeamModel){

var self = this;
self.beam = BeamModel.beam;
	
self.submit = function(){
		
		var formOk = true;
		
		var posX = $("#momrelposX");
		
		
			
		for(var i=0;i< self.beam.momentrels.length; i++){
		       		       
		        if(Number(posX.val()) === Number(self.beam.momentrels[i].xpos)){
		        formOk = false;
		        self.error2 = true;
		        }
		}
		
		var SB;
                var EB;
               
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
		
				
		if(formOk){
		
			if(typeof(self.beam.momentrels.length) === 'undefined'){
			
			self.beam.momentrels  = [{xpos: Number(posX.val())}];
			}else{
			self.beam.momentrels[self.beam.momentrels.length] = {xpos: Number(posX.val())};
			
			}
			
						
			$('#MomRels').modal('toggle');
			$("#momrelposX").val('');
		
				self.beam.updated = 0;
		}
	};

},
controllerAs: 'momrelCtrl'
};
}]);

})();