/**
 * EngingeUtils is a utils collection for the Engine. It also extends some
 * JavaScript data types with new features.
 *
 * @class      EngineUtils (name)
 * @return     {Object}  Returns public methods.
 */
var EngineUtils = function() {
    // private variables
    var cache = {};
    var debug = 0;

    // prevent console.log, console.warn, console.debug errors on older browsers
    if (typeof console == "undefined") {
        window.console = {
            log: function () {
                // do nothing
            }
        };
        console.warn = console.debug = console.log;
    }

    // extending JavaScript data types with new features
    Number.prototype.round = function(precision) {
        precision = Math.pow(10, precision || 0);
        return Math.round(this * precision) / precision;
    };

    Number.prototype.floor = function() {
        return Math.floor(this);
    };

    Number.prototype.ceil = function() {
        return Math.ceil(this);
    };

    Number.prototype.toInt = function() {
        return (this | 0);
    };

    Number.prototype.toDeg = function() {
        return (this * 180) / Math.PI;
    };

    Array.prototype.sortByKey = function(key) {
        return this.sort(function(a, b) {
            return parseFloat(a[key]) - parseFloat(b[key]);
        });
    };

    Array.prototype.erase = function(item) {
        for(var i = this.length; --i;) {
            if(this[i] === item) {
                this.splice(i, 1);
            }
        }
        return this;
    };

    Array.prototype.random = function() {
        return this[Math.floor(Math.random() * this.length)];
    };

    Array.prototype.contains = function(item) {
        var i = this.length;
        while (i--) {
            if (this[i] === item) {
                return true;
            }
        }
        return false;
    }

    // extending jQuery

    /**
     * Loads a file.
     *
     * @param      {string}            url       The url.
     * @param      {string}            dataType  The data type. E.g. "script",
     *                                           "xml",
     *                                           "application/x-www-form-urlencoded; charset=UTF-8"
     * @param      {loadFileCallback}  success   The success callback function.
     * @param      {loadFileCallback}  error     The error callback function.
     */
    $.loadFile = function (url, dataType, success, error) {
        jQuery.ajax({
            url: url,
            dataType: dataType,
            success: success,
            error: error,
            async: true
        });
    }

    /**
     * GET parameter value.
     *
     * @param      {string}  parameter  The parameter.
     * @return     {string}  Value of the parameter
     */
    $.urlParam = function(parameter) {
        var results = new RegExp('[\?&]' + parameter + '=([^&#]*)').exec(window.location.href);
        if (results == null){
           return null;
        }
        else{
           return decodeURI(results[1]) || 0;
        }
    }

/**
 * Public methods
 */

    return {
        /**
         * Enable / disable debug mode.
         *
         * @param      {boolean}  value   The value.
         */
        setDebug: function(value) {
            debug = value;
        },

        /**
         * General check if the browser has all the features which are required
         * by Engine.
         *
         * @return     {boolean}  Returns true if supported.
         */
        engineSupported: function() {
            if (!this.supportsCanvas()) {
                return false;
            }

            // TODO: this needs more checks - I guess

            return true;
        },

        /**
         * Testing browser for touch support
         *
         * @return     {boolean}  Returns true if touch is supported.
         */
        supportsTouch: function() {
            return "ontouchend" in document;
        },
        
        /**
         * Testing browser for canvas support.
         *
         * @return     {boolean}  Returns true if canvas is supported.
         */
        supportsCanvas: function() {
            // check cache first
            if (cache.supportsCanvas != undefined) {
                return cache.supportsCanvas;
            }

            var elem = document.createElement("canvas");
            cache.supportsCanvas = !!(elem.getContext && elem.getContext("2d"));
            return cache.supportsCanvas;
        },
        
        /**
         * Error reporting layer.
         *
         * @param      {string}  msg     The error message.
         */
        error: function(msg) {
            this.log("[ERROR] message: " + msg);
        },

        /**
         * console.log layer.
         *
         * @param      {string}  msg     The message.
         */
        log: function(msg) {
            if (debug) {
                console.log("[" + msg + "]");
            }
        }
    };
}();