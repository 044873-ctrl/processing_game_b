let stars=[];
let bullets=[];
let enemies=[];
let particles=[];
let score=0;
let gameOver=false;
let player={x:0,y:0,r:14};
let playerSpeed=5;
let lastShotFrame=0;
let shotCooldown=10;
let enemySpawnInterval=60;
let starCount=30;
function spawnBullet(){
  let b={x:player.x,y:player.y-player.r-4,r:4,speed:8};
  bullets.push(b);
}
function spawnEnemy(){
  let ex=random(12,width-12);
  let ey=-12;
  let e={x:ex,y:ey,r:12,speed:2};
  enemies.push(e);
}
function spawnParticles(px,py){
  for(let i=0;i<5;i++){
    let angle=random(0,Math.PI*2);
    let speed=random(1,4);
    let p={x:px,y:py,r:3,vx:Math.cos(angle)*speed,vy:Math.sin(angle)*speed,life:20};
    particles.push(p);
  }
}
function setup(){
  createCanvas(400,600);
  player.x=width/2;
  player.y=height-40;
  player.r=14;
  for(let i=0;i<starCount;i++){
    let s={x:random(0,width),y:random(0,height),speed:random(0.5,2),size:random(1,3)};
    stars.push(s);
  }
  score=0;
  gameOver=false;
  bullets=[];
  enemies=[];
  particles=[];
  lastShotFrame=0;
}
function draw(){
  background(0);
  noStroke();
  fill(255);
  for(let i=stars.length-1;i>=0;i--){
    let s=stars[i];
    s.y+=s.speed;
    if(s.y>height+2){
      s.y=random(-height,0);
      s.x=random(0,width);
      s.speed=random(0.5,2);
      s.size=random(1,3);
    }
    ellipse(s.x,s.y,s.size,s.size);
  }
  if(!gameOver){
    if(keyIsDown(LEFT_ARROW)){
      player.x-=playerSpeed;
    }
    if(keyIsDown(RIGHT_ARROW)){
      player.x+=playerSpeed;
    }
    player.x=constrain(player.x,player.r,width-player.r);
    if(keyIsDown(32) && frameCount-lastShotFrame>=shotCooldown){
      spawnBullet();
      lastShotFrame=frameCount;
    }
    if(frameCount%enemySpawnInterval===0){
      spawnEnemy();
    }
    for(let i=bullets.length-1;i>=0;i--){
      let b=bullets[i];
      b.y-=b.speed;
      if(b.y<-b.r){
        bullets.splice(i,1);
      }
    }
    for(let i=enemies.length-1;i>=0;i--){
      let e=enemies[i];
      e.y+=e.speed;
      if(e.y>height+e.r){
        enemies.splice(i,1);
      }
    }
    for(let i=enemies.length-1;i>=0;i--){
      let e=enemies[i];
      for(let j=bullets.length-1;j>=0;j--){
        let b=bullets[j];
        let d=dist(e.x,e.y,b.x,b.y);
        if(d<e.r+b.r){
          spawnParticles(e.x,e.y);
          enemies.splice(i,1);
          bullets.splice(j,1);
          score+=10;
          break;
        }
      }
    }
    for(let i=enemies.length-1;i>=0;i--){
      let e=enemies[i];
      let d=dist(e.x,e.y,player.x,player.y);
      if(d<e.r+player.r){
        gameOver=true;
      }
    }
  }
  fill(0,0,255);
  triangle(player.x,player.y-player.r,player.x-player.r,player.y+player.r,player.x+player.r,player.y+player.r);
  fill(255,255,0);
  for(let i=0;i<bullets.length;i++){
    let b=bullets[i];
    ellipse(b.x,b.y,b.r*2,b.r*2);
  }
  fill(255,0,0);
  for(let i=0;i<enemies.length;i++){
    let e=enemies[i];
    ellipse(e.x,e.y,e.r*2,e.r*2);
  }
  for(let i=particles.length-1;i>=0;i--){
    let p=particles[i];
    p.x+=p.vx;
    p.y+=p.vy;
    p.life--;
    let alpha=map(p.life,0,20,0,255);
    if(alpha<0){alpha=0;}
    fill(255,150,0,alpha);
    ellipse(p.x,p.y,p.r*2,p.r*2);
    if(p.life<=0){
      particles.splice(i,1);
    }
  }
  fill(255);
  textSize(16);
  textAlign(LEFT,TOP);
  text("Score: "+score,8,8);
  if(gameOver){
    textSize(32);
    textAlign(CENTER,CENTER);
    fill(255,0,0);
    text("Game Over",width/2,height/2);
  }
}
