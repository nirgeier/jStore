var jStore = jStore || {};

!function (ns, utils) {
    /**
     * @module Driver
     * @class Driver
     */

    var Driver;

    /**
     * This is the skeleton DriverManager class.<br/>
     * The class will be used as teh base class for all the drivers implementation.<br/>
     * Here we define the API for the drivers<br/>
     * 
     * List of the required methods: <br/>
     * <b>clear each exists get getAll getKeys init remove set test</b>
     *
     * @class Driver
     *
     * @ uses Events
     * @ uses Options
     * @ uses Bind
     * @constructor
     */
    ns.Driver = Driver = function (options) {
        utils.Events.call(this);
        utils.Options.call(this);
        utils.Bind.call(this);

        this.setOptions(options);
    };

    Driver.prototype = {
        constructor:Driver
    };

    // ---- API Method documentation

    /**
     * The driver name.
     *
     * @property name
     * @type {String}
     */

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

    /**
     * Check to see if the given key already exist in the Storage
     * <pre><code>
     *   exists(String key, function callback(Error|null, String key, String value) - fetch single/multiple record
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
     *   get(String|Array, function callback(Error|null, String key, String value)  - fetch single/multiple record
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
     *   getAll(function callback(Error|null, JSON records))
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
     *   getKeys(function callback(Error|null, Array keys))
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
     * This method will be init the DriverManager.
     *
     * Any initialization code should be place here
     *
     * @method init
     */

    /**
     * Remove items from the storage
     *
     * <pre><code>
     *   remove(String|Array, function(Error/null)) - remove the given key(s) from the storage
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
     *     set(String key, String value, Function callback) - Simple key value pairs
     *     set(JSON   pairs, Function callback)             - Collection of keys and values
     *     set(Array  pairs, Function callback)             - Array of key value pairs
     *     
     *     callback -> function(Error|null, arguments), 
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

    ns.Driver = Driver;

}.apply(jStore, [jStore, jStore.utils]);
