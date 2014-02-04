module.exports = function(grunt) {

    var cli = grunt.cli;

   
    grunt.loadNpmTasks('grunt-yui-contrib');
    grunt.loadNpmTasks('grunt-contrib-compress');
    grunt.loadNpmTasks('grunt-css-selectors');

    grunt.registerTask('default', ['boot']);


};
