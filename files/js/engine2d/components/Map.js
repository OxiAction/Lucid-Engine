
function Map(config) {
	EngineUtils.log("Map");

	var configDefault = {
		"id": null,
		"name": "Untiteled",
		"layers": null,
		"engine2d": null // reference to engine2d instance
	};

	var config = $.extend({}, configDefault, config);

	Component.call(this, config);

	var name = config.name;
	var layers = config.layers;
	var engine2d = config.engine2d;

	/**
	* error reporting feature (TODO: maybe not optimal like this...)
	*
	* type: 			string
	*/
	var errorNullData = function(type) {
		EngineUtils.error("map name '" + name + "' - " + type + " is null!");
	}

	if (!layers) {
		errorNullData("layers");
		return;
	} else if (!engine2d) {
		errorNullData("engine2d");
		return;
	}

	/**
	* destroy & remove all events, intervals, timeouts
	*/
	this.destroy = function() {
		
	}
}