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
    speed: 5.0,
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

  // vector movement time!
  player_vector = createVector(player.x, player.y);
  mouse_vector = createVector(mouseX, mouseY);

  move_vector = p5.Vector.sub(player_vector, mouse_vector);

  // using p5's angleBetween
  //angle = move_vector.angleBetween(createVector(1,0));
  // NOTE: this made the player move away on Y-axis and toward on X-axis
  // not sure why atan2 works but this doesn't

  // using atan2
  angle = Math.atan2(move_vector.y, move_vector.x);

  // if right click, attract instead of repel
  if (mouseButton == RIGHT) {
    // NOTE: interesting! this makes it attract on y-axis but still repel on x-axis
    // angle *= -1;
    // maybe if i subtract pi radians instead?
    angle -= Math.PI;
    // that did it
    // now how to suppress the context menu?
  }

  dx = player.speed * Math.cos(angle);
  dy = player.speed * Math.sin(angle);

  player.x += dx;
  player.y += dy;
}