// part one
(() => {
  const lines = document
    .querySelector("pre")
    .innerText.split("\n")
    .filter((e) => !!e);

  const noGalaxyRows = new Set();
  const noGalaxyCols = new Set();

  for (let row = 0; row < lines.length; row++) {
    let galaxySeen = false;
    for (let col = 0; col < lines[0].length; col++) {
      if (lines[row][col] === "#") {
        galaxySeen = true;
        break;
      }
    }
    if (!galaxySeen) {
      noGalaxyRows.add(row);
    }
  }

  for (let col = 0; col < lines[0].length; col++) {
    let galaxySeen = false;
    for (let row = 0; row < lines.length; row++) {
      if (lines[row][col] === "#") {
        galaxySeen = true;
        break;
      }
    }
    if (!galaxySeen) {
      noGalaxyCols.add(col);
    }
  }

  let row = 0;
  let col = 0;
  const galaxies = [];
  for (let realRow = 0; realRow < lines.length; realRow++) {
    col = 0;
    for (let realCol = 0; realCol < lines[0].length; realCol++) {
      if (lines[realRow][realCol] === "#") {
        galaxies.push([row, col]);
      }
      if (noGalaxyCols.has(realCol)) {
        col += 2;
      } else {
        col += 1;
      }
    }
    if (noGalaxyRows.has(realRow)) {
      row += 2;
    } else {
      row += 1;
    }
  }

  let distance = 0;

  for (let gIndex = 0; gIndex < galaxies.length; gIndex++) {
    for (let nextIndex = gIndex + 1; nextIndex < galaxies.length; nextIndex++) {
      distance +=
        Math.abs(galaxies[gIndex][0] - galaxies[nextIndex][0]) +
        Math.abs(galaxies[gIndex][1] - galaxies[nextIndex][1]);
    }
  }

  return distance;
})();

// part two
(() => {
  const lines = document
    .querySelector("pre")
    .innerText.split("\n")
    .filter((e) => !!e);

  const million = 1_000_000;

  const noGalaxyRows = new Set();
  const noGalaxyCols = new Set();

  for (let row = 0; row < lines.length; row++) {
    let galaxySeen = false;
    for (let col = 0; col < lines[0].length; col++) {
      if (lines[row][col] === "#") {
        galaxySeen = true;
        break;
      }
    }
    if (!galaxySeen) {
      noGalaxyRows.add(row);
    }
  }

  for (let col = 0; col < lines[0].length; col++) {
    let galaxySeen = false;
    for (let row = 0; row < lines.length; row++) {
      if (lines[row][col] === "#") {
        galaxySeen = true;
        break;
      }
    }
    if (!galaxySeen) {
      noGalaxyCols.add(col);
    }
  }

  let row = 0;
  let col = 0;
  const galaxies = [];
  for (let realRow = 0; realRow < lines.length; realRow++) {
    col = 0;
    for (let realCol = 0; realCol < lines[0].length; realCol++) {
      if (lines[realRow][realCol] === "#") {
        galaxies.push([row, col]);
      }
      if (noGalaxyCols.has(realCol)) {
        col += million;
      } else {
        col += 1;
      }
    }
    if (noGalaxyRows.has(realRow)) {
      row += million;
    } else {
      row += 1;
    }
  }

  let distance = 0;

  for (let gIndex = 0; gIndex < galaxies.length; gIndex++) {
    for (let nextIndex = gIndex + 1; nextIndex < galaxies.length; nextIndex++) {
      distance +=
        Math.abs(galaxies[gIndex][0] - galaxies[nextIndex][0]) +
        Math.abs(galaxies[gIndex][1] - galaxies[nextIndex][1]);
    }
  }

  return distance;
})();
