/**
 * Engine default BaseEntity. This Component is Layer related and represented by
 * the Layer.data value(s).
 *
 * @type       {BaseEntity}
 */
Lucid.BaseEntity = BaseComponent.extend({
	// config variables and their default values
    x: 0,
    y: 0,
    z: 0,

    lastX: 0,
	lastY: 0,
	lastZ: 0,

    offsetX: 0,
    offsetY: 0,
    offsetZ: 0,

    healthCurrent: 100, // current health
    healthMin: 0, // minimum health - curent < minimum -> Lucid.Entity.STATE.DEAD
    healthMax: 100, // maximum health

    width: 0,
    height: 0,

    sourceX: 0, // tileSet position X
    sourceY: 0, // tileSet position Y

	name: "Unknown", // name
	speed: 1, // speed
	vulnerable: 1,
	weight: 80, // weight in kilograms
	render: true, // determines if the content is rendered
	colliding: true, // does it collide with collisionData?

	// local variables
	controls: {}, // registered controls
	_tileSetLoaded: false,
	tileSet: null,
	canvas: null,
	canvasContext: null,

	moved: false, // required for collision detection

	path: null,
	currPathIndex: 0,
	pathDestX: null,
	pathDestY: null,

	/**
	  * Automatically called when instantiated.
	  *
	  * @param      {Object}   config  The configuration.
	  * @return     {Boolean}  Returns true on success.
	  */
	init: function(config) {
		this.componentName = "BaseEntity";
		
		this._super(config);

		this.checkSetMap();
		this.checkSetCamera();

		this.canvas = document.createElement("canvas");
		this.canvasContext = this.canvas.getContext("2d");

		this.lastX = this.x;
		this.lastY = this.y;
		this.lastZ = this.z;

		return true;
	},

	loadTileSet: function(filePath) {
		if (filePath == undefined) {
			return;
		}

		this._tileSetLoaded = false;

		var loaderItem = new Lucid.LoaderItem({
	        id: this.componentName,
	        dataType: Lucid.Loader.TYPE.IMAGE,
	        filePath: filePath,
	        eventSuccessName: Lucid.BaseEntity.EVENT.LOADED_TILESET_FILE_SUCCESS + this.componentNamespace,
	        eventErrorName: Lucid.BaseEntity.EVENT.LOADED_TILESET_FILE_ERROR + this.componentNamespace
	    });

	    $(document).on(Lucid.BaseEntity.EVENT.LOADED_TILESET_FILE_SUCCESS + this.componentNamespace, this.tileSetLoaded.bind(this));

	    Lucid.Loader.add(loaderItem);
	},

	tileSetLoaded: function(event, loaderItem) {
		Lucid.Utils.log("BaseEntity @ loadTileset: loaded tileset " + loaderItem.id);
    	$(document).off(Lucid.BaseEntity.EVENT.LOADED_TILESET_FILE_SUCCESS + this.componentNamespace);
        this._tileSetLoaded = true;
        this.tileSet = loaderItem.getData();
        // this.checkLoadingState();
	},

	/**
	 * Determines if valid.
	 *
	 * @return     {Boolean}  True if valid, False otherwise.
	 */
	isValid: function() {
		if (
			!this.camera ||
			!this.map ||
			!this.tileSet
			) {
			return false;
		} else {
			return true;
		}
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
			if (this.lastX == this.x &&
				this.lastY == this.y) {
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
	 *                                                time renderUpdate() runs. Useful
	 *                                                for interpolating frames.
	 */
	renderDraw: function(interpolationPercentage) {
		this.canvasContext.width = this.camera.width;
		this.canvasContext.height = this.camera.height;
		this.canvasContext.clearRect(0, 0, this.camera.width, this.camera.height);

		if (!this.tileSet) {
			return this.canvas;
		}
		
		this.canvasContext.drawImage(
			this.tileSet,
			this.sourceX, // source x
			this.sourceY, // source y
			this.width, // source width
			this.height, // source height
			Math.floor((this.lastX + (this.x - this.lastX) * interpolationPercentage) - this.camera.x),  // target x
			Math.floor((this.lastY + (this.y - this.lastY) * interpolationPercentage) - this.camera.y), // target y
			this.width, // target width
			this.height // target height
		);

		return this.canvas;
	},

	/**
	 * Resize.
	 *
	 * @param      {Object}  config  The configuration.
	 */
	resize: function(config) {
		this.canvas.width = config.wWidth;
		this.canvas.height = config.wHeight;
	},

	destroy: function() {

	},

	/**
	 * Adds a control.
	 *
	 * @param      {Control}  control  The control.
	 */
	addControl: function(control) {
		this.controls[control.getType()] = control;
	},

	/**
	 * Sets the active state.
	 *
	 * @param      {Boolean}  value  The value.
	 */
	setActive: function(active) {
		// TODO: enable / disable controls.

		this._super(active);
	},

	/**
	 * Gets the canvas.
	 *
	 * @return     {Canvas}  The canvas.
	 */
	getCanvas: function() {
		return this.canvas;
	},

	setPath: function(path) {
		if (path !== null && path.length > 1) {
			path.splice(0,1);
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
	 * Gets the grid indices.
	 *
	 * @return     {Array}  The grid indices.
	 */
	getGridIndices: function() {
		var x = Math.floor((this.x + (this.width / 2)) / this.map.tileSize);
		var y = Math.floor((this.y + (this.height / 2)) / this.map.tileSize);

		return [x, y];
	}
});

// forms setup for the editor
Lucid.BaseEntity.FORMS = {
	x: "integer",
	y: "integer",
	z: "integer",
	name: "string",
	colliding: "boolean",
	render: "boolean"
};

// event constants
Lucid.BaseEntity.EVENT = {
	LOADED_TILESET_FILE_SUCCESS: "BaseEntityLoadedTileSetFileSuccess",
	LOADED_TILESET_FILE_ERROR: "BaseEntityLoadedTileSetFileError",
	LOADED_ASSETS_SUCCESS: "BaseEntityLoadedAssetsSuccess",
	LOADED_ASSETS_ERROR: "BaseEntityLoadedAssetsError"
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
}