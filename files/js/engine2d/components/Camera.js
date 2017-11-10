/**
 * Engine2D default Camera.
 *
 * @type       {Camera}
 */
var Camera = BaseComponent.extend({
	// config variables and their default values

	// local variables
	x: 0,
	y: 0,
	width: 0,
	height: 0,
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

	draw: function(config) {
		for (var key in this.pressedKeys) {
			if (this.pressedKeys[key] == true) {
				if (key == 38) {
					this.y -= 1;
				}
				if (key == 39) {
					this.x += 1;
				}
				if (key == 40) {
					this.y += 1;
				}
				if (key == 37) {
					this.x -= 1;
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
Camera.KEYCODE = {
	38: "up",
	39: "right",
	40: "down",
	37: "left"
};