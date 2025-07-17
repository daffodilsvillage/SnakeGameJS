const gameBoard = document.querySelector("#gameBoard");
const ctx = gameBoard.getContext("2d");
const scoreText = document.querySelector("#score");
const startBtn = document.querySelector("#startBtn");
const gameWidth = gameBoard.width;
const gameHeight = gameBoard.height;
const boardBackground = " rgb(41, 41, 41)";
const snakeColor = "rgb(185, 185, 0)";
const foodColor = "green";
const unitSize = 25;

let running = false;
let xVelocity = unitSize;
let yVelocity = 0;
let foodX;
let foodY;
let score = 0;
function getInitialSnake() {
  return [
    { x: unitSize * 4, y: unitSize * 5 },
    { x: unitSize * 3, y: unitSize * 5 },
    { x: unitSize * 2, y: unitSize * 5 },
    { x: unitSize, y: unitSize * 5 },
    { x: 0, y: unitSize * 5 },
    { x: 0, y: unitSize * 5 },
  ];
}
let snake = getInitialSnake();

window.addEventListener("keydown", changeDirection);
startBtn.addEventListener("click", restartGame);

function initializeBoard() {
  clearBoard();
  createFood();
  drawFood();
  drawSnake();
}

initializeBoard();

startBtn.addEventListener("click", () => {
  if (running) return;
  gameStart(); // Start movement
});

function gameStart() {
  if (running) return;
  running = true;
  scoreText.textContent = score;
  startBtn.innerText = "Pause";
  nextTick();
}

function nextTick() {
  if (running) {
    setTimeout(() => {
      clearBoard();
      drawFood();
      moveSnake();
      drawSnake();
      checkGameOver();
      nextTick();
    }, 130);
  } else {
    displayGameOver();
    startBtn.innerText = "Start";
  }
}

function clearBoard() {
  ctx.fillStyle = boardBackground;
  ctx.fillRect(0, 0, gameWidth, gameHeight);
}
function createFood() {
  function randomFood(min, max) {
    return (
      Math.round((Math.random() * (max - min) + min) / unitSize) * unitSize
    );
  }
  foodX = randomFood(0, gameWidth - unitSize);
  foodY = randomFood(0, gameHeight - unitSize);
}

function drawFood() {
  ctx.fillStyle = foodColor;
  ctx.fillRect(foodX, foodY, unitSize, unitSize);
}
function moveSnake() {
  const head = {
    x: snake[0].x + xVelocity,
    y: snake[0].y + yVelocity,
  };
  snake.unshift(head);
  // if food is eaten
  if (snake[0].x === foodX && snake[0].y === foodY) {
    score += 1;
    scoreText.textContent = score;
    createFood();
  } else {
    snake.pop();
  }
}
function drawSnake() {
  ctx.fillStyle = snakeColor;
  snake.forEach((snakePart) => {
    ctx.fillRect(snakePart.x, snakePart.y, unitSize, unitSize);
  });
}
function changeDirection(event) {
  if (!running) return;
  const keyPressed = event.key;
  const LEFT = "ArrowLeft";
  const RIGHT = "ArrowRight";
  const UP = "ArrowUp";
  const DOWN = "ArrowDown";

  if (!running && [LEFT, RIGHT, UP, DOWN].includes(keyPressed)) {
    gameStart();
  }
  if (!running) return;

  const goingUp = yVelocity === -unitSize;
  const goingDown = yVelocity === unitSize;
  const goingRight = xVelocity === unitSize;
  const goingLeft = xVelocity === -unitSize;

  switch (true) {
    case keyPressed === LEFT && !goingRight:
      xVelocity = -unitSize;
      yVelocity = 0;
      break;
    case keyPressed === RIGHT && !goingLeft:
      xVelocity = unitSize;
      yVelocity = 0;
      break;
    case keyPressed === UP && !goingDown:
      xVelocity = 0;
      yVelocity = -unitSize;
      break;
    case keyPressed === DOWN && !goingUp:
      xVelocity = 0;
      yVelocity = unitSize;
      break;
  }
}

function checkGameOver() {
  switch (true) {
    case snake[0].x < 0:
      running = false;
      break;
    case snake[0].x >= gameWidth:
      running = false;
      break;
    case snake[0].y < 0:
      running = false;
      break;
    case snake[0].y >= gameHeight:
      running = false;
      break;
  }
  for (let i = 1; i < snake.length; i++) {
    if (snake[i].x == snake[0].x && snake[i].y == snake[0].y) {
      running = false;
    }
  }
}
function displayGameOver() {
  ctx.font = "20px Arial";
  ctx.fillStyle = "grey";
  ctx.textAlign = "center";
  ctx.fillText("game over. 🥬", gameWidth / 2, gameHeight / 2);
  running = false;
}
function restartGame() {
  if (running) return;
  score = 0;
  snake = getInitialSnake();
  xVelocity = unitSize;
  yVelocity = 0;
  startBtn.innerText = "Pause";
  gameStart();
}
