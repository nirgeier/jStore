var jStore = jStore || {};

!function (ns, utils) {
    /**
     * @module Driver
     */

    var logger = ns.Logger.getLogger("Driver", ns.Logger.logLevels.ERROR);

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
     *                  required param is table_name, all other options are optional.
     * <pre><code>
     *   {
     *     table_name : The table name/prefix to use
     *   }
     *
     */
    function Driver(options) {
        Events.call(this);
        utils.Options.call(this);
        utils.Bind.call(this);
        this.setOptions(options);
    }

    Driver.prototype = {
        constructor:Driver,

        /**
         * contains a list of default options for the driver
         * @property defaultOptions
         * @type {objecy}
         * @protected
         */

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
         *
         * @return {array} an array of key names
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
        init:function (options) {
        },

        /**
         * Remove items from the storage
         *
         * @example
         * <pre><code>
         *   remove(String|Array [, function(Error|null)]) - remove the given key(s) from the storage
         *     </code>
         * </pre>
         *
         * @async
         * @chainable
         *
         * @method remove
         * @param {String|Array} key/keys - The key(s) of the item we want to remove
         * @param {function} [callback]
         */
        remove:function (keyOrArray, callback) {
            return this;
        },

        /**
         * Add a new item(s) to the storage.
         * If the key is already in the store it will be updated.
         *
         * @async
         * @chainable
         *
         * @method set
         * @param {String|Object} key      if string, will be used as a key name. If object, will be used
         *                                 as a key=>value map
         * @param {String} [optional]      [value]  key value
         * @param {function}      [callback] will be called when action is done
         */
        set:function (keyOrMap, value, cb) {
            return this;
        },

        /**
         * returns the number of items in the store
         *
         * @async
         * @chainable
         *
         * @method getLength
         *
         * @param {function} callback
         *
         * @return {number}
         */
        getLength:function (cb) {
            return -1;
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

    Driver.defaultOptions = {
        table_name:'',
        db_name:'',
        db_size:'',
        table_name:'',
        fields:[]
    };

    ns.Driver = Driver;
}.apply(jStore, [jStore, jStore.utils]);
