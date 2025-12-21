let player;
let bullets;
let enemies;
let particles;
let stars;
let score;
let gameOver;
let frameCounter;
function setup(){
  createCanvas(400,600);
  player = {x: width/2, y: height-40, r: 16, speed: 5};
  bullets = [];
  enemies = [];
  particles = [];
  stars = [];
  score = 0;
  gameOver = false;
  frameCounter = 0;
  for(let i=0;i<30;i++){
    let s = {x: random(0,width), y: random(0,height), r: random(1,3), speed: random(0.5,2)};
    stars.push(s);
  }
  textAlign(LEFT, TOP);
  textSize(18);
  noStroke();
}
function draw(){
  background(0);
  for(let i=0;i<stars.length;i++){
    let s = stars[i];
    fill(255);
    ellipse(s.x, s.y, s.r*2, s.r*2);
    s.y += s.speed;
    if(s.y > height){
      s.y = 0;
      s.x = random(0,width);
      s.r = random(1,3);
      s.speed = random(0.5,2);
    }
  }
  if(!gameOver){
    if(keyIsDown(LEFT_ARROW)){
      player.x -= player.speed;
    }
    if(keyIsDown(RIGHT_ARROW)){
      player.x += player.speed;
    }
    if(player.x < player.r) player.x = player.r;
    if(player.x > width - player.r) player.x = width - player.r;
    bullets.push({x: player.x, y: player.y - player.r, r: 4, speed: 20});
    frameCounter++;
    if(frameCounter % 10 === 0){
      for(let i=0;i<20;i++){
        let ex = random(12, width-12);
        let ey = -random(0,100);
        enemies.push({x: ex, y: ey, r: 12, speed: 4});
      }
    }
  }
  for(let i=bullets.length-1;i>=0;i--){
    let b = bullets[i];
    b.y -= b.speed;
    fill(255,200,0);
    ellipse(b.x, b.y, b.r*2, b.r*2);
    if(b.y < -b.r){
      bullets.splice(i,1);
    }
  }
  for(let i=enemies.length-1;i>=0;i--){
    let e = enemies[i];
    e.y += e.speed;
    fill(200,50,50);
    ellipse(e.x, e.y, e.r*2, e.r*2);
    if(e.y > height + e.r){
      enemies.splice(i,1);
      continue;
    }
    if(!gameOver){
      for(let j=bullets.length-1;j>=0;j--){
        let b = bullets[j];
        let d = dist(e.x,e.y,b.x,b.y);
        if(d <= e.r + b.r){
          for(let k=0;k<5;k++){
            let angle = random(0,Math.PI*2);
            let speed = random(1,4);
            let vx = Math.cos(angle)*speed;
            let vy = Math.sin(angle)*speed;
            particles.push({x: e.x, y: e.y, vx: vx, vy: vy, r: 3, life: 20});
          }
          enemies.splice(i,1);
          bullets.splice(j,1);
          score += 1;
          break;
        }
      }
    }
    if(!gameOver){
      let dplayer = dist(e.x,e.y,player.x,player.y);
      if(dplayer <= e.r + player.r){
        gameOver = true;
      }
    }
  }
  for(let i=particles.length-1;i>=0;i--){
    let p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.life -= 1;
    let alpha = map(p.life,0,20,0,255);
    fill(255,150,0,alpha);
    ellipse(p.x, p.y, p.r*2, p.r*2);
    if(p.life <= 0){
      particles.splice(i,1);
    }
  }
  fill(0,255,0);
  ellipse(player.x, player.y, player.r*2, player.r*2);
  fill(255);
  text("Score: " + score, 10, 10);
  if(gameOver){
    fill(255,0,0);
    textSize(36);
    textAlign(CENTER, CENTER);
    text("GAME OVER", width/2, height/2);
    textSize(18);
    textAlign(LEFT, TOP);
  }
}
