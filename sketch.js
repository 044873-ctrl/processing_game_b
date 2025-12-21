let cols = 20;
let rows = 20;
let cellSize = 20;
let snake = [];
let dirX = 1;
let dirY = 0;
let framesPerMove = 10;
let moveCounter = 0;
let food = null;
let score = 0;
let gameOver = false;
let dirLocked = false;
function randomInt(min, max) {
  return Math.floor(random(min, max + 1));
}
function placeFood() {
  if (snake.length >= cols * rows) {
    food = null;
    return;
  }
  let attempts = 0;
  while (true) {
    let fx = randomInt(0, cols - 1);
    let fy = randomInt(0, rows - 1);
    let collision = false;
    for (let i = 0; i < snake.length; i++) {
      if (snake[i].x === fx && snake[i].y === fy) {
        collision = true;
        break;
      }
    }
    if (!collision) {
      food = { x: fx, y: fy };
      return;
    }
    attempts++;
    if (attempts > 1000) {
      food = null;
      return;
    }
  }
}
function restartGame() {
  let centerX = Math.floor(cols / 2);
  let centerY = Math.floor(rows / 2);
  snake = [];
  snake.push({ x: centerX + 1, y: centerY });
  snake.push({ x: centerX, y: centerY });
  snake.push({ x: centerX - 1, y: centerY });
  dirX = 1;
  dirY = 0;
  moveCounter = 0;
  score = 0;
  gameOver = false;
  dirLocked = false;
  placeFood();
}
function setup() {
  createCanvas(400, 400);
  restartGame();
  textSize(16);
  textAlign(LEFT, TOP);
}
function draw() {
  background(220);
  fill(0);
  text("Score: " + score, 5, 5);
  if (food !== null) {
    fill(200, 0, 0);
    rect(food.x * cellSize, food.y * cellSize, cellSize, cellSize);
  }
  fill(34, 139, 34);
  for (let i = 0; i < snake.length; i++) {
    rect(snake[i].x * cellSize, snake[i].y * cellSize, cellSize, cellSize);
  }
  if (!gameOver) {
    moveCounter++;
    if (moveCounter >= framesPerMove) {
      moveCounter = 0;
      let head = snake[0];
      let newX = head.x + dirX;
      let newY = head.y + dirY;
      if (newX < 0 || newX >= cols || newY < 0 || newY >= rows) {
        gameOver = true;
      } else {
        let isEating = false;
        if (food !== null && newX === food.x && newY === food.y) {
          isEating = true;
        }
        let collided = false;
        for (let i = 0; i < snake.length; i++) {
          if (snake[i].x === newX && snake[i].y === newY) {
            if (isEating || i < snake.length - 1) {
              collided = true;
              break;
            }
          }
        }
        if (collided) {
          gameOver = true;
        } else {
          snake.unshift({ x: newX, y: newY });
          if (isEating) {
            score++;
            placeFood();
          } else {
            snake.pop();
          }
        }
      }
      dirLocked = false;
    }
  } else {
    fill(0);
    textAlign(CENTER, CENTER);
    textSize(32);
    text("Game Over", width / 2, height / 2 - 10);
    textSize(16);
    text("Press R to Restart", width / 2, height / 2 + 24);
    textAlign(LEFT, TOP);
    textSize(16);
  }
}
function keyPressed() {
  if (keyCode === UP_ARROW) {
    if (!dirLocked && !(dirX === 0 && dirY === 1)) {
      dirX = 0;
      dirY = -1;
      dirLocked = true;
    }
  } else if (keyCode === DOWN_ARROW) {
    if (!dirLocked && !(dirX === 0 && dirY === -1)) {
      dirX = 0;
      dirY = 1;
      dirLocked = true;
    }
  } else if (keyCode === LEFT_ARROW) {
    if (!dirLocked && !(dirX === 1 && dirY === 0)) {
      dirX = -1;
      dirY = 0;
      dirLocked = true;
    }
  } else if (keyCode === RIGHT_ARROW) {
    if (!dirLocked && !(dirX === -1 && dirY === 0)) {
      dirX = 1;
      dirY = 0;
      dirLocked = true;
    }
  } else if ((key === 'r' || key === 'R') && gameOver) {
    restartGame();
  }
}
