const gameBoard = (() => {
    // let board = ['x','o','x','o','x','o','x','o','x'];
    let board = [];

    const setBoard = (newBoard) => board = newBoard;
    const getBoard = () => board;

    const createBoard = () => {
        board = ['','','','','','','','',''];
    };

    const setBoardHandlers = e => {
        const container = document.querySelector(".container").children;
        container.array.forEach(element => {
            const curPlayer = Players[e.target.id];
            element.addEventListener('click', curPlayer.placeMove);
        });
    }

    return{
        setBoard: setBoard,
        getBoard: getBoard,
        createBoard,
        setBoardHandlers
    };
})();

const displayController =(() => {
    const displayGameBoard = () => {
        let board = gameBoard.getBoard();

        const container = document.querySelector(".container").children;
        for (let i = 0; i < container.length; i++) {
            container[i].innerHTML = board[i];
        }
    }
    return {
        displayGameBoard,
    };
})();

const Player = (name, marker) => {
    let id = null;
    (marker === 'x') ? id = 0 : id = 1;

    const playerMarker = marker;
    const setName = (name) => name;
    const getName = () => name;

    const setHandlers = () => {
        const container = document.querySelector(".container").children;
        for (item of container) {
            item.addEventListener('click', placeMove);
        }
    }

    const placeMove = e => {
        if (e.target == 'x' || e.target == 'o') {
            return;
        } else {
            const board = gameBoard.getBoard();
            board[e.target.id - 1] = playerMarker;
            gameBoard.setBoard(board);
        }
        displayController.displayGameBoard();
        // change player turn
        playerTurn = (Players[0].id == 0) ? Players[1].id : Players[0].id;

    };

    return {
        id: id,
        setName: setName,
        getName: getName,
        setHandlers,
        placeMove,
    };
};

function playGame() {
    // get game preference (AI or Humans for both)
    const Players = [];
    
    gameBoard.createBoard();
    const player1 = Player('player1', 'x');
    player1.setHandlers();
    const player2 = Player('player2', 'o');
    player2.setHandlers();

    Players.push(player1);
    Players.push(player2);   
    // const playerTurn = (Players[0].id == 0) ? Players[1].id : Players[0].id;

    displayController.displayGameBoard();

}

playGame();