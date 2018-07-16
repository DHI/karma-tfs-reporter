# karma-vsts-reporter
A Karma plugin for reporting test results to vsts.

## usage

Add the karma-vsts-reporter to your project:

```
npm install --save karma-vsts-reporter
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
            require('karma-jasmine'),
            require('karma-webpack'),
            require('karma-phantomjs-launcher'),
            require('karma-vsts-reporter')
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
        browsers: ['PhantomJS'],
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

![build-steps](https://cloud.githubusercontent.com/assets/5178445/20040961/d9b691ee-a426-11e6-9be2-266533274269.png)

Git gud code br0.

![test-results](https://cloud.githubusercontent.com/assets/5178445/20040962/daf0cc3c-a426-11e6-8467-82e0699b7fd1.png)
