// part one
(() => {
  const lines = document
    .querySelector("pre")
    .innerText.split("\n")
    .filter((e) => !!e);

  const data = lines.map((line) => {
    const [dir, stepsRaw] = line.split(" ");
    return { dir, steps: parseInt(stepsRaw) };
  });

  const totalSteps = data.map((e) => e.steps).reduce((a, c) => a + c, 0);

  const grid = Array(totalSteps * 2)
    .fill(null)
    .map(() => Array(totalSteps * 2).fill(false));

  const map = {
    U: [-1, 0],
    R: [0, 1],
    D: [1, 0],
    L: [0, -1],
  };

  let curr = [totalSteps, totalSteps];

  grid[curr[0]][curr[1]] = true;

  let earliestRow = curr[0];
  let earliestCol = curr[1];
  let latestRow = curr[0];
  let latestCol = curr[1];

  for (const line of data) {
    for (let i = 0; i < line.steps; i++) {
      curr = [curr[0] + map[line.dir][0], curr[1] + map[line.dir][1]];
      grid[curr[0]][curr[1]] = true;

      earliestRow = Math.min(curr[0], earliestRow);
      latestRow = Math.max(curr[0], latestRow);
      earliestCol = Math.min(curr[1], earliestCol);
      latestCol = Math.max(curr[1], latestCol);
    }
  }

  const stack = [];
  for (let row = earliestRow; row <= latestRow; row++) {
    stack.push([row, earliestCol]);
    stack.push([row, latestCol]);
  }

  for (let col = earliestCol; col <= latestCol; col++) {
    stack.push([earliestRow, col]);
    stack.push([latestRow, col]);
  }

  const seen = grid.map((row) => row.map(() => false));

  while (stack.length !== 0) {
    const [row, col] = stack.pop();
    if (
      row < earliestRow ||
      row > latestRow ||
      col < earliestCol ||
      col > latestCol ||
      seen[row][col] ||
      grid[row][col]
    ) {
      continue;
    }
    seen[row][col] = true;
    for (let dr = -1; dr < 2; dr++) {
      for (let dc = -1; dc < 2; dc++) {
        stack.push([row + dr, col + dc]);
      }
    }
  }

  let unreachable = 0;
  for (let row = earliestRow; row <= latestRow; row++) {
    for (let col = earliestCol; col <= latestCol; col++) {
      if (!seen[row][col]) {
        unreachable++;
      }
    }
  }

  const outGrid = [];
  for (let row = earliestRow; row <= latestRow; row++) {
    const outRow = [];
    for (let col = earliestCol; col <= latestCol; col++) {
      outRow.push(grid[row][col] ? "#" : ".");
    }
    outGrid.push(outRow.join(""));
  }

  return unreachable;
})();

// part two
(() => {
  const lines = document
    .querySelector("pre")
    .innerText.split("\n")
    .filter((e) => !!e);

  const data = lines.map((line) => {
    const hex = line.split("#")[1].split(")")[0];
    const steps = parseInt(hex.slice(0, 5), 16);
    const dir = { 0: "R", 1: "D", 2: "L", 3: "U" }[hex.slice(-1)[0]];
    return { steps, dir };
  });

  const map = {
    U: [-1, 0],
    R: [0, 1],
    D: [1, 0],
    L: [0, -1],
  };

  const getPositionInSquare = (pos, curr, next) => {
    if (curr.dir === "U" && next.dir === "R") {
      return pos[1] === 0 ? [0, 0] : [1, 1];
    }
    if (curr.dir === "U" && next.dir === "L") {
      return pos[1] === 0 ? [1, 0] : [0, 1];
    }
    if (curr.dir === "R" && next.dir === "U") {
      return pos[0] === 0 ? [0, 0] : [1, 1];
    }
    if (curr.dir === "R" && next.dir === "D") {
      return pos[0] === 0 ? [0, 1] : [1, 0];
    }
    if (curr.dir === "D" && next.dir === "L") {
      return pos[1] === 0 ? [0, 0] : [1, 1];
    }
    if (curr.dir === "D" && next.dir === "R") {
      return pos[1] === 0 ? [1, 0] : [0, 1];
    }
    if (curr.dir === "L" && next.dir === "U") {
      return pos[0] === 0 ? [0, 1] : [1, 0];
    }
    if (curr.dir === "L" && next.dir === "D") {
      return pos[0] === 0 ? [0, 0] : [1, 1];
    }
    throw new Error(`bad state ${curr.dir} ${next.dir} ${pos}`);
  };

  let curr = [0, 0];
  let positionInSquare = [0, 0];

  // use the shoelace formula
  // all this position in square nonsense is to account for the perimiter being at different
  // points around the block you just drew.
  //  (0,0) (0,1)
  //       #
  //  (1,0) (1,1)
  // this is probably way more complicated than it needs to be

  let sum = 0;
  for (let i = 0; i < data.length; i++) {
    const nextPositionInSquare = getPositionInSquare(
      positionInSquare,
      data[i],
      i === data.length - 1 ? data[0] : data[i + 1]
    );
    const direction = map[data[i].dir];
    const nextCoordinate = [
      curr[0] +
        data[i].steps * direction[0] +
        nextPositionInSquare[0] -
        positionInSquare[0],
      curr[1] +
        data[i].steps * direction[1] +
        nextPositionInSquare[1] -
        positionInSquare[1],
    ];
    sum += curr[0] * nextCoordinate[1] - nextCoordinate[0] * curr[1];
    curr = nextCoordinate;
    positionInSquare = nextPositionInSquare;
  }

  return Math.abs(sum / 2);
})();
