// part one
(() => {
  const lines = document
    .querySelector("pre")
    .innerText.split("\n")
    .filter((e) => !!e);

  const data = lines.map((line) => ({
    parts: line.split(" ")[0],
    counts: line
      .split(" ")[1]
      .split(",")
      .map((n) => parseInt(n)),
  }));

  const isValid = (parts, desiredCounts) => {
    const counts = parts
      .split(".")
      .filter((e) => !!e)
      .map((n) => n.length);
    return (
      counts.length === desiredCounts.length &&
      counts.every((count, index) => count === desiredCounts[index])
    );
  };

  const countConfigs = (parts, counts, partIndex, soFar) => {
    if (partIndex === parts.length) {
      return isValid(soFar.join(""), counts) ? 1 : 0;
    }

    if (parts[partIndex] !== "?") {
      soFar.push(parts[partIndex]);
      const count = countConfigs(parts, counts, partIndex + 1, soFar);
      soFar.pop();
      return count;
    }

    soFar.push(".");
    const without = countConfigs(parts, counts, partIndex + 1, soFar);
    soFar.pop();

    soFar.push("#");
    const _with = countConfigs(parts, counts, partIndex + 1, soFar);
    soFar.pop();

    return without + _with;
  };

  return data
    .map((datum) => countConfigs(datum.parts, datum.counts, 0, []))
    .reduce((tot, curr) => tot + curr, 0);
})();

// part two
(() => {
  const lines = document
    .querySelector("pre")
    .innerText.split("\n")
    .filter((e) => !!e);

  const data = lines.map((line) => ({
    parts: Array(5).fill(line.split(" ")[0]).join("?"),
    counts: Array(5)
      .fill(
        line
          .split(" ")[1]
          .split(",")
          .map((n) => parseInt(n))
      )
      .flat(),
  }));

  const includes = (arr, start, end, val) => {
    for (let i = start; i < end; i++) {
      if (arr[i] === val) {
        return true;
      }
    }
    return false;
  };

  const every = (arr, start, end, valOne, valTwo) => {
    for (let i = start; i < end; i++) {
      if (arr[i] !== valOne && arr[i] !== valTwo) {
        return false;
      }
    }
    return true;
  };

  const countConfigs = (parts, counts, partIndex, countIndex, cache) => {
    if (countIndex === counts.length) {
      return includes(parts, partIndex, parts.length, "#") ? 0 : 1;
    }
    if (partIndex + counts[countIndex] > parts.length) {
      return false;
    }
    const cacheKey = `${partIndex},${countIndex}`;
    if (cacheKey in cache) {
      return cache[cacheKey];
    }
    if (parts[partIndex] === ".") {
      cache[cacheKey] = countConfigs(
        parts,
        counts,
        partIndex + 1,
        countIndex,
        cache
      );
      return cache[cacheKey];
    }

    const canFitCurrentCount =
      every(parts, partIndex, partIndex + counts[countIndex], "?", "#") &&
      (partIndex + counts[countIndex] === parts.length ||
        parts[partIndex + counts[countIndex]] !== "#");

    const canSkipCurrentCount = parts[partIndex] === "?";

    let possible = 0;

    if (canFitCurrentCount) {
      possible += countConfigs(
        parts,
        counts,
        partIndex + counts[countIndex] + 1,
        countIndex + 1,
        cache
      );
    }

    if (canSkipCurrentCount) {
      possible += countConfigs(parts, counts, partIndex + 1, countIndex, cache);
    }

    cache[cacheKey] = possible;
    return possible;
  };

  return data
    .map((datum, i) => countConfigs(datum.parts, datum.counts, 0, 0, {}))
    .reduce((tot, curr) => tot + curr, 0);
})();

// Sheesh, I spent way too much time rethinking my approach on part 2 -- and
// almost started writing a dp solution -- until I decided to check the
// performance of the simple cache. Well, it turns out I was using the cache
// totally wrong. I checked `if (cache[cacheKey])` rather than
// `if (cacheKey in cache)` and that one mistake (not thinking about the fact
// that 0 is falsy) caused the cache to become basically useless.
