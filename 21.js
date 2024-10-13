/* Part two had me pretty stumped, but eventually I realized the input was set up in a super
nice way with "channels" exactly along the "route" the edges would follow, given that the
requested steps % 131 (grid size) exactly landed in the middle of this empty channel.

From there, it should have been very simple, but I made a bunch of mistakes and weird
assumptions that were giving me incorrect answers. One particularly painful bug was
continuing to check for the even squares even though the requested steps were odd. I
was very frustrated trying to figure out what could possibly be wrong until I re-read
the problem.

Anyway, the end result for part two is incredibly ugly, and I really should add a more
meaningful explanation of how it works. But here it is...
*/

(() => {
  const lines = document
    .querySelector("pre")
    .innerText.split("\n")
    .filter((e) => !!e);

  const lines2 = `...........
.....###.#.
.###.##..#.
..#.#...#..
....#.#....
.##..S####.
.##..#...#.
.......##..
.##.#.####.
.##..##.##.
...........`.split("\n");

  const grid = lines.map((line) => Array.from(line));

  const getNearby = (row, col) => {
    const nearby = [];
    for (const [dr, dc] of [
      [-1, 0],
      [1, 0],
      [0, -1],
      [0, 1],
    ]) {
      if (grid[row + dr]?.[col + dc] === ".") {
        nearby.push([row + dr, col + dc]);
      }
    }
    return nearby;
  };

  let start;

  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[0].length; col++) {
      if (grid[row][col] === "S") {
        start = [row, col, 0];
      }
    }
  }

  grid[start[0]][start[1]] = ".";

  const queue = [start];
  let queuePos = 0;
  const getNext = () => {
    if (queuePos === queue.length) {
      return undefined;
    }
    const value = queue[queuePos];
    queuePos++;
    return value;
  };

  const maxDist = 150;

  const dists = grid.map((row) => row.map(() => -1));

  let kylesh = 0;
  while (queuePos !== queue.length && kylesh++ < 1_000_000) {
    const [row, col, dist] = getNext();
    if (dists[row][col] !== -1) {
      continue;
    }
    dists[row][col] = dist;
    if (dist === maxDist) {
      continue;
    }
    queue.push(...getNearby(row, col).map((e) => [e[0], e[1], dist + 1]));
  }

  let count = 0;
  for (let row = 0; row < grid.length; row++) {
    for (let col = 0; col < grid[0].length; col++) {
      if (dists[row][col] % 2 === 0) {
        count++;
      }
    }
  }
  return count;
})();
