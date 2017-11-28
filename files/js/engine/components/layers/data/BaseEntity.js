/**
 * Engine default BaseEntity. This Component is Layer related and represented by
 * the Layer.data value(s).
 */
Lucid.BaseEntity = BaseComponent.extend({
	// config variables and their default values
	x: 0, // current x position
	y: 0, // current y position

	lastX: 0, // the last x position, before the current render tick
	lastY: 0, // the last y position, before the current render tick

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
	weight: 80, // weight in kilograms
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

	/**
	 * Automatically called when instantiated.
	 *
	 * @param      {Object}   config  The configuration.
	 * @return     {Boolean}  Returns true on success.
	 */
	init: function(config) {
		this._super(config);

		this.checkSetMap();
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

		this.lastX = this.x;
		this.lastY = this.y;

		// events for loading the asset
		$(document).on(Lucid.BaseEntity.EVENT.LOADED_ASSET_FILE_SUCCESS + this.componentNamespace, this.assetLoadingSuccess.bind(this));
		$(document).on(Lucid.BaseEntity.EVENT.LOADED_ASSET_FILE_ERROR + this.componentNamespace, this.assetLoadingError.bind(this));

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
		$(document).trigger(Lucid.BaseEntity.EVENT.LOADING_SUCCESS, [this]);
	},

	/**
	 * General loading error.
	 */
	loadingError: function() {
		Lucid.Utils.log("BaseEntity @ loadingError: ERROR occurred while loading in BaseEntity with name: " + this.name);
		this.loaded = false;
		$(document).trigger(Lucid.BaseEntity.EVENT.LOADING_ERROR, [this]);
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
	 * @param      {String}      event       The event.
	 * @param      {LoaderItem}  loaderItem  The loader item.
	 */
	assetLoadingSuccess: function(event, loaderItem) {
		this.asset = loaderItem.getData();

		this.loadingSuccess();
	},

	/**
	 * Asset loading error.
	 *
	 * @param      {String}      event       The event.
	 * @param      {LoaderItem}  loaderItem  The loader item.
	 */
	assetLoadingError: function(event, loaderItem) {
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
	 * The renderUpdate() function should simulate anything that is affected by time.
	 * It can be called zero or more times per frame depending on the frame
	 * rate.
	 *
	 * @param      {Number}  delta   The amount of time in milliseconds to
	 *                               simulate in the update.
	 */
	renderUpdate: function(delta) {
		if (this.lastX < this.x) {
			// moved right
			this.dir = Lucid.BaseEntity.DIR.RIGHT;
		} else if (this.lastX > this.x) {
			// moved left
			this.dir = Lucid.BaseEntity.DIR.LEFT;
		}

		if (this.lastY < this.y) {
			// moved down
			this.dir = Lucid.BaseEntity.DIR.DOWN;
		} else if (this.lastY > this.y) {
			// moved up
			this.dir = Lucid.BaseEntity.DIR.UP;
		}

		var tileSize = this.map.tileSize;
		if (this.path) {
			this.lastX = this.x;
			this.lastY = this.y;

			if (this.path[0] === undefined) {
				this.moved = false;
				this.path = null;
			} else {
				this.moved = true;
				var currNode = this.path[0];
				var targetX = Math.round(currNode.x * tileSize + (tileSize / 2) - (this.width / 2));
				var targetY = Math.round(currNode.y * tileSize + (tileSize / 2) - (this.height / 2));

				if (Math.round(this.x) == targetX && Math.round(this.y) == targetY) {
					this.path.splice(0,1);
				} else {
					var step = delta * this.speed;
					if (this.x != targetX) {
						if (targetX > this.x) {
							this.x += step;
							if (this.x > targetX) {
								this.x = targetX;
							}
						} else {
							this.x -= step;
							if (this.x < targetX) {
								this.x = targetX;
							}
						}
					}

					if (this.y != targetY) {
						if (targetY > this.y) {
							this.y += step;
							if (this.y > targetY) {
								this.y = targetY;
							}
						} else {
							this.y -= step;
							if (this.y < targetY) {
								this.y = targetY;
							}
						}
					}
				}
			}
		} else {
			if (this.lastX == this.x && this.lastY == this.y) {
				this.moved = false;
			} else {
				this.moved = true;
				this.lastX = this.x;
				this.lastY = this.y;
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

		if (!this.loaded) {
			return;
		}
		
		this.canvasContext.drawImage(
			this.asset,		// specifies the image, canvas, or video element to use
			this.assetX,	// the x coordinate where to start clipping
			this.assetY,	// the y coordinate where to start clipping
			this.width,		// the width of the clipped image
			this.height,	// the height of the clipped image
			Math.floor((this.lastX + (this.x - this.lastX) * interpolationPercentage) - this.camera.x),	// the x coordinate where to place the image on the canvas
			Math.floor((this.lastY + (this.y - this.lastY) * interpolationPercentage) - this.camera.y),	// the y coordinate where to place the image on the canvas
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
	 * @param      {<type>}  path    The path
	 */
	setPath: function(path) {
		if (this.skipFirstPathSegment && path !== null && path.length > 1) {
			path.splice(0, 1);
		}

		this.path = path;
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
		$(document).off(Lucid.BaseEntity.EVENT.LOADED_ASSET_FILE_SUCCESS + this.componentNamespace);
		$(document).off(Lucid.BaseEntity.EVENT.LOADED_ASSET_FILE_ERROR + this.componentNamespace);

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