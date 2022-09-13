let player;

function setup() {
  //canvasWidth = windowWidth * 0.95;
  //canvasHeight = windowHeight * 0.95;
  canvasWidth = windowWidth;
  canvasHeight = windowHeight;
  createCanvas(canvasWidth, canvasHeight);

  player = {
    x: canvasWidth / 2,
    y: canvasHeight / 2,
    size: 20,
    speed: 5,
  }
}

function draw() {
  background(220);

  propel();

  stroke(0, 0, 200);
  line(player.x, player.y, mouseX, mouseY);

  fill(255);
  circle(player.x, player.y, player.size);
}

function propel() {
  if (!mouseIsPressed) {
    return;
  }

  // basic movment with no normalization
  // ie. will move faster diagonally than in cardinals
  x_speed = 0;
  y_speed = 0;
  if (mouseX > player.x) {
    x_speed = -player.speed;
  } else if (mouseX < player.x) {
    x_speed = player.speed;
  }

  if (mouseY > player.y) {
    y_speed = -player.speed;
  } else if (mouseY < player.y) {
    y_speed = player.speed;
  }

  player.x += x_speed;
  player.y += y_speed;
}