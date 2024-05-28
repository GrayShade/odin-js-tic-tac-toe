
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
      console.log(boardNodeList[i].textContent);
    }
  }
  const updateOptions = (showOption) => {
    const newOptionEle = document.getElementById('new-game-p');
    const quitOptionEle = document.getElementById('quit-game-p');
    const replayOptionEle = document.getElementById('replay-game-p');
    const turnOptionEle = document.getElementById('player-turn-p');
    const optionsArray = [newOptionEle, quitOptionEle, replayOptionEle, turnOptionEle]
    // if(showOption == showOption) {
      for (const option of optionsArray) {
        if(option != showOption) {
          // option.style.display = 'none'
        }
    }
  } 
  return { updateBoard, updateOptions }
})();

// Creating playerObj modulePattern:
const playerObj = (() => {
  const player1_icon = 'X';
  const player2_icon = 'O';
  const getPlayer1Icon = () => player1_icon;
  const getPlayer2Icon = () => player2_icon;
  const getPlayer1Name = (id) => document.getElementById(id).value;
  const getPlayer2Name = (id) => document.getElementById(id).value;
  // returning icons & names via functions, so they can't be changed 
  // from outside module pattern like playerObj.getPlayer1Icon = 'Z'
  return { getPlayer1Name, getPlayer2Name, getPlayer1Icon, getPlayer2Icon }
})();

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


// Creating gameObj modulePattern:
const gameObj = (() => {

  const play = () => {
    const p1Name = playerObj.getPlayer1Name('p1');
    const p2Name = playerObj.getPlayer2Name('p2');
    const p1Icon = playerObj.getPlayer1Icon();
    const p2Icon = playerObj.getPlayer2Icon();
    // For a new Game, first reset board:
    // boardObj.resetBoard();
    // displayObj.updateBoard(boardObj.boardArr);
    // displayObj.updateOptions('new-game-p');
  }
  const quitGame = () => {
    console.log('Game is over');
  }
  const replayGame = () => {
    console.log('new Game Started');
  }
  return { play, quitGame, replayGame }
})();



