// part one
(() => {
  const lines = document
    .querySelector("pre")
    .innerText.split("\n")
    .filter((e) => !!e);

  const grid = lines.map((line) => Array.from(line));

  const beams = [{ position: [0, 0], direction: [0, 1] }];
  let seen = new Set();
  while (beams.length !== 0) {
    let { position, direction } = beams.pop();
    while (
      position[0] >= 0 &&
      position[0] < grid.length &&
      position[1] >= 0 &&
      position[1] < grid[0].length
    ) {
      const key = JSON.stringify({ position, direction });
      if (seen.has(key)) {
        break;
      }
      seen.add(key);
      const tile = grid[position[0]][position[1]];
      if (
        tile === "." ||
        (tile === "-" && direction[1] !== 0) ||
        (tile === "|" && direction[0] !== 0)
      ) {
        position[0] += direction[0];
        position[1] += direction[1];
      } else if (tile === "-") {
        beams.push(
          {
            position: [position[0], position[1] - 1],
            direction: [0, -1],
          },
          {
            position: [position[0], position[1] + 1],
            direction: [0, 1],
          }
        );
        break;
      } else if (tile === "|") {
        beams.push(
          {
            position: [position[0] - 1, position[1]],
            direction: [-1, 0],
          },
          {
            position: [position[0] + 1, position[1]],
            direction: [1, 0],
          }
        );
        break;
      } else if (tile === "/") {
        if (direction[0] === -1) {
          position[1] += 1;
          direction = [0, 1];
        } else if (direction[0] === 1) {
          position[1] -= 1;
          direction = [0, -1];
        } else if (direction[1] === -1) {
          position[0] += 1;
          direction = [1, 0];
        } else if (direction[1] === 1) {
          position[0] -= 1;
          direction = [-1, 0];
        } else {
          throw new Error("invalid-state");
        }
      } else if (tile === "\\") {
        if (direction[0] === -1) {
          position[1] -= 1;
          direction = [0, -1];
        } else if (direction[0] === 1) {
          position[1] += 1;
          direction = [0, 1];
        } else if (direction[1] === -1) {
          position[0] -= 1;
          direction = [-1, 0];
        } else if (direction[1] === 1) {
          position[0] += 1;
          direction = [1, 0];
        } else {
          throw new Error("invalid-state");
        }
      }
    }
  }

  const unique = new Set(
    Array.from(seen).map((entry) => JSON.stringify(JSON.parse(entry).position))
  );

  return unique.size;
})();

// part two
(() => {
  const lines = document
    .querySelector("pre")
    .innerText.split("\n")
    .filter((e) => !!e);

  const grid = lines.map((line) => Array.from(line));

  const traverse = (start, startDirection) => {
    const beams = [{ position: start, direction: startDirection }];
    let seen = new Set();
    while (beams.length !== 0) {
      let { position, direction } = beams.pop();
      while (
        position[0] >= 0 &&
        position[0] < grid.length &&
        position[1] >= 0 &&
        position[1] < grid[0].length
      ) {
        const key = JSON.stringify({ position, direction });
        if (seen.has(key)) {
          break;
        }
        seen.add(key);
        const tile = grid[position[0]][position[1]];
        if (
          tile === "." ||
          (tile === "-" && direction[1] !== 0) ||
          (tile === "|" && direction[0] !== 0)
        ) {
          position[0] += direction[0];
          position[1] += direction[1];
        } else if (tile === "-") {
          beams.push(
            {
              position: [position[0], position[1] - 1],
              direction: [0, -1],
            },
            {
              position: [position[0], position[1] + 1],
              direction: [0, 1],
            }
          );
          break;
        } else if (tile === "|") {
          beams.push(
            {
              position: [position[0] - 1, position[1]],
              direction: [-1, 0],
            },
            {
              position: [position[0] + 1, position[1]],
              direction: [1, 0],
            }
          );
          break;
        } else if (tile === "/") {
          if (direction[0] === -1) {
            position[1] += 1;
            direction = [0, 1];
          } else if (direction[0] === 1) {
            position[1] -= 1;
            direction = [0, -1];
          } else if (direction[1] === -1) {
            position[0] += 1;
            direction = [1, 0];
          } else if (direction[1] === 1) {
            position[0] -= 1;
            direction = [-1, 0];
          } else {
            throw new Error("invalid-state");
          }
        } else if (tile === "\\") {
          if (direction[0] === -1) {
            position[1] -= 1;
            direction = [0, -1];
          } else if (direction[0] === 1) {
            position[1] += 1;
            direction = [0, 1];
          } else if (direction[1] === -1) {
            position[0] -= 1;
            direction = [-1, 0];
          } else if (direction[1] === 1) {
            position[0] += 1;
            direction = [1, 0];
          } else {
            throw new Error("invalid-state");
          }
        }
      }
    }

    const unique = new Set(
      Array.from(seen).map((entry) =>
        JSON.stringify(JSON.parse(entry).position)
      )
    );

    return unique.size;
  };

  let best = -1;
  for (let row = 0; row < grid.length; row++) {
    best = Math.max(
      best,
      traverse([row, 0], [0, 1]),
      traverse([row, grid[0].length - 1], [0, -1])
    );
  }
  for (let col = 0; col < grid[0].length; col++) {
    best = Math.max(
      best,
      traverse([0, col], [1, 0]),
      traverse([grid.length - 1, col], [-1, 0])
    );
  }
  return best;
})();

// Part two was just a slight tweak to part one, and is totally boring and brute
// force, but it finishes on my Mac in Chrome in a little over 3s. There's
// probably a way to carefully memoize your results for a given position+direction.
// I might give that a try, but it seems a bit tricky knowing when to "stop" because
// your stopping point is informed by the positions+directions you've already been to,
// so you can't just take a cache result when the whole history of how you got to
// a given point informs how far you'll need to go after. Rambling...
