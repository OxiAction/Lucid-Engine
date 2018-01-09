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

	init: function(config) {
		this.componentName = "EntityFighter";
		this.width = 32;
		this.height = 48;
		this.speed = 5;
		this.sightRadius = 400;
		this.assetFilePath = "assets/entity_fighter.png";
		
		this._super(config);
		
		this.animInterval = setInterval(this.updateAnim.bind(this), 500);
		this.updateAnim();

		Lucid.Event.bind(Lucid.AIModuleAttack.EVENT.START_ATTACK + this.componentNamespace, this.handleStartAttack.bind(this));
		Lucid.Event.bind(Lucid.AIModuleAttack.EVENT.STOP_ATTACK + this.componentNamespace, this.handleStopAttack.bind(this));
		Lucid.Event.bind(Lucid.AIModuleFollow.EVENT.START_FOLLOW + this.componentNamespace, this.handleStartFollow.bind(this));
		Lucid.Event.bind(Lucid.AIModuleFollow.EVENT.STOP_FOLLOW + this.componentNamespace, this.handleStopFollow.bind(this));
		
		var ai = new Lucid.AI({
			originEntity: this
		});

		this.aiModuleAttack = new Lucid.AIModuleAttack();
		ai.addModule(this.aiModuleAttack);

		this.aiModuleFollow = new Lucid.AIModuleFollow();
		ai.addModule(this.aiModuleFollow);

		this.setAI(ai);

		return true;
	},

	handleStartAttack: function(eventName, originEntity, targetEntity) {
		if (originEntity != this) {
			return;
		}

		Lucid.Utils.log("EntityFighter @ handleStartAttack");

		this.aiModuleFollow.setActive(false);

		if (originEntity.relativeCenterX < targetEntity.relativeCenterX) {
			originEntity.dir = Lucid.BaseEntity.DIR.RIGHT;
		}
	},

	handleStopAttack: function(eventName, originEntity) {
		if (originEntity != this) {
			return;
		}

		Lucid.Utils.log("EntityFighter @ handleStopAttack");

		this.aiModuleFollow.setActive(true);
	},

	handleStartFollow: function(eventName, originEntity, targetEntity, path) {
		if (originEntity != this) {
			return;
		}

		Lucid.Utils.log("EntityFighter @ handleStartFollow");
	},

	handleStopFollow: function(eventName, originEntity) {
		if (originEntity != this) {
			return;
		}
		
		Lucid.Utils.log("EntityFighter @ handleStopFollow");
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
		
		Lucid.Event.unbind(Lucid.AIModuleAttack.EVENT.START_ATTACK + this.componentNamespace);
		Lucid.Event.unbind(Lucid.AIModuleAttack.EVENT.STOP_ATTACK + this.componentNamespace);
		Lucid.Event.unbind(Lucid.AIModuleFollow.EVENT.START_FOLLOW + this.componentNamespace);
		Lucid.Event.unbind(Lucid.AIModuleFollow.EVENT.STOP_FOLLOW + this.componentNamespace);

		this._super();
	}
});