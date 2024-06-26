// ..................Setting up listeners via modulePattern........................
const listenersSetUp = (() => {
  const newGameId = document.getElementById('new-game-p');
  const quitGameID = document.getElementById('quit-game-p');
  const replayGameId = document.getElementById('replay-game-p');
  const submitBtnId = document.getElementById('form-button');
  const reqInputs = document.querySelectorAll('input');

  const modal = document.getElementById('myModal');
  const span = document.getElementsByClassName("close")[0];

  const popup = document.querySelector('.popup');
  const myPopup = document.getElementById("myPopup");

  const setModel = (() => {
    newGameId.addEventListener('click', () => {
      modal.style.display = 'block';
    });

    span.addEventListener('click', e => {
      modal.style.display = 'none';
      displayObj.updateOptions('quit-game-p', 'Names Required');
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

  submitBtnId.addEventListener(('click'), e => {
    // remember that 'submit' event works only for form, not for buttons.

    let reqFieldsStatus = false;
    reqFieldsStatus = gameObj.validated(e);

    if (reqFieldsStatus == true) {
      const modal = document.getElementById('myModal');
      modal.style.display = 'none';
      gameObj.start();
    }
  });

  for (let i = 0; i < reqInputs.length; i++) {
    const input = reqInputs[i];
    input.addEventListener('keyup', (e) => {
      gameObj.validated(e);
    });
  }

  quitGameID.addEventListener('click', () => {
    gameObj.quitGame();
  });
  replayGameId.addEventListener('click', () => {
    gameObj.replayGame();
  });

  popup.addEventListener('click', () => {
    myPopup.classList.toggle("show");
  });

  window.addEventListener('click', e => {
    // Toggle to hide popup if it is currently showing. 2nd condition prevents
    // closing of popup when it is opened by clicking on image credit link:
    if (myPopup.classList.contains('show') && e.target.id != 'anchorLinkId') {
      myPopup.classList.toggle("show");
    }
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
      if (boardArr[i] == 'X') {
        boardNodeList[i].style.color = '#ff8c00';
      }
      else {
        boardNodeList[i].removeAttribute("style");
      }
    }
  }
  const updateOptions = (selectedOption = '', message = '', playerIcon) => {
    const newOptionEle = document.getElementById('new-game-p');
    const quitOptionEle = document.getElementById('quit-game-p');
    const replayOptionEle = document.getElementById('replay-game-p');
    const turnOptionEle = document.getElementById('player-turn-p');
    const messageEle = document.getElementById('message-p');
    messageEle.style.color = '#ebebeb';
    if (selectedOption == 'new-game-p' || selectedOption == 'player-turn-p') {
      newOptionEle.style.display = 'none';
      messageEle.style.display = 'block';
      messageEle.textContent = message;
      if (playerIcon == 'X') {
        messageEle.style.color = '#ff8c00';
      }
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
  const setMovesStatus = (newP1Move, newP2Move) => {
    p1Move = newP1Move;
    p2Move = newP2Move;
  }
  const getFirstMove = () => {
    const randomNumber = (Math.random() >= 0.5) ? 1 : 0;
    return [player1Icon, player2Icon][randomNumber];
  }
  const getMoveAndPlayers = () => {
    let currentMove;
    let currentPlayer;
    let nextPlayer;
    let currentPlayerIcon;
    let nextPlayerIcon;
    if (p1Move) {
      currentMove = player1Icon;
      currentPlayer = getP1Name();
      nextPlayer = getP2Name();
      currentPlayerIcon = getP1Icon();
      nextPlayerIcon = getP2Icon();
      p1Move = false;
      p2Move = true;
    }
    else {
      currentMove = player2Icon;
      currentPlayer = getP2Name();
      nextPlayer = getP1Name();
      currentPlayerIcon = getP2Icon();
      nextPlayerIcon = getP1Icon();
      p2Move = false;
      p1Move = true;
    }
    return { currentMove, currentPlayer, nextPlayer, currentPlayerIcon, nextPlayerIcon }
  }
  return { playerInfo, resetIconCount, getMoveAndPlayers, setMovesStatus, getFirstMove };
})();

// Creating gameObj modulePattern:
const gameObj = (() => {
  let winner = '';
  let gameStarted = false;

  const validated = (e) => {
    const inputs = document.querySelectorAll('input');
    return validationObj.validate(e, inputs);
  }
  const start = () => {
    gameStarted = true;
    const p1Name = playerObj.playerInfo[0].getP1Name('p1');
    const p2Name = playerObj.playerInfo[1].getP2Name('p2');
    const p1Icon = playerObj.playerInfo[0].getP1Icon();
    const p2Icon = playerObj.playerInfo[1].getP2Icon();
    // For a new Game, first reset board:
    boardObj.resetBoard();
    displayObj.updateBoard(boardObj.getBoard());
    let firstMove = playerObj.getFirstMove();
    if (firstMove == p1Icon) {
      playerObj.setMovesStatus(true, false);
      displayObj.updateOptions('new-game-p', `${p1Name} move`, p1Icon);
    }
    else {
      playerObj.setMovesStatus(false, true);
      displayObj.updateOptions('new-game-p', `${p2Name} move`, p2Icon);
    }
  }

  const processMove = (e) => {
    if (boardObj.getBoard().includes('') && gameStarted == true) {
      let moveMade = playerObj.getMoveAndPlayers();
      let currentMove = moveMade['currentMove'];
      let nextPlayer = moveMade['nextPlayer'];
      let nextPlayerIcon = moveMade['nextPlayerIcon'];
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
          displayObj.updateOptions('player-turn-p', `${nextPlayer} move`, nextPlayerIcon);
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

  }
  function checkColumns() {
    const outerLoopObj = { 'start': 0, 'con': 2, 'inc': 1 };
    const innerLoopObj = { 'start': 0, 'con': 6, 'inc': 3 };
    loopThroughMoves(outerLoopObj, innerLoopObj);

  };
  function checkDiagonals() {
    const outerLoopObj1 = { 'start': 0, 'con': 1, 'inc': 1 };
    const innerLoopObj1 = { 'start': 0, 'con': 8, 'inc': 4 };
    loopThroughMoves(outerLoopObj1, innerLoopObj1);

    const outerLoopObj2 = { 'start': 0, 'con': 0, 'inc': 1 };
    const innerLoopObj2 = { 'start': 2, 'con': 6, 'inc': 2 };
    loopThroughMoves(outerLoopObj2, innerLoopObj2);
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
    const boardArr = boardObj.getBoard();
    if (boardArr[x] == p1Icon) {
      playerObj.playerInfo[0].addToCountP1Icon();
      if (playerObj.playerInfo[0].getCountP1Icon() == 3) {
        winner = p1Name;
      }
    }
    else
      if (boardArr[x] == p2Icon) {
        playerObj.playerInfo[1].addToCountP2Icon();
        if (playerObj.playerInfo[1].getCountP2Icon() == 3) {
          winner = p2Name;
        }
      }
  }

  const quitGame = () => {
    gameStarted = false;
    displayObj.updateBoard(boardObj.getBoard());
    winner = '';
    displayObj.updateOptions('quit-game-p', `${playerObj.getMoveAndPlayers().currentPlayer} retreated`);
  }
  const replayGame = () => {
    gameStarted = false
    boardObj.resetBoard();
    displayObj.updateBoard(boardObj.getBoard());
    winner = '';
    displayObj.updateOptions('replay-game-p', 'Enter Names');
  }

  return { validated, start, processMove, quitGame, replayGame }
})();

// Creating validation module pattern:
const validationObj = (() => {
  const validate = (e, inputs) => {
    let valuesArr = removeAllInputsSpaces(inputs);
    if (e.target.id == 'form-button') {
      return validateAfterSubmit(inputs, valuesArr);
    }
    else {
      valKeyUpBefSubmit(e, inputs, valuesArr);
    }
  }
  const valKeyUpBefSubmit = (e, inputsArr, valuesArr) => {
    if (e.key === 'Tab') {
      return;
    }
    const input = e.target;
    
    // if form was submitted before, then setCustomValidity has some
    // value already which will cause error message to be shown again 
    // & again even or correct input. So,:
    input.setCustomValidity("");
    const validityState = input.validity;

    if (validityState.valid == true) {
      input.setCustomValidity("");
      input.style.borderColor = '#E5E7EB'
      input.reportValidity();
    }
    else {
      input.style.borderColor = 'red';
      input.setCustomValidity("Only single word, no space, 1 to 12 letters allowed!");
      input.reportValidity();
    }

    processNamesPair(inputsArr, valuesArr, input);

  }

  const validateAfterSubmit = (inputsArr, valuesArr) => {

    const validityArr = [];
    for (let i = 0; i < inputsArr.length; i++) {
      const input = inputsArr[i];
      const validityState = input.validity;

      if (validityState.valueMissing) {
        input.setCustomValidity("Input can't be empty!");
      } else if (validityState.rangeUnderflow) {
        input.setCustomValidity("Letters can't be less than 1!");
      } else if (validityState.rangeOverflow) {
        input.setCustomValidity("Letters can't be more than 12!");
      } else if (validityState.patternMismatch) {
        input.setCustomValidity("Only single word, no space, 1 to 12 letters allowed!");
      } else if (areSameInputs(valuesArr) === true && !valuesArr.includes('')) {
        input.setCustomValidity("Names can't be same!");
      }
      // this default else is a must as if there is no error, don't show one:
      else {
        input.setCustomValidity("");
      }

      validityArr.push(input.reportValidity());
    }
    if (validityArr.includes(false)) {
      return false;
    }
    return true;
  }

  function removeAllInputsSpaces(inputsArr) {
    let newInputArr = [];
    for (let i = 0; i < inputsArr.length; i++) {
      let singleInputArr = inputsArr[i].value.split('');
      let noSpaceArr = singleInputArr.filter(char => {
        return char != ' ';
      });
      const input = document.getElementById(`p${i + 1}`);
      input.value = noSpaceArr.join('');
      newInputArr.push(noSpaceArr.join(''));
    }
    return newInputArr;
  }

  function areSameInputs(valuesArr) {
    return valuesArr.every((val, i, valuesArr) => val == valuesArr[0]);
  }


  function processNamesPair(inputsArr, valuesArr, input) {
    if (areSameInputs(valuesArr) && !valuesArr.includes('')) {
      for (let i = 0; i < inputsArr.length; i++) {
        inputsArr[i].style.borderColor = 'red';
      }
      input.setCustomValidity("Names can't be same!");
      input.reportValidity();
    }
    else {
      // if names are not same now, checking whole pair regardless of input
      // & processing: 
      for (let i = 0; i < inputsArr.length; i++) {
        inputsArr[i].setCustomValidity("");
        // if any of fields is valid, change its border. It'll help when names
        // are not same now & there is no other error:
        if (inputsArr[i].validity.valid) {
          inputsArr[i].style.borderColor = '#E5E7EB';
        }
        else {
          // As we have set validity to empty, again applying it after checking if it was
          // required & error is not due to any empty field:
          if (inputsArr[i].value != '') {
            inputsArr[i].style.borderColor = 'red';
            input.setCustomValidity("Only single word, no space, 1 to 12 letters allowed!");
          }
        }
      }
    }
  }
  return { validate, validateAfterSubmit, valKeyUpBefSubmit }
})();



