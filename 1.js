// part one
(() => {
  const isDigit = (c) => c >= "0" && c <= "9";

  return document
    .querySelector("pre")
    .innerText.split("\n")
    .map((str) => {
      const arr = Array.from(str);
      return parseInt(arr.find(isDigit) + arr.findLast(isDigit)) || 0;
    })
    .reduce((tot, num) => tot + num, 0);
})();

// part two
(() => {
  const digits = [
    "zero",
    "one",
    "two",
    "three",
    "four",
    "five",
    "six",
    "seven",
    "eight",
    "nine",
  ];
  const isDigit = (c) => c >= "0" && c <= "9";

  return document
    .querySelector("pre")
    .innerText.split("\n")
    .filter((e) => !!e)
    .map((str) => {
      let first = -1;
      let last = -1;
      for (let i = 0; i < str.length; ++i) {
        let num = -1;
        if (isDigit(str[i])) {
          num = parseInt(str[i]);
        } else {
          for (let di = 0; di < digits.length; di++) {
            const digit = digits[di];
            const start = i - digit.length + 1;
            if (start >= 0 && str.slice(start, i + 1) === digit) {
              num = di;
              break;
            }
          }
        }
        if (num !== -1) {
          if (first === -1) {
            first = num;
          }
          last = num;
        }
      }
      return first * 10 + last;
    })
    .reduce((a, e) => a + e, 0);
})();
