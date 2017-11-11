/**
* Engine2D default Layer.
*/
var Layer = BaseComponent.extend({
	// config variables and their default values
	z: 0, // z-index!
	id: null,
	map: null,
	image: null,
	type: null,
	data: null,
	effects: null, // effects
	render: true, // determines if the content is rendered
	persistent: false, // determines if this layer will be auto deleted by the Engine2D

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
		/*
		if (this.map == null 	||
			this.image == null 	||
			this.type == null	||
			this.data == null) {
			EngineUtils.error("Layer @ init: map, image, type or data is null");
			return;
		}
		*/

		if (this.id == null, this.type == null) {
			EngineUtils.error("Layer @ init: id or type is null - please asign an id and Layer.TYPE.XXX!");
			return;
		}

		this.canvas = document.createElement("canvas");
		this.canvasContext = this.canvas.getContext("2d");

		return true;
	},


	/**
	 * Draws a Canvas. TODO: More documentation.
	 *
	 * @param      {Object}  config  The configuration
	 * @return     {Canvas}  Returns the drawn Canvas.
	 */
	draw: function(config) {
		// if there is NO map reference, its probably a custom Layer
		// and in this case, the draw function should be overriden
		// with custom draw logic
		var map = this.map; // variable caching -> performance inc.
		if (!map) {
			EngineUtils.log("Layer @ draw: map is not defined");
			return null;
		}

		var camera = this.map.getCamera(); // variable caching -> performance inc.
		if (!camera) {
			EngineUtils.log("Layer @ draw: camera is not defined");
			return null;
		}

		if (!this.data) {
			EngineUtils.log("Layer @ draw: data is not defined");
			return null;
		}

		if (!this.image) {
			EngineUtils.log("Layer @ draw: image is not defined");
			return null;
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

		var startCol = Math.floor(camera.x / tileSize);
		var endCol = Math.min(cols - 1, (startCol + cameraWidth / tileSize) + 1);

		var startRow = Math.floor(camera.y / tileSize);
		var endRow = Math.min(rows - 1, (startRow + cameraHeight / tileSize) + 1);

		var offsetX = -camera.x + startCol * tileSize;
		var offsetY = -camera.y + startRow * tileSize;

		for (var col = startCol; col <= endCol; ++col) {
			for (var row = startRow; row <= endRow; ++row) {

				
				var x = Math.round((col - startCol) * tileSize + offsetX);// 100;
				var y = Math.round((row - startRow) * tileSize + offsetY);

				if (x >= -camera.x && y >= -camera.y) {
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
		EngineUtils.log("Layer @ destory: destroying Layer with id: " + this.id);

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

// forms setup for the editor
Layer.FORMS = {
	id: "string",
	type: "string"
};