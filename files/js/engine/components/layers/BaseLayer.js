/**
 * Engine default BaseLayer.
 * Use this as a base for new Layers.
 */
Lucid.BaseLayer = BaseComponent.extend({
	// config variables and their default values
	z: 0, // z-index!
	id: null,
	map: null,
	image: null,
	type: null,
	data: null,
	effects: null, // effects
	render: true, // determines if the content is rendered
	persistent: false, // determines if this layer will be auto deleted by the Engine
	collision: false, // if true, all "1" tiles in the data will be used for collision detection

	// local variables
	canvas: null,
	canvasContext: null,

/**
 * Core
 */

	/**
	  * Automatically called when instantiated.
	  *
	  * @param      {Object}   config  The configuration.
	  * @return     {boolean}  Returns true on success.
	  */
	init: function(config) {
		
		
		this._super(config);

		if (this.id == null, this.type == null) {
			Lucid.Utils.error("Layer @ init: id or type is null - please asign an id and Layer.TYPE.XXX!");
			return;
		}

		this.canvas = document.createElement("canvas");
		this.canvasContext = this.canvas.getContext("2d");

		return true;
	},

	/**
	 * Determines if valid.
	 *
	 * @return     {boolean}  True if valid, False otherwise.
	 */
	isValid: function() {
		if (
			!this.map ||
			!this.camera ||
			!this.data ||
			!this.image ||
			!this.render
			) {
			return false;
		} else {
			return true;
		}
	},

	/**
	 * Draws a Canvas.
	 *
	 * @param      {number}  delta   The delta.
	 * @param      {Object}  config  The configuration
	 * @return     {Canvas}  Returns the drawn Canvas.
	 */
	draw: function(delta, config) {
		return this.canvas;
	},

	resize: function(config) {
		this.canvas.width = config.wWidth;
		this.canvas.height = config.wHeight;
	},

	/**
	 * Destroys the Layer and all its corresponding objects.
	 *
	 * @return     {boolean}  Returns true on success.
	 */
	destroy: function() {
		Lucid.Utils.log("Layer @ destory: destroying Layer with id: " + this.id);

		this.image = null;
		this.map = null;
		this.canvas = null;
		this.canvasContext = null;

		return true;
	},

/**
 * Getter & Setter
 */

	getTile: function (index) {
		if (index < this.data.length) {
			return this.data[index];
		} else {
			return 0;
		}
	},

	getCanvas: function() {
		return this.canvas;
	},

	getCollisionData: function(config) {
		if (this.collision) {
			return null;
		}

		return null;
	}
});

// type constants
Lucid.BaseLayer.TYPE = {
	UI: "ui", // ui (e.g. menu, inventory)
	TILESET: "tileSet", // tileSet grid with cols / rows
	COLLISION: "collision", // tileSet grid with cols / rows
	ITEMS: "items", // objects (e.g. a ball or some animated thing)
	ENTITIES: "entities", // entities - there can only be ONE of this type
	EVENTS: "events" // event triggers
};

Lucid.BaseLayer.EVENTS = {
	PLAYER_SPAWN: "playerSpawn", // player spawn point
	LOAD_MAP: "loadMap" // load a map
};

// forms setup for the editor
Lucid.BaseLayer.FORMS = {
	id: "string",
	type: "string"
};