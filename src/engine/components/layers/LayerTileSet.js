/**
 * Lucid Engine
 * Copyright (C) 2019 Michael Schreiber
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 * 
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

/**
 * Engine default LayerTileSet. Extends the BaseLayer.
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
		this.checkSetComponentName("Lucid.LayerTileSet");
		
		this._super(config);

		this.checkSetMap();
		this.checkSetCamera();
		this.checkSetEngine();

		return true;
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
		var asset = this.map.getAsset();
		if (!asset) {
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

				if (Lucid.Debug.getMapCollidingTiles()) {
					var layerCollision = this.engine.getLayerCollision();
					var layerCollisionData = layerCollision.getData();

					if (layerCollisionData[row][column]) {
						this.canvasContext.fillStyle = "red";
						this.canvasContext.fillRect(column * tileSize - this.camera.x, row * tileSize - this.camera.y, tileSize, tileSize);
						continue;
					}
				}

				// zero => empty tile
				if (tileNumber !== 0) {
					this.canvasContext.drawImage(
						asset,								// specifies the image, canvas, or video element to use
						(tileNumber - 1) * tileSize,		// the x coordinate where to start clipping
						0,									// the y coordinate where to start clipping
						tileSize,							// the width of the clipped image
						tileSize,							// the height of the clipped image
						column * tileSize - this.camera.x,	// the x coordinate where to place the image on the canvas
						row * tileSize - this.camera.y,		// the y coordinate where to place the image on the canvas
						tileSize,							// the width of the image to use (stretch or reduce the image)
						tileSize							// the height of the image to use (stretch or reduce the image)
					);
				}
			}
		}
	}
});