// ..................Setting up listeners via modulePattern........................
const listenersSetUp = (() => {
  const newGameId = document.getElementById('new-game-p');
  const quitGameID = document.getElementById('quit-game-p');
  const replayGameId = document.getElementById('replay-game-p');
  const playerTurnId = document.getElementById('player-turn-p');
  const submitBtnId = document.getElementById('form-button');

  const setModel = (() => {
    const modal = document.getElementById('myModal');
    // const btn = document.getElementById('header-btn');
    const span = document.getElementsByClassName("close")[0];

    newGameId.addEventListener('click', e => {
      modal.style.display = 'block';
    });

    span.addEventListener('click', e => {
      modal.style.display = 'none';
    });

    // for closing modal if clicked anywhere on screen while model is 
    // opened:
    window.addEventListener('click', e => {
      if (e.target == modal) {
        modal.style.display = 'none';
      }
    });
  })();

  // Previously, below listener was in play() in gameObj but it formed a closure to
  // play() as a listener is kept alive. After clicking replay, when a new game is 
  // started, another listener is formed while previous one still present.
  // Lesson learned. Make sure listeners are called one time only  or overwrite
  // previous ones, Not form closures
  const boardCellsArr = document.querySelectorAll('.board-cells');
  boardCellsArr.forEach((arrEle) => {
    arrEle.addEventListener('click', (ele) => {
      gameObj.processMove(ele);
    });
  });

  submitBtnId.addEventListener('click', e => {
    // hide card for player names automatically:
    const modal = document.getElementById('myModal');
    modal.style.display = 'none';
    gameObj.play();
  });
  quitGameID.addEventListener('click', e => {
    gameObj.quitGame();
  });
  replayGameId.addEventListener('click', e => {
    gameObj.replayGame();
  });

  // return { newGameId, quitGameID, replayGameId, playerTurnId, submitBtnId }
})();
// .....................listeners module pattern ending here.......................


// 1st setting up necessary module patterns using factory functions inside IIFEs.
// Module pattern is just functions inside IIFEs. Created them independent of another 
// class / object instead of creating them inside game class only as opposed to 
// previous projects because of wwhy not? IIFEs are doing encapsulation. 
// Right? Also, Remember that modules are something different than module pattern.

// Creating boardObj modulePattern:
let boardObj = (() => {
  // creating a new border of 3x3:
  let boardArr = [];
  for (let i = 0; i <= 8; i++) {
    boardArr.push('');
  }

  // reset board function
  const resetBoard = () => {
    for (let i = 0; i < boardArr.length; i++) {
      boardArr[i] = '';
    }
  }

  // displayObj also has updateBoard method but it does not matter as
  // to access that you have to use << displayObj.updateBoard() >>. To
  // access boardObj's << updateBoard >>, gotta use << boardObj.updateBoard() >>.
  // Thus module pattern helps in namespacing too to avoid naming collision. 
  const updateBoard = (currentMove, ele) => {
    const eleArr = document.querySelectorAll('.board-cells');
    for (let i = 0; i < eleArr.length; i++) {
      if (eleArr[i].id == ele.target.id) {
        boardArr[i] = currentMove;
      }
    }
    // console.log(ele.target.id);
  }
  return { boardArr, resetBoard, updateBoard }
})();

// Creating displayObj modulePattern:
const displayObj = (() => {
  const updateBoard = (boardArr) => {
    const boardNodeList = document.querySelectorAll('.board-cells');
    for (let i = 0; i < boardNodeList.length; i++) {
      boardNodeList[i].textContent = boardArr[i];
      // console.log(boardNodeList[i].textContent);
    }
  }
  const updateOptions = (selectedOption = '', playerName = '') => {
    const newOptionEle = document.getElementById('new-game-p');
    const quitOptionEle = document.getElementById('quit-game-p');
    const replayOptionEle = document.getElementById('replay-game-p');
    const turnOptionEle = document.getElementById('player-turn-p');
    // const optionsArray = [newOptionEle, quitOptionEle, replayOptionEle, turnOptionEle]
    // for (const ele of optionsArray) {
    if (selectedOption == 'new-game-p' || selectedOption == 'player-turn-p') {
      newOptionEle.style.display = 'none';
      turnOptionEle.style.display = 'block';
      turnOptionEle.textContent = `${playerName} move`;
      quitOptionEle.style.display = 'block';
      replayOptionEle.style.display = 'none';
    }
    else
      if (selectedOption == 'quit-game-p') {
        quitOptionEle.style.display = 'none';
        turnOptionEle.style.display = 'none';
        newOptionEle.style.display = 'none';
        replayOptionEle.style.display = 'block';
      }
      else
        if (selectedOption == 'replay-game-p') {
          // Show card for player names on clicking replay:
          const modal = document.getElementById('myModal');
          modal.style.display = 'block';
          turnOptionEle.style.display = 'none';
          // turnOptionEle.textContent = `${playerIcon} move`
          quitOptionEle.style.display = 'none';
          replayOptionEle.style.display = 'none';
          newOptionEle.style.display = 'block';
        }

    // }
  }
  return { updateBoard, updateOptions }
})();

