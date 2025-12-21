let player;
let playerRadius = 14;
let moveSpeed = 5;
let bullets = [];
let bulletRadius = 4;
let bulletSpeed = 8;
let enemies = [];
let enemyRadius = 12;
let enemySpeed = 2;
let particles = [];
let particleRadius = 3;
let particleLife = 20;
let stars = [];
let starCount = 30;
let score = 0;
let gameOver = false;
let lastShotFrame = -100;

function setup(){
  createCanvas(400,600);
  player = {x: width/2, y: height - 40};
  for(let i=0;i<starCount;i++){
    let s = {x: random(0,width), y: random(0,height), vy: random(0.5,2)};
    stars.push(s);
  }
  textFont('Arial');
}

function draw(){
  background(0);
  fill(255);
  noStroke();
  for(let i=0;i<stars.length;i++){
    let s = stars[i];
    ellipse(s.x, s.y, 2, 2);
    s.y += s.vy;
    if(s.y > height){
      s.y = 0;
      s.x = random(0,width);
      s.vy = random(0.5,2);
    }
  }
  if(!gameOver){
    if(keyIsDown(LEFT_ARROW)){
      player.x -= moveSpeed;
    }
    if(keyIsDown(RIGHT_ARROW)){
      player.x += moveSpeed;
    }
    if(player.x < playerRadius){
      player.x = playerRadius;
    }
    if(player.x > width - playerRadius){
      player.x = width - playerRadius;
    }
    if(keyIsDown(32) && frameCount - lastShotFrame >= 10){
      let b = {x: player.x, y: player.y - playerRadius, vy: -bulletSpeed, r: bulletRadius};
      bullets.push(b);
      lastShotFrame = frameCount;
    }
    for(let i=bullets.length-1;i>=0;i--){
      let b = bullets[i];
      b.y += b.vy;
      if(b.y < -b.r){
        bullets.splice(i,1);
      }
    }
    if(frameCount % 60 === 0){
      let ex = random(enemyRadius, width - enemyRadius);
      let ey = -enemyRadius;
      let e = {x: ex, y: ey, vy: enemySpeed, r: enemyRadius};
      enemies.push(e);
    }
    for(let i=enemies.length-1;i>=0;i--){
      let e = enemies[i];
      e.y += e.vy;
      if(e.y > height + e.r){
        enemies.splice(i,1);
      }
    }
    for(let ei=enemies.length-1;ei>=0;ei--){
      let e = enemies[ei];
      let hit = false;
      for(let bi=bullets.length-1;bi>=0;bi--){
        let b = bullets[bi];
        let dx = e.x - b.x;
        let dy = e.y - b.y;
        let d2 = dx*dx + dy*dy;
        let rsum = e.r + b.r;
        if(d2 <= rsum*rsum){
          for(let k=0;k<5;k++){
            let angle = random(0, TWO_PI);
            let speed = random(1,3);
            let pvx = cos(angle)*speed;
            let pvy = sin(angle)*speed;
            let p = {x: e.x, y: e.y, vx: pvx, vy: pvy, r: particleRadius, life: particleLife};
            particles.push(p);
          }
          bullets.splice(bi,1);
          enemies.splice(ei,1);
          score += 1;
          hit = true;
          break;
        }
      }
      if(hit){
        continue;
      }
    }
    for(let i=enemies.length-1;i>=0;i--){
      let e = enemies[i];
      let dx = e.x - player.x;
      let dy = e.y - player.y;
      let d2 = dx*dx + dy*dy;
      let rsum = e.r + playerRadius;
      if(d2 <= rsum*rsum){
        gameOver = true;
        break;
      }
    }
  }
  for(let i=particles.length-1;i>=0;i--){
    let p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.life -= 1;
    if(p.life <= 0){
      particles.splice(i,1);
    }
  }
  noStroke();
  fill(0,150,255);
  ellipse(player.x, player.y, playerRadius*2, playerRadius*2);
  fill(255);
  for(let i=0;i<bullets.length;i++){
    let b = bullets[i];
    ellipse(b.x, b.y, b.r*2, b.r*2);
  }
  fill(255,50,50);
  for(let i=0;i<enemies.length;i++){
    let e = enemies[i];
    ellipse(e.x, e.y, e.r*2, e.r*2);
  }
  for(let i=0;i<particles.length;i++){
    let p = particles[i];
    let alpha = map(p.life, 0, particleLife, 0, 255);
    fill(255,170,0, alpha);
    ellipse(p.x, p.y, p.r*2, p.r*2);
  }
  fill(255);
  textSize(20);
  textAlign(LEFT, TOP);
  text('Score: ' + score, 10, 10);
  if(gameOver){
    textSize(36);
    textAlign(CENTER, CENTER);
    text('GAME OVER', width/2, height/2);
  }
}
