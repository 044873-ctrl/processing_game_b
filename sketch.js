let player=null;
let obstacles=[];
let gravity=0;
let jumpForce=0;
let groundY=0;
let spawnTimer=0;
let spawnInterval=0;
let speed=0;
let score=0;
let highScore=0;
let gameOver=false;
function spawnObstacle(){let h=Math.floor(Math.random()*40)+20;let w=Math.floor(Math.random()*30)+20;let y=groundY-h;let x=width+w+10;let ob={x:x,y:y,w:w,h:h,passed:false};obstacles.push(ob)}
function updateObstacles(){for(let i=obstacles.length-1;i>=0;i--){let ob=obstacles[i];ob.x-=speed; if(ob.x+ob.w<0){obstacles.splice(i,1);continue} if(!ob.passed && ob.x+ob.w<player.x){ob.passed=true;score+=1; if(score>highScore){highScore=score}} if(checkCollision(player,ob)){gameOver=true}}}
function checkCollision(pl,ob){let plLeft=pl.x;let plRight=pl.x+pl.size;let plTop=pl.y;let plBottom=pl.y+pl.size;let obLeft=ob.x;let obRight=ob.x+ob.w;let obTop=ob.y;let obBottom=ob.y+ob.h;return !(plRight<obLeft||plLeft>obRight||plBottom<obTop||plTop>obBottom)}
function resetGame(){obstacles=[];score=0;spawnTimer=0;spawnInterval=90;speed=6;gameOver=false;player.y=groundY-player.size;player.vy=0;player.onGround=true;player.jumpsRemaining=2}
function keyPressed(){if(!gameOver){if(keyCode===32||keyCode===38){if(player.jumpsRemaining>0){player.vy=jumpForce;player.onGround=false;player.jumpsRemaining-=1}}}else{if(key==='r'||key==='R'){resetGame()}}}
function mousePressed(){if(!gameOver){if(player.jumpsRemaining>0){player.vy=jumpForce;player.onGround=false;player.jumpsRemaining-=1}}else{resetGame()}}
function setup(){createCanvas(640,360);groundY=height-50;gravity=1;jumpForce=-15;player={x:80,y:0,size:40,vy:0,onGround:true,jumpsRemaining:2};player.y=groundY-player.size;obstacles=[];spawnTimer=0;spawnInterval=90;speed=6;score=0;highScore=0;gameOver=false;textSize(20)}
function draw(){background(135,206,235);fill(80,200,120);rect(0,groundY,width,height-groundY);if(!gameOver){player.vy+=gravity;player.y+=player.vy;if(player.y>groundY-player.size){player.y=groundY-player.size;player.vy=0;player.onGround=true;player.jumpsRemaining=2}spawnTimer++;if(spawnTimer>=spawnInterval){spawnObstacle();spawnTimer=0;if(spawnInterval>40){spawnInterval-=1}speed+=0.01}updateObstacles()}fill(200);rect(player.x,player.y,player.size,player.size);for(let i=0;i<obstacles.length;i++){let ob=obstacles[i];fill(120,80,80);rect(ob.x,ob.y,ob.w,ob.h)}fill(0);text('Score: '+score,10,30);text('High: '+highScore,10,55);if(gameOver){text('Game Over',width/2-60,height/2);text('Press R or Click to Restart',width/2-140,height/2+30)}}
