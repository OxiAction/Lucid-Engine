/**
 * Engine default Camera.
 *
 * @type       {Camera}
 */
Lucid.Camera = BaseComponent.extend({
	// config variables and their default values

	// local variables
	position: {
        x: 0,
        y: 0
    },
    offset: {
    	x: 0,
    	y: 0
    },
	// TODO: remove this
	// this is just quick & dirty controls implementation
	// usually this should be done using a Control component and accessing the Camera.x / Camera.y
	pressedKeys: {},
	keyDownHandler: null,
	keyUpHandler: null,

	/**
	  * Automatically called when instantiated.
	  *
	  * @param      {Object}   config  The configuration.
	  * @return     {boolean}  Returns true on success.
	  */
	init: function(config) {
		this.componentName = "Camera";
		
		this._super(config);

		this.keyDownHandler = this.onKeyDown.bind(this);
		window.addEventListener("keydown", this.keyDownHandler);
    	this.keyUpHandler = this.onKeyUp.bind(this);
    	window.addEventListener("keyup", this.keyUpHandler);

		return true;
	},

	// TODO: remove this
	// this is just quick & dirty controls implementation
	// usually this should be done using a Control component and accessing the Camera.x / Camera.y
	onKeyDown: function(e) {
		var keyCode = e.keyCode;
		if (keyCode in Camera.KEYCODE) {
			e.preventDefault();
			this.pressedKeys[keyCode] = true;
		}
	},

	// TODO: remove this
	// this is just quick & dirty controls implementation
	// usually this should be done using a Control component and accessing the Camera.x / Camera.y
	onKeyUp: function(e) {
		var keyCode = e.keyCode;
		if (keyCode in Camera.KEYCODE) {
			e.preventDefault();
			this.pressedKeys[keyCode] = false;
		}
	},

	/**
	 * Draw.
	 *
	 * @param      {number}  delta   The delta.
	 * @param      {Object}  config  The configuration.
	 */
	draw: function(delta, config) {
		for (var key in this.pressedKeys) {
			if (this.pressedKeys[key] == true) {
				if (key == 38) {
					this.position.y -= 1;
				}
				if (key == 39) {
					this.position.x += 1;
				}
				if (key == 40) {
					this.position.y += 1;
				}
				if (key == 37) {
					this.position.x -= 1;
				}
			}
		}
	},

	resize: function(config) {
		this.width = config.wWidth;
		this.height = config.wHeight;
	}
});

// TODO: remove this
// this is just quick & dirty controls implementation
// usually this should be done using a Control component and accessing the Camera.x / Camera.y
Lucid.Camera.KEYCODE = {
	38: "up",
	39: "right",
	40: "down",
	37: "left"
};