<?php

class Result
{
    public $playerName;
    public $time;
    public $moves;
}

$playerName = $_POST['playerName'];
$time = $_POST['time'];
$moves = $_POST['moves'];

$result = new Result();
$result->playerName = $playerName;
$result->time = $time;
$result->moves = $moves;

$results = array();

$fileName = "../files/results.txt";


$resultPosition = 0;
if (file_exists($fileName) && filesize($fileName) > 0) {
    $openedToReadFile = fopen($fileName, "r") or die("Unable to open file!");
    $readFile = fread($openedToReadFile, filesize($fileName));
    $results = json_decode($readFile);
    fclose($openedToReadFile);
    $resultPosition = count($results);
    //to place new result in sequence of timimgs
    for ($i = 0; $i < count($results); $i++) {
        if (intval($results[$i]->time) == intval($result->time)) {
            if (intval($results[$i]->moves) > intval($result->moves)) {
                $resultPosition = $i;
                break;
            }
        } else if (intval($results[$i]->time) > intval($result->time)) {
            $resultPosition = $i;
            break;
        }
    }
    array_splice($results, $resultPosition, 0, array($result));
} else {
    array_push($results, $result);
}

$openedToWriteFile = fopen($fileName, "w") or die("Unable to open file!");
fwrite($openedToWriteFile, json_encode($results));
fclose($openedToWriteFile);

$table = "<table id='resultsTable'><thead><tr><th>Miejsce</th><th>Gracz</th><th>Czas</th><th>Ruchy</th></tr></thead><tbody><tr><td>1</td><td>Chuck Norris</td><td>00:00:00:01</td><td>01</td></tr>";
$rowNr = 1;
foreach ($results as $res) {
    $rowClass = "";
    if ($result->playerName == $res->playerName) {
        $rowClass = " class='my-result'";
    }
    $table .= "<tr" . $rowClass . "><td>" . ++$rowNr . "</td><td>" . $res->playerName . "</td><td>" . convTime($res->time) . "</td><td>" . ($res->moves < 10 ? ("0" . $res->moves) : $res->moves) . "</td></tr>";
}
$table .= "</tbody></table";
echo $table;


function convTime($time)
{
    $centsec = $time % 100;
    $centsecNota = $centsec < 10 ? "0" . $centsec : $centsec;
    $sec = intval($time / 100) % 60;
    $secNota = $sec < 10 ? "0" . $sec : $sec;
    $min = intval(intval($time / 100) / 60) % 60;
    $minNota = $min < 10 ? "0" . $min : $min;
    $hour = intval(intval(intval($time / 100) / 60) / 60);
    $hourNota = $hour < 10 ? "0" . $hour : $hour;
    return
        $hourNota . ":" . $minNota . ":" . $secNota . ":" . $centsecNota;
}
exit;
?>