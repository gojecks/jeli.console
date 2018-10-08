/**
 * JCONSOLE COMManD HANDLER
 */
function jConsoleCommandHandler() {
    var _commands = {};

    /**
     * 
     * @param {*} commandName 
     * @param {*} config 
     */
    this.set = function(commandName, fn) {
        _commands[commandName] = fn;
        return this;
    };

    this.get = function(commandName) {
        return _commands[commandName];
    };

    this.remove = function(commandName) {
        delete _commands[commandName];
        return this;
    };
}