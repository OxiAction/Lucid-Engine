/**
 * Engine default Camera.
 *
 * @type       {Camera}
 */
Lucid.Camera = BaseComponent.extend({
	// config variables and their default values
	x: 0,
    y: 0,

    offsetX: 0,
    offsetY: 0,

	// local variables
	followObject: null,

	/**
	  * Automatically called when instantiated.
	  *
	  * @param      {Object}   config  The configuration.
	  * @return     {Boolean}  Returns true on success.
	  */
	init: function(config) {
		this.componentName = "Camera";
		
		this._super(config);

		return true;
	},

	/**
	 * The renderUpdate() function should simulate anything that is affected by time.
	 * It can be called zero or more times per frame depending on the frame
	 * rate.
	 *
	 * @param      {Number}  delta   The amount of time in milliseconds to
	 *                               simulate in the update.
	 */
	renderUpdate: function(delta) {
		if (this.followObject) {
  			this.x += Math.floor((this.followObject.x - this.x - (this.width / 2) + (this.followObject.width / 2)) * delta);
  			this.y += Math.floor((this.followObject.y - this.y - (this.height / 2) + (this.followObject.height / 2)) * delta);
		}
	},

	/**
	 * Tells the Camera to follow a certain object.
	 * Important: The object requires x / y / width / height properties.
	 *
	 * @param      {Object}  object  The object
	 */
	setFollowObject: function(followObject) {
		if ("x" in followObject && "y" in followObject && "width" in followObject && "height" in followObject) {
			this.followObject = followObject;
		} else {
			Lucid.Utils.error("Camera @ setFollowObject: the object doesnt have proper properties - x, y, width, height are required!");
		}
	},

	resize: function(config) {
		this.width = config.wWidth;
		this.height = config.wHeight;
	}
});