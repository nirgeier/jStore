describe("DomStorage", function () {
    var prefix = "Chegg_dom_",
        driver_const = jStore.drivers['DomStorage'],
        driver;

    beforeEach(function () {

        driver_const.stores = {};

        tests.getDriver = function () {
            driver = new jStore.drivers['DomStorage']({table_name:"dom", db_name:'Chegg'});
            return driver;
        };

        tests.getValue = function (key, cb) {
            cb && cb(JSON.parse(localStorage.getItem(prefix + key)));
        };

        tests.setValues = function (values, cb) {
            var key;
            for (key in values) {
                localStorage.setItem(prefix + key, JSON.stringify(values[key]));
                driver.store[key] = values[key];
            }

            cb && cb();
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

    it("Should have a non driver (no prefix) localStorage item", function () {

        tests.getDriver();
        tests.done = 0;

        localStorage.clear();
        localStorage.setItem('test', 'test');

        driver.set({'test':'test'}, null, function () {
            ++tests.done;
        });

        driver.clear(function () {
            ++tests.done;
        });

        expect(localStorage['test']).toEqual('test', "there should be a localStorage['test'] item");
        localStorage.clear();

        waitsFor(function () {
            return tests.done == 2;
        }, "DomStroage should not clear non prefixed entries", 1000);

    });

    it("Should test that the driver reads the existing localStorage items", function () {

        // Prepare the test records
        localStorage.setItem(prefix + 'test', 'test');
        tests.done = 0;

        tests.getDriver();

        driver.exists('test', function (err, exists) {
            ++tests.done;
        });

        localStorage.clear();

        waitsFor(function () {
            return tests.done == 1;
        }, "DomStroage should not clear non prefixed entries", 1000);

    });

    tests.runTests();
})
;
