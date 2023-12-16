<?php

session_start();

class Result
{
}

$playerName = $_POST['playerName'];
$time = $_POST['time'];
$moves = $_POST['moves'];

$_SESSION["player"] = $playerName;

$fileName = "../../files/results.txt";

if (file_exists($fileName) && filesize($fileName) > 0) {
    $openedToReadFile = fopen($fileName, "r") or die("Unable to open file!");
    $readFile = fread($openedToReadFile, filesize($fileName));
    $results = json_decode($readFile);
    fclose($openedToReadFile);

    $keyValueArrayOfResults = get_object_vars($results);

    $allPlayers = array_keys($keyValueArrayOfResults);
    $allTimesAndMoves = array_values($keyValueArrayOfResults);

    $existingPlayerIndex = array_search($playerName, $allPlayers);

    // compare entered values to existing ones
    for ($i = 0; $i < count($allTimesAndMoves); $i++) {
        // check if new time is less OR new time is equal but moves are fewer
        if ($allTimesAndMoves[$i][0] > $time || ($allTimesAndMoves[$i][0] == $time && $allTimesAndMoves[$i][1] > $moves)) {
            // check if it's the same player's record
            array_splice($allTimesAndMoves, $i, 0, array(array($time, $moves)));
            array_splice($allPlayers, $i, 0, array($playerName));
            // check if user player is reorded further in the list
            if ($existingPlayerIndex != "") {
                // remove their record
                unset($allTimesAndMoves[$existingPlayerIndex + 1]);
                unset($allPlayers[$existingPlayerIndex + 1]);
            }
            $results = array_combine($allPlayers, $allTimesAndMoves);
            break;
        }
        if ($i == count($allTimesAndMoves) - 1) {
            if ($existingPlayerIndex == "") {
                $results->$playerName = array($time, $moves);
            }
        }
    }
} else {
    $results = new Result();
    $results->$playerName = array($time, $moves);
}

$openedToWriteFile = fopen($fileName, "w") or die("Unable to open file!");
fwrite($openedToWriteFile, json_encode($results));
fclose($openedToWriteFile);

header("Location: ./read-file.php");
exit(0);
?>