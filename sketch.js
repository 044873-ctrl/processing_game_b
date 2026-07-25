let player=null;
let obstacles=[];
let coins=[];
let clouds=[];
let gravity=0;
let jumpForce=0;
let groundY=0;
let spawnTimer=0;
let spawnInterval=0;
let speed=0;
let score=0;
let highScore=0;
let gameOver=false;
let coinSpawnTimer=0;
let coinSpawnInterval=0;
let cloudTimer=0;
let cloudInterval=0;
function spawnObstacle(){let h=Math.floor(Math.random()*60)+20;let w=Math.floor(Math.random()*40)+20;let y=groundY-h;let x=width+w+10;let ob={x:x,y:y,w:w,h:h,passed:false};obstacles.push(ob)}
function updateObstacles(){for(let i=obstacles.length-1;i>=0;i--){let ob=obstacles[i];ob.x-=speed; if(ob.x+ob.w<0){obstacles.splice(i,1);continue} if(!ob.passed && ob.x+ob.w<player.x){ob.passed=true;score+=1; if(score>highScore){highScore=score}} if(checkCollision(player,ob)){gameOver=true}}}
function spawnCoin(){let r=10;let x=width+r+10;let minY=groundY-160;let maxY=groundY-player.size-10; if(minY>maxY){minY=groundY-120;maxY=groundY-player.size-10}let y=random(minY,maxY);let coin={x:x,y:y,r:r,collected:false};coins.push(coin)}
function updateCoins(){for(let i=coins.length-1;i>=0;i--){let c=coins[i];c.x-=speed; if(c.x+c.r<0){coins.splice(i,1);continue} if(checkCircleRectCollision(c.x,c.y,c.r,player)){score+=1; if(score>highScore){highScore=score}coins.splice(i,1)}}}
function spawnCloud(){let cw=Math.floor(Math.random()*100)+60;let ch=Math.floor(Math.random()*40)+30;let x=width+cw+10;let y=Math.floor(Math.random()*(groundY-80)) ;let vel=max(0.5,speed*0.35);let cloud={x:x,y:y,w:cw,h:ch,vel:vel};clouds.push(cloud)}
function updateClouds(){for(let i=clouds.length-1;i>=0;i--){let c=clouds[i];c.x-=c.vel; if(c.x+c.w<0){clouds.splice(i,1)}}}
function checkCollision(pl,ob){let plLeft=pl.x;let plRight=pl.x+pl.size;let plTop=pl.y;let plBottom=pl.y+pl.size;let obLeft=ob.x;let obRight=ob.x+ob.w;let obTop=ob.y;let obBottom=ob.y+ob.h;return !(plRight<obLeft||plLeft>obRight||plBottom<obTop||plTop>obBottom)}
function checkCircleRectCollision(cx,cy,r,rect){let rectX=rect.x;let rectY=rect.y;let rectW=rect.size!==undefined?rect.size:rect.w;let rectH=rect.size!==undefined?rect.size:rect.h;let closestX=constrain(cx,rectX,rectX+rectW);let closestY=constrain(cy,rectY,rectY+rectH);let dx=cx-closestX;let dy=cy-closestY;return dx*dx+dy*dy<=r*r}
function resetGame(){obstacles=[];coins=[];clouds=[];score=0;spawnTimer=0;spawnInterval=90;coinSpawnTimer=0;coinSpawnInterval=60;cloudTimer=0;cloudInterval=140;speed=6;gameOver=false;player.y=groundY-player.size;player.vy=0;player.onGround=true}
function keyPressed(){if(!gameOver){if((keyCode===32||keyCode===38)&&player.onGround){player.vy=jumpForce;player.onGround=false}}else{if(key==='r'||key==='R'){resetGame()}}}
function mousePressed(){if(!gameOver){if(player.onGround){player.vy=jumpForce;player.onGround=false}}else{resetGame()}}
function setup(){createCanvas(640,360);groundY=height-50;gravity=1;jumpForce=-15;player={x:80,y:groundY-40,size:40,vy:0,onGround:true};obstacles=[];coins=[];clouds=[];spawnTimer=0;spawnInterval=90;coinSpawnTimer=0;coinSpawnInterval=60;cloudTimer=0;cloudInterval=140;speed=6;score=0;highScore=0;gameOver=false;textSize(20);for(let i=0;i<3;i++){spawnCloud()}}
function draw(){background(135,206,235);updateClouds();if(!gameOver){for(let i=0;i<1;i++){if(random()<0.005){spawnCloud()}}player.vy+=gravity;player.y+=player.vy;if(player.y>groundY-player.size){player.y=groundY-player.size;player.vy=0;player.onGround=true}spawnTimer++;coinSpawnTimer++;cloudTimer++;if(spawnTimer>=spawnInterval){spawnObstacle();spawnTimer=0;if(spawnInterval>40){spawnInterval-=1}speed+=0.01}if(coinSpawnTimer>=coinSpawnInterval){spawnCoin();coinSpawnTimer=0;if(coinSpawnInterval>30){coinSpawnInterval-=0.2}}if(cloudTimer>=cloudInterval){spawnCloud();cloudTimer=0}updateObstacles();updateCoins()}fill(255);noStroke();for(let i=0;i<clouds.length;i++){let c=clouds[i];fill(255,250,250);ellipse(c.x+c.w*0.2,c.y+c.h*0.5,c.w*0.6,c.h*0.6);ellipse(c.x+c.w*0.5,c.y+c.h*0.4,c.w*0.8,c.h*0.7);ellipse(c.x+c.w*0.8,c.y+c.h*0.6,c.w*0.5,c.h*0.5)}fill(80,200,120);rect(0,groundY,width,height-groundY);fill(200);rect(player.x,player.y,player.size,player.size);for(let i=0;i<obstacles.length;i++){let ob=obstacles[i];fill(100,40,40);triangle(ob.x,ob.y+ob.h,ob.x+ob.w*0.5,ob.y,ob.x+ob.w,ob.y+ob.h);fill(80,30,30);rect(ob.x,ob.y+ob.h*0.6,ob.w,ob.h*0.4)}for(let i=0;i<coins.length;i++){let c=coins[i];fill(255,204,0);ellipse(c.x,c.y,c.r*2,c.r*2);fill(255,230,120);ellipse(c.x-c.r*0.2,c.y-c.r*0.3,c.r*0.8,c.r*0.5)}fill(0);text('Score: '+score,10,30);text('High: '+highScore,10,55);if(gameOver){text('Game Over',width/2-60,height/2);text('Press R or Click to Restart',width/2-140,height/2+30)}}
