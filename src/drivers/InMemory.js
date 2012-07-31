var jStore = jStore || {};

!function (ns) {

    var logger = ns.Logger.getLogger("InMemory", ns.Logger.logLevels.ERROR);

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

            for (key in this._storage) {
                if (this._storage.hasOwnProperty(key)) {
                    callback(null, key.substr(this.prefixLen), this._storage[key]);
                }
            }
        },

        exists:function (key, callback) {
            logger.log('exist');
            callback(null, !!this._storage[this.prefix + key]);
            return this;
        },

        get:function (keyOrArray, callback) {
            logger.log('get');
            var $this = this, values = {};

            // check to see if the first argument is String or array
            if (Array.isArray(keyOrArray)) {
                keyOrArray.forEach(function (element) {
                    values[element.substr($this.prefixLen)] = $this._storage[element];
                });
                callback(null, values);
            } else {
                // return the required value
                callback(null, keyOrArray.substr($this.prefixLen), $this._storage[keyOrArray])
            }
            return this;
        },

        getAll:function (callback) {
            logger.log('getAll');
            // We need to remove the prefix from all the keys before returning them
            var $this = this,
                items = {};

            Object.keys($this._storage).forEach(function (key) {
                items[key.substr($this.prefixLen)] = $this._storage[key];
            });

            callback(null, items);
            return this;
        },

        getKeys:function (callback) {
            logger.log('getKeys');
            // We need to remove the prefix from all the keys before returning them
            var $this = this,
                items = [];

            Object.keys($this._storage).forEach(function (key) {
                items.push(key.substr($this.prefixLen));
            });

            callback(null, items);
            return this;
        },

        remove:function (keyOrArray, callback) {
            var $this = this;

            // check to see if teh first argument is String or array
            if (Array.isArray(keyOrArray)) {
                keyOrArray.forEach(function (element) {
                    delete $this._storage[$this.prefix + element];
                });
            } else {
                // return the required value
                delete $this._storage[$this.prefix + keyOrArray];
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
                logger.log('set String: ', $this.prefix + keyOrMap, '=' + value);
                this._storage[$this.prefix + keyOrMap] = value;
            } else {
                // Handle Array
                logger.log('set Array : ', keyOrMap);
                Object.keys(keyOrMap).forEach(function (element) {
                    $this._storage[$this.prefix + element] = keyOrMap[element];
                });
            }
        },

        test:function () {
            return true;
        }

    });

}.apply(jStore, [jStore]);
