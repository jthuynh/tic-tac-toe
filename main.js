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

    const removeTile = (idx) => {
        empty_tiles.splice(idx, 1);
        console.log(empty_tiles);
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
                board[winLines[i][0]] === board[winLines[i][1]] && 
                board[winLines[i][0]] === board[winLines[i][2]]) {
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
        
        if (res == "t") {
            str = "TIE!";
        } else if (res == "0") {
            str = "Player 1 won!";
        } else if (res == "1") {
            str = "Player 2 won!";
        }
        const result = document.createElement('p');
        result.innerHTML = str;
        result.classList.add('result');
        const wrapper = document.querySelector(".wrapper");
        wrapper.appendChild(result);
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
        } else if (e.target.id[0] == "u") {
            player = UnbeatableAI(e.target.id, marker, "Computer");
        }
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
                playGame();
            }

            endGame(`${turn}`);
        }
        if (players[0].type == "Player" || players[1].type == "Player") {
            const container = document.querySelector(".container").children;
            for (item of container) {
                item.addEventListener('click', clickFunction);
            }
            
        }
        if (players[0].type == "Computer" && players[1].type == "Player") {
            playGame();
        }
    }

    const createPlayers = () => {
        // TODO
        // give access to button clicks for both players
        const buttons = document.querySelectorAll(".player-button");
        buttons.forEach(button => button.addEventListener('click', disableButtons));

        // if button in player 1 selection: change the player name and highlight button selected
        // gray out buttons not selected
        // add players to players array
    }

    const init = () => {
        // Set up the board
        gameBoard.createBoard();
        // Create Players
        createPlayers();

        // play game
        
    }

    const clickFunction = e => {
        
        // place Move
        // console.log(players[turn].prototype.toString.call(t));
        // console.log(players[turn].type);
        if (players[turn].type == "Player") {
            players[turn].placeMove(e);
            // remove Click Function from current id                                                 
            const tile = document.getElementById(e.target.id);
            tile.removeEventListener("click", clickFunction, false);
        } 
        
        displayGameBoard();
        changePlayer();
        playGame();
        // // display board
        // displayGameBoard();
        // // check for win
        // if (checkWin()) {
        //     endGame(`${turn}`);
        // } else if (gameBoard.isBoardFull()) {
        //     endGame("t");
        // }

        // changePlayer();
    }

    const playGame = () => {
        // set up the handlers for clicking on each tile
        

        if (!checkWin()) {
            if (players[turn].type == "Computer") {
                players[turn].placeMove();
            } 
            if (gameBoard.isBoardFull()) {
                endGame("t");
            }
            displayGameBoard();
            changePlayer();
        } else {
            endGame(`${turn}`);
        }
        // if (players[turn].type == "Computer") {
        //     players[turn].placeMove();
        // }

        // // display board
        // displayGameBoard();
        // // check for win
        // if (checkWin()) {
        //     endGame(`${turn}`);
        // } else if (gameBoard.isBoardFull()) {
        //     endGame("t");
        // }

        // changePlayer();

    }

    return {
        init,
    };
})();

const Player = (name, marker, type) => {
    const placeMove = e => {

        if (e.target == 'x' || e.target == 'o') {
            return;
        } else {
            console.log(e.target.id-1);
            // const board = gameBoard.getBoard();
            // board[e.target.id - 1] = marker;
            // gameBoard.setBoard(board);
            const empty_tiles = gameBoard.getEmptyTiles();

            gameBoard.placeMove(e.target.id - 1, marker);
            gameBoard.removeTile(empty_tiles.indexOf(e.target.id - 1));
            console.log("player ", empty_tiles, empty_tiles.indexOf(e.target.id - 1));
        }
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
        // console.log('easy nerd stuff');
        // if (e.target == 'x' || e.target == 'o') {
        //     return;
        // } else {
            const empty_tiles = gameBoard.getEmptyTiles();
            // var rand_tile = empty_tiles[Math.floor(Math.random() * empty_tiles.length)];
            var rand_tile = Math.floor(Math.random() * empty_tiles.length);

            // const board = gameBoard.getBoard();
            // board[rand_tile] = marker;
            // gameBoard.setBoard(board);
            gameBoard.placeMove(empty_tiles[rand_tile], marker);
            gameBoard.removeTile(rand_tile);
            console.log(rand_tile, marker);

            // remove clickFunction for the chosen tile as well;
        // }
        // find the best value using the minimax algorithm to figure out the values of each move
        // use teh remaining moves left to recurse through
        // check for win where it's the human, ai, or tie
    };
    return Object.assign({}, prototype, {placeMove});
}

const UnbeatableAI = (name, marker, type) => {
    const prototype = Player(name, marker);
    const placeMove = () => {
        console.log('hard nerd stuff');
    };
    return Object.assign({}, prototype, {placeMove});
}

displayController.init();
