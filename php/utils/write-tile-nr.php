<?php

$tileNumber = $_POST['tileNumber'];

$fileName = "../../files/row-column-nr.txt";

$openedToWriteFile = fopen($fileName, "w") or die("Unable to open file!");
fwrite($openedToWriteFile, $tileNumber);
fclose($openedToWriteFile);

header("Location: ./chop-picture.php");
exit(0);
?>