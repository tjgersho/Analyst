function mesh(beam){

var errors;

errors = false;



var SB;
var EB;
 EB =-99999999999;
 SB = 99999999999;    

if(typeof(beam.props.length) !== 'undefined'){
for(var i=0; i< beam.props.length; i++){
       // console.log(beam.props[i]);
        if(Number(beam.props[i].startx) < SB){
        SB = Number(beam.props[i].startx);
        }
        if(Number(beam.props[i].endx) > EB){
         EB = Number(beam.props[i].endx);
        }
}

var iterprop;   // Number of properties

iterprop = beam.props.length;
}else{
iterprop = 0;
}


var itermomre;   /// number of moment releases

if(typeof(beam.momentrels.length) !== 'undefined'){
 itermomre = beam.momentrels.length;
}else{
 itermomre = 0;
}

var itercons;   /// number of constraints

if(typeof(beam.constraints.length) !== 'undefined'){
 itercons = beam.constraints.length;
}else{
 itercons = 0;
}


var iterspr;   /// number of springs

if(typeof(beam.springs.length) !== 'undefined'){
 iterspr = beam.springs.length;
}else{
 iterspr = 0;
}


var iterdis;   /// number of springs

if(typeof(beam.distribloads.length) !== 'undefined'){
 iterdis = beam.distribloads.length;
}else{
 iterdis = 0;
}


var iterpl;   /// number of springs

if(typeof(beam.forces.length) !== 'undefined'){
 iterpl = beam.forces.length;
}else{
 iterpl = 0;
}

var iterml;   /// number of springs

if(typeof(beam.moments.length) !== 'undefined'){
 iterml = beam.moments.length;
}else{
 iterml = 0;
}

beam.itertabledat = 0;

////Start meshing!/////
var nodecount = 0;

for(i=0; i<iterprop; i++){

beam.nodes[nodecount] = beam.props[i].startx;
nodecount++;

beam.nodes[nodecount] = beam.props[i].endx;
nodecount++;
}


for(i=0; i< itermomre; i++){
beam.nodes[nodecount] = beam.momentrels[i].xpos;
nodecount++;
beam.fbdtable[beam.itertabledat] = {x:  beam.momentrels[i].xpos};
beam.itertabledat++;

}


for(i=0; i< itercons; i++){
beam.nodes[nodecount] = beam.constraints[i].xpos;
nodecount++;
beam.fbdtable[beam.itertabledat] = {x:  beam.constraints[i].xpos};
beam.itertabledat++;
}


for(i=0; i< iterspr; i++){
beam.nodes[nodecount] = beam.springs[i].xpos;
nodecount++;
beam.fbdtable[beam.itertabledat] = {x:  beam.springs[i].xpos};
beam.itertabledat++;
}

for(i=0; i< iterdis; i++){
beam.nodes[nodecount] = beam.distribloads[i].startx;
nodecount++;
beam.nodes[nodecount] =  beam.distribloads[i].endx;
nodecount++;
beam.fbdtable[beam.itertabledat] = {x:  (beam.distribloads[i].startx+(1/3)*(beam.distribloads[i].endx-beam.distribloads[i].startx)*(Math.abs(beam.distribloads[i].startq)+2*Math.abs(beam.distribloads[i].endq))/(Math.abs(beam.distribloads[i].startq)+Math.abs(beam.distribloads[i].endq)))};
beam.itertabledat++;
}


for(i=0; i< iterpl; i++){
beam.nodes[nodecount] = beam.forces[i].xpos;
nodecount++;
beam.fbdtable[beam.itertabledat] = {x:  beam.forces[i].xpos};
beam.itertabledat++;
}



for(i=0; i< iterml; i++){
beam.nodes[nodecount] = beam.moments[i].xpos;
nodecount++;
beam.fbdtable[beam.itertabledat] = {x:  beam.moments[i].xpos};
beam.itertabledat++;
}



///procedure bubbleSort( A : list of sortable items )
//var swapped_done;
//var tempnode_X;

do{
 swapped_done = false;
 
     for (i = 0; i<nodecount; i++){
       ////if this pair is out of order 
       if(beam.nodes[i] > beam.nodes[(i + 1)]){
          ///swap them and remember something changed
         tempnode_X = beam.nodes[(i + 1)];
        beam.nodes[(i + 1)] = beam.nodes[i];
         beam.nodes[i] = tempnode_X;
          swapped_done = true;
       }
   }
}
while(swapped_done);

////end sort


////Merge Repeat nodes...



do
{
remove_done = false;
  for(i=0; i<nodecount; i++){
  
    if(beam.nodes[i] === beam.nodes[(i+1)]){
        
          for( j=i; j<nodecount; j++){
              beam.nodes[j] = beam.nodes[(j+1)];
           }
            delete beam.nodes[nodecount];
            
           nodecount--;
           remove_done = true;
           break;
           
     }
  
  }

}while(remove_done);

//console.log('node count ' + nodecount);



/////// refine mesh!/////////////////////
///////////////////////////////////////////


///////////////////////////////

var meshvariable = iterprop + itermomre + itercons + iterspr + iterdis + iterpl + iterml;


var Mesh_Level = 200;



if(meshvariable < 5){
	Mesh_Level = 200;

}else if(meshvariable >= 5 && meshvariable < 11){
	Mesh_Level = 240;

}else if(meshvariable >= 11 && meshvariable < 21){
	Mesh_Level = 300;

}else if(meshvariable >= 21 && meshvariable < 31){
	Mesh_Level = 400;

}else if(meshvariable >= 31 && meshvariable <= 41){
	Mesh_Level = 440;

}else if(meshvariable >= 41 && meshvariable <= 50){
	Mesh_Level = 500;
	
}else{
	Mesh_Level = 540;

}

//Mesh_Level = 5;

var L_B = (EB-SB);

//console.log(L_B);



var min_key_node_spacing = 10000000;

for (j=0; j<nodecount-1; j++){
     temp_key_node_spacing = beam.nodes[(j + 1)] - beam.nodes[j];
     if (temp_key_node_spacing < min_key_node_spacing){
    min_key_node_spacing = temp_key_node_spacing;
     }

}

if(min_key_node_spacing < 0.0001*L_B){
min_key_node_spacing  = 0.001*L_B;
}


var key_nodes_x=[];

for (j=0; j<nodecount; j++){
key_nodes_x[j] = beam.nodes[j];
}


//for each segement..of the key node positions create more in-between nodes . Depending on Mesh_level and min_key_node_spacing
//which is smaller L_E/10*Mesh_level or key_node spacing

if ((min_key_node_spacing / 2) <= (L_B / (Mesh_Level))) {
aveL_E = (min_key_node_spacing / 2);

//console.log("Mesh Code: Key_Node_Spacing_Control");
}else{
aveL_E = L_B / (Mesh_Level);

//console.log("Mesh Code: Mesh_Level_Control");

}


expanded_node_count = (L_B / aveL_E) + 1;

expanded_node_count = Math.ceil(expanded_node_count); //Round expanded_node_count


aveL_E = L_B / (expanded_node_count - 1)



//----------------------------------
//Mesh refinement and incorporation of key nodes
//-----------------------------------
//Refine Mesh

for(i = 1; i< expanded_node_count; i++){ //refining the node spread

beam.nodes[i] = beam.nodes[(i - 1)] + aveL_E;
}



//Incorporate key nodes:
for(i = 1; i<nodecount; i++){ ///loop through key node array and add each to the node_x array

///loop through node_x array, and find position of each key_node
        for(j = 1; j<expanded_node_count; j++){
        if ((key_nodes_x[i] < beam.nodes[j]) && (key_nodes_x[i] > beam.nodes[(j - 1)]) && (key_nodes_x[i] !== beam.nodes[(j - 1)]) ) {
	        //insert key_node into nodes_array
	        //move node_x array items out one.
	        if ((key_nodes_x[i] - beam.nodes[(j - 1)]) !== 0 && Math.abs(key_nodes_x[i] - beam.nodes[(j - 1)]) > 0.00000001 && (key_nodes_x[i] - beam.nodes[j]) !== 0 && Math.abs(key_nodes_x[i] - beam.nodes[j]) > 0.00000001) {
	        
		        for(k = expanded_node_count; k>=j + 1; k--){
		        beam.nodes[(k)] = beam.nodes[(k - 1)];
		        }
		       
		        
		        tempnode_X = beam.nodes[j];
		        beam.nodes[j] = key_nodes_x[i];
		        beam.nodes[(j + 1)] = tempnode_X;
		        expanded_node_count = expanded_node_count + 1;
		        
		        break;
		        
	        
	            }
	            
	        }
        }

}


//console.log(beam.nodes);

//'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
//'''''''''Smart MESH''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
//'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''

if(expanded_node_count > 800){  //'''''''''Smart MESH''''''''''''''
//console.log("Your mesh is large. I need some time to create a better mesh.");


do{
 merge = false;
//I want to march thru the node array and start deleting middle nodes...

    jjj = 0;
    for(iii = 0; iii<(expanded_node_count + 1); iii++){

    if(merge){
        iii = iii - 1;
        if(Math.abs(beam.nodes[iii] - key_nodes_x[jjj]) < 0.00000001){
        jjj = jjj + 1;
  
        // Found node that is a key_node
        
        }
        
    }else{
        if(Math.abs(beam.nodes[iii] - key_nodes_x[jjj]) < 0.00000001){
        jjj = jjj + 1;
  
       // Found node that is a key_node
        }
     
     }
            
            
         if(iii > 0 && Math.abs(beam.nodes[iii] - key_nodes_x[(jjj - 1)]) > 0.00000001 && !(merge)){
            
       
       // '''' previous node is not a key node .... ..........                 the next node is note a key node  ''''''''''''''''''
            for(uuu = iii; uuu<expanded_node_count; uuu++){
           beam.nodes[uuu] = beam.nodes[(uuu + 1)];
        
            }
            expanded_node_count = expanded_node_count - 1;
            merge = true;
            
        }else{
        merge = false;
        
        }
        
        
        if(iii >= expanded_node_count){
        
        break;
        
       }
        
       }
        
    

}while(expanded_node_count > 800);


}

//console.log(expanded_node_count);

///'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
//'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
///'''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''



//'Figure out how many global DOF are constrained.
var conDOFcount = 0;
for(j = 0; j<itercons; j++){

con_type = beam.constraints[j].type;

switch(con_type){
case 0:
    conDOFcount = conDOFcount + 1;
    break;
case 1:
    conDOFcount = conDOFcount + 1;
    break;
case 2:
    conDOFcount = conDOFcount + 2;
    break;
case 3:
    conDOFcount = conDOFcount + 1;
    break;
case 4:
    conDOFcount = conDOFcount + 2;
    break;
}

}


var DOFindex = 0;


for(k = 0; k<itercons; k++){

	
		for(i = 0; i<expanded_node_count; i++){
		keepGoing = true;
		 if(Math.abs(beam.nodes[i] - Number(beam.constraints[k].xpos)) < 0.000000001 ){
		
			con_type = beam.constraints[k].type;
			
			switch (con_type){
			case 0:  //pinned constraint
				beam.condof[DOFindex] = 2 * i;
				beam.conval[DOFindex] = 0;
				DOFindex = DOFindex + 1;
				keepGoing = false;
				break;
			
			case 1:  //rotation only constraint.
				beam.condof[DOFindex] = 2 * i+1;
				beam.conval[DOFindex] = 0;
				DOFindex = DOFindex + 1;
				keepGoing = false;
				break;
			
			case 2:  //Fixed constraint
				beam.condof[DOFindex] = 2 * i;
				beam.condof[DOFindex+1] = 2 * i+1;
				beam.conval[DOFindex] = 0;
				beam.conval[DOFindex+1] = 0;
				DOFindex = DOFindex + 2;
				keepGoing = false;
				break;
			
			case 3:  //Specified value constraint. Constrain position only.
				beam.condof[DOFindex] = 2 * i;
				beam.conval[DOFindex] = Number(beam.constraints[k].presd);
				DOFindex = DOFindex + 1;
				keepGoing = false;
				break;
			
			case 4:  //Specified value constraint. Constrain position and rotation.
				beam.condof[DOFindex] = 2 * i;
				beam.condof[DOFindex+1] = 2 * i+1;
				beam.conval[DOFindex] = Number(beam.constraints[k].presd);
				beam.conval[DOFindex+1] = 0;
				DOFindex = DOFindex + 2;
				keepGoing = false;
				break;
			}
		
		  }
		  
		 if (!keepGoing) break;
		}
	

}


/////Order cons_DOFs

/////procedure bubbleSort( A : list of sortable items )

 do{
 swapped_done = false;
     for(i = 0; i<conDOFcount-1; i++){
      //if this pair is out of order */
       if(beam.condof[i] >beam.condof[i+1]){
                  //swap them and remember something changed
           //DOF number swap
         tempConDOF = beam.condof[i+1];
        beam.condof[i+1] =beam.condof[i];
         beam.condof[i] = tempConDOF;
            //DOF value
            
         tempCONValue =beam.conval[i+1];
         beam.conval[i+1] = beam.conval[i];
         beam.conval[i] = tempCONValue;
          swapped_done = true;
      }
  }
}while(swapped_done);

/////end sort

//console.log(beam.condof);

//console.log(beam.conval);


if((conDOFcount - itermomre) < 2 && (iterspr + conDOFcount - itermomre) < 2){
alert("Your Beam is not constrained. You have more hinges allowed for the number of DOF constraints.");

return false;

}




//Figure out numbers of nodal loads from moment, point loads and distributed loads.
NumberNodeloads = 0

NumberNodeloads = NumberNodeloads + iterpl;
NumberNodeloads = NumberNodeloads + iterml;

for(j = 0; j<iterdis; j++){

	for(i = 0; i<expanded_node_count; i++){
		if(beam.nodes[i] >= Number(beam.distribloads[j].startx) && (beam.nodes[i] <= Number(beam.distribloads[j].endx)  || Math.abs(beam.nodes[i] - Number(beam.distribloads[j].endx)) < 0.000000001) ){
		NumberNodeloads = NumberNodeloads + 2;
		}
	
	}

}


//console.log('Number of node loads ' + NumberNodeloads);


/////Initialize load_DOFs() and load_value()

for(i = 0; i<NumberNodeloads; i++){
beam.loaddof[i] = 0;
beam.loadval[i] = 0;
}

loadDOFindex = 0;

//get x value of load and loop through node array to find where the load is.

for(k = 0; k<iterpl; k++){  //loop through point loads and orgnize into load_DOF()

	for(i = 0; i<expanded_node_count; i++){
	
		if(Math.abs(beam.nodes[i] - Number(beam.forces[k].xpos)) < 0.000000001){
		
		beam.loaddof[loadDOFindex] = 2 * i;
		beam.loadval[loadDOFindex] = Number(beam.forces[k].val);
		loadDOFindex = loadDOFindex + 1;
		break;
		}
	
	}

}

//////////////////////////////////////////


for(k = 0; k<iterml; k++){ // loop through moment loads and orgnize into load_DOF()
//get x value of moment load and loop through node array to find where the moment is.

	for(i = 0; i<expanded_node_count; i++){
	
		if(Math.abs(beam.nodes[i] - Number(beam.moments[k].xpos)) < 0.000000001 ){
		
		beam.loaddof[loadDOFindex]  = 2 * i+1;
		beam.loadval[loadDOFindex] = Number(beam.moments[k].val);
		loadDOFindex = loadDOFindex + 1;
		break;
		
		}
	}
}


/////////////////////////////////


//''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
/////////////Loop through distributed loads and organize into load_DOF''''''''''
//''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''
//''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''''

for(k = 0; k<iterdis; k++){  //loop through distributed load loads and orgnize into load_DOF()
// get x value of moment load and loop through node array to find where the moment is.

					if(Number(beam.distribloads[k].startx) > Number(beam.distribloads[k].endx)){
					   alert("You have an input error for the distributed load definition. Make sure x-start is less than x-end"); 
					   return false;
					   }
	


// 'calculate slope of the q curve
var mdis;
var l_e_right;
var l_e_left;
var p_local_right;
var p_local_left;

mdis = (Number(beam.distribloads[k].endq) - Number(beam.distribloads[k].startq)) / (Number(beam.distribloads[k].endx) - Number(beam.distribloads[k].startx));

	for(i = 0; i<expanded_node_count; i++){  //'looping through nodes to find where the distributed load is
			if(beam.nodes[i] >= Number(beam.distribloads[k].startx) && beam.nodes[i] <= Number(beam.distribloads[k].endx) ||  Math.abs(beam.nodes[i] - Number(beam.distribloads[k].endx)) < 0.000000001){
			
			beam.loaddof[loadDOFindex] = 2 * i; 
			beam.loaddof[loadDOFindex+1] = 2 * i+1;
			
			//to get the load at each node the average distributed load must be calculated.
			//determine if its an start node middle node or end node of distributed load.
			
			
				//if start node:
				if(beam.nodes[i] ===  Number(beam.distribloads[k].startx) || Math.abs(beam.nodes[i] - Number(beam.distribloads[k].startx)) < 0.00000001 ){
				//console.log("Load DOF INDEX " + loadDOFindex);
                                 

					//calculate length of local element l_e to the right of node in question
					l_e_right = beam.nodes[(i + 1)] - beam.nodes[i];
					
					p_local_right =  Number(beam.distribloads[k].startq) + mdis * ((beam.nodes[i]) + (l_e_right / 2));
					
					  //console.log("LeRight " + l_e_right + ' plocal right ' + p_local_right );
					  
					beam.loadval[loadDOFindex] = p_local_right * l_e_right / 2;
					beam.loadval[loadDOFindex+1]= p_local_right * Math.pow(l_e_right ,2) / 12;
				
				
				///'if middle node:
				}else if(beam.nodes[i] > Number(beam.distribloads[k].startx)  && beam.nodes[i] < Number(beam.distribloads[k].endx) && Math.abs(beam.nodes[i] - Number(beam.distribloads[k].endx)) > 0.00000001 ){
				
					//'calculate length of local element l_e to the left of node in question
					l_e_left = beam.nodes[i] - beam.nodes[(i - 1)];
					
					///'calculate length of local element l_e to the left of node in question
					l_e_right = beam.nodes[(i + 1)] - beam.nodes[i];
					
					
					p_local_left =  Number(beam.distribloads[k].startq) + mdis * ((beam.nodes[i] - Number(beam.distribloads[k].startx)) - (l_e_left / 2));
					
					p_local_right = Number(beam.distribloads[k].startq) + mdis * ((beam.nodes[i] - Number(beam.distribloads[k].startx)) + (l_e_right / 2));
					
					
					beam.loadval[loadDOFindex] = (p_local_right * l_e_right / 2) + (p_local_left * l_e_left / 2);
					beam.loadval[loadDOFindex+1] = (p_local_right * Math.pow(l_e_right , 2) / 12) + (-p_local_left * Math.pow(l_e_left , 2) / 12);
					
				//'if end node of load distribution:
				}else if( beam.nodes[i] === Number(beam.distribloads[k].endx) || Math.abs(beam.nodes[i] - Number(beam.distribloads[k].endx)) < 0.00000001 ){
				
					//'calculate length of local element l_e to the right of node in question
					l_e_left = beam.nodes[i] - beam.nodes[(i - 1)];
					
					p_local_left =  Number(beam.distribloads[k].startq) + mdis * ((beam.nodes[i]  - Number(beam.distribloads[k].startx)) - (l_e_left / 2));
					
					beam.loadval[loadDOFindex] =  (p_local_left * l_e_left) / 2;
					beam.loadval[loadDOFindex+1] = -p_local_left * Math.pow(l_e_left , 2) / 12;
				}
			
			
			loadDOFindex = loadDOFindex + 2;
			
			}
	}
	
}


loadDOFindex = loadDOFindex - 1
//'procedure bubbleSort( A : list of sortable items )


do{
 swapped_done = false;
     for(i = 0; i< (loadDOFindex - 1); i++){
      // 'if this pair is out of order */
       if( beam.loaddof[i] >  beam.loaddof[(i+1)]){
          // 'swap them and remember something changed
          // 'DOF number swap
         tempLoadDOF = beam.loaddof[(i+1)];
         beam.loaddof[(i+1)] = beam.loaddof[i];
         beam.loaddof[i] = tempLoadDOF;
          //  'DOF value
         tempLoadValue = beam.loadval[(i+1)];
         beam.loadval[(i+1)] = beam.loadval[i];
         beam.loadval[i] = tempLoadValue;
          swapped_done = true;
      }
  }
}while(swapped_done);

////'end sort


//console.log('LoadDOF INDEX ' + loadDOFindex);
merged = 0;

//'Merge load_DOFs and loads
do{
 merge_done = false;
  for(i = 0; i<(loadDOFindex - merged); i++){
      // 'if this pair is out of order */
       if(beam.loaddof[i] === beam.loaddof[i+1]){
      
      // 'move all nodes up and subtract node count
        for(j = i; j<(loadDOFindex - merged)+1; j++){
         beam.loaddof[j] = beam.loaddof[j+1];
         if(j === i ){
         beam.loadval[j] =  beam.loadval[j]  +  beam.loadval[j+1]; 
         merged = merged + 1;
         }else{
         beam.loadval[j] =  beam.loadval[j+1]; 
         }
         
       }

        // 'merge load
          merge_done = true  //'keep looping
      }     
  }
}while(merge_done);

//console.log('Number of merges ' + merged);


totalDOFloads = NumberNodeloads - merged;
	

//'''''''''''''''''''''''''''''''''''''''''''''
//'--------------------------------------------
//'Fill material array:
//'--------------------------------------------
//'''''''''''''''''''''''''''''''''''''''''''''

var el_inertia = [];
var el_E = [];
var prop = [];
var mprop;

//console.log("NODE COUNT " + expanded_node_count);
for(j = 0; j<(expanded_node_count - 1); j++){


	for(i = 0; i<iterprop; i++){
	
	mprop = (Number(beam.props[i].endI) - Number(beam.props[i].startI)) / (Number(beam.props[i].endx) - Number(beam.props[i].startx));
	
		if( Number(beam.props[i].endI) === ""){
		mprop = 0;
		}
		
		if(beam.nodes[(j + 1)] > Number(beam.props[i].startx) && (beam.nodes[(j + 1)]<= Number(beam.props[i].endx) || Math.abs(beam.nodes[(j + 1)] - Number(beam.props[i].endx) ) < 0.000000001)){
		  el_E[j] = i;
		 
		    if(mprop === 0){
		        el_inertia[j] = Number(beam.props[i].startI);
		    }else{
		
		        el_inertia[j] = Number(beam.props[i].startI) - mprop * Number(beam.props[i].startx) + mprop * (beam.nodes[j] + (beam.nodes[(j + 1)] - beam.nodes[j] ) / 2);
		
		    }
		
		
		}
	
	}
	
}



for(j = 0; j<(expanded_node_count - 1); j++){
 if(j === 0){
beam.elements = [{nd1: j, nd2: j+1, elE: el_E[j], elI: el_inertia[j]}];

 }else{
 beam.elements[j] = {nd1: j, nd2: j+1, elE: el_E[j], elI: el_inertia[j]};

 }

}




//''''''''''''''''''''''''''''''''''''''''''''''
//'''''''''''Organize Moment release data''''''''
//'''''''''''''''''''''''''''''''''''''''''''''''
//'''''''''''''''''''''''''''''''''''''''''''''''

//'Figure out numbers of moment releases.

//'Initialize Moment_Release_DOFs()
for(i = 0; i<itermomre; i++){
	if(i === 0){
		beam.momredof = [0];
	}else{
	    beam.momredof[i] = 0;
	} 
}

momreDOFindex = 0;

// 'get x value of moment release and loop through node array to find where the moment release is.

for(k = 0; k<itermomre; k++){ // 'loop through moment releases and orgnize into Moment_Release_DOFs(i)

	 for(i = 0; i<(expanded_node_count); i++){
	
		 if( Math.abs(beam.nodes[i] - Number(beam.momentrels[k].xpos)) < 0.000000001 ){
		 
		 beam.momredof[momreDOFindex] = 2 * i;   //'' This is the translational DOF...
		 momreDOFindex = momreDOFindex + 1;
		 
		 break;
		
		}
	}

}



//''''''''''''''''''''''''''''''''''''''''''''''''
//'''''''''''Organize Spring Data''''''''''''''''''
//'''''''''''''''''''''''''''''''''''''''''''''''


//'Initialize Spring Data arrays
for(i = 0; i<iterspr; i++){
	if(i === 0){
	beam.springdof = [0];
	beam.springval = [0];
	}else{
	beam.springdof[i] = 0;
	beam.springval[i] = 0;
	}
}

//'get x value of moment release and loop through node array to find where the moment release is.

sprDOFindex = 0;

for(k = 0; k<iterspr; k++){  //'loop through moment releases and orgnize into Moment_Release_DOFs(i)

 for(i = 0; i< expanded_node_count; i++){

	  if(Math.abs(beam.nodes[i] - Number(beam.springs[k].xpos)) < 0.000000001 ){
	
		if( beam.springs[k].type === 0){
		beam.springdof[sprDOFindex]  = 2 * i;  //'' This is the translational DOF...
		beam.springval[sprDOFindex]= Number(beam.springs[k].k); //'' Stiffness
		}else{
		beam.springdof[sprDOFindex]  = 2 * i+1;  //'' This is the rotational DOF..
		beam.springval[sprDOFindex]= Number(beam.springs[k].k);  //'' Stiffness
		}
		
	sprDOFindex = sprDOFindex + 1;
	break;
	
	}
    }
}


beam.NN = expanded_node_count;
beam.NE = expanded_node_count-1;
beam.NM = iterprop;
beam.NDIM = 1;
beam.NEN = 2;
beam.NDN = 2;
beam.ND = conDOFcount;
beam.NL = totalDOFloads;
beam.NMOMRE = itermomre;
beam.NSPR = iterspr;




if(errors){
return false;
}else{
return true;
}




}