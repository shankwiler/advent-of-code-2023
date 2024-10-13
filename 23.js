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

  const arrowMap = {
    "^": [-1, 0],
    ">": [0, 1],
    v: [1, 0],
    "<": [0, -1],
  };

  let best = 0;

  const solve = (row, col, seen) => {
    if (row === grid.length - 1 && grid[row][col] === ".") {
      best = Math.max(best, seen.size);
      return;
    }
    const key = `${row},${col}`;
    if (!grid[row]?.[col] || grid[row][col] === "#" || seen.has(key)) {
      return;
    }
    seen.add(key);
    if (grid[row][col] in arrowMap) {
      const [dr, dc] = arrowMap[grid[row][col]];
      solve(row + dr, col + dc, seen);
    } else {
      for (const [dr, dc] of [
        [-1, 0],
        [1, 0],
        [0, -1],
        [0, 1],
      ]) {
        solve(row + dr, col + dc, seen);
      }
    }
    seen.delete(key);
  };

  solve(0, 1, new Set());

  return best;
})();
