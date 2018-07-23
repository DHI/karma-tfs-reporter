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

/**
 * TRX tests below.
 * TODO: properly test this.
 */
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

test("trx multiple runs should yield new ids", t => {
  t.plan(1);

  t.not(trx(testResults), trx(testResults));
});
