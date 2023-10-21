"use strict";

const canvas = document.getElementById("maze");
const ctx = canvas.getContext("2d");

const tileSize = 20;
const playerSize = tileSize;
const mazeSize = 19;

function generateWalls(numberOfWalls) {
  let generatedWalls = [];

  while (generatedWalls.length < numberOfWalls) {
    let x = Math.floor(Math.random() * mazeSize);
    let y = Math.floor(Math.random() * mazeSize);

    // Check that this position is not the start or the end
    if ((x !== 0 || y !== 0) && (x !== mazeSize - 1 || y !== mazeSize - 1)) {
      // Also check that the wall doesn't already exist
      if (!generatedWalls.some((wall) => wall.x === x && wall.y === y)) {
        generatedWalls.push({ x: x, y: y });
      }
    }
  }

  return generatedWalls;
}

let playerPosition = { x: 0, y: 0 };
let walls = [];
walls = generateWalls(100);

function drawMaze() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Draw walls
  ctx.fillStyle = "black";
  for (let wall of walls) {
    ctx.fillRect(wall.x * tileSize, wall.y * tileSize, tileSize, tileSize);
  }

  // Draw player
  ctx.fillStyle = "blue";
  ctx.fillRect(
    playerPosition.x * tileSize,
    playerPosition.y * tileSize,
    playerSize,
    playerSize
  );

  // Draw end
  ctx.fillStyle = "green";
  ctx.fillRect(
    (mazeSize - 1) * tileSize,
    (mazeSize - 1) * tileSize,
    tileSize,
    tileSize
  );
}

document.addEventListener("keydown", function (e) {
  let newX = playerPosition.x;
  let newY = playerPosition.y;

  switch (e.key) {
    case "ArrowUp":
      newY--;
      break;
    case "ArrowDown":
      newY++;
      break;
    case "ArrowLeft":
      newX--;
      break;
    case "ArrowRight":
      newX++;
      break;
  }

  if (
    newX >= 0 &&
    newY >= 0 &&
    newX < mazeSize &&
    newY < mazeSize &&
    !walls.some((wall) => wall.x === newX && wall.y === newY)
  ) {
    playerPosition.x = newX;
    playerPosition.y = newY;
  }

  // Check if player has reached the end
  if (playerPosition.x === mazeSize - 1 && playerPosition.y === mazeSize - 1) {
    alert("You Win!");
    playerPosition = { x: 0, y: 0 }; // Reset the game
  }

  drawMaze();
});

drawMaze();
