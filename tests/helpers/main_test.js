var tests = tests || {};
tests.runTests = function runTests(){

        /*should return a driver*/
    var getDriver = function(){
            return new jStore.Driver();
        },

        /*
         * @param string key
         * @async
         * @return string value
         */
        getValue = function(key, cb){
            cb();
        },

        /*
         * @param object map key=>value map
         *
         * @async
         */
        setValues = function(map, cb){
            cb();
        },

        /*
         * @param array keys
         * @async
         * @return bool true if any of the keys exists, false otherwise
         */
        exists = function(keys, cb){
            cb();
        }
        ;

    function resetTests(){
        tests.getDriver = getDriver;
        tests.getValue = getValue;
        tests.setValues = setValues;
        tests.exists = exists;
    }

    afterEach(resetTests);

    resetTests();


    /*
     * initialized the test - will set the async check, wait for the driver to be ready, and then start the test
     *
     * @param int cb_count how many async callbacks should complete on the test
     * @param function cb will be passed the driver when ready
     * @param string [message] alternative message when async timeout is done
     *
     * @async
     *
     * @return Driver
     */
    function initTest(cb_count, cb, msg){
        var driver = tests.getDriver();
        tests.done = 0;

        waitsFor(function(){ return tests.done == cb_count; }, msg || "all tests should have finished running", 1000);

        driver.addEvent('load:once', function(){cb(driver)}, "waiting for load event");
    }

    it ("Should fire a load event", function(){
        initTest(1, function(){tests.done++});
    });


    it ("Should use the set method properly", function(){
        initTest(3,function(driver){
            driver.set("foo", "bar", function(err){
                expect(err).toEqual(null, "there should be no error");

                tests.getValue('foo', function(value){
                    expect(value).toEqual('bar', 'setting values using singular form should work');
                    tests.done++;
                });
            });

            driver.set({
                "baz" : "bla",
                "arieh" : "glazer"
            },null, function(err){
                expect(err).toEqual(null, "there should be no error");

                tests.getValue("baz", function(value){
                    expect(value).toEqual("bla", "settings values using plural from should work");
                    tests.done++;
                });

                tests.getValue('arieh', function(value){
                    expect(value).toEqual('glazer', "setting values using plural form should work");
                    tests.done++;
                });
            });
        });
    });


    it ("Should get values properly", function(){
        initTest(3,function(driver){

            tests.setValues({"arieh":"glazer", "nir":"geier","yehuda":"gilad"}, function(){
                tests.done++;

                driver.get("arieh", function(err,value){
                    expect(err).toEqual(null, "there should be no error");
                    expect(value).toEqual("glazer", "getting singular value should work");
                    tests.done++;
                });

                driver.get(["nir","yehuda"], function(err, map){
                    expect(err).toEqual(null, "there should be no error");
                    expect(JSON.stringify(map)).toEqual(JSON.stringify({"nir":"geier","yehuda":"gilad"}));
                    tests.done++;
                });
            });
        });
    });

    it ("Should remove values properly", function(){
        initTest(4,function(driver){
            tests.setValues({"arieh":"glazer", "nir":"geier","yehuda":"gilad"}, function(){
                driver.remove("arieh", function(err){
                    expect(err).toEqual(null, "there should be no error");
                    tests.done++;

                    tests.exists(["arieh"], function(exists){
                        expect(exists).toEqual(false, "single key should be removed");
                        tests.done++;
                    });
                });

                driver.remove(['nir','yehuda'], function(err){
                    expect(err).toEqual(null, "there should be no error");
                    tests.done++;

                    tests.exists(["nir",'yehuda'], function(exists){
                        expect(exists).toEqual(false, "multiple keys should be removed");
                        tests.done++;
                    });
                });
            });
        });
    });

    it ("Should clear storage properly", function(){ 
        initTest(2,function(driver){
            tests.setValues({"arieh":"glazer", "nir":"geier","yehuda":"gilad"}, function(){
                driver.clear(function(err){
                    expect(err).toEqual(null, "there should be no error");
                    tests.done++;                         

                    tests.exists(['arieh','nir','yehuda'], function(exists){
                        expect(exists).toEqual(false,"all keys should be removed");
                        tests.done++;
                    });
                });
            });
        });
    });
    
    it ("Should have a working getLength method", function(){
        initTest(1, function(driver){
            tests.setValues({"arieh":"glazer", "nir":"geier","yehuda":"gilad"},function(){
                driver.getLength(function(err,len){ 
                    expect(err).toEqual(null, "there should be no error");
                    tests.done++;  
                    expect(len).toEqual(3, "should have a propper count");
                }); 
            });    
        });
    });
    
    it ("Should have a working each method", function(){
        var values = {"arieh":"glazer", "nir":"geier","yehuda":"gilad"};
        initTest(3, function(driver){
            tests.setValues(values,function(){
                driver.each(function(key, value){
                    tests.done++;
                    expect(values[key]).toEqual(value);
                });
            });
        });
    });
    
    it ("Should have a working getKeys method", function(){
        var exp_keys = ["arieh","nir","yehuda"];

        initTest(1, function(driver){
            tests.setValues({"arieh":"glazer", "nir":"geier","yehuda":"gilad"},function(){
                driver.getKeys(function(err, keys){
                    var i, key;
                    tests.done++;
                    
                    for (i=0; key = keys[i]; i++){
                        expect(exp_keys.indexOf(key)).toBeGreaterThan(-1);
                    }
                });   
            });
        });
    });
    
    it ("Should have a working getAll method", function(){
        var values = {"arieh":"glazer", "nir":"geier","yehuda":"gilad"};
        initTest(1, function(driver){
            tests.setValues(values,function(){
                driver.getAll(function(err, results){
                    tests.done++;
                    expect(JSON.stringify(results)).toEqual(JSON.stringify(values));
                });
            });
        });  
    }); 


    it ("Should have a functioning exists method", function(){ 
        initTest(2, function(driver){
            tests.setValues({"arieh":"glazer"},function(){
                driver.exists('arieh', function(err, exists){
                    tests.done++;
                    expect(exists).toBeTruthy();
                });  

                driver.exists("nir", function(err, exists){
                    tests.done++;
                    expect(exists).toBeFalsy();
                });
            });
        });                               
    });
    
};
