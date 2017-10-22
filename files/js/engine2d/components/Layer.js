const TYPE_LAYER_MENU = "typeLayerMenu"; // menus
const TYPE_LAYER_UI = "typeLayerUI"; // ui interfaces
const TYPE_LAYER_GRAPHICAL = "typeLayerGraphical"; // precise graphics rendering
const TYPE_LAYER_COLLISION = "typeLayerCollision"; // invisible collision layer
const TYPE_LAYER_OBJECTS = "typeLayerObjects"; // objects (e.g. invisible triggers)

function Layer(config) {
	EngineUtils.log("Layer");

	var configDefault = {
		"target": null, // target canvas id
		"type": null, // TYPE_LAYER_xxx
		"active": 1, // if active => render
		"renderingInterval": null // rendering interval
	};

	var config = $.extend({}, configDefault, config);

	Component.call(this, config);

	if (config.type == null) {
		EngineUtils.error(this, "type is null");
		return;
	}

	var self = this;
	var target = config.target;
	var renderingInterval = config.renderingInterval;

	if (renderingInterval == null) {
		switch (this.getType()) {
			case TYPE_LAYER_MENU:
				renderingInterval = 40;
				break;
			case TYPE_LAYER_UI:
				renderingInterval = 40;
				break;
			case TYPE_LAYER_GRAPHICAL:
				renderingInterval = 20;
				break;
			case TYPE_LAYER_COLLISION:
				renderingInterval = 20;
				break;
			case TYPE_LAYER_OBJECTS:
				renderingInterval = 20;
				break;
			default:
				renderingInterval = 20;
		}
	}

	this.update = function() {
		var type = this.getType();

		if (type == TYPE_LAYER_OBJECTS) {
			// ...
		}
	}

	// setInterval(this.update, renderingInterval);
	this.update();

	this.destroy = function() {
		clearInterval(self.update);
	}
}