/*Wow, I thought part two was very difficult. I spent a lot of time trying to
find a way to represent the finite state machine as a graph that I could
traverse, but ultimately it made the most sense to analyze the specifc graph
I was given and find a non-generic solution. I don't think a generic solution
would even be possible, given the possibility of a rat's nest of overlapping
loops etc. Here's what worked for me:

1. Condense the graph by removing the flip-flops. Now you have 9 nodes. The graph
looks like:

B -> cn -> sh -> mf
B -> xc -> jf -> mf
B -> gh -> bh -> mf
B -> hz -> mz -> mf
mf -> rx

Note that cn, xc, gh, and hz all have self loops through multiple flip-flops.

2. I started using math to figure out when the four above listed "important"
modules would send a low signal but it was way easier to just run the simulation.
I ran the simulation and got the intervals at which each would send a low signal.

3. I then plugged those numbers into an LCM calculator to get my answer.
*/

// part one
(() => {
  const lines = document
    .querySelector("pre")
    .innerText.split("\n")
    .filter((e) => !!e);

  const data = lines.map((line) => {
    const [moduleString, destinationsString] = line.split(" -> ");
    const moduleType =
      moduleString === "broadcaster" ? undefined : moduleString[0];
    const moduleName =
      moduleString === "broadcaster" ? moduleString : moduleString.slice(1);
    const destinations = destinationsString.split(", ");
    const flipFlopOn = moduleType === "%" ? false : undefined;
    const conjunctionMemory = moduleType === "&" ? {} : undefined;
    return {
      moduleName,
      moduleType,
      destinations,
      flipFlopOn,
      conjunctionMemory,
    };
  });

  const modules = Object.fromEntries(
    data.map(({ moduleName, ...rest }) => [moduleName, rest])
  );

  for (const [moduleName, module] of Object.entries(modules)) {
    for (const destination of module.destinations) {
      if (modules[destination]?.moduleType === "&") {
        modules[destination].conjunctionMemory[moduleName] = false;
      }
    }
  }

  let outputLow = 0;
  let outputHigh = 0;

  for (let i = 1; i <= 1_000; i++) {
    let queue = [];
    let queuePos = 0;
    const getNext = () => {
      if (queuePos === queue.length) {
        return undefined;
      }
      const value = queue[queuePos];
      queuePos++;
      return value;
    };

    queue.push(["broadcaster", false, undefined]);

    while (queuePos !== queue.length) {
      const [moduleName, isHigh, previousName] = getNext();
      if (isHigh) {
        outputHigh++;
      } else {
        outputLow++;
      }

      const module = modules[moduleName];
      if (!module) {
        continue;
      }
      let newIsHigh;
      if (moduleName === "broadcaster") {
        newIsHigh = isHigh;
      } else if (module.moduleType === "%") {
        if (isHigh) {
          continue;
        }
        module.flipFlopOn = !module.flipFlopOn;
        newIsHigh = module.flipFlopOn;
      } else {
        module.conjunctionMemory[previousName] = isHigh;
        if (Object.values(module.conjunctionMemory).every((e) => e)) {
          newIsHigh = false;
        } else {
          newIsHigh = true;
        }
      }
      for (const destination of module.destinations) {
        queue.push([destination, newIsHigh, moduleName]);
      }
    }
  }

  return outputLow * outputHigh;
})();

