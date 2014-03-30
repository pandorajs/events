/*
 * events
 * https://github.com/crossjs/events
 *
 * Copyright (c) 2014 crossjs
 * Licensed under the MIT license.
 */

module.exports = function(grunt) {

  'use strict';

  // load all grunt tasks
  require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

  grunt.initConfig({

    pkg: grunt.file.readJSON('package.json'),

    jshint: {
      files: ['src/*.js'],
      options: {
        jshintrc: true
      }
    },

    qunit: {
      options: {
        '--web-security': 'no',
        coverage: {
          src: ['src/*.js'],
          instrumentedFiles: 'temp/',
          lcovReport: 'report/',
          linesThresholdPct: 85
        }
      },
      all: ['test/*.html']
    },

    coveralls: {
      options: {
        force: true
      },
      all: {
        src: 'report/*.info'
      }
    },

    yuidoc: {
      compile: {
        name: '<%= pkg.name %>',
        description: '<%= pkg.description %>',
        version: '<%= pkg.version %>',
        options: {
          paths: 'src',
          outdir: 'doc',
          themedir: 'vendor/yuidoc-bootstrap'
        }
      }
    },

    clean: {
      pages: {
        files: {
          src: ['gh-pages/**/*', '!gh-pages/.git*']
        }
      },
      doc: {
        files: {
          src: ['doc/**']
        }
      },
      dist: {
        files: {
          src: ['dist/**/*']
        }
      },
      build: {
        files: {
          src: ['.build/**']
        }
      }
    },

    copy: {
      doc: {
        files: [{
          expand: true,
          cwd: 'doc/',
          src: ['**'],
          dest: 'gh-pages/'
        }]
      },
      sea: {
        files: [{
          expand: true,
          cwd: 'dist/',
          src: ['**'],
          dest: 'sea-modules/<%= pkg.family %>/<%= pkg.name %>/<%= pkg.version %>/'
        }]
      }
    },

    transport: {
      options: {
        debug: true,
        idleading: '<%= pkg.family %>/<%= pkg.name %>/<%= pkg.version %>/',
        alias: '<%= pkg.spm.alias %>'
      },
      dist: {
        files: [{
          expand: true,
          cwd: 'src/',
          src: ['*.js'],
          dest: '.build/'
        }]
      }
    },

    concat: {
      options: {
        debug: true,
        include: 'relative'
      },
      src: {
        files: [{
          expand: true,
          cwd: '.build/',
          src: ['*.js'],
          dest: 'dist/'
        }]
      }
    },

    uglify: {
      options: {
        banner: '/*! <%= pkg.name %>-<%= pkg.version %> <%= grunt.template.today("yyyy-mm-dd HH:MM:ss") %> */\n',
        beautify: {
          'ascii_only': true
        },
        // mangle: true,
        compress: {
          'global_defs': {
            'DEBUG': false
          },
          'dead_code': true
        }
      },
      dist: {
        files: [{
          expand: true,
          cwd: 'dist/',
          src: ['*.js', '!*-debug.js'],
          dest: 'dist/'
        }]
      }
    }

  });

  grunt.registerTask('build', ['clean:dist', 'transport', 'concat', 'clean:build', 'uglify']);

  grunt.registerTask('demo', ['copy:sea']);

  grunt.registerTask('doc', ['yuidoc', 'clean:pages', 'copy', 'clean:doc']);

  grunt.registerTask('test', ['jshint', 'qunit']);

  grunt.registerTask('default', ['test', 'doc', 'build', 'demo']);

};