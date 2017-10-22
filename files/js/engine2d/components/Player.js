
function Player(config) {
	EngineUtils.log("Player");

	var configDefault = {
		"health": 100, // health percentage
		"speed": 1, // speed
		"weight": 80, // weight in kilograms
		"active": 1 // only active users can be controlled
	};

	var config = $.extend({}, configDefault, config);

	Component.call(this, config);

	var health = config.health;
	var speed = config.speed;
	var weight = config.weight;

	// // setup
	var controls = {};

	this.addControl = function(control) {
		controls[control.getType] = control;
	}
}