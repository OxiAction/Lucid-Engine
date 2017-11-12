/**
* Engine default Control.
*/
var Control = BaseComponent.extend({
	// config variables and their default values
	key: null, // keycode

	// local variables
	// ...
	
	/**
	  * Automatically called when instantiated.
	  *
	  * @param      {Object}   config  The configuration.
	  * @return     {boolean}  Returns true on success.
	  */
	init: function(config) {
		this.componentName = "Control";

		this._super(config);

		if (this.type == null) {
			EngineUtils.error("Control type is null");
			return;
		}

		return true;
	}
});

// type constants
Control.TYPE = {
	UP: "up",
	DOWN: "down",
	LEFT: "left",
	RIGHT: "right",
	CUSTOM: "custom"
};