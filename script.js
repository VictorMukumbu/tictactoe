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

        if(checkWin()){
            document.getElementById("status").textContent =`${currentPlayer.name} wins!`;
            gameOver=true
            return
        }

        if(checkDraw()){
            document.getElementById("status").textContent = "It's a draw!";
            gameOver=true
            return
        }

        switchPlayer()
            document.getElementById("status").textContent =`${currentPlayer.name}'s turn`;
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

        return winPatterns.some(pattern => pattern.every(i => winningBoard[i] === currentPlayer.marker))
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
    }

    //return
    return {playRound,getCurrentPlayer,resetGame}

})()

//manipulate dom
const displayController =(()=>{
    const boardDiv = document.getElementById("board");

    const render = () => {
        boardDiv.innerHTML = "";

        gameBoard.getBoard().forEach((cell, index) => {
        const cellDiv = document.createElement("div");
        cellDiv.classList.add("cell");
        cellDiv.textContent = cell;

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