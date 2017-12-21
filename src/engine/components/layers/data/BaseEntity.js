/**
 * Engine default BaseEntity. This Component is Layer related and represented by
 * the Layer.data value(s).
 */
Lucid.BaseEntity = Lucid.BaseComponent.extend({
	// config variables and their default values
	x: 0, // current x position
	y: 0, // current y position

	sightRadius: 300, // sight radius in pixels

	healthCurrent: 100, // current health
	healthMin: 0, // minimum health - curent < minimum -> Lucid.Entity.STATE.DEAD
	healthMax: 100, // maximum health

	width: 0,
	height: 0,

	assetFilePath: null,

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

	dir: null, // the direction of the entity - e.g. Lucid.BaseEntity.DIR.TOP means
			   // entity is heading towards top

	moveDirections: {},

	accelerationUpStep: 0.1, // for speed-up
	accelerationDownStep: 0.2, // for breaking
	accelerationMax: 1, // maximum for acceleration
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

		this.canvas = document.createElement("canvas");
		this.canvasContext = this.canvas.getContext("2d");

		if (!this.dir) {
			this.dir = Lucid.BaseEntity.DIR.DOWN;
		}

		if (this.snapToGrid) {
			var indices = this.getGridIndices();
			this.x = Math.round(indices[0] * this.map.tileSize + (this.map.tileSize / 2) - (this.width / 2));
			this.y = Math.round(indices[1] * this.map.tileSize + (this.map.tileSize / 2) - (this.height / 2));
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
			var targetX = Math.round(currNode.x * this.map.tileSize + (this.map.tileSize / 2) - (this.width / 2));
			var targetY = Math.round(currNode.y * this.map.tileSize + (this.map.tileSize / 2) - (this.height / 2));

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
	 * { function_description }
	 *
	 * @param      {number}  delta   The delta
	 */
	renderUpdate: function(delta) {

		var lastX = this.x;
		var lastY = this.y;

	// PATH

		var tileSize = this.map.tileSize;

		if (this.path) {
			if (this.path[0] === undefined) {
				this.path = null;
				
			} else {
				var currNode = this.path[0];

				var targetX = Math.round(currNode.x * tileSize + (tileSize / 2) - (this.width / 2));
				var targetY = Math.round(currNode.y * tileSize + (tileSize / 2) - (this.height / 2));

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

	// MOVEMENT

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

		// the new target x / y
		var newX = this.x + this.accelerationX * delta * this.speed;
		var newY = this.y + this.accelerationY * delta * this.speed;

	// COLLISION
		
		var layerCollision = this.engine.getLayerCollision();
		if (layerCollision) {
			var data = layerCollision.getData();

			if (data) {
				var gridIndices = this.getGridIndices();
				var xIndex = gridIndices[0];
				var yIndex = gridIndices[1];

				var tileUp = data[yIndex - 1][xIndex];
				var tileDown = data[yIndex + 1][xIndex];

				var tileLeft = data[yIndex][xIndex - 1];
				var tileRight = data[yIndex][xIndex + 1];

				var tileUpLeft = data[yIndex - 1][xIndex - 1];
				var tileUpRight = data[yIndex - 1][xIndex + 1];

				var tileDownLeft = data[yIndex + 1][xIndex - 1];
				var tileDownRight = data[yIndex + 1][xIndex + 1];

			// UP / DOWN / LEFT / RIGHT

				var inUp = newY < (yIndex - 1) * tileSize + tileSize;
				var inDown = newY + this.height > (yIndex + 1) * tileSize;

				var inLeft = newX < (xIndex - 1) * tileSize + tileSize;
				var inRight = newX + this.width > (xIndex + 1) * tileSize;

				// 0 X 0
				// 0 P 0
				// 0 0 0
				if (tileUp && tileUp == 1 && inUp) {
					newY = lastY;
				}

				// 0 0 0
				// 0 P 0
				// 0 X 0
				if (tileDown && tileDown == 1 && inDown) {
					newY = lastY;
				}

				// 0 0 0
				// X P 0
				// 0 0 0
				if (tileLeft && tileLeft == 1 && inLeft) {
					newX = lastX;
				}

				// 0 0 0
				// 0 P X
				// 0 0 0
				if (tileRight && tileRight == 1 && inRight) {
					newX = lastX;
				}

			// DIAGONALS

				// X 0 0
				// 0 P 0
				// 0 0 0
				if (tileUpLeft && tileUpLeft == 1 && inUp && inLeft) {
					// make sure we move UP
					if (newY < lastY) {
						newY = lastY;
					}

					// make sure we move LEFT
					if (newX < lastX) {
						newX = lastX;
					}
				}

				// 0 0 X
				// 0 P 0
				// 0 0 0
				if (tileUpRight && tileUpRight == 1 && inUp && inRight) {
					// make sure we move UP
					if (newY < lastY) {
						newY = lastY;
					}

					// make sure we move RIGHT
					if (newX > lastX) {
						newX = lastX;
					}
				}

				// 0 0 0
				// 0 P 0
				// X 0 0
				if (tileDownLeft && tileDownLeft == 1 && inDown && inLeft) {
					// make sure we move DOWN
					if (newY > lastY) {
						newY = lastY;
					}

					// make sure we move LEFT
					if (newX < lastX) {
						newX = lastX;
					}
				}

				// 0 0 0
				// 0 P 0
				// 0 0 X
				if (tileDownRight && tileDownRight == 1 && inDown && inRight) {
					// make sure we move DOWN
					if (newY > lastY) {
						newY = lastY;
					}

					// make sure we move RIGHT
					if (newX > lastX) {
						newX = lastX;
					}
				}
			}
		}

	// UPDATE X / Y

		if (this.x != newX || this.y != newY) {
			this.moved = true;

			if (this.x < newX) {
				this.dir = Lucid.BaseEntity.DIR.RIGHT;
			} else if (this.x > newX) {
				this.dir = Lucid.BaseEntity.DIR.LEFT;
			}

			if (this.y < newY) {
				this.dir = Lucid.BaseEntity.DIR.DOWN;
			} else if (this.y > newY) {
				this.dir = Lucid.BaseEntity.DIR.UP;
			}

			this.x = newX;
			this.y = newY;
		} else {
			this.moved = false;
		}
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

		this.canvasContext.drawImage(
			this.asset,		// specifies the image, canvas, or video element to use
			this.assetX,	// the x coordinate where to start clipping
			this.assetY,	// the y coordinate where to start clipping
			this.width,		// the width of the clipped image
			this.height,	// the height of the clipped image
			Math.floor(this.x - this.camera.x),	// the x coordinate where to place the image on the canvas
			Math.floor(this.y - this.camera.y),	// the y coordinate where to place the image on the canvas
			this.width,		// the width of the image to use (stretch or reduce the image)
			this.height		// the height of the image to use (stretch or reduce the image)
		);
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
	 * Checks and handles the collision between two objects.
	 * Using https://en.wikipedia.org/wiki/Minkowski_addition
	 *
	 * @param      {Object}  e1      The e 1
	 * @param      {Object}  e2      The e 2
	 */
	checkHandleCollision: function(e1, e2) {
		var elementsHalfWidth = 0.5 * (e1.width + e2.width);
		var elementsHalfHeight = 0.5 * (e1.height + e2.height);
		var elementsDifferenceX = e1.x - e2.x;
		var elementsDifferenceY = e1.y - e2.y;

		if (Math.abs(elementsDifferenceX) <= elementsHalfWidth && Math.abs(elementsDifferenceY) <= elementsHalfHeight) {
			
			var wY = elementsHalfWidth * elementsDifferenceY;
			var hX = elementsHalfHeight * elementsDifferenceX;

			if (wY > hX) {
				if (wY > -hX) {
					// top
					e1.y = e2.y + e2.height;
				}
				else {
					// right
					e1.x = e2.x - e1.width;
				}
			} else {
				if (wY > -hX) {
					// left
					e1.x = e2.x + e2.width;
				}
				else {
					// bottom
					e1.y = e2.y - e1.height;
				}
			}
		}
	},

	/**
	 * Translates x/y Numbers to grid (tileSize) array based indices.
	 *
	 * @return     {Array}  The grid indices.
	 */
	getGridIndices: function() {
		var x = Math.floor((this.x + (this.width / 2)) / this.map.tileSize);
		var y = Math.floor((this.y + (this.height / 2)) / this.map.tileSize);

		return [x, y];
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
	LOADING_ERROR: "BaseEntityLoadingError"
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