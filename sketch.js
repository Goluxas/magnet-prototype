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
    contact_acceleration: 1.0,
    // Normal Gravity is 9.8 m/s/s
    // Since we're working in frames, that's 60 frames/s
    // unit = meter, so 1 unit/m
    // 9.8 m/s^2 * 1 unit/m = 9.8 unit/s^2
    // 9.8 unit/s^2 * 1/60 s/frame = 9.8/60 unit/s*frame
    gravity: 0.16333333, // maybe equivalent to 9.8 m/s^2 in frames?
    dx: 0,
    dy: 0,
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

  let mouse_vector = createVector(mouseX, mouseY);
  let nearest_contact = find_nearest_contact_point(mouse_vector);

  let acceleration = {dx: player.dx, dy: player.dy};
  if (mouseIsPressed) {
    acceleration = propel(nearest_contact, player.dx, player.dy);
  } else {
    acceleration = gravity(player);
  }

  move(player, acceleration.dx, acceleration.dy);

  // contact points
  stroke(0, 0, 200);
  fill(0, 0, 200);
  for (const point of contact_points) {
    circle(point.x, point.y, 5);
  }

  // draw influence line to contact point
  stroke(0, 0, 200);
  line(player.x, player.y, nearest_contact.x, nearest_contact.y);

  // player
  fill(255);
  circle(player.x, player.y, player.size);
}

function move(actor, dx, dy) {
  // Moves an actor (like the player) by dx and dy and updates their acceleration
  actor.x += dx;
  actor.y += dy;
  actor.dx = dx;
  actor.dy = dy;
}

function gravity(actor) {
  // Applies gravity acceleration to the actor
  dy = actor.dy + actor.gravity;
  return {dx: actor.dx, dy: dy};
}

function propel(contact_point, dx, dy) {
  /* Accelerates toward/away from the contact point closest to the mouse

  Arguments:
    contact_point (Vector): The point toward which to accelerate
    dx, dy (float): The previous values of dx and dy
  
  Returns:
    dx, dy (float): The current acceleration in each direction
  */

  // vector movement time!
  let player_vector = createVector(player.x, player.y);

  let move_vector = p5.Vector.sub(player_vector, contact_point);

  // using p5's angleBetween
  //angle = move_vector.angleBetween(createVector(1,0));
  // NOTE: this made the player move away on Y-axis and toward on X-axis
  // not sure why atan2 works but this doesn't

  // using atan2
  let angle = Math.atan2(move_vector.y, move_vector.x);

  // if right click, attract instead of repel
  if (mouseButton == RIGHT) {
    // NOTE: interesting! this makes it attract on y-axis but still repel on x-axis
    // angle *= -1;
    // maybe if i subtract pi radians instead?
    angle -= Math.PI;
    // that did it
    // now how to suppress the context menu?
  }

  dx += player.contact_acceleration * Math.cos(angle);
  dy += player.contact_acceleration * Math.sin(angle);

  return {dx: dx, dy: dy};
}

function find_nearest_contact_point(source_vector) {
  let min_distance = Number.MAX_SAFE_INTEGER;
  let closest;

  for (const point of contact_points) {
    let dist_vector = p5.Vector.sub(source_vector, point);
    // faster than mag() and we don't care because we're just comparing
    let dist = dist_vector.magSq();

    if (dist < min_distance) {
      min_distance = dist;
      closest = point.copy();
    }
  }

  return closest;
}