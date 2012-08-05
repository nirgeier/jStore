var jStore = jStore || {};

!function (ns) {

    var logger = ns.Logger.getLogger('DriverTemplate', ns.Logger.logLevels.DEBUG);

    /**
     * This class is the implementation of DriverTemplate driver.<br/>
     *
     * @constructor
     * @class DriverTemplate
     * @extends Driver
     **/
    jStore.Driver.register('DriverTemplate', {

        name:'DriverTemplate',

        clear:function (callback) {
            logger.log('clear');

            if (callback) {
                callback();
            }
            return this;
        },

        each:function (callback) {
            logger.log('each');
            return this;
        },

        exists:function (key, callback) {
            logger.log('exists');
            callback(null, true);
            return this;
        },

        get:function (keyOrArray, callback) {
            logger.log('get');
            return this;
        },

        getAll:function (callback) {
            logger.log('getAll');
            var items = {};
            callback(null, items);
            return this;
        },

        getKeys:function (callback) {
            logger.log('getKeys');
            var items = [];
            callback(null, items);
            return this;
        },

        init:function () {
            logger.log('init');
            return this;

        },

        remove:function (keyOrArray, callback) {
            logger.log('remove');

            if (callback) {
                callback();
            }
            return this;
        },

        set:function (keyOrMap, value) {
            return this;
        },

        test:function () {
            return false;
        }
    });

}.apply(jStore, [jStore]);
