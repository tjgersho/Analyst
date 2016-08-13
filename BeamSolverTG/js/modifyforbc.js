function modifyforbc(beam){

var errors;

errors = false;


 //----- Decide Penalty Parameter CNST -----
     beam.CNST = 0;
    for(i = 0; i<beam.NN; i++){
        if(beam.CNST < beam.S[i][0]){ 
        beam.CNST = beam.S[i][0]; 
        }
     }
     beam.CNST = beam.CNST * 10000;
     //----- Modify for Boundary Conditions -----
        //--- Displacement BC ---
        for(i = 0; i<beam.ND; i++){
           N = beam.NU[i];
           beam.S[N][0] = beam.S[N][0] + beam.CNST;
           beam.F[N] = beam.F[N] + beam.CNST * beam.U[i];
        }
        
       // ''''''''''''''''''''''''''''''''''''''''''
      // ' '---Springs ---'''''''''''''''''''''
      
        for(i = 0; i<beam.NSPR; i++){
        
        beam.S[beam.SPDATA[i][0]][0] = beam.S[beam.SPDATA[i][0]][0] + beam.SPDATA[i][1];
        
      
        
       }
      







if(errors){
return false;
}else{
return true;
}
}