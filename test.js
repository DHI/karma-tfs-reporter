/**
 * These are super basic, just to make sure things are in place.
 * Should test 'trx' more rigorously.
 */
const test = require("ava").test;

const trxModule = require("./trx");
const { pad, toISOString, duration, escape, trx } = trxModule;

test("pad", t => {
  t.plan(5);

  t.is(pad(0, 0, 0), "0");
  t.is(pad(2, 0, 0), "2");
  t.is(pad(0, 2, 0), "00");
  t.is(pad(0, 0, 2), "0");
  t.is(pad(1, 3, 2), "221");
});

test("toISOString", t => {
  t.plan(2);

  const result = toISOString();
  const regex = new RegExp(
    result.substring(0, result.length - 2).replace(/./g, ".") + ".Z$"
  );
  const expect = new Date().toISOString();

  t.is(toISOString("2018-07-16T16:05:16+0200"), "2018-07-16T14:05:16.000Z");
  t.regex(expect, regex);
});

test("duration", t => {
  t.plan(1);

  t.is(
    duration(
      new Date("2018-07-16T16:05:16+0200"),
      new Date("2018-07-16T16:05:20.123+0200")
    ),
    "00:00:04.1230000"
  );
});

test("escape", t => {
  t.plan(5);

  t.is(escape(`&`), "&amp;");
  t.is(escape(`<`), "&lt;");
  t.is(escape(`>`), "&gt;");
  t.is(escape(`"`), "&quot;");
  t.is(escape(`'`), "&apos;");
});

// TODO: properly test trx
test("trx", t => {
  t.plan(1);

  const testResults = {
    name: "Test results name",
    specs: [
      {
        start: new Date("2018-07-16T16:05:16+0200"),
        finish: new Date("2018-07-16T16:05:20+0200"),
        suite: "suite",
        description: "description",
        outcome: "Failed",
        message: "message",
        stackTrace: "stack"
      }
    ]
  };

  const expect = `<?xml version="1.0" encoding="UTF-8"?>
<TestRun id="testRunId" name="Test results name" xmlns="http://microsoft.com/schemas/VisualStudio/TeamTest/2010">
  <Times creation="2018-07-16T14:05:16.000Z" start="2018-07-16T14:05:16.000Z" finish="2018-07-16T14:05:20.000Z"/>
  <TestLists>
    <TestList name="suite" id="suiteId"/>
  </TestLists>
  <TestDefinitions>
    <UnitTest name="suite description" id="testId">
      <Execution id="executionId"/>
      <TestMethod codeBase="Test results name" className="suite" name="suite description"/>
    </UnitTest>
  </TestDefinitions>
  <TestEntries>
    <TestEntry testId="testId" executionId="executionId" testListId="suiteId"/>
  </TestEntries>
  <Results>
    <UnitTestResult executionId="executionId" testId="testId" testName="suite description" computerName="DK83720-PC1" duration="00:00:04.0000000" startTime="2018-07-16T14:05:16.000Z" endTime="2018-07-16T14:05:20.000Z" testType="13cdc9d9-ddb5-4fa4-a97d-d965ccfc6d4b" outcome="Failed" testListId="suiteId">
      <ErrorInfo>
        <Message>message</Message>
        <StackTrace>stack</StackTrace>
      </ErrorInfo>
    </UnitTestResult>
  </Results>
  <ResultSummary outcome="Failed">
    <Counters total="1" executed="1" passed="0" failed="1"/>
    <Output>
      <StdOut/>
    </Output>
  </ResultSummary>
</TestRun>`;

  t.is(
    trx(testResults, "executionId", "testId", "suiteId", "testRunId"),
    expect
  );
});
