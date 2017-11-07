/**
* Engine2D default Layer.
*/
var Layer = BaseComponent.extend({
	// config variables and their default values
	effects: null, // effects
	display: false, // initial hide / show
	persistent: false, // determines if this layer will be auto deleted by the Engine2D
	layerContainer: "layer-container", // target HTML container ID for layers
	data: null, // holds data for tiles

	// local variables
	canvas: null, // canvas for rendering
	layerContainer: null, // container which will contain the canvas

	/**
	  * Automatically called when instantiated.
	  *
	  * @param      {Object}   config  The configuration.
	  * @return     {boolean}  Returns true on success.
	  */
	init: function(config) {
		this.componentName = "Layer";
		
		this._super(config);

		if (this.type == null) {
			EngineUtils.error("layer type is null");
			return;
		}

		// create canvas
		this.canvas = document.createElement("canvas");
		this.canvas.id = this.id;

		// get container for canvas
		this.layerContainer = document.getElementById(this.layerContainer);
		if (!this.layerContainer) {
			EngineUtils.error("layer layerContainer is null")
			return;
		}
		this.layerContainer.append(this.canvas);

		this.setDisplay(this.display);

		return true;
	},

	/**
	 * Sets the display state.
	 *
	 * @param      {boolean}  value   The value.
	 */
	setDisplay: function(value) {
		if (value) {
			this.display = true;
			this.canvas.style.display = "block";
		} else {
			display = false;
			this.canvas.style.display = "none";
		}
	},

	/**
	 * Gets the display state.
	 *
	 * @return     {boolean}  The display state.
	 */
	getDisplay: function() {
		return this.display;
	},

	/**
	 * Gets the canvas.
	 *
	 * @return     {Canvas}  The canvas.
	 */
	getCanvas: function() {
		return this.canvas;
	},

	/**
	 * Gets the persistent state.
	 *
	 * @return     {boolean}  The persistent state.
	 */
	getPersistent: function() {
		return this.persistent;
	},

	/**
	 * TODO: description
	 *
	 * @param      {object}  config  The configuration.
	 * @return     {Array}   Collected collision data.
	 */
	update: function(config) {
		var collisionData = null; // will be returned - this is used e.g. for collision blocks

		var viewportWidth = config.viewportWidth;
		var viewportHeight = config.viewportHeight;
		var halfViewportWidth = config.halfViewportWidth;
		var halfViewportHeight = config.halfViewportHeight;

		// calculations (only if layer is active)
		if (this.active) {
			// for collision layers we need to collect stuff from the viewport
			if (this.type == Layer.TYPE.COLLISION) {
				collisionData = [];


			}

			// drawings (only if layer is being displayed)
			if (this.display) {

			}
		}

		return collisionData;
	},

	/**
	 * Destroys the Layer and all its corresponding objects.
	 *
	 * @return     {boolean}  Returns true on success.
	 */
	destroy: function() {
		EngineUtils.log("destroying layer with id: " + this.id);

		this.layerContainer.removeChild(this.canvas);
		this.canvas = null;

		return true;
	}
});

// type constants
Layer.TYPE = {
	MENU: "menu", // menus
	UI: "ui", // ui
	GRAPHICAL: "graphical", // precise graphics rendering
	COLLISION: "collision", // invisible collision layer
	OBJECTS: "objects" // objects (e.g. invisible triggers)
};