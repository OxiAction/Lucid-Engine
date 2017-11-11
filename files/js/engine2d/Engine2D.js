/**
 * Engine2D core.
 *
 * @type       {Engine2D}
 */
var Engine2D = BaseComponent.extend({
	// config variables and their default values
	// file names of files required by Engine2D
	fileNames: {
		config: "engine"
	},
	// folder structure
	folderPaths: {
		maps: "files/maps/",
		tileSets: "files/tilesets/",
		config: "files/config/"
	},
	// extensions
	extensions: {
		maps: ".map",
		tileSets: ".ts",
		config: ".cfg"
	},
	containerID: "engine2d-container", // wrapper / container ID
	canvasID: "engine2d-canvas", // cavas ID

	// local variables
	animationFrameID: null, // the RAF ID
	prevElapsed: 0, // required for calc the RAF delta
	container: null, // the wrapper / container
	canvas: null, // EVERYTHING will be rendered into this canvas yo
	canvasContext: null,
	camera: null,
	map: null,
	// currentBuildMapFileName: null, // the currently build map file name

	collisionLayers: [], // collision layers
	collidingLayers: [], // layers which acquire collision data
	normalLayers: [], // normal layers 
	layers: [], // collection of all layers

	// buildMaps: {}, // already build maps - key is mapName and value Map object TODO switch to array!

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
		this.componentName = "Engine2D";
		
		this._super(config);

		// get wrapper / container from HTML
		this.container = document.getElementById(this.containerID);
		if (!this.container) {
			return;
		}

		// get canvas from HTML
		this.canvas = document.getElementById(this.canvasID);
		if (!this.canvas) {
			return;
		}

		// assign context
		this.canvasContext = this.canvas.getContext("2d");

		/*
		// setup camera
		this.camera = new Camera();

		// setup map
		this.map = new Map({
			camera: this.camera
		});
		quick & dirty asign
		this.normalLayers = this.map.getLayer();
		*/

		return true;
	},

	start: function() {
		this.animationFrameID = window.requestAnimationFrame(this.tick.bind(this));
		EngineUtils.log("Engine2D @ start: animationFrameID: " + this.animationFrameID);
	},

	stop: function() {
		EngineUtils.log("Engine2D @ stop: animationFrameID: " + this.animationFrameID);
		if (this.animationFrameID != null) {
			window.cancelAnimationFrame(this.animationFrameID);
			this.animationFrameID = null;
		}
	},

	// note: "this" scope is now "window"!
	// FIXED: with bind(this)
	tick: function(elapsed) {
		var elapsedSeconds = elapsed / 1000.0; // convert in seconds
		var delta = (elapsed - this.prevElapsed) / 1000.0; // delta in seconds
    	delta = Math.min(delta, 0.06); // maximum delta of 60 ms
		// EngineUtils.log("Engine2D @ tick: elapsedTimeSeconds: " + elapsedSeconds + " prevElapsed: " + this.prevElapsed + " delta: " + delta);
		
		this.prevElapsed = elapsed;

		this.draw();

		// check if we should keep on shaking!
		// TLD: https://www.youtube.com/watch?v=mhzc5ZeAXYY
		// \o/
		if (this.animationFrameID) {
			// recursive call
			window.requestAnimationFrame(this.tick.bind(this));
		}
	},

	draw: function() {
		if (!this.canvasContext) {
			return;
		}

		this.canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height);

		var i;
		var layer;

		// config for them lay0rs!
		var config = {
			collisionData: []
		}

		// skip through collisionLayer
		// update them and collect collisionData
		var collisionData = [];
		for (i = 0; i < this.collisionLayers.length; ++i) {
			layer = this.collisionLayers[i];
			layer.draw(config);

			var currCollisionData = layer.collisionData;

			if (currCollisionData) {
				collisionData.push(currCollisionData);
			}
		}

		if (this.camera) {
			this.camera.draw(config);
		}

		// TODO: eeerm some kind of z-sorting is required here I guess :D

		// set collisionData for the next layers
		config.collisionData = collisionData;

		for (i = 0; i < this.collidingLayers.length; ++i) {
			layer = this.collidingLayers[i];

			// draw layer & engine canvas
			layer.draw(config);
			this.canvasContext.drawImage(layer.canvas, 0, 0);
		}

		for (i = 0; i < this.normalLayers.length; ++i) {
			layer = this.normalLayers[i];

			// draw layer & engine canvas
			layer.draw(config);
			this.canvasContext.drawImage(layer.canvas, 0, 0);
		}
	},

	resize: function(config) {
		// update engine canvas
		this.canvas.width = config.wWidth;
		this.canvas.height = config.wHeight;

		// update camera
		if (this.camera) {
			this.camera.resize(config);
		}

		// update map
		if (this.map) {
			this.map.resize(config);
		}

		// update layers
		var i;
		var layer;

		for (i = 0; i < this.collisionLayers.length; ++i) {
			layer = this.collisionLayers[i];
			layer.resize(config);
		}

		for (i = 0; i < this.collidingLayers.length; ++i) {
			layer = this.collidingLayers[i];
			layer.resize(config);
		}

		for (i = 0; i < this.normalLayers.length; ++i) {
			layer = this.normalLayers[i];
			layer.resize(config);
		}
	},

	/**
	 * Destroy & remove all events, intervals, timeouts
	 *
	 * @return     {boolean}  Returns true on success.
	 */
	destroy: function() {
		this.stop();

		if (this.map) {
			this.destroyMap();
		}

		return true;
	},

