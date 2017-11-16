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

		if (this.counter == 20) {
			this.dir = 0;
		} else if (this.counter == 0) {
			this.dir = 1;
		}

		if (this.dir == 0) {
			this.counter--;
			this.positionX -= 2;
		} else {
			this.counter++;
			this.positionX += 2;
		}

		this.animCounter++;
	},

	loadTileSet: function(filePath) {
		if (filePath == undefined) {
			filePath = "playground/entity_passant.png";
		}

		this._super(filePath);
	},

	draw: function(delta, config) {
		return this._super(delta, config);
	},

	tileSetLoaded: function(event, loaderItem) {
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