var cols=10;
var rows=10;
var cellSize=40;
var totalMines=15;
var COVERED=0;
var OPEN=1;
var FLAGGED=2;
var mines;
var state;
var counts;
var flagsCount;
var openCount;
var gameOver;
var won;
var cnv;
function setup(){
  cnv=createCanvas(cols*cellSize,rows*cellSize);
  cnv.elt.oncontextmenu=function(){return false;};
  initGame();
}
function initGame(){
  mines=new Array(cols);
  state=new Array(cols);
  counts=new Array(cols);
  for(var x=0;x<cols;x++){
    mines[x]=new Array(rows);
    state[x]=new Array(rows);
    counts[x]=new Array(rows);
    for(var y=0;y<rows;y++){
      mines[x][y]=false;
      state[x][y]=COVERED;
      counts[x][y]=0;
    }
  }
  var positions=new Array(cols*rows);
  for(var i=0;i<positions.length;i++){positions[i]=i;}
  for(var i=positions.length-1;i>0;i--){
    var j=Math.floor(Math.random()*(i+1));
    var tmp=positions[i];
    positions[i]=positions[j];
    positions[j]=tmp;
  }
  for(var k=0;k<totalMines;k++){
    var p=positions[k];
    var mx=p%cols;
    var my=Math.floor(p/cols);
    mines[mx][my]=true;
  }
  for(var x=0;x<cols;x++){
    for(var y=0;y<rows;y++){
      if(mines[x][y]){counts[x][y]=-1;continue;}
      var cnt=0;
      for(var dx=-1;dx<=1;dx++){
        for(var dy=-1;dy<=1;dy++){
          if(dx===0 && dy===0)continue;
          var nx=x+dx;
          var ny=y+dy;
          if(nx>=0 && nx<cols && ny>=0 && ny<rows){
            if(mines[nx][ny])cnt++;
          }
        }
      }
      counts[x][y]=cnt;
    }
  }
  flagsCount=0;
  openCount=0;
  gameOver=false;
  won=false;
}
function draw(){
  background(220);
  stroke(100);
  for(var x=0;x<cols;x++){
    for(var y=0;y<rows;y++){
      var sx=x*cellSize;
      var sy=y*cellSize;
      if(state[x][y]===OPEN){
        fill(200);
        rect(sx,sy,cellSize,cellSize);
        if(mines[x][y]){
          fill(0);
          ellipse(sx+cellSize/2,sy+cellSize/2,cellSize*0.5,cellSize*0.5);
        } else {
          var n=counts[x][y];
          if(n>0){
            fill(0);
            textAlign(CENTER,CENTER);
            textSize(16);
            text(n,sx+cellSize/2,sy+cellSize/2);
          }
        }
      } else {
        fill(150);
        rect(sx,sy,cellSize,cellSize);
        if(state[x][y]===FLAGGED){
          fill(255,0,0);
          var fx=sx+cellSize*0.2;
          var fy=sy+cellSize*0.2;
          triangle(fx,fy+cellSize*0.6,fx,fy,fx+cellSize*0.5,fy+cellSize*0.3);
          stroke(0);
          line(fx,fy+cellSize*0.6,fx,fy);
          noStroke();
        }
      }
    }
  }
  if(gameOver || won){
    fill(0,0,0,150);
    rect(0,0,width,height);
    fill(255);
    textAlign(CENTER,CENTER);
    textSize(32);
    if(won){
      text(
