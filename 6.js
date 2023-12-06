// part one
(() => {
  const getNums = (line) =>
    line
      .split(" ")
      .map((e) => parseInt(e))
      .filter((e) => !Number.isNaN(e));
  const lines = document
    .querySelector("pre")
    .innerText.split("\n")
    .filter((e) => !!e)
    .map((line) => getNums(line));
  const data = lines[0].map((time, i) => ({ time, distance: lines[1][i] }));
  const solutions = data.map(({ time, distance }) => {
    const sqrtPortion = Math.pow(Math.pow(time, 2) - 4 * distance, 0.5);
    const min = (time - sqrtPortion) / 2;
    const max = (time + sqrtPortion) / 2;
    // If min is 1.5, we can use 2 onwards. min is 1, we can still only use 2
    // onwards, because we solved for (hold down) to be exactly equal to the
    // required distance. Adding 1 and flooring is a trick to get both 1.5 and 1
    // to map to 2.
    return Math.ceil(max - 1) - Math.floor(min + 1) + 1;
  });
  return solutions.reduce((a, c) => a * c, 1);
})();

// part two
(() => {
  const getNums = (line) =>
    parseInt(
      line
        .split(" ")
        .filter((e) => !Number.isNaN(parseInt(e)))
        .join("")
    );
  const lines = document
    .querySelector("pre")
    .innerText.split("\n")
    .filter((e) => !!e)
    .map((line) => getNums(line));
  const [time, distance] = lines;
  const sqrtPortion = Math.pow(Math.pow(time, 2) - 4 * distance, 0.5);
  const min = (time - sqrtPortion) / 2;
  const max = (time + sqrtPortion) / 2;
  return Math.ceil(max - 1) - Math.floor(min + 1) + 1;
})();

// distance = (time held down) * (total time - time held down)
// d = h * (t - h)
// d = h*t - h^2
// -d = h^2 - h*t
// 0 = h^2 - h*t + d
// h = (t (+/-) (t^2 - 4*d)^.5) / 2
