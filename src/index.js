(function(root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['jconsole'], function(b) {
            return (root.jconsole = factory(b));
        });
    } else if (typeof module === 'object' && module.exports) {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory(require('jconsole'));
    } else {
        // Browser globals
        root.jconsole = factory(root.b);
    }
}(typeof self !== 'undefined' ? self : this, function(b) {
    /**
     * JCONSOLE LIBRARY
     * 
     */
    function JCONSOLE(definition) {
        var options = extend(true, {
            events: {},
            sandboxId: "jeli-console",
            multiLine: false,
            mode: 2,
            enableHistory: true,
            styling: {
                height: "285px",
                width: "640px"
            }
        }, definition);

        /**
         * check if container is defined
         */
        if (!options.container) {
            options.container = "body";
        }

        /**
         * resolve the container
         */
        var container = document.querySelector(options.container),
            drawStyle = JCONSOLEStyling(options.sandboxId, options.styling),
            _commandHandler = new jConsoleCommandHandler(),
            consoleArea,
            outputArea,
            inputContainer,
            inputArea,
            jConsoleHistory;
        if (!container) {
            throw new Error('Dock yard not found for console');
        }


        function generateView() {
            consoleArea = document.createElement('div');
            outputArea = document.createElement('pre');
            inputContainer = document.createElement('div');
            inputArea = document.createElement('textArea');
            /**
             * append the template
             */
            consoleArea.setAttribute('id', options.sandboxId);
            outputArea.className = "output";
            inputContainer.className = "input";
            inputArea.setAttribute('rows', options.multiLine ? 4 : 1);
            inputArea.setAttribute('placeholder', 'Type some command / javascript code');
            consoleArea.appendChild(outputArea);

            if (options.mode > 1) {
                consoleArea.appendChild(inputContainer);
                inputContainer.appendChild(inputArea);
                inputArea.addEventListener('keydown', jConsoleInputEventListener, false);
                container.appendChild(consoleArea);
                jConsoleHistory = new JConsoleHistoryHandler(inputArea);
                inputArea.focus();
            }
        }

        /**
         * 
         * @param {*} $event 
         */
        function jConsoleInputEventListener($event) {
            switch ($event.keyCode) {
                case (40):
                    if (options.enableHistory) {
                        jConsoleHistory.goForward();
                    }
                    break;
                case (38):
                    if (options.enableHistory) {
                        jConsoleHistory.goBack();
                    }
                    break;
                case (13):
                    $event.preventDefault();
                    triggerInsertEvent();
                    break;
            }
        }

        /**
         * 
         * @param {*} myString 
         */
        function getTextAreaLine(myString) {
            return myString.substring(myString.lastIndexOf('\n') + 1, myString.length);
        }

        /**
         * triggerInsertEvent()
         */
        function triggerInsertEvent() {
            var query = inputArea.value;
            if (options.enableHistory) {
                jConsoleHistory.store(query);
            }
            writeToOutput(query, "c");
            inputArea.value = "";
            $performTask(query);
        }

        /**
         * 
         * @param {*} query 
         */
        function $performTask(query) {
            var command = _commandHandler.get(query),
                result;
            if (command) {
                if (typeof command === "function") {
                    command(writeToOutput);
                } else {
                    writeToOutput(command);
                }

            } else if (_commandHandler.external) {
                commandHandler.external(writeToOutput);
            } else {
                try {
                    /**
                     * evil eval
                     */
                    result = eval(query);
                } catch (e) {
                    result = e;
                } finally {
                    writeToOutput(result);
                }
            }
        }

        /**
         * 
         * @param {*} message 
         * @param {*} type 
         */
        function writeToOutput(message, type) {
            var content;
            if (type === "c") {
                content = '<span class="command">' + message + '</span>\n';
            } else {
                content = '<span class="prefix">» </span><span class="' + (typeof message) + '">' + message + '</span>\n';
            }

            outputArea.innerHTML += content;
        }

        /**
         * triggerEvent
         */
        function triggerEvent(eventName, arg) {
            if (options.events && options.events[eventName]) {
                var args = [].slice.call(arguments);
                args.shift();
                options.events[eventName].apply(options.events[eventName], args);
            }
        }

        /**
         * register default commands
         */
        _commandHandler
            .set("clear", function() {
                //clear history and display
                jConsoleHistory.clear();
                outputArea.innerHTML = "";
            })
            .set(":whoami", "I am 'JCONSOLE' how may i help you?");


        return {
            setMessage: writeToOutput,
            init: function() {
                drawStyle();
                generateView();
                triggerEvent('console.initialized', true);
            },
            instance: {
                destroy: function() {
                    if (options.mode > 1) {
                        inputArea.removeEventListener('keydown');
                    }
                    consoleArea.remove();
                },
                /**
                 * Enable MultiLine
                 */
                enableMultiLine: function() {
                    inputArea.setAttribute('rows', 4);
                    return this;
                },
                switchMode: function(mode) {
                    if (typeof mode === "string") {
                        return;
                    }

                    options.mode = mode;
                    inputContainer.style.display = mode > 1 ? 'block' : 'none';
                    return this;
                }
            },
            command: _commandHandler
        };
    }

    return JCONSOLE;
}));