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

const TILES = document.querySelectorAll(".slider");
const IMAGES = [...TILES].map(tile => tile.firstElementChild);
const NUMBER_COLUMN = Math.sqrt(TILES.length);

const USER_NAME_FIELD = document.querySelector("#username");
const NAME_CONFIRM_BTN = document.querySelector("#nameConfirmBtn");
const GAME_START_BTN = document.querySelector("#gameStartBtn");
const PLAYER_NAME_PLACEHOLDER = document.querySelector("#playerNamePlaceholder");

USER_NAME_FIELD.addEventListener("keyup", function () {
    // console.log(this.value);
    if (this.value == "") {
        deactivateNameConfirmBtn();
        deactivateGameStartBtn();
        PLAYER_NAME_PLACEHOLDER.parentElement.classList.remove("full");
    }
    else if(GAME_START_BTN.classList.contains("active")){
        deactivateGameStartBtn();
    }
    else {
        activateNameConfirmBtn();
        PLAYER_NAME_PLACEHOLDER.parentElement.classList.add("full");
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
    document.querySelector("#startGameSetting").style.display = "none";
    document.querySelector("#progressDisplay").style.display = "block";
    counterDownNumber();
    setTimeout(() => {
        fadeOutLastTile();
    }, 5000);
    setTimeout(() => {
        addTransparencyToImages();
        getShuffleTiles();
    }, 6000);
}

function addTransparencyToImages() {
    [...IMAGES].forEach(function (img, ind) {
        if (ind != IMAGES.length - 1) {
            img.classList.add("img-to-shift");
        }
    });
}

function saveResult(time, moves) {
    var xhttp = new XMLHttpRequest();
    xhttp.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            document.querySelector("#results").innerHTML = this.responseText;
        }
    };
    xhttp.open("POST", "./php/utils/write-file.php", true);
    xhttp.setRequestHeader("content-type", "application/x-www-form-urlencoded");
    xhttp.send("playerName=" + makeDummyName(false) + "&time=" + time + "&moves=" + moves);
}

function counterDownNumber() {
    let counterDownNumber = document.querySelector("#counterDownNumber");
    counterDownNumber.style.width = TILE_PLACEMENT_WIDTH + "px";
    counterDownNumber.style.fontSize = TILE_PLACEMENT_WIDTH + "px";
    counterDownNumber.style.lineHeight = TILE_PLACEMENT_WIDTH + "px";
    let count = 5;
    COUNT_DOWN(counterDownNumber, count);
    counterDownNumber.addEventListener("animationend", function () {
        this.classList.remove("counter-down-number-fading");
    });
}

const COUNT_DOWN = function countDown(elem, count) {
    elem.classList.add("counter-down-number-fading");
    elem.textContent = count--;
    if (count >= 0) {
        setTimeout(() => countDown(elem, count), 1000);
    }
    else {
        elem.removeEventListener("animationend", function () {
            this.classList.remove("counter-down-number-fading");
        });
        elem.parentElement.remove();
    }
}

function removeTransparencyFromImages() {
    [...document.querySelectorAll(".slider img")].forEach((img) => img.classList.remove("img-to-shift"));
}

const TILE_PLACEMENT = document.querySelector("#tilePlacement");
const CSS_OBJ = window.getComputedStyle(TILE_PLACEMENT, null);
const TILE_PLACEMENT_WIDTH = parseInt(CSS_OBJ.getPropertyValue("width"));
console.log(TILE_PLACEMENT_WIDTH);
const SLIDER_WIDTH = TILE_PLACEMENT_WIDTH / NUMBER_COLUMN;

function completeLastTile() {
    let lastTile = document.querySelector("div[data-sequence='" + [Math.pow(NUMBER_COLUMN, 2)] + "']");
    let lastImg = IMAGES[Math.pow(NUMBER_COLUMN, 2) - 1];
    lastImg.classList.add("to-fade-in-image");
    lastTile.appendChild(lastImg);
    lastImg.removeEventListener("transitionend", startTimer);
    setTimeout(() => { lastImg.classList.add("faded-in-image"); lastTile.removeAttribute("data-empty") }, 500);
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

let timer = "";

let nextCentsec;
function startTimer() {
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

let moves = 0;
function countMoves() {
    moves++;
    document.querySelector("#movesPlaceholder").textContent = moves < 10 ? "0" + moves : moves;
}

function fadeOutLastTile() {
    let lastImg = IMAGES[Math.pow(NUMBER_COLUMN, 2) - 1];
    lastImg.addEventListener("transitionend", startTimer);
    lastImg.classList.add("faded-out-image");
    lastImg.parentElement.setAttribute("data-empty", true);
}

function getShuffleTiles() {
    console.log("shuffled");
    const XMLHTTP = new XMLHttpRequest();
    XMLHTTP.onreadystatechange = function () {
        if (this.readyState == 4 && this.status == 200) {
            document.getElementById("tilePlacement").innerHTML = this.responseText;
        }
    };
    XMLHTTP.open("GET", "./php/utils/retrieve-shuffled-tiles.php");
    XMLHTTP.send();
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