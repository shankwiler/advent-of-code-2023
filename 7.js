// part one
(() => {
  const lines = document
    .querySelector("pre")
    .innerText.split("\n")
    .filter((e) => !!e);

  const getKind = (hand) => {
    const cards = Array.from(hand);
    const countsMap = cards.reduce(
      (_counts, card) => ({
        ..._counts,
        [card]: (_counts[card] ?? 0) + 1,
      }),
      {}
    );
    const counts = Object.values(countsMap).sort((a, b) => b - a);
    if (counts[0] === 5) {
      return 6;
    }
    if (counts[0] === 4) {
      return 5;
    }
    if (counts[0] === 3 && counts[1] === 2) {
      return 4;
    }
    if (counts[0] === 3) {
      return 3;
    }
    if (counts[0] === 2 && counts[1] === 2) {
      return 2;
    }
    if (counts[0] === 2) {
      return 1;
    }
    return 0;
  };

  const getCardRank = (card) => {
    return { A: 14, K: 13, Q: 12, J: 11, T: 10 }[card] ?? parseInt(card);
  };

  const getHandRank = (hand) => {
    return [getKind(hand), ...Array.from(hand).map((card) => getCardRank(card))]
      .map((value) => String.fromCharCode("a".charCodeAt(0) + value))
      .join("");
  };

  return lines
    .map((line) => {
      const [hand, bidString] = line.split(" ");
      const handRank = getHandRank(hand);
      return { handRank, bid: parseInt(bidString) };
    })
    .sort((datumA, datumB) => datumA.handRank.localeCompare(datumB.handRank))
    .reduce((total, { bid }, index) => total + bid * (index + 1), 0);
})();

// part two
(() => {
  const lines = document
    .querySelector("pre")
    .innerText.split("\n")
    .filter((e) => !!e);

  const getKind = (hand) => {
    if (hand === "JJJJJ") {
      return 6;
    }

    const cards = Array.from(hand);
    const countsMapWithJokers = cards.reduce(
      (_counts, card) => ({
        ..._counts,
        [card]: (_counts[card] ?? 0) + 1,
      }),
      {}
    );
    const mostFrequentCard = Object.entries(countsMapWithJokers)
      .filter(([card]) => card !== "J")
      .sort(([, countA], [, countB]) => countB - countA)[0][0];
    const countsMap = {
      ...countsMapWithJokers,
      J: 0,
      [mostFrequentCard]:
        countsMapWithJokers[mostFrequentCard] + (countsMapWithJokers.J ?? 0),
    };
    const counts = Object.values(countsMap).sort((a, b) => b - a);
    if (counts[0] === 5) {
      return 6;
    }
    if (counts[0] === 4) {
      return 5;
    }
    if (counts[0] === 3 && counts[1] === 2) {
      return 4;
    }
    if (counts[0] === 3) {
      return 3;
    }
    if (counts[0] === 2 && counts[1] === 2) {
      return 2;
    }
    if (counts[0] === 2) {
      return 1;
    }
    return 0;
  };

  const getCardRank = (card) => {
    return { A: 14, K: 13, Q: 12, J: 11, T: 10, J: 1 }[card] ?? parseInt(card);
  };

  const getHandRank = (hand) => {
    return [getKind(hand), ...Array.from(hand).map((card) => getCardRank(card))]
      .map((value) => String.fromCharCode("a".charCodeAt(0) + value))
      .join("");
  };

  return lines
    .map((line) => {
      const [hand, bidString] = line.split(" ");
      const handRank = getHandRank(hand);
      return { handRank, bid: parseInt(bidString) };
    })
    .sort((datumA, datumB) => datumA.handRank.localeCompare(datumB.handRank))
    .reduce((total, { bid }, index) => total + bid * (index + 1), 0);
})();
