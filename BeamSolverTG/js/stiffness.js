function stiffness(beam){

var errors;

errors = false;



var srow = [];
for(i=0; i<beam.NQ; i++){
srow = [];
	for(j=0; j<beam.NBW; j++){
	srow.push(0);
	}
	 if(i===0){
	 beam.S = [srow];
	 }else{
	 beam.S[i] = srow;
	 }
 if(typeof(beam.F[i]) == 'undefined'){
 beam.F[i] = 0;
 }
}


//----- Global Stiffness Matrix -----
  for(N = 0; N<beam.NE; N++){
         N1 = beam.NOC[N][0];
         N2 = beam.NOC[N][1];
         M = beam.MAT[N];
         EL = Math.abs(beam.X[N1] - beam.X[N2]);
         EIL = beam.PM[M] * beam.SMI[N] / Math.pow(EL , 3);
         
         SE = [[12 * EIL,EIL * 6 * EL,-12 * EIL,EIL * 6 * EL]];
        
        SE[1] = [ SE[0][1], EIL * 4 * EL * EL, -EIL * 6 * EL, EIL * 2 * EL * EL];
        
         SE[2] = [SE[0][2], SE[1][2], EIL*12, -EIL*6*EL];
          
          SE[3] = [SE[0][3], SE[1][3], SE[2][3], EIL*4*EL*EL];
        
            
       
            
            
////////////Modify Element Stiffness to have a hinge (moment release)//////////

       for(h = 0; h<beam.NMOMRE; h++){
           
           if(2 * N2 === beam.MOMREDOF[h]){
           
           
            SE = [[3 * beam.PM[M] * beam.SMI[N] / Math.pow(EL,  3),  3*beam.PM[M] * beam.SMI[N] / Math.pow(EL, 2), -3*beam.PM[M] * beam.SMI[N] / Math.pow(EL, 3), 0]];
        
       SE[1] = [3 * beam.PM[M] * beam.SMI[N] / Math.pow(EL , 2), 3 * beam.PM[M] * beam.SMI[N] / EL,   -3 * beam.PM[M] * beam.SMI[N] / Math.pow(EL, 2), 0];
        
          SE[2] = [-3 * beam.PM[M] * beam.SMI[N] / Math.pow(EL , 3), -3 *  beam.PM[M] * beam.SMI[N]  /Math.pow(EL , 2),  3 * beam.PM[M] * beam.SMI[N]  / Math.pow(EL , 3), 0];
          
         SE[3] = [0,0,0,0];
        
	}           
     }
            
            
            
     for(ii = 1; ii<=beam.NEN; ii++){
           NRT = beam.NDN * (beam.NOC[N][ii-1]);
           for(IT = 1; IT<=beam.NDN; IT++){
              NR = NRT + IT;
              i = beam.NDN * (ii-1) + IT;
              
              for(JJ = 1; JJ<=beam.NEN; JJ++){
              
                 NCT = beam.NDN * (beam.NOC[N][JJ-1]);
                 
                 for(JT = 1; JT<=beam.NDN; JT++){
                    j = beam.NDN * (JJ-1) + JT;
                    NC = NCT + JT - NR+1;
                    if(NC > 0){
                        
    	 beam.S[NR-1][NC-1] = Number(beam.S[NR-1][NC-1]) + Number(SE[i-1][j-1]);
                        
                   
                    }
                 }
              }
          }
        }
        
     }




if(errors){
return false;
}else{
return true;
}
}