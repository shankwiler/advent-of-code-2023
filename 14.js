// part one
(() => {
  const lines = document
    .querySelector("pre")
    .innerText.split("\n")
    .filter((e) => !!e);

  const grid = lines.map((line) => Array.from(line.trim()));

  let load = 0;

  for (let col = 0; col < grid[0].length; col++) {
    let landingRow = 0;
    for (let row = 0; row < grid.length; row++) {
      if (grid[row][col] === "O") {
        load += grid.length - landingRow;
        landingRow++;
      } else if (grid[row][col] === "#") {
        landingRow = row + 1;
      }
    }
  }

  return load;
})();

// part two
(() => {
  const lines = document
    .querySelector("pre")
    .innerText.split("\n")
    .filter((e) => !!e);

  const grid = lines.map((line) => Array.from(line.trim()));

  const seen = {};

  let loopStart;
  let loopEnd;

  for (let cycle = 0; cycle < 10000; cycle++) {
    // north
    for (let col = 0; col < grid[0].length; col++) {
      let landingRow = 0;
      for (let row = 0; row < grid.length; row++) {
        if (grid[row][col] === "O") {
          grid[row][col] = ".";
          grid[landingRow][col] = "O";
          landingRow++;
        } else if (grid[row][col] === "#") {
          landingRow = row + 1;
        }
      }
    }
    // west
    for (let row = 0; row < grid.length; row++) {
      let landingCol = 0;
      for (let col = 0; col < grid.length; col++) {
        if (grid[row][col] === "O") {
          grid[row][col] = ".";
          grid[row][landingCol] = "O";
          landingCol++;
        } else if (grid[row][col] === "#") {
          landingCol = col + 1;
        }
      }
    }
    // south
    for (let col = 0; col < grid[0].length; col++) {
      let landingRow = grid.length - 1;
      for (let row = grid.length - 1; row >= 0; row--) {
        if (grid[row][col] === "O") {
          grid[row][col] = ".";
          grid[landingRow][col] = "O";
          landingRow--;
        } else if (grid[row][col] === "#") {
          landingRow = row - 1;
        }
      }
    }
    const locations = [];
    // east
    for (let row = 0; row < grid.length; row++) {
      let landingCol = grid[0].length - 1;
      for (let col = grid[0].length - 1; col >= 0; col--) {
        if (grid[row][col] === "O") {
          grid[row][col] = ".";
          grid[row][landingCol] = "O";
          locations.push(`${row},${landingCol}`);
          landingCol--;
        } else if (grid[row][col] === "#") {
          landingCol = col - 1;
        }
      }
    }
    const key = locations.join(";");
    if (key in seen) {
      loopStart = seen[key];
      loopEnd = cycle;
      break;
    }
    seen[key] = cycle;
  }

  const totalCycles = 1000000000;
  const remainder = (totalCycles - 1 - loopStart) % (loopEnd - loopStart);
  const config = Object.entries(seen).find(
    ([, cycle]) => cycle === loopStart + remainder
  )[0];

  const entries = config.split(";");

  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[0].length; col++) {
      if (grid[row][col] === "O") {
        grid[row][col] = ".";
      }
      if (entries.includes(`${row},${col}`)) {
        grid[row][col] = "O";
      }
    }
  }

  let load = 0;

  for (let row = 0; row < grid.length; row++) {
    load += grid[row].filter((e) => e === "O").length * (grid.length - row);
  }

  return load;
})();

// Cycle detection comes up a lot in these challenges. I remember something
// similar last year.
