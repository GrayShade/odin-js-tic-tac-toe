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
  }
  return { boardArr, resetBoard, updateBoard }
})();

// Creating displayObj modulePattern:
const displayObj = (() => {
  const updateBoard = (boardArr) => {
    const boardNodeList = document.querySelectorAll('.board-cells');
    for (let i = 0; i < boardNodeList.length; i++) {
      boardNodeList[i].textContent = boardArr[i];
    }
  }
  const updateOptions = (selectedOption = '', playerName = '') => {
    const newOptionEle = document.getElementById('new-game-p');
    const quitOptionEle = document.getElementById('quit-game-p');
    const replayOptionEle = document.getElementById('replay-game-p');
    const turnOptionEle = document.getElementById('player-turn-p');
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
          quitOptionEle.style.display = 'none';
          replayOptionEle.style.display = 'none';
          newOptionEle.style.display = 'block';
        }
  }
  return { updateBoard, updateOptions }
})();

// Creating playerObj modulePattern:
const playerObj = (() => {
  const player1Icon = 'X';
  const player2Icon = 'O';
  const getP1Icon = () => player1Icon;
  const getP2Icon = () => player2Icon;
  const getPlayer1Name = () => document.getElementById('p1').value;
  const getPlayer2Name = () => document.getElementById('p2').value;
  // returning icons & names via functions, so they can't be changed 
  // from outside module pattern like playerObj.getP1Icon = 'Z'
  const p1Info = { getPlayer1Name, getP1Icon };
  const p2Info = { getPlayer2Name, getP2Icon };

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
      currentPlayer = getPlayer1Name();
      nextPlayer = getPlayer2Name();
      p1Move = false;
      p2Move = true;
    }
    else {
      currentMove = player2Icon;
      currentPlayer = getPlayer2Name();
      nextPlayer = getPlayer1Name();
      p2Move = false;
      p1Move = true;
    }
    return { currentMove, currentPlayer, nextPlayer }
  }
  return { p1Info, p2Info, getFirstMove, getMoveAndPlayers, moveAllowedStatus };
})();

// Creating gameObj modulePattern:
const gameObj = (() => {
  let winner = '';
  const p1Name = playerObj.p1Info.getPlayer1Name('p1');
  const p2Name = playerObj.p2Info.getPlayer2Name('p2');
  const p1Icon = playerObj.p1Info.getP1Icon();
  const p2Icon = playerObj.p2Info.getP2Icon();
  const start = () => {
    // For a new Game, first reset board:
    boardObj.resetBoard();
    displayObj.updateBoard(boardObj.boardArr);
    let firstMove = playerObj.getFirstMove();
    if (firstMove == p1Icon) {
      displayObj.updateOptions('new-game-p', p1Name);
    }
    else {
      displayObj.updateOptions('new-game-p', p2Name);
    }
  }

  const processMove = (ele) => {
    if (boardObj.boardArr.includes('')) {
      let moveMade = playerObj.getMoveAndPlayers();
      let currentMove = moveMade['currentMove'];
      let nextPlayer = moveMade['nextPlayer'];
      boardObj.updateBoard(currentMove, ele);
      const result = checkResult(p1Name, p2Name, p1Icon, p2Icon);
      if (boardObj.boardArr.includes('')) {
        displayObj.updateBoard(boardObj.boardArr);
        displayObj.updateOptions('player-turn-p', nextPlayer);
      } else {
        quitGame();
      }
    }
    else {
      quitGame();
    }
  }

  const checkResult = (p1Name, p2Name, p1Icon, p2Icon) => {
    winner = ''
    // const boardArr = boardObj.boardArr;
    const boardArr = ['X', 'X', 'X', '', '', '', '', '', '']
    // using nested loops to check the winning combinations
    //  for x, y & diagonal axis:
    for (let outer = 0; outer <= boardArr.length; outer + 3) {
      let countP1Icon = 0;
      let countP2Icon = 0;
      for (let x = outer; x <= outer + 2; ++x) {
        if (boardArr[x] == p1Icon) {
          countP1Icon++;
        }
        else
          if (boardArr[x] == p2Icon) {
            countP2Icon++;
          }
      }
      if (countP1Icon == 3) {
        winner = p1Name;
        break;
      }
      else
        if (countP2Icon == 3) {
          winner = p2Name;
          break;
        }
    }
    return { winner }
  }

  const quitGame = () => {
    displayObj.updateBoard(boardObj.boardArr);
    displayObj.updateOptions('quit-game-p');
  }
  const replayGame = () => {
    boardObj.resetBoard();
    displayObj.updateBoard(boardObj.boardArr);
    displayObj.updateOptions('replay-game-p');
  }
  return { start, processMove, quitGame, replayGame }
})();