/**
 * Camera
 */

 	/**
 	 * Sets the camera.
 	 *
 	 * @param      {Camera}  value   The Camera.
 	 */
 	setCamera: function(value) {
 		this.camera = value;
 	},

 	getCamera: function() {
 		return this.camera;
 	},

/**
 * Map
 */

	/**
	 * Loads a map file into the DOM.
	 *
	 * @param      {string}  fileName  The map file name.
	 */
	loadMapFile: function(fileName) {
		EngineUtils.log("Engine2D @ loadMapFile: load map with fileName: " + fileName);

		var filePath = this.folderPaths.maps + fileName + this.extensions.maps;

		var loaderItem = new EngineLoaderItem({
	        id: fileName,
	        dataType: EngineLoader.TYPE.SCRIPT,
	        filePath: filePath,
	        eventSuccessName: Engine2D.EVENT.LOADED_MAP_FILE_SUCCESS,
	        eventErrorName: Engine2D.EVENT.LOADED_MAP_FILE_ERROR
	    });

	    EngineLoader.add(loaderItem);
	},

	/**
	 * Set and build a Map by fileName and start loading its assets. This also
	 * sets the Engine2D.map value to the new Map.
	 *
	 * @param      {string}  fileName  The Map file name.
	 * @return     {Map}     The build Map.
	 */
	setMap: function(fileName) {
		var loaderItem = EngineLoader.get(fileName);

		if (!loaderItem) {
			EngineUtils.error("Engine2D @ setMap: cannot build Map - not loaded yet: " + fileName);
			return null;
		}

		EngineUtils.log("Engine2D @ setMap: building Map: " + fileName);

		var mapData = window[fileName];
		var mapConfig = mapData.config;
		if (mapConfig === undefined) {
			EngineUtils.error("Engine2D @ setMap: Map data doesnt have a config: " + fileName);
			return null;
		}

		// inject stuff
		mapConfig.engine2d = this;
		mapConfig.camera = this.getCamera();
		mapConfig.fileNames = this.fileNames;
		mapConfig.filePaths = this.filePaths;
		mapConfig.extensions = this.extensions;

		// create actual map object...
		this.map = new Map(mapConfig);

		// ...and add it to our build "list"
		// this.buildMaps[fileName] = this.map;

		// this.currentBuildMapFileName = fileName;

		// ...
		this.map.loadAssets();

		return this.map;
	},

	/**
	 * Gets the map.
	 *
	 * @return     {Map}  The map.
	 */
	getMap: function() {
		return this.map;
	},

	/**
	 * Destroy the current Engine2D.map.
	 *
	 * @param      {string}   fileName  The map file name.
	 * @return     {boolean}  Returns true on success.
	 */
	destoryMap: function() {
		if (this.map == null) {
			EngineUtils.log("Engine2D @ destroyMap: Enginge2D.map is null - nothing to destroy");
			return false;
		}
		// if (!(fileName in this.buildMaps)) {
		// 	EngineUtils.error("Engine2D @ destroyMap: cannot destroy map - not build yet: " + fileName);
		// 	return false;
		// }

		// var map = this.buildMaps[fileName];
		// map.destroy();
		// this.buildMaps[fileName] = null;
		// map = null;

		// this.currentBuildMapFileName = null;

		this.map.destroy();
		this.map = null;

		return true;
	},

