/**
 * Engine default BaseLayer. Use this as base for new Layers.
 */
Lucid.BaseLayer = Lucid.BaseComponent.extend({
	// config variables and their default values
	z: 0, // z-index!
	id: null,
	type: null,
	image: null,
	data: null,
	effects: null, // effects
	render: true, // determines if the content is rendered
	persistent: false, // determines if this layer will be auto deleted by the Engine
	collision: false, // if true, all "1" tiles in the data will be used for collision detection

	// local variables
	canvas: null,
	canvasContext: null,
	collisionData: null,

/**
 * Core
 */

	/**
	 * Automatically called when instantiated.
	 *
	 * @param      {Object}   config  The configuration.
	 * @return     {Boolean}  Returns true on success.
	 */
	init: function(config) {
		this._super(config);

		if (!this.id) {
			Lucid.Utils.error("Layer @ init: id is null!");
			return false;
		}

		if (!this.type) {
			Lucid.Utils.error("Layer @ init: type is null!");
			return false;
		}

		this.canvas = document.createElement("canvas");
		this.canvasContext = this.canvas.getContext("2d");

		return true;
	},

	/**
	 * Determines if valid.
	 *
	 * @return     {Boolean}  True if valid, False otherwise.
	 */
	isValid: function() {
		if (
			!this.map ||
			!this.camera ||
			!this.data ||
			!this.render
			) {
			return false;
		} else {
			return true;
		}
	},

	/**
	 * The renderUpdate() function should simulate anything that is affected by time.
	 * It can be called zero or more times per frame depending on the frame
	 * rate.
	 *
	 * @param      {Number}  delta   The amount of time in milliseconds to
	 *                               simulate in the update.
	 */
	renderUpdate: function(delta) {
		// ...
	},

	/**
	 * Draw things.
	 *
	 * @param      {Number}  interpolationPercentage  The cumulative amount of
	 *                                                time that hasn't been
	 *                                                simulated yet, divided by
	 *                                                the amount of time that
	 *                                                will be simulated the next
	 *                                                time renderUpdate() runs.
	 *                                                Useful for interpolating
	 *                                                frames.
	 */
	renderDraw: function(interpolationPercentage) {
		// ...
	},

	/**
	 * Resize method. Usually called when the screen / browser dimensions have
	 * changed.
	 *
	 * @param      {Object}  config  The configuration which must contain the
	 *                               properties wWidth and wHeight.
	 */
	resize: function(config) {
		if (this.canvas) {
			this.canvas.width = config.wWidth;
			this.canvas.height = config.wHeight;
		}
	},

	/**
	 * Destroys the Layer and all its corresponding objects.
	 *
	 * @return     {Boolean}  Returns true on success.
	 */
	destroy: function() {
		Lucid.Utils.log("Layer @ destory: destroying Layer with id: " + this.id);

		this.image = null;
		this.map = null;
		this.camera = null;
		this.canvas = null;
		this.canvasContext = null;

		return true;
	},

/**
 * Getter & Setter
 */

	getTile: function(index) {
		if (index < this.data.length) {
			return this.data[index];
		} else {
			return 0;
		}
	},

	getCanvas: function() {
		return this.canvas;
	},

	getCanvasContext: function() {
		return this.canvasContext;
	},

	getData: function() {
		return this.data;
	},
	
	setCollisionData: function(collisionData) {
		this.collisionData = collisionData;
	}
});

// type constants
Lucid.BaseLayer.TYPE = {
	UI: "ui", // ui (e.g. menu, inventory)
	TILESET: "tileSet", // tileSet grid with cols / rows
	COLLISION: "collision", // collision grid with cols / rows - there can only be ONE of this type
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