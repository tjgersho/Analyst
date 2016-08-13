(function(){

var app = angular.module('beamSolverTG');

app.directive('saveModal', ['BeamModel', 'SavedFiles', '$http', function(BeamModel, SavedFiles, $http){
return{
restrict: 'E',
templateUrl: 'modal/savemodal.php',
controller: function(BeamModel, SavedFiles, $http){
var blankfolder;
var self = this;
self.beam = BeamModel.beam;

if(typeof(SavedFiles.savedfiles) !== 'object'){
self.saved = {};
blankfolder = 1;
}else{
self.saved = SavedFiles.savedfiles;
blankfolder = 0;
}


self.open = function(iter){

self.beam.props = {};
self.beam.forces= {};
  self.beam.moments={};
  self.beam.constraints={};
  self.beam.springs={};
  self.beam.momentrels={};
  self.beam.distribloads={};
  self.beam.qlocs={};
   self.beam.NN={};   /////FEM STUFF/////
   self.beam.NE={};
   self.beam.NM={};
   self.beam.NDIM={};
   self.beam.NEN={};
   self.beam.NDN={};
   self.beam.ND={};
   self.beam.NL={};
   self.beam.NMORE={};
   self.beam.NSPR={};
   self.beam.nodes={};
   self.beam.elements={};
   self.beam.condof={};
   self.beam.conval={};
   self.beam.loaddof={};
   self.beam.loadval={};
   self.beam.mat={};
   self.beam.momrefem={};
   self.beam.springfem={};    
   self.beam.displacement={};  //////////Results/////////////
   self.beam.rotation={};
   self.beam.shear={};
   self.beam.moment={};
   self.beam.reactions={};
   self.beam.rspringForces={};
   self.beam.reactionqlocs={};
 self.beam.solved = 0;
 self.beam.fbdtable = {};
   self.beam.updated = 1;


self.beam.props = self.saved.files[iter].data.props;
  self.beam.forces= self.saved.files[iter].data.forces;
  self.beam.moments= self.saved.files[iter].data.moments;
  self.beam.constraints= self.saved.files[iter].data.constraints;
  self.beam.springs= self.saved.files[iter].data.springs;
  self.beam.momentrels= self.saved.files[iter].data.momentrels;
  self.beam.distribloads= self.saved.files[iter].data.distribloads;
  self.beam.qlocs= self.saved.files[iter].data.qlocs;
   self.beam.NN={};   /////FEM STUFF/////
   self.beam.NE={};
   self.beam.NM={};
   self.beam.NDIM={};
   self.beam.NEN={};
   self.beam.NDN={};
   self.beam.ND={};
   self.beam.NL={};
   self.beam.NMORE={};
   self.beam.NSPR={};
   self.beam.nodes={};
   self.beam.elements={};
   self.beam.condof={};
   self.beam.conval={};
   self.beam.loaddof={};
   self.beam.loadval={};
   self.beam.mat={};
   self.beam.momrefem={};
   self.beam.springfem={};    
   self.beam.displacement={};  //////////Results/////////////
   self.beam.rotation={};
   self.beam.shear={};
   self.beam.moment={};
   self.beam.reactions={};
   self.beam.rspringForces={};
   self.beam.reactionqlocs={};
 self.beam.solved = 0;
 self.beam.fbdtable = {};
   self.beam.updated = 0;


$("#SaveFile").modal('toggle');


};

self.delete = function(iter){

var delfilename =  self.saved.files[iter].name;
$http.post('deletefile.php', 
       {filename:  delfilename     
       }).
  success(function(data, status, headers, config) {
  });


  self.saved.files.splice(iter,1);
  

};

	
self.submit = function(){
		
		var formOk = true;
		
		var savefilename = $('#newfilename').val();
		
		
  var beamdata = {};
  beamdata.props = self.beam.props;
  beamdata.forces = self.beam.forces;
  beamdata.moments = self.beam.moments;
  beamdata.constraints = self.beam.constraints;
  beamdata.springs = self.beam.springs;
  beamdata.momentrels =self.beam.momentrels;
  beamdata.distribloads = self.beam.distribloads;
  beamdata.qlocs = self.beam.qlocs;
  

		
		 $http.post('savefile.php', 
       {filename:  savefilename,
       beamdat: beamdata     
       }).
  success(function(data, status, headers, config) {
  
    if(data.eRRor === '123'){
       self.error1 = true;
    
    }else{ //Success!!!
      self.error1 = false;
      
     $("#SaveFile").modal('toggle');
     
  
      if(blankfolder){
       
      self.saved.files = [{name: savefilename, data: beamdata}];
      blankfolder = 0;
        }else{
       self.saved.files[self.saved.files.length] = {name: savefilename, data: beamdata};
      
       }
      
 
    $('#newfilename').val('');   
     
      }
  
  });

    
			
			
				
	};
	

},
controllerAs: 'saveCtrl'
};
}]);

})();