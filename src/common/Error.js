var jStore = jStore || {};

!(function (ns, utils) {

    /**
     * @module Helper
     * @class Error
     */
    var Error;

    ns.Error = Error = function (type, message) {
        this.type = type;
        this.message = message;
        return this;
    };

    Error.prototype = {
        constructor:Error
    };

    Error.TYPES = {
        // To be filled in with types
    };


}).apply(jStore, [jStore, jStore.utils]);
