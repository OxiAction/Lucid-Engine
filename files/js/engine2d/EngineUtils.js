
function EngineUtils() {
    var cache = {};
    var debug = 0;

    /**
    * enable / disable debug mode
    *
    * value:             bool
    */
    this.setDebug = function(value) {
        debug = value;
    }

    /**
    * testing browser for touch support
    */
    this.supportsTouch = function() {
    	return "ontouchend" in document;
    }

    /**
    * testing browser for canvas support
    */
    this.supportsCanvas = function() {
        // check cache first
    	if (cache.supportsCanvas != undefined) {
    		return cache.supportsCanvas;
    	}

		var elem = document.createElement("canvas");
		cache.supportsCanvas = !!(elem.getContext && elem.getContext("2d"));
		return cache.supportsCanvas;
    }

    /**
    * error reporting
    *
    * msg:             object
    */
    this.error = function(msg) {
        this.log("[ERROR] message: " + msg);
    }

    /**
    * console.log layer
    *
    * msg:             object
    */
    this.log = function(msg) {
        if (debug) {
            console.log("[" + msg + "]");
        }
    }

    // prevent console.log errors on older browsers
    if (typeof console == "undefined") {
        window.console = {
            log: function () {
                // do nothing
            }
        };
        console.warn = console.debug = console.log;
    }

    // prototyping: extending js defaults stuff

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

    // custom jQuery scripts

    /**
    * used for loading js scripts
    *
    * url:              string the file path
    * success:          function
    * error:            function
    */
    jQuery.loadScript = function (url, success, error) {
        jQuery.ajax({
            "url": url,
            "dataType": "script",
            "success": success,
            "error": error,
            "async": true
        });
    }
}