/**
 * JCONSOLE STYLING
 */
function JCONSOLEStyling(sandboxId, config) {
    var styles = '#jeli-console, #jeli-console pre.output, #jeli-console pre.output span, #jeli-console textarea, #jeli-console textarea:focus{font-size:14px;line-height:1.3;font-weight:normal;font-family:"Consolas","Andale Mono","Courier New","Courier",monospace;border:0 none;outline:0 none;-webkit-box-shadow:none;-moz-box-shadow:none;box-shadow:none}#jeli-console{background:#333;color:#ccc;background:#333;padding:20px 20px 15px;-webkit-border-radius:10px;-moz-border-radius:10px;border-radius:10px;max-width:CONFIG_WIDTH;margin:30px auto}#jeli-console pre.output{display:block;white-space:pre;width:100%;height:CONFIG_HEIGHT;overflow-y:auto;position:relative;padding:0;margin:0 0 10px;border:0 none;background-color:transparent}#jeli-console pre.output span{color:#f7f7f7}#jeli-console pre.output span.command{color:#ccc}#jeli-console pre.output span.prefix{color:#777}#jeli-console pre.output span.undefined{color:#777}#jeli-console pre.output span.string{color:#99f}#jeli-console pre.output span.number{color:#7f7}#jeli-console pre.output span.error{color:#f77}#jeli-console .input{padding:0 0 0 15px;position:relative}#jeli-console .input:before{content:">";position:absolute;top:1px;left:0;color:#ddd}#jeli-console textarea{color:#f7f7f7;background:#333;border:0 none;outline:0 none;padding:0;margin:0;resize:none;width:100%;overflow:hidden}#jeli-console textarea:focus{outline:0 none}#jeli-console pre.output::-webkit-scrollbar, #jeli-console pre.output::-webkit-scrollbar-button, #jeli-console pre.output::-webkit-scrollbar-track, #jeli-console pre.output::-webkit-scrollbar-track-piece, #jeli-console pre.output::-webkit-scrollbar-thumb, #jeli-console pre.output::-webkit-scrollbar-corner, #jeli-console pre.output::-webkit-resizer{background:transparent}#jeli-console pre.output::-webkit-scrollbar{width:7px;height:7px;-webkit-border-radius:4px;border-radius:4px}#jeli-console pre.output::-webkit-scrollbar-track-piece{-webkit-border-radius:5px;border-radius:5px}#jeli-console pre.output::-webkit-scrollbar-thumb{background:#4f4f4f;border-radius:5px}#jeli-console pre.output::-webkit-scrollbar-button{width:0;height:0}';
    if (sandboxId && sandboxId !== 'jeli-console') {
        styles = styles.replace(new RegExp('jeli-console', 'gi'), sandboxId);
    }

    styles = styles.replace('CONFIG_WIDTH', config.width)
        .replace('CONFIG_HEIGHT', config.height);

    return function() {
        var style = document.createElement('style');
        style.setAttribute('type', 'text/css');
        if (style.styleSheet) {
            style.styleSheet.cssText = styles;
        } else {
            style.appendChild(document.createTextNode(styles));
        }

        (document.getElementsByTagName("head")[0]).appendChild(style);
    }
}