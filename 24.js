(() => {
  const input = [
    document
      .querySelector("pre")
      .innerText.split("\n")
      .filter((e) => !!e),
    200000000000000,
    400000000000000,
  ];

  const input2 = [
    `19, 13, 30 @ -2,  1, -2
18, 19, 22 @ -1, -1, -2
20, 25, 34 @ -2, -2, -4
12, 31, 28 @ -1, -2, -1
20, 19, 15 @  1, -5, -3`.split("\n"),
    7,
    27,
  ];

  const [lines, MIN, MAX] = input;

  const data = lines.map((line) => {
    const [x, y, z, vx, vy, vz] = line
      .replace("@", "")
      .split(" ")
      .filter((e) => !!e)
      .map((e) => parseInt(e.trim()));
    return { x, y, vx, vy };
  });

  // y = mx + b
  // 19, 13; -2, 1 => 13 = (-1/2) * 19 + b => b = 13 + 9.5 = 22.5 => y = (-1/2)x + 22.5
  // 18, 19; -1, -1 => 19 = (1) * 18 + b => b = 1; y = x + 1
  // (-0.5)x + 22.5 = x + 1
  // 21.5 = 1.5x
  // x = 21.5 / 1.5 = 14.33333
  // y = 15.33333

  let count = 0;

  for (let firstI = 0; firstI < data.length - 1; firstI++) {
    for (let secondI = firstI + 1; secondI < data.length; secondI++) {
      const first = data[firstI];
      const second = data[secondI];
      const firstM = first.vy / first.vx;
      const firstB = first.y - firstM * first.x;
      const secondM = second.vy / second.vx;
      const secondB = second.y - secondM * second.x;
      const xIntersection = (secondB - firstB) / (firstM - secondM);
      const yIntersection = firstM * xIntersection + firstB;

      if (
        MIN <= xIntersection &&
        xIntersection <= MAX &&
        MIN <= yIntersection &&
        yIntersection <= MAX &&
        (first.vx < 0 ? xIntersection <= first.x : xIntersection >= first.x) &&
        (second.vx < 0 ? xIntersection <= second.x : xIntersection >= second.x)
      ) {
        // console.log({ first, second, firstM, firstB, secondM, secondB });
        count++;
      }
    }
  }

  return count;
})();
