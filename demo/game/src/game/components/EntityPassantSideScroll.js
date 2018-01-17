/**
* Game custom EntityPassantSideScroll - extends BaseEntity.
*/
var EntityPassantSideScroll = Lucid.BaseEntity.extend({
	// config variables and their default values
	// ...

	// local variables
	animInterval: null,
	animCounter: 0,

	gravityChangeTimeout: null,

	init: function(config) {
		this.componentName = "EntityPassantSideScroll";
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

		return true;
	},

	handleCollision: function(eventName, originEntity, item, collisionData) {
		if (originEntity != this) {
			return;
		}

		if (item.componentName == "EntityPotion") {
			var layerEntities = this.engine.getLayerEntities();
			if (layerEntities) {
				layerEntities.removeEntity(item.getID());
			}
		}
	},

	handleStartPath: function(eventName, originEntity) {
		if (originEntity != this) {
			return;
		}

		Lucid.Utils.log("EntityPassantSideScroll @ handleStartPath");
	},

	handleStopPath: function(eventName, originEntity) {
		if (originEntity != this) {
			return;
		}

		Lucid.Utils.log("EntityPassantSideScroll @ handleStopPath");
	},

	handleReachedEndPath: function(eventName, originEntity) {
		if (originEntity != this) {
			return;
		}
		
		Lucid.Utils.log("EntityPassantSideScroll @ handleReachedEndPath");
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
				if (!move) {
					this.setMoveDirection(Lucid.BaseEntity.DIR.UP, move);
				} else {
					if (this.gravityYAccelerationStep <= 1) {

						var tmpGravity = this.gravityYStep;
						this.gravityYStep = -0.1;

						this.gravityChangeTimeout = window.setTimeout(function() {
							this.gravityYStep = tmpGravity;
						}.bind(this), 300);
						
						this.setMoveDirection(Lucid.BaseEntity.DIR.UP, move);
					}
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
		
		switch (this.dir) {
			case Lucid.BaseEntity.DIR.RIGHT:
				this.assetY = 96;
			break;

			case Lucid.BaseEntity.DIR.LEFT:
				this.assetY = 48;
			break;
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