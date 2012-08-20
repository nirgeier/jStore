var jStore = jStore || {};

!function (ns, utils) {
    /**
     * This driver is the implementation of IndexedDB store mechanism,
     * Since we want the driver to support teh same API we will store the data in the IndexedDB in a way
     * that we will be able to swap drivers very easily.
     *
     * In order to do so we simply store the data in 2 fields:
     *  key
     *  value
     *
     * @module Driver.IndexedDB
     */

    var logger = ns.Logger.getLogger("IndexedDB", ns.Logger.logLevels.DEBUG),
        dbVersion = '1.0',
        driver;

    driver = jStore.registerDriver('IndexedDB', {

        // The reference to the database
        db:undefined,

        name:'IndexedDB',

        /**
         * Open the Database
         * @private
         */
        _openDB:function () {
            logger.log('_openDB');
            var db, req, store, i, field;

            try {

                db = indexedDB.open(this.db_name)
                // since the IndedDB is async we need to wait
                db.onsuccess = function (e) {

                    // We have succeed to open the DB - keep the reference
                    this.db = e.target.result;

                    // Check to see if this is the latest version
                    if (this.db.version == dbVersion) {
                        this.fireEvent('dbopen', {db:this.db});
                        return;
                    }

                    // Upgrade to the new version
                    req = this.db.setVersion(dbVersion);
                    req.onsuccess = function (e) {
                        // Create the table
                        store = this.db.createObjectStore(this.table_name, {'keyPath':'key'});
                        store.createIndex("key", "key", {unique:false});

                        this.fireEvent('dbopen', {db:this.db});
                    }.bind(this);
                }.bind(this);

                db.onerror = function (e) {
                    this.fireEvent('Error', {'error':e});
                }

            } catch (e) {
                this.fireEvent('Error', {'error':e});
            }
        },

        init:function () {
            logger.log('init');
            // Reference to the indexDB
            window.indexedDB = window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB;

            // This are Chrome prefix
            if ('webkitIndexedDB' in window) {
                window.IDBTransaction = window.webkitIDBTransaction;
                window.IDBKeyRange = window.webkitIDBKeyRange;
            }

            // Database properties
            this.db_name = this.options.db_name;
            this.db_size = this.options.db_size || 1024;
            this.table_name = this.options.table_name;
            this.prefix = this.db_name + '_' + this.table_name + '_';
            this.prefixLen = this.prefix.length;

            // The database fields
            this.fields = ["key", "value"];

            // Init the internal store object
            if (!driver.stores[this.options.table_name]) {
                driver.stores[this.options.table_name] = {};
            }

            this.store = driver.stores[this.options.table_name];

            this._openDB();
            this.addEvent('dbopen', function () {
                this.fireEvent('load:latched');
            }.bind(this));

            return this;
        },

        clear:function (callback) {
            logger.log('clear');
            callback && callback(null);

            return this.$parent('clear', arguments);
        },

        each:function (callback) {
            logger.log('each');

            /*
             keys.forEach(function (key, value) {
             callback(key, value);
             }.bind(this));
             */

            return this.$parent('each', arguments);
        },

        exists:function (key, callback) {
            logger.log('exists');

            // callback(null, exists);

            return this.$parent('exists', arguments);
        },

        get:function (keys, callback) {
            logger.log('get');
            var i, req, data, values = [],
                trans = this.db.transaction([this.table_name], "readonly"),
                store = trans.objectStore(this.table_name);

            // Check to see if we have single record or an array
            if (!Array.isArray(keys)) {
                data = [];
                data.push(keys);
            } else {
                data = keys;
            }

            // Add all records to the DB
            for (i = 0; i < data.length; i++) {

                req = store.get(data[i]);
                values[data[i]] = JSON.parse(req);

                req.onerror = function (e) {
                    callback && callback(e);
                };

                req.onsuccess = function () {
                    console.log(i === data.length - 1);
                    // Check to see that we have processed all the keys
                    i === data.length - 1 && callback && callback();
                };

            }

            return this.$parent('get', arguments);
        },

        getAll:function (callback) {
            logger.log('getAll');
            var cursor, keyRange, items = [],
                trans = this.db.transaction([this.table_name], "readonly"),
                store = trans.objectStore(this.table_name);


            // We select the range of data we want to make queries over 
            // In this case, we get everything. 
            // To see how you set ranges, see <a href="/en/IndexedDB/IDBKeyRange" title="en/IndexedDB/IDBKeyRange">IDBKeyRange</a>.
            keyRange = IDBKeyRange.lowerBound(0);

            // We open a cursor and attach events.
            cursor = store.openCursor(keyRange);

            cursor.onsuccess = function (e) {
                var result = e.target.result;
                if (!!result == false)
                    return;

                items.push(result.value);
                // The success event handler is fired once for each entry.
                // So call "continue" on your result object.
                // This lets you iterate across the data

                result.continue();
            };

            cursor.onerror = function (e) {
                callback && callback(e);
            };

            trans.oncomplete = function (evt) {
                callback && callback(null, items);
            };

            return this.$parent('getAll', arguments);
        },

        getKeys:function (callback) {
            logger.log('getKeys');

            // callback(null, keys);

            return this.$parent('getKeys', arguments);
        },

        remove:function (keys, callback) {

            var data, i, req,
                trans = this.db.transaction([this.table_name], "readwrite"),
                store = trans.objectStore(this.table_name)

            // Check to see if we have single record or an array
            if (!Array.isArray(keys)) {
                data = [];
                data.push(keys);
            } else {
                data = keys;
            }

            // Add all records to the DB
            for (i = 0; i < data.length; i++) {

                req = store.delete(data[i]);
                req.onsuccess = function () {
                    callback && callback();
                };
                req.onerror = function (e) {
                    callback && callback(e);
                };

            }

            return this.$parent('remove', arguments);
        },

        /**
         * The set function in indexedDb only receive JSON as its input.
         *
         * @param values
         * @param undefined
         * @param callback
         * @return {*}
         */
        set:function (keyOrMap, value, callback) {
            logger.log('set:');

            var data, req, trans, store, key;
            trans = this.db.transaction([this.table_name], "readwrite");
            store = trans.objectStore(this.table_name);

            if (typeof keyOrMap == 'string' || typeof keyOrMap == 'number') {
                data = {};
                data[keyOrMap] = value;
            } else {
                data = keyOrMap;
            }

            // Check to see if user has passed value or callback as second parameter
            if (typeof value === "function") {
                callback = value;
            }

            try {
                // Add all records to the DB
                for (key in data) {
                    // Set the record Id
                    req = store.put({ 'key':key, 'value':JSON.stringify(data[key])});
                }

                callback && callback(null);
            } catch (e) {
                this.fireEvent('Error', {'error':e});
                callback && callback(e);
            }

            return this.$parent('set', arguments);
        },

        test:function () {
            return window.indexedDB || window.webkitIndexedDB || window.mozIndexedDB;
        },

        getLength:function (cb) {
            // cb(null,length);

            return this.$parent('getLength', arguments);
        }
    });

    driver.stores = {};
}.apply(jStore, [jStore, jStore.utils]);
