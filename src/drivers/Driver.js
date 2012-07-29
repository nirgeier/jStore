var jStore = jStore || {};

!function (ns, utils) {
    /**
     * @module Driver
     * @class Driver
     */

    var Driver,
        logger = ns.Logger.getLogger("Driver", ns.Logger.logLevels.ERROR);

    /**
     * This is the skeleton Driver class.<br/>
     * The class will be used as teh base class for all the drivers implementation.<br/>
     * Here we define the API for the drivers<br/>
     *
     * @class Driver
     *
     * @ uses Events
     * @ uses utils.Options
     * @ uses utils.Bind
     * @constructor
     *
     * @param options - The options must contain the following parameters:
     * <pre><code>
     *   {
     *     prefix : The prefix for the give component
     *   }
     *
     */
    ns.Driver = Driver = function (options) {
        Events.call(this);
        utils.Options.call(this);
        utils.Bind.call(this);

        this.setOptions(options);
        this.prefix = options ? options.table_name || '' : '';
        this.prefixLen = this.prefix.length;
    };

    Driver.prototype = {
        constructor:Driver,

        /**
         * The driver name.
         *
         * @property name
         * @type {String}
         */
        name:'Driver',

        /**
         * The storage prefix to allow same keys from different components.<br/>
         */
        prefix:'',

        /**
         * Delete all the records from the storage
         *
         * <pre><code>
         *   clear(function callback(Error|null))
         *   </code>
         * </pre>
         *
         * @async
         * @chainable
         *
         * @method clear
         * @param {function} [callback] - A callback function that will be invoked after the clear.
         */
        clear:function (callback) {
            return this;
        },

        /**
         * Run the callback method on all the storage items.
         *
         * <pre><code>
         *   each(function callback(Error|null, String key, String value)
         *   </code>
         * </pre>
         *
         * @async
         * @chainable
         *
         * @method each
         * @param {function} callback - A callback function that will handle the results.
         *                              The callback parameters are (key, value)
         */
        each:function (callback) {
            return this;
        },

        /**
         * Check to see if the given key already exist in the Storage
         * <pre><code>
         *   exists(String key, function callback(Error|null, boolean)
         * </code>
         * </pre>
         *
         * @async
         * @chainable
         *
         * @method exists
         * @param {String} key - The key of the item we want to check if exits
         * @param {function} callback - A callback function that will handle the results.
         *                              The callback parameters are (key, value)
         *
         * @return {Boolean} exists - true/false if the key exists or not
         */
        exists:function (key, callback) {
            return false;
        },

        /**
         * Retrieve item or items from the storage.
         *
         * <pre><code>
         *   get(String|Array, function callback(Error|null, [String key, String value] | Object)  - fetch single/multiple record
         * </code>
         * </pre>
         *
         * @async
         * @chainable
         *
         * @method get
         * @param {String} [key] - The key of the item we want to retrieve
         * @param {Array}   [keys]   - Array with the keys that we want to fetch
         *
         * @param {function} callback - A callback function that will handle the results.
         *                              The callback parameters are (String, String|Array) based upon the arguments passed to the function
         *
         * @return {String|Object} if was asked for a collection of values, return a map, otherwise return a string
         *
         */
        get:function (keyOrArray, callback) {
            return this;
        },

        /**
         * get all items.
         *
         * <pre><code>
         *   getAll(function callback(Error|null, Object records))
         *     </code>
         * </pre>
         *
         * @async
         * @chainable
         *
         * @method getAll
         * @param {function} callback - A callback function for processing the records
         * @return {object} key=>value map
         */
        getAll:function (callback) {
            return this;
        },

        /**
         * get all keys.
         *
         * <pre><code>
         *   getKeys(function callback(Error|null, Array keys))
         *     </code>
         * </pre>
         *
         * @async
         * @chainable
         *
         * @method getKeys
         * @param {function} callback - A callback function for processing the keys
         */
        getKeys:function (callback) {
            return this;
        },

        /**
         * This method will be init the Driver.
         *
         * Any initialization code should be place here
         *
         * @method init
         */
        init:function () {
        },

        /**
         * Remove items from the storage
         *
         * <pre><code>
         *   remove(String|Array [, function(Error|null)]) - remove the given key(s) from the storage
         *     </code>
         * </pre>
         *
         * @async
         * @chainable
         *
         * @method remove
         * @param {String|Array} [key/keys] - The key(s) of the item we want to remove
         * @param {callback} [optional]
         */
        remove:function (keyOrArray, callback) {
            return this;
        },

        /**
         * Add a new item(s) to the storage.
         * If the key is already in the store it will be updated.
         * The method accept <b>any</b> of the following:
         *
         * <pre><code>
         *     set([String, String] |Map)
         *     </code>
         * </pre>
         *
         * @async
         * @chainable
         *
         * @method set
         * @param {[String, String] |Object) - Simple key & value pair or map of key values pairs
            *
         */
        set:function (keyOrMap, value) {
            return this;
        },

        /**
         * Test method to check if this driver is suitable for this browser/device
         *
         * <pre><code>
         *     test()
         *     </code>
         * </pre>
         *
         * @return boolean
         */
        test:function () {
            return false;
        }
    };

    /**
     * List of registered drivers
     *
     * @static
     * @property drivers
     *
     */
    Driver.drivers = [];

    /**
     * Registers a driver.<br/>
     * A driver must always have a <b>test</b> method<br/>
     *
     * @method register
     * @static
     *
     * @param {string} name
     * @param {object} props a list of methods and properties for the new driver
     *
     * @return {Driver} the new driver
     */
    Driver.register = function (name, params) {
        var d;

        function driver() {
            this.$construct(arguments);
            this.init && this.init(arguments);
        }

        if (!params.test || typeof params.test !== 'function') {
            throw "Driver must always have a test method";
        }

        d = utils.inherit(driver, Driver, params);
        d.test = params.test;
        d.name = name;

        // Add the drivers in the order we register them
        Driver.drivers.push(d);

        // Add reference to the driver by its name so we will have fast access to it 
        Driver.drivers[name] = d;
        return d;
    };

    /**
     * chooses which driver to use and creates it
     * @method choose
     * @static
     *
     * @param {object} options options to pass to the driver's constructor
     *
     * If we pass on a list of preferred drivers we test them in the given order
     * options:{
     *     drivers:[
     *      'InMemory',
     *      'DomStorage'
     *     ]
     * }
     *
     * @return {Driver} the chosen driver
     */
    Driver.choose = function (opts) {
        var i, driver, driverName;

        // First check if there is a preferred drivers list
        // TODO: optimize this if condition.
        if (opts && opts.drivers) {
            for (i = 0; driver = opts.drivers[i]; i++) {
                driverName = opts.drivers[i];
                if (Driver.drivers[driverName].test()) {
                    Driver.chosen = Driver.drivers[driverName];
                    return new Driver.chosen(opts);
                }
            }
        }

        if (Driver.chosen) {
            return new Driver.chosen(opts);
        }
        ;

        // We might loop once again on all the drivers if the previous if did not return driver
        // but since we will have few drivers its not worth to optimize the code for the loop.
        for (i = 0; driver = Driver.drivers[i]; i++) {
            if (driver.test()) {
                Driver.chosen = driver;
                return new driver(opts);
            }
        }
    };

}.apply(jStore, [jStore, jStore.utils]);
