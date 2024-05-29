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

  submitBtnId.addEventListener('click', e => {
    gameObj.play()
  });
  quitGameID.addEventListener('click', e => {
    gameObj.quitGame();
  });
  replayGameId.addEventListener('click', e => {
    gameObj.replayGame();
  });

  return { newGameId, quitGameID, replayGameId, playerTurnId, submitBtnId }
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
    boardArr.forEach(ele => {
      boardArr[ele] = '';
    });
  }
  return { boardArr, resetBoard }
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
  const updateOptions = (selectedOption = '', playerIcon = '') => {
    const newOptionEle = document.getElementById('new-game-p');
    const quitOptionEle = document.getElementById('quit-game-p');
    const replayOptionEle = document.getElementById('replay-game-p');
    const turnOptionEle = document.getElementById('player-turn-p');
    // const optionsArray = [newOptionEle, quitOptionEle, replayOptionEle, turnOptionEle]
    // for (const ele of optionsArray) {
    if (selectedOption == 'new-game-p') {
      newOptionEle.style.display = 'none';
      turnOptionEle.style.display = 'block';
      turnOptionEle.textContent = `${playerIcon} move`;
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
  const getPlayer1Name = (id) => document.getElementById(id).value;
  const getPlayer2Name = (id) => document.getElementById(id).value;
  // returning icons & names via functions, so they can't be changed 
  // from outside module pattern like playerObj.getPlayer1Icon = 'Z'
  const getP1Info = {getPlayer1Name, getPlayer1Icon};
  const getP2Info = {getPlayer2Name, getPlayer2Icon};
  // return { getPlayer1Name, getPlayer2Name, getPlayer1Icon, getPlayer2Icon }
  return {getP1Info, getP2Info}
})();

// Creating gameObj modulePattern:
const gameObj = (() => {
  const result = '';

  const play = () => {
    // const p1Name = playerObj.getPlayer1Name('p1');
    const p1Name = playerObj.getP1Info.getPlayer1Name('p1');
    const p2Name = playerObj.getP2Info.getPlayer2Name('p2');
    const p1Icon = playerObj.getP1Info.getPlayer1Icon();
    const p2Icon = playerObj.getP2Info.getPlayer2Icon();
    // For a new Game, first reset board:
    boardObj.resetBoard();
    displayObj.updateBoard(boardObj.boardArr);

    // let p1_move = playerObj.getP1Move();
    // let p2_move = playerObj.getP2Move();
    let p1Move = false;
    let p2Move = false;
    let firstMove = `${p1Icon}${p2Icon}`.charAt(Math.floor(Math.random() * 2));
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
    const quitEle = document.getElementById('quit-game-p');
    quitEle.addEventListener('click', (ele) => {
      quitGame();
    });
    const replayEle = document.getElementById('replay-game-p');
    replayEle.addEventListener('click', (ele) => {
      replayGame();
    });

    const boardCellsArr = document.querySelectorAll('.board-cells');
    boardCellsArr.forEach((arrEle) => {
      arrEle.addEventListener('click', (ele) => {
        if (boardObj.boardArr.includes('')) {
          let currentMove;
          let currentPlayer;
          if (p1Move) {
            currentMove = p1Icon;
            currentPlayer = p1Name;

            p1Move = false;
            p2Move = true;
          }
          else {
            currentMove = p2Icon;
            currentPlayer = p2Name;
            p2Move = false;
            p1Move = true;
          }
        }
      });
    });

  }

  const quitGame = () => {
    console.log('Game is over');
    boardObj.resetBoard();
    displayObj.updateBoard(boardObj.boardArr);
    displayObj.updateOptions('quit-game-p');
  }
  const replayGame = () => {
    // console.log('new Game Started');
    boardObj.resetBoard();
    displayObj.updateBoard(boardObj.boardArr);
    displayObj.updateOptions('replay-game-p');
  }
  return { play, quitGame, replayGame }
})();



