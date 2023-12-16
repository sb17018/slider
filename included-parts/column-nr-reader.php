<?php

$absolute_path = getcwd();

$folderStructure = explode("\\", $absolute_path);

$pathToFile = "";

for($i = 0; $i < count($folderStructure); $i++){
    if($folderStructure[$i] == "php"){
        break;
    }
    $pathToFile .= $folderStructure[$i]."/";
}

$fileName = $pathToFile."files/row-column-nr.txt";

// set number of tiles in row and column
$numberOfColumn = 0;
if (file_exists($fileName) && filesize($fileName) > 0) {
    $openedToReadFile = fopen($fileName, "r") or die("Unable to open file!");
    $readFile = fread($openedToReadFile, filesize($fileName));
    $numberOfColumn = json_decode($readFile);
    fclose($openedToReadFile);
}

?>