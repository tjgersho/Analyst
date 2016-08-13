(function(){

var app = angular.module('beamSolverTG');

app.directive('qlocModal', ['BeamModel', function(BeamModel){
return{
restrict: 'E',
templateUrl: 'modal/qlocmodal.html',
controller: function(BeamModel){

var self = this;
self.beam = BeamModel.beam;
	
self.submit = function(){
		
		var formOk = true;
		
		var posX = $("#qlocposX");
		
		
		//console.log(posX.val());
		// console.log('query locations Length ' + self.beam.qlocs.length);
		
		for(var i=0;i< self.beam.qlocs.length; i++){
		       
		       
		        if(Number(posX.val()) === Number(self.beam.qlocs[i].xpos)){
		        formOk = false;
		        self.error2 = true;
		        self.error1 = false;
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
		
		// console.log('Form Ok ' + formOk);
		
		if(formOk){
		
			if(typeof(self.beam.qlocs.length) === 'undefined'){
			
			self.beam.qlocs  = [{xpos: Number(posX.val())}];
			}else{
			self.beam.qlocs[self.beam.qlocs.length] = {xpos: Number(posX.val())};
			
			}
			
			//console.log(self.beam);
			
			
			$("#qlocposX").val('');
		self.beam.updated = 0;
				
		}
	};

},
controllerAs: 'qlocCtrl'
};
}]);

})();