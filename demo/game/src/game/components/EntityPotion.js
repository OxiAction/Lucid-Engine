/**
* Game custom EntityFighter - extends BaseEntity.
*/
var EntityPotion = Lucid.BaseEntity.extend({
	// config variables and their default values
	// ...

	// local variables
	animInterval: null,
	animCounter: 0,

	init: function(config) {
		this.componentName = "EntityPotion";
		this.width = 16;
		this.height = 17;
		this.sightRadius = 400;
		this.assetFilePath = "assets/potion.png";
		
		this._super(config);
		
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
			// this.assetX = 0;
		} else if (this.animCounter == 1) {
			// this.assetX = this.width * 2;
		}

		this.animCounter++;
	},

	renderUpdate: function(delta) {
		this._super(delta);
	},

	renderDraw: function(interpolationPercentage) {
		this._super(interpolationPercentage);
	},

	destroy: function() {
		if (this.animInterval) {
			clearInterval(this.animInterval);
			this.animInterval = null;
		}

		this._super();
	}
});