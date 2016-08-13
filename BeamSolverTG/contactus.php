<?php

session_start();
  require_once('connectvars.php');// Show the navigation menu

  $dbc = mysqli_connect(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME);
  
if($_SERVER['REQUEST_METHOD']=='POST'){
$postdata = file_get_contents("php://input");
$request = json_decode($postdata);
}
 
// $firstname = mysqli_real_escape_string($dbc, trim($_POST['firstname']));
//  $lastname = mysqli_real_escape_string($dbc, trim($_POST['lastname']));
//  $email = mysqli_real_escape_string($dbc, trim($_POST['email']));
//  $comment = mysqli_real_escape_string($dbc, trim($_POST['comment']));


$firstname = $request->firstname;
$lastname = $request->lastname;
$email = $request->email;
$comment = $request->comment;
$captcha = $request->captcha;

$error = '321';
    
    $errormsg  = '';
   

$status = 'OK';

$error = '321';
    
    $errormsg  = '';
    
    
    
    
      if(empty($_SESSION['6_letters_code'] ) ||   strcasecmp($_SESSION['6_letters_code'], $captcha) != 0)   {     
          //Note: the captcha code is compared case insensitively.      
          //if you want case sensitive match, update the check above to      
          // strcmp()     
          $error = '123';
          $errormsg .= "The captcha code does not match! ";  
         
          $status= 'NOTOK';
          
          }   
    
     

	if (!eregi("^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,3})$", $email))
	{ // checking your email
	$error = '123';
$errormsg .='Your email address was not entered correctly';
$status= 'NOTOK';
} 



if ($status=='OK'){

 if($email!= ""  && $firstname!= "" && $comment!= "" ){
 
 
 	$query = "INSERT INTO contactus (firstname, lastname, email, comment, approved) VALUES ('" . $firstname . "', '" . $lastname . "','" . $email . "','" . $comment . "', 0)";
        mysqli_query($dbc, $query);
			
			 
     $to = "travis.g@cirrusidea.com , travis.g@paradigmmotion.com";
	$subject = "beamSolver - Comment";
	$message = "
 <html>
 <head>
 <title>New Comment</title>
 </head>
 <body>
 <p><br /><br />Travis, there is a new comment on beamSolver: <br /><br />Comment: <br /><br />" .
 $comment . 
 "&nbsp;<br /> <br />From: " .
 $firstname .  "  " . $lastname .
 "&nbsp;<br /><br /> Email: " .
 $email .
 "</p>
 </body>
 </html>";
 
 $headers = "MIME-Version: 1.0" . "\r\n";
 $headers .= "Content-type:text/html;charset=iso-8859-1" . "\r\n";
 
// More headers
 $headers .= 'From: <webmaster@beamsolver.com>' . "\r\n";

	mail($to,$subject,$message,$headers);
    

 }else{
 
 $error = '123';
 $errormsg = 'Please enter your Email, Name and a Comment';

 }
 
 
 
 }
 
 


 
echo '{"eRRor": "' .$error. '",';

echo '"errormsg": "'.$errormsg.'"}';

exit();

?> 
