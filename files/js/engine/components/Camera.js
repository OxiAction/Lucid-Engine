/**
 * Engine default Camera.
 */
Lucid.Camera = BaseComponent.extend({
	// config variables and their default values
	x: 0,
	y: 0,

	offsetX: 0,
	offsetY: 0,

	// local variables
	followTarget: null,

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
		if (this.followTarget) {
			this.x += Math.floor((this.followTarget.x - this.x - (this.width / 2) + (this.followTarget.width / 2)) * delta);
			this.y += Math.floor((this.followTarget.y - this.y - (this.height / 2) + (this.followTarget.height / 2)) * delta);
		}
	},

	/**
	 * Tells the Camera to follow a certain object.
	 * Important: The object requires x / y / width / height properties.
	 *
	 * @param      {Object}  object  The object
	 */
	setFollowTarget: function(followTarget) {
		if ("x" in followTarget && "y" in followTarget && "width" in followTarget && "height" in followTarget) {
			this.followTarget = followTarget;
		} else {
			Lucid.Utils.error("Camera @ setFollowObject: the target object doesnt have proper properties - x, y, width, height are required!");
		}
	},

	/**
	 * Resize method. Usually called when the screen / browser dimensions have
	 * changed.
	 *
	 * @param      {Object}  config  The configuration which must contain the
	 *                               properties wWidth and wHeight.
	 */
	resize: function(config) {
		this.width = config.wWidth;
		this.height = config.wHeight;
	}
});