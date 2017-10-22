const TYPE_ENGINE_SIDE_SCROLL = "typeEngineSideScroll";
const TYPE_ENGINE_TOP_DOWN = "typeEngineTopDown";

// global utils
var EngineUtils;
// global events
var EngineEvents;

$(document).ready(function() {
	EngineUtils = new EngineUtils();
	EngineEvents = new EngineEvents();
});

function Engine2D(gameSettings, layers) {

	var gameSettingsDefault = {
		"difficulty": 1,
		"speed": 1,
		"velocity": 1,
		"type": TYPE_ENGINE_SIDE_SCROLL,
		"tilesize": 20
	};

	var gameSettings = $.extend({}, gameSettingsDefault, gameSettings);

	// ------------------------------

	this.doDraw = function() {

	}

	this.loadMap = function(mapData) {

	}

	this.setLayerState = function(layer, state) {
		
	}
}