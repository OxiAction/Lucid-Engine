
function EngineUtils() {
    var cache = {};
    var debug = 0;

    this.setDebug = function(value) {
        debug = value;
    }

    // testing browser for touch support
    this.supportsTouch = function() {
    	return "ontouchend" in document;
    }

    // testing browser for canvas
    this.supportsCanvas = function() {
        // check cache first
    	if (cache.supportsCanvas != undefined) {
    		return cache.supportsCanvas;
    	}

		var elem = document.createElement("canvas");
		cache.supportsCanvas = !!(elem.getContext && elem.getContext("2d"));
		return cache.supportsCanvas;
    }

    // error reporting
    this.error = function(object, msg) {
        this.log("[ERROR] in " + object + " - message: " + msg);
    }

    // log
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

    // prototyping -> extending stuff

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
        for(var i = this.length; i--;) {
            if(this[i] === item) {
                this.splice(i, 1);
            }
        }
        return this;
    };

    Array.prototype.random = function() {
        return this[Math.floor(Math.random() * this.length)];
    };
}