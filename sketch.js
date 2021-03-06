// Project made by @smitbarmase on January 20

const cols = 40, rows = 40
const cellLength = 13
let snakeSize = 10

let grid = new Array(cols)

let openSet = [], closedSet = [], path = []

// Cells in a grid
let snake = new Array(snakeSize)
let food

let gameOver = false

class Cell {
  constructor(i, j) {
    this.i = i
    this.j = j
    this.f = 0
    this.g = 0
    this.h = 0
    this.neighbors = []
    this.previous = undefined
    this.collider = false
    this.walls = false

    if(Math.random()<0.1) {
      this.walls = true
    }
  }

  show(col) {
    fill(col)

    if (snake.includes(this)) {
      fill(255)
      this.collider = true
    } else {
      this.collider = false
    }

    if (this.walls) {
      fill(5)
    }

    if (food.i == this.i && food.j == this.j) {
      fill(255,150,150) // Light red
    }

    noStroke()
    rect((this.i*cellLength)+((windowWidth/2)-(cellLength*cols/2)), (this.j*cellLength)+((windowHeight/2)-(cellLength*rows/2)), cellLength-1, cellLength-1)
  }

  addNeighbors() {
    if (this.i < cols-1)
      this.neighbors.push(grid[this.i+1][this.j])
    if (this.i > 0)
      this.neighbors.push(grid[this.i-1][this.j])
    if (this.j < rows-1)
      this.neighbors.push(grid[this.i][this.j+1])
    if (this.j > 0)
      this.neighbors.push(grid[this.i][this.j-1])

  }
}

function removeFromArray(arr, e) {
  for (let i = arr.length-1; i >= 0; i--) {
    if (arr[i] == e) {
      arr.splice(i, 1)
    }
  }
}

function heuristic(a, b) {
  let d = abs(a.i-b.i) + abs(a.j-b.j)
  return d
}

function spawnFood() {
  food = grid[Math.floor(random(0, cols-1))][Math.floor(random(0, rows-1))]
  while (snake.includes(food) || food.walls == true) {
    spawnFood()
  }
}

function getPath(start, end) {
  //Clearing arrays before algorithm runs.
  openSet = [], closedSet = [], path = []

  openSet.push(start)

  let gettingPath = true

  while(gettingPath) {
    // Pathfinding algorithm
    if (openSet.length > 0) {

      let lowestIndex = 0 // Winner
      for (let i = 0; i < openSet.length; i++) {
        if (openSet[i].f < openSet[lowestIndex].f) {
          lowestIndex = i
        }
      }

      let current = openSet[lowestIndex]

      if (current === end) {

        // Find the path // Backtracking
        let temp = current
        path.push(temp)
        while (temp.previous) {
          path.push(temp.previous)
          temp = temp.previous
        }

        gettingPath = false
        console.log('Done!')
      }

      removeFromArray(openSet, current)
      closedSet.push(current)

      for(let i = 0; i < current.neighbors.length; i++) {
        let neighbor = current.neighbors[i]

        if (!closedSet.includes(neighbor) && !neighbor.collider && !neighbor.walls) {
          let tempG = current.g + 1

          let newPath = false

          if(openSet.includes(neighbor)) {
            if (tempG < neighbor.g) {
              neighbor.g = tempG
              newPath = true
            }
          } else {
            neighbor.g = tempG
            openSet.push(neighbor)
            newPath = true
          }

          if (newPath) {
            neighbor.h = heuristic(neighbor, end)
            neighbor.f = neighbor.h + neighbor.g
            neighbor.previous = current
          }
        }
      }
    } else {
      gettingPath = false
      return -1
    }
  }

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      grid[i][j].previous = undefined
    }
  }
}

function setup() {
  createCanvas(windowWidth, windowHeight)
  frameRate(20)

  // Making a 2D array
  for (let i = 0; i < cols; i++) {
    grid[i] = new Array(rows)
  }

  // Assigning cell object
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      grid[i][j] = new Cell(i, j)
    }
  }

  // Getting neighbors for each cell
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      grid[i][j].addNeighbors()
    }
  }

  // Assigning snake
  for (let i = 0; i < snake.length; i++) {
    snake[i] = grid[snake.length-i-1][0]
  }

  // Assigning food.
  spawnFood()
}

function printEverything() {
  // Clearing background - Black
  background(0)
  // Showing grid on canvas
  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      grid[i][j].show(color(45))
    }
  }
  for (let i = 0; i < openSet.length; i++) {
    openSet[i].show(color(60))
  }
  for (let i = 0; i < closedSet.length; i++) {
    closedSet[i].show(color(70))
  }
  for (let i = 0; i < path.length; i++) {
    path[i].show(color(80))
  }

  for (let i = 0; i < path.length; i++) {
    path[i].show(color(80))
  }

  // Printing text
  fill(255)

  textAlign(CENTER)
  textSize(27)
  text('Pathfinding Snake Visualizer using A* algorithm in JS', windowWidth/2, (windowHeight/2)-(cellLength*rows/2)-30)

  fill(200)

  textAlign(LEFT)
  textSize(23)
  text('Size : '+snakeSize, (windowWidth/2)-(cellLength*cols/2), (windowHeight/2)+(cellLength*rows/2)+40)
  text('Status : '+(!gameOver?'Path found':'Path not found'), (windowWidth/2)-(cellLength*cols/2), (windowHeight/2)+(cellLength*rows/2)+75)

  textAlign(LEFT)
  textSize(23)
  text('Project by @smitbarmase', windowWidth/2, (windowHeight/2)+(cellLength*rows/2)+75)
}

function takeStep() {
  if(path.length>1) {
    for(let i = snake.length-1; i > 0; i--) {
      snake[i] = grid[snake[i-1].i][snake[i-1].j]
    }
    snake[0] = grid[path[path.length-2].i][path[path.length-2].j]
  } else {
    snake.push(null)
    spawnFood()
    snakeSize++
  }
}

// Note : We need to get path everytime snake steps because snake is moving on grid.
function draw() {
  if(getPath(snake[0], food) == -1) {
    gameOver = true
    noLoop()
  }
  takeStep()
  printEverything()
}
