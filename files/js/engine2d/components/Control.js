const TYPE_CONTROL_UP = "typeControlUp";
const TYPE_CONTROL_DOWN = "typeControlDown";
const TYPE_CONTROL_LEFT = "typeControlLeft";
const TYPE_CONTROL_RIGHT = "typeControlRight";
const TYPE_CONTROL_SHOOT = "typeControlShoot"; // shoot attack
const TYPE_CONTROL_MELEE = "typeControlMelee"; // melee attack
const TYPE_CONTROL_CUSTOM = "typeControlCustom"; // for custom events

function Control(config) {
	EngineUtils.log("Control");

	var configDefault = {
		"type": null, // TYPE_CONTROL_xxx
		"active": true, // activate control
		"key": null // key code
	};

	var config = $.extend({}, configDefault, config);

	Component.call(this, config);

	var self = this;

	var type = self.getType();
	var active = self.getActive();

	if (type == null) {
		EngineUtils.error("control type is null");
		return;
	}
}