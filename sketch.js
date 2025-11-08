// Logan Shehane
// Cellular Automata on Dynamic Voronoi pattern
// Based off of Dan Shiffman's example
// https://thecodingtrain.com/challenges/181-image-stippling

let seedPoints = [];
let velocities = [];
let colors = [];
let delaunay;

function setup() {
  createCanvas(500, 300);
  for (let i = 0; i < 150; i++) {
    seedPoints[i] = createVector(random(width), random(height));
    velocities[i] = p5.Vector.random2D().setMag(random(0.25, 1)*0.2);
    colors[i] = random(0,255)
  }
}

function draw() {
  background(255);

  delaunay = calculateDelaunay(seedPoints);
  voronoi = delaunay.voronoi([0, 0, width, height]);
  
  for (let i = 0; i < seedPoints.length; i++) {
    let p = seedPoints[i];
    let v = velocities[i];
    let c = colors[i];
    stroke(c);
    strokeWeight(4);
    point(p.x, p.y);
    p.add(v);
    if (p.x > width || p.x < 0) {
      v.x *= -1;
    }
    if (p.y > height || p.y < 0) {
      v.y *= -1;
    }
    let neighbors = Array.from(delaunay.neighbors(i));
    let sum = 0
    for (let j=0; j<neighbors.length; j++){
      let n = neighbors[j]
      sum += colors[n]
    }
    let mean = sum / neighbors.length
    if (i == 0){
    // console.log(colors[i])
    }
    // colors[i] = lerp(colors[i], mean, 0.1)
    if(mean > 100){
      colors[i] += 10
    }
    if (mean > 200 || mean < 100){
      colors[i] -= 20
    }
    // if (colors[i] < 10 && random() > 0.99){
    //   colors[i] += 120
    // }
    colors[i] = constrain(colors[i], 0, 255)
  }

  noFill();
  strokeWeight(1);
  let { points, triangles } = delaunay;
  // for (let i = 0; i < triangles.length; i += 3) {
  //   let a = 2 * delaunay.triangles[i];
  //   let b = 2 * delaunay.triangles[i + 1];
  //   let c = 2 * delaunay.triangles[i + 2];
  //   triangle(
  //     points[a],
  //     points[a + 1],
  //     points[b],
  //     points[b + 1],
  //     points[c],
  //     points[c + 1]
  //   );
  // }

  let polygons = voronoi.cellPolygons();
  let cells = Array.from(polygons);

  for (let i=0; i<cells.length; i++) {
    let poly = cells[i]
    stroke(0);
    strokeWeight(1);
    if(i==0){
      fill(colors[i],0,0)
    }
    else{
    fill(colors[i])
      
    }
    // noFill();
    beginShape();
    for (let j = 0; j < poly.length; j++) {
      vertex(poly[j][0], poly[j][1]);
    }
    endShape();
  }
}

function calculateDelaunay(points) {
  let pointsArray = [];
  for (let v of points) {
    pointsArray.push(v.x, v.y);
  }
  return new d3.Delaunay(pointsArray);
}
