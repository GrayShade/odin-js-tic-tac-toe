// ..................Setting up listeners via modulePattern........................
const listenersSetUp = (() => {
  const newGameId = document.getElementById('new-game-p');
  const quitGameID = document.getElementById('quit-game-p');
  const replayGameId = document.getElementById('replay-game-p');
  const submitBtnId = document.getElementById('form-button');

  const setModel = (() => {
    const modal = document.getElementById('myModal');
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

  // Previously, below listener was in start() in gameObj but it formed a closure to
  // start() as a listener is kept alive. After clicking replay, when a new game is 
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
    gameObj.start();
  });
  quitGameID.addEventListener('click', e => {
    gameObj.quitGame();
  });
  replayGameId.addEventListener('click', e => {
    gameObj.replayGame();
  });

})();
// .....................listeners module pattern ending here.......................


// 1st setting up necessary module patterns using factory functions inside IIFEs.
// Module pattern is just functions inside IIFEs. Created them independent of another 
// class / object instead of creating them inside game class only as opposed to 
// previous projects because of why not? IIFEs are doing encapsulation. 
// Right? Also, Remember that modules are something different than module pattern.

// Creating boardObj modulePattern:
let boardObj = (() => {
  // creating a new border of 3x3:
  let boardArr = [];
  for (let i = 0; i <= 8; i++) {
    boardArr.push('');
  }

  const getBoard = () => boardArr;

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
  }
  return { getBoard, resetBoard, updateBoard }
})();

// Creating displayObj modulePattern:
const displayObj = (() => {
  const updateBoard = (boardArr) => {
    const boardNodeList = document.querySelectorAll('.board-cells');
    for (let i = 0; i < boardNodeList.length; i++) {
      boardNodeList[i].textContent = boardArr[i];
    }
  }
  const updateOptions = (selectedOption = '', message = '') => {
    const newOptionEle = document.getElementById('new-game-p');
    const quitOptionEle = document.getElementById('quit-game-p');
    const replayOptionEle = document.getElementById('replay-game-p');
    const turnOptionEle = document.getElementById('player-turn-p');
    const messageEle = document.getElementById('message-p');
    if (selectedOption == 'new-game-p' || selectedOption == 'player-turn-p') {
      newOptionEle.style.display = 'none';
      messageEle.style.display = 'block';
      messageEle.textContent = message;
      quitOptionEle.style.display = 'block';
      replayOptionEle.style.display = 'none';
    }
    else
      if (selectedOption == 'quit-game-p') {

        quitOptionEle.style.display = 'none';
        turnOptionEle.style.display = 'none';
        newOptionEle.style.display = 'none';
        messageEle.style.display = 'block';
        messageEle.textContent = message;
        replayOptionEle.style.display = 'block';
      }
      else
        if (selectedOption == 'replay-game-p') {
          // Show card for player names on clicking replay:
          const modal = document.getElementById('myModal');
          modal.style.display = 'block';
          turnOptionEle.style.display = 'none';
          quitOptionEle.style.display = 'none';
          replayOptionEle.style.display = 'none';
          messageEle.style.display = 'block';
          messageEle.textContent = message;
        }
  }

  const announceResult = (winner = '', resultType) => {
    if (winner != '') {
      updateOptions('announcement-p');

    }
  }
  return { updateBoard, updateOptions }
})();

