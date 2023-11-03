const NUMBER_COLUMN = 4;
const tiles = [];
const images = [];

function counterDownNumber() {
    let counterDownNumber = document.querySelector("#counterDownNumber");
    let counterDown = counterDownNumber.parentElement;
    counterDownNumber.style.width = NUMBER_COLUMN * 100 + "px";
    counterDownNumber.style.fontSize = NUMBER_COLUMN * 100 + "px";
    counterDownNumber.style.lineHeight = NUMBER_COLUMN * 100 + "px";
    let count = 5;
    counterDownNumber.textContent = count;
    counterDownNumber.addEventListener("transitionend", function () {
        this.textContent = --count;
        this.classList.remove("counter-down-number-fading");
    });
    const countDown = setInterval(() => {
        counterDownNumber.classList.add("counter-down-number-fading");
        if (count == 1) {
            clearInterval(countDown);
            counterDown.remove();
        }
    }, 1000);
}

function removeTransparencyFromImages() {
    images.forEach((img) => img.classList.remove("img-to-shift"));
}

function addTransparencyToImages() {
    [...images].forEach(function (img, ind) {
        if (ind != images.length - 1) {
            img.classList.add("img-to-shift");
        }
    });
}

const TILES_SEQUENCE_MATRIX = [];
const TILES_SEQUENCE_SHUFFLED = [];

function createMainField() {
    let tilePlacement = document.querySelector("#tilePlacement");
    let arrayToMatrix;
    let sequence = 0;
    tilePlacement.style.width = NUMBER_COLUMN * 100 + "px";
    for (let i = 1; i <= NUMBER_COLUMN; i++) {
        arrayToMatrix = [];
        for (let j = 1; j <= NUMBER_COLUMN; j++) {
            let aTile = document.createElement("div");
            aTile.classList.add("slider");
            aTile.setAttribute("data-column", j);
            aTile.setAttribute("data-row", i);
            aTile.setAttribute("data-sequence", ++sequence);
            tilePlacement.appendChild(aTile);
            tiles.push(aTile);
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
    image.style.width = NUMBER_COLUMN * 100 + "px";
    image.setAttribute("data-sequence", Math.pow(NUMBER_COLUMN, 2));
    image.style.top = "-" + (NUMBER_COLUMN - 1) * 100 + "px";
    image.style.left = "-" + (NUMBER_COLUMN - 1) * 100 + "px";
    image.classList.add("to-fade-in-image");
    tiles[Math.pow(NUMBER_COLUMN, 2) - 1].appendChild(image);
    tiles[Math.pow(NUMBER_COLUMN, 2) - 1].removeAttribute("data-empty");
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
    }
}

const timerPlaceholder = document.querySelectorAll("output");

let timer;

let clicked = false;
function startTimer() {
    if (!clicked) {
        clicked = true;
        let nextMs = 0;
        timer = setInterval(() => {
            let ms = nextMs % 100;
            let msNota = ms < 10 ? "0" + ms : ms;
            let sec = parseInt(nextMs / 100) % 60;
            let secNota = sec < 10 ? "0" + sec : sec;
            let min = parseInt(parseInt(nextMs / 100) / 60) % 60;
            let minNota = min < 10 ? "0" + min : min;
            let hour = parseInt(parseInt(parseInt(nextMs / 100) / 60) / 60);
            let hourNota = hour < 10 ? "0" + hour : hour;
            timerPlaceholder[0].textContent =
                hourNota + ":" + minNota + ":" + secNota + ":" + msNota;
            nextMs++;
        }, 10);
    }
}

let moves = 0;
function countMoves() {
    moves++;
    timerPlaceholder[1].textContent = moves < 10 ? "0" + moves : moves;
}

document.addEventListener("DOMContentLoaded", () => {
    createMainField();
    counterDownNumber();
});

function createImages() {
    let positionTop = 0;
    let positionLeft = 0;
    for (i = 0; i < tiles.length; i++) {
        let image = document.createElement("img");
        image.src = "img/nabo.jpg";
        image.style.width = NUMBER_COLUMN * 100 + "px";
        image.setAttribute("data-sequence", i + 1);
        image.style.top = positionTop + "px";
        image.style.left = positionLeft + "px";
        image.addEventListener("click", (ev) => movePiece(ev.target, false));
        tiles[i].append(image);
        images.push(image);
        positionLeft -= 100;
        if ((i + 1) % NUMBER_COLUMN == 0) {
            positionTop -= 100;
            positionLeft = 0;
        }
    }
    setTimeout(() => {
        fadeOutLastTile();
        addTransparencyToImages();
        shuffleTiles();
    }, 5000);
}

function fadeOutLastTile() {
    let lastTile = tiles[tiles.length - 1];
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
    tiles.forEach((t) => a.push(t.getAttribute("data-sequence")));
    let im = [];
    images.forEach((ig) => im.push(ig.getAttribute("data-sequence")));
    for (i = 0; i < tiles.length; i++) {
        if (TILES_SEQUENCE_SHUFFLED[i] == null) {
            tiles[i].setAttribute("data-empty", true);
            continue;
        }
        let shuffledNumber = TILES_SEQUENCE_SHUFFLED[i] - 1;
        if (shuffledNumber == tiles.length - 1) {
            images[shuffledNumber].classList.remove("faded-out-image");
        }
        tiles[i].appendChild(images[shuffledNumber]);
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