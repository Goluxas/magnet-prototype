let player;
let contact_points;

function setup() {
  //canvasWidth = windowWidth * 0.95;
  //canvasHeight = windowHeight * 0.95;
  canvasWidth = windowWidth;
  canvasHeight = windowHeight;
  let canvas = createCanvas(canvasWidth, canvasHeight);
  // blocks the context menu on right click
  canvas.elt.addEventListener("contextmenu", (e) => e.preventDefault());

  player = {
    x: canvasWidth / 2,
    y: canvasHeight / 2,
    size: 20,
    speed: 5.0,
  }

  contact_points = generate_contact_points();
}

function generate_contact_points(n = 5) {
  // Creates n randomly placed contact points on the map
  let points = new Array();
  for (let i = 0; i < n; i++) {
    point = createVector(random(0, canvasWidth), random(0, canvasHeight));
    points.push(point);
  }

  return points;
}

function draw() {
  background(220);

  propel();

  // contact points
  stroke(0, 0, 200);
  fill(0, 0, 200);
  for (const point of contact_points) {
    circle(point.x, point.y, 5);
  }

  // draw influence line
  stroke(0, 0, 200);
  line(player.x, player.y, mouseX, mouseY);

  // player
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