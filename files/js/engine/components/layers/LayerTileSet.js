/**
 * Engine default LayerTileSet.
 * Extends the BaseLayer.
 */
Lucid.LayerTileSet = Lucid.BaseLayer.extend({
	// config variables and their default values
	// ...

	// local variables
	// ...

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
		this.componentName = "LayerTileSet";
		
		this._super(config);

		return true;
	},

	/**
	 * Draws a Canvas.
	 *
	 * @param      {number}  delta   The delta.
	 * @param      {Object}  config  The configuration.
	 * @return     {Canvas}  Returns the drawn Canvas.
	 */
	draw: function(delta, config) {
		
		if (!this.isValid()) {
			return this.canvas;
		}

		var map = this.map;
		var camera = this.camera;

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

		// ...

		return this.canvas;
	},

	resize: function(config) {
		this._super(config);
	},

	/**
	 * Destroys the Layer and all its corresponding objects.
	 *
	 * @return     {boolean}  Returns true on success.
	 */
	destroy: function() {
		return this._super();
	}
});