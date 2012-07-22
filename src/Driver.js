!function (ns, utils) {
    /**
     * @module Driver
     */

    var Driver,
        apiMethods = "clear, each, exists, get, getAll, getKeys, init, remove, set".split(' ');

    /**
     * This is the stub methods for the driver.
     * The method return this so it can be chainable later if needed.
     *
     * @chainable
     * 
     * @return {this}
     */
    function stubMethod() {
        return this;
    }

    /**
     * This is the skeleton Driver class.<br/>
     * The class will be used as teh base class for all the drivers implementation.<br/>
     * Here we define the API for the drivers<br/>
     *
     * @class Driver
     *
     * @ uses Events
     * @ uses Options
     * @ uses Bind
     * @constructor
     */
    function Driver(options) {
        utils.Events.call(this);
        utils.Options.call(this);
        utils.Bind.call(this);

        this.setOptions(options);
    }

    Driver.prototype = {
        constructor:Driver,

        /**
         * The driver name.
         *
         * @property name
         * @type {String}
         * @default 'Driver'
         */
        name:'Driver',

        /**
         * This method will check to see if driver is available for the current browser.
         *
         * @method valid
         * @return boolean
         */
        valid:function () {
            return false;
        }

    };

    /**
     * Add all the api methods to the driver class.
     * Those methods should be implemented in each driver
     */
    apiMethods.forEach(function (method, index, array) {
        Driver.prototype[method] = stubMethod;
    });


    /**
     * List of available drivers.
     *
     * @property drivers
     * @static
     * @type {Array}
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

        if (!params.test || typeof params.test != 'function') {
            throw "Driver must always have a test method";
        }

        d = utils.inherit(driver, Driver, params);
        d.test = params.test;
        d.name = name;

        Driver.drivers.push(d);

        return d;
    };

    /**
     * chooses which driver to use and creates it
     * @method choose
     * @static
     *
     * @param {object} options options to pass to the driver's constructor
     *
     * @return {Driver} the chosen driver
     */
    Driver.choose = function (opts) {
        var i, driver;

        if (Driver.chosen) {
            return new Driver.chosen(opts);
        }

        for (i = 0; driver = Driver.drivers[i]; i++) {
            if (driver.test()) {
                Driver.chosen = driver;
                return new driver(opts);
            }
        }
    }

    // ---- API Method documentation

    /**
     * Delete all the records from the storage
     *
     * @async
     * @chainable
     *
     * @method clear
     * @param {function} [callback] - A callback function that will be invoked after the clear.
     */

    /**
     * Run the callback method on all the storage items.
     *
     * <pre><code>
     *   each(function callback(String key, String value)
     *
     * </code>
     * </pre>
     *
     * @async
     * @chainable
     *
     * @method each
     * @param {function} callback - A callback function that will handle the results.
     *                              The callback parameters are (key, value)
     */

    /**
     * Check to see if the given key already exist in the Storage
     * <pre><code>
     *   exists(String key, function callback(String key, String value) - fetch single/multiple record
     *
     * </code>
     * </pre>
     *
     * @async
     * @chainable
     *
     * @method exist
     * @param {String} key - The key of the item we want to check if exits
     * @param {function} callback - A callback function that will handle the results.
     *                              The callback parameters are (key, value)
     *
     * @return {Boolean} exists - true/false if the key exists or not
     */

    /**
     * Retrieve item or items from the storage.
     *
     * <pre><code>
     *   get(String|Array, function callback(String key, String value)  - fetch single/multiple record
     *
     * </code>
     * </pre>
     *
     * @async
     * @chainable
     *
     * @method get
     * @param {String} [key] - The key of the item we want to retrieve
     *
     * @param {Array}   [keys]   - Array with the keys that we want to fetch
     *
     * @param {Function} callback - A callback function that will handle the results.
     *                              The callback parameters are (String, String|Array) based upon the arguments passed to the function
     *
     * @return {String|object} if was asked for a collection of values, return a map, otherwise return a string
     *
     */

    /**
     * get all the storage items.
     *
     * <pre><code>
     *   getAll(function callback(JSON records))
     *
     *     </code>
     * </pre>
     *
     * @async
     * @chainable
     *
     * @method getAll
     * @param {Function} callback - A callback function for processing the records
     * @return {object} key=>value map
     */

    /**
     * get all the storage keys.
     *
     * <pre><code>
     *   getKeys(function callback(Array keys))
     *
     *     </code>
     * </pre>
     *
     * @async
     * @chainable
     *
     * @method getKeys
     * @param {Function} callback - A callback function for processing the keys
     */

    /**
     * This method will be init the Driver.
     * Any initialization code should be place here
     *
     * @method init
     */

    /**
     * Remove items from the storage
     *
     * <pre><code>
     *   remove(String|Array) - remove the given key(s) from teh storage
     *
     *     </code>
     * </pre>
     *
     * @async
     * @chainable
     *
     * @method remove
     * @param {String|Array} [key/keys] - The key(s) of the item we want to remove
     */

    /**
     * Add a new item(s) to the storage.
     * If the key is already in the store it will be updated.
     * The method accept <b>any</b> of the following:
     *
     * <pre><code>
     *     set(String key, String value) - Simple key value pairs
     *     set(JSON   pairs)             - Collection of keys and values
     *     set(Array  pairs)             - Array of key value pairs
     *
     *     </code>
     * </pre>
     *
     * @async
     * @chainable
     *
     * @method set
     * @param {String,String} [key,value] - Simple key & value pair
     *
     * @param {JSON}   [obj]   - JSON containing set of key values pairs
     *
     * @param {Array}  [Array] - Array of keys and values
     *
     */

}.apply(jStorage, [jStorage, utils]);

