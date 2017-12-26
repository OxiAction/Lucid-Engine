/**
 * Engine default Control.
 * 
 * @deprecated Dont use this anymore.
 */
Lucid.Control = Lucid.BaseComponent.extend({
	// config variables and their default values
	key: null, // keycode
	callback: null,

	// local variables
	target: null,
	
	/**
	 * Automatically called when instantiated.
	 *
	 * @param      {Object}   config  The configuration.
	 * @return     {Boolean}  Returns true on success.
	 */
	init: function(config) {
		this.componentName = "Control";

		this._super(config);

		if (this.key == null) {
			Lucid.Utils.error("Control @ init: key is null!");
			return;
		}

		if (this.callback == null) {
			Lucid.Utils.error("Control @ init: callback is null!");
		}

		return true;
	},

	/**
	 * Trigger this Control.
	 */
	trigger: function() {
		this.callback(this.target, this.key);
	},

	/**
	 * Sets the target.
	 *
	 * @param      {Object}  target  The target.
	 */
	setTarget: function(target) {
		this.target = target;
	},

	/**
	 * Gets the current target or null.
	 *
	 * @return     {Object}  The target.
	 */
	getTarget: function() {
		return this.target;
	}
});

/**
 * Engine default ControlGroup.
 */
Lucid.ControlGroup = Lucid.BaseComponent.extend({
	// config variables and their default values
	controls: [],

	// local variables
	pressedKeys: {},
	keyDownHandler: null,
	keyUpHandler: null,

	numPressedKeys: 0,
	
	/**
	 * Automatically called when instantiated.
	 *
	 * @param      {Object}   config  The configuration.
	 * @return     {Boolean}  Returns true on success.
	 */
	init: function(config) {
		this.componentName = "ControlGroup";

		this._super(config);

		return true;
	},

	onKeyDown: function(e) {
		var keyCode = e.keyCode;
		e.preventDefault();
		this.pressedKeys[keyCode] = true;
		this.numPressedKeys++;
	},

	onKeyUp: function(e) {
		var keyCode = e.keyCode;
		e.preventDefault();
		this.pressedKeys[keyCode] = false;
		this.numPressedKeys--;
	},

	renderUpdate: function(delta) {
		// only update if necessary
		if (this.numPressedKeys > 0) {
			for (var i = 0; i < this.controls.length; ++i) {
				var control = this.controls[i];
				if (this.pressedKeys[control.key]) {
					control.trigger();
				}
			}
		}
	},

	addControl: function(control) {
		controls.push(control);
	},

	removeControl: function(control) {
		control.destroy();
		controls.erase(control);
		control = null;
	},

	setTarget: function(target) {

		if (target) {
			this.keyDownHandler = this.onKeyDown.bind(this);
			window.addEventListener("keydown", this.keyDownHandler);
			this.keyUpHandler = this.onKeyUp.bind(this);
			window.addEventListener("keyup", this.keyUpHandler);
		} else {
			if (this.keyDownHandler) {
				window.removeEventListener("keydown", this.keyDownHandler);
				this.keyDownHandler = null;
		
			}
			if (this.keyUpHandler) {
				window.removeEventListener("keyup", this.keyUpHandler);
				this.keyUpHandler = null;
			}
		}

		this.target = target;
		for (var i = 0; i < this.controls.length; ++i) {
			var control = this.controls[i];
			control.setTarget(target);
		}
	}
});

// type constants
Lucid.Control.KEY = {
	// misc
	TAB: 9,
	ENTER: 13,
	SHIFT: 16,
	CTRL: 17,
	ALT: 18,
	ESCAPE: 27,
	SPACEBAR: 32,

	// arrows
	UP: 38,
	DOWN: 40,
	LEFT: 37,
	RIGHT: 39,

	// numbers (NOT numpad!)
	NUM_0: 48,
	NUM_1: 49,
	NUM_2: 50,
	NUM_3: 51,
	NUM_4: 52,
	NUM_5: 53,
	NUM_6: 54,
	NUM_7: 55,
	NUM_8: 56,
	NUM_9: 57,

	// letters
	A: 65,
	B: 66,
	C: 67,
	D: 68,
	E: 69,
	F: 70,
	G: 71,
	H: 72,
	I: 73,
	J: 74,
	K: 75,
	L: 76,
	M: 77,
	N: 78,
	O: 79,
	P: 80,
	Q: 81,
	R: 82,
	S: 83,
	T: 84,
	U: 85,
	V: 86,
	W: 87,
	X: 88,
	Y: 89,
	Z: 90
};