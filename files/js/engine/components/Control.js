/**
* Engine default Control.
*/
Lucid.Control = BaseComponent.extend({
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
			Lucid.Utils.error("Control type is null");
			return;
		}

		return true;
	}
});

// type constants
Lucid.Control.TYPE = {
	UP: "up",
	DOWN: "down",
	LEFT: "left",
	RIGHT: "right",
	CUSTOM: "custom"
};