module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    concat: {
      dist: {
        src: [
          'public/javascripts/*.js',
          'public/javascripts/routes/*.js',
          "public/javascripts/services/*.js",
          "public/javascripts/filters/*.js",
          "public/javascripts/directives/*.js",
          "public/javascripts/controllers/*.js"
        ],
        dest: 'public/javascripts/build/production.js',
      }
    },
    // uglify: {
    //   build: {
    //     src: 'public/javascripts/build/production.js',
    //     dest: 'public/javascripts/build/production.min.js'
    //   }
    // },
    watch: {
      scripts: {
        files: [
          'public/javascripts/*.js',
          'public/javascripts/routes/*.js',
          "public/javascripts/services/*.js",
          "public/javascripts/filters/*.js",
          "public/javascripts/directives/*.js",
          "public/javascripts/controllers/*.js"
        ],
        tasks: [
          'concat'
          // ,'uglify'
        ],
        options: {
          spawn: false,
        },
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-concat');
  // grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');

  grunt.registerTask('default', [
    'concat',
    // "uglify",
    "watch"
  ]);
};
