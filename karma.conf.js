module.exports = function (config) {
  config.set({
    // Base path that will be used to resolve all patterns (eg. files, exclude).
    basePath: '',

    // Frameworks to use.
    // Available frameworks: https://npmjs.org/browse/keyword/karma-adapter.
    frameworks: ['mocha', 'chai', 'sinon', 'sinon-chai'],

    // List of files or patterns to load before run.
    files: [
      'bower_components/leaflet/dist/leaflet.js',
      'dist/Leaflet-WMS.js',
      'spec/**/*.js',
      { pattern: 'spec/Format/*.json', autoWatch: true, included: false, served: true }
    ],

    // List of files to exclude.
    exclude: [],

    // Preprocess matching files before serving them.
    // Available preprocessors: https://npmjs.org/browse/keyword/karma-preprocessor
    preprocessors: {},

    // Results reporters to use.
    // Available reporters: https://npmjs.org/browse/keyword/karma-reporter.
    reporters: ['progress'],

    // Web server port.
    port: 9876,

    // Enable / disable colors in the output (reporters and logs).
    colors: true,

    // Level of logging.
    // Possible values: config.LOG_DISABLE || config.LOG_ERROR || config.LOG_WARN || config.LOG_INFO || config.LOG_DEBUG.
    logLevel: config.LOG_INFO,

    // Enable / disable watching file and executing tests whenever any file changes.
    AutoWatch: true,

    // Browsers to start.
    // Available browser launchers: https://npmjs.org/browse/keyword/karma-launcher.
    browsers: ['PhantomJS', 'Chrome', 'Firefox'],

    // Custom launchers.
    customLaunchers: {
      'PhantomJS_debug': {
        base: 'PhantomJS',
        options: {
          windowName: 'my-window',
          settings: {
            webSecurityEnabled: false
          }
        },
        flags: ['--load-images=true'],
        debug: true
      }
    },

    // Continuous Integration mode.
    // If true, Karma captures browsers, runs the tests and exits.
    singleRun: false
  });
};
