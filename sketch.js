var cols=10;
var rows=20;
var cell=30;
var board=[];
var pieces=[];
var colors=[];
var currentPiece=null;
var dropCounter=0;
var baseInterval=30;
var gameOver=false;
var score=0;
function setup(){
  createCanvas(300,600);
  frameRate(60);
  for(var r=0;r<rows;r++){
    var row=[];
    for(var c=0;c<cols;c++){
      row.push(0);
    }
    board.push(row);
  }
  pieces.push([
    [0,0,0,0],
    [1,1,1,1],
    [0,0,0,0],
    [0,0,0,0]
  ]);
  pieces.push([
    [0,0,0,0],
    [0,1,1,0],
    [0,1,1,0],
    [0,0,0,0]
  ]);
  pieces.push([
    [0,0,0,0],
    [0,1,0,0],
    [1,1,1,0],
    [0,0,0,0]
  ]);
  pieces.push([
    [0,0,0,0],
    [0,0,1,0],
    [1,1,1,0],
    [0,0,0,0]
  ]);
  pieces.push([
    [0,0,0,0],
    [1,0,0,0],
    [1,1,1,0],
    [0,0,0,0]
  ]);
  pieces.push([
    [0,0,0,0],
    [0,1,1,0],
    [1,1,0,0],
    [0,0,0,0]
  ]);
  pieces.push([
    [0,0,0,0],
    [1,1,0,0],
    [0,1,1,0],
    [0,0,0,0]
  ]);
  colors.push(color(0,255,255));
  colors.push(color(255,255,0));
  colors.push(color(128,0,128));
  colors.push(color(255,165,0));
  colors.push(color(0,0,255));
  colors.push(color(0,255,0));
  colors.push(color(255,0,0));
  spawnPiece();
}
function draw(){
  background(30);
  drawBoard();
  drawPiece();
  fill(255);
  textSize(16);
  textAlign(LEFT,TOP);
  text("Score: "+score,5,5);
  if(gameOver){
    textSize(32);
    textAlign(CENTER,CENTER);
    text("GAME OVER",width/2,height/2);
    return;
  }
  dropCounter++;
  var interval=baseInterval;
  if(keyIsDown(DOWN_ARROW)){
    interval=1;
  }
  if(dropCounter>=interval){
    dropCounter=0;
    moveDown();
  }
}
function spawnPiece(){
  var idx=floor(random(0,pieces.length));
  var mat=cloneMat(pieces[idx]);
  var startX=floor((cols-4)/2);
  var startY=0;
  currentPiece={mat:mat,x:startX,y:startY,color:idx+1};
  if(!isValid(currentPiece.x,currentPiece.y,currentPiece.mat)){
    gameOver=true;
  }
}
function cloneMat(mat){
  var out=[];
  for(var r=0;r<4;r++){
    var row=[];
    for(var c=0;c<4;c++){
      row.push(mat[r][c]);
    }
    out.push(row);
  }
  return out;
}
function isValid(posX,posY,mat){
  for(var r=0;r<4;r++){
    for(var c=0;c<4;c++){
      if(mat[r][c]){
        var x=posX+c;
        var y=posY+r;
        if(x<0||x>=cols||y<0||y>=rows){
          return false;
        }
        if(board[y][x]){
          return false;
        }
      }
    }
  }
  return true;
}
function moveDown(){
  if(isValid(currentPiece.x,currentPiece.y+1,currentPiece.mat)){
    currentPiece.y++;
  }else{
    lockPiece();
  }
}
function lockPiece(){
  for(var r=0;r<4;r++){
    for(var c=0;c<4;c++){
      if(currentPiece.mat[r][c]){
        var x=currentPiece.x+c;
        var y=currentPiece.y+r;
        if(y>=0&&y<rows&&x>=0&&x<cols){
          board[y][x]=currentPiece.color;
        }
      }
    }
  }
  clearLines();
  spawnPiece();
}
function clearLines(){
  for(var r=rows-1;r>=0;r--){
    var full=true;
    for(var c=0;c<cols;c++){
      if(board[r][c]===0){
        full=false;
        break;
      }
    }
    if(full){
      board.splice(r,1);
      var newRow=[];
      for(var c=0;c<cols;c++){
        newRow.push(0);
      }
      board.unshift(newRow);
      score+=100;
      r++;
    }
  }
}
function drawBoard(){
  stroke(50);
  for(var r=0;r<rows;r++){
    for(var c=0;c<cols;c++){
      var val=board[r][c];
      if(val){
        fill(colors[val-1]);
      }else{
        fill(20);
      }
      rect(c*cell,r*cell,cell,cell);
    }
  }
}
function drawPiece(){
  if(!currentPiece){
    return;
  }
  noStroke();
  for(var r=0;r<4;r++){
    for(var c=0;c<4;c++){
      if(currentPiece.mat[r][c]){
        var x=(currentPiece.x+c)*cell;
        var y=(currentPiece.y+r)*cell;
        fill(colors[currentPiece.color-1]);
        rect(x,y,cell,cell);
      }
    }
  }
  stroke(50);
}
function rotateMat(mat){
  var out=[];
  for(var r=0;r<4;r++){
    var row=[];
    for(var c=0;c<4;c++){
      row.push(0);
    }
    out.push(row);
  }
  for(var r=0;r<4;r++){
    for(var c=0;c<4;c++){
      out[c][3-r]=mat[r][c];
    }
  }
  return out;
}
function keyPressed(){
  if(gameOver){
    return;
  }
  if(keyCode===LEFT_ARROW){
    if(isValid(currentPiece.x-1,currentPiece.y,currentPiece.mat)){
      currentPiece.x--;
    }
  }else if(keyCode===RIGHT_ARROW){
    if(isValid(currentPiece.x+1,currentPiece.y,currentPiece.mat)){
      currentPiece.x++;
    }
  }else if(keyCode===UP_ARROW){
    var rotated=rotateMat(currentPiece.mat);
    if(isValid(currentPiece.x,currentPiece.y,rotated)){
      currentPiece.mat=rotated;
    }
  }else if(keyCode===DOWN_ARROW){
    if(isValid(currentPiece.x,currentPiece.y+1,currentPiece.mat)){
      currentPiece.y++;
      dropCounter=0;
    }
  }
}
