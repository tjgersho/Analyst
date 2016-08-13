<?php
if (!empty($_SERVER['HTTP_CLIENT_IP'])) {
    $ip = $_SERVER['HTTP_CLIENT_IP'];
} elseif (!empty($_SERVER['HTTP_X_FORWARDED_FOR'])) {
    $ip = $_SERVER['HTTP_X_FORWARDED_FOR'];
} else {
    $ip = $_SERVER['REMOTE_ADDR'];
}



require_once('connectvars.php');// Show the navigation menu

$dbc = mysqli_connect(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME);
  
 
if($_SERVER['REQUEST_METHOD']=='POST'){
$postdata = file_get_contents("php://input");
$request = json_decode($postdata);
}



$query = "DELETE FROM savedfiles WHERE name = '".$request->filename."' AND ip_address = '".$ip ."'";
        mysqli_query($dbc, $query);


exit();

?>