function bandwidth(beam){

var errors;

errors = false;


//----- Bandwidth Evaluation -----
     beam.NBW = 0
     for(N = 0; N<beam.NE; N++){
        beam.NABS = beam.NDN * (Math.abs(beam.NOC[N][0] - beam.NOC[N][1])+1);
        if(beam.NBW < beam.NABS){
        beam.NBW = beam.NABS;
        }
     }
  
  //   'For i = 1 To NMPC
  //   '   NABS = Abs(MPC(i, 1) - MPC(i, 4)) + 1
 //   '    If NBW < NABS Then NBW = NABS
 //   ' Next i


if(errors){
return false;
}else{
return true;
}
}