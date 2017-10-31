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
		"mapsExtension": ".js"
	};

	var config = $.extend({}, configDefault, config);

	var self = this;
	var namespace = ".Engine2D";

	var layers = {};
	var players = {};

	var loadedMapFiles = []; // already loaded files of maps
	var buildMaps = {}; // already build maps - key is mapName and value Map object
	var currentMap = null; // the currently active Map

	// ------------------------------

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
	* TODO
	*/
	this.doDraw = function() {
		// TODO not sure how this will work :X
	}

	/**
	* loads a map file into the DOM
	*
	* mapName: 			string
	*/
	this.loadMapFile = function(mapName) {
		// full path to file
		var mapFullPath = config["mapsPath"] + mapName + config["mapsExtension"];

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
	*/
	this.buildMap = function(mapName) {
		if (!loadedMapFiles.contains(mapName)) {
			EngineUtils.error("cannot enter map - not loaded yet: " + mapName);
			return false;
		}

		EngineUtils.log("building map: " + mapName);
		var mapData = window[mapName];
		var mapConfig = mapData["config"];
		if (mapConfig === undefined) {
			EngineUtils.error("map data doesnt have a config: " + mapName);
			return false;
		}

		// reference to engine2d
		mapConfig["engine2d"] = self;

		// create actual map object...
		var map = new Map(mapConfig);

		// ...and add it to our build "list"
		buildMaps[mapName] = map;

		return true;
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
		map = null;

		buildMaps.erase(map);

		return true;
	}

	/**
	* enter a (already loaded and build) map
	*
	* mapName: 			string
	*/
	this.enterMap = function(mapName) {
		if (!(mapName in buildMaps)) {
			EngineUtils.error("cannot enter map - not build (or maybe loaded) yet: " + mapName);
			return false;
		}

		EngineUtils.log("entering map: " + mapName);

		//...
		return true;
	}

	/**
	* add layer
	*
	* layer: 			Layer
	*/
	this.addLayer = function(layer) {
		var id = layer.getID();
		layers[id] = layer;
	}

	/**
	* set layer display
	*
	* layerID: 			id
	* display: 			boolean
	* invertOthers: 	boolean
	*/
	this.setLayerDisplayByID = function(layerID, display, invertOthers) {
		if (!(layerID in layers) || display === undefined) {
			EngineUtils.error("cant set layer display - id: " + layerID);
		}

		if (invertOthers === undefined) {
			invertOthers = true;
		}

		if (invertOthers) {
			$.each(layers, function(key, value){
				layers[key].setDisplay(!display);
			});
		}

		layers[layerID].setDisplay(display);
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
	this.removePlayer = function(playerID) {

	}

	/**
	* destroy & remove all events, intervals, timeouts
	*/
	this.destroy = function() {
		
	}
}