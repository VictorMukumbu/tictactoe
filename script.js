document.getElementById("start").addEventListener("click", () => {
  const name1 = document.getElementById("player1Name").value;
  const name2 = document.getElementById("player2Name").value;
  const mode = document.getElementById("mode").value;

  const isAI = mode === "ai";

  gameController.resetGame();
  gameController.setPlayers(name1, name2, isAI);
  displayController.render();

});
//hide player2 in ai mode
const modeSelect = document.getElementById("mode");
const player2Input = document.getElementById("player2Name");

modeSelect.addEventListener("change", () => {
  if (modeSelect.value === "ai") {
    player2Input.style.display = "none";
  } else {
    player2Input.style.display = "inline-block";
  }
});

//gameBoard function
const gameBoard = (()=>{
    // set board
    let board =['','','','','','','','','']
    //calling getBoard returns board
    const getBoard=()=>board
    //mark the cells
    const setCell =(index,marker)=>{
        if(board[index]===""){
            board[index]=marker
        }
    }
    // reset board
    const resetBoard =()=>{
        board=['','','','','','','','','']
    }
    //return
    return {getBoard,setCell,resetBoard}
})()
// console.log(gameBoard(0,x))

//players function
const players =(name,marker)=>{
    return {name,marker}
}
//sample players
let player1 = players("Player 1", "X");
let player2 = players("Player 2", "O");

let vsAI = false;
// console.log(player1)
// console.log(player2)


// game control function
const gameController=(()=>{
    // if currentPlayer has made a move and game isnt over
    let currentPlayer = player1;
    let gameOver = false
    let winningCells = null;
    let gameStarted = false;//hide board
    let isAITurn = false;
    //create scores
    let score = {
        player1: 0,
        player2: 0,
        draw: 0
    };

    const getScore = () => score

    const isGameStarted = () => gameStarted;


    //set players
    const setPlayers = (name1, name2, aiMode) => {

        const cleanName = (name, fallback) =>
        name.trim() === "" ? fallback : name;
        player1 = players(cleanName(name1, "Player 1"), "X");

        gameStarted = true;//activate board

        if (aiMode) {
            player2 = players("AI", "O");
            vsAI = true;
        } else {
            player2 = players(cleanName(name2, "Player 2"), "O");
            vsAI = false;
        }

        currentPlayer = player1;
    };

    const switchPlayer =()=>{
        //check if current player is player1 if true switch player,else don't
        currentPlayer = currentPlayer===player1?player2:player1;
    }
    //getcurrentplayer returns current player
    const getCurrentPlayer =()=>currentPlayer

    //ai turn
    const isAITurnGetter = () => isAITurn;

    //ai player
    const getAvailableMoves = () => {
        return gameBoard
            .getBoard()
            .map((cell, index) => (cell === "" ? index : null))
            .filter(index => index !== null);
    };

    const aiMove = () => {
        const moves = getAvailableMoves();
        if (moves.length === 0) return;

        const randomIndex = moves[Math.floor(Math.random() * moves.length)];
        playRound(randomIndex);
    };

    //update the playrounds
    const playRound=(index)=>{
       if (!gameStarted || gameOver) return;


        const board =gameBoard.getBoard()
        if (board[index] !== "") return; //  prevent overwrite
        gameBoard.setCell(index,currentPlayer.marker)

        const result = checkWin();

        if (result) {
            winningCells = result;
            gameOver = true;

            if (currentPlayer === player1) {
                score.player1++;
            } else {
                score.player2++;
            }

            return;
        }

       if (checkDraw()) {
            gameOver = true;
            score.draw++;
            return;
        }

        switchPlayer()

        // 🤖 AI turn
       if (!gameOver && vsAI && currentPlayer === player2) {
            isAITurn = true;
            displayController.render(); // show AI thinking state

            setTimeout(() => {
                aiMove();
                isAITurn = false;
                displayController.render();
            }, 500);
        }        
    }

    //check for winner
    const checkWin=()=>{
        const winningBoard = gameBoard.getBoard()
        //set possible win patterns
        const winPatterns=[
            [0,1,2],[3,4,5],[6,7,8],//rows combinations
            [0,3,6],[1,4,7],[2,5,8],//column combinations
            [0,4,8],[2,4,6] //diagonal combinations
        ]
        //show winning cells
        for (let pattern of winPatterns) {
            if (pattern.every(i => winningBoard[i] === currentPlayer.marker)) {
                return pattern; //  return winning cells
            }
        }

        return null;

    }
    //check for draw
    const checkDraw=()=>{
        return gameBoard.getBoard().every(cell => cell !== '')
    }
    //reset game
    const resetGame = () => {
        gameBoard.resetBoard();
        currentPlayer = player1;
        gameOver = false;
        winningCells = null;
    };
    //show winning cells
    const getWinningCells = () => winningCells;

    //return
    return {playRound,getCurrentPlayer,resetGame,getWinningCells,
        setPlayers,isAITurn: isAITurnGetter, isGameStarted,getScore}

})()

//manipulate dom
const displayController =(()=>{
    const boardDiv = document.getElementById("board");

    const render = () => {
        boardDiv.innerHTML = "";

        const score = gameController.getScore();

        document.getElementById("p1Score").textContent =
            `${player1.name}: ${score.player1}`;

        document.getElementById("p2Score").textContent =
            `${player2.name}: ${score.player2}`;

        document.getElementById("drawScore").textContent =
            `Draws: ${score.draw}`;


        const statusDiv = document.getElementById("status");
            if (!gameController.isGameStarted()) {
                statusDiv.textContent = "Click Start to play";
            } else if (gameController.getWinningCells()) {
                statusDiv.textContent = `${gameController.getCurrentPlayer().name} wins!`;
            } else if (gameBoard.getBoard().every(cell => cell !== "")) {
                statusDiv.textContent = "It's a draw!";
            } else {
                statusDiv.textContent = `${gameController.getCurrentPlayer().name}'s turn`;
            }
        const winningCells = gameController.getWinningCells();

        const indicator = document.getElementById("turnIndicator");

            indicator.textContent = `Current: ${gameController.getCurrentPlayer().name}`;   

        gameBoard.getBoard().forEach((cell, index) => {
        const cellDiv = document.createElement("div");
        cellDiv.classList.add("cell");
        cellDiv.textContent = cell;

            // 👇 show/hide board
        if (!gameController.isGameStarted()) {
            boardDiv.style.display = "none";
            statusDiv.textContent = "Click Start to play";
            indicator.textContent = "";
            return; // stop rendering board
        } else {
            boardDiv.style.display = "grid"; 
        }

        //add win class to winning cells
        if (winningCells && winningCells.includes(index)) {
            cellDiv.classList.add("win");
        }

        if (gameController.isAITurn()) {
            cellDiv.classList.add("disabled");
        }

        cellDiv.addEventListener("click", () => {
           if (
                !gameController.isGameStarted() ||
                gameController.getWinningCells() ||
                gameBoard.getBoard().every(cell => cell !== "") ||
                gameController.isAITurn()
            ) return;

            gameController.playRound(index);
            render();
        });        

        boardDiv.appendChild(cellDiv);
        });
    };

    return{render}
})()

// run
displayController.render();

document.getElementById("restart").addEventListener("click", () => {
  gameController.resetGame();
  displayController.render();
});