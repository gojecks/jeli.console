/**
 * JCONSOLE HISTORY HANDLER
 * @param {*} textArea 
 */
function JConsoleHistoryHandler(textArea) {
    var navigation = 0,
        cache = [];
    /**
     * 
     * @param {*} query 
     */
    this.store = function(query) {
        cache.push(query);
        return this;
    };

    this.goForward = function() {
        if (cache.length === navigation) {
            return;
        }

        textArea.value = cache[navigation++] || '';
    };

    this.goBack = function() {
        if (-1 === navigation) {
            return;
        }
        textArea.value = cache[navigation--] || '';
    };

    this.clear = function() {
        cache.length = 0;
        navigation = 0;
    };
}