let cols = 10;
let rows = 20;
let cellSize = 30;
let board = [];
let pieces = [];
let colors;
let current;
let dropCounter = 0;
let dropInterval = 30;
let score = 0;
let gameOver = false;
function setup() {
  createCanvas(300, 600);
  frameRate(60);
  for (let r = 0; r < rows; r++) {
    let row = [];
    for (let c = 0; c < cols; c++) {
      row.push(0);
    }
    board.push(row);
  }
  pieces = [
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
    color(0,0,0),
    color(0,255,255),
    color(255,255,0),
    color(128,0,128),
    color(255,165,0),
    color(0,0,255),
    color(0,255,0),
    color(255,0,0)
  ];
  createNewPiece();
}
function draw() {
  background(220);
  stroke(160);
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      let v = board[r][c];
      if (v !== 0) {
        fill(colors[v]);
      } else {
        fill(240);
      }
      rect(c * cellSize, r * cellSize, cellSize, cellSize);
    }
  }
  if (!gameOver && current !== undefined) {
    for (let ty = 0; ty < 4; ty++) {
      for (let tx = 0; tx < 4; tx++) {
        if (current.shape[ty][tx] === 1) {
          let bx = current.x + tx;
          let by = current.y + ty;
          if (by >= 0) {
            fill(colors[current.color]);
            rect(bx * cellSize, by * cellSize, cellSize, cellSize);
          }
        }
      }
    }
    dropInterval = keyIsDown(DOWN_ARROW) ? 2 : 30;
    dropCounter++;
    if (dropCounter >= dropInterval) {
      dropCounter = 0;
      if (validPosition(current.shape, current.x, current.y + 1)) {
        current.y++;
      } else {
        lockPiece();
      }
    }
  }
  fill(0);
  noStroke();
  textSize(16);
  textAlign(LEFT, TOP);
  text("Score: " + score, 5, 5);
  if (gameOver) {
    fill(0,150);
    rect(0, height/2 - 40, width, 80);
    fill(255);
    textSize(24);
    textAlign(CENTER, CENTER);
    text("GAME OVER", width/2, height/2);
  }
}
function createNewPiece() {
  let idx = floor(random(0, pieces.length));
  let shape = [];
  for (let r = 0; r < 4; r++) {
    shape.push(pieces[idx][r].slice());
  }
  current = {
    shape: shape,
    x: 3,
    y: 0,
    color: idx + 1
  };
  if (!validPosition(current.shape, current.x, current.y)) {
    gameOver = true;
  }
}
function rotateShape(s) {
  let out = [];
  for (let r = 0; r < 4; r++) {
    let row = [];
    for (let c = 0; c < 4; c++) {
      row.push(0);
    }
    out.push(row);
  }
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      out[c][3 - r] = s[r][c];
    }
  }
  return out;
}
function validPosition(s, x, y) {
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (s[r][c] === 1) {
        let bx = x + c;
        let by = y + r;
        if (bx < 0 || bx >= cols) {
          return false;
        }
        if (by >= rows) {
          return false;
        }
        if (by >= 0) {
          if (board[by][bx] !== 0) {
            return false;
          }
        }
      }
    }
  }
  return true;
}
function lockPiece() {
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      if (current.shape[r][c] === 1) {
        let bx = current.x + c;
        let by = current.y + r;
        if (by >= 0 && by < rows && bx >= 0 && bx < cols) {
          board[by][bx] = current.color;
        }
      }
    }
  }
  clearLines();
  createNewPiece();
}
function clearLines() {
  let r = rows - 1;
  let lines = 0;
  while (r >= 0) {
    let full = true;
    for (let c = 0; c < cols; c++) {
      if (board[r][c] === 0) {
        full = false;
        break;
      }
    }
    if (full) {
      for (let rr = r; rr > 0; rr--) {
        board[rr] = board[rr - 1].slice();
      }
      let newTop = [];
      for (let c = 0; c < cols; c++) {
        newTop.push(0);
      }
      board[0] = newTop;
      lines++;
    } else {
      r--;
    }
  }
  if (lines > 0) {
    score += 100 * lines;
  }
}
function keyPressed() {
  if (gameOver) {
    return;
  }
  if (keyCode === LEFT_ARROW) {
    if (current !== undefined && validPosition(current.shape, current.x - 1, current.y)) {
      current.x--;
    }
  } else if (keyCode === RIGHT_ARROW) {
    if (current !== undefined && validPosition(current.shape, current.x + 1, current.y)) {
      current.x++;
    }
  } else if (keyCode === UP_ARROW) {
    if (current !== undefined) {
      let rotated = rotateShape(current.shape);
      if (validPosition(rotated, current.x, current.y)) {
        current.shape = rotated;
      }
    }
  } else if (keyCode === DOWN_ARROW) {
    if (current !== undefined && validPosition(current.shape, current.x, current.y + 1)) {
      current.y++;
      dropCounter = 0;
    }
  }
}
