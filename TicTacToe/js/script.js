const board = document.getElementById("board");
const status = document.getElementById("status");
const resetButton = document.getElementById("reset");
const playerVsPlayerButton = document.getElementById("player-vs-player");
const playerVsComputerButton = document.getElementById("player-vs-computer");
const playerNamesForm = document.querySelector(".player-names");
const startGameButton = document.getElementById("start-game");
let isPlayerVsComputer = false;
let currentPlayer = "X";  // "X" or "O" will be used on the board
let gameActive = true;
let gameState = Array(9).fill(null);
let player1Name = "Lojtari 1"; // Default player 1 name
let player2Name = "Lojtari 2"; // Default player 2 name

const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
];

// Event listener for the player vs player option
playerVsPlayerButton.addEventListener("click", () => {
    isPlayerVsComputer = false;
    playerNamesForm.classList.remove("hidden");
});

// Event listener for the player vs computer option
playerVsComputerButton.addEventListener("click", () => {
    isPlayerVsComputer = true;
    playerNamesForm.classList.remove("hidden");
    document.getElementById("player2").value = "Kompjuteri";
    document.getElementById("player2").disabled = true;
});

// Start the game after selecting players
startGameButton.addEventListener("click", () => {
    player1Name = document.getElementById("player1").value || "Lojtari 1";
    player2Name = document.getElementById("player2").value || "Lojtari 2";
    document.querySelector(".menu").classList.add("hidden");
    playerNamesForm.classList.add("hidden");
    document.querySelector(".game").classList.remove("hidden");
    status.textContent = `Rradhën e ka: ${currentPlayer === "X" ? player1Name : player2Name}`;
});

// Board click listener for player moves
board.addEventListener("click", (e) => {
    if (!gameActive || !e.target.classList.contains("cell") || e.target.classList.contains("taken")) {
        return;
    }

    const cellIndex = e.target.dataset.index;
    gameState[cellIndex] = currentPlayer;
    e.target.textContent = currentPlayer;  // Display "X" or "O" on the board
    e.target.classList.add("taken", currentPlayer.toLowerCase());

    if (checkWin()) {
        status.textContent = `${currentPlayer === "X" ? player1Name : player2Name} fitoi!`;
        gameActive = false;
        resetButton.classList.remove("hidden");
        return;
    }

    if (gameState.every(cell => cell)) {
        status.textContent = "Barazim!";
        gameActive = false;
        resetButton.classList.remove("hidden");
        return;
    }

    currentPlayer = currentPlayer === "X" ? "O" : "X";
    status.textContent = `Rradhën e ka: ${currentPlayer === "X" ? player1Name : player2Name}`;

    if (isPlayerVsComputer && currentPlayer === "O") {
        computerMove();
    }
});

// Reset button click event listener
resetButton.addEventListener("click", () => {
    if (confirm("Dëshironi të luani përsëri?")) {
        resetGame();
    }
});

// Function to check for a winning condition
function checkWin() {
    return winningCombinations.some(combination =>
        combination.every(index => gameState[index] === currentPlayer)
    );
}

// Function for the computer to make its move
function computerMove() {
    const availableCells = gameState.map((cell, index) => cell === null ? index : null).filter(index => index !== null);
    const randomIndex = availableCells[Math.floor(Math.random() * availableCells.length)];
    document.querySelector(`.cell[data-index="${randomIndex}"]`).click();
}

// Function to reset the game after completion
function resetGame() {
    gameActive = true;
    currentPlayer = "X";
    gameState.fill(null);
    document.querySelectorAll(".cell").forEach(cell => {
        cell.textContent = "";  // Reset the text on the board
        cell.className = "cell"; // Reset cell styles
    });
    status.textContent = `Rradhën e ka: ${player1Name}`; // Start with player 1's turn
    resetButton.classList.add("hidden");
}

