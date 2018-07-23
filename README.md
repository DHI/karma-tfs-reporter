# Karma VSTS Reporter
[![npm version](https://badge.fury.io/js/%40dhigroup%2Fkarma-vsts-reporter.svg)](https://badge.fury.io/js/%40dhigroup%2Fkarma-vsts-reporter)

A Karma plugin for reporting test results to Visual Studio Team Services (VSTS).

## Getting started
Add the karma-vsts-reporter to your project:

```
npm i @dhigroup/karma-vsts-reporter -D
```

Example karma.conf.js:

```js
module.exports = function (config) {
  config.set({
    frameworks: ['jasmine'],
    files: [
      './src/*.spec.js',
      './src/**/*.spec.js'
    ],
    plugins: [
      'karma-jasmine',
      'karma-webpack',
      'karma-chrome-launcher',
      '@dhigroup/karma-vsts-reporter'
    ],
    preprocessors: {
      './src/*.spec.js': ['webpack'],
      './src/**/*.spec.js': ['webpack']
    },
    webpack: {
    },
    webpackMiddleware: {
      stats: 'errors-only'
    },
    browsers: ['ChromeHeadless'],
    reporters: ['progress', 'vsts'],

    // Default settings (optional)
    vstsReporter: {
      outputDir: 'coverage-vsts',
      outputFile: 'coverage-${date}.xml'
    }
  })
}
```

Setup the build steps in VSTS:

![build setup](https://user-images.githubusercontent.com/1515742/42814566-e646f5f4-89c4-11e8-9495-4181d07949e1.PNG)

Run your build, then you should see:
![build summary](https://user-images.githubusercontent.com/1515742/42814697-563dc7f2-89c5-11e8-8b4c-eb59ea4c9f0a.PNG)


## Contributing
Contributions are welcome.

Here's a small guide on how to do it:
- create a branch from master
- (do changes)
- run `npm test` to make sure tests still pass
- run `npm run format` to format your code
- commit your changes on that branch
- make a pull request

We'll then review it and accept if all looks good :)
