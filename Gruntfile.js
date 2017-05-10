// Generated on 2015-10-09 using generator-angular-fullstack 2.1.1
'use strict';

module.exports = function (grunt) {
  var localConfig;
  try {
    localConfig = require('./server/config/local.env');
  } catch (e) {
    localConfig = {};
  }

  //
  var yeomanConfig = {
    // configurable paths
    client: require('./bower.json').appPath || 'client',
    bower: require('./bower.json').directory,
    dist: 'dist'
  };
  // Load grunt tasks automatically, when needed
  require('jit-grunt')(grunt, {
    express: 'grunt-express-server',
    useminPrepare: 'grunt-usemin',
    protractor: 'grunt-protractor-runner'
  });

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Define the configuration for all the tasks
  grunt.initConfig({

    // Project settings
    pkg: grunt.file.readJSON('package.json'),
    yeoman: yeomanConfig,
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
      language: {
        files: ['<%= yeoman.client %>/i18n/**/*.json'],
        tasks: ['mergeJson']
      },
      js: {
        files: ['<%= yeoman.client %>/scripts/**/*.js'],
        tasks: ['newer:jshint:all'],
        options: {
          livereload: '<%= express.options.livereload %>'
        }
      },
      injectJS: {
        files: [
          '<%= yeoman.client %>/scripts/**/*.js',
          '!<%= yeoman.client %>/scripts/**/*.spec.js',
          '!<%= yeoman.client %>/scripts/**/*.mock.js'],
        tasks: ['injector:scripts']
      },
      injectCss: {
        files: [
          '<%= yeoman.client %>/styles/**/*.css'
        ],
        tasks: ['injector:css']
      },
      mochaTest: {
        files: ['server/**/*.spec.js'],
        tasks: ['env:test', 'mochaTest']
      },
      jsTest: {
        files: [
          '<%= yeoman.client %>/scripts/**/*.spec.js',
          '<%= yeoman.client %>/scripts/**/*.mock.js'
        ],
        tasks: ['newer:jshint:all', 'karma']
      },
      injectLess: {
        files: [
          '<%= yeoman.client %>/styles/**/*.less'],
        tasks: ['injector:less']
      },
      less: {
        files: [
          '<%= yeoman.client %>/styles/**/*.less',
          '<%= yeoman.client %>/scripts/**/*.less'],
        tasks: ['less', 'autoprefixer']
      },
      jade: {
        files: [
          '<%= yeoman.client %>/views/*',
          '<%= yeoman.client %>/views/**/*.jade'],
        tasks: ['jade']
      },
      gruntfile: {
        files: ['Gruntfile.js']
      },
      livereload: {
        files: [
          '{.tmp,<%= yeoman.client %>}/styles/**/*.css',
          '{.tmp,<%= yeoman.client %>}/**/*.html',
          '{.tmp,<%= yeoman.client %>}/scripts/**/*.js',
          '!{.tmp,<%= yeoman.client %>}{app,components}/**/*.spec.js',
          '!{.tmp,<%= yeoman.client %>}/{app,components}/**/*.mock.js',
          '<%= yeoman.client %>/images/{,*//*}*.{png,jpg,jpeg,gif,webp,svg}'
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
        jshintrc: '<%= yeoman.client %>/.jshintrc',
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
        '<%= yeoman.client %>/scripts/**/*.js',
        '!<%= yeoman.client %>/scripts/**/*.spec.js',
        '!<%= yeoman.client %>/scripts/**/*.mock.js'
      ],
      test: {
        src: [
          '<%= yeoman.client %>/scripts/**/*.spec.js',
          '<%= yeoman.client %>/scripts/**/*.mock.js'
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
              '<%= yeoman.dist %>/*',
              '!<%= yeoman.dist %>/.git*'
            ]
          }]
      },
      server: '.tmp'
    },

    // Add vendor prefixed styles
    autoprefixer: {
      options: {
        browsers: ['last 1 version']
      },
      dist: {
        files: [{
            expand: true,
            cwd: '.tmp/styles/',
            src: '{,*/}*.css',
            dest: '.tmp/styles/'
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
        src: ['<%= yeoman.client %>/index.html', 'server/views/**/*.jade'],
        ignorePath: /^(\/|\.+(?!\/[^\.]))+\.+\/client/,
        //exclude: [/bootstrap-sass-official/, /bootstrap.js/, '/json3/', '/es5-shim/', /bootstrap.css/, /font-awesome.css/]
        exclude: [/bootstrap-sass-official/, /bootstrap.js/, '/json3/', '/es5-shim/','/loadash/', /bootstrap.css/, /font-awesome.css/]
      }
    },

    // Compiles Less to CSS
    less: {
      options: {
       paths: [
         '<%= yeoman.client %>/bower_components',
         '<%= yeoman.client %>/client'
       ]
      },
      main: {
        src: '<%= yeoman.client %>/styles/main.less',
        dest: '.tmp/styles/main.css'
      },
      'main-new': {
        src: '<%= yeoman.client %>/styles/main-new.less',
        dest: '.tmp/styles/main-new.css'
      },
      'login': {
        src: '<%= yeoman.client %>/styles/login.less',
        dest: '.tmp/styles/login.css'
      },
      'register': {
        src: '<%= yeoman.client %>/styles/register.less',
        dest: '.tmp/styles/register.css'
      },
      directives: {
        src: '<%= yeoman.client %>/scripts/directives/**/*.less',
        dest: '.tmp/styles/directives.css'
      },
      server: {
        files: {
          '.tmp/app/app.css' : '<%= yeoman.client %>/app/app.less'
        }
      },
    },

    // Renames files for browser caching purposes
    rev: {
      dist: {
        files: {
          src: [
            '<%= yeoman.dist %>/public/scripts/{,*/}*.js',
            '<%= yeoman.dist %>/public/styles/{,*/}*.css',
            '<%= yeoman.dist %>/public/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
            '<%= yeoman.dist %>/public/fonts/*'
          ]
        }
      }
    },
    // Reads HTML for usemin blocks to enable smart builds that automatically
    // concat, minify and revision files. Creates configurations in memory so
    // additional tasks can operate on them
    useminPrepare: {
      html: '<%= yeoman.client %>/index.html',
      jade: 'server/views/**/*.jade',
      options: {
        dest: '<%= yeoman.dist %>/public',
        flow: {
          html: {
            steps: {
              js: ['concat', 'uglifyjs'],
              css: ['cssmin']
            },
            post: {}
          },
          jade: {
            steps: {
              js: ['concat', 'uglifyjs'],
              css: ['cssmin']
            },
            post: {}
          }
        }
      }
    },
    // Performs rewrites based on rev and the useminPrepare configuration
    usemin: {
      html: ['<%= yeoman.dist %>/public/{,*/}*.html'],
      css: ['<%= yeoman.dist %>/public/styles/{,*/}*.css'],
      jade: ['<%= yeoman.dist %>/server/views/**/*.jade'],
      js: ['<%= yeoman.dist %>/public/{,*/}*.js'],
      options: {
        assetsDirs: [
          '<%= yeoman.dist %>/public',
          '<%= yeoman.dist %>/public/images',
          '<%= yeoman.dist %>/server/views'
        ],
        patterns: {
          jade: require('usemin-patterns').jade,
          js: [
            [/(images\/.*?\.(?:gif|jpeg|jpg|png|webp|svg))/gm, 'Update the JS to reference our revved images']
          ]
        }
        //,
        // This is so we update image references in our ng-templates
        //patterns: {
        //  js: [
        //    [/(assets\/images\/.*?\.(?:gif|jpeg|jpg|png|webp|svg))/gm, 'Update the JS to reference our revved images']
        //  ]
        //}
      }
    },

    //minifies default i18n json files
    'json-minify': {
      dist: {
        files: '<%= yeoman.dist %>/i18n/{,*/}*.json'
      }
    },

    //merge all i18n json
    'merge-json': {
      'CN': {
        src: ['<%= yeoman.client %>/i18n/**/*_CN.json'],
        dest: '<%= yeoman.client %>/i18n/zh_CN.json'
      }
    },

    //replace files and content
    replace: {
      defaultI18n: {
        options: {
          patterns: [{
              match: 'content',
              replacement: '<%= JSON.stringify(grunt.file.readJSON(\'client/i18n/zh_CN.json\')) %>'
            }]
        },
        files: [{
            expand: true,
            flatten: true,
            src: ['./config/defaultI18nService.js'],
            dest: '<%= yeoman.client %>/scripts/services/'
          }]
      }
    },
    // The following *-min tasks produce minified files in the dist folder
    imagemin: {
      dist: {
        files: [{
            expand: true,
            cwd: '<%= yeoman.client %>/images',
            src: '{,*/}*.{png,jpg,jpeg,gif}',
            dest: '<%= yeoman.dist %>/public/images'
          }]
      }
    },

    svgmin: {
      dist: {
        files: [{
            expand: true,
            cwd: '<%= yeoman.client %>/images',
            src: '{,*/}*.svg',
            dest: '<%= yeoman.dist %>/public/images'
          }]
      }
    },

    //minifies html page
    htmlmin: {
      dist: {
        options: {
          collapseWhitespace: true,
          conservativeCollapse: false,
          collapseBooleanAttributes: false,
          removeCommentsFromCDATA: true,
          removeOptionalTags: true,
          keepClosingSlash: true
        },
        files: [{
            expand: true,
            cwd: '<%= yeoman.dist %>',
            src: ['*.html', 'views/{,*/}*.html'],
            dest: '<%= yeoman.dist %>'
          }]
      }
    },

    // Allow the use of non-minsafe AngularJS files. Automatically makes it
    // minsafe compatible so Uglify does not destroy the ng references
    ngAnnotate: {
      dist: {
        files: [{
            expand: true,
            cwd: '.tmp/concat/scripts',
            src: '**/*.js',
            dest: '.tmp/concat/scripts'
          }]
      }
    },

    // Copies remaining files to places other tasks can use
    copy: {
      dist: {
        files: [{
            expand: true,
            dot: true,
            cwd: '<%= yeoman.client %>',
            dest: '<%= yeoman.dist %>/public',
            src: [
              '*.{ico,png,txt}',
              '.htaccess',
              'index.html',
              'web.config',
              'i18n/**/*.json',
              'i18n/*.js',
              'views/**/*.html',
              'fonts/*',
              'scripts/directives/**/*.html',
              'images/{,*/}*.{webp}'
            ]
          }, {
            expand: true,
            cwd: '.tmp/images',
            dest: '<%= yeoman.dist %>/public/images',
            src: ['generated/*']
          }, {
            expand: true,
            dest: '<%= yeoman.dist %>',
            src: [
              'package.json',
              'server/**/*'
            ]
          }, {
            expand: true,
            cwd: '<%= yeoman.bower %>/bootstrap/fonts',
            dest: '<%= yeoman.dist %>/public/fonts',
            src: ['*']
          }, { cwd: '', src: "deploy.cmd", dest: 'dist/deploy.cmd' },
          { cwd: '', src: ".deployment", dest: 'dist/.deployment' },
          { cwd: '', src: "Web.config", dest: 'dist/Web.config' },
          { cwd: '', src: "package.json", dest: 'dist/package.json' }
        ]
      },
      styles: {
        expand: true,
        cwd: '<%= yeoman.client %>/styles',
        dest: '.tmp/styles/',
        src: ['{,*/}*.css']
      }
    },

    // Run some tasks in parallel to speed up the build process
    concurrent: {
      server: [
        'jade',
        'less',
      ],
      test: [
        'jade',
        'less',
      ],
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
        'jade',
        'less',
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
      local: {
        NODE_ENV: 'local'
      },
      test: {
        NODE_ENV: 'test'
      },
      dev: {
        NODE_ENV: 'development'
      },
      stage: {
        NODE_ENV: 'stage'
      },
      prod: {
        NODE_ENV: 'production'
      },
      all: localConfig
    },

    // Compiles Jade to html
    jade: {
      compile: {
        options: {
          data: {
            debug: false
          }
        },
        files: [{
            expand: true,
            cwd: '<%= yeoman.client %>',
            src: [
              '{app,components}/**/*.jade'
            ],
            dest: '.tmp',
            ext: '.html'
          }]
      }
    },



    injector: {
      // Inject application script files into index.html (doesn't include bower)
      scripts: {
        options: {
          transform: function (filePath) {
            filePath = filePath.replace('/client/', '');
            filePath = filePath.replace('/.tmp/', '');
            return '<script src="' + filePath + '"></script>';
          },
          starttag: '<!-- injector:js -->',
          endtag: '<!-- endinjector -->'
        },
        files: {
          '<%= yeoman.client %>/index.html': [
            [
              '{.tmp,<%= yeoman.client %>}/scripts/**/*.js',
              '!{.tmp,<%= yeoman.client %>}/scripts/**/*.spec.js',
              '!{.tmp,<%= yeoman.client %>}/scripts/**/*.mock.js'
            ]
          ]
        }
      },

      // Inject component less into app.less
      less: {
        options: {
          transform: function (filePath) {
            filePath = filePath.replace('/client/styles/', '');
            return '@import \'' + filePath + '\';';
          },
          starttag: '// injector',
          endtag: '// endinjector'
        },
        files: {
          '<%= yeoman.client %>/styles/main.less': [
            '<%= yeoman.client %>/styles/**/*.less',
            '<%= yeoman.client %>/scripts/directives/**/*.less'
          ]
        }
      },

      // Inject component css into index.html
      css: {
        options: {
          transform: function (filePath) {
            filePath = filePath.replace('/client/', '');
            filePath = filePath.replace('/.tmp/', '');
            return '<link rel="stylesheet" href="' + filePath + '">';
          },
          starttag: '<!-- injector:css -->',
          endtag: '<!-- endinjector -->'
        },
        files: {
          '<%= yeoman.client %>/index.html': [
            '<%= yeoman.client %>/styles/**/*.css'
          ]
        }
      }
    },

    // publish code by ftp
    'ftp-deploy': {
      development: {
        auth: {
          host: 'cnws-prod-bjb-001.ftp.chinacloudsites.chinacloudapi.cn',
          port: 21,
          authKey: 'key1'
        },
        src: '<%= yeoman.dist %>',
        dest: '/site/wwwroot',
        exclusions: []
      },
      staging: {
        auth: {
          host: 'cnws-prod-bjb-001.ftp.chinacloudsites.chinacloudapi.cn',
          port: 21,
          authKey: 'key2'
        },
        src: '<%= yeoman.dist %>',
        dest: '/site/wwwroot',
        exclusions: []
      },
      product: {
        auth: {
          host: 'cnws-prod-bjb-001.ftp.chinacloudsites.chinacloudapi.cn',
          port: 21,
          authKey: 'key3'
        },
        src: '<%= yeoman.dist %>',
        dest: '/site/wwwroot',
        exclusions: []
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

  grunt.registerTask('express-keepalive', 'Keep grunt running', function () {
    this.async();
  });

  grunt.registerTask('serve', function (target) {
    if (target === 'dist') {
      return grunt.task.run(['env:all', 'env:prod', 'express:prod', 'wait', 'open', 'express-keepalive']);
    }

    if (target === 'dev') {
      return grunt.task.run(['env:all', 'env:dev', 'express:prod', 'wait', 'open', 'express-keepalive']);
    }

    if (target === 'debug') {
      return grunt.task.run([
        'clean:server',
        'env:local',
        'env:all',
        'injector:less',
        'concurrent:server',
        'injector',
        'wiredep',
        'autoprefixer',
        'concurrent:debug'
      ]);
    }

    grunt.task.run([
      'clean:server',
      'env:local',
      'env:all',
      'merge-json',
      'replace:defaultI18n',
      'injector:less',
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

  grunt.registerTask('test', function (target) {
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
        'injector:less',
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
        'injector:less',
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

  grunt.registerTask('build', 'Compile the source', function (target) {
    grunt.task.run([
      'clean:dist',
      'injector:less',
      'concurrent:dist',
      'injector',
      'wiredep',
      'useminPrepare',
      'merge-json',
      'json-minify',
      'replace:defaultI18n',
      'autoprefixer',
      'concat',
      'ngAnnotate',
      'copy:dist',
      'cssmin',
      'uglify',
      'rev',
      'usemin'
          //'htmlmin'
    ]);
  });

  grunt.registerTask('default', [
    'newer:jshint',
    'test',
    'build'
  ]);

  grunt.registerTask('usemintest',[
    'clean:dist',
    'less',
    //'injector:less',
    // 'concurrent:dist',
    //'injector',
    //'wiredep',
    'useminPrepare',
    // 'merge-json',
    // 'json-minify',
    // 'replace:defaultI18n',
    // 'replace:' + target,
    // 'autoprefixer',
    // 'ngAnnotate',
    //'concat',
    // 'copy:dist',
    'cssmin',
    // 'uglify',
  //  'rev',
    //'usemin'
        //'htmlmin'
  ]);

  grunt.registerTask('publish', ['build:development', 'ftp-deploy:development']);
  grunt.registerTask('publish-staging', ['build:staging', 'ftp-deploy:staging']);
  grunt.registerTask('publish-development', ['ftp-deploy:development']);
  grunt.registerTask('deploy', ['ftp-deploy:development']);
  grunt.registerTask('deploy-staging', ['ftp-deploy:staging']);
  grunt.registerTask('deploy-demo', ['ftp-deploy:demo']);
  grunt.registerTask('build-development', ['build:development']);
  grunt.registerTask('build-staging', ['build:staging']);
  grunt.registerTask('build-production', ['build:production']);
};