// Creating playerObj modulePattern:
const playerObj = (() => {
  const player1Icon = 'X';
  const player2Icon = 'O';
  let countP1Icon = 0;
  let countP2Icon = 0;
  const getCountP1Icon = () => countP1Icon;
  const getCountP2Icon = () => countP2Icon;
  let addToCountP1Icon = () => countP1Icon++;
  let addToCountP2Icon = () => countP2Icon++;
  const resetIconCount = () => {
    countP1Icon = 0;
    countP2Icon = 0;
  }
  const getP1Icon = () => player1Icon;
  const getP2Icon = () => player2Icon;
  const getP1Name = () => document.getElementById('p1').value;
  const getP2Name = () => document.getElementById('p2').value;
  // returning icons & names via functions, so they can't be changed 
  // from outside module pattern like playerObj.getP1Icon = 'Z'
  let p1Info = { getP1Name, getP1Icon, addToCountP1Icon, getCountP1Icon };
  let p2Info = { getP2Name, getP2Icon, addToCountP2Icon, getCountP2Icon };

  let p1Move = false;
  let p2Move = false;
  let moveAllowedStatus = { p1Move, p2Move }
  const getFirstMove = () => `${player1Icon}${player2Icon}`.charAt(Math.floor(Math.random() * 2));
  const getMoveAndPlayers = () => {
    let currentMove;
    let currentPlayer;
    let nextPlayer;
    if (p1Move) {
      currentMove = player1Icon;
      currentPlayer = getP1Name();
      nextPlayer = getP2Name();
      p1Move = false;
      p2Move = true;
    }
    else {
      currentMove = player2Icon;
      currentPlayer = getP2Name();
      nextPlayer = getP1Name();
      p2Move = false;
      p1Move = true;
    }
    return { currentMove, currentPlayer, nextPlayer, getFirstMove }
  }
  return { p1Info, p2Info, resetIconCount, getMoveAndPlayers, moveAllowedStatus };
})();

