/*jshint -W015, -W116, -W013, -W011 */
/*globals require:false, module:false */
module.exports = function( grunt ) {
  require( "matchdep" ).filterDev( "grunt-*" )
    .forEach( grunt.loadNpmTasks );

  grunt.initConfig({
    pkg: grunt.file.readJSON( "package.json" ),
    babel: {
      options: {
        sourceMap: true
      },
      dist: {
        files: [{
          expand: true,
          cwd: 'app/assets/javascripts',
          src: ['**/*.js'],
          dest: 'app/assets/build/babel',
          ext:'.js'
        }]
      }
    },
    browserify: {
      options: {
        sourceMap: true
      },
      dist: {
        files: [{
          expand: true,
          cwd: 'app/assets/build/babel',
          src: ['**/*.js'],
          dest: 'app/assets/build/browserify',
          ext:'.js'
        }]
      }
    },
    jshint: {
      all: [ "Gruntfile.js", "app/assets/javascripts/**/*.js", "spec/*.js" ],
      options: {
        jshintrc: ".jshintrc"
      }
    },
    uglify: {
      build: {
        files: [{
          expand: true,
          cwd: "app/assets/build/browserify",
          src: "**/*.js",
          dest: "dist/js",
          reset: true
        }]
      }
    },
    validation: {
      options: {
        stoponerror: false
      },
      files: {
        src: [ "public/**/*.html" ]
      }
    },
    clean: {
      validation: [ "validation-*.json" ]
    },
    watch: {
      test: {
        files: [ "<%= jshint.all %>" ],
        tasks: [ "uglify", "jasmine" ],
        options: {
          livereload: 9000
        }
      },
      lint: {
        files: [ "<%= jshint.all %>", "<%= csslint.strict.src %>", "app/**/*.html" ],
        tasks: [ "jshint", "csslint", "validation", "clean:validation" ]
      },
      sass: {
        files: [ "app/assets/stylesheets/**/*.scss" ],
        tasks: [ "sass" ]
      }
    },
    jasmine: {
      pivotal: {
        src: "app/assets/javascripts/build/**/*.js",
        options: {
          specs: "spec/**/*.spec.js",
          vendor: [
            "vendor/**/*.js"
          ],
          template: "spec/index.tmpl"
        }
      }
    },
    connect: {
      server: {
        options: {
          port: 9001,
          livereload: true,
          keepalive: true
        }
      }
    },
    csslint: {
      options: {
        csslintrc: ".csslintrc"
      },
      strict: {
        src: [ "app/assets/stylesheets/**/*.css" ]
      }
    },
    sass: {
      options: {
        sourceMap: false,
      },
      dist: {
        files: {
          "dist/css/main.css": "app/assets/stylesheets/main.scss"
        }
      }
    },
    copy: {
      files: {
        expand: true,
        dest: "dist",
        cwd: "public/",
        src: "**"
      }
    }
  });

  grunt.registerTask( "default", ["connect"] );
  grunt.registerTask( "lint", ["jshint", "csslint"] );
  grunt.registerTask( "build", ["babel", "browserify",  "uglify", "sass", "copy"]);
};
