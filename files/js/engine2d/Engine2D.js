
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
	animationFrameID: null,
	prevElapsed: 0,
	container: null, // the wrapper / container
	canvas: null, // EVERYTHING will be rendered into this canvas yo
	canvasContext: null,
	camera: null,
	map: null,
	currentBuildMapFileName: null, // the currently build map file name

	collisionLayers: [], // collision layers
	collidingLayers: [], // layers which acquire collision data
	normalLayers: [], // normal layers 
	layers: [], // collection of all layers

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
		var delta = (elapsed - engine.prevElapsed) / 1000.0; // delta in seconds
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

			var currCollisionData = layer.getCollisionData();

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
			this.canvasContext.drawImage(layer.getCanvas(), 0, 0);
		}

		for (i = 0; i < this.normalLayers.length; ++i) {
			layer = this.normalLayers[i];

			// draw layer & engine canvas
			layer.draw(config);
			this.canvasContext.drawImage(layer.getCanvas(), 0, 0);
		}
	},

	resize: function(config) {
		// update engine canvas
		this.canvas.width = config.wWidth;
		this.canvas.height = config.wHeight;

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

		// update map
		if (this.map) {
			this.map.resize(config);
		}
	},

	/**
	 * Destroy & remove all events, intervals, timeouts
	 *
	 * @return     {boolean}  Returns true on success.
	 */
	destroy: function() {
		this.stop();

		if (this.currentBuildMapFileName) {
			this.destroyMap(this.currentBuildMapFileName);
			this.currentBuildMapFileName = null;
		}

		return true;
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
		var filePath = this.folderPaths.maps + fileName + this.extensions.maps;

		var loaderItem = new EngineLoaderItem({
	        id: fileName,
	        dataType: "script",
	        filePath: filePath,
	        eventSuccessName: Engine2D.EVENT.LOADED_MAP_FILE_SUCCESS,
	        eventErrorName: Engine2D.EVENT.LOADED_MAP_FILE_ERROR
	    });

	    EngineLoader.add(loaderItem);
	},

	/**
	 * Build a Map by fileName.
	 *
	 * @param      {string}  fileName  The Map file name.
	 * @return     {Map}     The build Map.
	 */
	buildMap: function(fileName) {
		var loaderItem = EngineLoader.get(fileName);

		if (!loaderItem) {
			EngineUtils.error("Engine2D @ buildMap: cannot build Map - not loaded yet: " + fileName);
			return null;
		}

		EngineUtils.log("Engine2D @ buildMap: building Map: " + fileName);

		var mapData = window[fileName];
		var mapConfig = mapData["config"];
		if (mapConfig === undefined) {
			EngineUtils.error("Engine2D @ buildMap: Map data doesnt have a config: " + fileName);
			return null;
		}

		// reference to engine2d
		mapConfig.engine2d = this;

		// create actual map object...
		this.map = new Map(mapConfig);

		// ...and add it to our build "list"
		this.buildMaps[fileName] = this.map;

		this.currentBuildMapFileName = fileName;

		return this.map;
	},

	/**
	 * Destroy an already build Map.
	 *
	 * @param      {string}   fileName  The map file name.
	 * @return     {boolean}  Returns true on success.
	 */
	destoryMap: function(fileName) {
		if (!(fileName in this.buildMaps)) {
			EngineUtils.error("Engine2D @ destroyMap: cannot destroy map - not build yet: " + fileName);
			return false;
		}

		var map = this.buildMaps[fileName];
		map.destroy();
		this.buildMaps[fileName] = null;
		map = null;

		this.currentBuildMapFileName = null;

		return true;
	},