// Creating gameObj modulePattern:
const gameObj = (() => {
  let winner = '';
  // let countP1Icon = 0;
  // let countP2Icon = 0;
  const start = () => {
    const p1Name = playerObj.p1Info.getP1Name('p1');
    const p2Name = playerObj.p2Info.getP2Name('p2');
    const p1Icon = playerObj.p1Info.getP1Icon();
    // const p2Icon = playerObj.p2Info.getP2Icon();
    // For a new Game, first reset board:
    boardObj.resetBoard();
    displayObj.updateBoard(boardObj.getBoard());
    let firstMove = playerObj.getMoveAndPlayers().getFirstMove();
    if (firstMove == p1Icon) {
      displayObj.updateOptions('new-game-p', `${p1Name} move`);
    }
    else {
      displayObj.updateOptions('new-game-p', `${p2Name} move`);
    }
  }

  const processMove = (ele) => {
    // const p1Name = playerObj.p1Info.getP1Name('p1');
    // const p2Name = playerObj.p2Info.getP2Name('p2');
    // const p1Icon = playerObj.p1Info.getP1Icon();
    // const p2Icon = playerObj.p2Info.getP2Icon();
    if (boardObj.getBoard().includes('')) {
      let moveMade = playerObj.getMoveAndPlayers();
      let currentMove = moveMade['currentMove'];
      let nextPlayer = moveMade['nextPlayer'];
      boardObj.updateBoard(currentMove, ele);
      displayObj.updateBoard(boardObj.getBoard());
      processMoveResult();
      if (winner != '') {
        displayObj.updateOptions('quit-game-p', `${winner} won!`);
      } else
        if (winner == '' && boardObj.getBoard().includes('')) {
          displayObj.updateOptions('player-turn-p', `${nextPlayer} move`);
        } else
          if (winner == '' && !(boardObj.getBoard().includes(''))) {
            displayObj.updateOptions('quit-game-p', `game is draw!`);
          } else {
            quitGame();
          }
    }
    else {
      quitGame();
    }
  }

  const processMoveResult = () => {
    // const boardArr = boardObj.boardArr;
    // const boardArr = ['X', 'O', 'X', 'O', 'O', 'O', '', '', '']
    // using nested loops to check the winning combinations
    //  for x, y & diagonal axis:

    // const rowsWinStatus = checkRows;
    // const columnsWinStatus = checkColumns;
    // const diagonalWinStatus = checkDiagonals;
    const axesArray = [checkRows, checkColumns, checkDiagonals];
    for (const checkAxes of axesArray) {
      checkAxes();
      if (winner != '') {
        return
      }
      //     return {winnerStatus}
      //   }
      // }
      // return { '' }
    }

  }

  function checkRows() {
    const outerLoopObj = { 'start': 0, 'con': 6, 'inc': 3 };
    const innerLoopObj = { 'start': 0, 'con': 2, 'inc': 1 };
    loopThroughMoves(outerLoopObj, innerLoopObj)
    // for (let outer = 0; outer <= 6; outer += 3) {
    //   playerObj.resetIconCount();
    //   // playerObj.p2Info.addToCountP2Icon();
    //   // countP2Icon = 0;
    //   for (let x = outer; x <= outer + 2; ++x) {
    //     checkWinner(x);
    //   }
    //   if (winner != '') {
    //     return
    //   }
    // }
  }

  function checkColumns() {
    const outerLoopObj = { 'start': 0, 'con': 2, 'inc': 1 };
    const innerLoopObj = { 'start': 0, 'con': 6, 'inc': 3 };
    loopThroughMoves(outerLoopObj, innerLoopObj);
    // for (let outer = 0; outer <= 2; outer++) {
    //   playerObj.resetIconCount();
    //   // playerObj.p2Info.addToCountP2Icon();
    //   // countP2Icon = 0;
    //   for (let x = outer; x <= outer + 6; x += 3) {
    //     checkWinner(x);
    //   }
    //   if (winner != '') {
    //     return
    //   }
    // }
  };
  function checkDiagonals() {
    const outerLoopObj1 = { 'start': 0, 'con': 2, 'inc': 2 };
    const innerLoopObj1 = { 'start': 0, 'con': 8, 'inc': 4 };
    loopThroughMoves(outerLoopObj1, innerLoopObj1);
    // for (let outer = 0; outer <= 2; outer += 2) {
    //   playerObj.resetIconCount();
    //   // playerObj.p2Info.addToCountP2Icon();
    //   // countP2Icon = 0;
    //   for (let x = outer; x <= 8; x += 4) {
    //     checkWinner(x);
    //   }
    //   if (winner != '') {
    //     return
    //   }
    // }

    const outerLoopObj2 = { 'start': 0, 'con': 2, 'inc': 2 };
    const innerLoopObj2 = { 'start': 2, 'con': 6, 'inc': 2 };
    loopThroughMoves(outerLoopObj2, innerLoopObj2);
    // for (let outer = 0; outer <= 2; outer += 2) {
    //   playerObj.resetIconCount();
    //   for (let y = 2; y <= 6; y += 2) {
    //     checkWinner(y);
    //   }
    //   if (winner != '') {
    //     return
    //   }
    // }
  };

  const loopThroughMoves = (oLoop, iLoop) => {
    for (let outer = oLoop['start']; outer <= oLoop['con']; outer += oLoop['inc']) {
      playerObj.resetIconCount();
      for (let x = outer + iLoop['start']; x <= outer + iLoop['con']; x += iLoop['inc']) {
        checkWinner(x);
      }
      if (winner != '') {
        return
      }
    }
  }
  const checkWinner = (x) => {
    const p1Name = playerObj.p1Info.getP1Name('p1');
    const p2Name = playerObj.p2Info.getP2Name('p2');
    const p1Icon = playerObj.p1Info.getP1Icon();
    const p2Icon = playerObj.p2Info.getP2Icon();
    // const boardArr = ['X', 'O', 'X', 'O', 'O', 'O', '', '', '']
    const boardArr = boardObj.getBoard();
    if (boardArr[x] == p1Icon) {
      playerObj.p1Info.addToCountP1Icon();
      if (playerObj.p1Info.getCountP1Icon() == 3) {
        winner = p1Name;
        // return countP1Icon
      }
    }
    else
      if (boardArr[x] == p2Icon) {
        playerObj.p2Info.addToCountP2Icon();
        if (playerObj.p2Info.getCountP2Icon() == 3) {
          winner = p2Name;
          // return countP2Icon
        }
      }
    // return {winner}
  }

  const quitGame = () => {
    displayObj.updateBoard(boardObj.getBoard());
    winner = '';
    displayObj.updateOptions('quit-game-p', `${playerObj.getMoveAndPlayers().currentPlayer} quit...`);
  }
  const replayGame = () => {
    boardObj.resetBoard();
    displayObj.updateBoard(boardObj.getBoard());
    winner = '';
    displayObj.updateOptions('replay-game-p', 'Enter Names');
  }
  return { start, processMove, quitGame, replayGame }
})();



