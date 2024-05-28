
  const listeners = (() => {
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

    return {newGameId, quitGameID, replayGameId, playerTurnId, submitBtnId}
  })();

  const displayController = (() => {

  });

  // gameObj is implicitly called...
  const gameObj = (() => {
    // creating display object:
    const displayObj = displayController();

    let boardObj = (() => {
      // creating a new border of 3x3:
      let boardArr = [];
      for(let i=0; i <= 8; i++) {
        boardArr.push('');
      }
      // reset board function
      const resetBoard = () => {
        boardArr.forEach(ele => {
          boardArr[ele] = '';
        });
      }
      return {boardArr, resetBoard}
      })();
    

    const play = () => {
      // For a new Game, first reset board:
      boardObj.resetBoard();
      dis
      console.log(boardObj);
      const player1 = playerObj.getPlayer1Name('p1');
      const player2 = playerObj.getPlayer2Name('p2');

    }
    const quitGame = () => {
      console.log('Game is over');
    }
    const replayGame = () => {
      console.log('new Game Started');
    } 
      return {play, quitGame, replayGame}
    })();  

    const playerObj = (() => {
      const getPlayer1Name = (id) => document.getElementById(id).value ;
      const getPlayer2Name = (id) => document.getElementById(id).value ;
      return {getPlayer1Name, getPlayer2Name}
    })();

