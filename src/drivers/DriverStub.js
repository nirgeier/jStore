/**
 * This class is the API for the framework drivers.<br/>
 * Each Driver must implement all the public methods of this class.
 *
 * @class DriverStub
 **/

var DriverStub = {

    /**
     * The driver name.
     *
     * @property name
     * @type {String}
     * @default 'DriverStub'
     */
    name:'DriverStub',

    /**
     * Delete all the records from the storage
     *
     * @method clear
     * @param {Function} [callback] - A callback function that will be invoked after the clear.
     */
    clear:function (cb) {
        console.warn('clear method is not implemented');
    },

    /**
     * Run the callback method on all the storage items.<br/>
     *
     * <pre><code>
     *   each(function callback(String key, String value)
     *     </code>
     * </pre>

     * @method each
     * @param {Function} callback - A callback function that will handle the results.<br/>
     *                              The callback parameters are (key, value)
     */
    each:function () {
        console.warn('each method is not implemented');
    },

    /**
     * Check to see if the given key already exist in the Storage
     *
     * @method exist
     * @param {String} key - The key of the item we want to check if exits
     * @return {Boolean} exists - true/false if the key exists or not
     */
    exist:function () {
        console.warn('exist method is not implemented');
    },

    /**
     * Retrieve item or items from the storage.<br/>
     *
     * <pre><code>
     *   get(String key, function callback(String key, String value)  - fetch single record
     *   get(Array keys, function callback(String key, Array values)  - fetch several records
     *     </code>
     * </pre>

     * @method get
     * @param {String} [key] - The key of the item we want to retrieve
     * <br/>
     * @param {Array}   [keys]   - Array with the keys that we want to fetch
     * <br/>
     * @param {Function} callback - A callback function that will handle the results.<br/>
     *                              The callback parameters are (String, String|Array) based upon the arguments passed to the function
     */
    get:function () {
        console.warn('set method is not implemented');
    },

    /**
     * get all the storage items.<br/>
     *
     * <pre><code>
     *   each(function callback(JSON records))
     *     </code>
     * </pre>

     * @method getAll
     * @param {Function} callback - A callback function for processing the records
     */
    getAll:function () {
        console.warn('getAll method is not implemented');
    },

    /**
     * get all the storage keys.<br/>
     *
     * <pre><code>
     *   each(function callback(Array keys))
     *     </code>
     * </pre>

     * @method getKeys
     * @param {Function} callback - A callback function for processing the keys<br/>
     */
    getKeys:function () {
        console.warn('getKeys method is not implemented');
    },

    /**
     * Remove items from the storage
     *
     * <pre><code>
     *   remove(String key)  - remove single record
     *   remove(Array keys)  - remove all the records with the given ids
     *     </code>
     * </pre>

     * @method remove
     * @param {String} [key] - The key of the item we want to remove
     * <br/>
     * @param {Array}   [keys]   - Array with the keys that we want to remove
     */
    remove:function () {
        console.warn('set method is not implemented');
    },

    /**
     * Add a new item(s) to the storage.<br/>
     * If the key is already in the store it will be updated.<br/>
     * The method accept <b>any</b> of the following:
     * <pre><code>
     *     set(String key, String value) - Simple key value pairs
     *     set(JSON   pairs)             - Collection of keys and values
     *     set(Array  pairs)             - Array of key value pairs
     *     </code>
     * </pre>
     *
     * @method set
     * @param {String,String} [key,value] - Simple key & value pair
     * <br/>
     * @param {JSON}   [obj]   - JSON containing set of key values pairs
     * <br/>
     * @param {Array}  [array] - Array of keys and values
     *
     */
    set:function () {
        console.warn('get method is not implemented');
    }

};
