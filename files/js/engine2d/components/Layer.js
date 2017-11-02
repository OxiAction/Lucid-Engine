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
		"effects": null, // effects
		"display": false, // initial hide / show
		"persistent": false, // determines if this layer will be auto deleted by the Engine2D
		"layerContainer": "layer-container" // target HTML container ID for layers
	};

	var config = $.extend({}, configDefault, config);

	Component.call(this, config);

	var self = this;
	
	var id = self.getID();
	var type = self.getType();
	var active = self.getActive();
	var effects = config["effects"];
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

	/**
	* TODO: description
	*
	* value: 			boolean
	*/
	this.setDisplay = function(value) {
		if (value) {
			display = true;
			canvas.style.display = "block";
		} else {
			display = false;
			canvas.style.display = "none";
		}
	}

	/**
	* TODO: description
	*/
	this.getDisplay = function() {
		return display;
	}

	/**
	* TODO: description
	*/
	this.getCanvas = function() {
		return canvas;
	}

	/**
	* TODO: description
	*/
	this.getPersistent = function() {
		return persistent;
	}

	/**
	* TODO: description
	*
	* updateConfig: 		object
	*/
	this.update = function(updateConfig) {
		
	}

	/**
	* TODO: description
	*/
	this.getCollisionData = function() {
		if (type != TYPE_LAYER_COLLISION) {
			EngineUtils.error("cant get collision data from a layer with type: " + type);
			return false;
		}

		//...
	}

	/**
	* TODO: description
	*/
	this.destroy = function() {
		EngineUtils.log("destroying layer with id: " + id);

		layerContainer.removeChild(canvas);
		canvas = null;
	}

	// default display state
	this.setDisplay(display);

	// this.update();
}