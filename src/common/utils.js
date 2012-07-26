jStore.utils = jStore.utils || {};

!function (ns, utils) {

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

    //shorthand for object.hasOwnProperty
    function has(obj, item) {
        return Object.prototype.hasOwnProperty.call(obj, item);
    }

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

}.apply(jStore.utils, [jStore, jStore.utils]);
