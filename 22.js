(() => {
  const lines = document
    .querySelector("pre")
    .innerText.split("\n")
    .filter((e) => !!e);

  const lines2 = `1,0,1~1,2,1
0,0,2~2,0,2
0,2,3~2,2,3
0,0,4~0,2,4
2,0,5~2,2,5
0,1,6~2,1,6
1,1,8~1,1,9`.split("\n");

  const data = lines.map((line) => {
    return line
      .split("~")
      .map((brick) => {
        const [x, y, z] = brick.split(",").map((e) => parseInt(e));
        return { x, y, z };
      })
      .sort((b1, b2) => b1.z - b2.z);
  });

  const sorted = data.sort((b1, b2) => b1[0].z - b2[0].z);
  const highest = {};
  const numAtZ = {};
  const newBricks = [];
  for (const brick of sorted) {
    let lastHighest = 0;
    const firstX = Math.min(brick[0].x, brick[1].x);
    const secondX = Math.max(brick[0].x, brick[1].x);
    const firstY = Math.min(brick[0].y, brick[1].y);
    const secondY = Math.max(brick[0].y, brick[1].y);
    for (let x = firstX; x <= secondX; x++) {
      for (let y = firstY; y <= secondY; y++) {
        const key = `${x},${y}`;
        lastHighest = Math.max(highest[key] ?? 0, lastHighest);
      }
    }

    const newLastHighest = lastHighest + 1 + brick[1].z - brick[0].z;

    const newBrick = [
      { x: brick[0].x, y: brick[0].y, z: lastHighest + 1 },
      { x: brick[1].x, y: brick[1].y, z: newLastHighest },
    ];

    newBricks.push(newBrick);

    numAtZ[newLastHighest] ??= {};

    for (let x = firstX; x <= secondX; x++) {
      for (let y = firstY; y <= secondY; y++) {
        const key = `${x},${y}`;
        highest[key] = newLastHighest;
        numAtZ[newLastHighest][key] ??= new Set();
        numAtZ[newLastHighest][key].add(JSON.stringify(newBrick));
      }
    }
  }

  const needed = new Set();

  for (const brick of newBricks) {
    const firstX = Math.min(brick[0].x, brick[1].x);
    const secondX = Math.max(brick[0].x, brick[1].x);
    const firstY = Math.min(brick[0].y, brick[1].y);
    const secondY = Math.max(brick[0].y, brick[1].y);
    const supportedBy = new Set();
    for (let x = firstX; x <= secondX; x++) {
      for (let y = firstY; y <= secondY; y++) {
        const key = `${x},${y}`;
        const below = numAtZ[brick[0].z - 1]?.[key] ?? new Set();
        for (const brickBelow of Array.from(below)) {
          supportedBy.add(brickBelow);
        }
      }
    }
    if (supportedBy.size < 2) {
      for (const brick of Array.from(supportedBy)) {
        needed.add(brick);
      }
    }
    // console.log(brick, supportedBy)
  }

  return newBricks.length - needed.size;

  return { newBricks, highest, numAtZ, needed };
})();
