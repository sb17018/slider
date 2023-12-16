<!DOCTYPE html>
<html lang="en">

<head>
    <?php
    include("included-parts/header.html");
    ?>
    <style>
        select {
            width: 200px;
            font-size: 30px;
        }

        input {
            font-size: 30px;
        }
    </style>
</head>

<body>
    <div>
        <h1>Admin Dashboard</h1>
        <hr />
        <?php
        include("./php/utils/read-file.php");
        ?>
    </div>
    <hr />
    <div>
        <h3>Number of tiles:</h3>
        <?php
        // to get $numberOfColumn
        include("./included-parts/column-nr-reader.php");
        $tileNumberSelection = "<select>";
        for ($i = 2; $i <= 6; $i++) {
            $tileNumberSelection .= "<option value=" . $i;
            if ($i == $numberOfColumn) {
                $tileNumberSelection .= " selected";
            }
            $tileNumberSelection .= ">" . pow($i, 2) . "</option>";
        }
        $tileNumberSelection .= "</select><input type='button' id='tileNrSettingBtn' value='SET TILES'/>";
        echo $tileNumberSelection;
        ?>
    </div>
    <hr />
    <div>
        <input type='button' id='tileShuffleBtn' value='SHUFFLE TILES' />
    </div>
    <script>
        document.querySelector("#tileNrSettingBtn").addEventListener("click", () => setTileNumber(document.querySelector("select").value));
        document.querySelector("#tileShuffleBtn").addEventListener("click", shuffleTiles);

        function setTileNumber(tileNr) {
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                    console.log(this.responseText);
                    [...document.querySelectorAll("option")].forEach(
                        option => {
                            option.removeAttribute("selected");

                            if (option.value == tileNr) {
                                option.setAttribute("selected", true);
                            }
                        });
                    shuffleTiles();
                }
            };
            xhttp.open("POST", "./php/utils/write-tile-nr.php", true);
            xhttp.setRequestHeader("content-type", "application/x-www-form-urlencoded");
            xhttp.send("tileNumber=" + tileNr);
        }

        function shuffleTiles() {
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function () {
                if (this.readyState == 4 && this.status == 200) {
                }
            };
            xhttp.open("GET", "./php/utils/shuffle-tiles.php", true);
            xhttp.send();

        }
    </script>
</body>

</html>