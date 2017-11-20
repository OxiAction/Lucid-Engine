/**
 * Engine default LayerCollision.
 * Extends the LayerTileSet.
 */
Lucid.LayerCollision = Lucid.LayerTileSet.extend({
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
		this.componentName = "LayerCollision";
		
		this._super(config);

		this.checkSetMap();
		this.checkSetCamera();

		return true;
	},

	/**
	 * Gets the grid indices by mouseX and mouseY.
	 *
	 * @param      {Number}  mouseX  The mouse x value.
	 * @param      {Number}  mouseY  The mouse y value.
	 * @return     {Array}   The valid grid indices OR null (e.g. if out of grid bounds).
	 */
	getGridIndicesByMouse: function(mouseX, mouseY) {
		var x = Math.floor((mouseX + this.camera.x) / this.map.tileSize)
		var y = Math.floor((mouseY + this.camera.y) / this.map.tileSize)
		
		// check bounds
		if (x < 0 ||
			x > this.map.cols - 1 ||
			y < 0 ||
			y > this.map.rows - 1) {
			return null;
		}
		return [x, y]
	},

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