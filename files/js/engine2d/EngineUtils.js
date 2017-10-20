
function EngineUtils() {
    console.log("EngineUtils");
    
    var cache = {};

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
}