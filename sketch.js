let player;
let playerRadius = 16;
let playerSpeed = 5;
let bullets = [];
let bulletRadius = 4;
let bulletSpeed = 8;
let enemies = [];
let enemyRadius = 12;
let enemySpeed = 4;
let particles = [];
let particleRadius = 3;
let particleLife = 20;
let stars = [];
let starCount = 30;
let score = 0;
let gameOver = false;
let shootCooldown = 8;
let lastShotFrame = -1000;
function setup(){
  createCanvas(400,600);
  player = {x: width/2, y: height - 40};
  for(let i=0;i<starCount;i++){
    let s = {x: random(0,width), y: random(0,height), r: random(1,3), vy: random(0.5,2)};
    stars.push(s);
  }
}
function draw(){
  background(0);
  for(let i=0;i<stars.length;i++){
    let s = stars[i];
    fill(255);
    noStroke();
    ellipse(s.x,s.y,s.r);
    s.y += s.vy;
    if(s.y>height){
      s.y = random(-height,0);
      s.x = random(0,width);
      s.vy = random(0.5,2);
      s.r = random(1,3);
    }
  }
  if(!gameOver){
    if(keyIsDown(LEFT_ARROW)){
      player.x -= playerSpeed;
    }
    if(keyIsDown(RIGHT_ARROW)){
      player.x += playerSpeed;
    }
    player.x = constrain(player.x, playerRadius, width - playerRadius);
    if(keyIsDown(32) && frameCount - lastShotFrame >= shootCooldown){
      spawnBullet(player.x, player.y - playerRadius);
      lastShotFrame = frameCount;
    }
    if(frameCount % 60 === 0){
      for(let i=0;i<20;i++){
        spawnEnemy(random(enemyRadius, width-enemyRadius), random(-80,-10));
      }
    }
    for(let i=bullets.length-1;i>=0;i--){
      let b = bullets[i];
      b.y += b.vy;
      fill(255,200,0);
      noStroke();
      ellipse(b.x,b.y,b.r*2);
      if(b.y < -b.r){
        bullets.splice(i,1);
      }
    }
    for(let i=enemies.length-1;i>=0;i--){
      let e = enemies[i];
      e.y += e.vy;
      fill(200,50,50);
      noStroke();
      ellipse(e.x,e.y,e.r*2);
      if(e.y > height + e.r){
        enemies.splice(i,1);
      }
    }
    for(let i=enemies.length-1;i>=0;i--){
      for(let j=bullets.length-1;j>=0;j--){
        let e = enemies[i];
        let b = bullets[j];
        let d = dist(e.x,e.y,b.x,b.y);
        if(d <= e.r + b.r){
          spawnParticles(e.x,e.y);
          enemies.splice(i,1);
          bullets.splice(j,1);
          score += 1;
          break;
        }
      }
    }
    for(let i=enemies.length-1;i>=0;i--){
      let e = enemies[i];
      let d = dist(e.x,e.y,player.x,player.y);
      if(d <= e.r + playerRadius){
        gameOver = true;
        break;
      }
    }
    for(let i=particles.length-1;i>=0;i--){
      let p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life -= 1;
      let alpha = map(p.life,0,particleLife,0,255);
      fill(255,150,0,alpha);
      noStroke();
      ellipse(p.x,p.y,particleRadius*2);
      if(p.life <= 0){
        particles.splice(i,1);
      }
    }
  } else {
    for(let i=bullets.length-1;i>=0;i--){
      let b = bullets[i];
      fill(255,200,0);
      noStroke();
      ellipse(b.x,b.y,b.r*2);
      b.y += b.vy;
      if(b.y < -b.r){
        bullets.splice(i,1);
      }
    }
    for(let i=enemies.length-1;i>=0;i--){
      let e = enemies[i];
      fill(200,50,50);
      noStroke();
      ellipse(e.x,e.y,e.r*2);
    }
    for(let i=particles.length-1;i>=0;i--){
      let p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life -= 1;
      let alpha = map(p.life,0,particleLife,0,255);
      fill(255,150,0,alpha);
      noStroke();
      ellipse(p.x,p.y,particleRadius*2);
      if(p.life <= 0){
        particles.splice(i,1);
      }
    }
    fill(255,255,255);
    textSize(32);
    textAlign(CENTER,CENTER);
    text("GAME OVER", width/2, height/2);
  }
  fill(0,150,255);
  noStroke();
  triangle(player.x, player.y - playerRadius, player.x - playerRadius, player.y + playerRadius, player.x + playerRadius, player.y + playerRadius);
  fill(255);
  textSize(16);
  textAlign(LEFT,TOP);
  text("SCORE: " + score, 8, 8);
}
function spawnBullet(x,y){
  let b = {x:x, y:y, r:bulletRadius, vy:-bulletSpeed};
  bullets.push(b);
}
function spawnEnemy(x,y){
  let e = {x:x, y:y, r:enemyRadius, vy:enemySpeed};
  enemies.push(e);
}
function spawnParticles(x,y){
  for(let i=0;i<5;i++){
    let angle = random(0, TWO_PI);
    let speed = random(1,3);
    let p = {x:x, y:y, vx:cos(angle)*speed, vy:sin(angle)*speed, life:particleLife};
    particles.push(p);
  }
}
