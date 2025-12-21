let cols = 10;
let rows = 20;
let cellSize = 30;
let grid = [];
let shapes = [];
let colors = [];
let currentPiece = null;
let currentX = 0;
let currentY = 0;
let dropInterval = 30;
let dropIntervalFast = 2;
let dropCounter = 0;
let frameCounter = 0;
let score = 0;
let gameOver = false;
let leftPressed = false;
let rightPressed = false;
let downPressed = false;
let leftCool = 0;
let rightCool = 0;
let moveCooldown = 6;
function setupGrid() {
  for (let r = 0; r < rows; r++) {
    grid[r] = [];
    for (let c = 0; c < cols; c++) {
      grid[r][c] = 0;
    }
  }
}
function defineShapes() {
  shapes = [
    [
      [0,0,0,0],
      [1,1,1,1],
      [0,0,0,0],
      [0,0,0,0]
    ],
    [
      [0,1,1,0],
      [0,1,1,0],
      [0,0,0,0],
      [0,0,0,0]
    ],
    [
      [0,1,0,0],
      [1,1,1,0],
      [0,0,0,0],
      [0,0,0,0]
    ],
    [
      [0,0,1,0],
      [1,1,1,0],
      [0,0,0,0],
      [0,0,0,0]
    ],
    [
      [1,0,0,0],
      [1,1,1,0],
      [0,0,0,0],
      [0,0,0,0]
    ],
    [
      [0,1,1,0],
      [1,1,0,0],
      [0,0,0,0],
      [0,0,0,0]
    ],
    [
      [1,1,0,0],
      [0,1,1,0],
      [0,0,0,0],
      [0,0,0,0]
    ]
  ];
  colors = [
    [0,0,0],
    [0,255,255],
    [255,255,0],
    [128,0,128],
    [255,165,0],
    [0,0,255],
    [0,255,0],
    [255,0,0]
  ];
}
function rotateMatrix(mat) {
  let m = [];
  for (let r = 0; r < 4; r++) {
    m[r] = [];
    for (let c = 0; c < 4; c++) {
      m[r][c] = 0;
    }
  }
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      m[c][3-r] = mat[r][c];
    }
  }
  return m;
}
function canPlace(shape, x, y) {
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (shape[r][c] !== 0) {
        let gx = x + c;
        let gy = y + r;
        if (gx < 0 || gx >= cols) return false;
        if (gy >= rows) return false;
        if (gy >= 0) {
          if (grid[gy][gx] !== 0) return false;
        }
      }
    }
  }
  return true;
}
function lockPiece() {
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (currentPiece[r][c] !== 0) {
        let gx = currentX + c;
        let gy = currentY + r;
        if (gy >= 0 && gy < rows && gx >= 0 && gx < cols) {
          grid[gy][gx] = currentPiece[r][c];
        }
      }
    }
  }
  clearLines();
  spawnPiece();
}
function clearLines() {
  let linesCleared = 0;
  for (let r = rows - 1; r >= 0; r--) {
    let full = true;
    for (let c = 0; c < cols; c++) {
      if (grid[r][c] === 0) {
        full = false;
        break;
      }
    }
    if (full) {
      linesCleared++;
      for (let rr = r; rr > 0; rr--) {
        for (let cc = 0; cc < cols; cc++) {
          grid[rr][cc] = grid[rr-1][cc];
        }
      }
      for (let cc = 0; cc < cols; cc++) {
        grid[0][cc] = 0;
      }
      r++;
    }
  }
  if (linesCleared > 0) {
    score += 100 * linesCleared;
  }
}
function spawnPiece() {
  let idx = Math.floor(Math.random() * shapes.length);
  let shape = [];
  for (let r = 0; r < 4; r++) {
    shape[r] = [];
    for (let c = 0; c < 4; c++) {
      if (shapes[idx][r][c] === 1) {
        shape[r][c] = idx + 1;
      } else {
        shape[r][c] = 0;
      }
    }
  }
  currentPiece = shape;
  currentX = 3;
  currentY = -1;
  if (!canPlace(currentPiece, currentX, currentY)) {
    gameOver = true;
  }
}
function movePiece(dx, dy) {
  if (canPlace(currentPiece, currentX + dx, currentY + dy)) {
    currentX += dx;
    currentY += dy;
    return true;
  }
  return false;
}
function hardDrop() {
  while (movePiece(0,1)) {}
  lockPiece();
}
function setup() {
  createCanvas(300,600);
  setupGrid();
  defineShapes();
  spawnPiece();
}
function draw() {
  background(20);
  noStroke();
  frameCounter++;
  if (!gameOver) {
    dropCounter++;
    let interval = downPressed ? dropIntervalFast : dropInterval;
    if (dropCounter >= interval) {
      dropCounter = 0;
      if (!movePiece(0,1)) {
        lockPiece();
      }
    }
    if (leftPressed) {
      if (leftCool <= 0) {
        movePiece(-1,0);
        leftCool = moveCooldown;
      } else {
        leftCool--;
      }
    } else {
      leftCool = 0;
    }
    if (rightPressed) {
      if (rightCool <= 0) {
        movePiece(1,0);
        rightCool = moveCooldown;
      } else {
        rightCool--;
      }
    } else {
      rightCool = 0;
    }
  }
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      let v = grid[r][c];
      if (v !== 0) {
        fill(colors[v][0], colors[v][1], colors[v][2]);
        rect(c * cellSize, r * cellSize, cellSize, cellSize);
      } else {
        fill(30);
        rect(c * cellSize, r * cellSize, cellSize, cellSize);
      }
    }
  }
  if (currentPiece !== null) {
    for (let r = 0; r < 4; r++) {
      for (let c = 0; c < 4; c++) {
        let v = currentPiece[r][c];
        if (v !== 0) {
          let gx = currentX + c;
          let gy = currentY + r;
          if (gy >= 0 && gx >= 0 && gx < cols && gy < rows) {
            fill(colors[v][0], colors[v][1], colors[v][2]);
            rect(gx * cellSize, gy * cellSize, cellSize, cellSize);
          }
        }
      }
    }
  }
  fill(255);
  textSize(16);
  textAlign(LEFT, TOP);
  text("Score: " + score, 5, 5);
  if (gameOver) {
    fill(0,0,0,180);
    rect(0, height/2 - 40, width, 80);
    fill(255);
    textAlign(CENTER, CENTER);
    textSize(24);
    text("GAME OVER", width/2, height/2);
  }
}
function keyPressed() {
  if (keyCode === LEFT) {
    leftPressed = true;
  } else if (keyCode === RIGHT) {
    rightPressed = true;
  } else if (keyCode === DOWN) {
    downPressed = true;
  } else if (keyCode === UP) {
    if (!gameOver && currentPiece !== null) {
      let rotated = rotateMatrix(currentPiece);
      if (canPlace(rotated, currentX, currentY)) {
        currentPiece = rotated;
      }
    }
  } else if (key === 
