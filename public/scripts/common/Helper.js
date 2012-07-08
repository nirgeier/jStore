if (typeof jStorage === 'undefined') {
    jStorage = {};
}

!function (ns) {

    /**
     * This class will contain helper methods.<br/>
     * All the methods should be static and
     *
     * @class Helper
     */

    ns.Helper = {

        /**
         * This method will check to see if a give object is an array or not.<br/>
         * We first try to see if we have the Array.isArray and if not we will add polyfill to support it.<br/>
         *
         * @param obj - The data we want to check if its Array or not
         *
         * @method isArray
         */
        isArray:Array.isArray || function (obj) {
            return Object.prototype.toString.call(obj) === '[object Array]'
        },

        /**
         * Check to see if given object is valid JSON.<br/>
         * TODO: Make this more efficient. !!!!!
         *
         * @method isJson
         *
         * @param data - The data we want to check if its a valid JSON or not
         * @return {Boolean}
         */
        isJSON:function (data) {

            // Try to convert the string to JSON
            switch (typeof data) {
                case 'string':
                    try {
                        JSON.parse(data);
                    } catch (e) {
                        return false;
                    }
                    return true;
                // no need for break here.
                case 'object':
                    try {
                        JSON.parse(JSON.stringify(data));
                    } catch (e) {
                        return false;
                    }
                    return true;
                    break;
            }
        }
    };
}.apply(jStorage, [jStorage]);