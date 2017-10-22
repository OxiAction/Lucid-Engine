const TYPE_CONTROL_UP = "typeControlUp";
const TYPE_CONTROL_DOWN = "typeControlDown";
const TYPE_CONTROL_LEFT = "typeControlLeft";
const TYPE_CONTROL_RIGHT = "typeControlRight";
const TYPE_CONTROL_SHOOT = "typeControlShoot"; // shoot attack
const TYPE_CONTROL_MELEE = "typeControlMelee"; // melee attack

function Control(config) {
	EngineUtils.log("Control");

	var configDefault = {
		"type": null, // TYPE_CONTROL_xxx
		"active": 1, // activate control
		"key": null // key code
	};

	var config = $.extend({}, configDefault, config);

	Component.call(this, config);

	if (config.type == null) {
		EngineUtils.error(this, "type is null");
		return;
	}
}