// Generated on 2015-03-19 using generator-angular-fullstack 2.0.13
'use strict';

module.exports = function (grunt) {
  var localConfig;
  try {
    localConfig = require('./server/config/local.env');
  } catch(e) {
    localConfig = {};
  }

  // Load grunt tasks automatically, when needed
  require('jit-grunt')(grunt, {
    express: 'grunt-express-server',
    useminPrepare: 'grunt-usemin',
    ngtemplates: 'grunt-angular-templates',
    cdnify: 'grunt-google-cdn',
    protractor: 'grunt-protractor-runner',
    injector: 'grunt-asset-injector',
    buildcontrol: 'grunt-build-control'
  });

  // Time how long tasks take. Can help when optimizing build times
  //require('time-grunt')(grunt);

  // Define the configuration for all the tasks
  grunt.initConfig({

    // Project settings
    pkg: grunt.file.readJSON('package.json'),
    etsApp: {
      // configurable paths
      client: require('./bower.json').appPath || 'client',
      dist: 'dist',
      devServerPath: require('./bower.json').devServerPath || 'devServer',
      appPath: require('./bower.json').appPath || 'app'
    },
    express: {
      options: {
        port: process.env.PORT || 9000
      },
      dev: {
        options: {
          script: 'server/app.js',
          debug: true
        }
      },
      prod: {
        options: {
          script: 'dist/server/app.js'
        }
      }
    },
    open: {
      server: {
        url: 'http://localhost:<%= express.options.port %>'
      }
    },
    watch: {
      injectJS: {
        files: [
          '<%= etsApp.client %>/{app,components}/**/*.js',
          '!<%= etsApp.client %>/{app,components}/**/*.spec.js',
          '!<%= etsApp.client %>/{app,components}/**/*.mock.js',
          '!<%= etsApp.client %>/app/app.js'],
        tasks: ['injector:scripts']
      },
      injectCss: {
        files: [
          '<%= etsApp.client %>/{app,components}/**/*.css'
        ],
        tasks: ['injector:css']
      },
      mochaTest: {
        files: ['server/**/*.spec.js'],
        tasks: ['env:test', 'mochaTest']
      },
      jsTest: {
        files: [
          '<%= etsApp.client %>/{app,components}/**/*.spec.js',
          '<%= etsApp.client %>/{app,components}/**/*.mock.js'
        ],
        tasks: ['newer:jshint:all', 'karma']
      },
      injectSass: {
        files: [
          '<%= etsApp.client %>/{app,components}/**/*.{scss,sass}'],
        tasks: ['injector:sass']
      },
      sass: {
        files: [
          '<%= etsApp.client %>/{app,components}/**/*.{scss,sass}'],
        tasks: ['sass', 'autoprefixer']
      },
      gruntfile: {
        files: ['Gruntfile.js']
      },
      livereload: {
        files: [
          '{.tmp,<%= etsApp.client %>}/{app,components}/**/*.css',
          '{.tmp,<%= etsApp.client %>}/{app,components}/**/*.html',
          '{.tmp,<%= etsApp.client %>}/{app,components}/**/*.js',
          '!{.tmp,<%= etsApp.client %>}{app,components}/**/*.spec.js',
          '!{.tmp,<%= etsApp.client %>}/{app,components}/**/*.mock.js',
          '<%= etsApp.client %>/assets/images/{,*//*}*.{png,jpg,jpeg,gif,webp,svg}'
        ],
        options: {
          livereload: true
        }
      },
      express: {
        files: [
          'server/**/*.{js,json}'
        ],
        tasks: ['express:dev', 'wait'],
        options: {
          livereload: true,
          nospawn: true //Without this option specified express won't be reloaded
        }
      }
    },

    // Make sure code styles are up to par and there are no obvious mistakes
    jshint: {
      options: {
        jshintrc: '<%= etsApp.appPath %>/.jshintrc',
        reporter: require('jshint-stylish')
      },
      server: {
        options: {
          jshintrc: 'server/.jshintrc'
        },
        src: [
          'server/**/*.js',
          '!server/**/*.spec.js'
        ]
      },
      serverTest: {
        options: {
          jshintrc: 'server/.jshintrc-spec'
        },
        src: ['server/**/*.spec.js']
      },
      all: [
        '<%= etsApp.appPath%>/src/**/*.js'
      ],
      test: {
        src: [
          '<%= etsApp.appPath%>/tests/**/*.mock.js',
          '<%= etsApp.client %>/{app,components}/**/*.spec.js',
          '<%= etsApp.client %>/{app,components}/**/*.mock.js'
        ]
      }
    },

    // Empties folders to start fresh
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= etsApp.dist %>/*',
            '!<%= etsApp.dist %>/.git*',
            '!<%= etsApp.dist %>/.openshift',
            '!<%= etsApp.dist %>/Procfile'
          ]
        }]
      },
      server: '.tmp',
      devServer: {
        files: [{
          dot: true,
          src: [
            '<%=etsApp.devServerPath %>/*'
          ]
        }]
      }
    },

    // Add vendor prefixed styles
    autoprefixer: {
      options: {
        browsers: ['last 1 version']
      },
      dist: {
        files: [{
          expand: true,
          cwd: '<%= devServerPath %>',
          src: 'styles/**/*.css',
          dest: '<%= devServerPath %>/styles'
        }]
      }
    },

    // Debugging with node inspector
    'node-inspector': {
      custom: {
        options: {
          'web-host': 'localhost'
        }
      }
    },

    // Use nodemon to run server in debug mode with an initial breakpoint
    nodemon: {
      debug: {
        script: 'server/app.js',
        options: {
          nodeArgs: ['--debug-brk'],
          env: {
            PORT: process.env.PORT || 9000
          },
          callback: function (nodemon) {
            nodemon.on('log', function (event) {
              console.log(event.colour);
            });

            // opens browser on initial server start
            nodemon.on('config:update', function () {
              setTimeout(function () {
                require('open')('http://localhost:8080/debug?port=5858');
              }, 500);
            });
          }
        }
      }
    },

    // Automatically inject Bower components into the app
    wiredep: {
      target: {
        src: '<%= etsApp.client %>/index.html',
        ignorePath: '<%= etsApp.client %>/',
        exclude: [/bootstrap-sass-official/, /bootstrap.js/, '/json3/', '/es5-shim/', /bootstrap.css/, /font-awesome.css/ ]
      }
    },

    // Renames files for browser caching purposes
    rev: {
      dist: {
        files: {
          src: [
            '<%= etsApp.devServerPath %>/src/{,*/}*.js',
            '<%= etsApp.devServerPath %>/styles/{,*/}*.css',
            '<%= etsApp.devServerPath %>/assets/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
            '<%= etsApp.devServerPath %>/assets/fonts/*'
          ]
        }
      }
    },

    // Reads HTML for usemin blocks to enable smart builds that automatically
    // concat, minify and revision files. Creates configurations in memory so
    // additional tasks can operate on them
    useminPrepare: {
      html: ['<%= etsApp.appPath %>/templates/*'],
      options: {
        dest: '<%= etsApp.devServerPath %>/templates/'
      }
    },

    // Performs rewrites based on rev and the useminPrepare configuration
    usemin: {
      html: ['<%= etsApp.devServerPath %>/templates/{,*/}*.html'],
      css: ['<%= etsApp.devServerPath %>/styles/{,*/}*.css'],
      js: ['<%= etsApp.devServerPath %>/src/{,*/}*.js'],
      options: {
        assetsDirs: [
          '<%= etsApp.devServerPath %>/',
          '<%= etsApp.devServerPath %>/assets/images'
        ],
        // This is so we update image references in our ng-templates
        patterns: {
          js: [
            [/(assets\/images\/.*?\.(?:gif|jpeg|jpg|png|webp|svg))/gm, 'Update the JS to reference our revved images']
          ]
        }
      }
    },

    // The following *-min tasks produce minified files in the dist folder
    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= etsApp.appPath %>/assets/images',
          src: '{,*/}*.{png,jpg,jpeg,gif}',
          dest: '<%= etsApp.devServerPath %>/assets/images'
        }]
      }
    },

    svgmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= etsApp.appPath %>/assets/images',
          src: '{,*/}*.svg',
          dest: '<%= etsApp.devServerPath %>/assets/images'
        }]
      }
    },

    // Allow the use of non-minsafe AngularJS files. Automatically makes it
    // minsafe compatible so Uglify does not destroy the ng references
    ngAnnotate: {
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/concat',
          src: '*/**.js',
          dest: '.tmp/concat'
        }]
      }
    },

    // Package all the html partials into a single javascript payload
    ngtemplates: {
      options: {
        // This should be the name of your apps angular module
        module: 'etsApp',
        htmlmin: {
          collapseBooleanAttributes: true,
          collapseWhitespace: true,
          removeAttributeQuotes: true,
          removeEmptyAttributes: true,
          removeRedundantAttributes: true,
          removeScriptTypeAttributes: true,
          removeStyleLinkTypeAttributes: true
        },
        usemin: 'app/app.js'
      },
      main: {
        cwd: '<%= etsApp.appPath %>',
        src: ['views/**/*.html'],
        dest: '<%= etsApp.devServerPath %>/src/templates.js'
      }
    },

    // Replace Google CDN references
    cdnify: {
      dist: {
        html: ['<%= etsApp.dist %>/public/*.html']
      }
    },

    // Copies remaining files to places other tasks can use
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= etsApp.client %>',
          dest: '<%= etsApp.dist %>/public',
          src: [
            '*.{ico,png,txt}',
            '.htaccess',
            'bower_components/**/*',
            'assets/images/{,*/}*.{webp}',
            'assets/fonts/**/*',
            'index.html'
          ]
        }, {
          expand: true,
          cwd: '.tmp/images',
          dest: '<%= etsApp.dist %>/public/assets/images',
          src: ['generated/*']
        }, {
          expand: true,
          dest: '<%= etsApp.dist %>',
          src: [
            'package.json',
            'server/**/*'
          ]
        }]
      },
      templates: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= etsApp.appPath %>',
          dest: '<%= etsApp.devServerPath %>',
          src: [
            'templates/**/*.html'
          ]
        },{
          expand: true,
          cwd: '<%= etsApp.appPath %>',
          dest: '<%= etsApp.devServerPath %>',
          src: ['assets/**/*']
        }]
      },
      styles: {
        expand: true,
        cwd: '<%= etsApp.client %>',
        dest: '.tmp/',
        src: ['{app,components}/**/*.css']
      }
    },

    buildcontrol: {
      options: {
        dir: 'dist',
        commit: true,
        push: true,
        connectCommits: false,
        message: 'Built %sourceName% from commit %sourceCommit% on branch %sourceBranch%'
      },
      heroku: {
        options: {
          remote: 'heroku',
          branch: 'master'
        }
      },
      openshift: {
        options: {
          remote: 'openshift',
          branch: 'master'
        }
      }
    },

    // Run some tasks in parallel to speed up the build process
    concurrent: {
      server: [
        'sass',
      ],
      test: [
        'sass',
      ],
      dev: ['sass',],
      debug: {
        tasks: [
          'nodemon',
          'node-inspector'
        ],
        options: {
          logConcurrentOutput: true
        }
      },
      dist: [
        'sass',
        'imagemin',
        'svgmin'
      ]
    },

    // Test settings
    karma: {
      unit: {
        configFile: 'karma.conf.js',
        singleRun: true
      }
    },

    mochaTest: {
      options: {
        reporter: 'spec'
      },
      src: ['server/**/*.spec.js']
    },

    protractor: {
      options: {
        configFile: 'protractor.conf.js'
      },
      chrome: {
        options: {
          args: {
            browser: 'chrome'
          }
        }
      }
    },

    env: {
      test: {
        NODE_ENV: 'test'
      },
      prod: {
        NODE_ENV: 'production'
      },
      all: localConfig
    },

    // Compiles Sass to CSS
    sass: {
      server: {
        options: {
          loadPath: [
            '<%= etsApp.appPath %>/styles',
            '<%= etsApp.appPath %>/components'
          ],
          compass: false
        },
        files: {
          '<%= etsApp.devServerPath %>/styles/etsApp.css' : '<%= etsApp.client %>/styles/etsApp.scss'
        }
      }
    },

    concat: {
      options: {
        stripBanners: true,
        banner: '/*! <%= pkg.name %> - v<%= pkg.version %> - <%= grunt.template.today("yyyy-mm-dd") %> */',
      },
      source: {
        files: {
          '<%= etsApp.devServerPath %>/src/etsApp.js': ['<%= etsApp.appPath %>/src/**/*.js']
        }
      },
      components: {
        files: {
          '<%= etsApp.devServerPath %>/src/etsApp-components.js': ['<%= etsApp.appPath %>/components/jquery/dist/jquery.js',
                '<%= etsApp.appPath %>/components/jquery/dist/jquery.js',
                '<%= etsApp.appPath %>/components/angular/angular.js',
                '<%= etsApp.appPath %>/components/angular-resource/angular-resource.js',
                '<%= etsApp.appPath %>/components/angular-cookies/angular-cookies.js',
                '<%= etsApp.appPath %>/components/angular-sanitize/angular-sanitize.js',
                '<%= etsApp.appPath %>/components/angular-route/angular-route.js',
                '<%= etsApp.appPath %>/components/angular-bootstrap/ui-bootstrap-tpls.js',
                '<%= etsApp.appPath %>/components/lodash/dist/lodash.compat.js']
        }
      }
    }
  });

  // Used for delaying livereload until after server has restarted
  grunt.registerTask('wait', function () {
    grunt.log.ok('Waiting for server reload...');

    var done = this.async();

    setTimeout(function () {
      grunt.log.writeln('Done waiting!');
      done();
    }, 1500);
  });

  grunt.registerTask('express-keepalive', 'Keep grunt running', function() {
    this.async();
  });

  grunt.registerTask('serve', function (target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'env:all', 'env:prod', 'express:prod', 'wait', 'open', 'express-keepalive']);
    }

    if (target === 'debug') {
      return grunt.task.run([
        'clean:server',
        'env:all',
        'injector:sass', 
        'concurrent:server',
        'injector',
        'wiredep',
        'autoprefixer',
        'concurrent:debug'
      ]);
    }

    grunt.task.run([
      'clean:server',
      'env:all',
      'injector:sass', 
      'concurrent:server',
      'injector',
      'wiredep',
      'autoprefixer',
      'express:dev',
      'wait',
      'open',
      'watch'
    ]);
  });

  grunt.registerTask('server', function () {
    grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
    grunt.task.run(['serve']);
  });

  grunt.registerTask('test', function(target) {
    if (target === 'server') {
      return grunt.task.run([
        'env:all',
        'env:test',
        'mochaTest'
      ]);
    }

    else if (target === 'client') {
      return grunt.task.run([
        'clean:server',
        'env:all',
        'injector:sass', 
        'concurrent:test',
        'injector',
        'autoprefixer',
        'karma'
      ]);
    }

    else if (target === 'e2e') {
      return grunt.task.run([
        'clean:server',
        'env:all',
        'env:test',
        'injector:sass', 
        'concurrent:test',
        'injector',
        'wiredep',
        'autoprefixer',
        'express:dev',
        'protractor'
      ]);
    }

    else grunt.task.run([
      'test:server',
      'test:client'
    ]);
  });

  grunt.registerTask('build', [
    'clean:dist',
    'injector:sass', 
    'concurrent:dist',
    'injector',
    'wiredep',
    'useminPrepare',
    'autoprefixer',
    'ngtemplates',
    'concat',
    'ngAnnotate',
    'copy:dist',
    //'cdnify',
    'cssmin',
    'uglify',
    'rev',
    'usemin'
  ]);

  grunt.registerTask('default', [
    'newer:jshint',
    'test',
    'build'
  ]);

  grunt.registerTask('dev', [
    'clean:devServer',
    'jshint:all',
    'sass',
    'autoprefixer',
    'ngtemplates',
    'concat:source',
    'concat:components',
    'copy:templates',
    'express:dev',
      'wait',
      'open',
      'watch'
  ]);
};
