// part one
(() => {
  const lines = document
    .querySelector("pre")
    .innerText.split("\n")
    .filter((e) => !!e);

  return lines
    .map((line) => {
      const [winners, mine] = line
        .split(":")[1]
        .split("|")
        .map((group) => group.split(" ").filter((num) => !!num));

      const myWinnerCount = mine.filter((num) => winners.includes(num)).length;
      if (myWinnerCount === 0) {
        return 0;
      }
      return Math.pow(2, myWinnerCount - 1);
    })
    .reduce((tot, points) => tot + points, 0);
})();

// part two
(() => {
  const lines = document
    .querySelector("pre")
    .innerText.split("\n")
    .filter((e) => !!e);

  const winCounts = lines.map((line) => {
    const [winners, mine] = line
      .split(":")[1]
      .split("|")
      .map((group) => group.split(" ").filter((num) => !!num));

    return mine.filter((num) => winners.includes(num)).length;
  });

  const cardCounts = Array(lines.length).fill(1);

  for (let i = 0; i < lines.length; ++i) {
    for (
      let copyIndex = i + 1;
      copyIndex <= Math.min(i + winCounts[i], lines.length - 1);
      copyIndex++
    ) {
      cardCounts[copyIndex] = cardCounts[copyIndex] + cardCounts[i];
    }
  }

  return cardCounts.reduce((tot, count) => tot + count, 0);
})();
