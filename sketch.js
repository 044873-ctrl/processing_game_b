var canvas;
var balls = [];
var isAiming = false;
var cueIndex = 0;
var maxPull = 140;
var powerScale = 0.12;
var friction = 0.995;
var holeRadius = 24;
var holes = [];
function Ball(x,y,r,m,cr,cg,cb){
 this.pos = createVector(x,y);
 this.vel = createVector(0,0);
 this.r = r;
 this.m = m;
 this.cr = cr;
 this.cg = cg;
 this.cb = cb;
}
function drawPentagon(cx,cy,r,rot){
 beginShape();
 for(var i=0;i<5;i++){
  var a = rot + i * TWO_PI / 5;
  var x = cx + cos(a) * r;
  var y = cy + sin(a) * r;
  vertex(x,y);
 }
 endShape(CLOSE);
}
function isInHole(pos){
 for(var i=0;i<holes.length;i++){
  if(p5.Vector.dist(pos,holes[i]) <= holeRadius){
   return true;
  }
 }
 return false;
}
function setup(){
 canvas = createCanvas(900,500);
 canvas.elt.oncontextmenu = function(){ return false; };
 frameRate(60);
 holes = [createVector(0,0),createVector(width,0),createVector(0,height),createVector(width,height)];
 initBalls();
}
function initBalls(){
 balls = [];
 var cb = new Ball(width*0.2,height/2,12,1,255,255,255);
 balls.push(cb);
 var startX = width*0.65;
 var startY = height/2;
 var radius = 12;
 var cols = 5;
 var colors = [[255,0,0],[255,165,0],[0,128,0],[0,0,255],[128,0,128],[255,255,0],[0,255,255]];
 var idx = 0;
 for(var row=0; row<cols; row++){
  for(var j=0; j<=row; j++){
   var x = startX + row*(radius*2+1);
   var y = startY + (j - row*0.5)*(radius*2+1);
   var c = colors[idx % colors.length];
   var b = new Ball(x,y,radius,1.2,c[0],c[1],c[2]);
   balls.push(b);
   idx++;
  }
 }
}
function draw(){
 background(30);
 drawHoles();
 updatePhysics();
 drawBalls();
 if(isAiming){
  drawAim();
 }
}
function drawHoles(){
 noStroke();
 fill(10);
 for(var i=0;i<holes.length;i++){
  var h = holes[i];
  ellipse(h.x,h.y,holeRadius*2,holeRadius*2);
 }
}
function updatePhysics(){
 for(var i=0;i<balls.length;i++){
  var b = balls[i];
  b.pos.add(b.vel);
  b.vel.mult(friction);
  if(b.vel.mag() < 0.01){
   b.vel.set(0,0);
  }
  var nearHole = false;
  for(var hi=0;hi<holes.length;hi++){
   if(p5.Vector.dist(b.pos,holes[hi]) <= holeRadius){
    nearHole = true;
    break;
   }
  }
  if(!nearHole){
   if(b.pos.x - b.r < 0){
    b.pos.x = b.r;
    b.vel.x *= -0.9;
   }
   if(b.pos.x + b.r > width){
    b.pos.x = width - b.r;
    b.vel.x *= -0.9;
   }
   if(b.pos.y - b.r < 0){
    b.pos.y = b.r;
    b.vel.y *= -0.9;
   }
   if(b.pos.y + b.r > height){
    b.pos.y = height - b.r;
    b.vel.y *= -0.9;
   }
  }
 }
 for(var i=0;i<balls.length;i++){
  for(var j=i+1;j<balls.length;j++){
   var a = balls[i];
   var b = balls[j];
   var delta = p5.Vector.sub(b.pos,a.pos);
   var dist = delta.mag();
   var minDist = a.r + b.r;
   if(dist <= 0){
    delta = createVector(1,0);
    dist = 1;
   }
   if(dist < minDist){
    var overlap = minDist - dist;
    delta.normalize();
    a.pos.add(delta.copy().mult(-overlap*0.5));
    b.pos.add(delta.copy().mult(overlap*0.5));
    var relVel = p5.Vector.sub(b.vel,a.vel);
    var velAlongNormal = relVel.dot(delta);
    if(velAlongNormal > 0){
     continue;
    }
    var e = 0.98;
    var jImp = -(1+e)*velAlongNormal / (1/a.m + 1/b.m);
    var impulse = delta.copy().mult(jImp);
    a.vel.sub(impulse.copy().div(a.m));
    b.vel.add(impulse.copy().div(b.m));
   }
  }
 }
 for(var i=balls.length-1;i>=0;i--){
  var bb = balls[i];
  var fell = false;
  for(var hi=0;hi<holes.length;hi++){
   if(p5.Vector.dist(bb.pos,holes[hi]) <= holeRadius){
    fell = true;
    break;
   }
  }
  if(fell){
   balls.splice(i,1);
  }
 }
}
function drawBalls(){
 noStroke();
 for(var i=0;i<balls.length;i++){
  var b = balls[i];
  fill(b.cr,b.cg,b.cb);
  if(b.cr===255 && b.cg===255 && b.cb===255){
   push();
   translate(b.pos.x,b.pos.y);
   var rot = 0;
   if(b.vel.mag() > 0.01){
    rot = atan2(b.vel.y,b.vel.x);
   }
   drawPentagon(0,0,b.r,rot);
   pop();
  } else {
   ellipse(b.pos.x,b.pos.y,b.r*2,b.r*2);
  }
 }
}
function drawAim(){
 var cb = balls[cueIndex];
 if(cb===undefined) return;
 var speed = cb.vel.mag();
 if(speed > 0.5){
  isAiming = false;
  return;
 }
 stroke(200);
 strokeWeight(2);
 var mx = mouseX;
 var my = mouseY;
 var drag = createVector(mx,my).sub(cb.pos);
 var pull = drag.mag();
 if(pull > maxPull){
  drag.setMag(maxPull);
  pull = maxPull;
 }
 var end = cb.pos.copy().add(drag);
 line(cb.pos.x,cb.pos.y,end.x,end.y);
 strokeWeight(1);
 noStroke();
 var pwr = map(pull,0,maxPull,0,1);
 fill(255*(1-pwr),255*pwr,50);
 ellipse(end.x,end.y,8,8);
 fill(255);
}
function mousePressed(){
 if(mouseButton === RIGHT){
  var cb = balls[cueIndex];
  if(cb!==undefined && cb.vel.mag() < 0.5){
   isAiming = true;
  }
 }
}
function mouseReleased(){
 if(isAiming){
  var cb = balls[cueIndex];
  if(cb!==undefined){
   var drag = createVector(mouseX,mouseY).sub(cb.pos);
   var pull = drag.mag();
   if(pull > 0.5){
    if(pull > maxPull) pull = maxPull;
    var dir = drag.copy();
    if(dir.mag() === 0) dir.set(0,0);
    else dir.normalize();
    var impulse = dir.mult(-pull*powerScale);
    cb.vel.add(impulse);
   }
  }
  isAiming = false;
 }
}
