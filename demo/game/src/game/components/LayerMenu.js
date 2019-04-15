/**
* Game custom menu Layer - extends Layer.
*/
var LayerMenu = Lucid.BaseLayer.extend({
	// config variables and their default values
	// ...

	// local variables
	menuConfigMain: {
		start: {
			label: "START",
			active: true,
			go: "menu#menuConfigSelectMap"
		},

		options: {
			label: "OPTIONS",
			active: true
		},

		credits: {
			label: "CREDITS",
			active: true
		}
	},

	menuConfigSelectMap: {
		back: {
			label: "BACK",
			active: true,
			go: "menu#menuConfigMain"
		},

		map1: {
			label: "MAP 1",
			active: true,
			go: "map#map1"
		},

		map2: {
			label: "MAP 2",
			active: true,
			go: "map#map2"
		},

		map3: {
			label: "MAP 3",
			active: true,
			go: "map#map3"
		}
	},

	menuConfigIngame: {
		back: {
			label: "BACK TO GAME",
			active: true,
			go: "event#closeMenu"
		},

		save: {
			label: "SAVE GAME",
			active: true
		},

		load: {
			label: "LOAD GAME",
			active: true
		},

		quit: {
			label: "MAIN MENU",
			active: true,
			go: "menu#menuConfigMain"
		}
	},

	currentMenuConfig: null,
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

		this.setCurrentMenuConfig(this.menuConfigMain);

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
		if (!this.getActive() || !this.currentMenuConfig) {
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

		canvasContext.fillStyle = "#26333333"; // 26 = 15% alpha
		canvasContext.fillRect(0, 0, width, height);

		var buttonConfig;
		var buttons = [];
		for (var button in this.currentMenuConfig) {
			buttonConfig = this.currentMenuConfig[button];
			buttonConfig.id = button;

			if (buttonConfig.active === true) {
				buttons.push(buttonConfig);
			}
		}

		for (var i = 0; i < buttons.length; ++i) {
			buttonConfig = buttons[i];
			var buttonWidth = 300;//buttonConfig.label.length * 10;

			this.addButtonToCanvasContext(canvasContext, buttonConfig, (width / 2) - (buttonWidth / 2), (height / 2) + (i * 55) - (buttons.length * 55 / 2) + 2, buttonWidth, 50);
		}

		// reset
		this.keyDown = false;
	},

	addButtonToCanvasContext: function(canvasContext, buttonConfig, x, y, width, height) {
		var id = buttonConfig.id;
		var label = buttonConfig.label;
		var go = buttonConfig.go;

		canvasContext.fillStyle = "#666";

		var inputPosition = Lucid.Input.getPosition();

		// check hover
		if (inputPosition.x > x && inputPosition.x < x + width
			&& inputPosition.y > y && inputPosition.y < y + height) {

			canvasContext.fillStyle = "#999";

			// trigger
			if (this.keyDown && go != undefined) {
				var split = go.split("#");
				var type = split[0];
				var value = split[1];
				if (type == "menu") {
					this.setCurrentMenuConfig(this[value]);
				} else if (type == "map") {
					this.engine.loadMap(value);
				} else if (type == "event") {
					Lucid.Event.trigger(LayerMenu.EVENT.CUSTOM_EVENT, value);
				}
			}
		}

		canvasContext.fillRect(x, y, width, height);

		// stroke
		canvasContext.strokeStyle = "red";
		canvasContext.lineWidth = 1;
		canvasContext.strokeRect(x, y, width, height);

		if (label != undefined) {
			canvasContext.fillStyle = "red";
			canvasContext.font = "normal 30px Arial, Helvetica Neue, Helvetica, sans-serif";
			canvasContext.fillText(label, x, y + height - 1);
		}
	},

	setCurrentMenuConfig: function(currentMenuConfig) {
		this.currentMenuConfig = currentMenuConfig;
	},

	/**
	 * Sets the active state.
	 *
	 * @param      {Boolean}  active  The value.
	 */
	setActive: function(active) {
		this._super(active);
	},
});

LayerMenu.EVENT = {
	CUSTOM_EVENT: "customEvent"
};