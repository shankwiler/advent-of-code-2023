(() => {
  const lines = document
    .querySelector("pre")
    .innerText.split("\n")
    .filter((e) => !!e);

  const grid = lines.map((line) => Array.from(line));

  const map = {
    "|": [
      [-1, 0],
      [1, 0],
    ],
    "-": [
      [0, 1],
      [0, -1],
    ],
    L: [
      [-1, 0],
      [0, 1],
    ],
    J: [
      [-1, 0],
      [0, -1],
    ],
    7: [
      [0, -1],
      [1, 0],
    ],
    F: [
      [0, 1],
      [1, 0],
    ],
  };

  // Start at S
  // Look around, find one pipe that opens to S. Go to the other square that pipe
  // opens to. Go to the square that pipe opens to which you haven't already been at.
  // Go to the other square that pipe opens to which you haven't already been at...
  // Once you get back to S, count how many squares you've traveled.

  let row;
  let col;
  for (row = 0; row < grid.length; row++) {
    let found = false;
    for (col = 0; col < grid[0].length; col++) {
      if (grid[row][col] === "S") {
        found = true;
        break;
      }
    }
    if (found) {
      break;
    }
  }

  let previousRow;
  let previousCol;

  for (const [pipe, directions] of Object.entries(map)) {
    let found = false;
    for (const [dr, dc] of directions) {
      if (grid[row - dr]?.[col - dc] === pipe) {
        found = true;
        previousRow = row;
        previousCol = col;
        row = row - dr;
        col = col - dc;
      }
    }
    if (found) {
      break;
    }
  }

  let visited = 1;

  while (grid[row][col] !== "S") {
    for (const [dr, dc] of map[grid[row][col]]) {
      if (!(row + dr === previousRow && col + dc === previousCol)) {
        previousRow = row;
        previousCol = col;
        row = row + dr;
        col = col + dc;
        break;
      }
    }
    visited++;
  }

  return visited / 2;
})();

// part two
(() => {
  const lines = document
    .querySelector("pre")
    .innerText.split("\n")
    .filter((e) => !!e);

  const map = {
    "|": [
      [false, true, false],
      [false, true, false],
      [false, true, false],
    ],
    "-": [
      [false, false, false],
      [true, true, true],
      [false, false, false],
    ],
    L: [
      [false, true, false],
      [false, true, true],
      [false, false, false],
    ],
    J: [
      [false, true, false],
      [true, true, false],
      [false, false, false],
    ],
    7: [
      [false, false, false],
      [true, true, false],
      [false, true, false],
    ],
    F: [
      [false, false, false],
      [false, true, true],
      [false, true, false],
    ],
  };

  const grid = Array(lines.length * 3)
    .fill(null)
    .map(() => Array(lines[0].length * 3).fill(false));

  let sLineRow;
  let sLineCol;

  for (let row = 0; row < lines.length; row++) {
    for (let col = 0; col < lines[0].length; col++) {
      if (lines[row][col] === "S") {
        sLineRow = row;
        sLineCol = col;
      }
      if (!(lines[row][col] in map)) {
        continue;
      }
      const shape = map[lines[row][col]];
      for (let subRow = 0; subRow < 3; subRow++) {
        for (let subCol = 0; subCol < 3; subCol++) {
          grid[row * 3 + subRow][col * 3 + subCol] = shape[subRow][subCol];
        }
      }
    }
  }

  // Up
  if (map[lines[sLineRow - 1]?.[sLineCol]]?.[2]?.[1]) {
    grid[sLineRow * 3][sLineCol * 3 + 1] = true;
  }
  // Right
  if (map[lines[sLineRow]?.[sLineCol + 1]]?.[1]?.[0]) {
    grid[sLineRow * 3 + 1][sLineCol * 3 + 2] = true;
  }
  // Down
  if (map[lines[sLineRow + 1]?.[sLineCol]]?.[0]?.[1]) {
    grid[sLineRow * 3 + 2][sLineCol * 3 + 1] = true;
  }
  // Left
  if (map[lines[sLineRow]?.[sLineCol - 1]]?.[1]?.[2]) {
    grid[sLineRow * 3 + 1][sLineCol * 3] = true;
  }

  let row = sLineRow * 3 + 1;
  let col = sLineCol * 3 + 1;

  grid[row][col] = true;

  const onLineLoop = Array(grid.length)
    .fill(null)
    .map(() => Array(grid[0].length).fill(false));

  while (true) {
    let found = false;
    for (const [dr, dc] of [
      [-1, 0],
      [0, 1],
      [1, 0],
      [0, -1],
    ]) {
      if (
        !(dr === 0 && dc === 0) &&
        !onLineLoop[row + dr][col + dc] &&
        grid[row + dr][col + dc]
      ) {
        row = row + dr;
        col = col + dc;
        found = true;
        break;
      }
    }

    if (!found) {
      break;
    }
    onLineLoop[row][col] = true;
  }

  const visited = Array(grid.length)
    .fill(null)
    .map(() => Array(grid[0].length).fill(false));

  const stack = [[0, 0]];
  while (stack.length !== 0) {
    const [row, col] = stack.pop();
    if (
      row < 0 ||
      row >= grid.length ||
      col < 0 ||
      col >= grid[0].length ||
      visited[row][col] ||
      onLineLoop[row][col]
    ) {
      continue;
    }
    visited[row][col] = true;
    for (let dr = -1; dr <= 1; dr++) {
      for (let dc = -1; dc <= 1; dc++) {
        stack.push([row + dr, col + dc]);
      }
    }
  }

  let onLineLoopScaledDownCount = 0;
  let visitedScaledDownCount = 0;

  for (let row = 0; row < lines.length; row++) {
    for (let col = 0; col < lines[0].length; col++) {
      let isOnLineLoop = false;
      let wasVisited = false;
      for (let subRow = 0; subRow < 3; subRow++) {
        for (let subCol = 0; subCol < 3; subCol++) {
          if (onLineLoop[row * 3 + subRow][col * 3 + subCol]) {
            isOnLineLoop = true;
          }
          if (visited[row * 3 + subRow][col * 3 + subCol]) {
            wasVisited = true;
          }
        }
      }
      if (isOnLineLoop) {
        onLineLoopScaledDownCount++;
      }
      if (wasVisited && !isOnLineLoop) {
        visitedScaledDownCount++;
      }
    }
  }

  return (
    lines.length * lines[0].length -
    onLineLoopScaledDownCount -
    visitedScaledDownCount
  );
})();
