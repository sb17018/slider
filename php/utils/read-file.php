<?php

session_start();
$player = null;
if (isset($_SESSION["player"])) {
    $player = $_SESSION["player"];
}

$absolute_path = getcwd();

$folderStructure = explode("\\", $absolute_path);

$pathToFile = "";

for($i = 0; $i < count($folderStructure); $i++){
    if($folderStructure[$i] == "php"){
        break;
    }
    $pathToFile .= $folderStructure[$i]."/";
}

$fileName = $pathToFile."files/results.txt";

$openedToReadFile = fopen($fileName, "r") or die("Unable to open file!");
$readFile = fread($openedToReadFile, filesize($fileName));
$results = json_decode($readFile);
fclose($openedToReadFile);

$keyValueArrayOfResults = get_object_vars($results);

$allPlayers = array_keys($keyValueArrayOfResults);
$allTimesAndMoves = array_values($keyValueArrayOfResults);

$table = "<table id='resultsTable'><thead><tr><th>Miejsce</th><th>Czas</th><th>Ruchy</th><th>Gracz</th></tr></thead><tbody><tr><td>1</td><td>00:00:00:01</td><td>01</td><td>Chuck Norris</td></tr>";
$positionNr = 2;
$rowNr = 1;
$rowsSpanned = 1;
for ($playerPosition = 0; $playerPosition < count($allPlayers); $playerPosition++) {

    $playerName = $allPlayers[$playerPosition];
    $time = $allTimesAndMoves[$playerPosition][0];
    $moves = $allTimesAndMoves[$playerPosition][1];
    $movesToDisplay = $moves < 10 ? ("0" . $moves) : $moves;
    $table .= "<tr";
    if ($player == $playerName) {
        $table .= " class='my-result'";
    }
    $table .= "><td";
    if ($rowsSpanned > 1) {
        $table .= " rowspan='" . $rowsSpanned . "'";
    }
    $table .= ">" . ++$rowNr . "</td><td";
    if ($rowsSpanned > 1) {
        $table .= " rowspan='" . $rowsSpanned . "'";
    }
    $table .= ">" . convTime($time) . "</td><td";
    if ($rowsSpanned > 1) {
        $table .= " rowspan='" . $rowsSpanned . "'";
    }
    $table .= ">" . $movesToDisplay . "</td><td";
    $table .= ">" . $playerName . "</td></tr>";

}
$table .= "</tbody></table>";
echo $table;


function convTime($time)
{
    $centsec = intval($time) % 100;
    $centsecNota = $centsec < 10 ? "0" . $centsec : $centsec;
    $sec = intval($time) / 100 % 60;
    $secNota = $sec < 10 ? "0" . $sec : $sec;
    $min = intval(intval($time) / 100 / 60) % 60;
    $minNota = $min < 10 ? "0" . $min : $min;
    $hour = intval(intval(intval($time) / 100 / 60) / 60);
    $hourNota = $hour < 10 ? "0" . $hour : $hour;
    return
        $hourNota . ":" . $minNota . ":" . $secNota . ":" . $centsecNota;
}
session_destroy();
// exit;
?>