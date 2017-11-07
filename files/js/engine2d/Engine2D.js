// global utils
var EngineUtils;

$(document).ready(function() {
	EngineUtils = new EngineUtils();
});

function Engine2D(config) {

	var configDefault = {
		"mapsPath": "files/maps/",
		"mapsExtension": ".js",
		"layerContainer": "layer-container", // target HTML container ID for layers
		"renderCollisionLayer": false,
		"renderingInterval": 30,
		"customUpdateFunction": null // use custom update function istead the default one
	};

	var config = $.extend({}, configDefault, config);

	var self = this;

	var namespace = ".Engine2D";

	var mapsPath = config["mapsPath"];
	var mapsExtension = config["mapsExtension"];
	var layerContainer = config["layerContainer"];
	var renderCollisionLayer = config["renderCollisionLayer"];
	var renderingInterval = config["renderingInterval"];
	var customUpdateFunction = config["customUpdateFunction"];

	var updateInterval = null; // interval id
	var collisionLayers = []; // collision layers
	var collidingLayers = []; // layers which acquire collision data
	var normalLayers = []; // normal layers 
	var layers = []; // collection of all layers

	var players = {};

	var loadedMapFiles = []; // already loaded files of maps
	var buildMaps = {}; // already build maps - key is mapName and value Map object TODO switch to array!
	var currentBuildMapFileName = null; // the currently build map file name

	// ------------------------------

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
			"viewportWidth": this.getViewportWidth(),
			"viewportHeight": this.getViewportWidth(),
			"viewportHalfWidth": this.getViewportWidth() / 2,
			"viewportHalfHeight": this.getViewportHeight() / 2
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
	 * @param      {string}  mapFileName  The map file name.
	 */
	this.loadMapFile = function(mapFileName) {
		// full path to file
		var mapFullPath = mapsPath + mapFileName + mapsExtension;

		// check if already loaded
		if (loadedMapFiles.contains(mapFileName)) {
			EngineUtils.log("map already loaded: " + mapFullPath);
			$(document).trigger(Engine2D.EVENT.LOADED_MAP_FILE_SUCCESS, [mapFileName]);
		}

		EngineUtils.log("attempting to load map: " + mapFullPath);

		$.loadScript(mapFullPath, function() {
	        EngineUtils.log("loaded map: " + mapFullPath);
	        loadedMapFiles.push(mapFileName);
	        $(document).trigger(Engine2D.EVENT.LOADED_MAP_FILE_SUCCESS, [mapFileName]);
	    }, function() {
	    	EngineUtils.error("couldnt load map: " + mapFullPath);
	    	$(document).trigger(Engine2D.EVENT.LOADED_MAP_FILE_ERROR, mapFileName);
	    });
	}

	/**
	 * Build an already loaded map.
	 *
	 * @param      {string}  mapFileName  The map file name.
	 * @return     {Map}     The map.
	 */
	this.buildMap = function(mapFileName) {
		if (!loadedMapFiles.contains(mapFileName)) {
			EngineUtils.error("cannot enter map - not loaded yet: " + mapFileName);
			return null;
		}

		EngineUtils.log("building map: " + mapFileName);
		var mapData = window[mapFileName];
		var mapConfig = mapData["config"];
		if (mapConfig === undefined) {
			EngineUtils.error("map data doesnt have a config: " + mapFileName);
			return null;
		}

		// reference to engine2d
		mapConfig.engine2d = self;

		// create actual map object...
		var map = new Map(mapConfig);

		// ...and add it to our build "list"
		buildMaps[mapFileName] = map;

		currentBuildMapFileName = mapFileName;

		return map;
	}

	/**
	 * Destroy an already build map.
	 *
	 * @param      {string}   mapFileName  The map file name.
	 * @return     {boolean}  Returns true on success.
	 */
	this.destoryMap = function(mapFileName) {
		if (!(mapFileName in buildMaps)) {
			EngineUtils.error("cannot destroy map - not build yet: " + mapFileName);
			return false;
		}

		var map = buildMaps[mapFileName];
		map.destroy();
		buildMaps[mapFileName] = null;
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
	* TODO: description
	*
	* layerID: 			id
	*/

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
	 */
	this.addPlayer = function(player) {
		players[player.getID()] = player;
	}


	/**
	 * Removes a player.
	 *
	 * @param      {string}  playerID  The player id.
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
}

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
	LOADED_MAP_FILE_ERROR: "loadedMapFileError"
}