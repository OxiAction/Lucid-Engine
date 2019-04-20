// namespace
var Game = Game || {};

/**
* Game custom ui Layer - extends Layer.
*/
Game.LayerUI = Lucid.BaseLayer.extend({
	// config variables and their default values
	// ...

	// local variables
	keyDown: false,

	/**
	 * Automatically called when instantiated.
	 *
	 * @param      {Object}   config  The configuration.
	 * @return     {boolean}  Returns true on success.
	 */
	init: function(config) {
		this.componentName = "LayerMenu";

		this._super(config);

		this.checkSetCamera();
		this.checkSetEngine();

		Lucid.Event.bind(Lucid.Input.EVENTS.KEY_DOWN + this.componentNamespace, this.handleKeyDown.bind(this));

		return true;
	},

	handleKeyDown: function(eventName, code) {
		// check for mouse left click AND active state
		if ((code == Lucid.Input.KEYS["MOUSE_LEFT"] || code == "touchstart") && this.getActive()) {
			this.keyDown = true;
		}
	},

	/**
	 * The renderUpdate() function should simulate anything that is affected by
	 * time. It can be called zero or more times per frame depending on the
	 * frame rate.
	 *
	 * @param      {Number}  delta   The amount of time in milliseconds to
	 *                               simulate in the update.
	 */
	renderUpdate: function(delta) {
	},

	/**
	 * Draw things.
	 *
	 * @param      {Number}  interpolationPercentage  The cumulative amount of
	 *                                                time that hasn't been
	 *                                                simulated yet, divided by
	 *                                                the amount of time that
	 *                                                will be simulated the next
	 *                                                time renderUpdate() runs.
	 *                                                Useful for interpolating
	 *                                                frames.
	 */
	renderDraw: function(interpolationPercentage) {
		if (!this.getActive()) {
			// clear everything
			this.canvasContext.clearRect(0, 0, this.camera.width, this.camera.height);
			return;
		}

		var canvasContext = this.canvasContext;

		var width = this.camera.width;
		var height = this.camera.height;

		canvasContext.width = width;
		canvasContext.height = height;
		canvasContext.clearRect(0, 0, width, height);

		var inputPosition = Lucid.Input.getPosition();

		// MENU BUTTON

			canvasContext.fillStyle = "#666";

			// check hover
			if (inputPosition.x > width - 40 && inputPosition.x < width
				&& inputPosition.y > 0 && inputPosition.y < 40) {

				canvasContext.fillStyle = "#999";

				// trigger
				if (this.keyDown) {
					Lucid.Event.trigger(Game.LayerUI.EVENT.MENU_BUTTON_KEY_DOWN);
				}
			}

			canvasContext.fillRect(width - 40, 0, 40, 40);

			canvasContext.strokeStyle = "red";
			canvasContext.lineWidth = 1;
			canvasContext.strokeRect(width - 40, 0, 40, 40);
			
			canvasContext.beginPath();

			canvasContext.moveTo(width - 35, 10);
			canvasContext.lineTo(width - 5, 10);

			canvasContext.moveTo(width - 35, 20);
			canvasContext.lineTo(width - 5, 20);

			canvasContext.moveTo(width - 35, 30);
			canvasContext.lineTo(width - 5, 30);

			canvasContext.stroke();

		// END MENU BUTTON

		// reset
		this.keyDown = false;
	}
});

Game.LayerUI.EVENT = {
	MENU_BUTTON_KEY_DOWN: "menuButtonKeyDown"
};