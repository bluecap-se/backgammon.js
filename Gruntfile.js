module.exports = function( grunt ) {
    'use strict';

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),
        concat: {
            options: {
                banner: '/*!\n' +
                    '* <%= pkg.name %>\n' +
                    '* v<%= pkg.version %> - ' +
                    '<%= grunt.template.today("yyyy-mm-dd") %>\n' +
                    '<%= pkg.homepage ? "* " + pkg.homepage + "\\n" : "" %>' +
                    '* (c) <%= pkg.author.email %>;' +
                    ' <%= pkg.license %> License\n' +
                    '* Created by: <%= _.pluck(pkg.maintainers, "name") %>\n' +
                    '*/',
                stripBanners: true
            },
            dist: {
                src: ['src/dependencies/excanvas/excanvas.js', 'src/dependencies/easeljs/lib/easeljs-0.7.1.min.js', 'src/dependencies/jrumble/jquery.jrumble.min.js', 'src/js/backgammon.js', 'src/js/dice.js', 'src/js/main.js', 'src/js/config.js'],
                dest: 'build/js/backgammon.js'
            }
        },
        uglify: {
            options: {
                report: 'gzip',
                banner: '<%= concat.options.banner %>'
            },
            dist: {
                options: {
                    sourceMap: 'build/js/backgammon.map'
                },
                files: {
                    'build/js/backgammon.min.js': ['build/js/backgammon.js']
                }
            }
        },
        less: {
            dist: {
                options: {
                    compile: true,
                    compress: false
                },
                files: [
                    {src: ['src/css/main.less'], dest: 'build/css/main.css', nonull: true},
                ]
            },
            distMin: {
                options: {
                    compile: true,
                    compress: true
                },
                files: [
                    {src: ['src/css/main.less'], dest: 'build/css/main.min.css', nonull: true},
                ]
            }
        },
        watch: {
            scripts: {
                files: '<%= jshint.all %>',
                tasks: ['test']
            }
        },
        jshint: {
            options: {
                jshintrc: '.jshintrc'
            },
            all: ['Gruntfile.js', 'build/js/backgammon.js'/*, 'test/tests.js'*/]
        },
        shell: {
            options: {
                stdout: true,
                stderr: true,
                failOnError: true
            },
            copyFiles: {
                command: [
                    'cp src/dependencies/jquery/dist/jquery.min.js build/js/',
                    'cp -r src/images/ build/images/',
                    'cp src/index.html build/'
                ].join('&&')
            },
            clean: {
                command: 'rm -rf build/'
            }
        }
    });

    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-less');
    grunt.loadNpmTasks('grunt-contrib-uglify');
    grunt.loadNpmTasks('grunt-contrib-watch');

    grunt.registerTask('default', ['concat', 'uglify', 'less', 'shell:copyFiles']);

    grunt.registerTask('clean', ['shell:clean']);

};