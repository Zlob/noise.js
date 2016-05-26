module.exports = function(grunt) {

    grunt.initConfig({
        requirejs: {
            compile_js: {
                options: {
                    baseUrl: './src/js',
                    name: 'Noise',
                    out: './dist/Noise.min.js'
                }
            },
        },
        
        less: {
            compile: {                
                files: {
                    'dist/Noise.css' : 'src/less/Noise.less'
                }
            }
        },
        
        cssmin: {
            minify: {
                src: 'dist/Noise.css',
                dest: 'dist/Noise.min.css'
            },
        }        

    });

  // Load the plugin that provides the "uglify" task.
    grunt.loadNpmTasks('grunt-contrib-requirejs');
    grunt.loadNpmTasks('grunt-contrib-cssmin');
    grunt.loadNpmTasks('grunt-contrib-less');
//     grunt.loadNpmTasks('grunt-contrib-copy');

  // Default task(s).
    grunt.registerTask('build', ['requirejs:compile_js', 'less', 'cssmin']);

};