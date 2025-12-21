const GRAVITY = 0.6;
const MAX_FALL_SPEED = 20;
const MOVE_SPEED = 4;
const JUMP_FORCE = 12;
const CANVAS_W = 800;
const CANVAS_H = 480;
let player = {
  x: 100,
  y: 300,
  w: 32,
  h: 48,
  vx: 0,
  vy: 0,
  onGround: false,
  spawnX: 100,
  spawnY: 300,
  invincible: 0
};
let platforms = [];
let coins = [];
let enemies = [];
let goal = { x: 1600, y: 320, w: 48, h: 64 };
let camX = 0;
let score = 0;
let levelWidth = 2000;
function rectsCollide(a, b) {
  return a.x < b.x + b.w && a.x + a.w > b.x && a.y < b.y + b.h && a.y + a.h > b.y;
}
function resolvePlayerPlatformCollision(p, plat) {
  if (!rectsCollide(p, plat)) {
    return;
  }
  let pxCenter = p.x + p.w / 2;
  let pyCenter = p.y + p.h / 2;
  let platCenterX = plat.x + plat.w / 2;
  let platCenterY = plat.y + plat.h / 2;
  let dx = pxCenter - platCenterX;
  let dy = pyCenter - platCenterY;
  let combinedHalfW = p.w / 2 + plat.w / 2;
  let combinedHalfH = p.h / 2 + plat.h / 2;
  if (Math.abs(dx) < combinedHalfW && Math.abs(dy) < combinedHalfH) {
    let overlapX = combinedHalfW - Math.abs(dx);
    let overlapY = combinedHalfH - Math.abs(dy);
    if (overlapY < overlapX) {
      if (dy > 0) {
        p.y += overlapY;
        p.vy = 0;
      } else {
        p.y -= overlapY;
        p.vy = 0;
        p.onGround = true;
      }
    } else {
      if (dx > 0) {
        p.x += overlapX;
        p.vx = 0;
      } else {
        p.x -= overlapX;
        p.vx = 0;
      }
    }
  }
}
function createLevel() {
  platforms = [];
  platforms.push({ x: 0, y: 380, w: 600, h: 100 });
  platforms.push({ x: 700, y: 320, w: 200, h: 24 });
  platforms.push({ x: 980, y: 260, w: 160, h: 24 });
  platforms.push({ x: 1200, y: 340, w: 300, h: 24 });
  platforms.push({ x: 1500, y: 280, w: 120, h: 24 });
  platforms.push({ x: 1700, y: 360, w: 300, h: 120 });
  platforms.push({ x: 620, y: 420, w: 80, h: 60 });
  platforms.push({ x: 420, y: 300, w: 120, h: 16 });
  coins = [];
  let coinPositions = [
    { x: 140, y: 320 },
    { x: 460, y: 260 },
    { x: 740, y: 280 },
    { x: 1020, y: 220 },
    { x: 1240, y: 300 },
    { x: 1520, y: 240 },
    { x: 1760, y: 320 }
  ];
  for (let i = 0; i < coinPositions.length; i++) {
    let cp = coinPositions[i];
    coins.push({ x: cp.x, y: cp.y, r: 8 });
  }
  enemies = [];
  enemies.push({ x: 800, y: 288, w: 32, h: 32, vx: 1.2, left: 700, right: 900, dead: false });
  enemies.push({ x: 1260, y: 316, w: 32, h: 32, vx: 0.8, left: 1200, right: 1500, dead: false });
  enemies.push({ x: 1720, y: 328, w: 32, h: 32, vx: 1.0, left: 1700, right: 2000, dead: false });
  levelWidth = 2000;
  goal = { x: 1900, y: 216, w: 48, h: 96 };
}
function resetPlayer() {
  player.x = player.spawnX;
  player.y = player.spawnY;
  player.vx = 0;
  player.vy = 0;
  player.onGround = false;
  player.invincible = 90;
}
function handleInput() {
  player.vx = 0;
  if (keyIsDown(LEFT_ARROW)) {
    player.vx = -MOVE_SPEED;
  }
  if (keyIsDown(RIGHT_ARROW)) {
    player.vx = MOVE_SPEED;
  }
  if ((keyIsDown(38) || keyIsDown(32) || keyIsDown(87)) && player.onGround) {
    player.vy = -JUMP_FORCE;
    player.onGround = false;
  }
}
function playerUpdate() {
  handleInput();
  player.vy += GRAVITY;
  if (player.vy > MAX_FALL_SPEED) {
    player.vy = MAX_FALL_SPEED;
  }
  player.x += player.vx;
  player.y += player.vy;
  player.onGround = false;
  for (let i = 0; i < platforms.length; i++) {
    resolvePlayerPlatformCollision(player, platforms[i]);
  }
  if (player.y > CANVAS_H + 800) {
    resetPlayer();
  }
  if (player.invincible > 0) {
    player.invincible -= 1;
    if (player.invincible < 0) {
      player.invincible = 0;
    }
  }
}
function enemiesUpdate() {
  for (let i = 0; i < enemies.length; i++) {
    let e = enemies[i];
    if (e.dead) {
      continue;
    }
    e.x += e.vx;
    if (e.x < e.left) {
      e.x = e.left;
      e.vx = Math.abs(e.vx);
    }
    if (e.x + e.w > e.right) {
      e.x = e.right - e.w;
      e.vx = -Math.abs(e.vx);
    }
    e.y += 0;
    for (let j = 0; j < platforms.length; j++) {
      let plat = platforms[j];
      if (rectsCollide(e, plat)) {
        if (e.y + e.h <= plat.y + 8) {
          e.y = plat.y - e.h;
        }
      }
    }
  }
  for (let i = enemies.length - 1; i >= 0; i--) {
    if (enemies[i].dead) {
      enemies.splice(i, 1);
    }
  }
}
function coinsUpdate() {
  for (let i = coins.length - 1; i >= 0; i--) {
    let c = coins[i];
    let coinRect = { x: c.x - c.r, y: c.y - c.r, w: c.r * 2, h: c.r * 2 };
    if (rectsCollide(player, coinRect)) {
      coins.splice(i, 1);
      score += 1;
    }
  }
}
function handleCollisions() {
  for (let i = enemies.length - 1; i >= 0; i--) {
    let e = enemies[i];
    if (rectsCollide(player, e)) {
      if (player.vy > 0 && player.y + player.h - e.y < 20) {
        e.dead = true;
        player.vy = -JUMP_FORCE * 0.6;
      } else {
        if (player.invincible === 0) {
          resetPlayer();
        }
      }
    }
  }
  if (rectsCollide(player, goal)) {
    player.spawnX = 100;
    player.spawnY = 300;
    resetPlayer();
    createLevel();
    score = 0;
  }
}
function updateCamera() {
  let targetX = player.x + player.w / 2;
  camX = targetX - CANVAS_W / 2;
  if (camX < 0) {
    camX = 0;
  }
  if (camX > levelWidth - CANVAS_W) {
    camX = Math.max(0, levelWidth - CANVAS_W);
  }
}
function drawWorld() {
  fill(135, 206, 235);
  rect(camX, 0, CANVAS_W, CANVAS_H);
  noStroke();
  fill(100, 200, 100);
  rect(-1000, 380 + 100, levelWidth + 2000, CANVAS_H);
  for (let i = 0; i < platforms.length; i++) {
    let p = platforms[i];
    fill(120, 70, 20);
    rect(p.x, p.y, p.w, p.h);
  }
  for (let i = 0; i < coins.length; i++) {
    let c = coins[i];
    fill(255, 215, 0);
    ellipse(c.x, c.y, c.r * 2, c.r * 2);
  }
  for (let i = 0; i < enemies.length; i++) {
    let e = enemies[i];
    fill(180, 50, 50);
    rect(e.x, e.y, e.w, e.h);
  }
  fill(70, 130, 180);
  rect(goal.x, goal.y, goal.w, goal.h);
  if (player.invincible % 10 < 5) {
    fill(255, 255, 255);
  } else {
    fill(200, 0, 200);
  }
  rect(player.x, player.y, player.w, player.h);
}
function drawHUD() {
  resetMatrix();
  fill(0);
  textSize(16);
  text(
