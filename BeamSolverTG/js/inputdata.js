function inputdata(beam){

var errors;

errors = false;

beam.NQ = beam.NDN * beam.NN;

    
   // beam.NPR = 1;   //number of properties in the material card: E
    beam.X = [];
    beam.NOC = [[]];
    beam.MAT = [];
    beam.PM = [];
    beam.SMI = [];
    beam.NU = [];
    beam.U = [];
    beam.F=[];
    beam.SE=[[]];
    beam.MOMREDOF=[];
    beam.SPDATA = [[]];
    
    
    //ReDim X(NN), NOC(NE, NEN), MAT(NE), PM(NM, NPR), SMI(NE)
    //ReDim NU(ND), U(ND), F(NQ), SE(4, 4), MOMREDOF(NMOMRE), SPDATA(NSPR, 2)
    
 
    //----- Coordinates -----
  for(i = 0; i<beam.NN; i++){
    
        beam.X[i] = beam.nodes[i];
        
    }
  
    //----- Connectivity, Material, Moment of Inertia
    for(i = 0; i<beam.NE; i++){
      if(i===0){
        beam.NOC = [[beam.elements[i].nd1, beam.elements[i].nd2]];
       }else{
        beam.NOC[i] = [beam.elements[i].nd1, beam.elements[i].nd2];
       }
        
        beam.MAT[i] = beam.elements[i].elE;
        beam.SMI[i] = beam.elements[i].elI;
   }
     //----- Specified Displacements -----
  
     for(i = 0; i<beam.ND; i++){

        beam.NU[i] = beam.condof[i];
        beam.U[i] = beam.conval[i];
       }
     //----- Component Loads -----
  
     for(i = 0; i<beam.NL; i++){
   
        N = beam.loaddof[i];
        beam.F[N] = beam.loadval[i];
       }
   
     //----- Material Properties -----
     for(i = 0; i< beam.NM; i++){

            beam.PM[i] = beam.props[i].mod;
     }
     
     //----- Moment Releases---------
    if(beam.NMOMRE > 0){
        
        for(i = 0; i<beam.NMOMRE; i++){

            beam.MOMREDOF[i] = beam.momredof[i];
                       
        }
     }
     
     //----- Springs --------
     if(beam.NSPR > 0 ){
        
        for(i = 0; i<beam.NSPR; i++){
                   
                if(i===0){
                     beam.SPDATA = [[beam.springdof[i],beam.springval[i]]];
        
                     }else{
                   beam.SPDATA[i] = [beam.springdof[i],beam.springval[i]];
                   
                   }
            
        }
     }







if(errors){
return false;
}else{
return true;
}


}