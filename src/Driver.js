!function(ns, utils){
    /**
     * @module Driver
     */
    var methods = "get set each clear exists getAll getKeys remove".split(' '), i, method;

    function mthd(){
        return this;
    }

    /**
     * A basic driver class
     * @class Driver
     *
     * @uses Events
     * @uses Options
     * @uses Bind
     * @constructor
     */
    function Driver(options){
        utils.Events.call(this);
        utils.Options.call(this);
        utils.Bind.call(this);

        this.setOptions(options);
    }

    Driver.prototype = {
        constructor : Driver;    
    };

    for (i = 0; mehtod = methods[i]; i++){
        Driver.prototype[name] = mthd;    
    }

    /**
     * @method set
     * @param {string|object} key if an object is supplied, assums a map of key->value
     * @param {string} value
     * @chainable
     */
    /**
     * @method get
     * @async
     * @param {string|array} key if an array is supplied, assumes an array of names
     * @param {function} cb
     *
     * @return {string|obect} if was asked for a collection of values, return a map, otherwise return a string
     *
     * @chainable
     */
    /**
     * @method each
     * @param {function} fn signiture is function(value, key)
     * @chainable
     */
    /**
     * @method getAll
     * @param {function cb}
     * @async
     * @chainable
     * @return {object} key=>value map
     */
    /**
     * @method remove
     * @param {string} key
     * @chainable
     */
    /**
     * @method clear
     * @chainable
     */
    /**
     * @method getKeys
     * @param {function} cb
     * @async
     * @chianable
     * @return {array} 
     */
    /**
     * @method exists
     * @async
     * @param {string} key
     * @param {function}  cb
     * @chainable
     * @return {boolean}
     */


    /**
     * @event error
     * @param args
     *  @param args.message
     */

    Driver.drivers = [];

    /**
     * registers a driver. A driver must alwasy have a test method
     *
     * @method register
     * @static
     *
     * @param {string} name
     * @param {object} props a list of methods and properties for the new driver
     *
     * @return {Driver} the new driver
     */
    Driver.register = function(name, params){
        var d;

        function driver(){
            this.$construct(arguments);
            this.init && this.init(arguments);
        }

        if (!params.test || typeof params.test != 'function'){
            throw "Driver must always have a test method";    
        }

        d = utils.inherit(driver, Driver, params);
        d.test = params.test;
        d.name = name;

        Driver.drivers.push(d);

        return d;
    };

    /**
     * chooses which driver to use and creates it
     * @method choose
     * @static
     *
     * @param {object} options options to pass to the driver's constructor
     *
     * @return {Driver} the chosen driver
     */
    Driver.choose = function(opts){
        var i, driver;

        if (Driver.chosen){
            return new Driver.chosen(opts);    
        }

        for (i=0; driver = Driver.drivers[i]; i++){
            if (driver.test()){
                Driver.chosen = driver;
                return new driver(opts);
            }    
        }
    }
}.apply(jStorage,[jStorage, utils]);

