/**
* Game custom EntityFighter - extends BaseEntity.
*/
var EntityFighter = Lucid.BaseEntity.extend({
	// config variables and their default values
	// ...

	// local variables
	animInterval: null,
	animCounter: 0,

	aiModuleAttack: null,
	aiModuleFollow: null,

	showInformation: true, // render informations

	healthPointsMaximum: 100,
	healthPointsCurrent: 60,
	manaPointsMaximum: 50,
	manaPointsCurrent: 40,

	init: function(config) {
		this.componentName = "EntityFighter";
		this.width = 32;
		this.height = 48;
		this.speed = 5;
		this.sightRadius = 400;
		this.assetFilePath = "assets/entity_fighter.png";
		
		this._super(config);

		// randomize values :D
		this.healthPointsCurrent = Math.random() * (this.healthPointsMaximum - 5) + 5;
		this.manaPointsCurrent = Math.random() * (this.manaPointsMaximum - 5) + 5;
		
		this.animInterval = setInterval(this.updateAnim.bind(this), 500);
		this.updateAnim();

		Lucid.Event.bind(Lucid.BaseEntity.EVENT.COLLISION + this.componentNamespace, this.handleCollision.bind(this));

		var ai = new Lucid.AI({
			originEntity: this
		});

		var fsm = new Game.AI.Fighter.FSM({
			ai: ai
		});

		ai.setFSM(fsm);

		this.setAI(ai);

		return true;
	},

	handleCollision: function(eventName, originEntity, item, collisionData) {
		if (originEntity != this) {
			return;
		}

		if (item.componentName == "EntityPotion") {
			var layerEntities = this.engine.getLayerEntities();
			if (layerEntities) {
				layerEntities.removeEntity(item.id);
			}
		}
	},

	updateAnim: function() {
		if (!this.getActive()) {
			return;
		}

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
		
		Lucid.Event.unbind(Lucid.BaseEntity.EVENT.COLLISION + this.componentNamespace);

		Lucid.Event.unbind(Lucid.AIModuleAttack.EVENT.START_ATTACK + this.componentNamespace);
		Lucid.Event.unbind(Lucid.AIModuleAttack.EVENT.STOP_ATTACK + this.componentNamespace);

		Lucid.Event.unbind(Lucid.AIModuleFollow.EVENT.START_FOLLOW + this.componentNamespace);
		Lucid.Event.unbind(Lucid.AIModuleFollow.EVENT.STOP_FOLLOW + this.componentNamespace);

		this._super();
	}
});