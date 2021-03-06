
var _ = require('lodash');
var path = require('path');

module.exports = function(grunt) {

  var BUILD_ROOT = process.env.BUILD_ROOT || 'build/';

  var SERVER_PORT = process.env.SERVER_PORT || 8020;
  var RELOAD_PORT = process.env.RELOAD_PORT || 35729;

  // Files path definition {{{

  var files = function (cwd, src, dest, ext) {

    var file = {
      path: path.join(cwd, src),
      pattern: {
        expand: true,
        extDot: 'last',
      }
    };

    if (cwd) file.pattern.cwd = cwd;
    if (src) file.pattern.src = src;
    if (dest) file.pattern.dest = dest;
    if (ext) file.pattern.ext = ext;

    return file;
  };

  _.extend(files, {

    script    : files('src/'  , 'script/**/*.js'  , BUILD_ROOT, '.js'),
    document  : files('src/'  , '**/*.jade'       , BUILD_ROOT, '.html'),
    style     : files('src/'  , 'style/**/*.scss' , BUILD_ROOT, '.css'),
    asset     : files('asset/', '**/*'            , BUILD_ROOT),

  });

  // }}}

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    jshint: {
      gruntfile : [ 'Gruntfile.js' ],
      script    : [ files.script.path ],
    },

    jade: {
      document: files.document.pattern,
      options: {
        pretty: true
      }
    },

    sass: {
      style: files.style.pattern,
      options: { }
    },

    autoprefixer: {
      style: {
        src: path.join(BUILD_ROOT, 'style/**/*.css')
      },
      options: { }
    },

    copy: {
      script: files.script.pattern,
      asset: files.asset.pattern,
      options: { }
    },

    watch: {
      gruntfile: {
        files: 'Gruntfile.js'
      },
      script: {
        files: [ files.script.path ],
        tasks: [ 'script' ],
      },
      asset: {
        files: [ files.asset.path ],
        tasks: [ 'asset' ],
      },
      document: {
        files: [ files.document.path ],
        tasks: [ 'document' ],
      },
      style: {
        files: [ files.style.path ],
        tasks: [ 'style' ],
      },
      options: {
        livereload: RELOAD_PORT
      }
    },

    clean: [ BUILD_ROOT + '**/*' ],

    devserver: {
      server: {
        options: {
          port: SERVER_PORT,
          base: BUILD_ROOT
        }
      }
    }

  });

  grunt.loadNpmTasks('grunt-devserver');
  grunt.loadNpmTasks('grunt-autoprefixer');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-jade');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');

  grunt.registerTask('asset'    , [ 'copy:asset' ]);
  grunt.registerTask('document' , [ 'jade:document' ]);
  grunt.registerTask('style'    , [ 'sass:style', 'autoprefixer:style' ]);
  grunt.registerTask('script'   , [ 'jshint:script', 'copy:script' ]);

  grunt.registerTask('default', [
                     'clean',
                     'jshint:gruntfile',
                     'asset',
                     'document',
                     'script',
                     'style'
  ]);

};

