const gameBoard = (() => {
    let board = [];
    let empty_tiles = [0,1,2,3,4,5,6,7,8];

    const setBoard = (newBoard) => board = newBoard;
    const getBoard = () => board;

    const createBoard = () => {
        board = ['','','','','','','','',''];
    };

    const placeMove = (index, mark) => {
        board[index] = mark;
    }

    const getEmptyTiles = () => {
        return empty_tiles;
    }

    const resetEmptyTiles = () => {
        empty_tiles = [0,1,2,3,4,5,6,7,8];
    }

    const removeTile = (idx) => {
        empty_tiles.splice(idx, 1);
    }

    const isBoardFull = () => {
        for (let i = 0; i < board.length; i++) {
            if (board[i] == '') {
                return false;
            }
        }

        return true;
    }

    return{
        setBoard: setBoard,
        getBoard: getBoard,
        createBoard,
        placeMove,
        getEmptyTiles,
        resetEmptyTiles,
        removeTile,
        isBoardFull,
    };
})();

const displayController =(() => {
    let turn = 0;
    let players = new Array(2);
    const displayGameBoard = () => {
        let board = gameBoard.getBoard();

        const container = document.querySelector(".container").children;
        for (let i = 0; i < container.length; i++) {
            if (board[i] == "x") {
                container[i].style.color = "#8F91FF";
            } else if (board[i] == "o") {
                container[i].style.color = "#5CB85C";
            }
            container[i].innerHTML = board[i];
        }
    }

    const changePlayer = () => {
        (turn == 0) ? turn = 1: turn = 0;
    }

    const checkWin = () => {
        board = gameBoard.getBoard();
        const winLines = [[0,1,2], [3,4,5], [6,7,8], [0,3,6], [1,4,7], [2,5,8], [0,4,8], [2,4,6]];
        for (let i = 0; i < winLines.length; i++) {
            if (board[winLines[i][0]] != "" && 
                board[winLines[i][0]] == board[winLines[i][1]] && 
                board[winLines[i][0]] == board[winLines[i][2]]) {
                    return true;
            } 
        }

        return false;
    }

    const endGame = res => {
        const container = document.querySelector(".container").children;
        for (item of container) {
            item.removeEventListener("click", clickFunction, false);
        }

        let str = "";
        const result = document.getElementById('result');

        if (res == "t") {
            str = "TIE!";
            result.style.color = "white";
        } else if (res == "0") {
            str = "Player 1 won!";
            result.classList.add("player1-color");
        } else if (res == "1") {
            str = "Player 2 won!";
            result.classList.add("player2-color");
        }
        result.innerHTML = str;
    }
    
    const disableButtons = e => {
        const parent = e.target.parentElement;
        const player_num = e.target.parentElement.id.slice(-1);
        const marker = (player_num == '1' ? 'x' : 'o');
        let player = null;

        if (e.target.id[0] == "h") {
            player = Player(e.target.id, marker, "Player");
            const container = document.querySelector(".container").children;
            
        } else if (e.target.id[0] == "r") {
            player = RandomAI(e.target.id, marker, "Computer");
        } 
        // else if (e.target.id[0] == "u") {
        //     player = UnbeatableAI(e.target.id, marker, "Computer");
        // }
        players[parseInt(player_num) - 1] = player;

        for (let i = 1; i < parent.children.length; i++) {
            parent.children[i].removeEventListener('click', disableButtons, false);
            parent.children[i].disabled = true;
            if (parent.children[i] == e.target) {
                parent.children[i].classList.add('selected');
            } else{
                parent.children[i].classList.add('not-selected');
            }
        }

        if (players[0].type == "Computer" && players[1].type == "Computer") {
            while(!checkWin()) {
                if (gameBoard.isBoardFull()) {
                    endGame("t");
                    break;
                } 
                playGame();
            }

            if (!gameBoard.isBoardFull()) {
                endGame(`${turn}`);
            }
        }

        if (players[0].type == "Computer" && players[1].type == "Player") {
            playGame();
        }

        if (players[0].type == "Player" || players[1].type == "Player") {
            const container = document.querySelector(".container").children;
            for (item of container) {
                item.addEventListener('click', clickFunction);
            }
        }
    }

    const createPlayers = () => {
        const buttons = document.querySelectorAll(".player-button");
        buttons.forEach(button => button.addEventListener('click', disableButtons));
    }

    const resetGame = e => {
        players = new Array(2);
        gameBoard.createBoard();
        gameBoard.resetEmptyTiles();
        displayGameBoard();

        const buttons = document.querySelectorAll(".player-button");
        buttons.forEach(button => {
            button.classList.remove("not-selected","selected");
            button.disabled = false;
        });
        createPlayers();
        document.getElementById("result").innerHTML = "";
        turn = 0;
    }

    const setReset = () => {
        const resetBtn = document.querySelector("#reset");
        resetBtn.addEventListener('click', resetGame);
    }

    const init = () => {
        setReset();
        gameBoard.createBoard();
        createPlayers();        
    }

    const clickFunction = e => {
        if (players[turn].type == "Player") {
            if (!players[turn].placeMove(e)) {
                return;
            }
            const tile = document.getElementById(e.target.id);
            tile.removeEventListener("click", clickFunction, false);
        } 
        
        displayGameBoard();
        if ((players[0].type == "Player" && players[1].type != "Player")
            || (players[0].type != "Player" && players[1].type == "Player")){
            
                changePlayer();
        }
        playGame();
    }
    
    const removeClick = idx => {
        const container = document.querySelector(".container").children;
        console.log(container[idx], container[idx].click);
        container[idx].removeEventListener("click", clickFunction, false);
        container[idx].click = false;
    }

    const playGame = () => {
        if (players[turn].type == "Computer") {
            players[turn].placeMove(); 
        } 
        displayGameBoard();

        if (!checkWin()) {
            if (gameBoard.isBoardFull()) {
                endGame("t");
            }
            changePlayer();
        } else {
            endGame(`${turn}`);
        }
    }

    return {
        init,
        removeClick
    };
})();

const Player = (name, marker, type) => {
    const placeMove = e => {
        const board = gameBoard.getBoard();
        if (board[e.target.id - 1] != "") {
            return false;
        }

        const empty_tiles = gameBoard.getEmptyTiles();
        gameBoard.placeMove(e.target.id - 1, marker);
        gameBoard.removeTile(empty_tiles.indexOf(e.target.id - 1));
        return true;
    };

    return {
        name,
        type,
        placeMove,
    };
};

const RandomAI = (name, marker, type) => {
    const prototype = Player(name, marker, type);
    const placeMove = () => {
        const empty_tiles = gameBoard.getEmptyTiles();
        var rand_tile = Math.floor(Math.random() * empty_tiles.length);
        gameBoard.placeMove(empty_tiles[rand_tile], marker);
        gameBoard.removeTile(rand_tile);

        // find the best value using the minimax algorithm to figure out the values of each move
        // use teh remaining moves left to recurse through
        // check for win where it's the human, ai, or tie
    };
    return Object.assign({}, prototype, {placeMove});
}

// const UnbeatableAI = (name, marker, type) => {
//     const prototype = Player(name, marker);
//     const placeMove = () => {
//         console.log('hard nerd stuff');
//     };
//     return Object.assign({}, prototype, {placeMove});
// }

displayController.init();
