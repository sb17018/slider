function makeDummyName(random) {
    if (random) {
        let firstName = String.fromCharCode(65 + Math.floor(Math.random() * 26));
        let lastName = String.fromCharCode(65 + Math.floor(Math.random() * 26));
        let firstNameLength = Math.floor(Math.random() * 6) + 3;
        let lastNameLength = Math.floor(Math.random() * 6) + 3;
        for (let i = 0; i < firstNameLength; i++) {
            console.log(firstName);
            firstName += String.fromCharCode(97 + Math.floor(Math.random() * 26));
        };
        for (let i = 0; i < lastNameLength; i++) {
            lastName += String.fromCharCode(97 + Math.floor(Math.random() * 26));
        };
        return firstName + " " + lastName;
    }
    else if (!random) {
        return PLAYER_NAME_PLACEHOLDER.textContent;
    }
    else {
        return "Joe Doe";
    }
}


const NUMBER_COLUMN = 2;
const TILES = [];
const IMAGES = [];

const USER_NAME_FIELD = document.querySelector("#username");
const NAME_CONFIRM_BTN = document.querySelector("#nameConfirmBtn");
const GAME_START_BTN = document.querySelector("#gameStartBtn");
const PLAYER_NAME_PLACEHOLDER = document.querySelector("#playerNamePlaceholder");

USER_NAME_FIELD.addEventListener("keyup", function () {
    console.log(this.value);
    if (this.value == "") {
        deactivateNameConfirmBtn();
        deactivateGameStartBtn();
    }
    else {
        activateNameConfirmBtn();
    }
    PLAYER_NAME_PLACEHOLDER.textContent = this.value;
});

function activateNameConfirmBtn() {
    NAME_CONFIRM_BTN.classList.add("active");
    NAME_CONFIRM_BTN.addEventListener("click", activateGameStartBtn);
}

function deactivateNameConfirmBtn() {
    NAME_CONFIRM_BTN.classList.remove("active");
    NAME_CONFIRM_BTN.removeEventListener("click", activateGameStartBtn);

}

function activateGameStartBtn() {
    GAME_START_BTN.classList.add("active");
    GAME_START_BTN.addEventListener("click", setFunctionForStartGameBtn);

}

function deactivateGameStartBtn() {
    GAME_START_BTN.classList.remove("active");
    GAME_START_BTN.removeEventListener("click", setFunctionForStartGameBtn);
}

function setFunctionForStartGameBtn() {
    document.querySelector("#userNameSetting").style.display = "none";
    document.querySelector("#progressDisplay").style.display = "block";
    counterDownNumber();
    setTimeout(() => {
        fadeOutLastTile();
        addTransparencyToImages();
        shuffleTiles();
    }, 5000);
}

function saveResult(time, moves) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            // console.log(this.responseText);
            document.querySelector("#results").innerHTML = this.responseText;
        }
    };
    xhttp.open("POST", "./php/write-file.php", true);
    xhttp.setRequestHeader("content-type", "application/x-www-form-urlencoded");
    xhttp.send("playerName=" + makeDummyName(false) + "&time=" + time + "&moves=" + moves);
}

function counterDownNumber() {
    let counterDownNumber = document.querySelector("#counterDownNumber");
    let counterDown = counterDownNumber.parentElement;
    counterDownNumber.style.width = TILE_PLACEMENT_WIDTH + "px";
    counterDownNumber.style.fontSize = TILE_PLACEMENT_WIDTH + "px";
    counterDownNumber.style.lineHeight = TILE_PLACEMENT_WIDTH + "px";
    let count = 5;
    counterDownNumber.textContent = count;
    setInterval(() => {
        counterDownNumber.classList.add("counter-down-number-fading")
    }, 500);
    counterDownNumber.addEventListener("animationend", function () {
        this.textContent = --count;
        this.classList.remove("counter-down-number-fading");
    });
    const COUNT_DOWN = setInterval(() => {
        counterDownNumber.classList.add("counter-down-number-fading");
        if (count == 1) {
            clearInterval(COUNT_DOWN);
            counterDown.remove();
        }
    }, 1000);
}

function removeTransparencyFromImages() {
    IMAGES.forEach((img) => img.classList.remove("img-to-shift"));
}

function addTransparencyToImages() {
    [...IMAGES].forEach(function (img, ind) {
        if (ind != IMAGES.length - 1) {
            img.classList.add("img-to-shift");
        }
    });
}

const TILES_SEQUENCE_MATRIX = [];
const TILES_SEQUENCE_SHUFFLED = [];

const TILE_PLACEMENT = document.querySelector("#tilePlacement");
const CSS_OBJ = window.getComputedStyle(TILE_PLACEMENT, null);
const TILE_PLACEMENT_WIDTH = parseInt(CSS_OBJ.getPropertyValue("width"));
console.log(TILE_PLACEMENT_WIDTH);

