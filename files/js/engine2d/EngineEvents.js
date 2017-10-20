// ----------------------------------
// events:

// engine
const EVENT_TOGGLE_LAYER = "eventToggleLayer";
const EVENT_PAUSE = "eventPause";
const EVENT_PLAY = "eventPlay";
const EVENT_LOAD_MAP = "eventPlay";
// controls
const EVENT_CONTROL_LEFT = "eventControlLeft";
const EVENT_CONTROL_RIGHT = "eventControlRight";
const EVENT_CONTROL_JUMP = "eventControlJump";
const EVENT_CONTROL_ACTION = "eventControlAction";

// ----------------------------------

function EngineEvents() {
	console.log("EngineEvents");
	
	var registeredObjects = {};

	this.dispatch = function(eventType, data) {

	}

	this.addListener = function(eventType, object) {

	}

	this.removeListener = function(eventType, object) {

	}
}