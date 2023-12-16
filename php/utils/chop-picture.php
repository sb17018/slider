<?php

// to get $numberOfColumn
include("../../included-parts/column-nr-reader.php");

$fileName = "../files/row-column-nr.txt";

// Create an image from given image 
$im = imagecreatefromjpeg(
    "../../img/nabo.jpg");

// find the size of image 
$size = min(imagesx($im), imagesy($im));

// set tile size
$tileSize = $size / $numberOfColumn;

$dir = '../../img-trimmed';
$files = scandir($dir);
if (count($files) != 0) {
    // Folder path to be flushed 

    // List of name of files inside specified folder 
    $files = glob($dir . '/*');

    // Deleting all the files in the list 
    foreach ($files as $file) {

        if (is_file($file)) {
            // Delete the given file 
            unlink($file);
        }
    }
}

// Set the crop image size
$count = 0;
for ($i = 0; $i < $numberOfColumn; $i++) {
    for ($j = 0; $j < $numberOfColumn; $j++) {
        $im2 = imagecrop($im, ['x' => $tileSize * $j, 'y' => $tileSize * $i, 'width' => $tileSize, 'height' => $tileSize]);
        $tileNr = ++$count < 10 ? "0" . $count : $count;
        if ($im2 !== FALSE) {
            header("Content-type: image/jpg");
            imagejpeg($im2, '../../img-trimmed/pic-trimmed_' . $tileNr . '.jpg');
            imagedestroy($im2);
        }
    }
}

imagedestroy($im);
?>