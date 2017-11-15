/**
 * Engine default LayerEntities.
 * Extends the BaseLayer.
 */
Lucid.LayerEntities = Lucid.BaseLayer.extend({
	// config variables and their default values
	// ...

	// local variables
	entities: [],

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
		this.componentName = "LayerEntities";
		
		this._super(config);

		if (this.data) {
			for (var i = 0; i < this.data.length; ++i) {
				var data = this.data[i];
				// check if name property is given AND also check if theres a variable / object defined with this name
				if ("name" in data && window[data.name]) {

					// inject
					data.camera = this.camera;

					// instanciate entity! Apply the data object as config parameter
					var entity = new window[data.name](data);
					// start loading its assets
					entity.loadTileSet();
					// add to our entities render list
					this.entities.push(entity);
				}
				// error reporting
				else {
					if (!("name" in data)) {
						Lucid.Utils.error("LayerEntities @ init: trying to instanciate a new entity but name property is missing in data[" + i + "]!");
					} else {
						Lucid.Utils.error("LayerEntities @ init: trying to instanciate a new entity but window[" + data.name + "] is not defined!");
					}
				}
			}
		}

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

		var camera = this.camera;

		var cameraWidth = camera.width;
		var cameraHeight = camera.height;

		var canvasContext = this.canvasContext;

		canvasContext.width = cameraWidth;
		canvasContext.height = cameraHeight;
		canvasContext.clearRect(0, 0, cameraWidth, cameraHeight);

		var canvas;
		var entity;
		for (var i = 0; i < this.entities.length; ++i) {
			entity = this.entities[i];
			if (entity.render) {
				entity.draw(delta, config);
				canvas = entity.getCanvas();
				if (canvas != null) {
					this.canvasContext.drawImage(canvas, 0, 0);
				}
			}
		}

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