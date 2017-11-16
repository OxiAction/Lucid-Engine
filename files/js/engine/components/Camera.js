/**
 * Engine default Camera.
 *
 * @type       {Camera}
 */
Lucid.Camera = BaseComponent.extend({
	// config variables and their default values
	positionX: 0,
    positionY: 0,

    offsetX: 0,
    offsetY: 0,

	// local variables

	// TODO: remove this
	// this is just quick & dirty controls implementation
	// usually this should be done using a Control component and accessing the Camera.x / Camera.y
	pressedKeys: {},
	keyDownHandler: null,
	keyUpHandler: null,

	followObject: null,

	/**
	  * Automatically called when instantiated.
	  *
	  * @param      {Object}   config  The configuration.
	  * @return     {boolean}  Returns true on success.
	  */
	init: function(config) {
		this.componentName = "Camera";
		
		this._super(config);

		// TODO: remove this
		// this is just quick & dirty controls implementation
		// usually this should be done using a Control component and accessing the Camera.x / Camera.y
		// this.keyDownHandler = this.onKeyDown.bind(this);
		// window.addEventListener("keydown", this.keyDownHandler);
		// this.keyUpHandler = this.onKeyUp.bind(this);
		// window.addEventListener("keyup", this.keyUpHandler);

		return true;
	},

	// TODO: remove this
	// this is just quick & dirty controls implementation
	// usually this should be done using a Control component and accessing the Camera.x / Camera.y
	onKeyDown: function(e) {
		var keyCode = e.keyCode;
		if (keyCode in Lucid.Camera.KEYCODE) {
			e.preventDefault();
			this.pressedKeys[keyCode] = true;
		}
	},

	// TODO: remove this
	// this is just quick & dirty controls implementation
	// usually this should be done using a Control component and accessing the Camera.x / Camera.y
	onKeyUp: function(e) {
		var keyCode = e.keyCode;
		if (keyCode in Lucid.Camera.KEYCODE) {
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
					this.positionY -= 1;
				}
				if (key == 39) {
					this.positionX += 1;
				}
				if (key == 40) {
					this.positionY += 1;
				}
				if (key == 37) {
					this.positionX -= 1;
				}
			}
		}

		if (this.followObject != null) {
  			// set new camera position and ease it a bit
  			this.positionX += (this.followObject.positionX - this.positionX - (this.width / 2) + (this.followObject.width / 2)) * 0.01;
  			this.positionY += (this.followObject.positionY - this.positionY - (this.height / 2) + (this.followObject.height / 2)) * 0.01;
		}
	},

	/**
	 * Tells the Camera to follow a certain object.
	 * Important: The object must have positionX / positionY / width / height properties.
	 *
	 * @param      {Object}  object  The object
	 */
	setFollowObject: function(object) {
		if ("positionX" in object && "positionY" in object && "width" in object && "height" in object) {
			this.followObject = object;
			// TODO: remove possible controls from Camera when setting to follow mode
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