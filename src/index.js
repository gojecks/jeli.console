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
        var options = {
            events: {},
            consoleId: "jeli-console",
            multiLine: false,
            mode: 2,
            enableHistory: true,
            useFrameSandBox: false,
            styling: {
                sticky: false,
                postion: "auto"
            },
            defaultCommand: "",
            addControl: false
        };

        /**
         * extend the options
         */
        for (var prop in definition) {
            options[prop] = definition[prop];
        }

        /**
         * check if container is defined
         */
        if (!options.container) {
            options.container = "body";
        }

        if (!options.styling.width) {
            options.styling.width = "640px";
        }

        if (!options.styling.height) {
            options.styling.height = "285px";
        }

        /**
         * resolve the container
         */
        var container = (typeof options.container === "string" ? document.querySelector(options.container) : options.container),
            _style = JCONSOLEStyling(options.consoleId, options.styling),
            _commandHandler = new jConsoleCommandHandler(),
            consoleArea,
            outputArea,
            inputContainer,
            inputArea,
            overlay,
            jConsoleHistory;

        if (!container) {
            throw new Error('Dock yard not found for console');
        }

        if (container.querySelector('#' + options.consoleId)) {
            throw new Error('Instance already exists');
        }


        function generateView() {
            consoleArea = document.createElement('div');
            outputArea = document.createElement('pre');
            inputContainer = document.createElement('div');
            inputArea = document.createElement('textArea');
            /**
             * append the template
             */
            consoleArea.setAttribute('id', options.consoleId);
            outputArea.className = "output";
            inputContainer.className = "input";
            inputArea.setAttribute('rows', options.multiLine ? 4 : 1);
            inputArea.setAttribute('placeholder', 'Type some command / or :help to see commands');
            consoleArea.appendChild(outputArea);

            if (options.mode > 1) {
                consoleArea.appendChild(inputContainer);
                inputContainer.appendChild(inputArea);
                inputArea.addEventListener('keydown', jConsoleInputEventListener, false);
                /**
                 * set default command only if defined
                 */
                if (options.defaultCommand) {
                    inputArea.value = options.defaultCommand;
                }
                jConsoleHistory = new JConsoleHistoryHandler(inputArea);
                inputArea.focus();
            }

            if ((options.styling.sticky && options.mode <= 1) || options.addControl) {
                var buttonContainer = document.createElement('div'),
                    button = document.createElement('button');
                buttonContainer.appendChild(button);
                buttonContainer.setAttribute("id", "control-container");
                button.type = "button";
                button.setAttribute("id", "_close_btn_");
                button.innerHTML = '<span> X </span>';
                consoleArea.insertBefore(buttonContainer, outputArea);
                button.addEventListener('click', function() {
                    cleanUp();
                });
                buttonContainer = null;
                button = null;
            }

            container.appendChild(consoleArea);


            /**
             * check if overlay is active
             */
            if (options.styling.overlay) {
                overlay = document.createElement('div');
                overlay.className = "overlay";
                container.appendChild(overlay);
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
        function generateParam(query) {
            var ret = {};
            query.forEach(function(item) {
                if (item) {
                    var _item = item.split("="),
                        value = parseInt(_item[1]);
                    ret[_item[0]] = !isNaN(value) ? value : _item[1];
                }
            });

            return ret;
        }

        /**
         * 
         * @param {*} query 
         */
        function $performTask(query) {
            var _query = query.replace(/\s/, '').split("--");
            var command = _commandHandler.get(_query.shift());
            if (command) {
                if (typeof command === "function") {
                    command(writeToOutput, generateParam(_query));
                } else {
                    writeToOutput(command);
                }

            } else if (_commandHandler.global) {
                _commandHandler.global(query, writeToOutput);
            } else {
                var result;
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
                content = '<span class="prefix">&raquo; </span>';
                if (typeof message === 'object') {
                    message = JSON.stringify(message, null, 3);
                }
                content += '<span class="' + (typeof message) + '">' + message + '</span>\n';
            }

            outputArea.innerHTML += content;
            // autoscroll page
            outputArea.scrollTop = outputArea.scrollHeight;
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

        function _resizeFn(ev) {
            _style.animate(consoleArea);
        }

        /**
         * Destroy and clean up
         */
        function cleanUp() {
            if (options.mode > 1) {
                inputArea.removeEventListener('keydown', jConsoleInputEventListener);
            }

            if (options.styling.sticky) {
                if (options.styling.overlay) {
                    overlay.remove();
                }
                window.removeEventListener('resize', _resizeFn);
            }

            consoleArea.remove();
            if (options.mode > 1) {
                jConsoleHistory.clear();
            }
            _style.removeStyle();
        }

        /**
         * bind window resizing
         */
        window.addEventListener('resize', _resizeFn);

        /**
         * register default commands
         */
        _commandHandler
            .set("clear", function() {
                //clear history and display
                jConsoleHistory.clear();
                outputArea.innerHTML = "";
            })
            .set(":whoami", "I am 'JCONSOLE' how may i help you?")
            .set(":help", "Commands: :whoami, clear\n use arrow up and down to navigate between history")
            .set(':exit', function(writer, param) {
                writer('destroying console, all history will be lost and window will be destoryed');
                var _timer = setTimeout(function() {
                    cleanUp();
                }, param.timer || 1000);
            });


        return {
            init: function() {
                generateView();
                _style.writeStyle()
                    .animate(consoleArea);
                triggerEvent('console.initialized', true);
            },
            instance: {
                writer: writeToOutput,
                destroy: cleanUp,
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