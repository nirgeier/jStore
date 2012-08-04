var tests = tests || {};
tests.runTests = function runTests(){ 

    var getDriver = function(){
            return new jStore.Driver();    
        },

        getValue = function(key, cb){
            cb();    
        };
                  

    afterEach(function(){
        tests.getDriver = getDriver;
        tests.getValue = getValue;
        tests.driver = null;
    });
 
    it ("Should use the set method properly", function(){
        var driver = tests.getDriver(), done = 0;

        tests.driver = driver;

        driver.set("foo", "bar", function(err){
            expect(err).toEqual(null, "there should be no error");
            
            tests.getValue('foo', function(value){
                expect(value).toEqual('bar', 'setting values using singular form should work');    
                done++;
            });
        });

        driver.set({
            "baz" : "bla",
            "arieh" : "glazer"
        },null, function(err){
            expect(err).toEqual(null, "there should be no error");

            tests.getValue("baz", function(value){
                expect(value).toEqual("bla", "settings values using plural from should work");
                done++;
            });

            tests.getValue('arieh', function(value){
                expect(value).toEqual('glazer', "setting values using plural form should work");
                done++;
            });
        });

        waitsFor(function(){ return done==3; }, "all value setting and getting to be done", 1000);
    });      


    it ("Should get values properly", function(){
        var done = false,
            driver = tests.getDriver();

        tests.driver = driver;
        tests.setValues({"arieh":"glazer", "nir":"geier","yehuda":"gilad"}, function(){
            done++;
            
            driver.get("arieh", function(err,value){
                expect(err).toEqual(null, "there should be no error");
                expect(value).toEqual("glazer", "getting singular value should work");
                done++;
            });     

            driver.get(["nir","yehuda"], function(err, map){
                expect(err).toEqual(null, "there should be no error");
                expect(JSON.stringify(map)).toEqual(JSON.stringify({"nir":"geier","yehuda":"gilad"}));    
                done++;
            });
        });

        waitsFor(function(){ return done==3; }, "all value setting and getting to be done", 1000);
    });
    
};
