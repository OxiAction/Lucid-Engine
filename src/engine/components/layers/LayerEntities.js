/**
 * Engine default LayerEntities. Extends the BaseLayer.
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
	 * @return     {Boolean}  Returns true on success.
	 */
	init: function(config) {
		this.componentName = "LayerEntities";
		
		this._super(config);
		
		this.checkSetCamera();

		if (this.data) {
			for (var i = 0; i < this.data.length; ++i) {
				var data = this.data[i];
				// check if componentName property is given AND also check if theres a variable / object defined with this componentName
				if ("componentName" in data && window[data.componentName]) {
					this.addEntity(data);
				}
				// error reporting
				else {
					if (!("componentName" in data)) {
						Lucid.Utils.error("LayerEntities @ init: trying to instanciate a new entity but componentName property is missing in data[" + i + "]!");
					} else {
						Lucid.Utils.error("LayerEntities @ init: trying to instanciate a new entity but window[" + data.componentName + "] is not defined!");
					}
				}
			}
		}

		return true;
	},

	addEntity: function(data) {
		var entity;
		for (var i = 0; i < this.entities.length; ++i) {
			entity = this.entities[i];
			if (entity.getID() == data.id) {
				Lucid.Utils.log("LayerEntities @ addEntity: entity with id " + data.id + " already exists!");
				return;
			}
		}

		// instanciate entity! Apply the data object as config parameter
		entity = new window[data.componentName](data);
		// start loading its assets
		entity.load();
		// add to our entities render list
		this.entities.push(entity);
	},

	removeEntity: function(id) {
		for (var i = 0; i < this.entities.length; ++i) {
			var entity = this.entities[i];
			if (entity.getID() == id) {
				this.entities.splice(i, 1);
				entity.destroy();
				entity = null;
				return;
			}
		}

		Lucid.Utils.log("LayerEntities @ removeEntity: entity with id " + id + " doesnt exist!");
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
		var i = 0;
		
		// pre calculate all coordinates and sizes
		for (i = 0; i < this.entities.length; ++i) {
			this.entities[i].updateAllCoordinatesAndSizes();
		}

		// normal render update
		for (i = 0; i < this.entities.length; ++i) {
			this.entities[i].renderUpdate(delta);
		}
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
		this.canvasContext.width = this.camera.width;
		this.canvasContext.height = this.camera.height;
		this.canvasContext.clearRect(0, 0, this.camera.width, this.camera.height);
		
		var entity;
		var entityCanvas;
		for (var i = 0; i < this.entities.length; ++i) {
			entity = this.entities[i];
			if (entity.render) {
				entity.renderDraw(interpolationPercentage);
				entityCanvas = entity.getCanvas();
				if (entityCanvas) {
					this.canvasContext.drawImage(
						entityCanvas,	// specifies the image, canvas, or video element to use
						0,				// the x coordinate where to start clipping
						0				// the y coordinate where to start clipping
					);
				}
			}
		}
	},

	/**
	 * Gets the entities.
	 */
	getEntities: function() {
		return this.entities;
	},

	/**
	 * Gets a entity by id.
	 *
	 * @param      {String}  id      The identifier
	 * @return     {Entity}  The entity.
	 */
	getEntity: function(id) {
		var entity;
		for (var i = 0; i < this.entities.length; ++i) {
			entity = this.entities[i];
			if (entity.id == id) {
				return entity;
			}
		}
	},

	/**
	 * Resize method. Usually called when the screen / browser dimensions have
	 * changed.
	 *
	 * @param      {Object}  config  The configuration which must contain the
	 *                               properties wWidth and wHeight.
	 */
	resize: function(config) {
		var entity;
		for (var i = 0; i < this.entities.length; ++i) {
			entity = this.entities[i];
			entity.resize(config);
		}

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