describe("DomStorage", function(){
    beforeEach(function(){
        localStorage.clear();    

        tests.getDriver = function(){
            return new jStore.drivers['DomStorage']({table_name:"test", db_name: 'Chegg'});
        };

        tests.getValue = function(key, cb){
            cb(JSON.parse(localStorage.getItem('test_'+key)));    
        };

        tests.setValues = function(values, cb){
            var key;
            for (key in values){
                localStorage.setItem("test_"+key, JSON.stringify(values[key]));    
            }

            cb();
        };
    });

    tests.runTests();        
});
