// Gameboard module
const Gameboard = (() => {

  let board = ["", "", "", "", "", "", "", "", ""];

  const getBoard = () => {
    console.log("📦 Current board:", board);
    return board;
  };

  // Return true if move succeeds, false if invalid
  const setCell = (index, marker) => {
    console.log(`🎯 ${marker} tries index ${index}`);

    if (board[index] !== "") {
      console.log("❌ Invalid move: cell already taken");
      return false;
    }

    board[index] = marker;
    console.log(`✅ Move accepted: ${marker} -> ${index}`);
    return true;
  };

  const reset = () => {
    board = ["", "", "", "", "", "", "", "", ""];
    console.log("🔄 Board reset");
  };

  return { getBoard, setCell, reset };

})();



// Player factory
const Player = (name, marker) => {
  return { name, marker };
};



// GameController module
const GameController = (() => {

  const player1 = Player("Player 1", "X");
  const player2 = Player("Player 2", "O");

  let currentPlayer = player1;
  let gameOver = false;

  console.log(`🚀 Game started: ${player1.name} vs ${player2.name}`);

  const switchPlayer = () => {
    currentPlayer = currentPlayer === player1 ? player2 : player1;
    console.log(`🔁 Now it's ${currentPlayer.name}'s turn`);
  };

  const playRound = (index) => {
    console.log(`\n▶️ ${currentPlayer.name} attempts move at ${index}`);

    if (gameOver) {
      console.log("⛔ Game already finished");
      return;
    }

    // Only continue if move is valid
    const moveSuccess = Gameboard.setCell(index, currentPlayer.marker);

    if (!moveSuccess) {
      console.log("⚠️ Turn not counted. Try again.");
      return; // ❗ No player switch
    }

    if (checkWin()) {
      console.log(`🏆 ${currentPlayer.name} wins!`);
      gameOver = true;
      return;
    }

    if (checkDraw()) {
      console.log("🤝 It's a draw!");
      gameOver = true;
      return;
    }

    switchPlayer();
  };

  const checkWin = () => {
    const board = Gameboard.getBoard();

    const winPatterns = [
      [0,1,2],[3,4,5],[6,7,8],
      [0,3,6],[1,4,7],[2,5,8],
      [0,4,8],[2,4,6]
    ];

    return winPatterns.some(pattern =>
      pattern.every(i => board[i] === currentPlayer.marker)
    );
  };

  // New: detect draw condition
  const checkDraw = () => {
    const board = Gameboard.getBoard();
    const isDraw = board.every(cell => cell !== "");

    console.log(`🔍 Draw check: ${isDraw}`);
    return isDraw;
  };

  const restart = () => {
    Gameboard.reset();
    currentPlayer = player1;
    gameOver = false;
    console.log("🔄 Game restarted");
  };

  return { playRound, restart };

})();

console.log("hey")
Gameboard()