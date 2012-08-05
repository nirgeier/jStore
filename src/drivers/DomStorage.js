var jStore = jStore || {};

!function (ns, utils) {
    /**
     * @module Driver.DomStorage
     */

    var logger = ns.Logger.getLogger("DomStorage", ns.Logger.logLevels.ERROR),
        driver;

    /**
     * This class is the implementation of InMemory storage.<br/>
     * The InMemory storage store all the data as Object (JSON) as key:value.<br/>
     * <br/>
     *
     * TODO: Right now we have unknown memory limitation<br/>
     *
     * @constructor
     * @class DomStorage
     * @extends Driver
     **/
    driver = jStore.registerDriver('DomStorage', {

        name:'DomStorage',

        init:function (options) {
            this.prefix = this.options.db_name + '_' + this.options.table_name + '_';
            this.prefix_len = this.prefix.length;

            if (driver.stores[this.options.table_name]){
                this.store = driver.stores[this.options.table_name];
            }else{
                this.store = driver.stores[this.options.table_name] = {};
            }

            this.fireEvent('load:latched');
        },

        clear:function (callback) {
            logger.log('clear');
            localStorage.clear();
            this.store = driver.stores[this.options.table_name] = {};

            if (callback) {
                callback(null);
            }

            return this.$parent('clear',arguments);
        },

        each:function (callback) {
            logger.log('each');
            var keys, $this = this;

            // Extract all the keys from the local storage
            keys = Object.keys(this.store);

            keys.forEach(function (key) {
                callback(key, JSON.parse(this.store[key]));
            }.bind(this));

            return this.$parent('each',arguments);
        },

        exists:function (key, callback) {
            logger.log('exists');
            callback(null, !!this.store[key]);
            return this.$parent('exists',arguments);
        },

        get:function (key, callback) {
            logger.log('get');
            var $this = this, values = {};

            // check to see if the first argument is String or array
            if (Array.isArray(key)) {
                key.forEach(function (element) {
                    values[element] = JSON.parse($this.store[element]);
                });
                callback(null, values);
            } else {
                // return the required value
                callback(null, JSON.parse(this.store[key]));
            }
            return this.$parent('get',arguments);
        },

        getAll:function (callback) {
            logger.log('getAll');
            // We need to remove the prefix from all the keys before returning them
            var $this = this,
                key,
                items = {};

            for (key in this.store){
                items[key] = JSON.parse(this.store[key]);    
            }

            callback(null, items);
            return this.$parent('getAll',arguments);
        },

        getKeys:function (callback) {
            logger.log('getKeys');
            // We need to remove the prefix from all the keys before returning them
            var $this = this,
                items = [];

            callback(null, Object.keys(this.store));

            return this.$parent('getKeys',arguments);
        },

        remove:function (key, callback) {
            var $this = this,
                keys = utils.toArray(key);

            keys.forEach(function (element) {
                localStorage.removeItem($this.prefix + element);
                delete $this.store[element];
            });

            if (callback) {
                callback(null);
            }
            return this.$parent('remove',arguments);
        },

        set:function (key, value, callback) {
            var $this = this,
                map, keys = [], prop;

            if (typeof key == 'string' || typeof key == 'number'){
                map = {};
                map[key] = value;
            }else{
                map = key;
            }

            try {
                for (prop in map){
                    logger.log('set String: ', $this.prefix + prop, '=' + value);

                    value = JSON.stringify(map[prop]);

                    localStorage.setItem(this.prefix+prop, value);
                    this.store[prop] = value;
                    keys.push(prop);
                }

                callback(null);
            } catch (e) {
                this.fireEvent('Error', {'error':e});

                this.remove(keys);

                callback(e);
            }
            return this.$parent('set',arguments);
        },

        test:function () {
            return !!localStorage && function () {
                // in mobile safari if safe browsing is enabled, window.storage
                // is defined but setItem calls throw exceptions.
                var success = true,
                    value = Math.random();
                try {
                    localStorage.setItem(value, value);
                } catch (e) {
                    success = false;
                }
                localStorage.removeItem(value);
                return success;
            }();
        },

        getLength : function(cb){
            cb(null,Object.keys(this.store).length);

            return this.$parent('getLength', arguments);
        }
    });

    driver.stores = {};
}.apply(jStore, [jStore, jStore.utils]);
