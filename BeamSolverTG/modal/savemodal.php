<?php
if (!empty($_SERVER['HTTP_CLIENT_IP'])) {
    $ip = $_SERVER['HTTP_CLIENT_IP'];
} elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
    $ip = $_SERVER['HTTP_X_FORWARDED_FOR'];
} else {
    $ip = $_SERVER['REMOTE_ADDR'];
}
?>
	<!-- Modal -->
	<div id="SaveFile" class="modal fade" role="dialog">
  	    <div class="modal-dialog modal-sm">

   	  <!-- Modal content-->
   	    <div class="modal-content">
    		   <div class="modal-header">
       		    <button type="button" class="close" data-dismiss="modal">&times;</button>
      		    <h4 class="modal-title">Saved Files</h4>
      	          </div>
      	          
      	        
                <form name="saveForm"  class="form-inline" role="form"  novalidate>
      		 
      		  <div class="modal-body">
                  
                  <div ng-show="saveCtrl.saved.files.length">Your saved files:</div>
                  <div class="list-group">

                 <div ng-repeat="savedFiles in saveCtrl.saved.files">
                                       
                          <div class="list-group-item" style="height:50px;">  <p class="list-group-item-text">{{savedFiles.name}} 
                               <button id="opensavedFile_{{savedFiles.name}}"  class="btn btn-info btn-sm" ng-click="saveCtrl.open($index)" style="float:right;" >Open</button>
                               <button id="deletesavedFile_{{savedFiles.name}}"  class="btn btn-danger btn-sm" ng-click="saveCtrl.delete($index)" style="float:right;">Delete</button>
                               <br /></p>
                               </div>
                 </div>
                 </div>
                                 
                 
                 <!--<div id="newfilenamepreview" ng-bind="newfilename"></div>-->
                 
                  <div class="row">
                     <div class="col-xs-12">
                     
                      <div class="form-group">
                         <label>New File Name:</label>
                       
                              <input type="text" name="newfilename" placeholder="File Name" id="newfilename"  ng-model="newfilename"  style="width:100%;" required/>                         
                   
                          <span style="color:red" ng-show="saveForm.newfilename.$dirty && saveForm.newfilename.$invalid">
                         <p class="help-block text-warning" ng-if="saveForm.newfilename.$error.required">Enter filename</p>
                         </span>
                       </div>
                    </div>
                   </div>
                     
                                                                                                                                      
                    <div ng-show="saveForm.error1">You already have a file with this name.</div>
                    
                    
	                	 </div>  <!-- End of Modal Form Body -->
                       
               		 <div class="modal-footer">
       				 <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
       				 <button type="button" class="btn btn-primary" ng-click="saveCtrl.submit()" ng-disabled="saveForm.$invalid">Save</button>

                	</div>
                 </form>
                  
           </div>

          </div>
	</div>