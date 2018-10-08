var jDistDirectory = './dist/';

module.exports = {
    options: {
        separator: '\n\n',
        process: true
    },
    jHttp: {
        dest: '<%= dir %>dist/jeli.console.js',
        src: [
            './jeli.helpers/extend.js',
            '<%= dir %>src/**/*.js'
        ]
    }
};