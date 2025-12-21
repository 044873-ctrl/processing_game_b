const COLS = 10;
const ROWS = 20;
const CELL = 30;
let board = [];
let shapes = [];
let colors = [];
let current = null;
let dropCounter = 0;
let dropInterval = 120;
let baseDropInterval = 120;
let fastDropInterval = 3;
let score = 0;
let gameOver = false;
function createEmptyBoard() {
  let b = [];
  for (let y = 0; y < ROWS; y++) {
    let row = [];
    for (let x = 0; x < COLS; x++) {
      row.push(0);
    }
    b.push(row);
  }
  return b;
}
function deepCopyMatrix(m) {
  let nm = [];
  for (let y = 0; y < 4; y++) {
    let row = [];
    for (let x = 0; x < 4; x++) {
      row.push(m[y][x]);
    }
    nm.push(row);
  }
  return nm;
}
function rotateMatrix(m) {
  let nm = [];
  for (let y = 0; y < 4; y++) {
    let row = [];
    for (let x = 0; x < 4; x++) {
      row.push(0);
    }
    nm.push(row);
  }
  for (let y = 0; y < 4; y++) {
    for (let x = 0; x < 4; x++) {
      nm[y][x] = m[4 - 1 - x][y];
    }
  }
  return nm;
}
function collides(px, py, shape) {
  for (let y = 0; y < 4; y++) {
    for (let x = 0; x < 4; x++) {
      let val = shape[y][x];
      if (val !== 0) {
        let bx = px + x;
        let by = py + y;
        if (bx < 0 || bx >= COLS || by >= ROWS) {
          return true;
        }
        if (by >= 0) {
          if (board[by][bx] !== 0) {
            return true;
          }
        }
      }
    }
  }
  return false;
}
function lockPiece() {
  for (let y = 0; y < 4; y++) {
    for (let x = 0; x < 4; x++) {
      let val = current.shape[y][x];
      if (val !== 0) {
        let bx = current.x + x;
        let by = current.y + y;
        if (by >= 0 && by < ROWS && bx >= 0 && bx < COLS) {
          board[by][bx] = val;
        }
      }
    }
  }
  let lines = clearLines();
  if (lines > 0) {
    score += lines * 100;
  }
  spawnPiece();
}
function clearLines() {
  let linesCleared = 0;
  for (let y = ROWS - 1; y >= 0; y--) {
    let full = true;
    for (let x = 0; x < COLS; x++) {
      if (board[y][x] === 0) {
        full = false;
        break;
      }
    }
    if (full) {
      board.splice(y, 1);
      let newRow = [];
      for (let i = 0; i < COLS; i++) {
        newRow.push(0);
      }
      board.unshift(newRow);
      linesCleared++;
      y++;
    }
  }
  return linesCleared;
}
function spawnPiece() {
  let idx = Math.floor(Math.random() * shapes.length);
  let shape = deepCopyMatrix(shapes[idx]);
  let px = Math.floor(COLS / 2) - 2;
  let py = 0;
  current = { x: px, y: py, shape: shape, id: idx + 1 };
  if (collides(current.x, current.y, current.shape)) {
    gameOver = true;
  }
}
function drawBoard() {
  for (let y = 0; y < ROWS; y++) {
    for (let x = 0; x < COLS; x++) {
      let val = board[y][x];
      stroke(50);
      if (val === 0) {
        fill(20);
      } else {
        fill(colors[val]);
      }
      rect(x * CELL, y * CELL, CELL, CELL);
    }
  }
}
function drawPiece() {
  if (current === null) {
    return;
  }
  for (let y = 0; y < 4; y++) {
    for (let x = 0; x < 4; x++) {
      let val = current.shape[y][x];
      if (val !== 0) {
        let bx = current.x + x;
        let by = current.y + y;
        if (by >= 0) {
          fill(colors[val]);
          stroke(200);
          rect(bx * CELL, by * CELL, CELL, CELL);
        }
      }
    }
  }
}
shapes = [
  [
    [0,0,0,0],
    [1,1,1,1],
    [0,0,0,0],
    [0,0,0,0]
  ],
  [
    [0,2,2,0],
    [0,2,2,0],
    [0,0,0,0],
    [0,0,0,0]
  ],
  [
    [0,3,0,0],
    [3,3,3,0],
    [0,0,0,0],
    [0,0,0,0]
  ],
  [
    [0,0,4,0],
    [4,4,4,0],
    [0,0,0,0],
    [0,0,0,0]
  ],
  [
    [5,0,0,0],
    [5,5,5,0],
    [0,0,0,0],
    [0,0,0,0]
  ],
  [
    [0,6,6,0],
    [6,6,0,0],
    [0,0,0,0],
    [0,0,0,0]
  ],
  [
    [7,7,0,0],
    [0,7,7,0],
    [0,0,0,0],
    [0,0,0,0]
  ]
];
colors = [];
colors.push(color(0,0,0));
colors.push(color(0,240,240));
colors.push(color(240,240,0));
colors.push(color(160,0,240));
colors.push(color(240,160,0));
colors.push(color(0,0,240));
colors.push(color(0,240,0));
colors.push(color(240,0,0));
function setup() {
  createCanvas(COLS * CELL, ROWS * CELL);
  board = createEmptyBoard();
  score = 0;
  dropCounter = 0;
  dropInterval = baseDropInterval;
  spawnPiece();
  textSize(16);
  textAlign(LEFT, TOP);
}
function draw() {
  background(30);
  drawBoard();
  drawPiece();
  fill(255);
  noStroke();
  text("Score: " + score, 5, 5);
  if (gameOver) {
    fill(0, 0, 0, 180);
    rect(0, height / 2 - 40, width, 80);
    fill(255);
    textAlign(CENTER, CENTER);
    text("GAME OVER", width / 2, height / 2);
    return;
  }
  if (keyIsDown(DOWN_ARROW)) {
    dropInterval = fastDropInterval;
  } else {
    dropInterval = baseDropInterval;
  }
  dropCounter++;
  if (dropCounter >= dropInterval) {
    dropCounter = 0;
    current.y += 1;
    if (collides(current.x, current.y, current.shape)) {
      current.y -= 1;
      lockPiece();
    }
  }
}
function keyPressed() {
  if (gameOver) {
    return;
  }
  if (keyCode === LEFT_ARROW) {
    current.x -= 1;
    if (collides(current.x, current.y, current.shape)) {
      current.x += 1;
    }
  } else if (keyCode === RIGHT_ARROW) {
    current.x += 1;
    if (collides(current.x, current.y, current.shape)) {
      current.x -= 1;
    }
  } else if (keyCode === DOWN_ARROW) {
    // handled in draw for continuous fast drop
  } else if (keyCode === UP_ARROW) {
    let rotated = rotateMatrix(current.shape);
    let oldShape = current.shape;
    current.shape = rotated;
    if (collides(current.x, current.y, current.shape)) {
      current.shape = oldShape;
    }
  }
}
