// namespace
var Game = Game || {};

/**
* Game custom EntityPassantSideScroll - extends BaseEntity.
*/
Game.EntityPassantSideScroll = Lucid.BaseEntity.extend({
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

	gravityChangeTimeout: null,

	orgGravityYStep: null,
	allowJump: true,

	init: function(config) {
		this.componentName = "Game.EntityPassantSideScroll";
		this.width = 32;
		this.height = 48;
		this.speed = 20;
		this.assetFilePath = "assets/entity_passant.png";
		this.assetY = 96;
		
		this._super(config);
		
		this.animInterval = setInterval(this.updateAnim.bind(this), 500);
		this.updateAnim();

		Lucid.Event.bind(Lucid.BaseEntity.EVENT.COLLISION + this.componentNamespace, this.handleCollision.bind(this));
		Lucid.Event.bind(Lucid.BaseEntity.EVENT.START_PATH + this.componentNamespace, this.handleStartPath.bind(this));
		Lucid.Event.bind(Lucid.BaseEntity.EVENT.STOP_PATH + this.componentNamespace, this.handleStopPath.bind(this));
		Lucid.Event.bind(Lucid.BaseEntity.EVENT.REACHED_END_PATH + this.componentNamespace, this.handleReachedEndPath.bind(this));

		Lucid.Event.bind(Lucid.Input.EVENTS.KEY_DOWN + this.componentNamespace, this.handleKeyDown.bind(this));
		Lucid.Event.bind(Lucid.Input.EVENTS.KEY_UP + this.componentNamespace, this.handleKeyUp.bind(this));

		this.camera.setFollowTarget(this, true);

		// save original gravity
		this.orgGravityYStep = this.gravityYStep;

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
			}
		}

		// touching some surface above -> deny further jumping and reset jump
		// state
		if (collisionData.originFromDir == "down") {
			this.allowJump = false;
			window.clearTimeout(this.gravityChangeTimeout);
			this.gravityYStep = this.orgGravityYStep;
			this.setMoveDirection(Lucid.BaseEntity.DIR.UP, false);
		}
		// touching ground -> allow jump again
		else if (collisionData.originFromDir == "up") {
			this.allowJump = true;
		}
	},

	handleStartPath: function(eventName, originEntity) {
		if (originEntity != this) {
			return;
		}

		Lucid.Utils.log(this.componentName + " @ handleStartPath");
	},

	handleStopPath: function(eventName, originEntity) {
		if (originEntity != this) {
			return;
		}

		Lucid.Utils.log(this.componentName + " @ handleStopPath");
	},

	handleReachedEndPath: function(eventName, originEntity) {
		if (originEntity != this) {
			return;
		}
		
		Lucid.Utils.log(this.componentName + " @ handleReachedEndPath");
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
				this.assetY = 48;
				this.setMoveDirection(Lucid.BaseEntity.DIR.LEFT, move);
				break;

			case Lucid.Input.KEYS["RIGHT_ARROW"]:
				this.assetY = 96;
				this.setMoveDirection(Lucid.BaseEntity.DIR.RIGHT, move);
				break;

			case Lucid.Input.KEYS["UP_ARROW"]:
				if (!move) {
					this.setMoveDirection(Lucid.BaseEntity.DIR.UP, move);
				} else if (this.gravityYAccelerationStep <= 1 && this.allowJump) {
					this.gravityYStep = -0.1;

					this.gravityChangeTimeout = window.setTimeout(function() {
						this.gravityYStep = this.orgGravityYStep;
					}.bind(this), 300);
					
					this.setMoveDirection(Lucid.BaseEntity.DIR.UP, move);
				}
				break;

			case Lucid.Input.KEYS["DOWN_ARROW"]:
				this.setMoveDirection(Lucid.BaseEntity.DIR.DOWN, move);
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

	renderUpdate: function(delta) {
		if (!this.getActive()) {
			return;
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