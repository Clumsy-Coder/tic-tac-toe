let playBtn;            // player playing as 'X' or 'O'
const winCondition = [   
    [0, 1, 2],          // first row
    [3, 4, 5],          // second row
    [6, 7, 8],          // third row
    [0, 3, 6],          // first column
    [1, 4, 7],          // second column
    [2, 5, 8],          // third column
    [0, 4, 8],          // top left to bottom right diagonal
    [2, 4, 6]           // top right to bottom left diagonal
];

let board = new Array(9);   // 0 1 2  \
board.fill(undefined);      // 3 4 5   } game board
                            // 6 7 8  /

let playerScore = 0, computerScore = 0;
let gameOn = false;
let curTurn;

//-----------------------------------------------------------------------------------//
//--------------------------------------HELPER---------------------------------------//
//-----------------------------------------------------------------------------------//

function spaceLeft() {
    let count = 0;
    for(let i = 0; i < board.length; i++) {
        if(board[i] == undefined) {
            count++;
        }
    }
    return count;
}

// player either 'X' or 'O'
function checkWin(player) {
    for(let i = 0; i < winCondition.length; i++) {
        if(board[winCondition[i][0]] == player &&
           board[winCondition[i][1]] == player &&
           board[winCondition[i][2]] == player) {
           return true;
        }
    }
    return false;
}

function updateScore() {
    $("#playerScore").text(playerScore);
    $("#computerScore").text(computerScore);
}

function getNextTurn() {
    return curTurn == "X" ? "O" : "X";
}

//-----------------------------------------------------------------------------------//
//---------------------------------------CORE----------------------------------------//
//-----------------------------------------------------------------------------------//

$(document).ready(() => {
    $('.modal').modal({
        dismissible: false
    });
    
    $("#tieGameModal, #playerWinModal, #computerWinModal").modal({
        complete: () => {$("#playAgainModal").modal("open");}
    });
    
    $("#chooseModal").modal("open");
    $("button").click(playerMove);
});

function endGame() {
    gameOn = false;
    let playerWinner = checkWin(playBtn);
    let computerWinner = checkWin(playBtn == "X" ? "O" : "X");
    
    if(!playerWinner && !computerWinner) {
        $("#tieGameModal").modal("open");
        return
    }
    else if (playerWinner) {
        playerScore++;
        updateScore();
        $("#playerWinModal").modal("open");
        return
    }
    else {
        computerScore++;
        updateScore();
        $("#computerWinModal").modal("open");
        return
    }
}

function reset() {
    $("button").text("");
    $("button").removeClass("disabled");
    board.fill(undefined);
    gameOn = true;
    curTurn = playBtn;
    $("#playAgainModal").modal("close");
}

//asking player whether they want to play as 'X' or 'O'
function choosePlayBtn(type) {
    playBtn = type.toUpperCase();
    $("#chooseModal").modal("close");
    gameOn = true;
    curTurn = playBtn;
}

function playerMove(event) {
    let id = $(event.target).attr("id");
    board[id] = curTurn;
    $(`#${id}`).addClass("disabled");
    $(`#${id}`).text(playBtn);
    curTurn = getNextTurn();
    
    if(spaceLeft() == 0 || !gameOn || checkWin(playBtn)) {
        gameOn = false;
        endGame();
    }
    if(gameOn) {
        computerMove();
    }
}

// computer makes a move by random number
function computerMove() {
    // get random number as click button based on it 
    // get another random if button already used
    let random = Math.floor(Math.random() * (8 - 0 + 1)) + 0;
    while(board[random] != undefined) {
        random = Math.floor(Math.random() * (8 - 0 + 1)) + 0;
    }
    board[random] = curTurn;
    
    $(`#${random}`).addClass("disabled");
    $(`#${random}`).text(curTurn);
    
    if(spaceLeft() == 0 || !gameOn || checkWin(curTurn)) {
        gameOn = false;
        endGame();
    }
    curTurn = getNextTurn();
}
