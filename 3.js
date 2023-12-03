// part one
(() => {
  const lines = document
    .querySelector("pre")
    .innerText.split("\n")
    .filter((e) => !!e);

  let currNum = undefined;
  let nearSymbol = false;
  let partNumberSum = 0;

  const isNearSymbol = (row, col) => {
    for (let dRow = -1; dRow <= 1; dRow++) {
      for (let dCol = -1; dCol <= 1; dCol++) {
        const nearbyChar = lines[row + dRow]?.[col + dCol];
        if (
          nearbyChar &&
          nearbyChar !== "." &&
          Number.isNaN(parseInt(nearbyChar))
        ) {
          return true;
        }
      }
    }
  };

  const endNum = () => {
    if (currNum !== undefined && nearSymbol) {
      partNumberSum += currNum;
    }
    currNum = undefined;
    nearSymbol = false;
  };

  for (let row = 0; row < lines.length; row++) {
    for (let col = 0; col < lines[row].length; col++) {
      const digit = parseInt(lines[row][col]);

      if (Number.isNaN(digit)) {
        endNum();
        continue;
      }

      if (currNum === undefined) {
        currNum = digit;
      } else {
        currNum = currNum * 10 + digit;
      }
      nearSymbol ||= isNearSymbol(row, col);
    }
    endNum();
  }

  return partNumberSum;
})();

// part two
(() => {
  const lines = document
    .querySelector("pre")
    .innerText.split("\n")
    .filter((e) => !!e);

  let currNum = undefined;
  let currNumAssociatedGears = new Set();
  const gearsMap = {};

  const getNearbyGears = (row, col) => {
    const gears = [];
    for (let dRow = -1; dRow <= 1; dRow++) {
      for (let dCol = -1; dCol <= 1; dCol++) {
        const nearbyChar = lines[row + dRow]?.[col + dCol];
        if (nearbyChar === "*") {
          gears.push(`${row + dRow},${col + dCol}`);
        }
      }
    }
    return gears;
  };

  const endNum = () => {
    for (const gear of currNumAssociatedGears) {
      gearsMap[gear] ??= [];
      gearsMap[gear].push(currNum);
    }
    currNumAssociatedGears = new Set();
    currNum = undefined;
  };

  for (let row = 0; row < lines.length; row++) {
    for (let col = 0; col < lines[row].length; col++) {
      const digit = parseInt(lines[row][col]);

      if (Number.isNaN(digit)) {
        endNum();
        continue;
      }

      if (currNum === undefined) {
        currNum = digit;
      } else {
        currNum = currNum * 10 + digit;
      }

      const nearbyGears = getNearbyGears(row, col);
      for (const gear of nearbyGears) {
        currNumAssociatedGears.add(gear);
      }
    }
    endNum();
  }

  return Object.values(gearsMap).reduce((tot, nums) => {
    if (nums.length !== 2) {
      return tot;
    }
    return tot + nums[0] * nums[1];
  }, 0);
})();

// I couldn't figure out why my answer to part one was failing, until I tried
// running the solution locally with node and the input fed in as an inlined
// string. The problem was that I had been using `innerHTML` rather than
// `innerText` so `&` was read as `&amp`, completely throwing off the answer.
//
// Lesson learned!