function createMainField() {
    const SLIDER_WIDTH = TILE_PLACEMENT_WIDTH / NUMBER_COLUMN;
    const SLIDER_HEIGHT = TILE_PLACEMENT_WIDTH / NUMBER_COLUMN;
    let arrayToMatrix;
    let sequence = 0;
    // TILE_PLACEMENT.style.width = NUMBER_COLUMN * 100 + "px";
    for (let i = 1; i <= NUMBER_COLUMN; i++) {
        arrayToMatrix = [];
        for (let j = 1; j <= NUMBER_COLUMN; j++) {
            let aTile = document.createElement("div");
            aTile.classList.add("slider");
            aTile.style.width = SLIDER_WIDTH + "px";
            aTile.style.height = SLIDER_HEIGHT + "px";
            aTile.setAttribute("data-column", j);
            aTile.setAttribute("data-row", i);
            aTile.setAttribute("data-sequence", ++sequence);
            TILE_PLACEMENT.appendChild(aTile);
            TILES.push(aTile);
            if (i == NUMBER_COLUMN && j == NUMBER_COLUMN) {
                arrayToMatrix.push(null);
            } else {
                arrayToMatrix.push(sequence);
            }
        }
        TILES_SEQUENCE_MATRIX.push(arrayToMatrix);
    }
    createImages();
}

function completeLastTile() {
    let image = document.createElement("img");
    image.src = "img/nabo.jpg";
    image.style.width = TILE_PLACEMENT_WIDTH + "px";
    image.setAttribute("data-sequence", Math.pow(NUMBER_COLUMN, 2));
    image.style.top = "-" + (NUMBER_COLUMN - 1) * (TILE_PLACEMENT_WIDTH / NUMBER_COLUMN) + "px";
    image.style.left = "-" + (NUMBER_COLUMN - 1) * (TILE_PLACEMENT_WIDTH / NUMBER_COLUMN) + "px";
    image.classList.add("to-fade-in-image");
    TILES[Math.pow(NUMBER_COLUMN, 2) - 1].appendChild(image);
    TILES[Math.pow(NUMBER_COLUMN, 2) - 1].removeAttribute("data-empty");
    setTimeout(() => image.classList.add("faded-in-image"), 500);
}

function checkSequence() {
    let tileSequence = [...document.querySelectorAll(".slider")];
    let tileSeq;
    let imgSeq;
    for (let i = 0; i < tileSequence.length - 1; i++) {
        tileSeq = tileSequence[i].getAttribute("data-sequence");
        try {
            imgSeq =
                tileSequence[i].firstElementChild.getAttribute("data-sequence");
        } catch (err) {
            break;
        }
        if (tileSeq != imgSeq) {
            break;
        }
    }
    if (tileSeq == imgSeq) {
        clearInterval(timer);
        completeLastTile();
        removeTransparencyFromImages();
        document.querySelector("#resultsDisplay").style.display = "block";
        saveResult(nextCentsec - 1, moves);
    }
}

let timer;

let nextCentsec;
let clicked = false;
function startTimer() {
    if (!clicked) {
        clicked = true;
        nextCentsec = 0;
        timer = setInterval(() => {
            let centsec = nextCentsec % 100;
            let centsecNota = centsec < 10 ? "0" + centsec : centsec;
            let sec = parseInt(nextCentsec / 100) % 60;
            let secNota = sec < 10 ? "0" + sec : sec;
            let min = parseInt(parseInt(nextCentsec / 100) / 60) % 60;
            let minNota = min < 10 ? "0" + min : min;
            let hour = parseInt(parseInt(parseInt(nextCentsec / 100) / 60) / 60);
            let hourNota = hour < 10 ? "0" + hour : hour;
            document.querySelector("#timePlaceholder").textContent =
                hourNota + ":" + minNota + ":" + secNota + ":" + centsecNota;
            nextCentsec++;
        }, 10);
    }
}

let moves = 0;
function countMoves() {
    moves++;
    document.querySelector("#movesPlaceholder").textContent = moves < 10 ? "0" + moves : moves;
}

document.addEventListener("DOMContentLoaded", () => {
    createMainField();
    // counterDownNumber();
});

function createImages() {
    let positionTop = 0;
    let positionLeft = 0;
    for (i = 0; i < TILES.length; i++) {
        let image = document.createElement("img");
        image.src = "img/nabo.jpg";
        image.style.width = TILE_PLACEMENT_WIDTH + "px";
        image.setAttribute("data-sequence", i + 1);
        image.style.top = positionTop + "px";
        image.style.left = positionLeft + "px";
        image.addEventListener("click", (ev) => movePiece(ev.target, false));
        TILES[i].append(image);
        IMAGES.push(image);
        positionLeft -= (TILE_PLACEMENT_WIDTH / NUMBER_COLUMN);
        if ((i + 1) % NUMBER_COLUMN == 0) {
            positionTop -= (TILE_PLACEMENT_WIDTH / NUMBER_COLUMN);
            positionLeft = 0;
        }
    }
}

function fadeOutLastTile() {
    let lastTile = TILES[TILES.length - 1];
    lastTile.firstElementChild.classList.add("last-image");
    lastTile.firstElementChild.addEventListener(
        "transitionend",
        function () {
            lastTile.removeChild(lastTile.firstElementChild);
            startTimer();
        }
    );
    lastTile.firstElementChild.classList.add("faded-out-image");
}

