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
	  * @return     {Boolean}  Returns true on success.
	  */
	init: function(config) {
		this.componentName = "LayerTileSet";
		
		this._super(config);

		this.checkSetMap();
		this.checkSetCamera();

		return true;
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
		var tileSet = this.map.getTileSet();
		if (!tileSet) {
			return;
		}

		this.canvasContext.width = this.camera.width;
		this.canvasContext.height = this.camera.height;
		this.canvasContext.clearRect(0, 0, this.camera.width, this.camera.height);
		
		var tileSize = this.map.tileSize;

		var deltaX = Math.floor(this.camera.x / tileSize);
		var startCol = Math.max(0, deltaX);
		var endCol = Math.min(this.map.cols - 1, Math.floor(this.camera.width / tileSize) + (deltaX + 1));

		var deltaY = Math.floor(this.camera.y / tileSize);
		var startRow = Math.max(0, deltaY);
		var endRow = Math.min(this.map.rows - 1, Math.floor(this.camera.height / tileSize) + (deltaY + 1));

		for (var column = startCol; column <= endCol; ++column) {
			for (var row = startRow; row <= endRow; ++row) {

				var tileNumber = this.data[row][column];

				// zero => empty tile
				if (tileNumber !== 0) {
					this.canvasContext.drawImage(
						tileSet, // the tileSet image
						(tileNumber - 1) * tileSize, // source x
						0, // source y
						tileSize, // source width
						tileSize, // source height
						column * tileSize - this.camera.x,  // target x
						row * tileSize - this.camera.y, // target y
						tileSize, // target width
						tileSize // target height
					);
				}
			}
		}
	},

	/**
	 * Resize.
	 *
	 * @param      {Object}  config  The configuration.
	 */
	resize: function(config) {
		this._super(config);
	},

	/**
	 * Destroys the Layer and all its corresponding objects.
	 *
	 * @return     {Boolean}  Returns true on success.
	 */
	destroy: function() {
		return this._super();
	}
});