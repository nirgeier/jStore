var jStore = jStore || {};

!(function (ns, utils) {
    /**
     * @module Helper
     * @class Driver
     */
    var Logger,
        logMethods = ["assert", "error", "warn", "info", "log"],
        loggers = {},
        referenceFunction = null;

    /**
     * Logger Class.
     * Creates a logger.
     *
     * @param {String} loggerName Name of the logger. If a logger with supplied name
     * already exists, that logger instance is returned and its level will be updated
     * to a passed level or will stay with old level if level parameter wasn't passed.
     * @param {Logger.logLevels ENUM} level Debug level of the logger.
     */
    Logger = function (loggerName, level) {

        if (typeof loggerName !== "string") {
            if (window.console) {
                window.console.warn("Attempt to instantiate Logger with illegal loggerName, using Root logger");
            }
            loggerName = "Root";
        }

        if (loggers[loggerName]) {
            if (level !== undefined) {
                loggers[loggerName].setLevel(level);
            }
            return loggers[loggerName];
        }

        this.name = loggerName;
        this.setLevel(level);

        loggers[this.name] = this;
    };

    Logger.logLevels = {
        ASSERT:0,
        ERROR:1,
        WARN:2,
        INFO:3,
        DEBUG:4
    };

    Logger.getLogger = function (loggerName, level) {
        if (loggers[loggerName]) {
            if (level !== undefined) {
                loggers[loggerName].setLevel(level);
            }
            return loggers[loggerName];
        } else {
            return new Logger(loggerName, level);
        }
    };

    Logger.prototype.setLevel = function (level) {
        var i = 0;

        if (level === undefined) {
            level = 0;
        }

        if (typeof level !== "number" || level < 0 || level > 3) {
            if (window.console) {
                window.console.warn("Attempt to set illegal log level: '" + level + "', log level is set to 0.");
            }
            level = 0;
        }

        this.level = level;

        if (window.console) {
            if (referenceFunction === null) {
                setReferenceFunction();
            }

            for (i; i <= level; i++) {
                if (window.console[logMethods[i]]) {
                    this[logMethods[i]] = referenceFunction(logMethods[i], [this.name + ":"]);
                    if (logMethods[i] === "log") {
                        this.debug = this[logMethods[i]];
                    }
                } else {
                    this[logMethods[i]] = empty;
                }
            }
        }

        for (i; i < logMethods.length; i++) {
            this[logMethods[i]] = empty;
            if (logMethods[i] === "log") {
                this.debug = this[logMethods[i]];
            }
        }
    };

    function setReferenceFunction() {
        var testRef;
        try {
            testRef = window.console.log.bind(window.console);
            testRef("Test binding console methods");
            referenceFunction = bind;
        } catch (e) {
            window.console.info("Can't bind console methods");
            try {
                testRef = window.console.log;
                testRef("Test direct reference to console methods");
                referenceFunction = direct;
            } catch (er) {
                window.console.info("Can't set direct reference to console methods");
                referenceFunction = apply;
            }
        }
    }

    ns.Logger = Logger;

}).apply(jStore, [jStore, jStore.utils]);
