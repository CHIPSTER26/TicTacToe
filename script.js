//defining string to be use to manipulate on HTML
const playerRyu = 'ryu'
const playerChunli = 'chunli'
//formula of winning using array
const winningCombinations = [
  [0, 1, 2, 3],
  [4, 5, 6, 7],
  [8, 9, 10, 11],
  [12, 13, 14, 15],
  [0, 4, 8, 12],
  [1, 5, 9, 13],
  [2, 6, 10, 14],
  [3, 7, 11, 15],
  [0, 5, 10, 15],
  [3, 6, 9, 12]
]
//define all data cell that will be manipulate with DOM
const cellElements = document.querySelectorAll('[data-cell]')

const board = document.getElementById('board')
const winningMessageElement = document.getElementById('winningMessage')
const restartButton = document.getElementById('restartButton')
const winningMessageTextElement = document.querySelector('[data-winning-message-text]')
const chunliSoundKick = document.querySelector('#chunli-kick')
const ryuSoundKick = document.querySelector('#ryu-kick')
const fightSound = document.querySelector('#start-game')
const chunliWinSound = document.querySelector('#chunli-laugh')
const ryuWinSound = document.querySelector('#you-win')
const drawGameSound = document.querySelector('#draw-game')
const kickSound = document.querySelector("#kick-sound")
const winningSound = document.querySelector('#winning-sound')
const audioControl = document.getElementById('audio-control')


//setting start volume at 10% when played
audioControl.volume = 0.1;
//start the game with whose's turn going to be at starting point, so if chunli turn true, it will start with chunli
let chunliTurn

startGame();

restartButton.addEventListener('click', reStartGame);

//
function startGame() {
  chunliTurn = false
  cellElements.forEach(cell => {
    //empty all cells because we are starting the game
    cell.classList.remove(playerRyu)
    cell.classList.remove(playerChunli)
    cell.removeEventListener('click', handleClick)
    //only clicked once into same cell
    cell.addEventListener('click', handleClick, { once: true })
  })
  setBoardHoverClass()
  //removing winning slide 
  winningMessageElement.classList.remove('show')
}
//looping this one after re-start button has been clicked
function reStartGame() {
  chunliTurn = false
  cellElements.forEach(cell => {
    cell.classList.remove(playerRyu)
    cell.classList.remove(playerChunli)
    cell.removeEventListener('click', handleClick)
    cell.addEventListener('click', handleClick, { once: true })
  })
  setBoardHoverClass()
  playStartGameSound()
  winningMessageElement.classList.remove('show')
}

function playStartGameSound() {
  fightSound.play();
}
//using event target for selecting the cell being manipulate in html by DOM
function handleClick(e) {
  //cell is the target being clicked
  const cell = e.target
  //define if its chunli turn is true then put chunli string into board class chunli or otherwise do ryu's
  const currentPlayer = chunliTurn ? playerChunli : playerRyu

  placeMark(cell, currentPlayer)
  if (checkWin(currentPlayer)) {
    endGame(false)
  } else if (isDraw()) {
    endGame(true)
  } else {
    //Swich turns after clicks/handle click has been run
    switchTurns()
    //set hover class has to be after witch turn to determine which player is going to be be display
    setBoardHoverClass()
  }
}
//function to place mark then put it inside handle click function to make it run
function placeMark(cell, currentPlayer) {
  //place string into cell class using classList.add 
  cell.classList.add(currentPlayer)

  playPlacemarkSound(currentPlayer)
}

//function for switch turn between players
function switchTurns() {
  chunliTurn = !chunliTurn
}

//function when playermark hover
function setBoardHoverClass() {
  board.classList.remove(playerRyu)
  board.classList.remove(playerChunli)
  if (chunliTurn) {
    board.classList.add(playerChunli)
  } else {
    board.classList.add(playerRyu)
  }
}

function endGame(draw) {
  if (draw) {
    winningMessageTextElement.innerText = 'Draw!'
    setTimeout("drawGameSound.play()", 1500);
  } else {
    winningMessageTextElement.innerText = `${chunliTurn ? "Chunli's" : "Ryu's"} Wins!`

    setTimeout("winningSound.play()", 2000);
    setTimeout("playPlayerWinSound()", 5000);
  }
  winningMessageElement.classList.add('show');
}

function isDraw() {
  ///destructuring array methods to check if all cells has been filled
  return [...cellElements].every(cell => {
    return cell.classList.contains(playerRyu) || cell.classList.contains(playerChunli)
  })
}




function playPlacemarkSound() {
  if (chunliTurn) {
    chunliSoundKick.play();
    setTimeout("kickSound.play()", 1500);

  } else {
    ryuSoundKick.play();
    setTimeout("kickSound.play()", 1500);


  }
}




function playPlayerWinSound() {
  if (winningMessageTextElement.innerText === "Chunli's Wins!") {
    chunliWinSound.play();
  } else {
    ryuWinSound.play();
  }
}



//this is the calculation formula for deciding the array that has been formulated above
function checkWin(currentPlayer) {
  //check all array in winning combination and only need one of them true hence using .SOME
  return winningCombinations.some(combination => {
    //check all array combination formula using .EVERY on every index array 
    return combination.every(index => {
      //check all element inside 16 cells using array and must contain all same player mark (currentPlayer)
      return cellElements[index].classList.contains(currentPlayer)
    })
  })
}