/**
 * Layer
 */
 	/**
	 * Creates and adds a Layer.
	 *
	 * @param      {Object}  layerConfig  The Layer configuration.
	 * @return     {Layer}   Returns the created Layer.
	 */
	createAddLayer: function(layerConfig) {
		if (!layerConfig) {
			layerConfig = {};
		}

		// if (layerConfig.layerContainer === undefined) {
		// 	layerConfig.layerContainer = layerContainer;
		// }

		var layer = new Layer(layerConfig);
		
		this.addLayer(layer);

		return layer;
	},

	/**
	 * Adds a Layer.
	 *
	 * @param      {Layer}  layer   The Layer.
	 */
	addLayer: function(layer) {
		var type = layer.getType();
		if (type == Layer.TYPE.COLLISION) {
			this.collisionLayers.push(layer);
		} else if (type == Layer.TYPE.GRAPHICAL || type == Layer.TYPE.OBJECTS) {
			this.collidingLayers.push(layer);
		} else {
			this.normalLayers.push(layer);
		}
		
		// add to general layers array
		this.layers.push(layer);
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
			id = layer.getID();
			if (id == layerID) {
				break;
			}
		}

		// check if we found the layer with layerID
		if (id == layerID) {
			var type = layer.getType();
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

/**
 * Engine2D game engine.
 *
 * @class      Engine2D (name)
 * @param      {Object}   config  The configuration.
 * @return     {boolean}  Returns true on success.
 * 
 * @deprecated Deprecated since 10.11.2017
 */
function Engine2D_deprecated(config) {

	var configDefault = {
		mapsPath: "files/maps/",
		mapsExtension: ".map",
		tilesetsPath: "files/tilesets/",
		tilesetsExtension: ".ts",
		layerContainer: "layer-container", // target HTML container ID for layers
		renderCollisionLayer: false,
		renderingInterval: 30,
		customUpdateFunction: null // use custom update function istead the default one
	};

	var config = $.extend({}, configDefault, config);

	var self = this;

	var namespace = ".Engine2D";

	// config variables
	var mapsPath = config.mapsPath;
	var mapsExtension = config.mapsExtension;
	var layerContainer = config.layerContainer;
	var renderCollisionLayer = config.renderCollisionLayer;
	var renderingInterval = config.renderingInterval;
	var customUpdateFunction = config.customUpdateFunction;

	// local variables
	var updateInterval = null; // interval id
	var collisionLayers = []; // collision layers
	var collidingLayers = []; // layers which acquire collision data
	var normalLayers = []; // normal layers 
	var layers = []; // collection of all layers

	var players = {};

	var loadedMapFiles = []; // already loaded files of maps
	var buildMaps = {}; // already build maps - key is mapName and value Map object TODO switch to array!
	var currentBuildMapFileName = null; // the currently build map file name
	var loadedTilesetsData = {}; // contains the data of loaded tilesets

	/**
	* Starts the Engine2D.
	*/
	this.start = function() {
		EngineUtils.log("starting engine2d");

		if (updateInterval) {
			EngineUtils.log("engine2d already started");
			return false;
		}

		var updateFunction = this.update;

		if (customUpdateFunction) {
			updateFunction = customUpdateFunction;
		}

		updateInterval = setInterval(updateFunction, renderingInterval);

		return true;
	}

	/**
	* Stops the Engine2D.
	*/
	this.stop = function() {
		EngineUtils.log("stopping engine2d");

		if (!updateInterval) {
			EngineUtils.log("engine2d not started yet - nothing to stop");
			return false;
		}

		clearInterval(updateInterval);

		return true;
	}

	/**
	* Engine2D update "step"
	*/
	this.update = function() {
		EngineUtils.log("engine2d update step...");

		var updateConfig = {
			viewportWidth: this.getViewportWidth(),
			viewportHeight: this.getViewportWidth(),
			viewportHalfWidth: this.getViewportWidth() / 2,
			viewportHalfHeight: this.getViewportHeight() / 2
		};

		self.updateLayers(updateConfig);
	}

	/**
	 * Gets the already build maps.
	 *
	 * @return     {Object}  The already build maps.
	 */
	this.getBuildMaps = function() {
		return buildMaps;
	}

	/**
	 * Get the array of already into the DOM loaded map files.
	 *
	 * @return     {Array}  The loaded map files.
	 */
	this.getLoadedMapFiles = function() {
		return loadedMapFiles;
	}

	/**
	 * TODO: description
	 *
	 * @param      {Object}  config  The configuration.
	 */
	this.updateLayers = function(config) {
		var i;
		var layer;

		var collisionData = [];

		// skip through collisionLayer
		// update them and collect collisionData
		for (i = 0; i < collisionLayers.length; ++i) {
			layer = collisionLayers[i];
			var currCollisionData = layer.update(config);

			if (currCollisionData) {
				collisionData.push(currCollisionData);
			}
		}

		// set collisionData for the next layers we want to
		config.collisionData = collisionData;

		for (i = 0; i < collidingLayers.length; ++i) {
			layer = collidingLayers[i];
			layer.update(config);
		}

		for (i = 0; i < normalLayers.length; ++i) {
			layer = normalLayers[i];
			layer.update(config);
		}
	}

	/**
	 * Gets the viewport width.
	 *
	 * @return     {number}  The viewport width.
	 */
	this.getViewportWidth = function() {
		// TODO...
		return 300;
	}

	/**
	 * Gets the viewport height.
	 *
	 * @return     {number}  The viewport height.
	 */
	this.getViewportHeight = function() {
		// TODO...
		return 150;
	}

	/**
	 * Loads a map file in the DOM.
	 *
	 * @param      {string}  fileName  The map file name.
	 */
	this.loadMapFile = function(fileName) {
		var filePath = mapsPath + fileName + mapsExtension;

		var loaderItem = new EngineLoaderItem({
	        id: fileName,
	        dataType: "script",
	        filePath: filePath,
	        eventSuccessName: Engine2D.EVENT.LOADED_MAP_FILE_SUCCESS,
	        eventErrorName: Engine2D.EVENT.LOADED_MAP_FILE_ERROR
	    });

	    EngineLoader.add(loaderItem);
	}

	/**
	 * Build an already loaded map.
	 *
	 * @param      {string}  fileName  The map file name.
	 * @return     {Map}     The map.
	 */
	this.buildMap = function(fileName) {
		var loaderItem = EngineLoader.get(fileName);

		if (!loaderItem) {
			EngineUtils.error("cannot enter map - not loaded yet: " + fileName);
			return null;
		}

		EngineUtils.log("building map: " + fileName);
		var mapData = window[fileName];
		var mapConfig = mapData["config"];
		if (mapConfig === undefined) {
			EngineUtils.error("map data doesnt have a config: " + fileName);
			return null;
		}

		// reference to engine2d
		mapConfig.engine2d = self;

		// create actual map object...
		var map = new Map(mapConfig);

		// ...and add it to our build "list"
		buildMaps[fileName] = map;

		currentBuildMapFileName = fileName;

		return map;
	}

	/**
	 * Loads a tileset file.
	 *
	 * @param      {string}  fileName  The tileset file name.
	 */
	this.loadTilesetFile = function(fileName) {
		var filePath = tilesetsPath + fileName + tilesetsExtension;

		var loaderItem = new EngineLoaderItem({
	        id: fileName,
	        dataType: "xml",
	        filePath: filePath,
	        eventSuccessName: Engine2D.EVENT.LOADED_TILESET_FILE_SUCCESS,
	        eventErrorName: Engine2D.EVENT.LOADED_TILESET_FILE_ERROR
	    });

	    EngineLoader.add(loaderItem);
	}

	/**
	 * Destroy an already build map.
	 *
	 * @param      {string}   fileName  The map file name.
	 * @return     {boolean}  Returns true on success.
	 */
	this.destoryMap = function(fileName) {
		if (!(fileName in buildMaps)) {
			EngineUtils.error("cannot destroy map - not build yet: " + fileName);
			return false;
		}

		var map = buildMaps[fileName];
		map.destroy();
		buildMaps[fileName] = null;
		map = null;

		currentBuildMapFileName = null;

		return true;
	}

	
	/**
	 * Creates and adds a layer.
	 *
	 * @param      {Object}  layerConfig  The Layer configuration.
	 * @return     {Layer}   Returns the created Layer.
	 */
	this.createAddLayer = function(layerConfig) {
		if (!layerConfig) {
			layerConfig = {};
		}

		if (layerConfig.layerContainer === undefined) {
			layerConfig.layerContainer = layerContainer;
		}

		var layer = new Layer(layerConfig);
		
		this.addLayer(layer);

		return layer;
	}

	/**
	 * Adds a layer.
	 *
	 * @param      {Layer}  layer   The Layer.
	 */
	this.addLayer = function(layer) {
		var type = layer.getType();
		if (type == Layer.TYPE.COLLISION) {
			collisionLayers.push(layer);
		} else if (type == Layer.TYPE.GRAPHICAL || type == Layer.TYPE.OBJECTS) {
			collidingLayers.push(layer);
		} else {
			normalLayers.push(layer);
		}
		
		// add to general layers array
		layers.push(layer);
	}

	/**
	 * Removes a layer.
	 *
	 * @param      {string}   layerID  The Layer id.
	 * @return     {boolean}  Returns true if Layer was removed successfully.
	 */
	this.removeLayer = function(layerID) {
		var i;
		var layer;
		var id;

		for (i = 0; i < layers.length; ++i) {
			layer = layers[i];
			id = layer.getID();
			if (id == layerID) {
				break;
			}
		}

		// check if we found the layer with layerID
		if (id == layerID) {
			var type = layer.getType();
			layer.destroy();
			if (type == Layer.TYPE.COLLISION) {
				collisionLayers.erase(layer);
			} else if (type == Layer.TYPE.GRAPHICAL || type == Layer.TYPE.OBJECTS) {
				collidingLayers.erase(layer);
			} else {
				normalLayers.erase(layer);
			}

			layers.erase(layer);
			layer = null;

			return true;
		} else {
			return false;
		}
	}

	/**
	 * Sets the display property of a Layer
	 *
	 * @param      {string}   layerID       The Layer id.
	 * @param      {boolean}  display       The display state.
	 * @param      {boolean}  invertOthers  Invert other layers display state.
	 * @return     {boolean}  Returns true on success.
	 */
	this.setLayerDisplay = function(layerID, display, invertOthers) {

		if (layerID === undefined || display === undefined) {
			EngineUtils.error("cant set layer display - id: " + layerID);
			return false;
		}

		if (invertOthers === undefined) {
			invertOthers = true;
		}

		var success = false;

		for (var i = 0; i < layers.length; ++i) {
			var layer = layers[i];
			if (layer.getID() == layerID) {
				success = true;
				layer.setDisplay(display);
			} else if (invertOthers) {
				layer.setDisplay(!display);
			}
		}

		return success;
	}

	/**
	 * Adds a player.
	 *
	 * @param      {Player}  player  The player.
	 * @deprecated Switched to general Entity system
	 */
	this.addPlayer = function(player) {
		players[player.getID()] = player;
	}


	/**
	 * Removes a player.
	 *
	 * @param      {string}  playerID  The player id.
	 * @deprecated Switched to general Entity system
	 */
	this.removePlayer = function(playerID) {

	}

	/**
	 * Destroy & remove all events, intervals, timeouts
	 *
	 * @return     {boolean}  Returns true on success.
	 */
	this.destroy = function() {
		self.stop();

		if (currentBuildMapFileName) {
			self.destroyMap(currentBuildMapFileName);
			currentBuildMapFileName = null;
		}

		return true;
	}

	return true;
}