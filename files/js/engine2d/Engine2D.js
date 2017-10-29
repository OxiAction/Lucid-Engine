// engine types
const TYPE_ENGINE_SIDE_SCROLL = "typeEngineSideScroll";
const TYPE_ENGINE_TOP_DOWN = "typeEngineTopDown";

// egine events
const EVENT_ENGINE_TOGGLE_LAYER = "eventEngineToggleLayer";
const EVENT_ENGINE_PAUSE = "eventEnginePause";
const EVENT_ENGINE_PLAY = "eventEnginePlay";
const EVENT_ENGINE_LOAD_MAP = "eventEngineLoadMap";

// global utils
var EngineUtils;

$(document).ready(function() {
	EngineUtils = new EngineUtils();
});

function Engine2D(gameSettings, layers) {

	var gameSettingsDefault = {
		"difficulty": 1,
		"speed": 1
	};

	var gameSettings = $.extend({}, gameSettingsDefault, gameSettings);

	var self = this;
	var namespace = ".Engine2D";
	var layers = {};

	// ------------------------------

	this.doDraw = function() {

	}

	this.loadMap = function(mapData) {
		EngineUtils.log("loadMap " + mapData);
	}

	// set layers
	this.setLayers = function(layers) {

	}

	// destroy & remove all events, intervals, timeouts
	this.destroy = function() {
		$(document).off(EVENT_ENGINE_LOAD_MAP + namespace);
	}

	// initialize
	$(document).on(EVENT_ENGINE_LOAD_MAP + namespace, function(event, mapData) {
		self.loadMap(mapData);
	});
}