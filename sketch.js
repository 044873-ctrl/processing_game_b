const cols = 20;
const rows = 20;
const cellSize = 20;
let snake = [];
let dir = {x: 1, y: 0};
let nextDir = {x: 1, y: 0};
let foods = [];
let score = 0;
let tick = 0;
const moveInterval = 10;
let gameOver = false;
function setup() {
  createCanvas(cols * cellSize, rows * cellSize);
  const centerX = Math.floor(cols / 2);
  const centerY = Math.floor(rows / 2);
  for (let i = 0; i < 3; i++) {
    snake.push({x: centerX - i, y: centerY});
  }
  generateFoods();
  textSize(16);
  textAlign(LEFT, TOP);
}
function draw() {
  background(220);
  fill(0);
  text("Score: " + score, 6, 6);
  drawFoods();
  drawSnake();
  if (!gameOver) {
    tick++;
    if (tick >= moveInterval) {
      tick = 0;
      dir = {x: nextDir.x, y: nextDir.y};
      const head = snake[0];
      const newHead = {x: head.x + dir.x, y: head.y + dir.y};
      if (newHead.x < 0 || newHead.x >= cols || newHead.y < 0 || newHead.y >= rows) {
        gameOver = true;
        return;
      }
      const foodIndex = indexOfFoodAt(newHead.x, newHead.y);
      const willGrow = foodIndex !== -1;
      if (!willGrow) {
        for (let i = 0; i < snake.length - 1; i++) {
          if (snake[i].x === newHead.x && snake[i].y === newHead.y) {
            gameOver = true;
            return;
          }
        }
      } else {
        for (let i = 0; i < snake.length; i++) {
          if (snake[i].x === newHead.x && snake[i].y === newHead.y) {
            gameOver = true;
            return;
          }
        }
      }
      snake.unshift(newHead);
      if (willGrow) {
        foods.splice(foodIndex, 1);
        score++;
        generateFoods();
      } else {
        snake.pop();
      }
    }
  } else {
    fill(0);
    textAlign(CENTER, CENTER);
    textSize(32);
    text("Game Over", width / 2, height / 2);
    textSize(16);
    textAlign(LEFT, TOP);
  }
}
function drawSnake() {
  noStroke();
  for (let i = 0; i < snake.length; i++) {
    const part = snake[i];
    if (i === 0) {
      fill(0, 150, 0);
    } else {
      fill(0, 200, 0);
    }
    rect(part.x * cellSize, part.y * cellSize, cellSize, cellSize);
  }
}
function drawFoods() {
  noStroke();
  fill(200, 0, 0);
  for (let i = 0; i < foods.length; i++) {
    const f = foods[i];
    rect(f.x * cellSize + 4, f.y * cellSize + 4, cellSize - 8, cellSize - 8);
  }
}
function generateFoods() {
  while (foods.length < 100) {
    const rx = Math.floor(random(cols));
    const ry = Math.floor(random(rows));
    if (isOnSnake(rx, ry)) {
      continue;
    }
    if (indexOfFoodAt(rx, ry) !== -1) {
      continue;
    }
    foods.push({x: rx, y: ry});
  }
}
function isOnSnake(x, y) {
  for (let i = 0; i < snake.length; i++) {
    const s = snake[i];
    if (s.x === x && s.y === y) {
      return true;
    }
  }
  return false;
}
function indexOfFoodAt(x, y) {
  for (let i = 0; i < foods.length; i++) {
    if (foods[i].x === x && foods[i].y === y) {
      return i;
    }
  }
  return -1;
}
function keyPressed() {
  if (gameOver) {
    return;
  }
  if (keyCode === UP_ARROW) {
    if (!(dir.x === 0 && dir.y === 1)) {
      nextDir = {x: 0, y: -1};
    }
  } else if (keyCode === DOWN_ARROW) {
    if (!(dir.x === 0 && dir.y === -1)) {
      nextDir = {x: 0, y: 1};
    }
  } else if (keyCode === LEFT_ARROW) {
    if (!(dir.x === 1 && dir.y === 0)) {
      nextDir = {x: -1, y: 0};
    }
  } else if (keyCode === RIGHT_ARROW) {
    if (!(dir.x === -1 && dir.y === 0)) {
      nextDir = {x: 1, y: 0};
    }
  }
}
