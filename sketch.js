let player;
let enemy;
let projectiles = [];
let particles = [];
let keys = {left:false,right:false};
let gameOver = false;
function setup(){
createCanvas(500,500);
player = {x:5,y:250,r:5,life:3,speed:5};
enemy = {x:500-5,y:250,r:5,life:3,dir:-1,speed:5,attackCooldown:0,detectRadius:3,attackRange:5};
}
function draw(){
background(120,200,100);
noStroke();
fill(80,180,70);
rect(0,300,500,200);
fill(40,160,60,80);
for(let i=0;i<50;i++){
let bx = (i*10+frameCount%10);
rect(bx%500,300,2,20);
}
if(!gameOver){
if(keys.left){player.x -= player.speed;}
if(keys.right){player.x += player.speed;}
player.x = constrain(player.x, player.r, width - player.r);
for(let i=projectiles.length-1;i>=0;i--){
let p = projectiles[i];
p.x += p.vx;
if(p.x > width + p.r){ projectiles.splice(i,1); continue;}
let dx = p.x - enemy.x;
let dy = p.y - enemy.y;
let dist = sqrt(dx*dx+dy*dy);
if(dist <= p.r + enemy.r && enemy.life>0){
enemy.life -= 1;
projectiles.splice(i,1);
if(enemy.life<=0){
for(let k=0;k<5;k++){
let angle = (TWO_PI/5)*k;
let speed = 2 + k*0.2;
particles.push({x:enemy.x,y:enemy.y,vx:cos(angle)*speed,vy:sin(angle)*speed,r:3,life:20});
}
gameOver = (player.life<=0);
}
}
}
enemy.x += enemy.dir * enemy.speed;
if(enemy.x < enemy.r || enemy.x > width - enemy.r){ enemy.dir *= -1; enemy.x = constrain(enemy.x, enemy.r, width - enemy.r);} 
if(enemy.attackCooldown>0){ enemy.attackCooldown -= 1; }
let dxp = player.x - enemy.x;
let dyp = player.y - enemy.y;
let distpe = sqrt(dxp*dxp + dyp*dyp);
if(distpe <= enemy.detectRadius){
if(enemy.attackCooldown<=0 && player.life>0){
player.life -= 1;
enemy.attackCooldown = 30;
if(player.life<=0){ gameOver = true; }
}
}
for(let i=particles.length-1;i>=0;i--){
let q = particles[i];
q.x += q.vx;
q.y += q.vy;
q.life -= 1;
if(q.life<=0){ particles.splice(i,1); }
}
if(enemy.life<=0){ noLoop(); }
if(player.life<=0){ noLoop(); }
}
fill(0);
ellipse(player.x,player.y,player.r*2,player.r*2);
if(enemy.life>0){ fill(150,0,0); ellipse(enemy.x,enemy.y,enemy.r*2,enemy.r*2); }
fill(255,200,0);
for(let i=0;i<projectiles.length;i++){ let p=projectiles[i]; ellipse(p.x,p.y,p.r*2,p.r*2); }
fill(255,100,0);
for(let i=0;i<particles.length;i++){ let q=particles[i]; ellipse(q.x,q.y,q.r*2,q.r*2); }
fill(0);
textSize(16);
text('P:'+player.life,10,20);
text('E:'+ (enemy.life>0?enemy.life:0), width-50,20);
if(player.life<=0){ textSize(32); text('GEAM OVER', width/2-80, height/2); }
if(enemy.life<=0){ textSize(32); text('CLEAR', width/2-40, height/2); }
}
function keyPressed(){
if(keyCode===LEFT_ARROW){ keys.left=true;}
if(keyCode===RIGHT_ARROW){ keys.right=true;}
if(key===' '){
if(!gameOver && enemy.life>0 && player.life>0){
projectiles.push({x:player.x+player.r+1,y:player.y,r:5,vx:8});
}
}
}
function keyReleased(){
if(keyCode===LEFT_ARROW){ keys.left=false;}
if(keyCode===RIGHT_ARROW){ keys.right=false;}
}
