<?php
$html = file_get_contents(__DIR__ . '/index.html');
$token = '<title>edb-frontend</title>';
$template_directory = get_bloginfo('template_directory');
$blogname = get_bloginfo('blogname');
$token_replacement = "<base href=\"$template_directory/\"><title>$blogname</title>";
echo str_replace($token,$token_replacement,$html);