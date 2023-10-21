"use strict";
// Sources: https://p5js.org/reference/#/p5/line
// https://en.wikipedia.org/wiki/Maze_generation_algorithm
// Inspired by: https://www.youtube.com/@TheCodingTrain
// Global Variables
let rows = 20;
let columns = 20;
let size = 40;
let grid = [];
let current;
let Stack = [];

// Initialize canvas and grid
function setup() {
  createCanvas(800, 800);
  columns = floor(width / size);
  rows = floor(height / size);
  // frameRate(1);

  // Fill the grid with Cell objects
  for (let row = 0; row < rows; row++) {
    for (let col = 0; col < columns; col++) {
      grid.push(new Cell(row, col));
    }
  }
  current = grid[0];
}

// Main drawing loop
function draw() {
  background(220, 220, 250); // Light lavender background

  // Display each cell in the grid
  grid.forEach((cell) => cell.show());

  // Mark current cell as visited and highlight it
  current.visited = true;
  current.highlight();

  // Check for unvisited neighbors
  let nextNeighbor = current.checkNeighbors();
  if (nextNeighbor) {
    nextNeighbor.visited = true;
    Stack.push(current);
    current.removeWalls(nextNeighbor);
    current = nextNeighbor;
  } else {
    current = Stack.pop();
  }
}

// Helper function to get a cell's index in the grid array
function index(i, j) {
  if (i < 0 || j < 0 || i > rows - 1 || j > columns - 1) {
    return -1;
  }
  return i * columns + j;
}

// Cell class definition
function Cell(row, column) {
  this.column = column;
  this.row = row;
  this.walls = [true, true, true, true]; // top, right, bottom, left
  this.visited = false;

  // Remove walls between the current cell and its neighbor
  this.removeWalls = function (neighbor) {
    let deltaX = this.column - neighbor.column;
    if (deltaX === 1) {
      this.walls[3] = false;
      neighbor.walls[1] = false;
    } else if (deltaX === -1) {
      this.walls[1] = false;
      neighbor.walls[3] = false;
    }

    let deltaY = this.row - neighbor.row;
    if (deltaY === 1) {
      this.walls[0] = false;
      neighbor.walls[2] = false;
    } else if (deltaY === -1) {
      this.walls[2] = false;
      neighbor.walls[0] = false;
    }
  };

  // Check for unvisited neighbors
  this.checkNeighbors = function () {
    let neighbors = [];

    let top = grid[index(this.row - 1, this.column)];
    let right = grid[index(this.row, this.column + 1)];
    let bottom = grid[index(this.row + 1, this.column)];
    let left = grid[index(this.row, this.column - 1)];

    [top, right, bottom, left].forEach((neighbor) => {
      if (neighbor && !neighbor.visited) {
        neighbors.push(neighbor);
      }
    });

    if (neighbors.length > 0) {
      return neighbors[floor(random(neighbors.length))];
    } else {
      return undefined;
    }
  };

  // Display the cell on the canvas
  this.show = function () {
    let x = this.column * size;
    let y = this.row * size;

    stroke(100, 100, 150); // Deeper shade for walls
    if (this.walls[0]) line(x, y, x + size, y); // Top wall
    if (this.walls[1]) line(x + size, y, x + size, y + size); // Right wall
    if (this.walls[2]) line(x, y + size, x + size, y + size); // Bottom wall
    if (this.walls[3]) line(x, y, x, y + size); // Left wall

    if (this.visited) {
      noStroke();
      // Dynamic gradient coloring based on row and column position
      let colValue = map(this.column, 0, columns, 100, 255);
      let rowValue = map(this.row, 0, rows, 100, 255);
      fill(colValue, 250, rowValue, 150);
      rect(x, y, size, size);
    }
  };

  // Highlight the current cell
  this.highlight = function () {
    let x = this.column * size;
    let y = this.row * size;

    noStroke();
    fill(255, 70, 120, 150); // A vibrant pink to highlight the current cell
    rect(x, y, size, size);
  };
}
