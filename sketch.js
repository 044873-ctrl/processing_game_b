const COLS = 10;
const ROWS = 20;
const TILE = 30;
let board = [];
let shapes = [];
let colors = [];
let currentPiece = null;
let dropCounter = 0;
let dropInterval = 30;
let score = 0;
let gameOver = false;

function createEmptyBoard() {
  const b = [];
  for (let r = 0; r < ROWS; r++) {
    const row = [];
    for (let c = 0; c < COLS; c++) {
      row.push(0);
    }
    b.push(row);
  }
  return b;
}

function deepCopyMatrix(m) {
  const out = [];
  for (let r = 0; r < m.length; r++) {
    const row = [];
    for (let c = 0; c < m[r].length; c++) {
      row.push(m[r][c]);
    }
    out.push(row);
  }
  return out;
}

function rotateMatrix(m) {
  const n = 4;
  const out = [];
  for (let r = 0; r < n; r++) {
    const row = [];
    for (let c = 0; c < n; c++) {
      row.push(0);
    }
    out.push(row);
  }
  for (let r = 0; r < n; r++) {
    for (let c = 0; c < n; c++) {
      out[c][n - 1 - r] = m[r][c];
    }
  }
  return out;
}

function isValidPosition(shape, x, y) {
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (shape[r][c] !== 0) {
        const nx = x + c;
        const ny = y + r;
        if (nx < 0 || nx >= COLS) {
          return false;
        }
        if (ny >= ROWS) {
          return false;
        }
        if (ny >= 0) {
          if (board[ny][nx] !== 0) {
            return false;
          }
        }
      }
    }
  }
  return true;
}

function lockPiece() {
  const shape = currentPiece.shape;
  const x = currentPiece.x;
  const y = currentPiece.y;
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (shape[r][c] !== 0) {
        const nx = x + c;
        const ny = y + r;
        if (ny >= 0 && ny < ROWS && nx >= 0 && nx < COLS) {
          board[ny][nx] = currentPiece.colorIndex;
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
      const newRow = [];
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
  const idx = Math.floor(Math.random() * shapes.length);
  const shape = deepCopyMatrix(shapes[idx]);
  const x = Math.floor(COLS / 2) - 2;
  const y = -1;
  currentPiece = { shape: shape, x: x, y: y, colorIndex: idx + 1 };
  if (!isValidPosition(currentPiece.shape, currentPiece.x, currentPiece.y)) {
    gameOver = true;
  }
}

function drawBoard() {
  background(30);
  stroke(60);
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const v = board[r][c];
      if (v === 0) {
        fill(20);
      } else {
        const col = colors[v - 1];
        fill(col);
      }
      rect(c * TILE, r * TILE, TILE, TILE);
    }
  }
  if (currentPiece !== null) {
    const shape = currentPiece.shape;
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        if (shape[r][c] !== 0) {
          const nx = currentPiece.x + c;
          const ny = currentPiece.y + r;
          if (ny >= 0) {
            const col = colors[currentPiece.colorIndex - 1];
            fill(col);
            rect(nx * TILE, ny * TILE, TILE, TILE);
          }
        }
      }
    }
  }
  fill(255);
  noStroke();
  textSize(16);
  textAlign(LEFT, TOP);
  text("Score: " + score, 5, 5);
  if (gameOver) {
    fill(0, 180);
    rect(0, 0, COLS * TILE, ROWS * TILE);
    fill(255);
    textSize(32);
    textAlign(CENTER, CENTER);
    text("Game Over", COLS * TILE / 2, ROWS * TILE / 2 - 20);
    textSize(20);
    text("Score: " + score, COLS * TILE / 2, ROWS * TILE / 2 + 20);
  }
}

function setupShapesAndColors() {
  const I = [
    [0,0,0,0],
    [1,1,1,1],
    [0,0,0,0],
    [0,0,0,0]
  ];
  const O = [
    [0,0,0,0],
    [0,1,1,0],
    [0,1,1,0],
    [0,0,0,0]
  ];
  const T = [
    [0,0,0,0],
    [1,1,1,0],
    [0,1,0,0],
    [0,0,0,0]
  ];
  const L = [
    [0,0,0,0],
    [1,1,1,0],
    [1,0,0,0],
    [0,0,0,0]
  ];
  const J = [
    [0,0,0,0],
    [1,1,1,0],
    [0,0,1,0],
    [0,0,0,0]
  ];
  const S = [
    [0,0,0,0],
    [0,1,1,0],
    [1,1,0,0],
    [0,0,0,0]
  ];
  const Z = [
    [0,0,0,0],
    [1,1,0,0],
    [0,1,1,0],
    [0,0,0,0]
  ];
  shapes = [I, O, T, L, J, S, Z];
  colors = [
    color(0, 240, 240),
    color(240, 240, 0),
    color(160, 0, 240),
    color(240, 160, 0),
    color(0, 0, 240),
    color(0, 240, 0),
    color(240, 0, 0)
  ];
}

function setup() {
  createCanvas(COLS * TILE, ROWS * TILE);
  board = createEmptyBoard();
  setupShapesAndColors();
  spawnPiece();
  frameRate(60);
}

function keyPressed() {
  if (gameOver) {
    return;
  }
  if (keyCode === LEFT_ARROW) {
    if (currentPiece !== null) {
      const nx = currentPiece.x - 1;
      if (isValidPosition(currentPiece.shape, nx, currentPiece.y)) {
        currentPiece.x = nx;
      }
    }
  } else if (keyCode === RIGHT_ARROW) {
    if (currentPiece !== null) {
      const nx = currentPiece.x + 1;
      if (isValidPosition(currentPiece.shape, nx, currentPiece.y)) {
        currentPiece.x = nx;
      }
    }
  } else if (keyCode === UP_ARROW) {
    if (currentPiece !== null) {
      const rotated = rotateMatrix(currentPiece.shape);
      if (isValidPosition(rotated, currentPiece.x, currentPiece.y)) {
        currentPiece.shape = rotated;
      } else {
        if (isValidPosition(rotated, currentPiece.x - 1, currentPiece.y)) {
          currentPiece.x -= 1;
          currentPiece.shape = rotated;
        } else if (isValidPosition(rotated, currentPiece.x + 1, currentPiece.y)) {
          currentPiece.x += 1;
          currentPiece.shape = rotated;
        }
      }
    }
  } else if (keyCode === DOWN_ARROW) {
    if (currentPiece !== null) {
      const ny = currentPiece.y + 1;
      if (isValidPosition(currentPiece.shape, currentPiece.x, ny)) {
        currentPiece.y = ny;
      } else {
        lockPiece();
      }
      dropCounter = 0;
    }
  }
}

function draw() {
  if (!gameOver) {
    const effectiveInterval = keyIsDown(DOWN_ARROW) ? 1 : dropInterval;
    dropCounter++;
    if (dropCounter >= effectiveInterval) {
      dropCounter = 0;
      if (currentPiece !== null) {
        const ny = currentPiece.y + 1;
        if (isValidPosition(currentPiece.shape, currentPiece.x, ny)) {
          currentPiece.y = ny;
        } else {
          lockPiece();
        }
      }
    }
  }
  drawBoard();
}
