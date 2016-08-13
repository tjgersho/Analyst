<?php
session_start();
?>
<!-- Modal -->
<div id="contactUs" class="modal fade" role="dialog">
  	    <div class="modal-dialog modal-sm">

   	  <!-- Modal content-->
   	    <div class="modal-content">
    		   <div class="modal-header">
       		    <button type="button" class="close" data-dismiss="modal">&times;</button>
      		    <h4 class="modal-title">Contact Us</h4>
      	          </div>
      	          
      	          <div class="modal-body">
                <form name="contactusForm"  class="form-horizontal" role="form"  style="text-align:center;" novalidate>
      		
               <fieldset>
      		


				    <h2>We want to hear what you think:</h2> 
					<p  class="alert-danger" ng-show="contactusCtrl.error1" ng-bind="contactusCtrl.error1"></p>
					
					
					    <div>
				<div class="control-group">
  <label class="control-label" for="firstname">First Name:</label><br />
				<input type="text" id="firstname" name="firstname"  ng-model="firstname"   required/><br />
				 <span style="color:red" ng-show="contactusForm.firstname.$dirty && contactusForm.firstname.$invalid">
                         <p class="help-block text-warning" ng-if="contactusForm.firstname.$error.required">Enter your first name</p>
                   
                         </span>
                         </div>

				<br />
				<div class="control-group">
  <label class="control-label" for="lastname">Last Name:</label><br />
				<input type="text" id="lastname" name="lastname" ng-model="lastname" /><br />
				 </div>

				<br />
				<div class="control-group">
  <label class="control-label" for="email">Email Address:</label> <br />
				 <input type="email" id="email" name="email" ng-model="email"  required/><br />
				<span style="color:red" ng-show="contactusForm.email.$dirty && contactusForm.email.$invalid">
                         <p class="help-block text-warning" ng-if="contactusForm.email.$error.required">Enter your email</p>
                         <p class="help-block text-warning" ng-if="contactusForm.email.$error.email">Entry must be a valid email</p>
                         </span>
                         </div>

				<br />	
				<div class="control-group">
  <label class="control-label" for="comment">Comment:</label><br />
				<textarea rows="4"  id="comment" name="comment"  ng-model="comment"  required></textarea><br />
				<span style="color:red" ng-show="contactusForm.comment.$dirty && contactusForm.comment.$invalid">
                         <p class="help-block text-warning" ng-if="contactusForm.comment.$error.required">Enter a comment</p>
                  
                         </span>
                         </div>

				<br />
				
				<?php
				 echo '<img src="';
				 echo 'captcha_code_file.php?rand=';
				 echo rand(); 
				 echo '" id="captchaimg" >';
				 ?>
				<br />
				Enter the code above here:<br /> <input id="letters_code" name="letters_code" ng-model="letters_code" type="text" required /> 
				 <br />
				<small>Can't read the image? click <a href='javascript: refreshCaptcha();'>here</a> to refresh</small>
				
					
<script language='JavaScript' type='text/javascript'>
function refreshCaptcha()
{
    var img = document.images['captchaimg'];
    img.src = img.src.substring(0,img.src.lastIndexOf("?"))+"?rand="+Math.random()*1000;
}
</script>

					<br /><br />
				       
				       </div>
				
				  <!--<div> Form is Valid: {{contactusForm.$valid}} </div>  -->
			 </fieldset>
               </form>	
               
		 </div>  <!-- End of Modal Form Body -->
		
               		 <div class="modal-footer">
       				 <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
       				  <button type="button" class="btn btn-primary" ng-click="contactusCtrl.ctus_submit()" ng-disabled="contactusForm.$invalid">Add</button>
                	</div>
  
      </div>

     </div>
</div>