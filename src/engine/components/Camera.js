/**
 * Engine default Camera.
 */
Lucid.Camera = Lucid.BaseComponent.extend({
	// config variables and their default values
	x: 0,
	y: 0,
	width: 0,
	height: 0,

	// local variables
	followTarget: null,
	halfWidth: 0,
	halfHeight: 0,

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
			this.x += Math.floor((this.followTarget.x - this.x - this.halfWidth + this.followTarget.halfWidth) * delta);
			this.y += Math.floor((this.followTarget.y - this.y - this.halfHeight + this.followTarget.halfHeight) * delta);
		}
	},

	/**
	 * Tells the Camera to follow a certain object. Important: The object
	 * requires x / y / halfWidth / halfHeight properties.
	 *
	 * @param      {Object}   followTarget  The follow target Object.
	 * @param      {Boolean}  instant       Jump onto target without easing?
	 */
	setFollowTarget: function(followTarget, instant) {
		if (followTarget != null) {
			if ("x" in followTarget && "y" in followTarget && "halfWidth" in followTarget && "halfHeight" in followTarget) {
				this.followTarget = followTarget;

				if (instant) {
					this.x = Math.floor(this.followTarget.x - this.halfWidth + this.followTarget.halfWidth);
					this.y = Math.floor(this.followTarget.y - this.halfHeight + this.followTarget.halfHeight);
				}
			} else {
				Lucid.Utils.error("Camera @ setFollowObject: the followTarget object doesnt have proper properties - x, y, halfWidth, halfHeight are required!");
			}
		} else {
			this.followTarget = null;
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
		var wWidth = config.wWidth;
		var wHeight = config.wHeight;

		this.width = wWidth;
		this.height = wHeight;
		this.halfWidth = wWidth / 2;
		this.halfHeight = wHeight / 2;
	}
});