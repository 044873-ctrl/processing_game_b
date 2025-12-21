let player;
let bullets;
let enemies;
let particles;
let stars;
let score;
let frames;
let gameOver;
const PLAYER_SPEED = 5;
const PLAYER_R = 14;
const BULLET_R = 7;
const BULLET_SPEED = 8;
const ENEMY_R = 12;
const ENEMY_SPEED = 2;
const PARTICLE_R = 3;
const PARTICLE_LIFE = 20;
const STAR_COUNT = 30;
function spawnEnemy() {
  let x = Math.floor(Math.random() * (width - ENEMY_R * 2)) + ENEMY_R;
  let y = -ENEMY_R;
  let enemy = { x: x, y: y, r: ENEMY_R, vy: ENEMY_SPEED };
  enemies.push(enemy);
}
function spawnParticles(px, py) {
  for (let i = 0; i < 5; i++) {
    let angle = Math.random() * Math.PI * 2;
    let speed = Math.random() * 2 + 1;
    let vx = Math.cos(angle) * speed;
    let vy = Math.sin(angle) * speed;
    let p = { x: px, y: py, vx: vx, vy: vy, r: PARTICLE_R, life: PARTICLE_LIFE };
    particles.push(p);
  }
}
function updateBullets() {
  for (let i = bullets.length - 1; i >= 0; i--) {
    let b = bullets[i];
    b.y += b.vy;
    if (b.y + b.r < 0) {
      bullets.splice(i, 1);
    }
  }
}
function updateEnemies() {
  for (let i = enemies.length - 1; i >= 0; i--) {
    let e = enemies[i];
    e.y += e.vy;
    if (e.y - e.r > height) {
      enemies.splice(i, 1);
    }
  }
}
function updateParticles() {
  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.life -= 1;
    if (p.life <= 0) {
      particles.splice(i, 1);
    }
  }
}
function updateStars() {
  for (let i = 0; i < stars.length; i++) {
    let s = stars[i];
    s.y += s.vy;
    if (s.y > height) {
      s.y = 0;
      s.x = Math.random() * width;
    }
  }
}
function checkBulletEnemyCollisions() {
  for (let i = enemies.length - 1; i >= 0; i--) {
    for (let j = bullets.length - 1; j >= 0; j--) {
      let e = enemies[i];
      let b = bullets[j];
      let dx = e.x - b.x;
      let dy = e.y - b.y;
      let dist2 = dx * dx + dy * dy;
      let minDist = e.r + b.r;
      if (dist2 <= minDist * minDist) {
        spawnParticles(e.x, e.y);
        enemies.splice(i, 1);
        bullets.splice(j, 1);
        score += 1;
        break;
      }
    }
  }
}
function checkPlayerEnemyCollision() {
  for (let i = 0; i < enemies.length; i++) {
    let e = enemies[i];
    let dx = e.x - player.x;
    let dy = e.y - player.y;
    let dist2 = dx * dx + dy * dy;
    let minDist = e.r + player.r;
    if (dist2 <= minDist * minDist) {
      gameOver = true;
      return;
    }
  }
}
function drawPlayer() {
  fill(0, 150, 255);
  noStroke();
  ellipse(player.x, player.y, player.r * 2, player.r * 2);
}
function drawBullets() {
  fill(255, 255, 0);
  noStroke();
  for (let i = 0; i < bullets.length; i++) {
    let b = bullets[i];
    ellipse(b.x, b.y, b.r * 2, b.r * 2);
  }
}
function drawEnemies() {
  fill(255, 80, 80);
  noStroke();
  for (let i = 0; i < enemies.length; i++) {
    let e = enemies[i];
    ellipse(e.x, e.y, e.r * 2, e.r * 2);
  }
}
function drawParticles() {
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    let alpha = Math.max(0, Math.floor((p.life / PARTICLE_LIFE) * 255));
    fill(255, 200, 50, alpha);
    noStroke();
    ellipse(p.x, p.y, p.r * 2, p.r * 2);
  }
}
function drawStars() {
  fill(255);
  noStroke();
  for (let i = 0; i < stars.length; i++) {
    let s = stars[i];
    ellipse(s.x, s.y, s.r * 2, s.r * 2);
  }
}
function drawUI() {
  fill(255);
  textSize(18);
  textAlign(LEFT, TOP);
  text("Score: " + score, 8, 8);
  if (gameOver) {
    textSize(36);
    textAlign(CENTER, CENTER);
    text("GAME OVER", width / 2, height / 2);
  }
}
function setup() {
  createCanvas(400, 600);
  player = { x: width / 2, y: height - 40, r: PLAYER_R, speed: PLAYER_SPEED };
  bullets = [];
  enemies = [];
  particles = [];
  stars = [];
  score = 0;
  frames = 0;
  gameOver = false;
  for (let i = 0; i < STAR_COUNT; i++) {
    let sx = Math.random() * width;
    let sy = Math.random() * height;
    let sr = Math.random() * 2 + 1;
    let sv = Math.random() * 1.5 + 0.5;
    stars.push({ x: sx, y: sy, r: sr, vy: sv });
  }
}
function draw() {
  background(0);
  drawStars();
  if (!gameOver) {
    frames += 1;
    updateStars();
    if (keyIsDown(LEFT_ARROW) || keyIsDown(65)) {
      player.x -= player.speed;
    }
    if (keyIsDown(RIGHT_ARROW) || keyIsDown(68)) {
      player.x += player.speed;
    }
    if (player.x - player.r < 0) {
      player.x = player.r;
    }
    if (player.x + player.r > width) {
      player.x = width - player.r;
    }
    if (frames % 60 === 0) {
      spawnEnemy();
    }
    updateBullets();
    updateEnemies();
    checkBulletEnemyCollisions();
    updateParticles();
    checkPlayerEnemyCollision();
  }
  drawParticles();
  drawBullets();
  drawEnemies();
  drawPlayer();
  drawUI();
}
function keyPressed() {
  if (keyCode === 32 && !gameOver) {
    let bx = player.x;
    let by = player.y - player.r - BULLET_R;
    let b = { x: bx, y: by, r: BULLET_R, vy: -BULLET_SPEED };
    bullets.push(b);
  }
}
