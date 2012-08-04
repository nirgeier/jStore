var jStore = jStore || {};

!function(ns,utils){
    /**
     * @module jStore
     */

    /**
     * This clas represents a data store
     *
     * @class jStore
     * @constructor
     *
     * @param {object} options
     *  @param {array} [options.drivers] a list of prioritized driver names to choose from
     *  @param {object} options.driver_options parameters to pass to the driver
     */
    function jStore(options){
       var driver = jStore.choose(options.drivers);
       return new driver(options.driver_options);
    }

    utils.merge(jStore, ns);

    /**
     * a stack of all registered driver names
     * @property stack
     * @type {array}
     * @private
     */
    jStore.stack = [];

    /**
     * a named list of all registered drivers
     * @property drivers
     * @type {object}
     * @private
     */
    jStore.drivers = {};

    /**
     * a reference to the last automatically chosen driver
     * @propert chosen_driver
     * @type {ns.Driver}
     * @private
     */
    jStore.chosen_driver = null;

    /**
     * chooses a driver to use.
     *
     * @method choose
     * @static
     *
     * @param {array} [list] if provided, will choose a driver from that list
     *
     * @return ns.Driver
     */
    jStore.choose = function (list) {
        var list_provided = !!list,
            i, driver, name;

        list = list || jStore.stack;

        if (!list_provided && jStore.chosen_driver) return jStore.chosen_driver;



        for (i = 0; name = list[i]; i++) {
            driver = jStore.drivers[name];

            if (driver.test()){
                if (!list_provided) jStore.chosen_driver = driver;
                return driver;
            }
        }

        return null;
   };

    /**
     * Registers a driver.<br/>
     * A driver must always have a <b>test</b> method<br/>
     *
     * @method registerDriver
     * @static
     *
     * @param {string} name
     * @param {object} props a list of methods and properties for the new driver
     *
     * @return {Driver} the new driver
     */
    jStore.registerDriver = function registerDriver(name, params) {
        var d;

        function driver() {
            this.$construct(arguments);
            this.init && this.init(arguments);
        }

        params = params || {};

        if (!params.test || typeof params.test !== 'function') {
            throw "Driver must always have a test method";
        }

        params.defaultOptions = utils.merge(ns.Driver.defaultOptions,params.defaultOptions || {});

        d = utils.inherit(driver, ns.Driver, params);
        d.test = params.test;
        d.$name = name;

        jStore.stack.push(d.$name);

        jStore.drivers[name] = d;
        return d;
    };

    this.jStore = jStore;
}.apply(this,[jStore,jStore.utils]);
