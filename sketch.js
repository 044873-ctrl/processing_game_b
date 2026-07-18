var player={x:0,y:0,w:40,h:20,spd:5};
var bullets=[];
var enemies=[];
var lastShotTime=0;
var shotInterval=200;
var lastSpawnTime=0;
var spawnInterval=800;
var score=0;
var gameOver=false;
function createBullet(px,py){
  var b={x:px,y:py,w:4,h:8,spd:8};
  return b;
}
function createEnemy(ex,ey,ew,eh,espd){
  var e={x:ex,y:ey,w:ew,h:eh,spd:espd};
  return e;
}
function spawnEnemy(){
  var ew=30;
  var eh=18;
  var ex=random(ew/2, width-ew/2);
  var ey=-eh;
  var espd=random(1.2,3.2);
  var e=createEnemy(ex,ey,ew,eh,espd);
  enemies.push(e);
}
function shoot(){
  var now=millis();
  if(now-lastShotTime<shotInterval){
    return;
  }
  lastShotTime=now;
  var bx=player.x;
  var by=player.y-player.h/2;
  var b=createBullet(bx,by);
  bullets.push(b);
}
function updateBullets(){
  for(var i=bullets.length-1;i>=0;i--){
    var b=bullets[i];
    b.y-=b.spd;
    if(b.y+ b.h < 0){
      bullets.splice(i,1);
    }
  }
}
function updateEnemies(){
  for(var i=enemies.length-1;i>=0;i--){
    var e=enemies[i];
    e.y+=e.spd;
    if(e.y - e.h/2 > height){
      enemies.splice(i,1);
      gameOver=true;
    }
  }
}
function rectsOverlap(a,b){
  var ax1=a.x-a.w/2;
  var ax2=a.x+a.w/2;
  var ay1=a.y-a.h/2;
  var ay2=a.y+a.h/2;
  var bx1=b.x-b.w/2;
  var bx2=b.x+b.w/2;
  var by1=b.y-b.h/2;
  var by2=b.y+b.h/2;
  return !(ax2<bx1 || ax1>bx2 || ay2<by1 || ay1>by2);
}
function checkCollisions(){
  for(var i=enemies.length-1;i>=0;i--){
    var e=enemies[i];
    for(var j=bullets.length-1;j>=0;j--){
      var b=bullets[j];
      if(rectsOverlap(e,b)){
        enemies.splice(i,1);
        bullets.splice(j,1);
        score+=10;
        break;
      }
    }
  }
}
function resetGame(){
  bullets=[];
  enemies=[];
  lastShotTime=0;
  lastSpawnTime=0;
  score=0;
  gameOver=false;
  player.x=width/2;
  player.y=height-30;
}
function setup(){
  createCanvas(480,640);
  frameRate(60);
  player.x=width/2;
  player.y=height-30;
}
function draw(){
  background(20);
  if(!gameOver){
    var now=millis();
    if(keyIsDown(LEFT_ARROW) || keyIsDown(65)){
      player.x-=player.spd;
    }
    if(keyIsDown(RIGHT_ARROW) || keyIsDown(68)){
      player.x+=player.spd;
    }
    if(keyIsDown(32)){
      shoot();
    }
    if(player.x<player.w/2){
      player.x=player.w/2;
    }
    if(player.x>width-player.w/2){
      player.x=width-player.w/2;
    }
    if(now-lastSpawnTime>spawnInterval){
      spawnEnemy();
      lastSpawnTime=now;
      if(spawnInterval>250){
        spawnInterval*=0.995;
      }
    }
    updateBullets();
    updateEnemies();
    checkCollisions();
  }
  fill(0,200,255);
  noStroke();
  rectMode(CENTER);
  rect(player.x,player.y,player.w,player.h,4);
  fill(255,255,0);
  for(var i=0;i<bullets.length;i++){
    var b=bullets[i];
    rect(b.x,b.y,b.w,b.h);
  }
  fill(255,80,80);
  for(var j=0;j<enemies.length;j++){
    var e=enemies[j];
    rect(e.x,e.y,e.w,e.h,3);
  }
  fill(255);
  textSize(16);
  textAlign(LEFT,TOP);
  text('Score: '+score,10,10);
  if(gameOver){
    fill(255,240,0);
    textSize(36);
    textAlign(CENTER,CENTER);
    text('Game Over',width/2,height/2-20);
    textSize(18);
    text('Press ENTER to restart',width/2,height/2+20);
  }
}
function keyPressed(){
  if(keyCode===13 && gameOver){
    spawnInterval=800;
    resetGame();
  }
}
function mousePressed(){
  if(!gameOver){
    shoot();
  }
}
