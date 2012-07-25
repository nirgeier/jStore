var jStore = jStore || {};

jStore.utils = {};
//various utility methods, mixins and Objects
!function (ns, utils) {

    /**
     * @module Helper
     * @class utils
     */

    /**
     *
     * @param obj
     * @param item
     * @return {Object}
     */

        //shorthand for object.hasOwnProperty
    function has(obj, item) {
        return Object.prototype.hasOwnProperty.call(obj, item);
    }

    /*
     * returns the value of a chain of variables if exists
     * 
     * instead of doing
     * loaded = (book && book.current_page && book.current_page.loaded)
     * 
     * you can do
     *
     * loaded = find(book,'current_page','loaded');
     * 
     * or
     * 
     * loaded = find(book,'current_page.loaded');
     *
     */
    function find(obj /*[,item [,item ...]]*/) {
        var list = Array.prototype.splice.call(arguments, 1),
            name;


        if (!obj) return false;

        if (list.length == 1 && list[0].indexOf('.') > -1) {
            list = list[0].split('.');
        }

        while (name = list.shift()) {
            if (obj == null) return null;
            obj = obj[name];
        }

        return obj;
    }

    /*
     * checks for long chains of existance
     * 
     * instead of doing if (book && book.current_page && book.current_page.loaded)
     * 
     * if (exists(book,'current_page','loaded')) ...
     * 
     * or
     * 
     * if (exists(book,'current_page.loaded')) ....
     *
     */
    function exists(obj /*[,item [,item ...]]*/) {
        return find.apply(null, arguments) != null;
    }

    //Taken from Mootools
    function bind(that) {
        var self = this,
            args = arguments.length > 1 ? Array.prototype.slice.call(arguments, 1) : null,
            F = function () {
            };

        var bound = function () {
            var context = that, length = arguments.length;
            if (this instanceof bound) {
                F.prototype = self.prototype;
                context = new F;
            }

            var result = (!args && !length)
                ? self.call(context)
                : self.apply(context, args && length ? args.concat(Array.prototype.slice.call(arguments, 0)) : args || arguments);

            return context == that ? result : context;
        };

        return bound;
    }

    if (false === ('bind' in Function.prototype)) {
        Function.prototype.bind = bind;
    }

    this.bind = function (fn, scope) {
        return fn.bind(scope);
    };

    this.has = has;
    this.exists = exists;
    this.find = find;

    this.toArray = function (item) {
        return (item instanceof Array ? item : [item]);
    };

    //removes an item from an array based on it's index
    this.arrRemove = function arrRemove(arr, index) {
        return arr.splice(index, 1);
    };

    this.removeItem = function (arr, item) {
        var index = arr.indexOf(item);
        if (index < 0) return;

        return arr.splice(index, 1);
    };

    this.indexOf = function (arr, item) {
        return arr.indexOf(item);
    };

    this.keys = Object.keys || function (obj) {
        var arr = [], key;
        for (key in obj) if (has(obj, key)) arr.push(key);
        return arr;
    };

    this.merge = Object.merge || function (target, params) {
        var key, i, obj;

        for (i = 1; obj = arguments[i]; i++) {
            for (key in obj) if (has(obj, key)) {
                target[key] = obj[key];
            }
        }

        return target;
    };

    this.prefetch = function () {
        var i, src, img;

        for (i = 0; src = arguments[i]; i++) {
            img = new Image();
            img.src = src;
        }
    };

    /**
     * This function waits until all specified font-families loaded and then executes a callback function.
     * Supplied font-families should be already defined in the document, by URL or base64.
     * If after specific threshold time fonts still not loaded, callback will be invoked.
     * @method onFontsLoad
     *
     * @param {Array} fontFamiliesArray Array of font-families to test
     * @param {Function} fontsLoadedCallback Callback function to call after all font-families loaded
     */
    this.onFontsLoad = function onFontsLoad(fontFamiliesArray, fontsLoadedCallback) {
        var testContainer,
            testDiv,
            origHeight,
            origWidth,
            i,
            clonedDiv,
            interval,
            tryCount = 0,
            maxNumOfTries = 5,
            tryIntervalMs = 500;

        function testDivDimensions() {
            var i, testDiv;
            for (i = testContainer.childNodes.length - 1; i >= 0; i--) {
                testDiv = testContainer.childNodes[i];
                if (testDiv.offsetWidth !== origWidth || testDiv.offsetHeight !== origHeight) {
                    // Div's dimensions changed, this means its font loaded, remove it from testContainer div
                    testDiv.parentNode.removeChild(testDiv);
                }
            }
        }

        // Use pretty big fonts "40px" so smallest difference between standard
        // "serif" fonts and tested font-family will be noticable.
        testContainer = document.createElement("div");
        testContainer.style.cssText = "position:absolute; left:-1000px; top:-1000px; font-family:serif; font-size:40px;";
        document.body.appendChild(testContainer);

        testDiv = document.createElement("div");
        testDiv.appendChild(document.createTextNode("The quick brown fox jumps over the lazy dog"));

        // Add div for each font-family
        for (i = 0; i < fontFamiliesArray.length; i++) {
            clonedDiv = testDiv.cloneNode(true);
            testContainer.appendChild(clonedDiv);
            // Get dimensions of div before applying font-family,
            // do it once because initially all divs will have same dimensions.
            if (i === 0) {
                origHeight = clonedDiv.offsetHeight;
                origWidth = clonedDiv.offsetWidth;
            }
            // Apply tested font-family
            clonedDiv.style.fontFamily = fontFamiliesArray[i];
        }

        // Check if dimension of all divs changed immediately after applying font-family
        // maybe all fonts were already loaded so we don't need to poll and wait.
        testDivDimensions();

        // Check that there is at least one div, means at least one not loaded font.
        if (testContainer.childNodes.length) {
            // Poll div for their dimensions every tryIntervalMs.
            interval = window.setInterval(function () {
                // Loop through all divs and check if their dimensions changed.
                testDivDimensions();
                // If no divs remained, then all fonts loaded.
                // We also won't wait too much time, maybe some fonts are broken.
                if (testContainer.childNodes.length === 0 || tryCount === maxNumOfTries) {
                    // All fonts are loaded OR (maxNumOfTries * tryIntervalMs) ms passed.
                    window.clearInterval(interval);
                    testContainer.parentNode.removeChild(testContainer);
                    fontsLoadedCallback();
                } else {
                    tryCount++;
                }
            }, tryIntervalMs);
        } else {
            // All fonts are loaded
            testContainer.parentNode.removeChild(testContainer);
            fontsLoadedCallback();
        }
    };

    this.createIScroll = function (el, obj, opts) {
        var iscroll = new iScroll(el, opts);

        if (obj) obj.iscroll = iscroll;

        if (exists(obj, 'addEvent')) obj.addEvent('destroy', function () {
            delete obj['iscroll'];

            iscroll.destroy();
        });
    };

    // mimickin corc's Object.create
    this.inherit = function (obj, parent, props) {
        var key;

        function F() {
        }

        F.prototype = parent.prototype;
        obj.prototype = new F();
        obj.prototype.constructor = obj;

        for (key in props) if (has(props, key)) {
            obj.prototype[key] = props[key];
        }

        obj.prototype.$parent = function (name, args) {
            return parent.prototype[name].apply(this, args || []);
        };

        obj.prototype.$construct = function (args) {
            parent.apply(this, args || []);
        };

        return obj;
    };

    this.log = function (arg1, arg2) {
        if (jStore.prod) return;

        if (exists(window, 'console.log')) {
            console.log.apply ? console.log.apply(console, arguments) : console.log(arg1, arg2);
        }
    };

    this.warn = function (arg1, arg2) {
        if (jStore.prod) return;

        var fn_name = exists(window, 'console.warn') ? 'warn' : exists(window, 'console.log') ? 'log' : null;

        if (!fn_name) return;

        console[fn_name].apply ? console[fn_name].apply(console, arguments) : console[fn_name](arg1, arg2);
    };

    /**
     * sendSelectedText used by logItem.prepare method to parse MenuSelection context.selectedText and highlight type
     * @param e : LogItem object
     */
    this.sendSelectedText = function (e) {
        var args = e.args,
            selectedText = ns.utils.find(args, 'context.selectedText');

        if (!selectedText) {
            selectedText = ns.utils.find(args, 'selectedText');
        }

        if (!selectedText) {
            return false;
        }

        this.moreData = {
            'selectedText':encodeURIComponent(selectedText),
            'length':selectedText.length
        };

        if (args.type) {
            this.moreData.highlightStyle = args.type;
        }
    };

    /**
     * a syntax sugar for calling other object's methods on an object
     *
     * Returned function will function just like inherit's $parent, only that if you only pass it arguments it will call the constructor (like inherit#$construct)
     *
     * @method bindParent
     * @static
     *
     * @param {Object} target object
     * @param {Object} parent object
     * @param {bool}   [use_directly] if set to true, will use parent directly, rather than use it's prototype
     *
     * @example
     *
     *    this.parent = utils.bindParent(this, Foo);
     *
     *    this.parent([some_arg]); //will call Foo - bound to obj
     *    this.parent('bar',[some_arg]); //will call Foo.prototype.bar - bound to obj
     *
     * @return {Function}
     */
    this.bindParent = function (obj, parent, use_directly) {
        var construct = parent;

        if (!use_directly) {
            parent = parent.prototype;
        }

        return function (method, args) {
            if (!args && typeof method != 'string') {
                args = method;
                method = construct;
            } else {
                method = parent[method];
            }

            return method.apply(obj, args || []);
        };
    };

    /*
     * provide a way to open link in new Safari mobile window while the application is in home screen mode (running as standalone web app)
     * @param url {String} target url
     */
    this.openLinkInNewWindow = function (url) {
        var link = document.createElement('a'),
            clickevent = document.createEvent('Event');

        link.target = '_blank';
        link.href = url;

        clickevent.initEvent('click', true, false);
        link.dispatchEvent(clickevent);
    };

    /**
     * This object allows you to pass a list of events to listen to. Once all of them are done, it will fire a callback
     * @class utils.CallbackGroup
     * @constructor
     *
     * @param {object} params
     *  @param {object} params.events a map of event-name => event target
     *  @param {function} callback    a function to run once events are done
     *
     *  @example
     *      var group = new utils.CallbackGroup({
     *          callback : function(){console.log('foo');},
     *          events :{
     *              'load' : this.bridge,
     *              'iclick' : this.element
     *          }
     *      });
     */
    this.CallbackGroup = function CallbackGroup(params) {
        var ev, counter = 0, max = 0,
            stopped,
            _params = params;

        function attach(target, type) {
            if (target.addEventOnce) {
                target.addEventOnce(type, fire);
            } else {
                target.addEventListener(type, function once() {
                    fire();
                    target.removeEventListener(type, once, false);
                }, false);
            }
        }

        /**
         * cancels the stack
         * @method stop
         * @param {boolean} [run] if set to true will run the callback
         */
        function stop(run) {
            var ev;

            if (run) {
                _params.callback();
            }

            stopped = true;

            _params = null;
        }

        function fire() {
            counter++;
            if (counter == max && !stopped) {
                stop(true);
            }
        }

        for (ev in _params.events) {
            attach(_params.events[ev], ev);
            max++;
        }

        return {
            constructor:CallbackGroup,
            stop:stop
        };
    };

    this.logStorage = function logStorage() {
        var arr = [];
        for (var name in localStorage) arr.push({name:name, l:localStorage[name].length});

        arr.sort(function (a, b) {
            return +a.l > +b.l
        });

        arr.forEach(function (p) {
            console.log(p.l + ':' + p.name);
        });
    };

    /**
     * This method will check to see if a give object is an array or not.<br/>
     * We first try to see if we have the Array.isArray and if not we will add polyfill to support it.<br/>
     *
     * @param obj - The data we want to check if its Array or not
     *
     * @method isArray
     */
    this.isArray = Array.isArray || function (obj) {
        return Object.prototype.toString.call(obj) === '[object Array]'
    };

    /**
     * Check to see if given object is valid JSON.<br/>
     * TODO: Make this more efficient. !!!!!
     *
     * @method isJson
     *
     * @param data - The data we want to check if its a valid JSON or not
     * @return {Boolean}
     */
    this.isJSON = function (data) {

        // Try to convert the string to JSON
        switch (typeof data) {
            case 'string':
                try {
                    JSON.parse(data);
                } catch (e) {
                    return false;
                }
                return true;
            // no need for break here.
            case 'object':
                try {
                    JSON.parse(JSON.stringify(data));
                } catch (e) {
                    return false;
                }
                return true;
                break;
        }
    };

}.apply(jStore.utils, [jStore, jStore.utils]);