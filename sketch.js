const COLS = 10;
const ROWS = 20;
const CELL = 30;
const WIDTH = COLS * CELL;
const HEIGHT = ROWS * CELL;
let board = [];
let pieces = [];
let colors = [];
let currentPiece = null;
let frameCounter = 0;
let baseDropInterval = 30;
let score = 0;
let gameOver = false;
function createEmptyBoard() {
  let b = [];
  for (let r = 0; r < ROWS; r++) {
    let row = [];
    for (let c = 0; c < COLS; c++) {
      row.push(0);
    }
    b.push(row);
  }
  return b;
}
function deepCopyShape(s) {
  let out = [];
  for (let i = 0; i < 4; i++) {
    let row = [];
    for (let j = 0; j < 4; j++) {
      row.push(s[i][j]);
    }
    out.push(row);
  }
  return out;
}
function rotateShape(s) {
  let ns = [];
  for (let i = 0; i < 4; i++) {
    let row = [];
    for (let j = 0; j < 4; j++) {
      row.push(0);
    }
    ns.push(row);
  }
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      ns[j][3 - i] = s[i][j];
    }
  }
  return ns;
}
function collides(shape, x, y) {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (shape[i][j] === 1) {
        let bx = x + j;
        let by = y + i;
        if (bx < 0 || bx >= COLS) {
          return true;
        }
        if (by >= ROWS) {
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
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (currentPiece.shape[i][j] === 1) {
        let bx = currentPiece.x + j;
        let by = currentPiece.y + i;
        if (by >= 0 && by < ROWS && bx >= 0 && bx < COLS) {
          board[by][bx] = currentPiece.colorIndex;
        }
      }
    }
  }
  clearLines();
  spawnPiece();
}
function clearLines() {
  let linesCleared = 0;
  for (let r = ROWS - 1; r >= 0; r--) {
    let full = true;
    for (let c = 0; c < COLS; c++) {
      if (board[r][c] === 0) {
        full = false;
        break;
      }
    }
    if (full) {
      board.splice(r, 1);
      let newRow = [];
      for (let c = 0; c < COLS; c++) {
        newRow.push(0);
      }
      board.unshift(newRow);
      linesCleared++;
      r++;
    }
  }
  if (linesCleared > 0) {
    score += linesCleared * 100;
  }
}
function spawnPiece() {
  let idx = floor(random(0, pieces.length));
  let shape = deepCopyShape(pieces[idx]);
  let startX = 3;
  let startY = 0;
  currentPiece = { shape: shape, x: startX, y: startY, colorIndex: idx + 1 };
  if (collides(currentPiece.shape, currentPiece.x, currentPiece.y)) {
    gameOver = true;
  }
}
function initPiecesAndColors() {
  let I = [
    [0,0,0,0],
    [1,1,1,1],
    [0,0,0,0],
    [0,0,0,0]
  ];
  let O = [
    [0,1,1,0],
    [0,1,1,0],
    [0,0,0,0],
    [0,0,0,0]
  ];
  let T = [
    [0,1,0,0],
    [1,1,1,0],
    [0,0,0,0],
    [0,0,0,0]
  ];
  let L = [
    [0,0,1,0],
    [1,1,1,0],
    [0,0,0,0],
    [0,0,0,0]
  ];
  let J = [
    [1,0,0,0],
    [1,1,1,0],
    [0,0,0,0],
    [0,0,0,0]
  ];
  let S = [
    [0,1,1,0],
    [1,1,0,0],
    [0,0,0,0],
    [0,0,0,0]
  ];
  let Z = [
    [1,1,0,0],
    [0,1,1,0],
    [0,0,0,0],
    [0,0,0,0]
  ];
  pieces = [I,O,T,L,J,S,Z];
  colors = [
    color(0,255,255),
    color(255,255,0),
    color(128,0,128),
    color(255,165,0),
    color(0,0,255),
    color(0,255,0),
    color(255,0,0)
  ];
}
function setup() {
  createCanvas(WIDTH, HEIGHT);
  board = createEmptyBoard();
  initPiecesAndColors();
  frameRate(60);
  spawnPiece();
}
function drawBoard() {
  stroke(50);
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      let val = board[r][c];
      if (val === 0) {
        fill(20);
      } else {
        let colIndex = val - 1;
        if (colIndex >= 0 && colIndex < colors.length) {
          fill(colors[colIndex]);
        } else {
          fill(200);
        }
      }
      rect(c * CELL, r * CELL, CELL, CELL);
    }
  }
}
function drawCurrentPiece() {
  if (currentPiece === null) {
    return;
  }
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (currentPiece.shape[i][j] === 1) {
        let bx = currentPiece.x + j;
        let by = currentPiece.y + i;
        if (by >= 0 && by < ROWS && bx >= 0 && bx < COLS) {
          let ci = currentPiece.colorIndex - 1;
          if (ci >= 0 && ci < colors.length) {
            fill(colors[ci]);
          } else {
            fill(200);
          }
          rect(bx * CELL, by * CELL, CELL, CELL);
        }
      }
    }
  }
}
function drawScore() {
  noStroke();
  fill(255);
  textSize(16);
  textAlign(LEFT, TOP);
  text("Score: " + score, 4, 4);
}
function draw() {
  background(0);
  drawBoard();
  drawCurrentPiece();
  drawScore();
  if (gameOver) {
    noStroke();
    fill(255, 0, 0);
    textSize(32);
    textAlign(CENTER, CENTER);
    text("Game Over", WIDTH / 2, HEIGHT / 2);
    return;
  }
  frameCounter++;
  let interval = baseDropInterval;
  if (keyIsDown(DOWN_ARROW)) {
    interval = 2;
  }
  if (frameCounter >= interval) {
    frameCounter = 0;
    currentPiece.y++;
    if (collides(currentPiece.shape, currentPiece.x, currentPiece.y)) {
      currentPiece.y--;
      lockPiece();
    }
  }
}
function keyPressed() {
  if (gameOver) {
    return;
  }
  if (keyCode === LEFT_ARROW) {
    currentPiece.x--;
    if (collides(currentPiece.shape, currentPiece.x, currentPiece.y)) {
      currentPiece.x++;
    }
  } else if (keyCode === RIGHT_ARROW) {
    currentPiece.x++;
    if (collides(currentPiece.shape, currentPiece.x, currentPiece.y)) {
      currentPiece.x--;
    }
  } else if (keyCode === DOWN_ARROW) {
    currentPiece.y++;
    if (collides(currentPiece.shape, currentPiece.x, currentPiece.y)) {
      currentPiece.y--;
      lockPiece();
    }
    frameCounter = 0;
  } else if (keyCode === UP_ARROW) {
    let rotated = rotateShape(currentPiece.shape);
    if (!collides(rotated, currentPiece.x, currentPiece.y)) {
      currentPiece.shape = rotated;
    }
  }
}
