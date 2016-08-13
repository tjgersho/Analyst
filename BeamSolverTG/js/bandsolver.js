function bandsolver(beam){

var errors;

errors = false;


  //'----- Band Solver -----
     N1 = beam.NQ - 1;
     ///'--- Forward Elimination
     for(k = 1; k<=N1; k++){
        NK = beam.NQ - k+1;
        if(NK > beam.NBW) {
            NK = beam.NBW;
            }
           for(i = 2; i<=NK; i++){
              C1 = beam.S[k-1][i-1] / beam.S[k-1][0];
              I1 = k + i-1;
              for(j = i; j<=NK; j++){
                 J1 = j - i+1;
                 beam.S[I1-1][J1-1] = beam.S[I1-1][J1-1] - C1 * beam.S[k-1][j-1];
              }
              beam.F[I1-1] = beam.F[I1-1] - C1 * beam.F[k-1];
           }
        }
    //// '--- Back-substitution
     beam.F[beam.NQ-1] = beam.F[beam.NQ-1] / beam.S[beam.NQ-1][0];
     for(KK = 1; KK<=N1; KK++){
        k = beam.NQ - KK;
        C1 = 1 / beam.S[k-1][0];
        beam.F[k-1] = C1 * beam.F[k-1];
        NK = beam.NQ - k+1;
        if(NK > beam.NBW){
           NK = beam.NBW;
           }
        for(j = 2; j<=NK; j++){
           beam.F[k-1] = beam.F[k-1] - C1 * beam.S[k-1][j-1] * beam.F[k + j-2];
        }
     }








if(errors){
return false;
}else{
return true;
}
}