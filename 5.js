// part one
(() => {
  const groups = document.querySelector("pre").innerText.split("\n\n");

  const seeds = groups[0]
    .split(":")[1]
    .trim()
    .split(" ")
    .map((n) => parseInt(n));
  const maps = groups.slice(1).map((group) =>
    group
      .split("\n")
      .slice(1)
      .map((line) => line.split(" ").map((n) => parseInt(n)))
      .map(([destination, source, range]) => ({
        source,
        destination,
        range,
      }))
      .sort((a, b) => b.source - a.source)
  );
  let lowestLocation = undefined;
  for (const seed of seeds) {
    let value = seed;
    for (const map of maps) {
      for (const entry of map) {
        if (value >= entry.source) {
          if (value < entry.source + entry.range) {
            const diff = entry.destination - entry.source;
            value = value + diff;
          }
          break;
        }
      }
    }
    if (lowestLocation === undefined || value < lowestLocation) {
      lowestLocation = value;
    }
  }
  return lowestLocation;
})();

// part two
(() => {
  const groups = document.querySelector("pre").innerText.split("\n\n");

  const seeds = groups[0]
    .split(":")[1]
    .trim()
    .split(" ")
    .reduce(
      ({ seeds, needsPair }, currString) => {
        const curr = parseInt(currString);
        if (needsPair === undefined) {
          return { seeds, needsPair: curr };
        }
        return {
          needsPair: undefined,
          seeds: [...seeds, { start: needsPair, end: needsPair + curr - 1 }],
        };
      },
      { seeds: [], needsPair: undefined }
    ).seeds;
  const maps = groups.slice(1).map((group) =>
    group
      .split("\n")
      .slice(1)
      .map((line) => line.split(" ").map((n) => parseInt(n)))
      .map(([destination, source, range]) => ({
        source,
        destination,
        range,
      }))
      .sort((a, b) => b.source - a.source)
  );

  const getSmallest = (start, givenEnd, mapIndex) => {
    if (mapIndex === maps.length) {
      return start;
    }
    let end = givenEnd;
    let smallest = Infinity;
    for (const group of maps[mapIndex]) {
      if (end < group.source) {
        continue;
      }

      const withinRangeSubgroup = [
        Math.max(start, group.source),
        Math.min(group.source + group.range - 1, end),
      ];

      const outsideRangeSubgroup = [
        Math.max(start, group.source + group.range),
        end,
      ];

      if (withinRangeSubgroup[0] <= withinRangeSubgroup[1]) {
        const diff = group.destination - group.source;
        smallest = Math.min(
          smallest,
          getSmallest(
            withinRangeSubgroup[0] + diff,
            withinRangeSubgroup[1] + diff,
            mapIndex + 1
          )
        );
      }

      if (outsideRangeSubgroup[0] <= outsideRangeSubgroup[1]) {
        smallest = Math.min(
          smallest,
          getSmallest(
            outsideRangeSubgroup[0],
            outsideRangeSubgroup[1],
            mapIndex + 1
          )
        );
      }

      end = group.source - 1;
      if (end < start) {
        break;
      }
    }
    if (start <= end) {
      smallest = Math.min(smallest, getSmallest(start, end, mapIndex + 1));
    }
    return smallest;
  };

  const smallestPerSeed = seeds.map(({ start, end }) =>
    getSmallest(start, end, 0)
  );
  return Math.min(...smallestPerSeed);
})();
