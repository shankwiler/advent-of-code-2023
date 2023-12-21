// part one
(() => {
  const input = document.querySelector("pre").innerText;
  const [workflowLines, ratingLines] = input
    .trim()
    .split("\n\n")
    .map((group) => group.split("\n"));

  const workflowsArray = workflowLines.map((line) => {
    const entryPart = line.split("{")[0];
    const allRules = line.split("{")[1].split("}")[0].split(",");
    const defaultRule = allRules.slice(-1)[0];
    const rules = allRules.slice(0, -1).map((rule) => {
      const [, part, operator, operand, destination] =
        rule.match(/(.+)(<|>)(.+)\:(.+)/);
      return { part, operator, operand: parseInt(operand), destination };
    });

    return {
      entryPart,
      defaultRule,
      rules,
    };
  });

  const workflows = Object.fromEntries(
    workflowsArray.map(({ entryPart, ...rest }) => [entryPart, rest])
  );

  const ratings = ratingLines.map((rating) => {
    const scoreEntries = rating
      .slice(1, -1)
      .split(",")
      .map((entry) => {
        const [part, score] = entry.split("=");
        return { part, score: parseInt(score) };
      });
    return Object.fromEntries(
      scoreEntries.map(({ part, score }) => [part, score])
    );
  });

  return ratings
    .map((scores) => {
      let curr = "in";
      while (curr !== "R" && curr !== "A") {
        const currWorkflow = workflows[curr];
        const destination = currWorkflow.rules.find((rule) =>
          rule.operator === "<"
            ? scores[rule.part] < rule.operand
            : scores[rule.part] > rule.operand
        )?.destination;
        curr = destination ?? currWorkflow.defaultRule;
      }
      if (curr === "R") {
        return 0;
      }
      return Object.values(scores).reduce((a, c) => a + c, 0);
    })
    .reduce((a, c) => a + c, 0);
})();

// part two
(() => {
  const input = document.querySelector("pre").innerText;
  const [workflowLines, ratingLines] = input
    .trim()
    .split("\n\n")
    .map((group) => group.split("\n"));

  const workflowsArray = workflowLines.map((line) => {
    const entryPart = line.split("{")[0];
    const allRules = line.split("{")[1].split("}")[0].split(",");
    const defaultRule = allRules.slice(-1)[0];
    const rules = allRules.slice(0, -1).map((rule) => {
      const [, part, operator, operand, destination] =
        rule.match(/(.+)(<|>)(.+)\:(.+)/);
      return { part, operator, operand: parseInt(operand), destination };
    });

    return {
      entryPart,
      defaultRule,
      rules,
    };
  });

  const workflows = Object.fromEntries(
    workflowsArray.map(({ entryPart, ...rest }) => [entryPart, rest])
  );

  const MIN_VALUE = 1;
  const MAX_VALUE = 4000;
  const ALL_VALUES = [MIN_VALUE, MAX_VALUE];
  const ALL_PARTS = ["x", "m", "a", "s"];
  const INITIAL_RANGES = Object.fromEntries(
    ALL_PARTS.map((val) => [val, ALL_VALUES])
  );

  const addRestraint = (range, operator, operand) => {
    if (!range) {
      return operand === "<" ? [MIN_VALUE, operator] : [operator, MAX_VALUE];
    }
    const [start, end] = range;
    if (operator === "<") {
      if (operand <= start) {
        return false;
      }
      if (operand > start && operand <= end) {
        return [start, operand - 1];
      }
      return [start, end];
    } else {
      if (operand < start) {
        return [start, end];
      }
      if (operand >= start && operand < end) {
        return [operand + 1, end];
      }
      return false;
    }
  };

  const search = (workflowName, ranges, goodRangeGroups) => {
    if (workflowName === "A") {
      goodRangeGroups.push(ranges);
      return;
    }
    if (workflowName === "R") {
      return;
    }
    const workflow = workflows[workflowName];
    let currRanges = ranges;
    const fakeDefaultRule = {
      part: "x",
      operator: "<",
      operand: Infinity,
      destination: workflow.defaultRule,
    };
    for (const rule of [...workflow.rules, fakeDefaultRule]) {
      const newPartRange = addRestraint(
        currRanges[rule.part],
        rule.operator,
        rule.operand
      );
      if (newPartRange) {
        const searchRanges = {
          ...currRanges,
          [rule.part]: newPartRange,
        };
        search(rule.destination, searchRanges, goodRangeGroups);
      }
      let inverseOperator;
      let inverseOperand;
      if (rule.operator === "<") {
        inverseOperator = ">";
        inverseOperand = rule.operand - 1;
      } else {
        inverseOperator = "<";
        inverseOperand = rule.operand + 1;
      }
      const afterPartRange = addRestraint(
        currRanges[rule.part],
        inverseOperator,
        inverseOperand
      );
      if (!afterPartRange) {
        break;
      }
      currRanges = {
        ...currRanges,
        [rule.part]: afterPartRange,
      };
    }
  };

  const goodRangeGroups = [];
  search("in", INITIAL_RANGES, goodRangeGroups);
  return goodRangeGroups
    .map((group) =>
      Object.values(group).reduce((a, [start, end]) => a * (end - start + 1), 1)
    )
    .reduce((a, c) => a + c, 0);
})();

// I really should stop working on these so late. I completely confused the goal
// of part two, and solved the problem as if the order of the rules applied
// didn't matter, and generated a bunch of sets of valid numbers that I then
// tried to find the unique ranges of... it was a total mess. Then I re-read the
// problem and realized it was asking for something completely different.
// I also made a very silly error on the last line ".reduce((a, c) => a + c, 1);" sheesh.
