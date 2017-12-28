/**
 * Engine default BaseEntity. This Component is Layer related and represented by
 * the Layer.data value(s).
 */
Lucid.BaseEntity = Lucid.BaseComponent.extend({
	// config variables and their default values
	x: 0, // current x position
	y: 0, // current y position

	relativeX: 0, // pre-calculated relative x (anchor: top left)
	relativeY: 0, // pre-calculated relative y (anchor: top left)

	relativeCenterX: 0, // pre-calculated relative center x (anchor: top left + width / 2)
	relativeCenterY: 0, // pre-calculated relative center y (anchor: top left + height / 2)

	width: 0, // entity width
	height: 0, // entity height

	halfWidth: 0, // pre-calculated half width (width / 2)
	halfHeight: 0, // pre-calculated half height (height / 2)

	sightRadius: 300, // sight radius in pixels

	healthCurrent: 100, // current health
	healthMin: 0, // minimum health - curent < minimum -> Lucid.Entity.STATE.DEAD
	healthMax: 100, // maximum health

	

	assetFilePath: null, // full path to an asset

	assetX: 0, // asset position X
	assetY: 0, // asset position Y

	name: "Unknown", // name
	speed: 1, // movement speed of the entity
	vulnerable: true, // if set to false entity is immortal (cant loose any health / die)
	render: true, // determines if the content is rendered
	colliding: true, // does it collide with collisionData?
	skipFirstPathSegment: true, // splices first path segment -> smoother animations
	snapToGrid: true, // snaps the entity to the center of the nearest grid tile

	// local variables
	asset: null, // the loaded image for layers
	loaded: false, // determines if map has loaded everything

	canvas: null,
	canvasContext: null,

	moved: false, // required for collision detection

	path: null, // if theres a path array defined the entity will walk node by node
				// until it reaches the end node of the path

	dir: null, // the direction of the entity - e.g. Lucid.BaseEntity.DIR.LEFT means
			   // entity is heading towards left
	dirTemp: null, // temp direction holder - this is for the "flickering" bugfix
	dirTimeout: null, // timeout which sets the dir - this is for the "flickering" bugfix

	moveDirections: {},

	gravityXStep: 0, // the gravity force on the x-axis (can be both: negative and positive floats)
	gravityYStep: 0, // the gravity force on the y-axis (can be both: negative and positive floats)
	gravityXAccelerationStep: 0, // private - the current step x
	gravityYAccelerationStep: 0, // private - the current step y

	accelerationUpStep: 0.1, // for speed-up
	accelerationDownStep: 0.2, // for breaking
	accelerationMax: 1, // maximum for acceleration - this shouldnt be higher than 1!
	accelerationX: 0, // current acceleration on x-axis
	accelerationY: 0, // current acceleration on y-axis

	pathDirectionX:  null, // the current path direction on x-axis
	pathDirectionY: null, // the current path direction on y-axis

	/**
	 * Automatically called when instantiated.
	 *
	 * @param      {Object}   config  The configuration.
	 * @return     {Boolean}  Returns true on success.
	 */
	init: function(config) {
		this._super(config);

		this.checkSetMap();
		this.checkSetEngine();
		this.checkSetCamera();

		this.updateAllCoordinatesAndSizes();

		this.canvas = document.createElement("canvas");
		this.canvasContext = this.canvas.getContext("2d");

		if (!this.dir) {
			this.dir = Lucid.BaseEntity.DIR.DOWN;
		}

		if (this.snapToGrid) {
			var entityGridIndices = Lucid.Math.getEntityToGridIndices(this, this.map.tileSize);
			this.x = Math.round(entityGridIndices[0] * this.map.tileSize + (this.map.tileSize / 2) - this.halfWidth);
			this.y = Math.round(entityGridIndices[1] * this.map.tileSize + (this.map.tileSize / 2) - this.halfHeight);
		}

		// events for loading the asset
		Lucid.Event.bind(Lucid.BaseEntity.EVENT.LOADED_ASSET_FILE_SUCCESS + this.componentNamespace, this.assetLoadingSuccess.bind(this));
		Lucid.Event.bind(Lucid.BaseEntity.EVENT.LOADED_ASSET_FILE_ERROR + this.componentNamespace, this.assetLoadingError.bind(this));

		return true;
	},

	/**
	 * Start loading.
	 */
	load: function() {
		Lucid.Utils.log("BaseEntity @ load: starting to load in BaseEntity with name: " + this.name);
		this.loadAsset();
	},

	/**
	 * General loading success.
	 */
	loadingSuccess: function() {
		Lucid.Utils.log("BaseEntity @ loadingSuccess: loaded everything in BaseEntity with name: " + this.name);
		this.loaded = true;
		Lucid.Event.trigger(Lucid.BaseEntity.EVENT.LOADING_SUCCESS, this);
	},

	/**
	 * General loading error.
	 */
	loadingError: function() {
		Lucid.Utils.log("BaseEntity @ loadingError: ERROR occurred while loading in BaseEntity with name: " + this.name);
		this.loaded = false;
		Lucid.Event.trigger(Lucid.BaseEntity.EVENT.LOADING_ERROR, this);
	},

	/**
	 * Loads the asset.
	 */
	loadAsset: function() {
		Lucid.Utils.log("BaseEntity @ loadAsset: " + this.name + " - loading asset");

		var loaderItem = new Lucid.LoaderItem({
			id: this.assetFilePath,
			dataType: Lucid.Loader.TYPE.IMAGE,
			filePath: this.assetFilePath,
			eventSuccessName: Lucid.BaseEntity.EVENT.LOADED_ASSET_FILE_SUCCESS + this.componentNamespace,
			eventErrorName: Lucid.BaseEntity.EVENT.LOADED_ASSET_FILE_ERROR + this.componentNamespace
		});
		
		Lucid.Loader.add(loaderItem);
	},

	/**
	 * Asset loading success.
	 *
	 * @param      {String}      eventName   The event.
	 * @param      {LoaderItem}  loaderItem  The loader item.
	 */
	assetLoadingSuccess: function(eventName, loaderItem) {
		this.asset = loaderItem.getData();

		this.loadingSuccess();
	},

	/**
	 * Asset loading error.
	 *
	 * @param      {String}      eventName   The event.
	 * @param      {LoaderItem}  loaderItem  The loader item.
	 */
	assetLoadingError: function(eventName, loaderItem) {
		this.asset = null;

		this.loadingError();
	},

	/**
	 * Gets the asset.
	 *
	 * @return     {Object}  The asset.
	 */
	getAsset: function() {
		return this.asset;
	},

	/**
	 * Sets the asset.
	 *
	 * @param      {Object}  asset   The asset.
	 */
	setAsset: function(asset) {
		this.asset = asset;
	},

	/**
	 * Sets the path directions.
	 *
	 * @param      {Array}  path    The path
	 */
	setPathDirections: function(path) {
		var currNode = path[0];

		if (currNode) {
			var targetX = Math.round(currNode.x * this.map.tileSize + (this.map.tileSize / 2) - this.halfWidth);
			var targetY = Math.round(currNode.y * this.map.tileSize + (this.map.tileSize / 2) - this.halfHeight);

			if (targetX < this.x) {
				this.pathDirectionX = Lucid.BaseEntity.DIR.LEFT;
			} else if (targetX > this.x) {
				this.pathDirectionX = Lucid.BaseEntity.DIR.RIGHT;
			} else {
				this.pathDirectionX = null;
			}

			if (targetY < this.y) {
				this.pathDirectionY = Lucid.BaseEntity.DIR.UP;
			} else if (targetY > this.y) {
				this.pathDirectionY = Lucid.BaseEntity.DIR.DOWN;
			} else {
				this.pathDirectionY = null;
			}
		}
	},

	/**
	 * TODO: desc
	 *
	 * @param      {Number}  delta   The delta.
	 */
	renderUpdate: function(delta) {

		var lastX = this.x;
		var lastY = this.y;

	// PATH - handle path related move direction commands (if defined)

		var tileSize = this.map.tileSize;

		if (this.path) {
			if (this.path[0] === undefined) {
				this.path = null;
				
			} else {
				var currNode = this.path[0];

				var targetX = Math.round(currNode.x * tileSize + (tileSize / 2) - this.halfWidth);
				var targetY = Math.round(currNode.y * tileSize + (tileSize / 2) - this.halfHeight);

				var targetXReached = this.pathDirectionX == null ||
							(this.pathDirectionX == Lucid.BaseEntity.DIR.RIGHT && Math.round(this.x) >= targetX) ||
							(this.pathDirectionX == Lucid.BaseEntity.DIR.LEFT && Math.round(this.x) <= targetX);

				var targetYReached = this.pathDirectionY == null ||
							(this.pathDirectionY == Lucid.BaseEntity.DIR.DOWN && Math.round(this.y) >= targetY) ||
							(this.pathDirectionY == Lucid.BaseEntity.DIR.UP && Math.round(this.y) <= targetY);

				if (targetXReached && targetYReached) {
					this.path.splice(0,1);

					this.setPathDirections(this.path);
					
					this.moveDirections = {};
				} else {
					var currPathOffsetX = this.accelerationX * delta * this.speed / this.accelerationUpStep;
					var currPathOffsetY = this.accelerationY * delta * this.speed / this.accelerationUpStep;

					var nextNode = this.path[1];

					if (nextNode) {
						if (this.moveDirections[Lucid.BaseEntity.DIR.RIGHT] && nextNode.x > currNode.x) {
							currPathOffsetX = 0;
						} else if (this.moveDirections[Lucid.BaseEntity.DIR.LEFT] && nextNode.x < currNode.x) {
							currPathOffsetX = 0;
						}

						if (this.moveDirections[Lucid.BaseEntity.DIR.DOWN] && nextNode.y > currNode.y) {
							currPathOffsetY = 0;
						} else if (this.moveDirections[Lucid.BaseEntity.DIR.UP] && nextNode.y < currNode.y) {
							currPathOffsetY = 0;
						}
					}

					this.moveDirections = {};

					if (!targetXReached) {
						if (this.pathDirectionX == Lucid.BaseEntity.DIR.RIGHT && this.x < targetX - currPathOffsetX) {
							this.moveDirections[Lucid.BaseEntity.DIR.RIGHT] = true;
						}

						if (this.pathDirectionX == Lucid.BaseEntity.DIR.LEFT && this.x > targetX - currPathOffsetX) {
							this.moveDirections[Lucid.BaseEntity.DIR.LEFT] = true;
						}
					}

					if (!targetYReached) {
						if (this.pathDirectionY == Lucid.BaseEntity.DIR.DOWN && this.y < targetY - currPathOffsetY) {
							this.moveDirections[Lucid.BaseEntity.DIR.DOWN] = true;
						}

						if (this.pathDirectionY == Lucid.BaseEntity.DIR.UP && this.y > targetY - currPathOffsetY) {
							this.moveDirections[Lucid.BaseEntity.DIR.UP] = true;
						}
					}
				}
			}
		}

	// MOVEMENT - handling basic movement and acceleration and gravity

		var movementX = false;

		if (this.moveDirections[Lucid.BaseEntity.DIR.RIGHT]) {
			movementX = true;
			this.accelerationX = Math.min(this.accelerationMax, this.accelerationX + this.accelerationUpStep);
		}


		if (this.moveDirections[Lucid.BaseEntity.DIR.LEFT]) {
			movementX = true;
			this.accelerationX = Math.max(-this.accelerationMax, this.accelerationX - this.accelerationUpStep);
		}

		if (!movementX && this.accelerationX != 0) {
			if (this.accelerationX < 0) {
				this.accelerationX = Math.min(0, this.accelerationX + this.accelerationDownStep);
			} else {
				this.accelerationX = Math.max(0, this.accelerationX - this.accelerationDownStep);
			}
		}

		var movementY = false;

		if (this.moveDirections[Lucid.BaseEntity.DIR.DOWN]) {
			movementY = true;
			this.accelerationY = Math.min(this.accelerationMax, this.accelerationY + this.accelerationUpStep);
		}


		if (this.moveDirections[Lucid.BaseEntity.DIR.UP]) {
			movementY = true;
			this.accelerationY = Math.max(-this.accelerationMax, this.accelerationY - this.accelerationUpStep);
		}

		if (!movementY && this.accelerationY != 0) {
			if (this.accelerationY < 0) {
				this.accelerationY = Math.min(0, this.accelerationY + this.accelerationDownStep);
			} else {
				this.accelerationY = Math.max(0, this.accelerationY - this.accelerationDownStep);
			}
		}

		// increase gravity step
		this.gravityXAccelerationStep++;
		this.gravityYAccelerationStep++;

		// the new target x / y
		var newX = this.x + this.accelerationX * delta * this.speed + this.gravityXStep * this.gravityXAccelerationStep;
		var newY = this.y + this.accelerationY * delta * this.speed + this.gravityYStep * this.gravityYAccelerationStep;

	// COLLISION - checking entity vs entity && entity vs grid

		if (this.colliding) {

			// This is a common problem for hit detection: if the difference
			// between the new and the old position is too large, objects can
			// clip THROUGH collision objects. So we split this up and calculate
			// step by step.
			//
			// @type       {Number}
			//
			var updateSteps = 1 + Math.round(Math.max(Math.abs(newX - lastX), Math.abs(newY - lastY)));

			var updateStepX = (newX - lastX) / updateSteps;
			var updateStepY = (newY - lastY) / updateSteps;

			var collisionX = false;
			var collisionY = false;

			newX = lastX;
			newY = lastY;

			UpdateSteps:
			for (var j = 0; j < updateSteps; ++j) {
				// if both - x and y-axis - collided -> stop!
				if (collisionX && collisionY) {
					break UpdateSteps;
				}

				// as long as the x-axis doesnt collide increment it
				if (!collisionX) {
					newX += updateStepX;
				}

				// as long as the y-axis doesnt collide increment it
				if (!collisionY) {
					newY += updateStepY;
				}

			// ENTITY VS ENTITY

				var layerEntities = this.engine.getLayerEntities();
				if (layerEntities) {
					var entities = layerEntities.getEntities();

					if (entities) {
						for (var i = 0; i < entities.length; ++i) {
							var entity = entities[i];

							// dont collide against self AND only collide against entities with
							// the colliding property true
							if (entity != this && entity.colliding) {

								// gather collision data...
								var collisionData = Lucid.Math.getCollisionDataBoxVsBox({
									x: newX,
									y: newY,
									lastX: lastX,
									lastY: lastY,
									width: this.width,
									height: this.height
								}, entity);

								// ... and process it
								newX = collisionData.x;
								newY = collisionData.y;
								collisionX = collisionData.collisionX;
								collisionY = collisionData.collisionY;

								// trigger collision event
								if (collisionX || collisionY) {
									Lucid.Event.trigger(Lucid.BaseEntity.EVENT.COLLISION, entity, collisionData);
								}
							}
						}
					}
				}

			// ENTITY VS GRID

				var layerCollision = this.engine.getLayerCollision();
				if (layerCollision) {
					var data = layerCollision.getData();

					if (data) {
						var entityGridIndices = Lucid.Math.getEntityToGridIndices({
							x: newX - updateStepX,
							y: newY - updateStepY,
							width: this.width,
							height: this.height
						}, this.map.tileSize);
						var entityGridIndexX = entityGridIndices[0];
						var entityGridIndexY = entityGridIndices[1];

						/**
						 * Adjoining grid entries.
						 *
						 * @type       {Array}
						 */
						var collidingGridEntries = [];

						if (data[entityGridIndexY]) {
							// tile left
							if (data[entityGridIndexY][entityGridIndexX - 1] == 1) {
								collidingGridEntries.push([entityGridIndexX - 1, entityGridIndexY]);
							}
							// tile right
							if (data[entityGridIndexY][entityGridIndexX + 1] == 1) {
								collidingGridEntries.push([entityGridIndexX + 1, entityGridIndexY]);
							}
						}

						if (data[entityGridIndexY - 1]) {
							// tile up
							if (data[entityGridIndexY - 1][entityGridIndexX] == 1) {
								collidingGridEntries.push([entityGridIndexX, entityGridIndexY - 1]);
							}

							// tile up-left
							if (data[entityGridIndexY - 1][entityGridIndexX - 1] == 1) {
								collidingGridEntries.push([entityGridIndexX - 1, entityGridIndexY - 1]);
							}
							// tile up-right
							if (data[entityGridIndexY - 1][entityGridIndexX + 1] == 1) {
								collidingGridEntries.push([entityGridIndexX + 1, entityGridIndexY - 1]);
							}
						}

						if (data[entityGridIndexY + 1]) {
							// tile down
							if (data[entityGridIndexY + 1][entityGridIndexX] == 1) {
								collidingGridEntries.push([entityGridIndexX, entityGridIndexY + 1]);
							}

							// tile down-left
							if (data[entityGridIndexY + 1][entityGridIndexX - 1] == 1) {
								collidingGridEntries.push([entityGridIndexX - 1, entityGridIndexY + 1]);
							}
							// tile down-right
							if (data[entityGridIndexY + 1][entityGridIndexX + 1] == 1) {
								collidingGridEntries.push([entityGridIndexX + 1, entityGridIndexY + 1]);
							}
						}

						for (var i = 0; i < collidingGridEntries.length; ++i) {
							var collidingGridEntry = collidingGridEntries[i];

							// gather collision data...
							var collisionData = Lucid.Math.getCollisionDataBoxVsBox({
								x: newX,
								y: newY,
								lastX: lastX,
								lastY: lastY,
								width: this.width,
								height: this.height
							}, {
								x: collidingGridEntry[0] * tileSize,
								y: collidingGridEntry[1] * tileSize,
								width: tileSize,
								height: tileSize
							});

							// ... and process it
							newX = collisionData.x;
							newY = collisionData.y;
							collisionX = collisionData.collisionX;
							collisionY = collisionData.collisionY;

							// trigger collision event
							if (collisionX || collisionY) {
								Lucid.Event.trigger(Lucid.BaseEntity.EVENT.COLLISION, collidingGridEntry, collisionData);
							}
						}
					}
				}

			} // end for (updateSteps)

		} // end if (this.colliding)

	// GRAVITY

		// check if we had collision on x-axis - if so: reset gravity x acceleration!
		if (collisionX) {
			this.gravityXAccelerationStep = 0;
		}

		// check if we had collision on y-axis - if so: reset gravity y acceleration!
		if (collisionY) {
			this.gravityYAccelerationStep = 0;
		}

	// UPDATE X / Y

		if (this.x != newX || this.y != newY) {
			this.moved = true;

			var newDir = null;
			if (this.x < newX) {
				newDir = Lucid.BaseEntity.DIR.RIGHT;
				
			} else if (this.x > newX) {
				newDir = Lucid.BaseEntity.DIR.LEFT;
			}

			if (this.y < newY) {
				newDir = Lucid.BaseEntity.DIR.DOWN;
				
			} else if (this.y > newY) {
				newDir = Lucid.BaseEntity.DIR.UP;
			}

			// prevent too fast direction changes (which results in "flickering" animations)

				if (this.dirTemp != newDir) {
					clearTimeout(this.dirTimeout);
				}

				this.dirTemp = newDir;
				this.dirTimeout = setTimeout(function() {
					this.dir = newDir;
				}.bind(this), 50);

			// end "flickering" fix

			this.x = newX;
			this.y = newY;
		} else {
			this.moved = false;
		}

		this.setX(newX);
		this.setY(newY);
	},

	move: function(dir, move) {
		this.setPath(null);
		this.moveDirections[dir] = move;
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

		if (!this.loaded) {
			return;
		}

		var canvasContext = this.canvasContext;
		var relativeX = this.relativeX;//Math.floor(this.x - this.camera.x);
		var relativeY = this.relativeY;//Math.floor(this.y - this.camera.y);
		canvasContext.drawImage(
			this.asset,		// specifies the image, canvas, or video element to use
			this.assetX,	// the x coordinate where to start clipping
			this.assetY,	// the y coordinate where to start clipping
			this.width,		// the width of the clipped image
			this.height,	// the height of the clipped image
			relativeX,	// the x coordinate where to place the image on the canvas
			relativeY,	// the y coordinate where to place the image on the canvas
			this.width,		// the width of the image to use (stretch or reduce the image)
			this.height		// the height of the image to use (stretch or reduce the image)
		);
		relativeX += 0.5;
		relativeY += 0.5;
		canvasContext.strokeStyle = "red";
		canvasContext.lineWidth = 1;
		canvasContext.beginPath();
		canvasContext.moveTo(relativeX, relativeY);
		canvasContext.lineTo(relativeX + this.width - 1, relativeY);
		canvasContext.lineTo(relativeX + this.width - 1, relativeY + this.height - 1);
		canvasContext.lineTo(relativeX, relativeY + this.height - 1);
		canvasContext.lineTo(relativeX, relativeY - 0.5);
		canvasContext.stroke();
	},

	/**
	 * Gets the canvas.
	 *
	 * @return     {Canvas}  The canvas.
	 */
	getCanvas: function() {
		return this.canvas;
	},

	/**
	 * Sets the path. If theres a path array defined the entity will walk node
	 * by node until it reaches the end node of the path.
	 *
	 * @param      {<type>}  path    The new Path or null if you want to cancel current Path.
	 */
	setPath: function(path) {
		if (path) {
			if (this.skipFirstPathSegment && path !== null && path.length > 1) {
				path.splice(0, 1);
			}

			this.setPathDirections(path);
			this.path = path;
		} else if (this.path) {
			this.path = null;
			this.moveDirections = {};
			this.pathDirectionX = null;
			this.pathDirectionY = null;
		}
	},
	
	/**
	 * Update stuff like halfWidth, reletativeX, relativeCenterX...
	 */
	updateAllCoordinatesAndSizes() {
		this.setX(this.x);
		this.setY(this.y);
		this.setWidth(this.width);
		this.setHeight(this.height);
	},

	/**
	 * Sets the x position.
	 *
	 * @param      {Number}  x       New x-position.
	 */
	setX(x) {
		this.x = x;
		this.updateRelativeX();
	},

	/**
	 * Sets the y position.
	 *
	 * @param      {Number}  y       New y-position.
	 */
	setY(y) {
		this.y = y;
		this.updateRelativeY();
	},

	/**
	 * Sets the width.
	 *
	 * @param      {Number}  width   New width.
	 */
	setWidth(width) {
		this.width = width;
		this.halfWidth = width / 2;
		this.updateRelativeX();
	},

	/**
	 * Sets the height.
	 *
	 * @param      {Number}  height  New height.
	 */
	setHeight(height) {
		this.height = height;
		this.halfHeight = height / 2;
		this.updateRelativeY();
	},

	/**
	 * Updates the relativeX and relativeCenterX based on x, halfWidth and camera.x.
	 */
	updateRelativeX() {
		this.relativeX = Math.floor(this.x - this.camera.x);
		this.relativeCenterX = this.relativeX + this.halfWidth; 
	},

	/**
	 * Updates the relativeY and relativeCenterY based on y, halfHeight and camera.y.
	 */
	updateRelativeY() {
		this.relativeY = Math.floor(this.y - this.camera.y);
		this.relativeCenterY = this.relativeY + this.halfHeight; 
	},

	/**
	 * Resize method. Usually called when the screen / browser dimensions have
	 * changed.
	 *
	 * @param      {Object}  config  The configuration which must contain the
	 *                               properties wWidth and wHeight.
	 */
	resize: function(config) {
		this.canvas.width = config.wWidth;
		this.canvas.height = config.wHeight;
	},

	/**
	 * Destroys the BaseEntity and all its corresponding objects.
	 *
	 * @return     {Boolean}  Returns true on success.
	 */
	destroy: function() {
		Lucid.Event.unbind(Lucid.BaseEntity.EVENT.LOADED_ASSET_FILE_SUCCESS + this.componentNamespace);
		Lucid.Event.unbind(Lucid.BaseEntity.EVENT.LOADED_ASSET_FILE_ERROR + this.componentNamespace);

		this.loaded = false;
	}
});

// forms setup for the editor
Lucid.BaseEntity.FORMS = {
	name: "string",
	x: "integer",
	y: "integer",
	colliding: "boolean",
	render: "boolean",
	snapToGrid: "boolean"
};

// event constants
Lucid.BaseEntity.EVENT = {
	LOADED_ASSET_FILE_SUCCESS: "BaseEntityLoadedAssetFileSuccess",
	LOADED_ASSET_FILE_ERROR: "BaseEntityLoadedAssetFileError",
	LOADING_SUCCESS: "BaseEntityLoadingSuccess",
	LOADING_ERROR: "BaseEntityLoadingError",
	COLLISION: "BaseEntityCollision"
};

// some states for entities
Lucid.BaseEntity.STATE = {
	IDLE: "idle",
	WALK: "walk",
	RUN: "run",
	ALIVE: "alive",
	DEAD: "dead",
	CROUCH: "crouch",
	JUMP: "jump",
	ATTACK: "attack",
	DEFEND: "defend",
	EMOTE: "emote"
};

Lucid.BaseEntity.DIR = {
	RIGHT: "right",
	LEFT: "left",
	UP: "up",
	DOWN: "down"
};