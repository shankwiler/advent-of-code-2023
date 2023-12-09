// part one
(() => {
  const lines = document
    .querySelector("pre")
    .innerText.split("\n")
    .filter((e) => !!e);

  return lines
    .map((line) => {
      const nums = line.split(" ").map((n) => parseInt(n));
      const pyramid = [nums];
      while (!pyramid[pyramid.length - 1].every((n) => n === 0)) {
        const newLine = [];
        const last = pyramid[pyramid.length - 1];
        for (let i = 1; i < last.length; ++i) {
          newLine.push(last[i] - last[i - 1]);
        }
        // ???
        if (newLine.length === 0) {
          newLine.push(0);
        }
        pyramid.push(newLine);
      }
      pyramid[pyramid.length - 1].push(0);
      for (let i = pyramid.length - 2; i >= 0; --i) {
        pyramid[i].push(
          pyramid[i][pyramid[i].length - 1] +
            pyramid[i + 1][pyramid[i + 1].length - 1]
        );
      }
      return pyramid[0][pyramid[0].length - 1];
    })
    .reduce((a, c) => a + c, 0);
})();

// part two
(() => {
  const lines = document
    .querySelector("pre")
    .innerText.split("\n")
    .filter((e) => !!e);

  return lines
    .map((line) => {
      const nums = line.split(" ").map((n) => parseInt(n));
      const pyramid = [nums];
      while (!pyramid[pyramid.length - 1].every((n) => n === 0)) {
        const newLine = [];
        const last = pyramid[pyramid.length - 1];
        for (let i = 1; i < last.length; ++i) {
          newLine.push(last[i] - last[i - 1]);
        }
        // ???
        if (newLine.length === 0) {
          newLine.push(0);
        }
        pyramid.push(newLine);
      }
      pyramid[pyramid.length - 1].unshift(0);
      for (let i = pyramid.length - 2; i >= 0; --i) {
        pyramid[i].unshift(pyramid[i][0] - pyramid[i + 1][0]);
      }
      return pyramid[0][0];
    })
    .reduce((a, c) => a + c, 0);
})();

// Boring brute force answer. I spent time thinking about Pascal's traingle
// and binomial coefficients but stopped short of actually finding a nice
// mathematical pattern to use. Someone on the advent of code subreddit
// linked this video, which is the type of solution I was looking for
// https://www.youtube.com/watch?v=4AuV93LOPcE.
