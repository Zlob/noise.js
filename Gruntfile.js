module.exports = function(grunt) {

    grunt.initConfig({
        requirejs: {
            compile_js: {
                options: {
                    baseUrl: './src/js',
                    name: 'Noise',
                    out: './dest/Noise.min.js'
                }
            },
        },
        cssmin: {
            minify: {
                src: 'src/css/Noise.css',
                dest: 'dest/Noise.min.css'
            },
        },
        copy: {
            main: {
                src: 'src/css/Noise.css',
                dest: 'dest/Noise.css'
            },
        },
    });

  // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-copy');

  // Default task(s).
    grunt.registerTask('build', ['requirejs:compile_js', 'cssmin', 'copy']);

};