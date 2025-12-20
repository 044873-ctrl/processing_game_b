let cols = 10;
let rows = 20;
let cell = 30;
let board = [];
let shapes = [];
let colors = [];
let current = null;
let score = 0;
let frameCounter = 0;
let dropIntervalNormal = 30;
let dropIntervalFast = 2;
let gameOver = false;
function setup() {
  createCanvas(300, 600);
  for (let y = 0; y < rows; y++) {
    let row = [];
    for (let x = 0; x < cols; x++) {
      row.push(0);
    }
    board.push(row);
  }
  shapes.push([
    [0,0,0,0],
    [1,1,1,1],
    [0,0,0,0],
    [0,0,0,0]
  ]);
  shapes.push([
    [0,0,0,0],
    [0,1,1,0],
    [0,1,1,0],
    [0,0,0,0]
  ]);
  shapes.push([
    [0,0,0,0],
    [0,1,0,0],
    [1,1,1,0],
    [0,0,0,0]
  ]);
  shapes.push([
    [0,0,0,0],
    [0,0,1,0],
    [1,1,1,0],
    [0,0,0,0]
  ]);
  shapes.push([
    [0,0,0,0],
    [1,0,0,0],
    [1,1,1,0],
    [0,0,0,0]
  ]);
  shapes.push([
    [0,0,0,0],
    [0,1,1,0],
    [1,1,0,0],
    [0,0,0,0]
  ]);
  shapes.push([
    [0,0,0,0],
    [1,1,0,0],
    [0,1,1,0],
    [0,0,0,0]
  ]);
  colors = [
    color(0, 240, 240),
    color(240, 240, 0),
    color(160, 0, 240),
    color(240, 160, 0),
    color(0, 0, 240),
    color(0, 240, 0),
    color(240, 0, 0)
  ];
  newPiece();
  score = 0;
  frameCounter = 0;
  textAlign(LEFT, TOP);
  textSize(16);
}
function draw() {
  background(20);
  frameCounter++;
  if (!gameOver) {
    let interval = dropIntervalNormal;
    if (keyIsDown(DOWN_ARROW)) {
      interval = dropIntervalFast;
    }
    if (frameCounter % interval === 0) {
      if (canMove(current.shape, current.x, current.y + 1)) {
        current.y++;
      } else {
        lockPiece();
      }
    }
  }
  drawBoard();
  drawPiece(current);
  fill(255);
  noStroke();
  text("Score: " + score, 5, 5);
  if (gameOver) {
    fill(0,0,0,150);
    rect(0, height/2 - 40, width, 80);
    fill(255);
    textSize(24);
    textAlign(CENTER, CENTER);
    text("Game Over", width/2, height/2);
    textSize(16);
    textAlign(LEFT, TOP);
  }
}
function drawBoard() {
  for (let y = 0; y < rows; y++) {
    for (let x = 0; x < cols; x++) {
      let v = board[y][x];
      if (v) {
        fill(v);
        stroke(30);
        rect(x * cell, y * cell, cell, cell);
      } else {
        noFill();
        stroke(40);
        rect(x * cell, y * cell, cell, cell);
      }
    }
  }
}
function drawPiece(p) {
  if (!p) {
    return;
  }
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (p.shape[i][j]) {
        let px = (p.x + j) * cell;
        let py = (p.y + i) * cell;
        fill(p.color);
        stroke(30);
        rect(px, py, cell, cell);
      }
    }
  }
}
function newPiece() {
  let idx = floor(random(0, shapes.length));
  let shape = copyShape(shapes[idx]);
  let startX = 3;
  let startY = 0;
  let col = colors[idx];
  current = {shape: shape, x: startX, y: startY, color: col, idx: idx};
  if (!canMove(current.shape, current.x, current.y)) {
    gameOver = true;
  }
}
function copyShape(s) {
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
function canMove(shape, x, y) {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (shape[i][j]) {
        let gx = x + j;
        let gy = y + i;
        if (gx < 0 || gx >= cols || gy < 0 || gy >= rows) {
          return false;
        }
        if (board[gy][gx]) {
          return false;
        }
      }
    }
  }
  return true;
}
function lockPiece() {
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      if (current.shape[i][j]) {
        let gx = current.x + j;
        let gy = current.y + i;
        if (gy >= 0 && gy < rows && gx >= 0 && gx < cols) {
          board[gy][gx] = current.color;
        }
      }
    }
  }
  clearLines();
  newPiece();
}
function clearLines() {
  let linesCleared = 0;
  for (let y = rows - 1; y >= 0; y--) {
    let full = true;
    for (let x = 0; x < cols; x++) {
      if (!board[y][x]) {
        full = false;
        break;
      }
    }
    if (full) {
      linesCleared++;
      for (let ty = y; ty > 0; ty--) {
        for (let tx = 0; tx < cols; tx++) {
          board[ty][tx] = board[ty - 1][tx];
        }
      }
      for (let tx = 0; tx < cols; tx++) {
        board[0][tx] = 0;
      }
      y++;
    }
  }
  if (linesCleared > 0) {
    score += linesCleared * 100;
  }
}
function rotateMatrix(shape) {
  let out = [];
  for (let i = 0; i < 4; i++) {
    let row = [];
    for (let j = 0; j < 4; j++) {
      row.push(0);
    }
    out.push(row);
  }
  for (let i = 0; i < 4; i++) {
    for (let j = 0; j < 4; j++) {
      out[j][3 - i] = shape[i][j];
    }
  }
  return out;
}
function keyPressed() {
  if (gameOver) {
    return;
  }
  if (keyCode === LEFT_ARROW) {
    if (canMove(current.shape, current.x - 1, current.y)) {
      current.x--;
    }
  } else if (keyCode === RIGHT_ARROW) {
    if (canMove(current.shape, current.x + 1, current.y)) {
      current.x++;
    }
  } else if (keyCode === UP_ARROW) {
    let rotated = rotateMatrix(current.shape);
    if (canMove(rotated, current.x, current.y)) {
      current.shape = rotated;
    }
  } else if (keyCode === DOWN_ARROW) {
    if (canMove(current.shape, current.x, current.y + 1)) {
      current.y++;
    } else {
      lockPiece();
    }
  }
}
