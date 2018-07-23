const uuid = require("uuid/v4");
const os = require("os");
const xmlbuilder = require("xmlbuilder");
const moment = require("moment");

const pad = (n, width, z) => {
  z = z || "0";
  n = Math.abs(Math.floor(n)) + "";
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
};

const toISOString = time => {
  return moment(time).toISOString();
};

const duration = (start, finish) => {
  const diff = finish.getTime() - start.getTime();
  return (
    pad((diff / 1000 / 60 / 60) % 100, 2) +
    ":" +
    pad((diff / 1000 / 60) % 60, 2) +
    ":" +
    pad((diff / 1000) % 60, 2) +
    "." +
    pad(diff % 1000, 3) +
    "0000"
  );
};

const escape = str => {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
};

const trx = testResults => {
  const start = Math.min.apply(
    null,
    testResults.specs.map(spec => spec.start.getTime())
  );
  const finish = Math.max.apply(
    null,
    testResults.specs.map(spec => spec.finish.getTime())
  );

  const specs = testResults.specs.map(spec => {
    spec.suite = escape(spec.suite);
    spec.description = escape(spec.description);
    return {
      name: `${spec.suite} ${spec.description}`,
      executionId: uuid(),
      testId: uuid(),
      result: spec
    };
  });

  const suites = {};
  testResults.specs.forEach(spec => (suites[spec.suite] = uuid()));

  const fullOutcome = testResults.specs.some(spec => spec.outcome == "Failed")
    ? "Failed"
    : "Completed";
  const passed = testResults.specs.filter(spec => spec.outcome == "Passed");
  const failed = testResults.specs.filter(spec => spec.outcome == "Failed");
  const executed = testResults.specs.filter(
    spec => spec.outcome != "NotExecuted"
  );
  const notExecuted = testResults.specs.filter(
    spec => spec.outcome == "NotExecuted"
  );

  const unitTestResultsArray = specs.map(spec => {
    const testResult = {
      "@executionId": spec.executionId,
      "@testId": spec.testId,
      "@testName": spec.name,
      "@computerName": os.hostname(),
      "@duration": duration(spec.result.start, spec.result.finish),
      "@startTime": toISOString(spec.result.start),
      "@endTime": toISOString(spec.result.finish),
      "@testType": "13cdc9d9-ddb5-4fa4-a97d-d965ccfc6d4b",
      "@outcome": spec.result.outcome,
      "@testListId": suites[spec.result.suite]
    };
    if (spec.result.outcome === "Failed") {
      testResult.ErrorInfo = {
        Message: escape(spec.result.message),
        StackTrace: escape(spec.result.stackTrace)
      };
    }
    return testResult;
  });

  const testDefinitionsArray = specs.map(spec => {
    return {
      "@name": spec.name,
      "@id": spec.testId,
      Execution: {
        "@id": spec.executionId
      },
      TestMethod: {
        "@codeBase": testResults.name,
        "@className": spec.result.suite,
        "@name": spec.name
      }
    };
  });

  const testEntryArray = specs.map(spec => {
    return {
      "@testId": spec.testId,
      "@executionId": spec.executionId,
      "@testListId": suites[spec.result.suite]
    };
  });

  const testListArray = Object.keys(suites).map(suite => {
    return {
      "@name": suite,
      "@id": suites[suite]
    };
  });

  const skippedArray = notExecuted.map(spec => {
    return { "#text": `Test '${spec.name}' was skipped in the test run.` };
  });

  return xmlbuilder
    .create({
      TestRun: {
        "@id": uuid(),
        "@name": testResults.name,
        "@xmlns": "http://microsoft.com/schemas/VisualStudio/TeamTest/2010",
        Times: {
          "@creation": toISOString(start),
          "@start": toISOString(start),
          "@finish": toISOString(finish)
        },
        TestLists: {
          TestList: testListArray
        },
        TestDefinitions: {
          UnitTest: testDefinitionsArray
        },
        TestEntries: {
          TestEntry: testEntryArray
        },
        Results: {
          UnitTestResult: unitTestResultsArray
        },
        ResultSummary: {
          "@outcome": fullOutcome,
          Counters: {
            "@total": testResults.specs.length,
            "@executed": executed.length,
            "@passed": passed.length,
            "@failed": failed.length
          },
          Output: {
            StdOut: skippedArray
          }
        }
      }
    })
    .dec("1.0", "UTF-8")
    .end({ pretty: true });
};

module.exports = {
  pad,
  toISOString,
  duration,
  escape,
  trx
};
