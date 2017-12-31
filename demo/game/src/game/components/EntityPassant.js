/**
* Game custom EntityPassant - extends BaseEntity.
*/
var EntityPassant = Lucid.BaseEntity.extend({
	// config variables and their default values
	// ...

	// local variables
	animInterval: null,
	animCounter: 0,

	init: function(config) {
		this.componentName = "EntityPassant";
		this.width = 32;
		this.height = 48;
		this.speed = 20;
		this.assetFilePath = "assets/entity_passant.png";
		
		this._super(config);
		
		this.animInterval = setInterval(this.updateAnim.bind(this), 500);
		this.updateAnim();

		Lucid.Event.bind(Lucid.BaseEntity.EVENT.COLLISION + this.componentNamespace, this.collision.bind(this));

		return true;
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
		
		this._super(delta);
	},

	renderDraw: function(interpolationPercentage) {
		this._super(interpolationPercentage);
	},

	collision(eventName, originEntity, item, collisionData) {
		if (item.componentName == "EntityPotion" && originEntity == this) {
			console.log(collisionData);
			var layerEntities = this.engine.getLayerEntities();
			if (layerEntities) {
				layerEntities.removeEntity(item.getID());
			}
		}
	},

	destroy: function() {
		Lucid.Event.unbind(Lucid.BaseEntity.EVENT.COLLISION + this.componentNamespace, this.collision.bind(this));

		if (this.animInterval) {
			clearInterval(this.animInterval);
			this.animInterval = null;
		}

		this._super();
	}
});