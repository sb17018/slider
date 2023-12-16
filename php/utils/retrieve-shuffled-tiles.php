<?php

$fileName = "../../files/shuffled-list.txt";

$openedToReadFile = fopen($fileName, "r") or die("Unable to open file!");
$readFile = fread($openedToReadFile, filesize($fileName));
$shuffledTiles = $readFile;
fclose($openedToReadFile);

echo $shuffledTiles;

?>