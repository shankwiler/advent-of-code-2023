// part one
(() => {
  const lines = document
    .querySelector("pre")
    .innerText.split("\n")
    .filter((e) => !!e);

  const data = lines[0].trim().split(",");

  const hash = (str) => {
    let result = 0;
    for (const c of str) {
      result = ((result + c.charCodeAt(0)) * 17) % 256;
    }
    return result;
  };

  return data.map((datum) => hash(datum)).reduce((a, c) => a + c, 0);
})();

// part two
(() => {
  const lines = document
    .querySelector("pre")
    .innerText.split("\n")
    .filter((e) => !!e);

  const data = lines[0].trim().split(",");

  const hash = (str) => {
    let result = 0;
    for (const c of str) {
      result = ((result + c.charCodeAt(0)) * 17) % 256;
    }
    return result;
  };

  const boxes = Array(256)
    .fill(null)
    .map(() => []);

  const regex = /(.+)(-|=)(.*)/;

  for (const datum of data) {
    const [, label, operation, focalLength] = datum.match(regex);
    const box = hash(label);
    if (operation === "-") {
      boxes[box] = boxes[box].filter((lens) => lens.label !== label);
    } else {
      const existingLens = boxes[box].find((lens) => lens.label === label);
      if (existingLens) {
        existingLens.focalLength = focalLength;
      } else {
        boxes[box].push({ label, focalLength });
      }
    }
  }

  return boxes.reduce(
    (tot, box, boxIndex) =>
      tot +
      box.reduce(
        (boxTot, lens, lensIndex) =>
          boxTot + (boxIndex + 1) * (lensIndex + 1) * lens.focalLength,
        0
      ),
    0
  );
})();
