(function(){


function convertx(cw, sb, eb, x){
var m;
var b;

m = cw*(0.9)/(eb-sb);
b = (0.05*cw)-m*sb;

return  (m*x+b);
}

function converty(ch, tn, ln, y){
var m;
var b;
m = ch*(0.8)/(ln-tn);
b = (0.1*ch)-m*tn;
return  (m*y+b);
}

var app = angular.module('beamSolverTG', []);

 //app.config(['$routeProvider', '$compileProvider', '$locationProvider',  function($routeProvider, $compileProvider, $locationProvider) {
//    $routeProvider.when('/', {
  //  });
  //  $routeProvider.otherwise({
   //   redirectTo: '/'
  //  });
    
 //app.compileProvider = $compileProvider;
  
 // $locationProvider.hashPrefix('!');
 // }]);
  
  




app.controller('TabController', [function() {
    this.tab = 1;

    this.isSet = function(checkTab) {
      return this.tab === checkTab;
    };

    this.setTab = function(setTab) {
      this.tab = setTab;
    };
  }]);
  
app.service('BeamModel',[function(){

var beamObj = {
props : [{startx: 0,    endx: 20,   startI: 1,    endI: 1,    mod: 30000000  }],
//props : {},
forces: {},
 // forces: [{xpos: 10, val:10}],
  moments: {},
  constraints: {},
 // constraints: [{xpos: 0, type: 2, presd: "NA"}],
  springs: {},
  momentrels: {},
  distribloads: {},
  qlocs: {},
   NN: 0,   /////FEM STUFF/////
   NE: 0,
   NM: 0,
   NDIM: 0,
   NEN: 0,
   NDN: 0,
   ND: 0,
   NL: 0,
   NMORE: 0,
   NSPR: 0,
   nodes: {},
   elements: {},
   condof: {},
   conval: {},
   loaddof:{},
   loadval:{},
   momredof: {},
   springdof:{},     
   springval:{},
   displacement: {},  //////////Results/////////////
   rotation: {},
   shear: {},
   moment: {},
   rspring: {},
   fbdtable:{},
   solved: 0,
   updated: 1
   };
 
 
 
 this.beam = beamObj;
}]);


app.service('SavedFiles',['$http', function($http){
var self = this;
var savedfiles = {};
$http.get('getfiles.php').
  success(function(data, status, headers, config) {
    // this callback will be called asynchronously
    // when the response is available
    
    
        //console.log(data);
     self.savedfiles = data;
  // self.getdata=data;
     }).
  error(function(data, status, headers, config) {
    // called asynchronously if an error occurs
    // or server returns response with an error status.
  });
 
// savedfiles = self.getdata;
 
 

 
}]);



app.controller('beamController', ['$scope', '$window', 'BeamModel', function($scope, $window, BeamModel) {
var self = this;
    self.beam = BeamModel.beam;
  

   
self.drawcanvas = function(){


self.wndwidth = $window.innerWidth;

	
	var canvas =   document.getElementById("beamCanvas");
	var beamcanvascontainer =   document.getElementById("beamCanvasContainer");
	
	if(self.wndwidth>1000){
	canvas.width = 800;
	beamcanvascontainer.style.width='800px';
		
	 
	}else{
	canvas.width = self.wndwidth*0.85;
	  
     	beamcanvascontainer.style.width=self.wndwidth*0.85+'px';
	
	
	}
	
	
	var ctx =  canvas.getContext("2d");
	ctx.clearRect(0, 0, canvas.width, canvas.height); //clear canvas
	
	//console.log('type: ' + typeof(self.beam.props[0]));
	
if(typeof(self.beam.props) !== 'undefined'){	
	if(typeof(self.beam.props[0]) !== 'undefined'){ // Draw beam if there is at least one property.
	
	//ctx.font = "15px Arial";  //write start of the beam
	//ctx.fillText('Num Props: '+self.beam.props.length,10,30);
	
	      ctx.beginPath();
           ctx.strokeStyle="black";
	ctx.lineWidth=5;
	ctx.moveTo(canvas.width*0.05,100);
        ctx.lineTo(canvas.width*0.95,100);
         ctx.stroke();
         
      
         
         //find start and end of beam ///
         var SB;
         var EB;
        
    EB =-99999999999;
    SB = 99999999999;    
    for(var i=0;i<self.beam.props.length; i++){
    
  
        //console.log(self.beam.props[i]);
        if(Number(self.beam.props[i].startx) < SB){
        SB = Number(self.beam.props[i].startx);
        }
        if(Number(self.beam.props[i].endx) > EB){
         EB = Number(self.beam.props[i].endx);
        }
       
    }
    
    
    
    ctx.font = "12px Arial";  //write start of the beam
	ctx.fillText(SB,10,80);
       
          ctx.font = "12px Arial";  //write end of the beam
	ctx.fillText(EB,canvas.width-30,80,30);
       
////////////////////Draw all the moment releases //////////////////////
    if(typeof(self.beam.momentrels.length) !== 'undefined'){
      for (var i=0; i<self.beam.momentrels.length; i++){
         //console.log('i = ' + i + ' and the momrel pos ' + Number(self.beam.momentrels[i].xpos));
          ctx.beginPath();
         
          centerx = convertx(canvas.width,SB, EB, Number(self.beam.momentrels[i].xpos));
          centery = converty(canvas.height, 10,-10, 0);
                      
          ctx.arc(centerx,centery,4,0,2*Math.PI);
        
          ctx.fillStyle = 'white';
          ctx.fill();
          ctx.lineWidth=2;
          ctx.beginPath();
          ctx.arc(centerx,centery,4,0,2*Math.PI);
          ctx.stroke();
          }
        }
        
////////////////////Draw all the Point Loads  //////////////////////
    if(typeof(self.beam.forces.length) !== 'undefined'){
      
      //////////scaled arrows from load vals ///////////
      var maxAbsPload = -999999999;
         for (var i=0; i<self.beam.forces.length; i++){
          if(Math.abs(Number(self.beam.forces[i].val))> maxAbsPload){
          maxAbsPload = Math.abs(Number(self.beam.forces[i].val));
           }
         }
      for (var i=0; i<self.beam.forces.length; i++){
       // console.log('i = ' + i + ' and the forces pos ' + Number(self.beam.forces[i].xpos) + ' and the forces val ' + Number(self.beam.forces[i].val));
          
          ctx.beginPath();
          
          tailx = convertx(canvas.width,SB, EB, Number(self.beam.forces[i].xpos));
          taily = converty(canvas.height, maxAbsPload,-maxAbsPload,  0);
          
          headx = tailx;
          heady = converty(canvas.height, maxAbsPload,-maxAbsPload, Number(self.beam.forces[i].val)*0.8);
                      
         ctx.lineWidth=1;
	ctx.moveTo(headx,heady);
        ctx.lineTo(tailx,taily);
        ctx.strokeStyle="blue";
         ctx.stroke();
         
         
           arrow1x =  headx;
          arrow1y = heady;
          
          arrow2x = headx+5;
          if(Number(self.beam.forces[i].val)<0){
          arrow2y = heady-8;
          }else{
           arrow2y =heady+8;
          }
          
          ctx.beginPath();
         ctx.lineWidth=1;
	ctx.moveTo(arrow1x, arrow1y);
        ctx.lineTo( arrow2x,arrow2y );
        ctx.strokeStyle="blue";
         ctx.stroke();
      
          
          arrow2x = headx-5;
          if(Number(self.beam.forces[i].val)<0){
          arrow2y = heady-8;
          }else{
           arrow2y =heady+8;
          }
          
          ctx.beginPath();
         ctx.lineWidth=1;
	ctx.moveTo(arrow1x, arrow1y);
        ctx.lineTo( arrow2x,arrow2y );
        ctx.strokeStyle="blue";
         ctx.stroke();
        
     
         
          }
        }        
        
////////////////////Draw all the moments //////////////////////
    if(typeof(self.beam.moments.length) !== 'undefined'){
      for (var i=0; i<self.beam.moments.length; i++){
        // console.log('i = ' + i + ' and the mom pos ' + Number(self.beam.moments[i].xpos));
                 
          centerx = convertx(canvas.width,SB, EB, Number(self.beam.moments[i].xpos));
          centery = 100;
                      
                 
         
          ctx.beginPath();
           ctx.lineWidth=1.5;
          ctx.arc(centerx,centery,20,Math.PI/3, 5*Math.PI/3);
          ctx.strokeStyle="green";
          ctx.stroke();
          
          var momentxpoint1 = centerx + 20*Math.cos(Math.PI/3);
              
          var momentxpoint2 =  momentxpoint1-5;
          
          if(Number(self.beam.moments[i].val)<0){
          
         momentypoint1 = 100 - 20*Math.sin(Math.PI/3);
          momentypoint2 = 100 - 20*Math.sin(Math.PI/3)-8;
         
          }else{
          
          
          momentypoint1 = 100 + 20*Math.sin(Math.PI/3);
          momentypoint2 = 100 + 20*Math.sin(Math.PI/3)+8;
          
          }

          ctx.beginPath();
           ctx.lineWidth=1.5;
  	   ctx.moveTo(momentxpoint1,  momentypoint1);
           ctx.lineTo( momentxpoint2, momentypoint2 );
           ctx.strokeStyle="green";
           ctx.stroke();
          
          
          
          
          }
        }
        
   
////////////////////Draw all the constraints//////////////////////
    if(typeof(self.beam.constraints.length) !== 'undefined'){
      
   
      for (var i=0; i<self.beam.constraints.length; i++){
       // console.log('i = ' + i + ' and the constraint pos ' + Number(self.beam.constraints[i].xpos) + ' and the type ' + Number(self.beam.constraints[i].type));
          
          
          
          if(self.beam.constraints[i].type === 0){
          
          
          tpointx = convertx(canvas.width,SB, EB, Number(self.beam.constraints[i].xpos));
          tpointy = converty(canvas.height, 1,-1,  0);
                               
        ctx.beginPath();
	 ctx.fillStyle="orange";
         ctx.moveTo( tpointx,  tpointy);
         ctx.lineTo(tpointx+7,  tpointy+15);
          ctx.lineTo(tpointx-7, tpointy+15);
          ctx.fill();
         }
         
         
         if(self.beam.constraints[i].type === 1){
         
          
          tpointx = convertx(canvas.width,SB, EB, Number(self.beam.constraints[i].xpos));
          tpointy = converty(canvas.height,1,-1,  0);
                               
        
	 ctx.beginPath();
          ctx.moveTo( tpointx,  tpointy-5);
          ctx.lineTo(tpointx,  tpointy+20);
           ctx.lineWidth=1.5;
           ctx.strokeStyle="orange";
          ctx.stroke();
          
          ctx.beginPath();
	 ctx.arc(tpointx-4,tpointy+18,4,0,2*Math.PI);
	  ctx.lineWidth=1.5;
           ctx.strokeStyle="orange";
	 ctx.stroke();
          
            ctx.beginPath();
	 ctx.arc(tpointx-4,tpointy+9,4,0,2*Math.PI);
	  ctx.lineWidth=1.5;
           ctx.strokeStyle="orange";
	 ctx.stroke();
         
         
         }
         
         
                if(self.beam.constraints[i].type === 2){
         
          
          tpointx = convertx(canvas.width,SB, EB, Number(self.beam.constraints[i].xpos));
          tpointy = converty(canvas.height, 1,-1,  0);
                               
        
	 ctx.beginPath();
          ctx.moveTo( tpointx,  tpointy-5);
          ctx.lineTo(tpointx,  tpointy+20);
           ctx.lineWidth=1.5;
           ctx.strokeStyle="orange";
          ctx.stroke();
          
           ctx.moveTo( tpointx,  tpointy+10);
          ctx.lineTo(tpointx-7,  tpointy+12);
           ctx.lineWidth=1.5;
           ctx.stroke();
          
             ctx.moveTo( tpointx,  tpointy+15);
          ctx.lineTo(tpointx-7,  tpointy+17);
           ctx.lineWidth=1.5;
            ctx.strokeStyle="orange";
           ctx.stroke();
           
             ctx.moveTo( tpointx,  tpointy+20);
          ctx.lineTo(tpointx-7,  tpointy+22);
           ctx.lineWidth=1.5;
            ctx.strokeStyle="orange";
           ctx.stroke();
         
         
         }
         
         
         
         
          if(self.beam.constraints[i].type === 3){
          
         if(self.beam.constraints[i].presd > 0){
          tpointx = convertx(canvas.width,SB, EB, Number(self.beam.constraints[i].xpos));
          tpointy = converty(canvas.height,1,-1,  0);
                               
         ctx.beginPath();
	 ctx.fillStyle="orange";
         ctx.moveTo( tpointx,  tpointy);
         ctx.lineTo(tpointx+7,  tpointy+15);
          ctx.lineTo(tpointx-7, tpointy+15);
          ctx.fill();
         
         
          ctx.beginPath();
          ctx.moveTo( tpointx,  tpointy);
          ctx.lineTo(tpointx,  tpointy-10);
           ctx.lineWidth=1.5;
           ctx.strokeStyle="orange";
          ctx.stroke();
          
            ctx.beginPath();
          ctx.moveTo( tpointx-5,  tpointy-10);
          ctx.lineTo(tpointx+5,  tpointy-10);
           ctx.lineWidth=2.5;
           ctx.strokeStyle="orange";
          ctx.stroke();
          
          }else{
          
           tpointx = convertx(canvas.width,SB, EB, Number(self.beam.constraints[i].xpos));
          tpointy = converty(canvas.height,1,-1,  0);
                               
         ctx.beginPath();
	 ctx.fillStyle="orange";
         ctx.moveTo( tpointx,  tpointy);
         ctx.lineTo(tpointx+7,  tpointy-15);
          ctx.lineTo(tpointx-7, tpointy-15);
          ctx.fill();
         
         
          ctx.beginPath();
          ctx.moveTo( tpointx,  tpointy);
          ctx.lineTo(tpointx,  tpointy+10);
           ctx.lineWidth=1.5;
           ctx.strokeStyle="orange";
          ctx.stroke();
          
            ctx.beginPath();
          ctx.moveTo( tpointx-5,  tpointy+10);
          ctx.lineTo(tpointx+5,  tpointy+10);
           ctx.lineWidth=2.5;
           ctx.strokeStyle="orange";
          ctx.stroke();
          
          }
         
         }
         
         
              if(self.beam.constraints[i].type === 4){
          
         if(self.beam.constraints[i].presd > 0){
         tpointx = convertx(canvas.width,SB, EB, Number(self.beam.constraints[i].xpos));
          tpointy = converty(canvas.height,1,-1,  0);
                               
        
	 ctx.beginPath();
          ctx.moveTo( tpointx,  tpointy-10);
          ctx.lineTo(tpointx,  tpointy+20);
           ctx.lineWidth=1.5;
           ctx.strokeStyle="orange";
          ctx.stroke();
          
           ctx.moveTo( tpointx,  tpointy+10);
          ctx.lineTo(tpointx-7,  tpointy+12);
           ctx.lineWidth=1.5;
           ctx.stroke();
          
             ctx.moveTo( tpointx,  tpointy+15);
          ctx.lineTo(tpointx-7,  tpointy+17);
           ctx.lineWidth=1.5;
            ctx.strokeStyle="orange";
           ctx.stroke();
           
             ctx.moveTo( tpointx,  tpointy+20);
          ctx.lineTo(tpointx-7,  tpointy+22);
           ctx.lineWidth=1.5;
            ctx.strokeStyle="orange";
           ctx.stroke();
         

          
            ctx.beginPath();
          ctx.moveTo( tpointx-5,  tpointy-10);
          ctx.lineTo(tpointx+5,  tpointy-10);
           ctx.lineWidth=2.5;
           ctx.strokeStyle="orange";
          ctx.stroke();
          
          }else{
          
          tpointx = convertx(canvas.width,SB, EB, Number(self.beam.constraints[i].xpos));
          tpointy = converty(canvas.height,1,-1,  0);
                               
        
	 ctx.beginPath();
          ctx.moveTo( tpointx,  tpointy+10);
          ctx.lineTo(tpointx,  tpointy-20);
           ctx.lineWidth=1.5;
           ctx.strokeStyle="orange";
          ctx.stroke();
          
           ctx.moveTo( tpointx,  tpointy-10);
          ctx.lineTo(tpointx-7,  tpointy-12);
           ctx.lineWidth=1.5;
           ctx.stroke();
          
             ctx.moveTo( tpointx,  tpointy-15);
          ctx.lineTo(tpointx-7,  tpointy-17);
           ctx.lineWidth=1.5;
            ctx.strokeStyle="orange";
           ctx.stroke();
           
             ctx.moveTo( tpointx,  tpointy-20);
          ctx.lineTo(tpointx-7,  tpointy-22);
           ctx.lineWidth=1.5;
            ctx.strokeStyle="orange";
           ctx.stroke();
         

          
            ctx.beginPath();
          ctx.moveTo( tpointx-5,  tpointy+10);
          ctx.lineTo(tpointx+5,  tpointy+10);
           ctx.lineWidth=2.5;
           ctx.strokeStyle="orange";
          ctx.stroke();
          
          }
         
         }
                 
     
         
          }
        }        
        
        
       
       ////////////////////Draw all the constraints//////////////////////
    if(typeof(self.beam.springs.length) !== 'undefined'){
      
   
      for (var i=0; i<self.beam.springs.length; i++){
        //console.log('i = ' + i + ' and the constraint pos ' + Number(self.beam.constraints[i].xpos) + ' and the type ' + Number(self.beam.constraints[i].type));
          
          
          
          if(self.beam.springs[i].type === 0){
          
          
          tpointx = convertx(canvas.width,SB, EB, Number(self.beam.springs[i].xpos));
          tpointy = converty(canvas.height,1,-1,  0);
                               
         ctx.beginPath();
	 ctx.fillStyle="orange";
         ctx.moveTo( tpointx,  tpointy);
         ctx.lineTo(tpointx,  tpointy+5);
          ctx.lineTo(tpointx-5, tpointy+7);
          ctx.lineTo(tpointx+5, tpointy+11);
          ctx.lineTo(tpointx-5, tpointy+15);
           ctx.lineTo(tpointx, tpointy+17);
           ctx.lineTo(tpointx, tpointy+20);
            ctx.lineWidth=1.5;
           ctx.strokeStyle="purple";
          ctx.stroke();
          
           ctx.beginPath();
          ctx.moveTo( tpointx-7,  tpointy+20);
          ctx.lineTo(tpointx+7,  tpointy+20);
           ctx.lineWidth=2.5;
           ctx.strokeStyle="purple";
          ctx.stroke();
          
         }
         
         
         if(self.beam.springs[i].type === 1){
         
          
          tpointx = convertx(canvas.width,SB, EB, Number(self.beam.springs[i].xpos));
          tpointy = converty(canvas.height,1,-1,  0);
                               
         ctx.beginPath();
	 ctx.fillStyle="orange";
         ctx.moveTo( tpointx,  tpointy-5);
       
           ctx.lineTo(tpointx, tpointy+5);

ctx.lineTo(3.4+tpointx,	5.3+tpointy);
ctx.lineTo(5.8+tpointx,	3.2+tpointy);
ctx.lineTo(7.0+tpointx,	tpointy);
ctx.lineTo(6.5+tpointx,	-3.5+tpointy);
ctx.lineTo(4.2+tpointx,	-6.5+tpointy);
ctx.lineTo(0.6+tpointx,	-8.1+tpointy);
ctx.lineTo(-3.6+tpointx,	-7.8+tpointy);
ctx.lineTo(-7.2+tpointx,	-5.4+tpointy);
ctx.lineTo(-9.4+tpointx,	-1.3+tpointy);
ctx.lineTo(-9.3+tpointx,	3.5+tpointy);
ctx.lineTo(-6.8+tpointx,	7.9+tpointy);
ctx.lineTo(-2.3+tpointx,	10.7+tpointy);
ctx.lineTo(tpointx,11+tpointy);
ctx.lineTo(tpointx, 15+tpointy);


ctx.lineWidth=1.5;
ctx.strokeStyle="purple";


           
           
          ctx.stroke();
          
           
         
         
         }
         
         } 
         
         }
        
        
////////////////////Draw all the distributed loads//////////////////////
    if(typeof(self.beam.distribloads.length) !== 'undefined'){
      
      //////////scaled arrows from load vals ///////////
      var maxAbsDload = -999999999;
         for (var i=0; i<self.beam.distribloads.length; i++){
          if(Math.abs(Number(self.beam.distribloads[i].startq))> maxAbsDload){
          maxAbsDload = Math.abs(Number(self.beam.distribloads[i].startq));
           }
           
           if(Math.abs(Number(self.beam.distribloads[i].endq))> maxAbsDload){
          maxAbsDload = Math.abs(Number(self.beam.distribloads[i].endq));
           }
           
         }
         
      for (var i=0; i<self.beam.distribloads.length; i++){
        //console.log('i = ' + i + ' and the forces pos ' + Number(self.beam.distribloads[i].startx) + ' and the distload val ' + Number(self.beam.distribloads[i].startq));
          
          
           starTx = convertx(canvas.width,SB, EB, Number(self.beam.distribloads[i].startx));
          starTy = converty(canvas.height,maxAbsDload,-maxAbsDload,  0);
          
           starTxq = starTx,
          starTyq = converty(canvas.height,maxAbsDload,-maxAbsDload, -Number(self.beam.distribloads[i].startq)*0.7);
          
          eNdx = convertx(canvas.width,SB, EB, Number(self.beam.distribloads[i].endx));
          eNdy =  converty(canvas.height,maxAbsDload,-maxAbsDload, 0);
         
         
         eNdxq = eNdx;
         eNdyq =  converty(canvas.height,maxAbsDload,-maxAbsDload, -Number(self.beam.distribloads[i].endq)*0.7);
          
          ctx.beginPath();

	ctx.moveTo(starTx,starTy);
        ctx.lineTo( starTxq, starTyq);
         ctx.lineTo( eNdxq, eNdyq);
         ctx.lineTo(  eNdx, eNdy);
          ctx.lineWidth=1;
        ctx.strokeStyle="brown";
         ctx.stroke();
         
           arrow1x =  starTx;
          arrow1y = starTy;
          
          arrow2x = starTx-5;
          
          if(Number(self.beam.distribloads[i].startq)<0){
          arrow2y = starTy-8;
          }else{
           arrow2y =starTy+8;
          }
          
          ctx.beginPath();
         ctx.lineWidth=1;
	ctx.moveTo(arrow1x, arrow1y);
        ctx.lineTo( arrow2x,arrow2y );
        ctx.strokeStyle="brown";
         ctx.stroke();
      
          
           arrow1x =  eNdx;
          arrow1y = eNdy;
          
          arrow2x = eNdx+5;
          
          if(Number(self.beam.distribloads[i].endq)<0){
          arrow2y = eNdy-8;
          }else{
           arrow2y =eNdy+8;
          }
          
          ctx.beginPath();
         ctx.lineWidth=1;
	ctx.moveTo(arrow1x, arrow1y);
        ctx.lineTo( arrow2x,arrow2y );
        ctx.strokeStyle="brown";
         ctx.stroke();

             
         
          }
        }         
           
                    
        
      ////IE Fix Glow Fix/////         
          ctx.beginPath();
           ctx.lineWidth=1.5;
  	   ctx.moveTo(-10, -10);
           ctx.lineTo(-9, -9 );
           ctx.strokeStyle="white";
         ctx.stroke();
       /////////////////////  
        var image = document.getElementById("beamCanvasImg");
           image.src = canvas.toDataURL("image/png");


//////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////Results Plots//////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////
var shiftlabelsx = 50;
var shiftlabelsy = 10;
       
	var canvas =   document.getElementById("dispCanvas");
	var dispcanvascontainer =   document.getElementById("dispCanvasContainer");
	
	if(self.wndwidth>1000){
	canvas.width = 800;
	dispcanvascontainer.style.width='800px';
		
	 
	}else{
	canvas.width = self.wndwidth*0.85;
	  
     	dispcanvascontainer.style.width=self.wndwidth*0.85+'px';
	
	
	}
	
	var ctx =  canvas.getContext("2d");
	ctx.clearRect(0, 0, canvas.width, canvas.height); //clear canvas
	
         ctx.beginPath();
        
         ctx.lineWidth=1;
	ctx.moveTo(canvas.width*0.05,20);
        ctx.lineTo(canvas.width*0.05,180);
        ctx.strokeStyle="black";
         ctx.stroke();

        ctx.font = "12px Arial";  //write start of the beam
	ctx.fillText('Displacement',5,15);
	
	         //find start and end of beam ///

	
	  //////////scaled arrows from load vals ///////////
      var maxDisp = -999999;
      var minDisp = 999999;
      var maxdispx;
      var mindispx;
      

      
         for (var i=0; i<self.beam.NN; i++){
          if(Number(self.beam.displacement[i])> maxDisp){
          maxDisp = Number(self.beam.displacement[i]);
          maxdispx = self.beam.nodes[i];
           }
           if(Number(self.beam.displacement[i])< minDisp){
          minDisp = Number(self.beam.displacement[i]);
          mindispx = self.beam.nodes[i];     
           }
         }
        
      
                 if(maxDisp<0){
                 scaleymax = 0+0.1*Math.abs(maxDisp);
                 scaleymin = minDisp-0.1*Math.abs(minDisp);
                 }else if(minDisp>0){
                  scaleymax = maxDisp+0.1*Math.abs(maxDisp);
                 scaleymin = 0-0.1*Math.abs(minDisp);
                 }else{
                 scaleymax =maxDisp+0.1*Math.abs(maxDisp);
                 scaleymin = minDisp-0.1*Math.abs(minDisp);
                 }
                   dispy = converty(canvas.height, scaleymax,scaleymin, 0);  
           ctx.beginPath();
           
          ctx.lineWidth=1;
	ctx.moveTo(canvas.width*0.05,dispy);
        ctx.lineTo(canvas.width*0.95,dispy);
        ctx.strokeStyle="black";
         ctx.stroke();

         
         
         
          ctx.beginPath();
          ctx.lineWidth=1;
          ctx.strokeStyle="orange";
          
            
          dispx = convertx(canvas.width,SB, EB, Number(self.beam.nodes[0]));
          dispy = converty(canvas.height, scaleymax, scaleymin , 0.95* Number(self.beam.displacement[0]));           
                                
         
	ctx.moveTo(dispx,dispy);
	
      for (var i=1; i<self.beam.NN; i++){
       // console.log('i = ' + i + ' and the forces pos ' + Number(self.beam.forces[i].xpos) + ' and the forces val ' + Number(self.beam.forces[i].val));
          
          dispx = convertx(canvas.width,SB, EB, Number(self.beam.nodes[i]));
          dispy = converty(canvas.height, scaleymax, scaleymin,  0.95*Number(self.beam.displacement[i]));           
         
        
        ctx.lineTo(dispx,dispy);
                 
        }
        
	ctx.stroke();
	
	if(self.beam.NN>0){

       ///label max displacement///
       dispx = convertx(canvas.width,SB, EB, maxdispx);
       dispy = converty(canvas.height, scaleymax, scaleymin, 0.95* maxDisp);    
       if(dispx > 0.8*canvas.width){
       dispx = dispx-shiftlabelsx;
       }       
        ctx.font = "12px Arial";  //write start of the beam
	ctx.fillText(maxDisp.toPrecision(4),dispx,dispy+shiftlabelsy);

  ///label min displacement///
       dispx = convertx(canvas.width,SB, EB, mindispx);
       dispy = converty(canvas.height,scaleymax, scaleymin, 0.95* minDisp);    
       if(dispx > 0.8*canvas.width){
       dispx = dispx-100;
       }        
        ctx.font = "12px Arial";  //write start of the beam
	ctx.fillText(minDisp.toPrecision(4),dispx,dispy);
           }
           
           
      ////IE Fix Glow Fix/////         
          ctx.beginPath();
           ctx.lineWidth=1.5;
  	  ctx.moveTo(-10, -10);
           ctx.lineTo(-9, -9 );
           ctx.strokeStyle="white";
         ctx.stroke();
       /////////////////////  
 
            image = document.getElementById("dispCanvasImg");
           image.src = canvas.toDataURL("image/png");


  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////     
       
       
       var canvas =   document.getElementById("slopeCanvas");
	var slopecanvascontainer =   document.getElementById("slopeCanvasContainer");
	
	if(self.wndwidth>1000){
	canvas.width = 800;
	slopecanvascontainer.style.width='800px';
		
	 
	}else{
	canvas.width = self.wndwidth*0.85;
	  
     	slopecanvascontainer.style.width=self.wndwidth*0.85+'px';
	
	
	}
	
	var ctx =  canvas.getContext("2d");
	ctx.clearRect(0, 0, canvas.width, canvas.height); //clear canvas
	
                 ctx.beginPath();
          ctx.strokeStyle="black";
            ctx.lineWidth=1;
	ctx.moveTo(canvas.width*0.05,20);
        ctx.lineTo(canvas.width*0.05,180);
         ctx.stroke();

 ctx.font = "12px Arial";  //write start of the beam
	ctx.fillText('Rotation',5,15);
	         //find start and end of beam ///


	
	  //////////scaled arrows from load vals ///////////
    
       var maxSlope = -999999;
      var minSlope = 999999;
      var maxslopex;
      var minslopex;
     

      
         for (var i=0; i<self.beam.NN; i++){
          if(Number(self.beam.rotation[i])> maxSlope){
          maxSlope = Number(self.beam.rotation[i]);
          maxslopex = self.beam.nodes[i];
           }
           if(Number(self.beam.rotation[i])< minSlope){
          minSlope = Number(self.beam.rotation[i]);
          minslopex = self.beam.nodes[i];
           }
         }
         

             if(maxSlope<0){
                 scaleymax = 0+0.1*Math.abs(maxSlope);
                 scaleymin = minSlope-0.1*Math.abs(minSlope);
                 }else if(minSlope>0){
                  scaleymax =maxSlope+0.1*Math.abs(maxSlope);
                 scaleymin = 0-0.1*Math.abs(minSlope);
                 }else{
                 scaleymax =maxSlope+0.1*Math.abs(maxSlope);
                 scaleymin = minSlope-0.1*Math.abs(minSlope);
                 }
                  dispy = converty(canvas.height, scaleymax, scaleymin, 0);  
                   

         
          
         ctx.beginPath();
          ctx.strokeStyle="black";
         ctx.lineWidth=1;
	ctx.moveTo(canvas.width*0.05,dispy);
        ctx.lineTo(canvas.width*0.95,dispy);
         ctx.stroke();

          ctx.beginPath();
          ctx.lineWidth=1;
          ctx.strokeStyle="green";
          
            
          slopex = convertx(canvas.width,SB, EB, Number(self.beam.nodes[0]));
          slopey = converty(canvas.height, scaleymax, scaleymin, 0.95* Number(self.beam.rotation[0]));           
                                
         
	ctx.moveTo(slopex,slopey);
	
      for (var i=1; i<self.beam.NN; i++){
       // console.log('i = ' + i + ' and the forces pos ' + Number(self.beam.forces[i].xpos) + ' and the forces val ' + Number(self.beam.forces[i].val));
          
          slopex = convertx(canvas.width,SB, EB, Number(self.beam.nodes[i]));
          slopey = converty(canvas.height,  scaleymax, scaleymin,  0.95*Number(self.beam.rotation[i]));           
         
        
        ctx.lineTo(slopex,slopey);
                 
        }
	ctx.stroke();
        
        if(self.beam.NN>0){

       ///label max slope///
       dispx = convertx(canvas.width,SB, EB, maxslopex);
       dispy = converty(canvas.height,  scaleymax, scaleymin, 0.95* maxSlope);    
       if(dispx > 0.8*canvas.width){
       dispx = dispx-shiftlabelsx;
       }       
        ctx.font = "12px Arial";  //write start of the beam
	ctx.fillText(maxSlope.toPrecision(4),dispx,dispy+shiftlabelsy);

  ///label min displacement///
       dispx = convertx(canvas.width,SB, EB, minslopex);
       dispy = converty(canvas.height, scaleymax, scaleymin, 0.95* minSlope);    
       
       if(dispx > 0.8*canvas.width){
       dispx = dispx-shiftlabelsx;
       }        
        ctx.font = "12px Arial";  //write start of the beam
	ctx.fillText(minSlope.toPrecision(4),dispx,dispy);
           }

    
      ////IE Fix Glow Fix/////         
          ctx.beginPath();
           ctx.lineWidth=1.5;
  	     ctx.moveTo(-10, -10);
           ctx.lineTo(-9, -9 );
           ctx.strokeStyle="white";
         ctx.stroke();
       /////////////////////  
           
           image = document.getElementById("slopeCanvasImg");
           image.src = canvas.toDataURL("image/png");

       
     //////////////////////////////////////////////////////////////////////////////////////////
     ////////////////////////////////////////////////////////////////////////////////////////  
       
    
   var canvas =   document.getElementById("shearmomentCanvas");
	var shearmomentcanvascontainer =   document.getElementById("shearmomentCanvasContainer");
	
	if(self.wndwidth>1000){
	canvas.width = 800;
	shearmomentcanvascontainer.style.width='800px';
		
	 
	}else{
	canvas.width = self.wndwidth*0.85;
	  
     	shearmomentcanvascontainer.style.width=self.wndwidth*0.85+'px';
	
	
	}
	
	var ctx =  canvas.getContext("2d");
	ctx.clearRect(0, 0, canvas.width, canvas.height); //clear canvas
	
   ctx.lineWidth=1;
	ctx.moveTo(canvas.width*0.05,100);
        ctx.lineTo(canvas.width*0.95,100);
         ctx.stroke();
         
            ctx.lineWidth=1;
	ctx.moveTo(canvas.width*0.05,20);
        ctx.lineTo(canvas.width*0.05,180);
         ctx.stroke();

 ctx.font = "12px Arial";  //write start of the beam
	ctx.fillText('Shear/Moment',5,15);
	       	
	  //////////scaled arrows from load vals ///////////
      var maxAbsMoment = -999999999;
         for (var i=0; i<self.beam.NN; i++){
          if(Math.abs(Number(self.beam.moment[i]))> maxAbsMoment){
          maxAbsMoment = Math.abs(Number(self.beam.moment[i]));
           }
         }
         
           //////////scaled arrows from load vals ///////////
      var maxAbsShear = -999999999;
         for (var i=0; i<self.beam.NN; i++){
          if(Math.abs(Number(self.beam.shear[i]))> maxAbsShear){
          maxAbsShear = Math.abs(Number(self.beam.shear[i]));
           }
         }

          ctx.beginPath();
          ctx.lineWidth=1;
          ctx.strokeStyle="red";
          
            
          momentx = convertx(canvas.width,SB, EB, Number(self.beam.nodes[0]));
          momenty = converty(canvas.height, maxAbsMoment,-maxAbsMoment, 0.95* Number(self.beam.moment[0]));           
                                
         
	ctx.moveTo(momentx,momenty);
	
      for (var i=1; i<self.beam.NN; i++){
      
          momentx = convertx(canvas.width,SB, EB, Number(self.beam.nodes[i]));
          momenty = converty(canvas.height, maxAbsMoment,-maxAbsMoment,  0.95*Number(self.beam.moment[i]));           
         
        
        ctx.lineTo(momentx,momenty);
                 
        }
	ctx.stroke();
        
        
        
	          ctx.beginPath();
          ctx.lineWidth=1;
          ctx.strokeStyle="blue";
          
            
          shearx = convertx(canvas.width,SB, EB, Number(self.beam.nodes[0]));
          sheary = converty(canvas.height, maxAbsShear,-maxAbsShear, 0.95* Number(self.beam.shear[0]));           
                                
         
	ctx.moveTo(shearx,sheary);
	
      for (var i=1; i<self.beam.NN; i++){
       // console.log('i = ' + i + ' and the forces pos ' + Number(self.beam.forces[i].xpos) + ' and the forces val ' + Number(self.beam.forces[i].val));
          
          shearx = convertx(canvas.width,SB, EB, Number(self.beam.nodes[i]));
          sheary = converty(canvas.height, maxAbsShear,-maxAbsShear,  0.95*Number(self.beam.shear[i]));           
         
        
        ctx.lineTo(shearx,sheary);
                 
        }
	ctx.stroke();

        
      ////IE Fix Glow Fix/////         
          ctx.beginPath();
           ctx.lineWidth=1.5;
  	    ctx.moveTo(-10, -10);
           ctx.lineTo(-9, -9 );
           ctx.strokeStyle="white";
         ctx.stroke();
       /////////////////////  


 image = document.getElementById("shearmomentCanvasImg");
           image.src = canvas.toDataURL("image/png");


       
     //////////////////////////////////////////////////////////////////////////////////////////
     ////////////////////////////////////////////////////////////////////////////////////////  
       
    
   var canvas =   document.getElementById("momentCanvas");
	var momentcanvascontainer =   document.getElementById("momentCanvasContainer");
	
	if(self.wndwidth>1000){
	canvas.width = 800;
	momentcanvascontainer.style.width='800px';
		
	 
	}else{
	canvas.width = self.wndwidth*0.85;
	  
     	momentcanvascontainer.style.width=self.wndwidth*0.85+'px';
	
	
	}
	
	var ctx =  canvas.getContext("2d");
	ctx.clearRect(0, 0, canvas.width, canvas.height); //clear canvas


         
            ctx.lineWidth=1;
	ctx.moveTo(canvas.width*0.05,20);
        ctx.lineTo(canvas.width*0.05,180);
         ctx.stroke();

 ctx.font = "12px Arial";  //write start of the beam
	ctx.fillText('Moment',5,15);
	        	
	
	 var maxMoment = -999999999;
      var minMoment = 999999999;
      var maxmomentx;
      var minmomentx;
     

      
         for (var i=0; i<self.beam.NN; i++){
          if(Number(self.beam.moment[i])> maxMoment){
          maxMoment = Number(self.beam.moment[i]);
          maxmomentx = self.beam.nodes[i];
           }
           if(Number(self.beam.moment[i])< minMoment){
          minMoment = Number(self.beam.moment[i]);
          minmomentx = self.beam.nodes[i];
           }
         }
            if(maxMoment<0){
                 scaleymax = 0+0.1*Math.abs(maxMoment);
                 scaleymin = minMoment-0.1*Math.abs(minMoment);
                 }else if(minMoment>0){
                  scaleymax =maxMoment+0.1*Math.abs(maxMoment);
                 scaleymin = 0-0.1*Math.abs(minMoment);
                 }else{
                 scaleymax =maxMoment+0.1*Math.abs(maxMoment);
                 scaleymin = minMoment-0.1*Math.abs(minMoment);
                 }
                   dispy = converty(canvas.height, scaleymax, scaleymin, 0); 
                  

           
         ctx.beginPath();
          ctx.strokeStyle="black";
         ctx.lineWidth=1;
	ctx.moveTo(canvas.width*0.05,dispy);
        ctx.lineTo(canvas.width*0.95,dispy);
         ctx.stroke();

	
	
          ctx.beginPath();
          ctx.lineWidth=1;
          ctx.strokeStyle="red";
          
            
          momentx = convertx(canvas.width,SB, EB, Number(self.beam.nodes[0]));
           
          momenty = converty(canvas.height, scaleymax, scaleymin, 0.95* Number(self.beam.moment[0]));           
                          
         
	ctx.moveTo(momentx,momenty);
	
      for (var i=1; i<self.beam.NN; i++){
       // console.log('i = ' + i + ' and the forces pos ' + Number(self.beam.forces[i].xpos) + ' and the forces val ' + Number(self.beam.forces[i].val));
          
          momentx = convertx(canvas.width,SB, EB, Number(self.beam.nodes[i]));
          momenty = converty(canvas.height, scaleymax, scaleymin, 0.95* Number(self.beam.moment[i]));           
                            
         
        
        ctx.lineTo(momentx,momenty);
                 
        }
	ctx.stroke();
        
        
          if(self.beam.NN>0){

       ///label max moment///
       dispx = convertx(canvas.width,SB, EB, maxmomentx);
     
       dispy = converty(canvas.height, scaleymax, scaleymin, 0.95* maxMoment); 
       
       if(dispx > 0.8*canvas.width){
       dispx = dispx-shiftlabelsx;
       }       
        ctx.font = "12px Arial";  //write start of the beam
	ctx.fillText(maxMoment.toPrecision(4),dispx,dispy+shiftlabelsy);

  ///label min displacement///
       dispx = convertx(canvas.width,SB, EB, minmomentx);
      
       dispy = converty(canvas.height, scaleymax, scaleymin, 0.95* minMoment);    
       
       if(dispx > 0.8*canvas.width){
       dispx = dispx-shiftlabelsx;
       }        
        ctx.font = "12px Arial";  //write start of the beam
	ctx.fillText(minMoment.toPrecision(4),dispx,dispy);
           }

        
        
      ////IE Fix Glow Fix/////         
          ctx.beginPath();
           ctx.lineWidth=1.5;
  	     ctx.moveTo(-10, -10);
           ctx.lineTo(-9, -9 );
           ctx.strokeStyle="white";
         ctx.stroke();
       /////////////////////  
         image = document.getElementById("momentCanvasImg");
           image.src = canvas.toDataURL("image/png");
       
       ///////////////////////////////////////////////////////////////////////////////////////////////////////
       ///////////////////////////////////////////////////////////////////////////////////////////////////////
       
       
       
	var canvas =   document.getElementById("shearCanvas");
	var shearcanvascontainer =   document.getElementById("shearCanvasContainer");
	
	if(self.wndwidth>1000){
	canvas.width = 800;
	shearcanvascontainer.style.width='800px';
		
	 
	}else{
	canvas.width = self.wndwidth*0.85;
	  
     	shearcanvascontainer.style.width=self.wndwidth*0.85+'px';
	
	
	}
	
	var ctx =  canvas.getContext("2d");
	ctx.clearRect(0, 0, canvas.width, canvas.height); //clear canvas


         
            ctx.lineWidth=1;
	ctx.moveTo(canvas.width*0.05,20);
        ctx.lineTo(canvas.width*0.05,180);
         ctx.stroke();

 ctx.font = "12px Arial";  //write start of the beam
	ctx.fillText('Shear',5,15);
	         //find start and end of beam ///

	 var maxShear = -999999999;
      var minShear = 999999999;
      var maxshearx;
      var minshearx;
     

      
         for (var i=0; i<self.beam.NN; i++){
          if(Number(self.beam.shear[i])> maxShear){
          maxShear = Number(self.beam.shear[i]);
          maxshearx = self.beam.nodes[i];
           }
           if(Number(self.beam.shear[i])< minShear){
          minShear = Number(self.beam.shear[i]);
          minshearx = self.beam.nodes[i];
           }
         }
          if(maxShear<0){
                 scaleymax = 0+0.1*Math.abs(maxShear);
                 scaleymin = minShear-0.1*Math.abs(minShear);
                 }else if(minShear>0){
                  scaleymax = maxShear+0.1*Math.abs(maxShear);
                 scaleymin = 0-0.1*Math.abs(minShear);
                 }else{
                 scaleymax =maxShear+0.1*Math.abs(maxShear);
                 scaleymin = minShear-0.1*Math.abs(minShear);
                 }
             dispy = converty(canvas.height, scaleymax, scaleymin , 0); 
  
         ctx.beginPath();
          ctx.strokeStyle="black";
         ctx.lineWidth=1;
	ctx.moveTo(canvas.width*0.05,dispy);
        ctx.lineTo(canvas.width*0.95,dispy);
         ctx.stroke();

	
	          ctx.beginPath();
          ctx.lineWidth=1;
          ctx.strokeStyle="blue";
          
            
          shearx = convertx(canvas.width,SB, EB, Number(self.beam.nodes[0]));
         sheary = converty(canvas.height, scaleymax, scaleymin, 0.95* Number(self.beam.shear[0]));           
                  
         
	ctx.moveTo(shearx,sheary);
	
      for (var i=1; i<self.beam.NN; i++){
       // console.log('i = ' + i + ' and the forces pos ' + Number(self.beam.forces[i].xpos) + ' and the forces val ' + Number(self.beam.forces[i].val));
          
          shearx = convertx(canvas.width,SB, EB, Number(self.beam.nodes[i]));
          sheary = converty(canvas.height, scaleymax, scaleymin, 0.95* Number(self.beam.shear[i]));           
                     
        ctx.lineTo(shearx,sheary);
                 
        }
	ctx.stroke();
	    
	    if(self.beam.NN>0){

       ///label max moment///
       dispx = convertx(canvas.width,SB, EB, maxshearx);
       dispy = converty(canvas.height, scaleymax, scaleymin, 0.95* maxShear); 
     
       if(dispx > 0.8*canvas.width){
       dispx = dispx-shiftlabelsx;
       }       
        ctx.font = "12px Arial";  //write start of the beam
	ctx.fillText(maxShear.toPrecision(4),dispx,dispy+shiftlabelsy);

  ///label min displacement///
       dispx = convertx(canvas.width,SB, EB, minshearx);
         dispy = converty(canvas.height, scaleymax, scaleymin, 0.95* minShear);    
       
       if(dispx > 0.8*canvas.width){
       dispx = dispx-shiftlabelsx;
       }        
        ctx.font = "12px Arial";  //write start of the beam
	ctx.fillText(minShear.toPrecision(4),dispx,dispy);
           }

	    
      ////IE Fix Glow Fix/////         
          ctx.beginPath();
           ctx.lineWidth=1.5;
  	     ctx.moveTo(-10, -10);
           ctx.lineTo(-9, -9 );
           ctx.strokeStyle="white";
         ctx.stroke();
       /////////////////////  

       image = document.getElementById("shearCanvasImg");
           image.src = canvas.toDataURL("image/png");
       /////////////////////////////////////////////////////////////////////////////////////
   /////////////////////////////////////////////////////////////////////////////////////
  
       
       
       
       
       
       
       
       
       
  }
 }

};


 angular.element($window).bind('resize', function(){
    self.wndwidth  = $window.innerWidth;
       
       self.drawcanvas();
   
        $scope.$apply();
      });


self.drawcanvas();


/////////////////////////////////////////////////////////////////////
//////////////////////////////NEW PROB///////////////////////////////////////

self.newprob = function(){

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

  self.drawcanvas();
};


/////////////////////////////////////////////////////////////////////
/////////////////////////SOLVE///////////////////////////////////////
/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////


self.solve = function(){


var progressOK = true;

if (progressOK) {
 progressOK  = mesh(self.beam);
}

if (progressOK) {
 progressOK  = inputdata(self.beam);

}


if (progressOK) {
 progressOK  = bandwidth(self.beam);

}

if (progressOK) {
 progressOK  = stiffness(self.beam);

}

if (progressOK) {
 progressOK  = modifyforbc(self.beam);

}

if (progressOK) {
 progressOK  = bandsolver(self.beam);
}

if (progressOK) {
 progressOK  = reactioncalc(self.beam);
}

if (progressOK) {
 progressOK  = output(self.beam);
}

if(!progressOK){
alert("There was an error in the solution to your beam.");
}

self.drawcanvas();
self.beam.updated = 1;
};



//////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////

self.hasprops = function(){
if(typeof(self.beam.props) !== 'undefined'){
return (self.beam.props.length>0);
}else{
return  false;
}
};

/////////////////////////////////////////////////////////////////////
/////////////////////////////////////////////////////////////////////

self.solveable = function(){

var conTransDOF=0;
var conRotDOF=0;


for(i=0; i<self.beam.constraints.length; i++){



con_type = self.beam.constraints[i].type;

switch(con_type){
case 0:
    conTransDOF=  conTransDOF+1;
    break;
case 1:
    conRotDOF = conRotDOF + 1;
    break;
case 2:
    conRotDOF = conRotDOF + 1;
    conTransDOF=  conTransDOF+1;
    break;
case 3:
    conTransDOF=  conTransDOF+1;
    break;
case 4:
    conTransDOF=  conTransDOF+1;
    conRotDOF = conRotDOF + 1;
    break;
}

}

for(i=0; i<self.beam.springs.length; i++){

spr_type = self.beam.springs[i].type;

switch(spr_type){
case 0:
    conTransDOF=  conTransDOF+1;
    break;
case 1:
    conRotDOF = conRotDOF + 1;
    break;
}

}

for(i=0; i<self.beam.momentrels.length; i++){
conRotDOF = conRotDOF - 1;

}

releasedDOF = conRotDOF + conTransDOF;

	if(releasedDOF >=2){
	
		if(releasedDOF >=2 && !self.beam.updated){
		
		self.solve();
		
		return true;
		}
		
	return true;
	}

};

////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////

  }]);







})();
