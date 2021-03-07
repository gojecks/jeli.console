var jDistDirectory = './dist/';

module.exports = {
    options: {
        separator: '\n\n',
    },
    session: {
        dest: '<%= dir %>dist/jeli.console.js',
        src: ['<%= dir %>src/**/*.js'],
        options: {
            wrap: {
                type: 'UMD',
                data: {
                    moduleName: 'jconsole',
                    returnObj: 'JeliConsole'
                }
            }
        }
    }
};