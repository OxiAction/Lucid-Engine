/**
* Game custom EntityFighter - extends BaseEntity.
*/
var EntityFighter = Lucid.BaseEntity.extend({
	// config variables and their default values
	// ...

	// local variables
	animInterval: null,
	animCounter: 0,

	// TODO: remove this
	// this is just quick & dirty controls implementation
	// usually this should be done using a Control component and accessing the Camera.x / Camera.y
	pressedKeys: {},
	keyDownHandler: null,
	keyUpHandler: null,

	init: function(config) {
		this._super(config);
		this.componentName = "EntityFighter";
		this.componentNamespace = ".EntityFighter";

		this.width = 32;
		this.height = 48;

		this.animInterval = setInterval(this.updateAnim.bind(this), 500);

		this.updateAnim();

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

	updateAnim: function() {
		// 0 - 1
		if (this.animCounter == 2) {
			this.animCounter = 0;
		}

		if (this.animCounter == 0) {
			this.sourceX = 0;
		} else if (this.animCounter == 1) {
			this.sourceX = this.width * 2;
		}

		this.animCounter++;
	},

	loadTileSet: function(filePath) {
		if (filePath == undefined) {
			filePath = "playground/entity_fighter.png";
		}

		this._super(filePath);
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
		for (var key in this.pressedKeys) {
			if (this.pressedKeys[key] == true) {
				if (key == 39) { // right
					this.x += 1;
					this.sourceY = 96;
				}
				if (key == 37) { // left
					this.x -= 1;
					this.sourceY = 48;
				}

				if (key == 40) { // down
					this.y += 1;
					this.sourceY = 0;
				}
				if (key == 38) { // up
					this.y -= 1;
					this.sourceY = 144;
				}
			}
		}

		this._super(delta);
	},

	tileSetLoaded: function(event, loaderItem) {
		var camera = Lucid.data.engine.getCamera();
		if (camera) {
			// camera.setFollowObject(this);
		}

		this._super(event, loaderItem);
	},

	destroy: function() {
		if (this.animInterval) {
			clearInterval(this.animInterval);
			this.animInterval = null;
		}

		this._super();
	}
});