let player;
let bullets = [];
let enemies = [];
let particles = [];
let stars = [];
let score = 0;
let gameOver = false;
function createPlayer() {
  return { x: 200, y: 600 - 30, r: 16, speed: 5 };
}
function createStar() {
  return { x: Math.random() * 400, y: Math.random() * 600, vy: 1 + Math.random() * 2, s: 1 + Math.random() * 2 };
}
function createBullet(x, y) {
  return { x: x, y: y, r: 4, vy: -8 };
}
function createEnemy() {
  return { x: 12 + Math.random() * (400 - 24), y: -12, r: 12, vy: 2 };
}
function createParticle(x, y) {
  let angle = Math.random() * Math.PI * 2;
  let speed = 1 + Math.random() * 2;
  return { x: x, y: y, dx: Math.cos(angle) * speed, dy: Math.sin(angle) * speed, r: 3, life: 20 };
}
function setup() {
  createCanvas(400, 600);
  player = createPlayer();
  for (let i = 0; i < 30; i++) {
    stars.push(createStar());
  }
  textSize(18);
  textAlign(LEFT, TOP);
}
function draw() {
  background(0);
  for (let i = 0; i < stars.length; i++) {
    let s = stars[i];
    s.y += s.vy;
    fill(255);
    noStroke();
    circle(s.x, s.y, s.s);
    if (s.y > height) {
      s.y = -s.s;
      s.x = Math.random() * width;
      s.vy = 1 + Math.random() * 2;
    }
  }
  if (!gameOver) {
    if (keyIsDown(LEFT_ARROW)) {
      player.x -= player.speed;
    }
    if (keyIsDown(RIGHT_ARROW)) {
      player.x += player.speed;
    }
    player.x = constrain(player.x, player.r, width - player.r);
    if (frameCount % 60 === 0) {
      enemies.push(createEnemy());
    }
    for (let i = bullets.length - 1; i >= 0; i--) {
      let b = bullets[i];
      b.y += b.vy;
      if (b.y < -b.r) {
        bullets.splice(i, 1);
      }
    }
    for (let i = enemies.length - 1; i >= 0; i--) {
      let e = enemies[i];
      e.y += e.vy;
      if (e.y - e.r > height) {
        enemies.splice(i, 1);
        continue;
      }
      for (let j = bullets.length - 1; j >= 0; j--) {
        let b = bullets[j];
        let d = dist(e.x, e.y, b.x, b.y);
        if (d <= e.r + b.r) {
          for (let k = 0; k < 5; k++) {
            particles.push(createParticle(e.x, e.y));
          }
          enemies.splice(i, 1);
          bullets.splice(j, 1);
          score += 1;
          break;
        }
      }
    }
    for (let i = enemies.length - 1; i >= 0; i--) {
      let e = enemies[i];
      let d = dist(e.x, e.y, player.x, player.y);
      if (d <= e.r + player.r) {
        gameOver = true;
      }
    }
    for (let i = particles.length - 1; i >= 0; i--) {
      let p = particles[i];
      p.x += p.dx;
      p.y += p.dy;
      p.life -= 1;
      if (p.life <= 0) {
        particles.splice(i, 1);
      }
    }
  } else {
    for (let i = particles.length - 1; i >= 0; i--) {
      let p = particles[i];
      p.x += p.dx;
      p.y += p.dy;
      p.life -= 1;
      if (p.life <= 0) {
        particles.splice(i, 1);
      }
    }
  }
  fill(0, 150, 255);
  noStroke();
  circle(player.x, player.y, player.r * 2);
  fill(255, 255, 0);
  for (let i = 0; i < bullets.length; i++) {
    let b = bullets[i];
    circle(b.x, b.y, b.r * 2);
  }
  fill(255, 0, 0);
  for (let i = 0; i < enemies.length; i++) {
    let e = enemies[i];
    circle(e.x, e.y, e.r * 2);
  }
  for (let i = 0; i < particles.length; i++) {
    let p = particles[i];
    fill(255, 150, 0, map(p.life, 0, 20, 0, 255));
    circle(p.x, p.y, p.r * 2);
  }
  fill(255);
  noStroke();
  text("Score: " + score, 8, 8);
  if (gameOver) {
    textAlign(CENTER, CENTER);
    textSize(36);
    fill(255, 0, 0);
    text("GAME OVER", width / 2, height / 2);
    textSize(18);
    textAlign(LEFT, TOP);
  }
}
function keyPressed() {
  if (!gameOver && keyCode === 32) {
    bullets.push(createBullet(player.x, player.y - player.r));
  }
  if (gameOver && keyCode === 82) {
    bullets = [];
    enemies = [];
    particles = [];
    stars = [];
    for (let i = 0; i < 30; i++) {
      stars.push(createStar());
    }
    score = 0;
    gameOver = false;
    player = createPlayer();
  }
}
