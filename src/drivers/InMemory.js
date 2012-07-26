var jStore = jStore || {};

!function (ns, utils) {

    var logger = ns.Logger.getLogger("InMemory", ns.Logger.logLevels.DEBUG);

    /**
     * This class is the implementation of InMemory storage.<br/>
     * The InMemory storage store all the data as Object (JSON) as key:value.<br/>
     * <br/>
     *
     * TODO: Right now we have unknown memory limitation<br/>
     *
     * @constructor
     * @class InMemory
     * @extends Driver
     **/
    jStore.Driver.register('InMemory', {

        /**
         * The InMemory storage use Object (JSON) to store all the data.<br/>
         *
         * @property _storage
         * @type {Object}
         * @private
         */
        _storage:{},

        name:'InMemory',

        clear:function (callback) {
            logger.log('clear');
            this._storage = {};
            if (callback) {
                callback(null);
            }
            return this;
        },

        each:function (callback) {
            logger.log('each');
            var key;

            // Verify that the callback is function
            if (typeof  callback !== 'function') {
                this.fireEvent('Error', 'Missing required callback function.');
                return this;
            }

            for (key in this._storage) {
                callback(null, key, this._storage[key]);
            }
        },

        exists:function (key, callback) {
            logger.log('exist');
            callback(null, !!this._storage[key]);
            return this;
        },

        get:function (keyOrArray, callback) {
            logger.log('get');
            var $this = this, values = {};

            // check to see if the first argument is String or array
            if (Array.isArray(keyOrArray)) {
                keyOrArray.forEach(function (element) {
                    values[element] = $this._storage[element];
                });
                callback(null, values);
            } else {
                // return the required value
                callback(null, keyOrArray, $this._storage[keyOrArray])
            }
            return this;
        },

        getAll:function (callback) {
            logger.log('getAll');
            callback(null, this._storage);
            return this;
        },

        getKeys:function (callback) {
            logger.log('getKeys');
            callback(null, Object.keys(this._storage));
            return this;
        },

        init:function () {

        },

        remove:function (keyOrArray, callback) {
            var $this = this;

            // check to see if teh first argument is String or array
            if (Array.isArray(keyOrArray)) {
                keyOrArray.forEach(function (element) {
                    delete $this._storage[element];
                });
            } else {
                // return the required value
                delete $this._storage[keyOrArray];
            }

            if (callback) {
                callback();
            }
            return this;
        },

        set:function (keyOrMap, value) {

            var $this = this;

            // Check for set(String,String)
            if (value) {
                logger.log('set String: ', keyOrMap, '=' + value);
                this._storage[keyOrMap] = value;
            } else {
                // Handle Array
                logger.log('set Array : ', keyOrMap);
                Object.keys(keyOrMap).forEach(function (element) {
                    $this._storage[element] = keyOrMap[element];
                });
            }
        },

        test:function () {
            return true;
        }

    });

}.apply(jStore, [jStore, jStore.utils]);