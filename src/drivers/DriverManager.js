var jStore = jStore || {};

!function (ns, utils) {
    /**
     * @module Driver
     */
        
    var DriverManager,
         apiMethods = "clear each exists get getAll getKeys init remove set test".split(' ');
    
    /**
     * This is the stub methods for the driver.
     * The method return this so it can be chainable later if needed.
     *
     * @chainable
     *
     * @return {this}
     */
    function stubMethod() {
        return this;
    }

    ns.DriverManager = DriverManager = function (options) {

    };

    DriverManager.prototype = {
        constructor:DriverManager
    };

    /**
     * List of available drivers.
     *
     * @property drivers
     * @static
     * @type {Array}
     */
    DriverManager.drivers = [];

    /**
     * Registers a driver.<br/>
     * A driver must always have a <b>test</b> method<br/>
     *
     * @method register
     * @static
     *
     * @param {string} name
     * @param {object} props a list of methods and properties for the new driver
     *
     * @return {DriverManager} the new driver
     */
    DriverManager.register = function (name, params) {
        var d, errors = '';

        function driver() {
            this.$construct(arguments);
            this.init && this.init(arguments);
        }

        // Verify that the driver has all the API methods
        apiMethods.forEach(function (method) {

            if (!params[method] || typeof params[method] !== 'function') {
                errors += 'Driver [' + name + '] is missing ' + method + ' method.\r\n';
            }
        });

        if (errors.length > 0) {
            throw errors;
        }

        d = utils.inherit(driver, ns.Driver, params);
        d.test = params.test;
        d.name = name;

        DriverManager.drivers.push(d);
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
    DriverManager.choose = function (opts) {
        var i, driver;

        if (DriverManager.chosen) {
            return new DriverManager.chosen(opts);
        }

        for (i = 0; driver = DriverManager.drivers[i]; i++) {
            if (driver.test()) {
                DriverManager.chosen = driver;
                return new driver(opts);
            }
        }
    }

}.apply(jStore, [jStore, jStore.utils]);

