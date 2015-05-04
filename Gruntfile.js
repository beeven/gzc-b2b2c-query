/**
 * Created by Beeven on 9/2/2014.
 */

module.exports = function(grunt){
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        mochaTest: {
            test: {
                options: {
                    reporter: 'spec',
                    require: "should"
                },
                src: ['test/**/*.test.js']
            }
        },
        watch: {
            stylesheets: {
                files: ['public/css/**/*.styl'],
                tasks: ['stylus'],
                options: {
                    spawn: false
                }
            }
        },
        stylus: {
            compile: {
                files: {
                    'public/css/desktop.css': 'public/css/desktop.styl'
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-mocha-test');
    grunt.loadNpmTasks('grunt-contrib-stylus');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.registerTask('default','mochaTest','stylus','watch');
};
