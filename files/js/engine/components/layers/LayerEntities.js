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
				// check if name property is given AND also check if theres a variable / object defined with this name
				if ("name" in data && window[data.name]) {
					// instanciate entity! Apply the data object as config parameter
					var entity = new window[data.name](data);
					// start loading its assets
					entity.load();
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
	 * The renderUpdate() function should simulate anything that is affected by time.
	 * It can be called zero or more times per frame depending on the frame
	 * rate.
	 *
	 * @param      {Number}  delta   The amount of time in milliseconds to
	 *                               simulate in the update.
	 */
	renderUpdate: function(delta) {
		var entity;
		var i;
		var collisionEntities = [];
		for (i = 0; i < this.entities.length; ++i) {
			entity = this.entities[i];
			// only check valid entities, which are also inside the viewport
			if (
				entity.colliding &&
				entity.render &&
				entity.x + entity.width >= this.camera.x &&
				entity.x <= this.camera.x + this.camera.width &&
				entity.y + entity.height >= this.camera.y &&
				entity.y <= this.camera.y + this.camera.height
				) {
				collisionEntities.push(entity);
			}
		}
		var j = 0;
		for (i = 0; i < this.entities.length; ++i) {
			entity = this.entities[i];

			// rendering enabled?
			if (entity.render) {
				// collision enabled?
				if (entity.colliding) {
					for (j = 0; j < collisionEntities.length; ++j) {
						var collisionEntity = collisionEntities[j];

						// only collide moving objects AND
						// only check collision against other entities
						if (!entity.moved || entity === collisionEntity) {
							continue;
						}
						entity.checkHandleCollision(entity, collisionEntity);
					}
				}

				entity.renderUpdate(delta);
			}
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