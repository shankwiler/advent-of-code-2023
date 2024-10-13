(() => {
  const lines = document
    .querySelector("pre")
    .innerText.split("\n")
    .filter((e) => !!e);

  const lines2 = `#.#####################
#.......#########...###
#######.#########.#.###
###.....#.>.>.###.#.###
###v#####.#v#.###.#.###
###.>...#.#.#.....#...#
###v###.#.#.#########.#
###...#.#.#.......#...#
#####.#.#.#######.#.###
#.....#.#.#.......#...#
#.#####.#.#.#########v#
#.#...#...#...###...>.#
#.#.#v#######v###.###v#
#...#.>.#...>.>.#.###.#
#####v#.#.###v#.#.###.#
#.....#...#...#.#.#...#
#.#########.###.#.#.###
#...###...#...#...#.###
###.###.#.###v#####v###
#...#...#.#.>.>.#.>.###
#.###.###.#.###.#.#v###
#.....###...###...#...#
#####################.#`.split("\n");

  const grid = lines.map((line) => Array.from(line.trim()));

  const points = {
    "0,1": [],
    [`${grid.length - 1},${grid[0].length - 2}`]: [],
  };

  const directions = [
    [-1, 0],
    [1, 0],
    [0, -1],
    [0, 1],
  ];

  const getNearby = (row, col) => {
    return directions
      .map(([dr, dc]) => [row + dr, col + dc])
      .filter(([r, c]) => grid[r]?.[c] && grid[r][c] !== "#");
  };

  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[0].length; col++) {
      if (grid[row][col] === "#") {
        continue;
      }
      const options = getNearby(row, col).length;
      if (options > 2) {
        points[`${row},${col}`] = [];
      }
    }
  }

  for (const point of Object.keys(points)) {
    const [row, col] = point.split(",").map((e) => parseInt(e));
    for (const [newR, newC] of getNearby(row, col)) {
      let prev = [row, col];
      let curr = [newR, newC];
      let length = 1;
      while (true) {
        const nearby = getNearby(curr[0], curr[1]);
        if (nearby.length !== 2) {
          points[point].push([...curr, length]);
          break;
        }
        const other = nearby.find(([r, c]) => r !== prev[0] || c !== prev[1]);
        prev = curr;
        curr = other;
        length++;
      }
    }
  }

  let best = 0;

  const solve = (row, col, seen, dist) => {
    if (row === grid.length - 1 && grid[row][col] === ".") {
      best = Math.max(best, dist);
      return;
    }
    const key = `${row},${col}`;
    if (!grid[row]?.[col] || grid[row][col] === "#" || seen.has(key)) {
      return;
    }
    seen.add(key);
    for (const [r, c, extraDist] of points[key]) {
      solve(r, c, seen, dist + extraDist);
    }
    seen.delete(key);
  };

  solve(0, 1, new Set(), 0);

  return best;
})();
