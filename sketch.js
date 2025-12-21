let player;
let bullets;
let enemies;
let particles;
let stars;
let score;
let gameOver;
function createStar() {
  let s = {
    x: Math.floor(Math.random() * 400),
    y: Math.floor(Math.random() * 600),
    r: Math.random() * 2 + 1,
    vy: Math.random() * 1.5 + 0.5
  };
  return s;
}
function createBullet(x,y) {
  let b = {
    x: x,
    y: y,
    r: 4,
    vy: -8
  };
  return b;
}
function createEnemy() {
  let e = {
    r: 12,
    x: Math.floor(Math.random() * (400 - 24)) + 12,
    y: -12,
    vy: 2
  };
  return e;
}
function createParticle(x,y) {
  let angle = Math.random() * Math.PI * 2;
  let speed = Math.random() * 2 + 1;
  let p = {
    x: x,
    y: y,
    r: 3,
    vx: Math.cos(angle) * speed,
    vy: Math.sin(angle) * speed,
    life: 20
  };
  return p;
}
function setup() {
  createCanvas(400,600);
  player = {
    x: width / 2,
    y: height - 30,
    r: 12,
    speed: 5
  };
  bullets = [];
  enemies = [];
  particles = [];
  stars = [];
  score = 0;
  gameOver = false;
  for (let i = 0; i < 30; i++) {
    stars.push(createStar());
  }
  textSize(18);
  textAlign(LEFT, TOP);
  noStroke();
}
function draw() {
  background(0);
  fill(255);
  for (let i = 0; i < stars.length; i++) {
    let s = stars[i];
    ellipse(s.x, s.y, s.r * 2, s.r * 2);
    s.y += s.vy;
    if (s.y - s.r > height) {
      s.y = -s.r;
      s.x = Math.floor(Math.random() * width);
    }
  }
  if (!gameOver) {
    if (keyIsDown(LEFT_ARROW)) {
      player.x -= player.speed;
    }
    if (keyIsDown(RIGHT_ARROW)) {
      player.x += player.speed;
    }
    if (player.x - player.r < 0) {
      player.x = player.r;
    }
    if (player.x + player.r > width) {
      player.x = width - player.r;
    }
  }
  fill(0, 150, 255);
  triangle(player.x, player.y - player.r, player.x - player.r, player.y + player.r, player.x + player.r, player.y + player.r);
  if (!gameOver && frameCount % 60 === 0) {
    enemies.push(createEnemy());
  }
  for (let i = bullets.length - 1; i >= 0; i--) {
    let b = bullets[i];
    b.y += b.vy;
    fill(255, 255, 0);
    ellipse(b.x, b.y, b.r * 2, b.r * 2);
    if (b.y + b.r < 0) {
      bullets.splice(i, 1);
    }
  }
  for (let i = enemies.length - 1; i >= 0; i--) {
    let e = enemies[i];
    if (!gameOver) {
      e.y += e.vy;
    }
    fill(255, 0, 0);
    ellipse(e.x, e.y, e.r * 2, e.r * 2);
    if (!gameOver) {
      let d = dist(e.x, e.y, player.x, player.y);
      if (d <= e.r + player.r) {
        gameOver = true;
      }
    }
    for (let j = bullets.length - 1; j >= 0; j--) {
      let b = bullets[j];
      let dbe = dist(b.x, b.y, e.x, e.y);
      if (dbe <= b.r + e.r) {
        score += 1;
        for (let k = 0; k < 5; k++) {
          particles.push(createParticle(e.x, e.y));
        }
        bullets.splice(j, 1);
        enemies.splice(i, 1);
        break;
      }
    }
    if (i < enemies.length && e.y - e.r > height) {
      enemies.splice(i, 1);
    }
  }
  for (let i = particles.length - 1; i >= 0; i--) {
    let p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.life -= 1;
    fill(255, 150, 0, Math.max(0, p.life * 12));
    ellipse(p.x, p.y, p.r * 2, p.r * 2);
    if (p.life <= 0) {
      particles.splice(i, 1);
    }
  }
  fill(255);
  text("Score: " + score, 8, 8);
  if (gameOver) {
    fill(255, 0, 0);
    textAlign(CENTER, CENTER);
    textSize(32);
    text("GAME OVER", width / 2, height / 2 - 20);
    textSize(18);
    text("Press R to restart", width / 2, height / 2 + 20);
    textSize(18);
    textAlign(LEFT, TOP);
    if (keyIsDown(82)) {
      resetGame();
    }
  }
}
function keyPressed() {
  if (!gameOver && keyCode === 32) {
    bullets.push(createBullet(player.x, player.y - player.r));
  }
  if (gameOver && (keyCode === 82)) {
    resetGame();
  }
}
function resetGame() {
  player.x = width / 2;
  player.y = height - 30;
  bullets.length = 0;
  enemies.length = 0;
  particles.length = 0;
  score = 0;
  gameOver = false;
  stars.length = 0;
  for (let i = 0; i < 30; i++) {
    stars.push(createStar());
  }
}
