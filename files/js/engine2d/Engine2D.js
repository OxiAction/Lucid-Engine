// engine types
const TYPE_ENGINE_SIDE_SCROLL = "typeEngineSideScroll";
const TYPE_ENGINE_TOP_DOWN = "typeEngineTopDown";

// egine events
const EVENT_ENGINE_TOGGLE_LAYER = "eventEngineToggleLayer";
const EVENT_ENGINE_PAUSE = "eventEnginePause";
const EVENT_ENGINE_PLAY = "eventEnginePlay";
const EVENT_ENGINE_LOADED_MAP_FILE_SUCCESS = "eventEngineLoadedMapFileSuccess";
const EVENT_ENGINE_LOADED_MAP_FILE_ERROR = "eventEngineLoadedMapFileError";

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
	var currentBuildMapName = null; // the currently build Map

	// ------------------------------

	/**
	* TODO: description
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
	* TODO: description
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
	* TODO: description
	*/
	this.update = function() {
		EngineUtils.log("engine2d update step...");

		self.updateLayers();
	}

	/**
	* get the "list" of already build maps
	*/
	this.getBuildMaps = function() {
		return buildMaps;
	}

	/**
	* get the array of already into the DOM loaded map files
	*/
	this.getLoadedMapFiles = function() {
		return loadedMapFiles;
	}

	/**
	* TODO: description
	*/
	this.updateLayers = function() {
		var i;
		var layer;

		var collisionData = [];
		var updateConfig = {
			"viewportWidth": this.getViewportWidth(),
			"viewportHeight": this.getViewportHeight()
		};

		// skip through collisionLayer
		// update them and collect collisionData
		for (i = 0; i < collisionLayers.length; ++i) {
			layer = collisionLayers[i];
			layer.update(updateConfig);

			var currCollisionData = layer.getCollisionData();
			if (currCollisionData) {
				collisionData.push(currCollisionData);
			}
		}

		// set collisionData for the next layers we want to
		updateConfig["collisionData"] = collisionData;

		for (i = 0; i < collidingLayers.length; ++i) {
			layer = collidingLayers[i];
			layer.update(updateConfig);
		}

		for (i = 0; i < normalLayers.length; ++i) {
			layer = normalLayers[i];
			layer.update(updateConfig);
		}
	}

	/**
	* TODO: description
	*/
	this.getViewportWidth = function() {
		// TODO...
		return 300;
	}

	/**
	* TODO: description
	*/
	this.getViewportHeight = function() {
		// TODO...
		return 150;
	}

	/**
	* loads a map file into the DOM
	*
	* mapName: 			string
	*/
	this.loadMapFile = function(mapName) {
		// full path to file
		var mapFullPath = mapsPath + mapName + mapsExtension;

		// check if already loaded
		if (loadedMapFiles.contains(mapName)) {
			EngineUtils.log("map already loaded: " + mapFullPath);
			$(document).trigger(EVENT_ENGINE_LOADED_MAP_FILE_SUCCESS, [mapName]);
		}

		EngineUtils.log("attempting to load map: " + mapFullPath);

		$.loadScript(mapFullPath, function() {
	        EngineUtils.log("loaded map: " + mapFullPath);
	        loadedMapFiles.push(mapName);
	        $(document).trigger(EVENT_ENGINE_LOADED_MAP_FILE_SUCCESS, [mapName]);
	    }, function() {
	    	EngineUtils.error("couldnt load map: " + mapFullPath);
	    	$(document).trigger(EVENT_ENGINE_LOADED_MAP_FILE_ERROR, mapName);
	    });
	}

	/**
	* build an already loaded map
	*
	* mapName: 			string
	* return: 			Map
	*/
	this.buildMap = function(mapName) {
		if (!loadedMapFiles.contains(mapName)) {
			EngineUtils.error("cannot enter map - not loaded yet: " + mapName);
			return null;
		}

		EngineUtils.log("building map: " + mapName);
		var mapData = window[mapName];
		var mapConfig = mapData["config"];
		if (mapConfig === undefined) {
			EngineUtils.error("map data doesnt have a config: " + mapName);
			return null;
		}

		// reference to engine2d
		mapConfig["engine2d"] = self;

		// create actual map object...
		var map = new Map(mapConfig);

		// ...and add it to our build "list"
		buildMaps[mapName] = map;

		currentBuildMapName = mapName;

		return map;
	}

	/**
	* destroy an already build map
	*
	* mapName: 			string
	*/
	this.destoryMap = function(mapName) {
		if (!(mapName in buildMaps)) {
			EngineUtils.error("cannot destroy map - not build yet: " + mapName);
			return false;
		}

		var map = buildMaps[mapName];
		map.destroy();
		buildMaps[mapName] = null;
		map = null;

		currentBuildMapName = null;

		return true;
	}

	/**
	* TODO: description
	*
	* layerConfig: 			object
	* return: 				Layer
	*/
	this.createAddLayer = function(layerConfig) {
		if (!layerConfig) {
			layerConfig = {};
		}

		if (layerConfig["layerContainer"] === undefined) {
			layerConfig["layerContainer"] = layerContainer;
		}

		var layer = new Layer(layerConfig);
		var type = layer.getType();
		if (type == TYPE_LAYER_COLLISION) {
			collisionLayers.push(layer);
		} else if (type == TYPE_LAYER_GRAPHICAL || type == TYPE_LAYER_OBJECTS) {
			collidingLayers.push(layer);
		} else {
			normalLayers.push(layer);
		}
		
		layers.push(layer); // add to general layers array

		return layer;
	}

	/**
	* TODO: description
	*
	* layerID: 			id
	*/
	this.removeLayerByID = function(layerID) {
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
			if (type == TYPE_LAYER_COLLISION) {
				collisionLayers.erase(layer);
			} else if (type == TYPE_LAYER_GRAPHICAL || type == TYPE_LAYER_OBJECTS) {
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
	* set layer display
	*
	* layerID: 			id
	* display: 			boolean
	* invertOthers: 	boolean - default true
	*/
	this.setLayerDisplayByID = function(layerID, display, invertOthers) {

		if (layerID === undefined || display === undefined) {
			EngineUtils.error("cant set layer display - id: " + layerID);
			return false;
		}

		if (invertOthers === undefined) {
			invertOthers = true;
		}

		for (var i = 0; i < layers.length; ++i) {
			var layer = layers[i];
			if (layer.getID() == layerID) {
				layer.setDisplay(display);
			} else if (invertOthers) {
				layer.setDisplay(!display);
			}
		}

		return true;
	}

	/**
	* add player
	*
	* player: 			Player
	*/
	this.addPlayer = function(player) {
		players[player.getID()] = player;
	}

	/**
	* remove player
	*
	* playerID: 		id
	*/
	this.removePlayerByID = function(playerID) {

	}

	/**
	* destroy & remove all events, intervals, timeouts
	*/
	this.destroy = function() {
		self.stop();

		if (currentBuildMapName) {
			self.destroyMap(currentBuildMapName);
			currentBuildMapName = null;
		}
	}
}