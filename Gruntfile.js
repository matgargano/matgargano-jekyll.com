var librariesFileList = [],
    projectFileList = [
        "external/jquery/dist/jquery.js",
        "external/isotope/dist/isotope.pkgd.min.js",
        "js/_main.js"
    ],
    cssConcatList = [
        'external/animate.css/animate.css'
    ];

module.exports = function (grunt) {
    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        watch: {
            options: {
                livereload: true
            },
            sass: {
                files: [
                    'sass/*.scss',
                    'sass/**/*.scss'
                ],
                tasks: ['nojekyll']
            },
            js: {
                files: [
                    'js/*.js',
                    'js/**/*.js'
                ],
                tasks: ['nojekyll']
            }

        },
        cssmin: {
            options: {
                keepSpecialComments: 0
            },
            target: {
                files: {
                    'css/style.css': ['css/style.css']
                }
            }


        },
        sass: {

            options: {
                loadPath: [
                    'sass'

                ]
            },
            production: {
                options: {
                    style: 'expanded',
                    sourcemap: 'auto',
                    precision: 4
                },
                files: {
                    'css/style.css': 'sass/main.scss'
                }
            }
        },
        imagemin: {
            theme: {
                files: [
                    {
                        expand: true,
                        cwd: "images/",
                        src: "**/*.{png,jpg}",
                        dest: "images/"
                    }
                ]
            }
        },
        autoprefixer: {
            multiple_files: {
                src: "css/style.css"
            }
        },
        shell: {
            bower: {
                command: 'bower install'
            },
            "jekyll": {
                command: 'jekyll serve --watch --baseurl ""'
            },

            "jekyllBuild": {
                command: 'jekyll build'
            },
            "robots-staging": {
                command: 'printf "User-agent: *\nDisallow: /" > ./docs/robots.txt'
            }

        },
        "uglify": {
            "theme": {
                "options": {
                    "preserveComments": false
                },
                "files": {

                    "js/main.min.js": librariesFileList.concat(projectFileList)
                }
            }
        },
        rsync: {
            staging: {
                options: {
                    src: "docs/",
                    dest: "ubuntu@qa.statenweb.com:/home/ubuntu/matgargano.com/public",
                    ssh: true,
                    recursive: true
                }
            },
            production: {
                options: {
                    src: "docs/",
                    dest: "ubuntu@qa.statenweb.com:/home/ubuntu/matgargano.com/public",
                    ssh: true,
                    recursive: true
                }
            }
        },
        jshint: {
            all: ['js/_main.js'],
            options: {
                "forin": true,
                "noarg": true,
                "noempty": true,
                "eqeqeq": true,
                "bitwise": true,
                "undef": true,
                "unused": false,
                "curly": true,
                "browser": true,
                "strict": false
            }
        },
        concat: {
            dist: {
                src: ['css/style.css'].concat(cssConcatList),
                dest: 'css/style.css'
            }
        }


    });


    grunt.loadNpmTasks("grunt-contrib-sass");
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks("grunt-contrib-imagemin");
    grunt.loadNpmTasks('grunt-autoprefixer');
    grunt.loadNpmTasks('grunt-shell');
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-contrib-cssmin");
    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks("grunt-rsync");
    grunt.registerTask('build', ['shell:bower', 'sass:production', 'jshint', 'uglify:theme',  'autoprefixer', 'concat', 'cssmin','shell:jekyllBuild']);
    grunt.registerTask('default', ['build', 'shell:jekyll']);
    grunt.registerTask('nojekyll', ['shell:bower', 'sass:production', 'jshint', 'uglify:theme','concat', 'autoprefixer', 'cssmin']);
    grunt.registerTask('deployStaging', ['build', 'shell:robots-staging', 'rsync:staging']);
    grunt.registerTask('deployProduction', ['build', 'rsync:production']);


};