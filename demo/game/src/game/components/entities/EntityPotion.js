// namespace
var Game = Game || {};

/**
* Game custom EntityFighter - extends BaseEntity.
*/
Game.EntityPotion = Lucid.BaseEntity.extend({
	// config variables and their default values
	// ...

	// local variables
	// ...

	init: function(config) {
		this.componentName = "EntityPotion";
		this.width = 16;
		this.height = 17;
		this.sightRadius = 400;
		this.assetFilePath = "assets/potion.png";
		
		this._super(config);

		return true;
	},

	renderUpdate: function(delta) {
		this._super(delta);
	},

	renderDraw: function(interpolationPercentage) {
		this._super(interpolationPercentage);
	},

	destroy: function() {
		this._super();
	}
});