const TYPE_LAYER_MENU = "typeLayerMenu"; // menus
const TYPE_LAYER_UI = "typeLayerUI"; // ui interfaces
const TYPE_LAYER_GRAPHICAL = "typeLayerGraphical"; // precise graphics rendering
const TYPE_LAYER_COLLISION = "typeLayerCollision"; // invisible collision layer
const TYPE_LAYER_OBJECTS = "typeLayerObjects"; // objects (e.g. invisible triggers)

function Layer(config) {
	EngineUtils.log("Layer");

	var configDefault = {
		"id": null, // id
		"type": null, // TYPE_LAYER_xxx
		"active": true, // if active => render
		"display": false, // hide / show
		"persistent": false, // determines if this layer will be auto deleted by the Engine2D
		"layerContainer": "layer-container", // target HTML container ID for layers
		"renderingInterval": null // rendering interval
	};

	var config = $.extend({}, configDefault, config);

	Component.call(this, config);

	var self = this;
	
	var id = self.getID();
	var type = self.getType();
	var active = self.getActive();
	var display = config["display"];
	var persistent = config["persistent"];

	// check for type
	if (type == null) {
		EngineUtils.error("layer type is null");
		return;
	}

	// create canvas
	var canvas = document.createElement("canvas");
	canvas.id = id;

	// get container for canvas
	var layerContainer = document.getElementById(config["layerContainer"]);
	if (!layerContainer) {
		EngineUtils.error("layer layerContainer is null")
		return;
	}
	layerContainer.append(canvas);

	// perforamnce is depending on the rendering interval of the layers
	// certain layers dont need to be rendered that often
	var renderingInterval = config.renderingInterval;

	if (renderingInterval == null) {
		switch (type) {
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

	this.setDisplay = function(value) {
		if (value) {
			display = true;
			canvas.style.display = "block";
		} else {
			display = false;
			canvas.style.display = "none";
		}
	}

	this.getDisplay = function() {
		return display;
	}

	this.getCanvas = function() {
		return canvas;
	}

	this.getPersistent = function() {
		return persistent;
	}

	this.update = function() {
		var type = this.getType();

		if (type == TYPE_LAYER_OBJECTS) {
			// ...
		}
	}

	this.destroy = function() {
		clearInterval(self.update);
	}

	// default display state
	this.setDisplay(display);

	// setInterval(this.update, renderingInterval);
	this.update();
}