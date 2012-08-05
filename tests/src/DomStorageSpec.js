describe("DomStorage", function(){
    var prefix = "Chegg_test_",
        driver_const = jStore.drivers['DomStorage'],
        driver;

    beforeEach(function(){
        localStorage.clear();

        driver_const.stores = {};

        tests.getDriver = function(){
            driver = new jStore.drivers['DomStorage']({table_name:"test", db_name: 'Chegg'});
            return driver;
        };

        tests.getValue = function(key, cb){
            cb(JSON.parse(localStorage.getItem(prefix+key)));
        };

        tests.setValues = function(values, cb){
            var key, value;
            for (key in values){
                value = JSON.stringify(values[key]);
                localStorage.setItem(prefix+key, value);
                driver.store[key] = value;
            }

            cb();
        };

        tests.exists = function(keys, cb){
            var i,key;

            for (i=0; key = keys[i]; i++){
                if (!!localStorage.getItem(prefix + key)) return cb(true);
            }

            cb(false);
        };
    });

    tests.runTests();
});
