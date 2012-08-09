var jStore = jStore || {};

!function (ns, utils) {
    /**
     * @module Driver.Template
     */

    var logger = ns.Logger.getLogger("Template", ns.Logger.logLevels.ERROR),
        driver;

    driver = jStore.registerDriver('Template', {
        name:'Template',

        init:function (options) {
            this.fireEvent('load:latched');
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

        get:function (key, callback) {
            logger.log('get');

            /*
             if (Array.isArray(key)) {
             callback(null, values);
             } else {
             callback(null, value);
             }
             */
            return this.$parent('get', arguments);
        },

        getAll:function (callback) {
            logger.log('getAll');
            /*
             callback(null, items);
             */
            return this.$parent('getAll', arguments);
        },

        getKeys:function (callback) {
            logger.log('getKeys');

            // callback(null, keys);

            return this.$parent('getKeys', arguments);
        },

        remove:function (key, callback) {
            /*
             if (callback) {
             callback(null);
             }
             */
            return this.$parent('remove', arguments);
        },

        set:function (key, value, callback) {
            /*
             callback(null);
             */
            return this.$parent('set', arguments);
        },

        test:function () {
            return false;
        },

        getLength:function (cb) {
            // cb(null,length);

            return this.$parent('getLength', arguments);
        }
    });
}.apply(jStore, [jStore, jStore.utils]);
