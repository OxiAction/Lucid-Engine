/**
* Game custom EntityFighter - extends BaseEntity.
*/
var EntityPassant = Lucid.BaseEntity.extend({
	// config variables and their default values
	// ...

	// local variables
	animInterval: null,
	animCounter: 0,

	counter: 0,
	dir: 1,

	init: function(config) {
		this._super(config);

		this.componentName = "EntityPassant";
		this.componentNamespace = ".EntityPassant";

		this.width = 32;
		this.height = 48;
		this.speed = 8;

		this.animInterval = setInterval(this.updateAnim.bind(this), 500);

		this.updateAnim();

		return true;
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
			filePath = "playground/entity_passant.png";
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
		this._super(delta);
	},

	tileSetLoaded: function(event, loaderItem) {
		var camera = Lucid.data.engine.getCamera();
		if (camera) {
			camera.setFollowObject(this);
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