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

  let mouse_vector = createVector(mouseX, mouseY);
  let nearest_contact = find_nearest_contact_point(mouse_vector);
  propel(nearest_contact);

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

function propel(contact_point) {
  // moves toward/away from the contact point closest to the mouse
  if (!mouseIsPressed) {
    return;
  }

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

  let dx = player.speed * Math.cos(angle);
  let dy = player.speed * Math.sin(angle);

  player.x += dx;
  player.y += dy;
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