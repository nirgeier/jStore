!function (ns, utils) {
    /**
     * @module utils.Mixins
     */

    /**
     * @class utils.Events
     * @extends Events
     */
    this.Events = Events;

    /**
     * generates a bound function collection, using an object's bind array propery
     * @class utils.Bind
     * @constructor
     */
    this.Bind = function () {
        var i, fn;

        /**
         * holds the generated bound function collection
         * @property bound
         * @protected
         * @type object
         */
        this.bound = {};

        if (!this.bind) return;

        for (i = 0; fn = this.bind[i]; i++) {
            if (this[fn]) this.bound[fn] = utils.bind(this[fn], this);
        }
    };

    /**
     *  A simple mixin for managing an options argument. Mixin uses the defaultOptions property to identify default options.
     *  Mixin also automatically identify on* properties as events and assigns them
     *
     *  @class utils.Options
     *  @constructor
     *
     */
    this.Options = function Options() {
        var key;
        this.options = {};

        for (key in this.defaultOptions) if (this.defaultOptions.hasOwnProperty(key)) {
            this.options[key] = this.defaultOptions[key];
        }

        /**
         * @method setOptions
         * @param {object} options
         * @chainable
         */
        this.setOptions = function (options) {
            var key;
            if (typeof options !== 'object' || options === null) return;
            for (key in options) if (options.hasOwnProperty(key)) {
                if (key in this.options) this.options[key] = options[key];
                if (/^on[A-Z][a-zA-Z]+/.test(key) && this.addEvent && typeof options[key] == 'function') this.addEvent(utils.Events.removeOn(key), options[key]);
            }

            return this;
        };

        /**
         * this property will be used to identify default options
         * @property defaultOptions
         * @protected
         */
    };
    /**
     * this method acts like merge, only that it only merges properties of the original object
     *
     * _Creates a new object rather than actually merge_
     *
     * @method setOptions
     * @static
     * @param {Object} defaults a map of default properties
     * @param {Object} options a map of values to merge
     *
     * @return {Object} new merged object
     */
    this.Options.setOptions = function (defaults, options) {
        var opts = {}, key;

        for (key in defaults) if (options[key]) {
            opts[key] = options[key];
        } else {
            opts[key] = defaults[key];
        }

        return opts;
    };

    /**
     * KeyNav mixin used to allow user navigating (class toggle) between list children.
     *
     * @class utils.KeyNav
     * @constructor
     * @param element the element to add key navigation to
     *
     */

    /**
     * add this property to your object before applying the mixin to pass it as options.
     *
     * Possible options are:
     *
     * * `className` : custom class name to mark selected element
     * * `onSelect`  : a callback to call when an element is selected
     * * `event_type` (default is keydown)
     * * `use_capture` (default is false)
     *
     * @property keyNavOptions
     * @type object
     */
    this.KeyNav = function (element) {
        //set default className if not provided
        var opt,
            options = {
                target:element,
                class_name:'selected',
                event_type:'keydown',
                use_capture:false
            };

        //override default options
        if (this.keyNavOptions) {
            for (opt in this.keyNavOptions) {
                options[opt] = this.keyNavOptions[opt];
            }
        }

        function eventHandler(e) {
            var current,
                closeSibling,
                defaultChild,
                keysList = [
                    ns.settings.keyCodes.UP,
                    ns.settings.keyCodes.DOWN
                ];

            if (keysList.indexOf(e.keyCode) === -1
                || element.childNodes.length === 0
                || options.prevent && options.prevent(e) === true) {
                return;
            }

            e.stopPropagation();

            if (e.keyCode === ns.settings.keyCodes.DOWN) {
                closeSibling = 'nextSibling';
                defaultChild = 'firstChild';
            } else if (e.keyCode === ns.settings.keyCodes.UP) {
                closeSibling = 'previousSibling';
                defaultChild = 'lastChild';
            }

            current = utils.query('.' + options.class_name, element)[0];

            if (!current) {
                if (element.firstChild) {
                    current = element[defaultChild];
                    utils.addClass(current, options.class_name);
                }
            } else if (current[closeSibling]) {
                utils.removeClass(current, options.class_name);
                current = current[closeSibling];
                utils.addClass(current, options.class_name);
            } else {
                utils.removeClass(current, options.class_name);
                current = element[defaultChild];
                utils.addClass(current, options.class_name);
            }

            if (options.onSelect) {
                options.onSelect(current);
            }

        }

        options.target.addEventListener(options.event_type, eventHandler, options.use_capture);

        this.addEvent('destroy', function () {
            options.target.removeEventListener(options.event_type, eventHandler, options.use_capture);
        });
    };

    /**
     * This mixin provides a utility function for easy event delegation handling
     * @class utils.Delegate
     * @constructor
     * @param {Element} el target element for all delegations
     *
     * @example
     *      utils.Delegate.call(this,this.element)
     */
    this.Delegate = function (el) {
        var capture = {blur:true, focus:true};

        function delegate(ev_type, map, e) {
            var el = e.target,
                selector;

            for (selector in map) {
                if (utils.matchesSelector(el, selector) && map[selector](e) === false) {
                    break;
                }
            }
        }

        /**
         * a reference for delegated element
         * @property $delegated_element
         * @type {Element}
         * @private
         */
        this.$delegated_element = el;
        /**
         * a holder for selector maps
         * @property $delegated_maps
         * @type {Object}
         * @private
         */
        this.$delegated_maps = {};

        /**
         * delegates a map of selectors to a specific event
         * @method delegateEvent
         * @param {string} type
         * @param {Object} a selector => function map.
         *
         * @example
         *      this.delegateEvent('iclick',{
         *          '.note.editable' : this.bound.editNote
         *          '.handle.close'  : this.bound.close
         *      });
         *
         * @chainable
         */
        this.delegateEvent = function (type, map) {
            this.$delegated_maps[type] = map = utils.merge(this.$delegated_maps[type] || {}, map);
            this.$delegated_element.addEventListener(type, delegate.bind(this, type, map), !!capture[type]);

            return this;
        };

        this.addEvent('destroy', function () {
            var type;
            for (type in this.$delegated_maps) {
                this.$delegated_element.removeEventListener(type, delegate, !!capture[type]);
            }

            this.$delegated_maps = null;
            this.$delegated_element = null;
            this.delegateEvent = null;
        }.bind(this));
    };
}.apply(jStore.utils, [jStore, jStore.utils]);
