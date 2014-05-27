module.exports = function(grunt) {

    var cli = grunt.cli;

    grunt.initConfig({
	  uglify: {
	    ractive: {
	      files: {
	        'src/gallery-y-common-ractive/js/ractive.min.js': ['src/gallery-y-common-ractive/ractive-tmp/ractive.js']
	      }
	    }
	  }
	});
   
    grunt.loadNpmTasks('grunt-yui-contrib');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-css-selectors');
    grunt.loadNpmTasks('grunt-contrib-uglify');

    grunt.registerTask('default', ['boot']);


};
