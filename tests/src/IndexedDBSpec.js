describe("IndexedDB", function () {
    var
        db_name = 'Chegg',
        table_name = "test",
        prefix = db_name + '_' + table_name + '_',
        driver_const = jStore.drivers['IndexedDB'],
        driver;

    beforeEach(function () {

        driver_const.stores = {};

        tests.getDriver = function () {
            driver = new jStore.drivers['IndexedDB']({
                table_name:"test",
                db_name:'Chegg'
            });
            return driver;
        };

        tests.getValue = function (key, cb) {
            var req,
                trans = driver.db.transaction([table_name], "readonly"),
                store = trans.objectStore(table_name);

            req = store.get(key);
            req.onsuccess = function (e) {
                cb && cb(null, e.target.result[key]);
            };
            req.onerror = function (e) {
                cb && cb(e);
            };

        };

        tests.setValues = function (values, cb) {
            var data, req, trans, store, key;
            trans = driver.db.transaction([this.table_name], "readwrite");
            store = trans.objectStore(this.table_name);

            try {

                // Check to see if we have single record or an array
                if (Array.isArray(values)) {
                    data = values;
                } else {
                    data = {};
                    data[keyOrMap] = value;
                }

                // Add all records to the DB
                for (key in data) {
                    // Set the record Id
                    req = store.put({ 'key':key, 'value':JSON.stringify(data[key])});
                }

                cb && cb(null);
            } catch (e) {
                this.fireEvent('Error', {'error':e});
                cb && cb(e);
            }
        };

        tests.exists = function (keys, cb) {
            var i, key;

            for (i = 0; key = keys[i]; i++) {
                if (!!localStorage.getItem(prefix + key)) return cb(true);
            }

            cb && cb(false);
        };

        tests.clear = function (cb) {
            var i, keys = Object.keys(localStorage);

            for (i = 0; i < keys.length; i++) {
                keys[i].indexOf(prefix) > -1 && localStorage.removeItem(keys[i]);
            }
            cb && cb();
        }

        tests.clear();

    });
    tests.runTests();
});

