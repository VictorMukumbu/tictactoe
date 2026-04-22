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
const player1=players("Jogn","X")
const player2=players("Mary","O")
// console.log(player1)
// console.log(player2)

// game control function
const gameController=(()=>{
    // if currentPlayer has made a move and game isnt over
    let currentPlayer = player1;
    let gameOver = false
    let winningCells = null;

    const switchPlayer =()=>{
        //check if current player is player1 if true switch player,else don't
        currentPlayer = currentPlayer===player1?player2:player1;
    }
    //getcurrentplayer returns current player
    const getCurrentPlayer =()=>currentPlayer

    //update the playrounds
    const playRound=(index)=>{
        if(gameOver){return}


        const board =gameBoard.getBoard()
        if (board[index] !== "") return; //  prevent overwrite
        gameBoard.setCell(index,currentPlayer.marker)

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

        const result = checkWin();

        if (result) {
            winningCells = result;

            document.getElementById("status").textContent =
                `${currentPlayer.name} wins!`;

            gameOver = true;
            return;
        }

        if(checkDraw()){
            document.getElementById("status").textContent = "It's a draw!";
            gameOver=true
            return
        }

        switchPlayer()
            document.getElementById("status").textContent =`${currentPlayer.name}'s turn`;

        // 🤖 AI plays automatically if it's player2
        if (!gameOver && currentPlayer === player2) {
            setTimeout(() => {
                aiMove();
                displayController.render(); // re-render after AI move
            }, 500); // small delay feels natural
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
    const resetGame=()=>{
        gameBoard.resetBoard()
        currentPlayer=player1
        gameOver=false
        winningCells = null
    }
    //show winning cells
    const getWinningCells = () => winningCells;

    //return
    return {playRound,getCurrentPlayer,resetGame,getWinningCells}

})()

//manipulate dom
const displayController =(()=>{
    const boardDiv = document.getElementById("board");

    const render = () => {
        boardDiv.innerHTML = "";

        const winningCells = gameController.getWinningCells();

        gameBoard.getBoard().forEach((cell, index) => {
        const cellDiv = document.createElement("div");
        cellDiv.classList.add("cell");
        cellDiv.textContent = cell;

        //add win class to winning cells
        if (winningCells && winningCells.includes(index)) {
            cellDiv.classList.add("win");
        }

        cellDiv.addEventListener("click", () => {
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

document.getElementById("status").textContent = `${gameController.getCurrentPlayer().name}'s turn`;

document.getElementById("restart").addEventListener("click", () => {
  gameController.resetGame();
  displayController.render();
  document.getElementById("status").textContent = `${gameController.getCurrentPlayer().name}'s turn`;
});