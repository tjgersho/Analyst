(function(){

var app = angular.module('beamSolverTG');


app.directive('constraintModal', ['BeamModel', function(BeamModel){
return{
restrict: 'E',
templateUrl: 'modal/constraintmodal.html',
controller: function(BeamModel){

var self = this;
self.beam = BeamModel.beam;
	

	
self.submit = function(){
		
		var formOk = true;
		var conposX = $("#conposX");
		var contype = $("#contype");
		var prescdisp = $("#prescdisp");
		
		 var contypeval;
		var prescdispval = prescdisp.val();
		
		//console.log(contype.val()[0]);
		
            
             var translation = 0;
               if(contype.val()[0] === "A" || contype.val()[1] === "A"){
               translation = 1;
               }
               
              var rotation = 0;
               if(contype.val()[0] === "B" || contype.val()[1] === "B"){
               rotation = 1;
               }
            
            //console.log("Translation " + translation);
            
          //  console.log("Rotation " + rotation);
        
              if(translation && !(Math.abs(prescdispval)>0)){
        
               contypeval = 0;
               prescdispval = "NA"
               }
               
             if(rotation && !translation && !(Math.abs(prescdispval)>0)){
          
               contypeval = 1;
                prescdispval = "NA"
               }
              
              if(rotation && translation && !(Math.abs(prescdispval)>0)){
        
               contypeval = 2;
                prescdispval = "NA"
               } 
               
               if(translation && !rotation && (Math.abs(prescdispval)>0)){
   
               contypeval = 3;
               } 
               
              if(rotation && (Math.abs(prescdispval)>0)){
               
               contypeval = 4;
               }
               
           //  console.log("contype val " + contypeval);
	  // console.log(prescdispval);
                
                
                for(var i=0;i< self.beam.constraints.length; i++){
		    //    console.log(self.beam.constraints[i]);
		       
		        if(Number(conposX.val()) === Number(self.beam.constraints[i].xpos)){
		        formOk = false;
		        self.error1 = true;
		        }
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
		
		if(Number(conposX.val()) > EB || Number(conposX.val()) <  SB  ){
		         formOk = false;
		         self.error2 = true;
		         }
		
		if(formOk){
		
		
		//console.log('Next constraint ' + self.beam.constraints.length);
		if(typeof(self.beam.constraints.length) === 'undefined'){

			if( prescdispval === "NA"){
			self.beam.constraints= [{xpos: Number(conposX.val()), type: Number(contypeval), presd: prescdispval}];
			}else{
			self.beam.constraints= [{xpos: Number(conposX.val()), type: Number(contypeval), presd: Number(prescdispval)}];
			}
		}else{
			if( prescdispval === "NA"){
			self.beam.constraints[self.beam.constraints.length] = {xpos: Number(conposX.val()), type: Number(contypeval), presd: prescdispval };
			}else{
			self.beam.constraints[self.beam.constraints.length] = {xpos: Number(conposX.val()), type: Number(contypeval), presd: Number(prescdispval) };
			}
		}
		
		
		//console.log(self.beam);
		
		$('#Constraints').modal('toggle');
		conposX.val("");
		prescdisp.val("");
		
		self.error1 = false;
		self.error2 = false;
		self.beam.updated = 0;
		}
	};

},
controllerAs: 'constraintCtrl'
};
}]);

})();