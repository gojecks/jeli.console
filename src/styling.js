/**
 * JCONSOLE STYLING
 */
function JCONSOLEStyling(consoleId, config) {
    var styles = '#jeli-console, #jeli-console pre.output, #jeli-console pre.output span, #jeli-console textarea, #jeli-console textarea:focus{font-size:14px;line-height:1.3;font-weight:normal;font-family:"Consolas","Andale Mono","Courier New","Courier",monospace;border:0 none;outline:0 none;-webkit-box-shadow:none;-moz-box-shadow:none;box-shadow:none}#jeli-console{background:#333;color:#ccc;background:#333;padding:20px 20px 15px;-webkit-border-radius:10px;-moz-border-radius:10px;border-radius:10px;max-width:CONFIG_WIDTH;margin:30px auto; transition:ease 0.8s; -webkit-transition:0.8s;}#jeli-console pre.output{display:block;white-space:pre;width:100%;height:CONFIG_HEIGHT;overflow-y:auto;position:relative;padding:0;margin:0 0 10px;border:0 none;background-color:transparent;}#jeli-console pre.output span{color:#f7f7f7}#jeli-console pre.output span.command{color:#ccc}#jeli-console pre.output span.prefix{color:#777}#jeli-console pre.output span.undefined{color:#777}#jeli-console pre.output span.string{color:#99f}#jeli-console pre.output span.number{color:#7f7}#jeli-console pre.output span.error{color:#f77}#jeli-console .input{padding:0 0 0 15px;position:relative}#jeli-console .input:before{content:">";position:absolute;top:1px;left:0;color:#ddd}#jeli-console textarea{color:#f7f7f7;background:#333;border:0 none;outline:0 none;padding:0;margin:0;resize:none;width:100%;overflow:hidden}#jeli-console textarea:focus{outline:0 none}#jeli-console pre.output::-webkit-scrollbar, #jeli-console pre.output::-webkit-scrollbar-button, #jeli-console pre.output::-webkit-scrollbar-track, #jeli-console pre.output::-webkit-scrollbar-track-piece, #jeli-console pre.output::-webkit-scrollbar-thumb, #jeli-console pre.output::-webkit-scrollbar-corner, #jeli-console pre.output::-webkit-resizer{background:transparent}#jeli-console pre.output::-webkit-scrollbar{width:7px;height:7px;-webkit-border-radius:4px;border-radius:4px}#jeli-console pre.output::-webkit-scrollbar-track-piece{-webkit-border-radius:5px;border-radius:5px}#jeli-console pre.output::-webkit-scrollbar-thumb{background:#4f4f4f;border-radius:5px}#jeli-console pre.output::-webkit-scrollbar-button{width:0;height:0} .overlay{ position:fixed;width:100%;height:100%; background:#3a3f51; opacity:.8; z-index:1001;top:0px;left:0px; content:""} #jeli-console #control-container{position: absolute;top: -10px;background: #333;width: 100%;right: 0px;clear: both;height: 20px;} #jeli-console #control-container button {float: right;background: transparent;border: none;font-weight: bold;color: #fff;font-size: inherit;} ';
    if (consoleId && consoleId !== 'jeli-console') {
        styles = styles.replace(new RegExp('jeli-console', 'gi'), consoleId);
    }
    styles = styles.replace('CONFIG_WIDTH', config.width)
        .replace('CONFIG_HEIGHT', config.height);

    var jstyle = document.createElement('style');

    function writeStyle() {
        jstyle.setAttribute('type', 'text/css');
        if (jstyle.styleSheet) {
            jstyle.styleSheet.cssText = styles;
        } else {
            jstyle.appendChild(document.createTextNode(styles));
        }

        (document.getElementsByTagName("head")[0]).appendChild(jstyle);

        return this;
    }

    function removeStyle() {
        jstyle.remove();
    }

    /**
     * 
     * @param {*} area 
     */
    function getComputedStyle(area) {
        var _computedStyle = window.getComputedStyle(area);
        return function(style) {
            return parseInt(_computedStyle.getPropertyValue(style), 0);
        }
    }

    var _postions = {
        bottomLeft: {
            bottom: "0px"
        },
        bottomRight: {
            right: "0px",
            bottom: "0px"
        },
        topRight: {
            right: "0px",
            top: "0px"
        },
        topLeft: {
            top: "0px"
        },
        bottom: {
            bottom: "0px"
        },
        top: {
            top: "0px"
        },
        right: {
            right: "0px"
        }
    }

    /**
     * animateConsoleArea
     */
    function animateConsoleArea(consoleArea) {
        /**
         * check if sticky is defined
         */
        if (config.sticky) {
            var _getStyle = getComputedStyle(consoleArea),
                marginTop = _getStyle('margin-top'),
                marginBottom = _getStyle('margin-bottom'),
                marginLeft = _getStyle('margin-left'),
                marginRight = _getStyle('margin-right'),
                clientHeight = window.innerHeight,
                clientWidth = window.innerWidth,
                consoleWidth = consoleArea.clientWidth,
                consoleHeight = consoleArea.clientHeight,
                paddingTop = _getStyle('padding-top'),
                paddingBottom = _getStyle('padding-bottom'),
                paddingLeft = _getStyle('padding-left'),
                paddingRight = _getStyle('padding-right');

            var styling = {
                'position': 'fixed',
                'z-index': 1100,
                'width': consoleWidth + 'px',
                'height': (consoleHeight - (paddingTop + paddingBottom)) + 'px'
            };

            if (!config.position || config.position === 'auto') {
                styling['top'] = ((clientHeight - (consoleHeight + (marginBottom + marginTop))) / 2) + 'px';
                styling['left'] = ((clientWidth - consoleWidth) / 2) + 'px';
            } else {
                styling = extend(styling, _postions[config.position] || {});
            }

            for (var style in styling) {
                consoleArea.style[style] = styling[style];
            }
        }
    }

    return {
        writeStyle: writeStyle,
        animate: animateConsoleArea,
        removeStyle: removeStyle
    };
}