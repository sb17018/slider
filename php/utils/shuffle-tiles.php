<?php

// to get $numberOfColumn
include("../../included-parts/column-nr-reader.php");

define("SLIDER_WIDTH", 500/$numberOfColumn);

$tilesSequenceMatrix = array();
$sequence = 0;
for ($i = 1; $i <= $numberOfColumn; $i++) {
    $innerArray = array();
    for ($j = 1; $j <= $numberOfColumn; $j++) {
        // $imgNr = ++$sequence < 10 ? ("0" . $sequence) : $sequence;
        if ($i == $numberOfColumn && $j == $numberOfColumn) {
            array_push($innerArray, null);
        } else {
            array_push($innerArray, ++$sequence);
        }
    }
    array_push($tilesSequenceMatrix, $innerArray);
}

define("SHIFTING_DIRECTION", array("L", "A", "R", "B"));
$columnOfNull = $numberOfColumn - 1;
$rowOfNull = $numberOfColumn - 1;
for ($i = 0; $i < pow($numberOfColumn, 5); $i++) {
    $shiftDirection = null;
    while ($shiftDirection == null) {
        $shiftDirectionPointer = SHIFTING_DIRECTION[rand(0, count(SHIFTING_DIRECTION) - 1)];
        // echo $shiftDirectionPointer;
        switch ($shiftDirectionPointer) {
            case 'L':
                if ($columnOfNull > 0) {
                    // echo $tilesSequenceMatrix[$rowOfNull][$columnOfNull]."<br/>";
                    $tilesSequenceMatrix[$rowOfNull][$columnOfNull] = $tilesSequenceMatrix[$rowOfNull][$columnOfNull - 1];
                    $tilesSequenceMatrix[$rowOfNull][$columnOfNull - 1] = null;
                    $columnOfNull -= 1;
                    $shiftDirection = 'L';
                } else {
                    $shiftDirection = null;
                }
                break;
            case "A":
                if ($rowOfNull > 0) {
                    // echo $tilesSequenceMatrix[$rowOfNull][$columnOfNull]."<br/>";
                    $tilesSequenceMatrix[$rowOfNull][$columnOfNull] = $tilesSequenceMatrix[$rowOfNull - 1][$columnOfNull];
                    $tilesSequenceMatrix[$rowOfNull - 1][$columnOfNull] = null;
                    $rowOfNull -= 1;
                    $shiftDirection = "A";
                } else {
                    $shiftDirection = null;
                }
                break;
            case "R":
                if ($columnOfNull < $numberOfColumn - 1) {
                    // echo $tilesSequenceMatrix[$rowOfNull][$columnOfNull]."<br/>";
                    $tilesSequenceMatrix[$rowOfNull][$columnOfNull] = $tilesSequenceMatrix[$rowOfNull][$columnOfNull + 1];
                    $tilesSequenceMatrix[$rowOfNull][$columnOfNull + 1] = null;
                    $columnOfNull += 1;
                    $shiftDirection = "R";
                } else {
                    $shiftDirection = null;
                }
                break;
            case "B":
                if ($rowOfNull < $numberOfColumn - 1) {
                    // echo $tilesSequenceMatrix[$rowOfNull][$columnOfNull]."<br/>";
                    $tilesSequenceMatrix[$rowOfNull][$columnOfNull] = $tilesSequenceMatrix[$rowOfNull + 1][$columnOfNull];
                    $tilesSequenceMatrix[$rowOfNull + 1][$columnOfNull] = null;
                    $rowOfNull += 1;
                    $shiftDirection = "B";
                } else {
                    $shiftDirection = null;
                }
                break;
        }
    }
}

$shuffledTiles = "";
$sequence = 0;

for ($i = 0; $i < $numberOfColumn; $i++) {
    for ($j = 0; $j < $numberOfColumn; $j++) {
        $shuffledSequence = $tilesSequenceMatrix[$i][$j];
        $imgNr = $shuffledSequence < 10 ? ("0" . $shuffledSequence) : $shuffledSequence;
        $shuffledTiles .= "<div class='slider' data-row=" . $i . " data-column=" . $j . " data-sequence=" . ++$sequence . " style='width:" . SLIDER_WIDTH . "px; height:" . SLIDER_WIDTH . "px;'";
        if ($shuffledSequence == null) {
            $shuffledTiles .= " data-empty='true'>";
        } else {
            $shuffledTiles .= "><img src = 'img-trimmed/pic-trimmed_" . $imgNr . ".jpg' class='img-to-shift' width=" . SLIDER_WIDTH . "px data-sequence=" . $shuffledSequence . " onclick='movePiece(this, false)'/>";
        }
        $shuffledTiles .= "</div>";
    }
}

$fileName = "../../files/shuffled-list.txt";

$openedToWriteFile = fopen($fileName, "w") or die("Unable to open file!");
fwrite($openedToWriteFile, $shuffledTiles);
fclose($openedToWriteFile);

echo $shuffledTiles;

?>