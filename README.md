# karma-vsts-reporter
A Karma plugin for reporting test results to vsts.

## usage

Add the karma-vsts-reporter to your project:

```
npm i karma-vsts-reporter -D
```

Example karma.conf.js (view the [sample project](https://github.com/DHI/karma-vsts-reporter/tree/sample)):

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
           'karma-phantomjs-launcher',
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
            outputDir: 'testresults',
            outputFile: 'testresults_${date}.xml'
        }
    })
}
```

Setup the build steps in vsts:

![build setup](https://user-images.githubusercontent.com/1515742/42814566-e646f5f4-89c4-11e8-9495-4181d07949e1.PNG)

Run your build, then you should see:
![build summary](https://user-images.githubusercontent.com/1515742/42814697-563dc7f2-89c5-11e8-8b4c-eb59ea4c9f0a.PNG)