function shuffleTiles() {
    shuffleSequence();
    let a = [];
    TILES.forEach((t) => a.push(t.getAttribute("data-sequence")));
    let im = [];
    IMAGES.forEach((ig) => im.push(ig.getAttribute("data-sequence")));
    for (i = 0; i < TILES.length; i++) {
        if (TILES_SEQUENCE_SHUFFLED[i] == null) {
            TILES[i].setAttribute("data-empty", true);
            continue;
        }
        let shuffledNumber = TILES_SEQUENCE_SHUFFLED[i] - 1;
        if (shuffledNumber == TILES.length - 1) {
            IMAGES[shuffledNumber].classList.remove("faded-out-image");
        }
        TILES[i].appendChild(IMAGES[shuffledNumber]);
    }
}

function shuffleSequence() {
    let emptyTileColumn = NUMBER_COLUMN - 1;
    let emptyTileRow = NUMBER_COLUMN - 1;
    for (let i = 0; i < Math.pow(NUMBER_COLUMN, 5); i++) {
        let tileAboveEmptyColumn = emptyTileColumn;
        let tileAboveEmptyRow =
            emptyTileRow - 1 < 0 ? null : emptyTileRow - 1;
        let tileBelowEmptyColumn = emptyTileColumn;
        let tileBelowEmptyRow =
            emptyTileRow + 1 < NUMBER_COLUMN ? emptyTileRow + 1 : null;
        let tileLeftEmptyColumn =
            emptyTileColumn - 1 < 0 ? null : emptyTileColumn - 1;
        let tileLeftEmptyRow = emptyTileRow;
        let tileRightEmptyColumn =
            emptyTileColumn + 1 < NUMBER_COLUMN ? emptyTileColumn + 1 : null;
        let tileRightEmptyRow = emptyTileRow;
        let tilesAroundEmpty = [
            [tileAboveEmptyColumn, tileAboveEmptyRow],
            [tileBelowEmptyColumn, tileBelowEmptyRow],
            [tileLeftEmptyColumn, tileLeftEmptyRow],
            [tileRightEmptyColumn, tileRightEmptyRow],
        ];
        let tileToMoveCoords;
        do {
            tileToMoveCoords = tilesAroundEmpty[Math.floor(Math.random() * 4)];
        } while (tileToMoveCoords[0] == null || tileToMoveCoords[1] == null);
        let tileToMove =
            TILES_SEQUENCE_MATRIX[tileToMoveCoords[0]][tileToMoveCoords[1]];
        TILES_SEQUENCE_MATRIX[emptyTileColumn][emptyTileRow] = tileToMove;
        TILES_SEQUENCE_MATRIX[tileToMoveCoords[0]][tileToMoveCoords[1]] =
            null;
        emptyTileColumn = tileToMoveCoords[0];
        emptyTileRow = tileToMoveCoords[1];
    }
    TILES_SEQUENCE_MATRIX.forEach((innerArray) => {
        innerArray.forEach((val) => TILES_SEQUENCE_SHUFFLED.push(val));
    });
}

function setEmpty(currentEmptyElem, toBeEmptyElem) {
    currentEmptyElem.removeAttribute("data-empty");
    toBeEmptyElem.setAttribute("data-empty", true);
}

function tilesAroundClickedImage(clickedImage) {
    let clickedColumn =
        clickedImage.parentElement.getAttribute("data-column");
    let clickedRow = clickedImage.parentElement.getAttribute("data-row");
    let upClicked = document.querySelector(
        "[data-column='" +
        clickedColumn +
        "'][data-row='" +
        (clickedRow - 1) +
        "']"
    );
    let downClicked = document.querySelector(
        "[data-column='" +
        clickedColumn +
        "'][data-row='" +
        (parseInt(clickedRow) + 1) +
        "']"
    );
    let leftClicked = document.querySelector(
        "[data-column='" +
        (clickedColumn - 1) +
        "'][data-row='" +
        clickedRow +
        "']"
    );
    let rightClicked = document.querySelector(
        "[data-column='" +
        (parseInt(clickedColumn) + 1) +
        "'][data-row='" +
        clickedRow +
        "']"
    );
    return [upClicked, downClicked, leftClicked, rightClicked];
}

function getEmptyTile(tilesAroundClickedOne) {
    let tileToReturn = null;
    tilesAroundClickedOne.forEach((tile) => {
        if (tile != null) {
            if (tile.getAttribute("data-empty") == "true") {
                tileToReturn = tile;
            }
        }
    });
    return tileToReturn;
}

function movePiece(clickedImage, isShuffling) {
    let tilesAroundClickedOne = tilesAroundClickedImage(clickedImage);
    let emptyTile = getEmptyTile(tilesAroundClickedOne);
    if (emptyTile != null) {
        setEmpty(emptyTile, clickedImage.parentElement);
        emptyTile.appendChild(clickedImage);
        if (!isShuffling) {
            countMoves();
            checkSequence();
        }
    }
}