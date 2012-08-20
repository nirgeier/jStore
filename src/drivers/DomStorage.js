var jStore = jStore || {};

!function (ns, utils) {
    
    /**
     * @module Driver.DomStorage
     */

    var logger = ns.Logger.getLogger("DomStorage", ns.Logger.logLevels.ERROR),
        driver;

    /**
     * This driver is the implementation of DomStorage storage.<br/>
     * The DomStorage storage store all the data as Object (JSON) as key:value.<br/>
     * The driver also store all its key-value in local variable named store in order to improve performance.<br/>
     * The above store object contain the parsed data so it can be used as soon as we get the value and no prase
     * need to be done on the JSON data.
     *
     * TODO: Right now we have unknown memory limitation<br/>
     *
     * @constructor
     * @class DomStorage
     * @extends Driver
     **/
    driver = jStore.registerDriver('DomStorage', {

        name:'DomStorage',

        init:function () {
            var keys;

            // Set the prefix for this storage
            this.prefix = this.options.db_name + '_' + this.options.table_name + '_';

            localStorage.clear();
            this.store = {};
            driver.stores[this.prefix] = {}

            // Init the internal store object
            if (!driver.stores[this.prefix]) {
                driver.stores[this.prefix] = {};
            }

            this.store = driver.stores[this.prefix];

            // Load existing records from localStorage
            keys = Object.keys(localStorage);
            keys.forEach(function (key) {
                if (key.indexOf(this.prefix) !== -1) {
                    console.log(localStorage, localStorage[key]);
                    this.store[key.substr(this.prefix.length)] = JSON.parse(localStorage[key]);
                }
            }.bind(this));

            this.fireEvent('load:latched');
        },

        clear:function (callback) {
            logger.log('clear');

            var key;
            for (key in this.store) {
                localStorage.removeItem(this.prefix + key);
            }

            // Clear local storage
            this.store = driver.stores[this.options.table_name] = {};

            callback && callback(null);

            return this.$parent('clear', arguments);
        },

        each:function (callback) {
            logger.log('each');
            var keys;

            // Extract all the keys from the local storage
            keys = Object.keys(this.store);

            keys.forEach(function (key) {
                callback(null, key, this.store[key]);
            }.bind(this));

            return this.$parent('each', arguments);
        },

        exists:function (key, callback) {
            logger.log('exists');
            callback(null, !!this.store[key]);
            return this.$parent('exists', arguments);
        },

        get:function (key, callback) {
            logger.log('get');
            var values = {};

            // check to see if the first argument is String or array
            if (Array.isArray(key)) {
                key.forEach(function (element) {
                    values[element] = this.store[element];
                }.bind(this));
                callback(null, values);
            } else {
                // return the required value
                callback(null, this.store[key]);
            }
            return this.$parent('get', arguments);
        },

        getAll:function (callback) {
            logger.log('getAll');
            callback(null, this.store);
            return this.$parent('getAll', arguments);
        },

        getKeys:function (callback) {
            logger.log('getKeys');
            callback(null, Object.keys(this.store));

            return this.$parent('getKeys', arguments);
        },

        remove:function (key, callback) {
            var keys = utils.toArray(key);

            keys.forEach(function (element) {
                localStorage.removeItem(this.prefix + element);
                delete this.store[element];
            }.bind(this));

            callback && callback(null);

            return this.$parent('remove', arguments);
        },

        set:function (key, value, callback) {
            var map, keys = [], prop;

            if (typeof key == 'string' || typeof key == 'number') {
                map = {};
                map[key] = value;
            } else {
                map = key;
            }

            // Check to see if user has passed value or callback as second parameter
            if (typeof value === "function") {
                callback = value;
            }

            try {
                for (prop in map) {
                    logger.log('set String: ', this.prefix + prop, '=' + map[prop]);
                    localStorage.setItem(this.prefix + prop, JSON.stringify(map[prop]));
                    this.store[prop] = map[prop];
                    keys.push(prop);
                }

                callback && callback(null);
            } catch (e) {
                this.fireEvent('Error', {'error':e});

                this.remove(keys);

                callback && callback(e);
            }
            return this.$parent('set', arguments);
        },

        test:function () {
            return !!localStorage && function () {
                // in mobile safari if safe browsing is enabled, window.storage
                // is defined but setItem calls throw exceptions.
                var success = true,
                    value = Math.random();
                try {
                    localStorage.setItem(value, value);
                    localStorage.removeItem(value);
                } catch (e) {
                    success = false;
                }

                return success;
            }();
        },

        getLength:function (cb) {
            cb(null, Object.keys(this.store).length);

            return this.$parent('getLength', arguments);
        }
    });

    driver.stores = {};
}.apply(jStore, [jStore, jStore.utils]);
