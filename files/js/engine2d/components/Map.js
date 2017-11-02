
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

	var self = this;

	var id = self.getID();
	var name = config["name"];
	var layers = config["layers"];
	var engine2d = config["engine2d"];

	this.init = function() {
		if (!layers || layers.length < 1) {
			EngineUtils.error("map name: " + name + " - layers are not defined!");
			return false;
		} else if (!engine2d) {
			EngineUtils.error("map name: " + name + " - engine2d reference not defined!");
			return false;
		}

		for (var i = 0; i < layers.length; ++i) {
			if (layers[i]["config"] !== undefined && layers[i]["config"]["id"] !== undefined) {
				engine2d.createAddLayer(layers[i]["config"]);
			} else {
				EngineUtils.error("map name: " + name + " - tried to createAdd layer to engine2d but layer config or layer id is undefined!");
			}
		}

		return true;
	}

	/**
	* TODO desc
	*/
	this.destroy = function() {
		for (var i = 0; i < layers.length; ++i) {
			if (layers[i]["config"] !== undefined && layers[i]["config"]["id"] !== undefined) {
				engine2d.removeLayerByID(layers[i]["config"]["id"]);
			} else {
				EngineUtils.error("map name: " + name + " - tried to remove layer from engine2d but layer config or layer id is undefined!");
			}
		}
	}

	self.init();
}