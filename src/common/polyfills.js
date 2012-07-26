var jStore = jStore || {};

(function () {

    //
    // --- Ployfills
    //
    Array.isArray = Array.isArray ||
        function (arg) {
            return Object.prototype.toString.call(arg) === "[object Array]";
        };

    Array.prototype.forEach = Array.prototype.forEach ||
        function (fn, scope) {
            for (var i = 0, len = this.length; i < len; ++i) {
                fn.call(scope || this, this[i], i, this);
            }
        }

    Object.keys = Object.keys ||
        (function () {
            var hasOwnProperty = Object.prototype.hasOwnProperty,
                hasDontEnumBug = !({toString:null}).propertyIsEnumerable('toString'),
                dontEnums = [
                    'toString',
                    'toLocaleString',
                    'valueOf',
                    'hasOwnProperty',
                    'isPrototypeOf',
                    'propertyIsEnumerable',
                    'constructor'
                ];

            return function (obj) {
                var result = []

                if (typeof obj !== 'object' && typeof obj !== 'function' || obj === null) {
                    throw new TypeError('Object.keys called on non-object');
                }

                for (var prop in obj) {
                    if (hasOwnProperty.call(obj, prop)) {
                        result.push(prop);
                    }
                }

                // Cool hack :-)
                if (hasDontEnumBug) {
                    dontEnums.forEach(function (element, index, array) {
                        if (hasOwnProperty.call(obj, dontEnums[i])) {
                            result.push(dontEnums[i]);
                        }
                    });
                }
                return result
            }
        })();

}).apply(jStore);
