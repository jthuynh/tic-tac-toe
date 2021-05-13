const gameBoard = (() => {
    let board = [];

    const setBoard = (newBoard) => board = newBoard;
    const getBoard = () => board;

    const createBoard = () => {
        board = ['','','','','','','','',''];
    };

    const placeMove = (index, mark) => {
        board[index] = mark
    }

    const getMove = (index) => {
        return board[index]
    }

    const isBoardFull = () => {
        for (let i = 0; i < board.length; i++) {
            if (board[i] == '') {
                return false
            }
        }

        return true
    }

    return{
        setBoard: setBoard,
        getBoard: getBoard,
        createBoard,
        placeMove,
        getMove,
        isBoardFull,
        // setBoardHandlers
    };
})();

const displayController =(() => {
    let turn = 0
    let players = [];
    const displayGameBoard = () => {
        let board = gameBoard.getBoard();

        const container = document.querySelector(".container").children;
        for (let i = 0; i < container.length; i++) {
            container[i].innerHTML = board[i];
        }
    }

    const changePlayer = () => {
        (turn == 0) ? turn = 1: turn = 0
        // console.log(turn)
    }

    const checkWin = () => {
        board = gameBoard.getBoard();
        const winLines = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]];
        for (let i = 0; i < winLines.length; i++) {
            if (board[winLines[i][0]] != "" && 
                board[winLines[i][0]] === board[winLines[i][1]] && 
                board[winLines[i][0]] === board[winLines[i][2]]) {
                    return true
            } 
        }

        return false
    }

    const endGame = res => {
        const container = document.querySelector(".container").children;
        for (item of container) {
            item.removeEventListener("click", clickFunction, false);
        }

        let str = "";
        
        if (res == "t") {
            str = "TIE!";
        } else if (res == "0") {
            str = "Player 1 won!";
        } else if (res == "1") {
            str = "Player 2 won!";
        }
        console.log(str);
        const result = document.createElement('p');
        result.innerHTML = str;
        result.classList.add('result');
        const wrapper = document.querySelector(".wrapper");
        // console.log(wrapper);
        wrapper.appendChild(result);
    }

    const init = () => {
        // Set up the board
        gameBoard.createBoard();
        // Set up the players
        const player1 = Player('player1', 'x');
        const player2 = Player('player2', 'o');
        players.push(player1);
        players.push(player2);
        // play game
        playGame();
    }

    const clickFunction = e => {
        // place Move
        players[turn].placeMove(e);
        // remove Click Function from current id
        const tile = document.getElementById(e.target.id);
        tile.removeEventListener("click", clickFunction, false);
        // display board
        displayGameBoard();
        // check for win
        if (checkWin()) {
            endGame(`${turn}`);
        } else if (gameBoard.isBoardFull()) {
            endGame("t");
        }
        changePlayer();
    }

    const playGame = () => {
        // set up the handlers for clicking on each tile
        const container = document.querySelector(".container").children;
        for (item of container) {
            item.addEventListener("click", clickFunction);
        }
        
    }

    return {
        init,
    };
})();

const Player = (name, marker) => {
    const playerMarker = marker;
    const setName = (name) => name;
    const getName = () => name;

    const placeMove = e => {

        if (e.target == 'x' || e.target == 'o') {
            return;
        } else {
            // const container = document.querySelector(".container").children;
            // container[e.target.id - 1].innerHTML = playerMarker;
            console.log(e.target.id-1)
            const board = gameBoard.getBoard();
            board[e.target.id - 1] = playerMarker;
            gameBoard.setBoard(board);
        }

        // displayController.displayGameBoard();
        // removeHandlers();
        // displayController.changePlayer();
    };

    return {
        setName: setName,
        getName: getName,
        placeMove,
    };
};

displayController.init();