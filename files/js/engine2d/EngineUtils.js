
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
            // console.log("LOG for " + object + " - message: " + msg);
            console.log("[" + msg + "]");
        }
    }
}