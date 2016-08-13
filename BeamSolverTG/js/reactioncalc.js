function reactioncalc(beam){

var errors;

errors = false;



//     '----- Reaction Calculation -----
     for(i = 0; i<beam.ND; i++){
        N = beam.NU[i];
        if(i===0){
        beam.React = [beam.CNST * (beam.U[i] - beam.F[N])];
        }else{
        beam.React[i] = beam.CNST * (beam.U[i] - beam.F[N]);
        }
    }



if(errors){
return false;
}else{
return true;
}
}