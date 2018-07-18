const path = require("path");
const fs = require("fs");
const mkpath = require("mkpath");
const trx = require("./trx").trx;

const VstsReporter = function(baseReporterDecorator, config, formatError) {
  baseReporterDecorator(this);

  let testResults;
  let messages = [];
  const outputDir =
    config.vstsReporter && config.vstsReporter.outputDir
      ? config.vstsReporter.outputDir
      : "testresults";
  const outputFile =
    config.vstsReporter && config.vstsReporter.outputFile
      ? config.vstsReporter.outputFile
      : "testresults_${date}.xml";

  this.onRunStart = function(browsers) {
    testResults = {
      name: path.join(
        outputDir,
        outputFile.replace(
          "${date}",
          new Date().toISOString().replace(/:/g, "")
        )
      ),
      agent: {},
      specs: []
    };
  };

  this.onBrowserStart = function(browser) {
    testResults.agent = {
      id: browser.id,
      name: browser.name,
      fullName: browser.fullName
    };
  };

  this.specSuccess = this.specSkipped = this.specFailure = function(
    browser,
    result
  ) {
    messages.push(result);
    const now = Date.now();
    testResults.specs.push({
      id: result.id,
      suite: result.suite.length
        ? result.suite.join(" ")
        : "Results not in a list",
      description: result.description,
      start: new Date(now),
      finish: new Date(now + result.time),
      time: result.time,
      outcome: result.skipped
        ? "NotExecuted"
        : result.success
          ? "Passed"
          : "Failed",
      message: result.log.join("\n"),
      stackTrace: result.log.join("\n")
    });
  };

  this.onBrowserComplete = function(browser) {};

  this.onRunComplete = function() {};

  this.onExit = function(done) {
    mkpath.sync(outputDir);
    fs.writeFileSync(testResults.name, trx(testResults));
    done();
  };
};

VstsReporter.$inject = ["baseReporterDecorator", "config", "formatError"];

module.exports = {
  "reporter:vsts": ["type", VstsReporter]
};