// Creating playerObj modulePattern:
const playerObj = (() => {
  const player1Icon = 'X';
  const player2Icon = 'O';
  const getPlayer1Icon = () => player1Icon;
  const getPlayer2Icon = () => player2Icon;
  const getPlayer1Name = () => document.getElementById('p1').value;
  const getPlayer2Name = () => document.getElementById('p2').value;
  // returning icons & names via functions, so they can't be changed 
  // from outside module pattern like playerObj.getPlayer1Icon = 'Z'
  const p1Info = { getPlayer1Name, getPlayer1Icon };
  const p2Info = { getPlayer2Name, getPlayer2Icon };

  let p1Move = false;
  let p2Move = false;
  // let getP1Move = () => p1Move;
  // let getP2Move = () => p2Move;
  let playerMoves = { p1Move, p2Move }
  const getFirstMove = () => `${player1Icon}${player2Icon}`.charAt(Math.floor(Math.random() * 2));
  const getMove = () => {
    let currentMove;
    let currentPlayer;
    let nextPlayer;
    if (p1Move) {
      currentMove = player1Icon;
      currentPlayer = getPlayer1Name();
      nextPlayer = getPlayer2Name();
      p1Move = false;
      p2Move = true;
      // return {currentMove, currentPlayer, nextPlayer}
    }
    else {
      currentMove = player2Icon;
      currentPlayer = getPlayer2Name();
      nextPlayer = getPlayer1Name();
      p2Move = false;
      p1Move = true;
      // return {currentMove, currentPlayer, nextPlayer}
    }
    return { currentMove, currentPlayer, nextPlayer }
  }
  return { p1Info, p2Info, getFirstMove, getMove, playerMoves };
})();

// Creating gameObj modulePattern:
const gameObj = (() => {
  const result = '';

  const play = () => {
    // const p1Name = playerObj.getPlayer1Name('p1');
    const p1Name = playerObj.p1Info.getPlayer1Name('p1');
    const p2Name = playerObj.p2Info.getPlayer2Name('p2');
    const p1Icon = playerObj.p1Info.getPlayer1Icon();
    const p2Icon = playerObj.p2Info.getPlayer2Icon();
    // For a new Game, first reset board:
    boardObj.resetBoard();
    displayObj.updateBoard(boardObj.boardArr);

    // let p1_move = playerObj.getP1Move();
    // let p2_move = playerObj.getP2Move();
    let p1Move = playerObj.playerMoves.p1Move;
    let p2Move = playerObj.playerMoves.p2Move;
    let firstMove = playerObj.getFirstMove();
    if (firstMove == p1Icon) {
      displayObj.updateOptions('new-game-p', p1Name);
      p1Move = true;
    }
    else {
      displayObj.updateOptions('new-game-p', p2Name);
      p2Move = true;
    }
    // - Show player turn along with quit game option during game running:
    // displayObj.updateOptions('quit-game-p');
    // const quitEle = document.getElementById('quit-game-p');
    // quitEle.addEventListener('click', (ele) => {
    //   quitGame();
    // });
    // const replayEle = document.getElementById('replay-game-p');
    // replayEle.addEventListener('click', (ele) => {
    //   replayGame();
    // });


    // const boardCellsArr = document.querySelectorAll('.board-cells');
    // boardCellsArr.forEach((arrEle) => {
    //   arrEle.addEventListener('click', (ele) => {

    //   });
    // });

  }

  const processMove = (ele) => {
    if (boardObj.boardArr.includes('')) {
      let moveMade = playerObj.getMove();
      let currentMove = moveMade['currentMove'];
      let nextPlayer = moveMade['nextPlayer'];
      boardObj.updateBoard(currentMove, ele);
      displayObj.updateBoard(boardObj.boardArr);
      displayObj.updateOptions('player-turn-p', nextPlayer);
      if (!boardObj.boardArr.includes('')) {
        // remove below
        quitGame();
      }
    }
    else {
      // remove below
      quitGame();
    }
  }

  const quitGame = () => {
    // remove below
    console.log('Game is over');
    // boardObj.resetBoard();
    displayObj.updateBoard(boardObj.boardArr);
    displayObj.updateOptions('quit-game-p');
  }
  const replayGame = () => {
    // console.log('new Game Started');
    boardObj.resetBoard();
    displayObj.updateBoard(boardObj.boardArr);
    displayObj.updateOptions('replay-game-p');
  }
  return { play, processMove, quitGame, replayGame }
})();



