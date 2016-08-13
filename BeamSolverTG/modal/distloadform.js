(function(){

var app = angular.module('beamSolverTG');


app.directive('distloadModal', ['BeamModel', function(BeamModel){
return{
restrict: 'E',
templateUrl: 'modal/distloadmodal.html',
controller: function(BeamModel){

var self = this;
self.beam = BeamModel.beam;
	
self.submit = function(){
		
		var formOk = true;
		
		var startX = $("#distloadstartX");
		var endX = $("#distloadendX");
		var startQ = $("#startQ");
		var endQ = $("#endQ");
		
		
		
		//console.log(startX.val());
		//console.log(endX.val());
		
		if(Number(startX.val()) === Number(endX.val())){
		formOk = false;
		self.error1 = true;
		}
		
		if(Number(startX.val()) > Number(endX.val())){
		formOk = false;
		self.error3 = true;
		}
		
		//console.log(formOk);
		var SB;
                var EB;
                //console.log(self.beam.props.length);
                
                if(typeof(self.beam.props.length) !== 'undefined'){
	                EB =-99999999999;
	                SB = 99999999999;    
	
			for(var i=0;i< self.beam.props.length; i++){
			      //  console.log(self.beam.props[i]);
			        if(Number(self.beam.props[i].startx) < SB){
			        SB = Number(self.beam.props[i].startx);
			        }
			        if(Number(self.beam.props[i].endx) > EB){
			         EB = Number(self.beam.props[i].endx);
			        }
			}
			
		
			if(Number(startX.val()) > EB || Number(startX.val()) < SB){
			formOk = false;
			self.error2 = true;
			}
			
			if(Number(endX.val()) > EB || Number(endX.val()) < SB){
			formOk = false;
			self.error2 = true;
			}
			
						
		}
		
		if(formOk){
		var next_distribload = self.beam.distribloads.length;
		
		//console.log('Next prop ' + next_distribload);
		if(typeof(next_distribload) === 'undefined'){
		
		self.beam.distribloads = [{startx: Number(startX.val()), endx: Number(endX.val()), startq: Number(startQ.val()), endq: Number(endQ.val()) }];
		}else{
		self.beam.distribloads[next_distribload] = {startx: Number(startX.val()), endx: Number(endX.val()), startq: Number(startQ.val()), endq: Number(endQ.val()) };
		}
		
		
		//console.log(self.beam);
		
		$('#DistLoads').modal('toggle');
		startX.val("");
		endX.val("");
		startQ.val("");
		endQ.val("");
		self.error1 = false;
		self.error2 = false;
		self.error3 = false;
		self.beam.updated = 0;
		}
	};

},
controllerAs: 'distloadCtrl'
};
}]);

})();