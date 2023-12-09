// part one
(() => {
  const lines = document
    .querySelector("pre")
    .innerText.split("\n")
    .filter((e) => !!e);

  const directions = lines[0];
  const map = {};
  for (const line of lines.slice(1)) {
    const node = line.split(" =")[0];
    const L = line.split("(")[1].split(",")[0];
    const R = line.split(", ")[1].split(")")[0];
    map[node] = { L, R };
  }

  let steps = 0;
  let curr = "AAA";
  while (curr !== "ZZZ") {
    curr = map[curr][directions[steps % directions.length]];
    steps++;
  }
  return steps;
})();

// part two
(() => {
  const lines = document
    .querySelector("pre")
    .innerText.split("\n")
    .filter((e) => !!e);

  const directions = lines[0];
  const map = {};
  for (const line of lines.slice(1)) {
    const node = line.split(" =")[0];
    const L = line.split("(")[1].split(",")[0];
    const R = line.split(", ")[1].split(")")[0];
    map[node] = { L, R };
  }

  const data = Object.keys(map)
    .filter((k) => k.endsWith("A"))
    .map((a) => {
      let curr = a;
      let steps = 0;
      let good = [];
      while (true) {
        if (curr.endsWith("Z")) {
          if (
            good.some(
              (entry) =>
                entry.curr === curr &&
                entry.steps % directions.length === steps % directions.length
            )
          ) {
            break;
          }
          good.push({ curr, steps });
        }
        curr = map[curr][directions[steps % directions.length]];
        steps++;
      }
      return good;
    });

  const getFactors = (num) => {
    let curr = num;
    let i = 2;
    const factors = [];
    while (curr !== 1) {
      while (curr % i === 0) {
        curr /= i;
        factors.push(i);
      }
      i++;
    }
    return factors;
  };

  return (
    data.map((e) => e[0].steps / directions.length).reduce((a, e) => a * e, 1) *
    263
  );
})();

// Not particularly proud of this solution. I ended up just finding each of the
// points at which the As would reach Zs, and noticing that for each of them
// the following was true: it'd reach the same Z, and it'd reach the same Z
// at the same direction index.
// So because for each of them there was only "one way" to get to a Z, I factored
// each of the step counts to get there. Interestingly, they each had a factorization of
// (total # of directions) and (some prime number).
// I would have thought at least one would include more than two primes in its
// factorization. Anyway, that allowed me to just take each of the step counts
// and divide by the direction length (263), multiply them together, and then multiply
// by 263 to get the least common multiple.
// Not a very satisfying solution, but it got the job done.
