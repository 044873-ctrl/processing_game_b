let basket;
let fruits = [];
let score = 0;

function setup() {
  createCanvas(800, 600);
  basket = new Basket(400, 550, 100, 20);
}

function draw() {
  background(220);
  
  if (random() < 0.01) {
    fruits.push(new Fruit(random(width), -30));
  }
  
  for (let i = fruits.length - 1; i >= 0; i--) {
    let f = fruits[i];
    f.move();
    f.display();
    
    if (f.y > height) {
      fruits.splice(i, 1);
    } else if (f.hits(basket)) {
      fruits.splice(i, 1);
      score++;
    }
  }
  
  basket.move();
  basket.display();
  
  fill(0);
  textSize(32);
  text('Score: ' + score, 10, 50);
}

function Basket(x, y, w, h) {
  this.x = x;
  this.y = y;
  this.w = w;
  this.h = h;
  
  this.move = function() {
    this.x = constrain(mouseX, this.w / 2, width - this.w / 2);
  }
  
  this.display = function() {
    fill(255);
    rectMode(CENTER);
    rect(this.x, this.y, this.w, this.h);
  }
}

function Fruit(x, y) {
  this.x = x;
  this.y = y;
  this.r = 30;
  this.speed = 2;

  this.move = function() {
    this.y += this.speed;
  }
  
  this.display = function() {
    fill(255, 0, 0);
    ellipse(this.x, this.y, this.r * 2, this.r * 2);
  }

  this.hits = function(basket) {
    let d = dist(this.x, this.y, basket.x, basket.y);
    if (d < this.r + basket.w / 2) {
      return true;
    } else {
      return false;
    }
  }
}
