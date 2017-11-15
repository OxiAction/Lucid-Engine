/**
 * Engine default BaseEntity. This Component is Layer related and represented by
 * the Layer.data value(s).
 *
 * @type       {BaseEntity}
 */
Lucid.BaseEntity = BaseComponent.extend({
	// config variables and their default values
    positionX: 0,
    positionY: 0,
    positionZ: 0,

    offsetX: 0,
    offsetY: 0,
    offsetZ: 0,

    healthCurrent: 100, // current health
    healthMin: 0, // minimum health - curent < minimum -> Lucid.Entity.STATE.DEAD
    healthMax: 100, // maximum health

    width: 0,
    height: 0,

	name: "Unknown", // name
	speed: 1, // speed
	vulnerable: 1,
	weight: 80, // weight in kilograms
	camera: null,
	render: true, // determines if the content is rendered
	colliding: true, // does it collide with collisionData?

	// local variables
	controls: {}, // registered controls
	_tileSetLoaded: false,
	tileSet: null,
	canvas: null,
	canvasContext: null,

	/**
	  * Automatically called when instantiated.
	  *
	  * @param      {Object}   config  The configuration.
	  * @return     {boolean}  Returns true on success.
	  */
	init: function(config) {
		this.componentName = "BaseEntity";
		
		this._super(config);

		this.canvas = document.createElement("canvas");
		this.canvasContext = this.canvas.getContext("2d");

		return true;
	},

	loadTileSet: function(filePath) {
		if (filePath == undefined) {
			return;
		}

		this._tileSetLoaded = false;

		var loaderItem = new Lucid.LoaderItem({
	        id: "tiles",
	        dataType: Lucid.Loader.TYPE.IMAGE,
	        filePath: filePath,
	        eventSuccessName: Lucid.BaseEntity.EVENT.LOADED_TILESET_FILE_SUCCESS,
	        eventErrorName: Lucid.BaseEntity.EVENT.LOADED_TILESET_FILE_ERROR
	    });

	    Lucid.Loader.add(loaderItem);

	    $(document).on(Lucid.BaseEntity.EVENT.LOADED_TILESET_FILE_SUCCESS + this.componentNamespace, this.tileSetLoaded.bind(this));
	},

	tileSetLoaded: function(event, loaderItem) {
		Lucid.Utils.log("BaseEntity @ loadTileset: loaded tileset");
    	$(document).off(Lucid.BaseEntity.EVENT.LOADED_TILESET_FILE_SUCCESS + this.componentNamespace);
        this._tileSetLoaded = true;
        this.tileSet = loaderItem.getData();
        // this.checkLoadingState();
	},

	/**
	 * Determines if valid.
	 *
	 * @return     {boolean}  True if valid, False otherwise.
	 */
	isValid: function() {
		if (
			!this.camera ||
			!this.tileSet
			) {
			return false;
		} else {
			return true;
		}
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

	/**
	 * Draws a Canvas.
	 *
	 * @param      {number}  delta   The delta.
	 * @param      {Object}  config  The configuration
	 * @return     {Canvas}  Returns the drawn Canvas.
	 */
	draw: function(delta, config) {
		
		if (!this.isValid()) {
			return this.canvas;
		}

		var camera = this.camera;
		var cameraWidth = camera.width;
		var cameraHeight = camera.height;

		var canvasContext = this.canvasContext;
		canvasContext.width = cameraWidth;
		canvasContext.height = cameraHeight;
		canvasContext.clearRect(0, 0, cameraWidth, cameraHeight);

		canvasContext.drawImage(
			this.tileSet,
			0, // source x
			0, // source y
			this.width, // source width
			this.height, // source height
			this.positionX,  // target x
			this.positionY, // target y
			this.width, // target width
			this.height // target height
		);

		return this.canvas;
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
	 * @param      {boolean}  value  The value.
	 */
	setActive: function(value) {
		// TODO: enable / disable controls.

		this._super(value);
	},

	/**
	 * Gets the canvas.
	 *
	 * @return     {Canvas}  The canvas.
	 */
	getCanvas: function() {
		return this.canvas;
	}
});

// forms setup for the editor
Lucid.BaseEntity.FORMS = {
	positionX: "integer",
	positionY: "integer",
	positionZ: "integer",
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