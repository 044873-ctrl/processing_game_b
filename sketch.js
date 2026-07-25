var canvasW=600,canvasH=400;
var groundHeight=20;
var player={x:0,y:0,w:30,h:30,vx:0,vy:0,speed:3,canJump:false,prevY:0};
var gravity=0.7,jumpForce=-12,terminalVel=12;
var platforms=[];
var numPlatforms=5,platformW=100,platformH=10;
var stars=[];
var score=0;
var gameOver=false;
var prevSpace=false;
var retryBtn={x:canvasW/2-40,y:canvasH/2+20,w:80,h:30};
function createPlatformsAndStars(){platforms=[];stars=[];var lowY=canvasH-groundHeight-80;var lowX=Math.floor(random(0,canvasW-platformW));platforms.push({x:lowX,y:lowY,w:platformW,h:platformH});var attempts=0;while(platforms.length<numPlatforms&&attempts<500){var px=Math.floor(random(0,canvasW-platformW));var py=Math.floor(random(60,lowY-60));var ok=true;for(var i=0;i<platforms.length;i++){var p=platforms[i];if(Math.abs(py-p.y)<50&&Math.abs(px-p.x)<platformW){ok=false;break;}}if(ok){platforms.push({x:px,y:py,w:platformW,h:platformH});}attempts++;}for(var i=0;i<platforms.length;i++){var p2=platforms[i];if(random()<0.8){var sx=p2.x+random(10,p2.w-10);var sy=p2.y-10;stars.push({x:sx,y:sy,r:6});}}for(var j=0;j<3;j++){var sx2=random(20,canvasW-20);var sy2=random(40,canvasH-groundHeight-150);stars.push({x:sx2,y:sy2,r:6});}}
function resetGame(){score=0;gameOver=false;prevSpace=false;createPlatformsAndStars();var low=platforms[0];if(low===undefined){low={x:0,y:canvasH-groundHeight-80,w:platformW,h:platformH};platforms.push(low);}player.x=low.x+platformW/2-player.w/2;player.y=low.y-player.h;player.vx=0;player.vy=0;player.canJump=true;player.prevY=player.y;retryBtn.x=canvasW/2-40;retryBtn.y=canvasH/2+20;}
function drawPlatforms(){fill(100);noStroke();for(var i=0;i<platforms.length;i++){var p=platforms[i];rect(p.x,p.y,p.w,p.h);}}
function drawStars(){fill(255,204,0);noStroke();for(var i=0;i<stars.length;i++){var s=stars[i];ellipse(s.x,s.y,s.r*2,s.r*2);}}
function drawPlayer(){fill(200);noStroke();rect(player.x,player.y,player.w,player.h);}
function drawHUD(){fill(255);textSize(16);textAlign(LEFT,TOP);text('SCORE: '+score,10,10);}
function drawRetryButton(){fill(80);noStroke();rect(retryBtn.x,retryBtn.y,retryBtn.w,retryBtn.h,5);fill(255);textSize(14);textAlign(CENTER,CENTER);text('RETRY',retryBtn.x+retryBtn.w/2,retryBtn.y+retryBtn.h/2);}
function handleInput(){var moving=false;if(keyIsDown(LEFT_ARROW)){player.vx=-player.speed;moving=true;}if(keyIsDown(RIGHT_ARROW)){player.vx=player.speed;moving=true;}if(!moving){player.vx=0;}var spaceDown=keyIsDown(32);if(spaceDown&&!prevSpace&&player.canJump){player.vy=jumpForce;player.canJump=false;}prevSpace=spaceDown;}
function applyPhysics(){player.vy+=gravity;if(player.vy>terminalVel){player.vy=terminalVel;}player.x+=player.vx;player.y+=player.vy;if(player.x<0){player.x=0;}if(player.x+player.w>canvasW){player.x=canvasW-player.w;}}
function checkPlatformCollisions(){for(var i=0;i<platforms.length;i++){var p=platforms[i];var playerBottomPrev=player.prevY+player.h;var playerBottom=player.y+player.h;var horizontalOverlap = player.x < p.x+p.w && player.x+player.w > p.x; if(player.vy>=0 && playerBottomPrev <= p.y && playerBottom >= p.y && horizontalOverlap){player.y = p.y - player.h;player.vy = 0;player.canJump = true;}}}
function checkStars(){for(var i=stars.length-1;i>=0;i--){var s=stars[i];var px=player.x+player.w/2;var py=player.y+player.h/2;var dx=Math.abs(px-s.x);var dy=Math.abs(py-s.y);var distSq=dx*dx+dy*dy;var rad=(player.w/2 + s.r);if(distSq <= rad*rad){stars.splice(i,1);score += 10;}}}
function setup(){createCanvas(canvasW,canvasH);resetGame();textFont('sans-serif');textSize(16);}
function draw(){background(10,20,50);noStroke();fill(30,30,30);rect(0,canvasH-groundHeight,canvasW,groundHeight);drawPlatforms();drawStars();drawPlayer();drawHUD();if(!gameOver){player.prevY=player.y;handleInput();applyPhysics();checkPlatformCollisions();checkStars();if(player.y+player.h>=canvasH-groundHeight){gameOver=true;}}else{fill(255);textAlign(CENTER,CENTER);textSize(36);text('GAME OVER',canvasW/2,canvasH/2-20);drawRetryButton();}}
function mousePressed(){if(gameOver){if(mouseX >= retryBtn.x && mouseX <= retryBtn.x+retryBtn.w && mouseY >= retryBtn.y && mouseY <= retryBtn.y+retryBtn.h){resetGame();}}}
function keyPressed(){if(gameOver && (key === 'r' || key === 'R')){resetGame();}}
