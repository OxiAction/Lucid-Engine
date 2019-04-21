// namespace
var Game = Game || {};

/**
* Game custom EntityPassant - extends BaseEntity.
*/
Game.EntityPassant = Lucid.BaseEntity.extend({
	// config variables and their default values
	// ...

	// local variables
	animInterval: null,
	animCounter: 0,
	showInformation: true, // render informations
	healthPointsMaximum: 500,
	healthPointsCurrent: 400,
	manaPointsMaximum: 50,
	manaPointsCurrent: 40,
	audioPunch: null,

	init: function(config) {
		this.componentName = "EntityPassant";
		this.width = 32;
		this.height = 48;
		this.force = 1.5;
		this.speed = 10;
		this.minimumAttackRange = 60;
		this.assetFilePath = "assets/entity_passant.png";
		
		this._super(config);
		
		this.animInterval = setInterval(this.updateAnim.bind(this), 500);
		this.updateAnim();

		Lucid.Event.bind(Lucid.BaseEntity.EVENT.COLLISION + this.componentNamespace, this.handleCollision.bind(this));
		Lucid.Event.bind(Lucid.BaseEntity.EVENT.START_PATH + this.componentNamespace, this.handleStartPath.bind(this));
		Lucid.Event.bind(Lucid.BaseEntity.EVENT.STOP_PATH + this.componentNamespace, this.handleStopPath.bind(this));
		Lucid.Event.bind(Lucid.BaseEntity.EVENT.REACHED_END_PATH + this.componentNamespace, this.handleReachedEndPath.bind(this));

		Lucid.Event.bind(Lucid.Input.EVENTS.KEY_DOWN + this.componentNamespace, this.handleKeyDown.bind(this));
		Lucid.Event.bind(Lucid.Input.EVENTS.KEY_UP + this.componentNamespace, this.handleKeyUp.bind(this));

		this.setPathByClick(true);

		this.camera.setFollowTarget(this, true);

		this.audioPunch = document.createElement("audio");
		if (this.audioPunch.canPlayType("audio/mpeg")) {
			this.audioPunch.setAttribute("src", "assets/punch.mp3");
		}
		if (this.audioPunch.canPlayType("audio/ogg")) {
			this.audioPunch.setAttribute("src", "assets/punch.ogg");
		}

		return true;
	},

	handleCollision: function(eventName, originEntity, item, collisionData) {
		if (originEntity != this) {
			return;
		}

		if (item.componentName == "Game.EntityPotion") {
			var layerEntities = this.engine.getLayerEntities();
			if (layerEntities) {
				layerEntities.removeEntity(item.id);
				this.healthPointsCurrent = Math.min(this.healthPointsMaximum, this.healthPointsCurrent + 100);
			}
		}
	},

	handleStartPath: function(eventName, originEntity) {
		if (originEntity != this) {
			return;
		}

		Lucid.Utils.log("EntityPassant @ handleStartPath");
	},

	handleStopPath: function(eventName, originEntity) {
		if (originEntity != this) {
			return;
		}

		Lucid.Utils.log("EntityPassant @ handleStopPath");
	},

	handleReachedEndPath: function(eventName, originEntity) {
		if (originEntity != this) {
			return;
		}
		
		Lucid.Utils.log("EntityPassant @ handleReachedEndPath");
	},

	handleKeyDown: function(eventName, code) {
		this.processHandleKeyUpDown(code, true);
	},

	handleKeyUp: function(eventName, code) {
		this.processHandleKeyUpDown(code, false);
	},

	processHandleKeyUpDown: function(code, move) {
		switch (code) {
			case Lucid.Input.KEYS["LEFT_ARROW"]:
				this.setMoveDirection(Lucid.BaseEntity.DIR.LEFT, move);
				break;

			case Lucid.Input.KEYS["RIGHT_ARROW"]:
				this.setMoveDirection(Lucid.BaseEntity.DIR.RIGHT, move);
				break;

			case Lucid.Input.KEYS["UP_ARROW"]:
				this.setMoveDirection(Lucid.BaseEntity.DIR.UP, move);
				break;

			case Lucid.Input.KEYS["DOWN_ARROW"]:
				this.setMoveDirection(Lucid.BaseEntity.DIR.DOWN, move);
				break;

			case Lucid.Input.KEYS["SPACE"]:
				if (move) {
					this.attack();
				}
				break;
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

	attack: function() {
		var layerEntities = this.engine.getLayerEntities();
		var entities = layerEntities.getEntities();

		var ai = new Lucid.AI({
			originEntity: this
		});
		ai.renderUpdate(0);

		var entitiesData = ai.getEntitiesData();
		var enemyInRange = false;

		for (var i = 0; i < entitiesData.length; ++i) {
			var entityData = entitiesData[i];

			var targetEntity = entityData.entity;
			var collisionData = entityData.collisionData;

			// no collisionData means targetEntity is in line of sight!
			if (!collisionData) {

				// check type & team
				if (targetEntity.type == Lucid.BaseEntity.TYPE.UNIT && targetEntity.team != this.team) {

					// get distance between targetEntity and originEntity and check if its > minimumRange
					if (Lucid.Math.getDistanceBetweenTwoEntities(targetEntity, this) <= this.minimumAttackRange) {
						if (targetEntity.healthPointsCurrent) {
							targetEntity.healthPointsCurrent = Math.max(0, targetEntity.healthPointsCurrent - 5);
							enemyInRange = true;
						}
					}
				}
			}
		}

		if (enemyInRange) {
			this.audioPunch.pause();
			this.audioPunch.currentTime = 0;
			this.audioPunch.play();
		}
	},

	renderUpdate: function(delta) {
		if (!this.getActive()) {
			return;
		}

		if (this.healthPointsCurrent <= 0) {
			var layerEntities = this.engine.getLayerEntities();
			if (layerEntities) {
				layerEntities.removeEntity(this.id);
			}
		}
		
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

	destroy: function() {
		if (this.animInterval) {
			clearInterval(this.animInterval);
			this.animInterval = null;
		}

		Lucid.Event.unbind(Lucid.BaseEntity.EVENT.COLLISION + this.componentNamespace);
		Lucid.Event.unbind(Lucid.BaseEntity.EVENT.START_PATH + this.componentNamespace);
		Lucid.Event.unbind(Lucid.BaseEntity.EVENT.STOP_PATH + this.componentNamespace);
		Lucid.Event.unbind(Lucid.BaseEntity.EVENT.REACHED_END_PATH + this.componentNamespace);

		Lucid.Event.unbind(Lucid.Input.EVENTS.KEY_DOWN + this.componentNamespace);
		Lucid.Event.unbind(Lucid.Input.EVENTS.KEY_UP + this.componentNamespace);

		this.camera.setFollowTarget(null);

		this._super();
	}
});