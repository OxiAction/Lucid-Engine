// TODO: rename to BaseItem! Extend the BaseEntity.

/**
 * Engine default Item. This Component is Layer related and represented by the
 * Layer.data value(s).
 *
 * @type       {Entity}
 */
Lucid.Item = BaseComponent.extend({
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
		this.componentName = "Entity";
		
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
	        eventSuccessName: Lucid.Entity.EVENT.LOADED_TILESET_FILE_SUCCESS,
	        eventErrorName: Lucid.Entity.EVENT.LOADED_TILESET_FILE_ERROR
	    });

	    Lucid.Loader.add(loaderItem);

	    $(document).on(Lucid.Entity.EVENT.LOADED_TILESET_FILE_SUCCESS + this.componentNamespace, this.tileSetLoaded.bind(this));
	},

	tileSetLoaded: function(event, loaderItem) {
		Lucid.Utils.log("Entity @ loadTileset: loaded tileset");
    	$(document).off(Lucid.Entity.EVENT.LOADED_TILESET_FILE_SUCCESS + this.componentNamespace);
        this._tileSetLoaded = true;
        this.tileSet = loaderItem.getData();
        // this.checkLoadingState();
	},

	/**
	 * Draws a Canvas.
	 *
	 * @param      {number}  delta   The delta.
	 * @param      {Camera}  camera  The Camera.
	 * @param      {Object}  config  The configuration
	 * @return     {Canvas}  Returns the drawn Canvas.
	 */
	draw: function(delta, camera, config) {
		if (camera === undefined) {
			return;
		}

		var tileSizeWidth = this.tileSize.width;
		var tileSizeHeight = this.tileSize.height;

		var cameraWidth = camera.width;
		var cameraHeight = camera.height;

		canvasContext.width = cameraWidth;
		canvasContext.height = cameraHeight;
		canvasContext.clearRect(0, 0, cameraWidth, cameraHeight);

		canvasContext.drawImage(
			this.tileSet,
			0, // source x
			0, // source y
			tileSizeWidth, // source width
			tileSizeHeight, // source height
			100,  // target x
			100, // target y
			tileSizeWidth, // target width
			tileSizeHeight // target height
		);
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
	}
});

// forms setup for the editor
Lucid.Entity.FORMS = {
	position: {
		x: "int",
		y: "int"
	},
	name: "string",
	speed: "number",
	vulnerable: "boolean",
	weight: "number"
};

// event constants
Lucid.Entity.EVENT = {
	LOADED_TILESET_FILE_SUCCESS: "EntityLoadedTileSetFileSuccess",
	LOADED_TILESET_FILE_ERROR: "EntityLoadedTileSetFileError",
	LOADED_ASSETS_SUCCESS: "EntityLoadedAssetsSuccess",
	LOADED_ASSETS_ERROR: "EntityLoadedAssetsError"
};

// some states for entities
Lucid.Entity.STATE = {
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