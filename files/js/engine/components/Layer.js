/**
* Engine default Layer.
*/
Lucid.Layer = BaseComponent.extend({
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
		this.componentName = "Layer";
		
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
	 * Draws a Canvas. TODO: More documentation.
	 *
	 * @param      {number}  delta   The delta.
	 * @param      {Object}  config  The configuration
	 * @return     {Canvas}  Returns the drawn Canvas.
	 */
	draw: function(delta, config) {
		// if there is NO map reference, its probably a custom Layer
		// and in this case, the draw function should be overriden
		// with custom draw logic
		var map = this.map; // variable caching -> performance inc.
		if (!map) {
			// Lucid.Utils.log("Layer @ draw: map is not defined");
			return this.canvas;
		}

		var camera = this.map.getCamera(); // variable caching -> performance inc.
		if (!camera) {
			// Lucid.Utils.log("Layer @ draw: camera is not defined");
			return this.canvas;
		}

		if (!this.data) {
			// Lucid.Utils.log("Layer @ draw: data is not defined");
			return this.canvas;
		}

		if (!this.image) {
			// Lucid.Utils.log("Layer @ draw: image is not defined");
			return this.canvas;
		}

		var cameraWidth = camera.width;
		var cameraHeight = camera.height;

		var canvasContext = this.canvasContext;
		
		// draw stuff
		canvasContext.width = cameraWidth;
		canvasContext.height = cameraHeight;
		canvasContext.clearRect(0, 0, cameraWidth, cameraHeight);

		var cols = map.cols;
		var rows = map.rows;
		var tileSize = map.tileSize;

		var startCol = Math.floor(camera.position.x / tileSize);
		var endCol = Math.min(cols - 1, (startCol + cameraWidth / tileSize) + 1);

		var startRow = Math.floor(camera.position.y / tileSize);
		var endRow = Math.min(rows - 1, (startRow + cameraHeight / tileSize) + 1);

		var offsetX = -camera.position.x + startCol * tileSize;
		var offsetY = -camera.position.y + startRow * tileSize;

		for (var col = startCol; col <= endCol; ++col) {
			for (var row = startRow; row <= endRow; ++row) {

				
				var x = Math.round((col - startCol) * tileSize + offsetX);// 100;
				var y = Math.round((row - startRow) * tileSize + offsetY);

				if (x >= -camera.position.x && y >= -camera.position.y) {
					var tileIndex = row * cols + col;
					var tileType = this.getTile(tileIndex);

					if (tileType !== 0) { // 0 => empty tile
						canvasContext.drawImage(
							this.image, // image
							(tileType - 1) * tileSize, // source x
							0, // source y
							tileSize, // source width
							tileSize, // source height
							x,  // target x
							y, // target y
							tileSize, // target width
							tileSize // target height
						);
					}
				}
			}
		}

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
		if (this.type != Lucid.Layer.TYPE.COLLISION) {
			return null;
		}

		return null;
	}
});

// type constants
Lucid.Layer.TYPE = {
	MENU: "menu", // menus
	UI: "ui", // ui
	GRAPHICAL: "graphical", // precise graphics rendering
	COLLISION: "collision", // invisible collision layer
	OBJECTS: "objects" // objects (e.g. invisible triggers)
};

// forms setup for the editor
Lucid.Layer.FORMS = {
	id: "string",
	type: "string"
};