/**
 * Layer
 */
 	/**
	 * Creates and adds a Layer based on the config.
	 *
	 * @param      {Object}  config  The Layer configuration.
	 * @return     {Layer}   Returns the created Layer or null.
	 */
	createAddLayer: function(config) {
		if (config === undefined) {
			EngineUtils.error("Engine2D @ createAddLayer: config is undefined!");
			return null;
		} else if (config.id == null, config.type == null) {
			EngineUtils.error("Engine2D @ createAddLayer: id or type is null - please asign an id and Layer.TYPE.XXX!");
			return null;
		}

		var layer = this.createLayer(config);
		if (this.addLayer(layer)) {
			return layer;
		} else {
			layer = null;
			return null;
		}
	},

	/**
	 * Creates a layer based on the config.
	 *
	 * @param      {Object}  config  The Layer configuration.
	 * @return     {Layer}   Returns a new Layer instance.
	 */
	createLayer: function(config) {
		EngineUtils.log("Engine2D @ createLayer: creating / instantiating a new Layer - config: " + config);
		return new Layer(config);
	},

	/**
	 * Adds a Layer.
	 *
	 * @param      {Layer}    layer   The Layer.
	 * @return     {boolean}  Returns true on success.
	 */
	addLayer: function(layer) {
		var id = layer.id;
		var type = layer.type;
		EngineUtils.log("Engine2D @ addLayer: add layer id: " + id + " type: " + type);
		
		if (type == Layer.TYPE.COLLISION) {
			this.collisionLayers.push(layer);
		} else if (type == Layer.TYPE.GRAPHICAL || type == Layer.TYPE.OBJECTS) {
			this.collidingLayers.push(layer);
		} else {
			this.normalLayers.push(layer);
		}
		
		// add to general layers array
		this.layers.push(layer);

		return true;
	},

	/**
	 * Removes a Layer.
	 *
	 * @param      {string}   layerID  The Layer id.
	 * @return     {boolean}  Returns true if Layer was removed successfully.
	 */
	removeLayer: function(layerID) {
		var i;
		var layer;
		var id;

		for (i = 0; i < this.layers.length; ++i) {
			layer = this.layers[i];
			id = layer.id;
			if (id == layerID) {
				break;
			}
		}

		// check if we found the layer with layerID
		if (id == layerID) {
			var type = layer.type;
			layer.destroy();

			if (type == Layer.TYPE.COLLISION) {
				this.collisionLayers.erase(layer);
			} else if (type == Layer.TYPE.GRAPHICAL || type == Layer.TYPE.OBJECTS) {
				this.collidingLayers.erase(layer);
			} else {
				this.normalLayers.erase(layer);
			}

			this.layers.erase(layer);
			layer = null;

			return true;
		} else {
			return false;
		}
	}
});

// type constants
Engine2D.TYPE = {
	SIDE_SCROLL: "sideScroll", // side scroll game type
	TOP_DOWN: "topDown" // top down game type
};

// event constants
Engine2D.EVENT = {
	TOGGLE_LAYER: "toggleLayer",
	PAUSE: "pause",
	PLAY: "play",
	LOADED_MAP_FILE_SUCCESS: "loadedMapFileSuccess",
	LOADED_MAP_FILE_ERROR: "loadedMapFileError",
	LOADED_TILESET_FILE_SUCCESS: "loadedTilesetFileSuccess",
	LOADED_TILESET_FILE_ERROR: "loadedTilesetFileError"
};