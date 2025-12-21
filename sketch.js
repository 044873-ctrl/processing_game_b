let player;
let bullets = [];
let enemies = [];
let particles = [];
let stars = [];
let score = 0;
let gameOver = false;
function setup(){
  createCanvas(400,600);
  player = {x: width/2, y: height-40, r: 14, speed: 5};
  for(let i=0;i<30;i++){
    let s = {x: random(0,width), y: random(0,height), vy: random(0.5,1.5), sz: random(1,3)};
    stars.push(s);
  }
  score = 0;
  gameOver = false;
  bullets = [];
  enemies = [];
  particles = [];
  noStroke();
  textAlign(LEFT,TOP);
  textSize(16);
}
function draw(){
  background(0);
  fill(255);
  for(let i=0;i<stars.length;i++){
    let s = stars[i];
    s.y += s.vy;
    if(s.y > height + s.sz){
      s.y = -s.sz;
      s.x = random(0,width);
    }
    ellipse(s.x, s.y, s.sz, s.sz);
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
  }
  for(let i=bullets.length-1;i>=0;i--){
    let b = bullets[i];
    b.y += b.vy;
    if(b.y < -b.r){
      bullets.splice(i,1);
      continue;
    }
    fill(255,200,0);
    ellipse(b.x,b.y,b.r*2,b.r*2);
  }
  if(!gameOver){
    if(frameCount % 60 === 0){
      let er = 12;
      let ex = random(er, width - er);
      let ey = -er;
      enemies.push({x: ex, y: ey, r: er, vy: 2});
    }
  }
  for(let i=enemies.length-1;i>=0;i--){
    let e = enemies[i];
    e.y += e.vy;
    if(e.y > height + e.r){
      enemies.splice(i,1);
      continue;
    }
    fill(200,50,50);
    ellipse(e.x,e.y,e.r*2,e.r*2);
  }
  for(let i=enemies.length-1;i>=0;i--){
    let e = enemies[i];
    for(let j=bullets.length-1;j>=0;j--){
      let b = bullets[j];
      let dx = e.x - b.x;
      let dy = e.y - b.y;
      let dist2 = dx*dx + dy*dy;
      let rr = e.r + b.r;
      if(dist2 <= rr*rr){
        for(let k=0;k<5;k++){
          let angle = random(0, TWO_PI);
          let speed = random(1,3);
          let vx = cos(angle)*speed;
          let vy = sin(angle)*speed;
          particles.push({x: e.x, y: e.y, r: 3, vx: vx, vy: vy, life: 20});
        }
        score += 1;
        enemies.splice(i,1);
        bullets.splice(j,1);
        break;
      }
    }
  }
  for(let i=particles.length-1;i>=0;i--){
    let p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.life--;
    if(p.life <= 0){
      particles.splice(i,1);
      continue;
    }
    let alpha = map(p.life,0,20,0,255);
    fill(255,150,0,alpha);
    ellipse(p.x,p.y,p.r*2,p.r*2);
  }
  for(let i=enemies.length-1;i>=0;i--){
    let e = enemies[i];
    let dx = e.x - player.x;
    let dy = e.y - player.y;
    let dist2 = dx*dx + dy*dy;
    let rr = e.r + player.r;
    if(dist2 <= rr*rr){
      gameOver = true;
      break;
    }
  }
  fill(0,150,255);
  triangle(player.x, player.y - player.r, player.x - player.r, player.y + player.r, player.x + player.r, player.y + player.r);
  fill(255);
  text("Score: " + score, 8, 8);
  if(gameOver){
    fill(255,0,0);
    textAlign(CENTER,CENTER);
    textSize(32);
    text("GAME OVER", width/2, height/2);
    textSize(16);
    textAlign(LEFT,TOP);
  }
}
function keyPressed(){
  if(!gameOver && keyCode === 32){
    let b = {x: player.x, y: player.y - player.r, r: 4, vy: -8};
    bullets.push(b);
  }
  if(gameOver && (key === 'r' || key === 'R')){
    setup();
  }
}
