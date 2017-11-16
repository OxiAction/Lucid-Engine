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
			return this.canvas; // TODO: shouldnt this be null? Because we are not clearRect-ing.
		}

		var map = this.map;
		var tileSet = map.getTileSet();

		if (!tileSet) {
			return this.canvas;
		}

		var camera = this.camera;
		var cameraWidth = camera.width;
		var cameraHeight = camera.height;

		// if we dont parseInt we could have floating numbers for pixel positions - which is not good :D
		var cameraPositionX = parseInt(camera.positionX);
		var cameraPositionY = parseInt(camera.positionY);

		var canvasContext = this.canvasContext;
		canvasContext.width = cameraWidth;
		canvasContext.height = cameraHeight;
		canvasContext.clearRect(0, 0, cameraWidth, cameraHeight);
		
		var cols = map.cols;
		var rows = map.rows;
		var tileSize = map.tileSize;

		var deltaX = Math.floor(cameraPositionX / tileSize);
		var startCol = Math.max(0, deltaX);
		var endCol = Math.min(cols - 1, (cameraWidth / tileSize) + (deltaX + 1));

		var deltaY = Math.floor(cameraPositionY / tileSize);
		var startRow = Math.max(0, deltaY);
		var endRow = Math.min(rows - 1, (cameraHeight / tileSize) + (deltaY + 1)); // + 1 is need because we used Math.floor for delta!

		for (var column = startCol; column <= endCol; ++column) {
			for (var row = startRow; row <= endRow; ++row) {

				var tileNumber = this.data[row][column];

				// zero => empty tile
				if (tileNumber !== 0) {
					canvasContext.drawImage(
						tileSet, // the tileSet image
						(tileNumber - 1) * tileSize, // source x
						0, // source y
						tileSize, // source width
						tileSize, // source height
						column * tileSize - cameraPositionX,  // target x
						row * tileSize - cameraPositionY, // target y
						tileSize, // target width
						tileSize // target height
					);
				}
			}
		}
		
		/*
		// legacy algorithm:

		var camera = this.camera;
		var cameraWidth = camera.width;
		var cameraHeight = camera.height;

		var canvasContext = this.canvasContext;
		canvasContext.width = cameraWidth;
		canvasContext.height = cameraHeight;
		canvasContext.clearRect(0, 0, cameraWidth, cameraHeight);
		
		var cols = map.cols;
		var rows = map.rows;
		var tileSize = map.tileSize;

		var startCol = Math.floor(camera.positionX / tileSize);
		var endCol = Math.min(cols - 1, (startCol + cameraWidth / tileSize) + 1);

		var startRow = Math.floor(camera.positionY / tileSize);
		var endRow = Math.min(rows - 1, (startRow + cameraHeight / tileSize) + 1);

		var offsetX = -camera.positionX + startCol * tileSize;
		var offsetY = -camera.positionY + startRow * tileSize;

		for (var col = startCol; col <= endCol; ++col) {
			for (var row = startRow; row <= endRow; ++row) {

				
				var x = Math.round((col - startCol) * tileSize + offsetX);// 100;
				var y = Math.round((row - startRow) * tileSize + offsetY);

				if (x >= -camera.positionX && y >= -camera.positionY) {
					var tileIndex = row * cols + col;
					var tileType = this.getTile(tileIndex);

					if (tileType !== 0) { // 0 => empty tile
						canvasContext.drawImage(
							tileSet, // the tileSet image
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
		*/

		return this.canvas;
	},

	/**
	 * Resize.
	 *
	 * @param      {object}  config  The configuration.
	 */
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