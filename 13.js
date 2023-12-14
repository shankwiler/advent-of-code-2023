// part one
(() => {
  const data = document
    .querySelector("pre")
    .innerText.split("\n\n")
    .map((group) => group.split("\n"));

  const findMirrorPosition = (group) => {
    for (let i = 1; i < group[0].length; i++) {
      const start = Math.max(0, i - (group[0].length - i));
      const end = Math.min(group[0].length, i + i);
      const isGood = group.every(
        (line) =>
          line.slice(start, i) ===
          Array.from(line.slice(i, end)).reverse().join("")
      );
      if (isGood) {
        return i;
      }
    }

    return -1;
  };

  const getMirrored = (group) => {
    const newGroup = [];
    for (let col = group[0].length - 1; col >= 0; col--) {
      const newLine = [];
      for (let row = 0; row < group.length; row++) {
        newLine.push(group[row][col]);
      }
      newGroup.push(newLine.join(""));
    }
    return newGroup;
  };

  return data
    .map((group) => {
      const verticalPosition = findMirrorPosition(group);
      if (verticalPosition !== -1) {
        return verticalPosition;
      }
      const mirrored = getMirrored(group);
      const horizontalPosition = findMirrorPosition(mirrored);
      if (horizontalPosition !== -1) {
        return horizontalPosition * 100;
      }
      throw new Error("not found");
    })
    .reduce((tot, c) => tot + c, 0);
})();

// part two
(() => {
  const data = document
    .querySelector("pre")
    .innerText.split("\n\n")
    .map((group) => group.split("\n"));

  const findMirrorPosition = (group) => {
    for (let i = 1; i < group[0].length; i++) {
      const start = Math.max(0, i - (group[0].length - i));
      const end = Math.min(group[0].length, i + i);
      const numBad = group.filter(
        (line) =>
          line.slice(start, i) !==
          Array.from(line.slice(i, end)).reverse().join("")
      ).length;
      if (numBad === 1) {
        return i;
      }
    }

    return -1;
  };

  const getMirrored = (group) => {
    const newGroup = [];
    for (let col = group[0].length - 1; col >= 0; col--) {
      const newLine = [];
      for (let row = 0; row < group.length; row++) {
        newLine.push(group[row][col]);
      }
      newGroup.push(newLine.join(""));
    }
    return newGroup;
  };

  return data
    .map((group) => {
      const verticalPosition = findMirrorPosition(group);
      if (verticalPosition !== -1) {
        return verticalPosition;
      }
      const mirrored = getMirrored(group);
      const horizontalPosition = findMirrorPosition(mirrored);
      if (horizontalPosition !== -1) {
        return horizontalPosition * 100;
      }
      throw new Error("not found");
    })
    .reduce((tot, c) => tot + c, 0);
})();

// I need to start solving these during the day... I went to bed frustrated
// that I was getting strange results for part one. Woke up unrefreshed
// having mulled it over in my sleep but with the realization that there was
// an off-by-one error in the for loop.
