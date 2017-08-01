module.exports = function (grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    srcPath: 'src',

    distPath: 'dist',

    specPath: 'spec',

    examplesPath: 'examples',

    concat: {
      options: {
        stripBanners: true,
        banner: '/*! <%= pkg.name %> <%= pkg.version %> <%= grunt.template.today("yyyy-mm-dd") %> */\n' +
          ';(function(window, document, undefined) {\n' +
          '"use strict";\n',
        footer: '\n})(window, document);'
      },
      main: {
        src: [
          '<%= srcPath %>/Polyfill.js',

          '<%= srcPath %>/Util/L.TileLayer.WMS.Util.js',
          '<%= srcPath %>/Util/L.TileLayer.WMS.Util.JSON.js',
          '<%= srcPath %>/Util/L.TileLayer.WMS.Util.XML.js',
          '<%= srcPath %>/Util/L.TileLayer.WMS.Util.XML.ExceptionReport.js',
          '<%= srcPath %>/Util/L.TileLayer.WMS.Util.XML.ExceptionReport.OWS.js',
          '<%= srcPath %>/Util/L.TileLayer.WMS.Util.XML.ExceptionReport.Service.js',
          '<%= srcPath %>/Util/L.TileLayer.WMS.Util.XML.ExceptionReport.Exception.js',
          '<%= srcPath %>/Util/L.TileLayer.WMS.Util.AJAX.js',

          '<%= srcPath %>/Format/L.TileLayer.WMS.Format.js',
          '<%= srcPath %>/Format/L.TileLayer.WMS.Format.GeoJSON.js',
          '<%= srcPath %>/Format/L.TileLayer.WMS.Format.JSON.js',
          '<%= srcPath %>/Format/L.TileLayer.WMS.Format.GML.3.1.1.js',
          '<%= srcPath %>/Format/L.TileLayer.WMS.Format.GML.js',
          '<%= srcPath %>/Format/L.TileLayer.WMS.Format.XML.js',
          '<%= srcPath %>/Format/L.TileLayer.WMS.Format.OGC.WMS.XML.js',
          '<%= srcPath %>/Format/L.TileLayer.WMS.Format.HTML.js',

          '<%= srcPath %>/L.TileLayer.WMS.GetBoundingBox.js',
          '<%= srcPath %>/L.TileLayer.WMS.GetCapabilities.js',
          '<%= srcPath %>/L.TileLayer.WMS.GetInfoFormat.js',
          '<%= srcPath %>/L.TileLayer.WMS.GetFeatureInfo.js'
        ],
        dest: '<%= distPath %>/<%= pkg.name %>.js'
      }
    },
    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= pkg.version %> <%= grunt.template.today("yyyy-mm-dd") %> */\n'
      },
      main: {
        src: '<%= concat.main.dest %>',
        dest: '<%= distPath %>/<%= pkg.name %>.min.js'
      }
    },
    copy: {
      examples: {
        files: [
          { expand: true, cwd: 'bower_components/leaflet/dist/', src: '**', dest: '<%= examplesPath %>/lib/vendor/leaflet/' },

          { expand: true, cwd: 'bower_components/spin.js/', src: 'spin.js', dest: '<%= examplesPath %>/lib/vendor/spin.js/' },

          { expand: true, cwd: '<%= distPath %>/', src: '**', dest: '<%= examplesPath %>/lib/' }
        ],
      },
    },
    clean: {
      examples: {
        src: ['<%= examplesPath %>/lib']
      }
    },
    jshint: {
      options: {
        jshintrc: true
      },
      scripts: {
        files: {
          src: ['<%= srcPath %>/**/*.js']
        }
      },
      spec: {
        files: {
          src: ['<%= specPath %>/**/*.js']
        }
      }
    },
    karma: {
      options: {
        configFile: 'karma.conf.js'
      },
      develop: {
        browsers: ['PhantomJS', 'Chrome']
      },
      single: {
        singleRun: true,
        browsers: ['PhantomJS', 'Chrome']
      },
      travis: {
        singleRun: true,
        browsers: ['PhantomJS']
      }
    },
    watch: {
      scripts: {
        files: '<%= srcPath %>/**/*.js',
        tasks: ['jshint:scripts', 'concat', 'uglify', 'clean:examples', 'copy:examples']
      },
      specs: {
        files: ['<%= specPath %>/**/*.js'],
        tasks: ['jshint:spec']
      }
    }
  });

  grunt.util.linefeed = '\n';

  // Load tasks.
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-karma');
  grunt.loadNpmTasks('grunt-gh-pages');

  // Default grunt task.
  grunt.registerTask('default', [
    'jshint:scripts',
    'jshint:spec',
    'concat',
    'uglify',
    'clean:examples',
    'copy:examples',
    'karma:single'
  ]);

  // Build grunt task for Travis.
  grunt.registerTask('build', [
    'jshint:scripts',
    'jshint:spec',
    'concat',
    'uglify',
    'clean:examples',
    'copy:examples',
    'karma:travis'
  ]);

  // Develop grunt task with watch for changes & continuous tests running.
  grunt.registerTask('develop', ['karma:develop:start', 'watch']);
};
