<!DOCTYPE html>
<html lang="en">

<head>
  <?php
  include("included-parts/header.html");
  ?>
  <script src="js/scripts.js" defer></script>
</head>

<body>
  <main>
    <div id="tilePlacement">
      <?php

      include("included-parts/column-nr-reader.php");

      define("SLIDER_WIDTH", 500 / $numberOfColumn);

      $tilesSequenceMatrix = array();

      $tiles = "";
      $sequence = 0;
      for ($i = 1; $i <= $numberOfColumn; $i++) {
        $innerArray = array();
        for ($j = 1; $j <= $numberOfColumn; $j++) {
          $imgNr = ++$sequence < 10 ? ("0" . $sequence) : $sequence;
          $tiles .= "<div class='slider' data-row=" . $i . " data-column=" . $j . " data-sequence=" . $sequence . " style='width:" . SLIDER_WIDTH . "px; height:" . SLIDER_WIDTH . "px;'>
          <img src = './img-trimmed/pic-trimmed_" . $imgNr . ".jpg' width=" . SLIDER_WIDTH . "px data-sequence=" . $sequence;
          if ($i == $numberOfColumn && $j == $numberOfColumn) {
            $tiles .= " class = 'last-image'";
            array_push($innerArray, null);
          } else {
            array_push($innerArray, $sequence);
          }
          $tiles .= "/></div>";
        }
        array_push($tilesSequenceMatrix, $innerArray);
      }
      echo $tiles;
      ?>
    </div>
    <div id="settingGamePanel">
      <div id="userNameSetting">
        <label for="username">Wpisz swoje imię</label><br />
        <input type="text" id="username" name="username" placeholder="imię">
        <input type="button" id="nameConfirmBtn" value="Tak, to ja"><br />
      </div>
      <div id="playerName">
        <p class="time-moves-displays">Gracz:</p>
        <output id="playerNamePlaceholder" class="time-moves-displays"></output>
      </div>
      <div id="startGameSetting">
        <input type="button" id="gameStartBtn" value="ZACZYNAM">
      </div>
    </div>
    <div id="progressDisplay">
      <div id="counterDown">
        <h1 id="counterDownNumber"></h1>
      </div>
      <div>
        <p class="time-moves-displays">Czas:</p>
        <output id="timePlaceholder" class="time-moves-displays">00:00:00:00</output>
      </div>
      <div>
        <p class="time-moves-displays">Liczba ruchów:</p>
        <output id="movesPlaceholder" class="time-moves-displays">00</output>
      </div>
      <br />
    </div>
    <div id="resultsDisplay">
      <hr />
      <h3>Wyniki:</h3>
      <din id="results">
    </div>
    </div>
  </main>
</body>

</html>