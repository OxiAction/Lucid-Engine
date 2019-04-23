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
		this.checkSetComponentName("Lucid.LayerEntities");
		
		this._super(config);
		
		this.checkSetCamera();

		if (this.data) {
			for (var i = 0; i < this.data.length; ++i) {
				this.addEntity(this.data[i]);
			}
		}

		return true;
	},

	/**
	 * Adds an entity.
	 *
	 * @param      {Object}  data    The data
	 * @return     {Object}  Returns the created Entity on success or null.
	 */
	addEntity: function(data) {
		var fn; // entity function

		// check if componentName property is given
		if (!("componentName" in data)) {
			Lucid.Utils.error(this.componentName + " @ addEntity: trying to instanciate a new entity, but componentName property is missing in data!");
			return null;
		}
		
		// try to get function in window object
		fn = Lucid.Utils.stringToFunction(data.componentName);

		// error
		if (!fn) {
			Lucid.Utils.error(this.componentName + " @ addEntity: trying to instanciate a new entity with " + data.componentName + ", but function couldnt be found in window object!");
			return null;
		}

		// check if entity is unique
		var entity;
		for (var i = 0; i < this.entities.length; ++i) {
			entity = this.entities[i];
			if (entity.id == data.id) {
				Lucid.Utils.log(this.componentName + " @ addEntity: entity with id " + data.id + " already exists!");
				return null;
			}
		}

		// inject
		data.parentLayer = this;
		// instanciate entity! Apply the data object as config parameter
		entity = new fn(data);
		// start loading its assets
		entity.load();
		// add to entities render list
		this.entities.push(entity);

		return entity;
	},

	/**
	 * Removes an entity (by id).
	 *
	 * @param      {string}  id      The identifier
	 */
	removeEntity: function(id) {
		for (var i = 0; i < this.entities.length; ++i) {
			var entity = this.entities[i];
			if (entity.id == id) {
				this.entities.splice(i, 1);
				entity.destroy();
				entity = null;
				return;
			}
		}

		Lucid.Utils.log(this.componentName + " @ removeEntity: entity with id " + id + " doesnt exist!");
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
		if (!this.getActive()) {
			return;
		}

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
	 * Sets the active state. Delegates the state to all related Entities too!
	 *
	 * @param      {Boolean}  active  The value.
	 */
	setActive: function(active) {
		for (i = 0; i < this.entities.length; ++i) {
			this.entities[i].setActive(active);
		}

		this._super(active);
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
	}
});