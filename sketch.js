let player;
let bullets = [];
let enemies = [];
let particles = [];
let stars = [];
let score = 0;
let gameOver = false;
let spacePrev = false;
function setup(){
  createCanvas(400,600);
  player = {x: width/2, y: height - 30, speed: 5, r: 14};
  for(let i=0;i<30;i++){
    let s = {x: random(0,width), y: random(0,height), speed: random(0.5,2.5), r: random(1,3)};
    stars.push(s);
  }
  textSize(18);
  textAlign(LEFT, TOP);
}
function draw(){
  background(0);
  noStroke();
  fill(255);
  for(let i=0;i<stars.length;i++){
    let s = stars[i];
    circle(s.x, s.y, s.r);
    s.y += s.speed;
    if(s.y > height){
      s.y = -random(10,60);
      s.x = random(0,width);
    }
  }
  if(!gameOver){
    if(keyIsDown(LEFT_ARROW)){
      player.x -= player.speed;
    }
    if(keyIsDown(RIGHT_ARROW)){
      player.x += player.speed;
    }
    if(player.x < player.r){
      player.x = player.r;
    }
    if(player.x > width - player.r){
      player.x = width - player.r;
    }
    let spaceDown = keyIsDown(32);
    if(spaceDown && !spacePrev){
      let b = {x: player.x, y: player.y - player.r, r: 4, speed: 8};
      bullets.push(b);
    }
    spacePrev = spaceDown;
    if(frameCount % 60 === 0){
      let ex = random(12, width-12);
      let e = {x: ex, y: -12, r: 12, speed: 2};
      enemies.push(e);
    }
    for(let i=bullets.length-1;i>=0;i--){
      let b = bullets[i];
      b.y -= b.speed;
      if(b.y < -b.r){
        bullets.splice(i,1);
      }
    }
    for(let i=enemies.length-1;i>=0;i--){
      let e = enemies[i];
      e.y += e.speed;
      if(dist(e.x,e.y,player.x,player.y) <= e.r + player.r){
        gameOver = true;
        break;
      }
      let collided = false;
      for(let j=bullets.length-1;j>=0;j--){
        let b = bullets[j];
        if(dist(e.x,e.y,b.x,b.y) <= e.r + b.r){
          for(let k=0;k<5;k++){
            let angle = random(0, TWO_PI);
            let speed = random(1,3);
            let p = {x: e.x, y: e.y, vx: cos(angle)*speed, vy: sin(angle)*speed, r: 3, life: 20};
            particles.push(p);
          }
          score += 1;
          bullets.splice(j,1);
          enemies.splice(i,1);
          collided = true;
          break;
        }
      }
      if(collided) continue;
      if(e.y - e.r > height){
        enemies.splice(i,1);
      }
    }
  } else {
    spacePrev = false;
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
  fill(0,0,255);
  circle(player.x, player.y, player.r*2);
  fill(255,255,0);
  for(let i=0;i<bullets.length;i++){
    let b = bullets[i];
    circle(b.x, b.y, b.r*2);
  }
  fill(255,0,0);
  for(let i=0;i<enemies.length;i++){
    let e = enemies[i];
    circle(e.x, e.y, e.r*2);
  }
  for(let i=0;i<particles.length;i++){
    let p = particles[i];
    let alpha = map(p.life,0,20,0,255);
    fill(255,150,0,alpha);
    circle(p.x, p.y, p.r*2);
  }
  fill(255);
  text("Score: " + score, 10, 10);
  if(gameOver){
    textAlign(CENTER, CENTER);
    textSize(36);
    fill(255,0,0);
    text("GAME OVER", width/2, height/2 - 20);
    textSize(18);
    fill(255);
    text("Final: " + score, width/2, height/2 + 20);
    textSize(18);
    textAlign(LEFT, TOP);
  }
}
