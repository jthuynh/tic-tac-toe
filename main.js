const gameBoard = (() => {
    // let board = ['x','o','x','o','x','o','x','o','x'];
    let board = [];

    const setBoard = (newBoard) => board = newBoard;
    const getBoard = () => board;

    const createBoard = () => {
        board = [' ',' ',' ',' ',' ',' ',' ',' ',' '];
    };

    return{
        setBoard: setBoard,
        getBoard: getBoard,
        createBoard
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
        if (e.target == 'x' || 'o') {
            return;
        } else {
            const board = getBoard();
            board[e.target.id] = playerMarker;
        }
        displayController.displayGameBoard();
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
    console.log(Players[0].id);
    const playerTurn = (Players[0].id == 0) ? Players[1].id : Players[0].id;
    console.log(playerTurn);

    displayController.displayGameBoard();

}

playGame();