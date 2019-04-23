// namespace
var Game = Game || {};

/**
* Game custom entities information Layer - extends Layer.
*/
Game.LayerEntitiesInformation = Lucid.BaseLayer.extend({
	// config variables and their default values
	// ...

	// local variables
	barHealthWidth: 50,
	barHealthHeight: 8,
	barManaWidth: 40,
	barManaHeight: 4,

	/**
	 * Automatically called when instantiated.
	 *
	 * @param      {Object}   config  The configuration.
	 * @return     {boolean}  Returns true on success.
	 */
	init: function(config) {
		this.componentName = "Game.LayerEntitiesInformation";

		this._super(config);

		this.checkSetCamera();
		this.checkSetEngine();

		return true;
	},

	/**
	 * The renderUpdate() function should simulate anything that is affected by
	 * time. It can be called zero or more times per frame depending on the
	 * frame rate.
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
		if (!this.getActive()) {
			// clear everything
			this.canvasContext.clearRect(0, 0, this.camera.width, this.camera.height);
			return;
		}

		var canvasContext = this.canvasContext;

		var width = this.camera.width;
		var height = this.camera.height;

		canvasContext.width = width;
		canvasContext.height = height;
		canvasContext.clearRect(0, 0, width, height);

		var layerEntities = this.engine.getLayerEntities();

		if (!layerEntities) {
			return;
		}

		var entities = layerEntities.getEntities();

		for (var i = 0; i < entities.length; ++i) {
			var targetEntity = entities[i];

			if (targetEntity.showInformation) {
				canvasContext.strokeStyle = "black";
				canvasContext.lineWidth = 1;

				var healthPercent 			= (targetEntity.healthPointsCurrent / targetEntity.healthPointsMaximum);
				var barHealthActualWidth 	= this.barHealthWidth * healthPercent;
				var barManaActualWidth 		= this.barManaWidth * (targetEntity.manaPointsCurrent / targetEntity.manaPointsMaximum);

				var x 		= targetEntity.relativeCenterX + 0.5 - this.barHealthWidth / 2;
				var healthY = targetEntity.relativeCenterY + 0.5 - targetEntity.halfHeight - this.barHealthHeight - this.barManaHeight;
				var manaY 	= targetEntity.relativeCenterY + 0.5 - targetEntity.halfHeight - this.barManaHeight;

				// health background
				if (healthPercent >= 0.80) {
					canvasContext.fillStyle = "#fff333";
				} else if (healthPercent >= 0.60) {
					canvasContext.fillStyle = "#ffc733";
				} else if (healthPercent >= 0.30) {
					canvasContext.fillStyle = "#ffa233";
				} else {
					canvasContext.fillStyle = "#ff5833";
				}

				canvasContext.fillRect(x, healthY, this.barHealthWidth, this.barHealthHeight);
				// health actual
				canvasContext.fillStyle = "#33ff33";
				canvasContext.fillRect(x, healthY, barHealthActualWidth, this.barHealthHeight);
				// health stroke
				canvasContext.strokeRect(x, healthY, this.barHealthWidth, this.barHealthHeight);

				// mana background
				canvasContext.fillStyle = "#ffffff";
				canvasContext.fillRect(x, manaY, this.barManaWidth, this.barManaHeight);
				// mana actual
				canvasContext.fillStyle = "#33a8ff";
				canvasContext.fillRect(x, manaY, barManaActualWidth, this.barManaHeight);
				// mana stroke
				canvasContext.strokeRect(x, manaY, this.barManaWidth, this.barManaHeight);
			}
		}
	}
});