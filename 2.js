// part one
(() => {
  const maxes = { red: 12, green: 13, blue: 14 };
  const getTurnCounts = (turn) => {
    const map = {};
    const descriptions = turn.split(",");
    for (const description of descriptions) {
      const [countRaw, color] = description.trim().split(" ");
      map[color] = parseInt(countRaw);
    }
    return map;
  };

  return document
    .querySelector("pre")
    .innerHTML.split("\n")
    .filter((e) => !!e)
    .filter((line) => {
      return line
        .split(":")[1]
        .split(";")
        .every((turn) => {
          const counts = getTurnCounts(turn);
          return Object.entries(counts).every(
            ([color, count]) => count <= maxes[color]
          );
        });
    })
    .map((e) => parseInt(e.split(" ")[1].split(":")[0]))
    .reduce((a, b) => a + b, 0);
})();

// part two
(() => {
  const getTurnCounts = (turn) => {
    const map = {};
    const descriptions = turn.split(",");
    for (const description of descriptions) {
      const [countRaw, color] = description.trim().split(" ");
      map[color] = parseInt(countRaw);
    }
    return map;
  };

  return document
    .querySelector("pre")
    .innerHTML.split("\n")
    .filter((e) => !!e)
    .map((line) => {
      const maxes = {};
      line
        .split(":")[1]
        .split(";")
        .forEach((turn) => {
          const counts = getTurnCounts(turn);
          Object.entries(counts).forEach(([color, count]) => {
            if (!maxes[color] || maxes[color] < count) {
              maxes[color] = count;
            }
          });
        });
      const maxCounts = Object.values(maxes);
      if (maxCounts.length < 3) {
        return 0;
      }
      return maxCounts.reduce((a, b) => a * b, 1);
    })
    .reduce((a, b) => a + b, 0);
})();