// part two -- get condensed graph
(() => {
  const lines = document
    .querySelector("pre")
    .innerText.split("\n")
    .filter((e) => !!e);

  const data = lines.map((line) => {
    const [moduleString, destinationsString] = line.split(" -> ");
    const moduleType =
      moduleString === "broadcaster" ? undefined : moduleString[0];
    const moduleName =
      moduleString === "broadcaster" ? moduleString : moduleString.slice(1);
    const destinations = destinationsString.split(", ");
    const flipFlopOn = moduleType === "%" ? false : undefined;
    const conjunctionMemory = moduleType === "&" ? {} : undefined;
    return {
      moduleName,
      moduleType,
      destinations,
      flipFlopOn,
      conjunctionMemory,
    };
  });

  const modules = Object.fromEntries(
    data.map(({ moduleName, ...rest }) => [moduleName, rest])
  );

  for (const [moduleName, module] of Object.entries(modules)) {
    for (const destination of module.destinations) {
      if (modules[destination]?.moduleType === "&") {
        modules[destination].conjunctionMemory[moduleName] = false;
      }
    }
  }

  const finished = new Set();
  const visited = new Set();

  const newGraph = {};

  const dfs = (moduleName, path, flips) => {
    const module = modules[moduleName];
    if (module?.moduleType === "&") {
      newGraph[flips[0]] ??= [];
      newGraph[flips[0]].push([moduleName, flips.slice(1)]);
    }
    if (finished.has(moduleName)) {
      return;
    }
    if (visited.has(moduleName)) {
      return;
    }
    visited.add(moduleName);
    for (const destination of module?.destinations ?? []) {
      const newFlips =
        module.moduleType === "%" ? [...flips, moduleName] : [moduleName];
      path.push(`${modules[moduleName].moduleType ?? ""}${moduleName}`);
      dfs(destination, path, newFlips);
      path.pop();
    }
    finished.add(moduleName);
  };

  dfs("broadcaster", []);

  return newGraph;
})();

// part two -- get the points at which the important conjunction modules
// return false. The console.logs are the important pieces
// part one
(() => {
  const lines = document
    .querySelector("pre")
    .innerText.split("\n")
    .filter((e) => !!e);

  const data = lines.map((line) => {
    const [moduleString, destinationsString] = line.split(" -> ");
    const moduleType =
      moduleString === "broadcaster" ? undefined : moduleString[0];
    const moduleName =
      moduleString === "broadcaster" ? moduleString : moduleString.slice(1);
    const destinations = destinationsString.split(", ");
    const flipFlopOn = moduleType === "%" ? false : undefined;
    const conjunctionMemory = moduleType === "&" ? {} : undefined;
    return {
      moduleName,
      moduleType,
      destinations,
      flipFlopOn,
      conjunctionMemory,
    };
  });

  const modules = Object.fromEntries(
    data.map(({ moduleName, ...rest }) => [moduleName, rest])
  );

  for (const [moduleName, module] of Object.entries(modules)) {
    for (const destination of module.destinations) {
      if (modules[destination]?.moduleType === "&") {
        modules[destination].conjunctionMemory[moduleName] = false;
      }
    }
  }

  let outputLow = 0;
  let outputHigh = 0;

  for (let i = 1; i < 10_000; i++) {
    let queue = [];
    let queuePos = 0;
    const getNext = () => {
      if (queuePos === queue.length) {
        return undefined;
      }
      const value = queue[queuePos];
      queuePos++;
      return value;
    };

    queue.push(["broadcaster", false, undefined]);

    while (queuePos !== queue.length) {
      for (const m of ["cn", "xc", "gh", "hz"]) {
        if (Object.values(modules[m].conjunctionMemory).every((e) => e)) {
          console.log(
            m,
            i,
            modules[m].debugLastSeen ? i - modules[m].debugLastSeen : undefined
          );
          if (i !== modules[m].debugLastSeen) {
            modules[m].debugLastSeen = i;
          }
        }
      }
      const [moduleName, isHigh, previousName] = getNext();

      const module = modules[moduleName];
      if (!module) {
        continue;
      }
      let newIsHigh;
      if (moduleName === "broadcaster") {
        newIsHigh = isHigh;
      } else if (module.moduleType === "%") {
        if (isHigh) {
          continue;
        }
        module.flipFlopOn = !module.flipFlopOn;
        newIsHigh = module.flipFlopOn;
      } else {
        module.conjunctionMemory[previousName] = isHigh;
        if (Object.values(module.conjunctionMemory).every((e) => e)) {
          newIsHigh = false;
        } else {
          newIsHigh = true;
        }
      }
      for (const destination of module.destinations) {
        queue.push([destination, newIsHigh, moduleName]);
      }
    }
  }

  return [outputLow, outputHigh, outputLow * outputHigh];
})();
