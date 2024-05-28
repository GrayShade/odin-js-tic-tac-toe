
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
  const updateBoardDisplay = (boardArr) => {
    const gboardNodeList = document.querySelectorAll('.gboard-cell');
    for (let i = 0; i < gboardNodeList.length; i++) {
      gboardNodeList[i].textContent = boardArr[i];
      console.log(gboardNodeList[i].textContent);
    }
  }
  return { updateBoardDisplay }
})();

// Creating playerObj modulePattern:
const playerObj = (() => {
  const getPlayer1Name = (id) => document.getElementById(id).value;
  const getPlayer2Name = (id) => document.getElementById(id).value;
  return { getPlayer1Name, getPlayer2Name }
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
    // For a new Game, first reset board:
    boardObj.resetBoard();
    displayObj.updateBoardDisplay(boardObj.boardArr);
    // console.log(boardObj);
    const player1 = playerObj.getPlayer1Name('p1');
    const player2 = playerObj.getPlayer2Name('p2');

  }
  const quitGame = () => {
    console.log('Game is over');
  }
  const replayGame = () => {
    console.log('new Game Started');
  }
  return { play, quitGame, replayGame }
});



