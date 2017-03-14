<?php
$html = file_get_contents(__DIR__ . '/index.html');
$token = '<title>edb-frontend</title>';
$template_directory = get_bloginfo('template_directory');
$blogname = get_bloginfo('blogname');
$token_replacement = "<base href=\"$template_directory/\"><title>$blogname</title>";

$current_user = wp_get_current_user(); 
if ( !(is_user_logged_in()) ){
  $current_user = null;
}

ob_start();
wp_head();
$wphead = ob_get_contents();
ob_end_clean();

$json_user = json_encode( $current_user );
$user_embed = "$wphead<script type=\"text/javascript\">window.CurrentUser= $json_user;</script>";

echo str_replace($token,"$token_replacement\n$user_embed",$html);
var_dump($_COOKIE);

