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
      displayObj.updateOptions('quit-game-p', 'Names Required');
    });

    // for closing modal if clicked anywhere on screen while model is 
    // opened:
    // window.addEventListener('click', e => {
    //   if (e.target == modal) {
    //     modal.style.display = 'none';
    //     displayObj.updateOptions('quit-game-p', 'Names Required');
    //   }
    // });
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

  // submitBtnId.addEventListener('click', e => {
  //   // hide card for player names automatically:
  //   const modal = document.getElementById('myModal');
  //   modal.style.display = 'none';
  //   gameObj.start();
  // });

  const form = document.getElementById('form');
  form.addEventListener(('submit'), e => {
    // let validationStatus = gameObj.processSubmit(e);
    // if (validationStatus == true) {
    const modal = document.getElementById('myModal');
    modal.style.display = 'none';
    gameObj.start();
    // }
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
  const updateBoard = (currentMove, e) => {
    const eleArr = document.querySelectorAll('.board-cells');
    for (let i = 0; i < eleArr.length; i++) {
      if (eleArr[i].id == e.target.id) {
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
        else
          if (selectedOption == 'message-p') {
            messageEle.style.display = 'block';
            messageEle.textContent = message;
          }
  }

  // const announceResult = (winner = '', resultType) => {
  //   if (winner != '') {
  //     updateOptions('announcement-p');

  //   }
  // }
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
  let playerInfo = [p1Info, p2Info];

  let p1Move = false;
  let p2Move = false;
  // let moveAllowedStatus = { p1Move, p2Move };
  const setMovesStatus = (newP1Move, newP2Move) => {
    p1Move = newP1Move;
    p2Move = newP2Move;
  }
  const getFirstMove = () => {
    // Math.floor(Math.random() * (max - min)) + min;
    const randomNumber = (Math.random() >= 0.5) ? 1 : 0;
    return [player1Icon, player2Icon][randomNumber];
  }
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
    return { currentMove, currentPlayer, nextPlayer }
  }
  return { playerInfo, resetIconCount, getMoveAndPlayers, setMovesStatus, getFirstMove };
})();

// Creating gameObj modulePattern:
const gameObj = (() => {
  let winner = '';
  let gameStarted = false;
  // let countP1Icon = 0;
  // let countP2Icon = 0;
  const start = () => {
    gameStarted = true;
    const p1Name = playerObj.playerInfo[0].getP1Name('p1');
    const p2Name = playerObj.playerInfo[1].getP2Name('p2');
    const p1Icon = playerObj.playerInfo[0].getP1Icon();
    // const p2Icon = playerObj.p2Info.getP2Icon();
    // For a new Game, first reset board:
    boardObj.resetBoard();
    displayObj.updateBoard(boardObj.getBoard());
    let firstMove = playerObj.getFirstMove();
    if (firstMove == p1Icon) {
      playerObj.setMovesStatus(true, false);
      displayObj.updateOptions('new-game-p', `${p1Name} move`);
    }
    else {
      playerObj.setMovesStatus(false, true);
      displayObj.updateOptions('new-game-p', `${p2Name} move`);
    }
  }

  const processMove = (e) => {
    // const p1Name = playerObj.playerInfo[0].getP1Name('p1');
    // const p2Name = playerObj.p2Info.getP2Name('p2');
    // const p1Icon = playerObj.playerInfo[0].getP1Icon();
    // const p2Icon = playerObj.p2Info.getP2Icon();
    if (boardObj.getBoard().includes('') && gameStarted == true) {
      let moveMade = playerObj.getMoveAndPlayers();
      let currentMove = moveMade['currentMove'];
      let nextPlayer = moveMade['nextPlayer'];
      // if cell is preoccupied:
      if (e.target.textContent != '') {
        return
      }
      boardObj.updateBoard(currentMove, e);
      displayObj.updateBoard(boardObj.getBoard());
      processMoveResult();
      if (winner != '') {
        gameStarted = false;
        displayObj.updateOptions('quit-game-p', `${winner} won!`);
      } else
        if (winner == '' && boardObj.getBoard().includes('')) {
          displayObj.updateOptions('player-turn-p', `${nextPlayer} move`);
        } else
          if (winner == '' && !(boardObj.getBoard().includes(''))) {
            gameStarted = false;
            displayObj.updateOptions('quit-game-p', `game is draw!`);
          } else {
            quitGame();
          }
    }
    // Prevent board manipulation on not started game:
    else if (gameStarted == false) {
      displayObj.updateOptions('message-p', 'Game Not Started!');
    }
    else {
      quitGame();
    }
  }

  const processMoveResult = () => {
    // using nested loops to check the winning combinations
    //  for rows, columns & diagonal axes:

    const axesArray = [checkRows, checkColumns, checkDiagonals];
    for (const checkAxes of axesArray) {
      checkAxes();
      if (winner != '') {
        return
      }
    }

  }

  function checkRows() {
    const outerLoopObj = { 'start': 0, 'con': 6, 'inc': 3 };
    const innerLoopObj = { 'start': 0, 'con': 2, 'inc': 1 };
    loopThroughMoves(outerLoopObj, innerLoopObj, true)
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
    const outerLoopObj1 = { 'start': 0, 'con': 1, 'inc': 1 };
    const innerLoopObj1 = { 'start': 0, 'con': 8, 'inc': 4 };
    // const outerLoopObj1 = { 'start': 0, 'con': 2, 'inc': 2 };
    // const innerLoopObj1 = { 'start': 0, 'con': 8, 'inc': 4 };
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

    const outerLoopObj2 = { 'start': 0, 'con': 0, 'inc': 1 };
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

  const loopThroughMoves = (oLoop, iLoop, addToCon = false) => {
    let oStart = oLoop['start'];
    let oCon = oLoop['con'];
    let oInc = oLoop['inc'];
    let iStart = iLoop['start'];
    let iCon = iLoop['con'];
    let iInc = iLoop['inc'];
    for (let outer = oStart; outer <= oCon; outer += oInc) {
      playerObj.resetIconCount();
      // For rows, internal loop condition on every iteration needs
      // to be incremented, so:
      if (addToCon == true) {
        addToCon = outer;
      }
      for (let x = outer + iStart; x <= iCon + outer; x += iInc) {
        checkWinner(x);
      }
      if (winner != '') {
        return
      }
    }
  }
  const checkWinner = (x) => {
    const p1Name = playerObj.playerInfo[0].getP1Name('p1');
    const p2Name = playerObj.playerInfo[1].getP2Name('p2');
    const p1Icon = playerObj.playerInfo[0].getP1Icon();
    const p2Icon = playerObj.playerInfo[1].getP2Icon();
    // const boardArr = ['O', 'X', 'O', 'O', 'X', '', 'X', 'O', 'X']
    const boardArr = boardObj.getBoard();
    displayObj.updateBoard(boardArr);
    if (boardArr[x] == p1Icon) {
      playerObj.playerInfo[0].addToCountP1Icon();
      console.log(`plIcon Count: ${playerObj.playerInfo[0].getCountP1Icon()}`);
      if (playerObj.playerInfo[0].getCountP1Icon() == 3) {
        winner = p1Name;
        // return countP1Icon
      }
    }
    else
      if (boardArr[x] == p2Icon) {
        playerObj.playerInfo[1].addToCountP2Icon();
        console.log(`p2Icon Count: ${playerObj.playerInfo[1].getCountP2Icon()}`);
        if (playerObj.playerInfo[1].getCountP2Icon() == 3) {
          winner = p2Name;
          // return countP2Icon
        }
      }
    // return {winner}
  }

  const quitGame = () => {
    gameStarted = false;
    displayObj.updateBoard(boardObj.getBoard());
    winner = '';
    displayObj.updateOptions('quit-game-p', `${playerObj.getMoveAndPlayers().currentPlayer} quit...`);
  }
  const replayGame = () => {
    gameStarted = false
    boardObj.resetBoard();
    displayObj.updateBoard(boardObj.getBoard());
    winner = '';
    displayObj.updateOptions('replay-game-p', 'Enter Names');
  }
  return { start, processMove, quitGame, replayGame }
})();

// const validationObj = ({
  
    // remember that 'submit' event works only for form, not for buttons:

    // const inputs = document.querySelectorAll('.form-inputs');
    // for (let input of inputs) {
    //   input.addEventListener(('input'), e => {
    //     const ele_name = e.target.name;
    //     const ele_message = `${ele_name}-message`;
    //     this.validationObj.validateBeforeSubmit(e, ele_name, ele_message);
    //   });
    // }

    // form.addEventListener(('submit'), e => {
    //   const req_inputs = document.querySelectorAll('input.required');
    //   const req_msg_spans = document.querySelectorAll('span.required');
    //   let req_fields_status = false;
    //   let optional_fields_status = false;
    //   for (let i = 0; i < req_inputs.length; i++) {
    //     req_fields_status = this.validationObj.validateRequiredAfterSubmit(req_inputs[i], req_msg_spans[i], this.myLibrary);
    //   }
    //   const optional_inputs = document.querySelectorAll('input.optional');
    //   const optional_spans = document.querySelectorAll('span.optional');
    //   for (let i = 0; i < optional_inputs.length; i++) {
    //     optional_fields_status = this.validationObj.validateOptionalAfterSubmit(optional_inputs[i], optional_spans[i]);
    //     if (optional_fields_status == false) {
    //       break;
    //     }
    //   }
    //   if (req_fields_status == true && optional_fields_status == true) {
    //     this.#processModal(e);
    //   }
    // });
// })();



