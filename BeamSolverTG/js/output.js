function output(beam){

var errors;

errors = false;


for(var i=0; i<beam.NN; i++){

beam.displacement[i] = Number(beam.F[2*i]).toPrecision(4);
beam.rotation[i] = Number(beam.F[2*i+1]).toPrecision(4);


if(i === (beam.NN-1)){
                l_e = beam.nodes[i] - beam.nodes[i - 1];
           //  '''Shear calculation
       beam.shear[i] = (6 * ( beam.props[beam.MAT[i-1]].mod* beam.SMI[i-1]))/ (Math.pow(l_e,3)) *  (2 * beam.F[(2 * i - 2)] + l_e * beam.F[(2 * (i)-1)] - 2 * beam.F[(2 * i)]+ l_e * beam.F[(2 * i+1)]);
                            
             
                            
 //// '''moment calculation
        beam.moment[i] = (beam.props[beam.MAT[i-1]].mod * beam.SMI[i-1])/ ( Math.pow(l_e,2)) *(6 * (1) * beam.F[(2 *(i)-2)] + (3 * (1) - 1) * l_e * beam.F[(2 * i-1)] - 6 *(1) * beam.F[(2 * i)] + (3 * (1) + 1) * l_e * beam.F[(2 * i+1)]);
        

    
         
       }else{
          l_e = beam.nodes[(i + 1)] - beam.nodes[i];        
        
               
        
        if(beam.NMOMRE < 1){         
           // '''Shear calculation
              beam.shear[i]= (6 * (beam.props[beam.MAT[i]].mod*beam.SMI[i]))/  Math.pow(l_e,3) * (2 * beam.F[(2 * i )] + l_e * beam.F[(2 * i+1)] - 2 * beam.F[(2 * (i + 1))] + l_e * beam.F[(2 * (i + 1)+1)]);

         ////calculation
             beam.moment[i] = ((beam.props[beam.MAT[i]].mod*beam.SMI[i]))/ (Math.pow(l_e,2)) *(6 * (-1) * beam.F[(2 * i)] + (3 * (-1) - 1) * l_e * beam.F[(2 * i+1)] - 6 * (-1) * beam.F[(2 * (i + 1))] + (3 * (-1) + 1) * l_e * beam.F[(2 * (i + 1)+1)]);
              
        
      }
        
        
        
        
    /////''Calculate Hinge element shear and moment (moment release)
              
         for(var h = 0; h<beam.NMOMRE; h++){
           
         if ((2 * i + 2)  === beam.MOMREDOF[h]){
           
          // '''Shear calculation
             beam.shear[i]=  (3 * (beam.props[beam.MAT[i]].mod*beam.SMI[i]))/(Math.pow(l_e,3))*(beam.F[(2 * i)] + l_e * beam.F[(2 * i+1)] - beam.F[(2 * (i)+2 )]);

       // '''moment calculation
             beam.moment[i] = (3 * (beam.props[beam.MAT[i]].mod*beam.SMI[i]))/(Math.pow(l_e,2)) * (beam.F[(2 * i)] + l_e * beam.F[(2 * i+1)] - beam.F[(2 * (i)+2)]);

           }else if(h <= 0){
            
           // '''Shear calculation
              beam.shear[i]=   (6 * (beam.props[beam.MAT[i]].mod*beam.SMI[i]))/(Math.pow(l_e,3))* (2 * beam.F[(2 * i)] + l_e * beam.F[(2 * i+1)] - 2 * beam.F[(2*(i)+2)] + l_e * beam.F[(2 * i + 3)]);

          //'''moment calculation
              beam.moment[i] =  ((beam.props[beam.MAT[i]].mod* beam.SMI[i]))/(Math.pow(l_e,2)) * (6 * (-1) * beam.F[(2 * i)] + (3 * (-1) - 1) * l_e * beam.F[(2 * i+1)] - 6 * (-1) * beam.F[(2 * (i + 1))] + (3 * (-1) + 1) * l_e * beam.F[(2 * i + 3)]);
                
        
           }
           
        }

                
                
         }
               



}



for(i = 0; i< beam.NSPR; i++){
        beam.rspring[i] =  beam.SPDATA[i][1] * -beam.F[(beam.SPDATA[i][0])];  
     }
 
 
 
   //////////add qlocs to fbdtable
   if(typeof(beam.qlocs.length) !== 'undefined'){
  var numkeynodes = beam.qlocs.length+beam.itertabledat; 
  }else{
  var numkeynodes = beam.itertabledat; 
  }
   for(i=Number(beam.itertabledat); i<numkeynodes; i++){
     beam.fbdtable[i] = {x : beam.qlocs[i-Number(beam.itertabledat)].xpos};
   }
 
   
   
  //// '''''''''Order The TABLE X-Pos''''''''''

do{
 swapped_done = false;
     for(i = 0; i<(numkeynodes-1); i++){
      //'if this pair is out of order 
       if( beam.fbdtable[i].x > beam.fbdtable[i+1].x){
           //swap them and remember something changed
          tempxkey = beam.fbdtable[i+1].x;   
          beam.fbdtable[i+1].x = beam.fbdtable[i].x;            
          beam.fbdtable[i].x = tempxkey;

          swapped_done = true;
       }
  }
}while(swapped_done);



//////////////Merge Double entries///////////

do{
 remove_done = false;
 for(i = 0; i<(numkeynodes - 1); i++){
      // 'if this pair is out of order */
       if(Math.abs(beam.fbdtable[i].x - beam.fbdtable[i+1].x) < 0.0001){
           //'move all nodes up and subtract node count
        for(j = i; j<(numkeynodes-1); j++){
           beam.fbdtable[j].x = beam.fbdtable[j+1].x;
        } 
        
            numkeynodes--;  // 'remove end node
            
           delete beam.fbdtable[numkeynodes];

          remove_done = true;  //  'keep looping
          break;
       }    
 }
}while(remove_done);
   
   
 
 
 for(i = 0; i<numkeynodes; i++){
 j = 0;

 beam.fbdtable[i].node = j;

while( Math.abs(beam.nodes[j] - beam.fbdtable[i].x) > 0.000001 && beam.nodes[j] <= beam.fbdtable[i].x ){
   j = j + 1
   
 beam.fbdtable[i].node = j;
 
 }

}   
   
   
//////////////////////////////////////////////////////////
/////////Fill in fbd table////////////////////////////////
      
  
for(i = 0; i<numkeynodes; i++){

 beam.fbdtable[i].internalshear = beam.shear[beam.fbdtable[i].node ];
 
 beam.fbdtable[i].internalmoment = beam.moment[beam.fbdtable[i].node ];

 
 beam.fbdtable[i].beamdisp = beam.displacement[beam.fbdtable[i].node ];
 
 beam.fbdtable[i].beamrot = beam.rotation[beam.fbdtable[i].node ];

 }
 


for(i = 0; i<numkeynodes; i++){
 beam.fbdtable[i].externalforce = 0;
 beam.fbdtable[i].externalmoment   = 0;
   for(j = 0; j<beam.ND; j++){
   
        N = beam.NU[j];
        
        if(beam.fbdtable[i].node === (N) / 2){
            if(typeof(beam.fbdtable[i].externalforce) === 'undefined'){
        		 beam.fbdtable[i].externalforce = beam.React[j]; 
            }else{
         		beam.fbdtable[i].externalforce = beam.React[j] + beam.fbdtable[i].externalforce; 
            }        
         }
        
        if(beam.fbdtable[i].node === (N-1) / 2) { 
                if(typeof(beam.fbdtable[i].externalmoment) === 'undefined'){
                 beam.fbdtable[i].externalmoment  = beam.React[j]; 
                 }else{
                 beam.fbdtable[i].externalmoment  = beam.React[j] + beam.fbdtable[i].externalmoment; 
                 }       
        }
         
     }
     
    
    

    for(j = 0; j<beam.NSPR; j++){
      
        HI = beam.SPDATA[j][0];
        
          if(beam.fbdtable[i].node === (HI) / 2) {
		       
		         beam.fbdtable[i].externalforce = beam.SPDATA[j][1] * -beam.F[beam.SPDATA[j][0]] + beam.fbdtable[i].externalforce;
		         
		  }
        
        if(beam.fbdtable[i].node === (HI-1) / 2) {
               
                 beam.fbdtable[i].externalmoment   = beam.SPDATA[j][1] * -beam.F[beam.SPDATA[j][0]] +  beam.fbdtable[i].externalmoment;
          	     
        }
        
        
     }
 
}


for(j=0; j<beam.forces.length; j++){
 for(i=0; i<numkeynodes; i++){
         if(Math.abs(beam.fbdtable[i].x - beam.forces[j].xpos) < 0.000001){
	         if(typeof(beam.fbdtable[i].externalforce) === 'undefined'){
	        beam.fbdtable[i].externalforce = beam.forces[j].val;
	        }else{
	         beam.fbdtable[i].externalforce = beam.forces[j].val+ beam.fbdtable[i].externalforce;
	        }
	         
         }
 
 }
}

for(j=0; j<beam.moments.length; j++){
 for(i=0; i<numkeynodes; i++){
         if(Math.abs(beam.fbdtable[i].x - beam.moments[j].xpos) < 0.000001){
         if(typeof(beam.fbdtable[i].externalmoment) === 'undefined'){
        beam.fbdtable[i].externalmoment = beam.moments[j].val;
        }else{
        beam.fbdtable[i].externalmoment = beam.moments[j].val+ beam.fbdtable[i].externalmoment;
        }
         
         }
 
 }
}


for(j=0; j<beam.distribloads.length; j++){
 for(i=0; i<numkeynodes; i++){
      relativex = (beam.distribloads[j].startx+(1/3)*(beam.distribloads[j].endx-beam.distribloads[j].startx)*(Math.abs(beam.distribloads[j].startq)+2*Math.abs(beam.distribloads[j].endq))/(Math.abs(beam.distribloads[j].startq)+Math.abs(beam.distribloads[j].endq)));
      
         if(Math.abs(beam.fbdtable[i].x - relativex) < 0.000001){
	         if(typeof(beam.fbdtable[i].externalforce) === 'undefined'){
	          beam.fbdtable[i].externalforce = (beam.distribloads[j].startq + beam.distribloads[j].endq)/2*(beam.distribloads[j].endx - beam.distribloads[j].startx);
	         }else{
	          beam.fbdtable[i].externalforce = (beam.distribloads[j].startq + beam.distribloads[j].endq)/2*(beam.distribloads[j].endx - beam.distribloads[j].startx) + beam.fbdtable[i].externalforce;

	         }
	    }
 
 }
}

//////////calculate sum of the external forces and external moments

beam.sumforces = 0;
var momaboutzero = 0;




for(i=0; i<beam.fbdtable.length; i++){
	if(typeof(beam.fbdtable[i].externalforce) === 'undefined'){
	beam.fbdtable[i].externalforce = 0;
	}
	beam.sumforces = beam.sumforces + beam.fbdtable[i].externalforce;
momaboutzero = momaboutzero + beam.fbdtable[i].externalforce* beam.fbdtable[i].x;
}
 


beam.summoments = 0;



for(i=0; i<beam.fbdtable.length; i++){
	if(typeof(beam.fbdtable[i].externalmoments) === 'undefined'){
	beam.fbdtable[i].externalmoments = 0;
	}
	
beam.summoments = beam.summoments + beam.fbdtable[i].externalmoments;

}

 
beam.summoments = beam.summoments + momaboutzero;

//<td> {{query.x}} </td><td> {{query.internalshear}} </td><td> {{query.internalmoment}} </td><td> {{query.externalforce}} </td>
//<td> {{query.externalmoment}} </td><td> {{query.beamdisp}} </td><td> {{query.beamrot}} </td>


beam.solved = 1;

	if(errors){
	return false;
	}else{
	return true;
	}

}
