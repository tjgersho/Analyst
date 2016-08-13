(function(){

var app = angular.module('beamSolverTG');


app.directive('springModal', ['BeamModel', function(BeamModel){
return{
restrict: 'E',
templateUrl: 'modal/springmodal.html',
controller: function(BeamModel){

var self = this;
self.beam = BeamModel.beam;
	

	
self.submit = function(){
		
		var formOk = true;
		var sprposX = $("#sprposX");
		var sprtype = $("#sprtype");
		var springconst = $("#springstiffness");
		
		 var sprtypeval;
		
		
		//console.log(sprtype.val()[0]);
		//console.log(springconst.val());
            
       
             
               if(sprtype.val()[0] === "A"){
               sprtypeval = 0;
               }
               
               
                if(sprtype.val()[0] === "B"){
               sprtypeval = 1;
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
				
			
		}
		
		if(Number(sprposX.val()) > EB || Number(sprposX.val()) <  SB  ){
		         formOk = false;
		         self.error1 = true;
		         }
		
		if(formOk){
		
		
		//console.log('Next springs ' + self.beam.springs.length);
		if(typeof(self.beam.springs.length) === 'undefined'){

			
			self.beam.springs= [{xpos: Number(sprposX.val()), type: Number(sprtypeval),  k: Number(springconst.val())}];
			
		}else{
			
		
			self.beam.springs[self.beam.springs.length] = {xpos: Number(sprposX.val()), type: Number(sprtypeval), k: Number(springconst.val()) };
			
		}
		
		
		//console.log(self.beam);
		
		$('#Springs').modal('toggle');
		sprposX.val("");
		springconst.val("");
		
		self.error1 = false;
		self.beam.updated = 0;
		}
	};

},
controllerAs: 'springCtrl'
};
}]);

})();