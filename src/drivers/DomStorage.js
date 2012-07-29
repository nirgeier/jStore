var jStore = jStore || {};

!function (ns) {

    var logger = ns.Logger.getLogger("DomStorage", ns.Logger.logLevels.ERROR);

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
    jStore.Driver.register('DomStorage', {

        name:'DomStorage',

        clear:function (callback) {
            logger.log('clear');
            localStorage.clear();
            if (callback) {
                callback(null);
            }
            return this;
        },

        each:function (callback) {
            logger.log('each');
            var keys, $this = this;

            // Verify that the callback is function
            if (typeof callback !== 'function') {
                this.fireEvent('Error', 'Missing required callback function.');
                return this;
            }

            // Extract all the keys from the local storage
            keys = Object.keys(localStorage);

            keys.forEach(function (key) {
                callback(null, key.substr($this.prefixLen), JSON.parse(localStorage.getItem(key)));
            });

            return this;
        },

        exists:function (key, callback) {
            logger.log('exists');
            callback(null, !!localStorage[this.prefix + key]);
            return this;
        },

        get:function (keyOrArray, callback) {
            logger.log('get');
            var $this = this, values = {};

            // check to see if the first argument is String or array
            if (Array.isArray(keyOrArray)) {
                keyOrArray.forEach(function (element) {
                    values[element] = JSON.parse(localStorage.getItem($this.prefix + element));
                });
                callback(null, values);
            } else {
                // return the required value
                callback(null, keyOrArray, JSON.parse(localStorage.getItem($this.prefix + keyOrArray)));
            }
            return this;
        },

        getAll:function (callback) {
            logger.log('getAll');
            // We need to remove the prefix from all the keys before returning them
            var $this = this,
                items = {};

            Object.keys(localStorage).forEach(function (key) {
                items[key.substr($this.prefixLen)] = JSON.parse(localStorage.getItem(key));
            });

            callback(null, items);
            return this;
        },

        getKeys:function (callback) {
            logger.log('getKeys');
            // We need to remove the prefix from all the keys before returning them
            var $this = this,
                items = [];

            Object.keys(localStorage).forEach(function (key) {
                items.push(key.substr($this.prefixLen));
            });

            callback(null, items);
            return this;
        },

        init:function () {

        },

        remove:function (keyOrArray, callback) {
            var $this = this;

            // check to see if teh first argument is String or array
            if (Array.isArray(keyOrArray)) {
                keyOrArray.forEach(function (element) {
                    localStorage.removeItem($this.prefix + element);
                });
            } else {
                // return the required value
                localStorage.removeItem($this.prefix + keyOrArray);
            }

            if (callback) {
                callback();
            }
            return this;
        },

        // 
        // TODO: handle object store, right now we only handle strings
        //
        set:function (keyOrMap, value) {
            var $this = this;

            try {
                // Check for set(String,String)
                if (value) {
                    logger.log('set String: ', $this.prefix + keyOrMap, '=' + value);
                    localStorage.setItem($this.prefix + keyOrMap, JSON.stringify(value));
                } else {
                    // Handle Array
                    logger.log('set Array : ', keyOrMap);
                    Object.keys(keyOrMap).forEach(function (element) {
                        localStorage.setItem($this.prefix + element, JSON.stringify(keyOrMap[element]));
                    });
                }
            } catch (e) {
                // could fail if localStorage is disabled for the site, 
                // or if the quota has been exceeded
                // the exception is expected to be 'QuotaExceededError'
                Events.fireEvent('Error', {'error':e});
            }
        },

        test:function () {
            return !!localStorage && function () {
                // in mobile safari if safe browsing is enabled, window.storage
                // is defined but setItem calls throw exceptions.
                var success = true;
                var value = Math.random();
                try {
                    localStorage.setItem(value, value);
                } catch (e) {
                    success = false;
                }
                localStorage.removeItem(value);
                return success;
            }()
        }

    });

}.apply(jStore, [jStore]);
