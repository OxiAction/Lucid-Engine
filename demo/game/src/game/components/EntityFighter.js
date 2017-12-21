/**
* Game custom EntityFighter - extends BaseEntity.
*/
var EntityFighter = Lucid.BaseEntity.extend({
	// config variables and their default values
	// ...

	// local variables
	animInterval: null,
	animCounter: 0,

	ais: [],

	init: function(config) {
		this.componentName = "EntityFighter";
		this.width = 32;
		this.height = 48;
		this.sightRadius = 400;
		this.assetFilePath = "assets/entity_fighter.png";
		
		this._super(config);
		
		this.animInterval = setInterval(this.updateAnim.bind(this), 500);
		this.updateAnim();

		var ai = new Lucid.AI({
			target: this,
			behavior: {
				type: Lucid.AI.BEHAVIOR.TYPE.HOLD,
				data: {
					moveOnTrigger: true
				}
			}
		});

		this.addAI(ai);

		return true;
	},

	addAI: function(ai) {
		this.ais.push(ai);
	},

	removeAI: function(ai) {
		ai.destroy();
		this.ais.erase(ai);
		ai = null;
	},

	updateAnim: function() {
		// 0 - 1
		if (this.animCounter == 2) {
			this.animCounter = 0;
		}

		if (this.animCounter == 0) {
			this.assetX = 0;
		} else if (this.animCounter == 1) {
			this.assetX = this.width * 2;
		}

		this.animCounter++;
	},

	renderUpdate: function(delta) {
		for (var i = 0; i < this.ais.length; ++i) {
			var ai = this.ais[i];
			ai.renderUpdate(delta);
		}

		this._super(delta);
	},

	renderDraw: function(interpolationPercentage) {
		switch (this.dir) {
			case Lucid.BaseEntity.DIR.RIGHT:
				this.assetY = 96;
			break;

			case Lucid.BaseEntity.DIR.LEFT:
				this.assetY = 48;
			break;

			case Lucid.BaseEntity.DIR.UP:
				this.assetY = 144;
			break;

			default:
				this.assetY = 0;
		}

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