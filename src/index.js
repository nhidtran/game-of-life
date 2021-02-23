// start and pause game on space part keydown
document.addEventListener("keydown", (key) => {
  if (key.code == "Space") {
    if (play == false) {
      play = true;
      universe.playGame();
    }
  }
});

function GameOfLife() {
  this.layout = new Map();
  this.nextGen = [];
}

GameOfLife.prototype = {
  getNeighbors: function ({ x, y }) {
    const top = this.layout.get(createKey(x, y - 1));
    const bottom = this.layout.get(createKey(x, y + 1));
    const right = this.layout.get(createKey(x + 1, y));
    const left = this.layout.get(createKey(x - 1, y));
    const diagBtmLeft = this.layout.get(createKey(x - 1, y + 1));
    const diagBtmRight = this.layout.get(createKey(x + 1, y + 1));
    const diagTopLeft = this.layout.get(createKey(x + 1, y - 1));
    const diagTopRight = this.layout.get(createKey(x - 1, y - 1));
    return [
      top,
      bottom,
      right,
      left,
      diagBtmLeft,
      diagBtmRight,
      diagTopLeft,
      diagTopRight,
    ].filter((node) => node !== undefined && node !== null);
  },
  setPosition: function (x, y, state, node) {
    this.layout.set(createKey(x, y), {
      x,
      y,
      state,
      node,
    });
  },
  playGame: function () {
    if (play) {
      this.layout.forEach((cell, idx) => {
        const neighbors = this.getNeighbors(cell);
        // Any dead cell with exactly three live neighbors becomes a live cell, as if by reproduction.
        if (
          cell.state == false &&
          neighbors.filter((neighbor) => neighbor.state == true).length >= 3
        ) {
          // dead cell
          this.nextGen.push({ ...cell, state: true });
        } else if (cell.state == true) {
          // live cells
          // Any live cell with more than three live neighbors dies, as if by overpopulation.
          if (
            neighbors.filter((neighbor) => neighbor.state == true).length >= 3
          ) {
            // 3 or more live neighbors, dies - overpopulation
            // node.classList.remove("alive");
            // node.classList.add("dead");
            this.nextGen.push({ ...cell, state: false });
          } else if (
            // Any live cell with fewer than two live neighbors dies, as if caused by under population.
            neighbors.filter((neighbor) => neighbor.state == true).length < 2
          ) {
            // less than 2 live neighbors dies - underpopulation
            this.nextGen.push({ ...cell, state: false });
          }
          // do nothing, Any live cell with two or three live neighbors lives on to the next generation.
        }
      });
      updateBoard();
    }
  },
};

function createKey(row, col) {
  return `[${row},${col}]`;
}

function handleClick(row, col, node) {
  // only change cells, if the universe is currently not in play
  if (!play) {
    const key = createKey(row, col);
    if (node.classList.contains("dead")) {
      // if cell is dead
      universe.layout.set(key, {
        ...universe.layout.get(key),
        state: true,
      });
      node.classList.remove("dead");
      node.classList.add("alive");
    } else {
      universe.layout.set(key, {
        ...universe.layout.get(key),
        state: false,
      });
      node.classList.remove("alive");
      node.classList.add("dead");
    }
  }
}

function drawGrid(rows, cols) {
  const root = document.getElementById("gameOfLife");
  if (root) {
    for (let row = 0; row < rows; ++row) {
      for (let col = 0; col < cols; ++col) {
        // create html elements
        const node = document.createElement("div");
        node.classList.add("cell");
        node.classList.add("alive"); // when cell value is true
        node.setAttribute("id", `${row}-${col}`);
        node.onclick = function () {
          handleClick(row, col, node);
        };
        root.append(node);
        // initialize all game of life elements to be alive
        universe.setPosition(row, col, true, node); // set all grid cells to be alive
      }
    }
  }
}

function updateBoard() {
  universe.nextGen.forEach((nextCell) => {
    const { x, y, state, node } = nextCell;

    if (state == true) {
      // alive
      node.classList.remove("dead");
      node.classList.add("alive");
    } else {
      node.classList.remove("alive");
      node.classList.add("dead");
    }

    // update universe layout with updated node classlist
    universe.layout.set(createKey(x, y), { ...nextCell, node });
  });
  // reset nextGen
  universe.nextGen = [];
  play = false;
}

/************************************* */
let play = false;
const universe = new GameOfLife();
drawGrid(10, 10);
