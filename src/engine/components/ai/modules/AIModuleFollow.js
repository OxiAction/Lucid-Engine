/**
 * AI module for entity follow logic.
 */
Lucid.AIModuleFollow = Lucid.BaseAIModule.extend({

	/**
	 * Automatically called when instantiated.
	 *
	 * @param      {Object}   config  The configuration.
	 * @return     {Boolean}  Returns true on success.
	 */
	init: function(config) {
		this.componentName = "AIModuleFollow";

		this._super(config);

		return true;
	},

	/**
	 * The renderUpdate() function should simulate anything that is affected by
	 * time. It can be called zero or more times per frame depending on the
	 * frame rate.
	 *
	 * @param      {Number}  delta   The amount of time in milliseconds to
	 *                               simulate in the update.
	 */
	renderUpdate: function(delta) {
		if (this.getActive()) {
			var ai = this.getAI();

			var originEntity = ai.getOriginEntity();
			var entitiesData = ai.getEntitiesData();

			var foundEntityOfAnotherTeam = false;

			for (var i = 0; i < entitiesData.length; ++i) {
				var entityData = entitiesData[i];

				var targetEntity = entityData.entity;
				var collisionData = entityData.collisionData;

				if (!collisionData) {
					if (targetEntity.type == Lucid.BaseEntity.TYPE.UNIT && targetEntity.team != originEntity.team) {
						foundEntityOfAnotherTeam = true;

						var originEntityGridIndices = Lucid.Math.getEntityToGridIndices(originEntity, this.map.tileSize);
						var targetEntityGridIndices = Lucid.Math.getEntityToGridIndices(targetEntity, this.map.tileSize);

						Lucid.Pathfinding.findPath(originEntityGridIndices[0], originEntityGridIndices[1], targetEntityGridIndices[0], targetEntityGridIndices[1], function(path) {
							if (path) {
								this.startFollow(originEntity, targetEntity, path);
							}
						}.bind(this));

						Lucid.Pathfinding.calculate();
						break;
					}
				}
			}

			if (!foundEntityOfAnotherTeam) {
				this.stopFollow(originEntity);
			}
		}

		this._super(delta);
	},

	/**
	 * Draw things.
	 *
	 * @param      {Number}  interpolationPercentage  The cumulative amount of
	 *                                                time that hasn't been
	 *                                                simulated yet, divided by
	 *                                                the amount of time that
	 *                                                will be simulated the next
	 *                                                time renderUpdate() runs.
	 *                                                Useful for interpolating
	 *                                                frames.
	 */
	renderDraw: function(interpolationPercentage) {
		var ai = this.getAI();
		var layer = ai.getLayer();

		if (!layer) {
			return;
		}

		var originEntity = ai.getOriginEntity();
		var entitiesData = ai.getEntitiesData();

		var canvasContext = layer.getCanvasContext();
		canvasContext.beginPath();

		var originEntityRelativeCenterX = originEntity.relativeCenterX;
		var originEntityRelativeCenterY = originEntity.relativeCenterY;
		
		canvasContext.arc(originEntityRelativeCenterX, originEntityRelativeCenterY, originEntity.sightRadius, 0, 2 * Math.PI, false);
		canvasContext.fillStyle = "rgba(255, 255, 255, 0.1)";
		canvasContext.fill();

		if (entitiesData.length) {
			canvasContext.strokeStyle = "red";
		} else {
			canvasContext.strokeStyle = "black";
		}
		
		for (var i = 0; i < entitiesData.length; ++i) {
			var entityData = entitiesData[i];

			var targetEntity = entityData.entity;
			var targetEntityCollisionData = entityData.collisionData;

			var targetEntityLineOfSightX;
			var targetEntityLineOfSightY;

			if (!targetEntityCollisionData) {
				targetEntityLineOfSightX = targetEntity.relativeCenterX;
				targetEntityLineOfSightY = targetEntity.relativeCenterY;
			} else {
				targetEntityLineOfSightX = targetEntityCollisionData.x;
				targetEntityLineOfSightY = targetEntityCollisionData.y;
			}

			canvasContext.moveTo(originEntityRelativeCenterX, originEntityRelativeCenterY);
			canvasContext.lineTo(targetEntityLineOfSightX, targetEntityLineOfSightY);

			// draw arrow
			var lineOfSightAngle = Math.atan2(targetEntityLineOfSightY - originEntityRelativeCenterY, targetEntityLineOfSightX - originEntityRelativeCenterX);
			canvasContext.lineTo(targetEntityLineOfSightX - 20 * Math.cos(lineOfSightAngle - Math.PI / 6), targetEntityLineOfSightY - 20 * Math.sin(lineOfSightAngle - Math.PI / 6));
			canvasContext.moveTo(targetEntityLineOfSightX, targetEntityLineOfSightY);
			canvasContext.lineTo(targetEntityLineOfSightX - 20 * Math.cos(lineOfSightAngle + Math.PI / 6), targetEntityLineOfSightY - 20 * Math.sin(lineOfSightAngle + Math.PI / 6));
		}

		canvasContext.stroke();

		this._super(interpolationPercentage);
	},

	startFollow: function(originEntity, targetEntity, path) {
		var tmpPath = originEntity.getPath();

		originEntity.setPath(path);

		if (!tmpPath) {
			Lucid.Event.trigger(Lucid.AIModuleFollow.EVENT.START_FOLLOW, originEntity, targetEntity, path);
		}
	},

	stopFollow: function(originEntity) {
		var tmpPath = originEntity.getPath();

		originEntity.setPath(null);

		if (tmpPath) {
			Lucid.Event.trigger(Lucid.AIModuleFollow.EVENT.STOP_FOLLOW, originEntity);
		}
	},

	setActive: function(active) {
		if (!active) {
			this.stopFollow(this.getAI().getOriginEntity());
		}

		this._super(active);
	}
});

Lucid.AIModuleFollow.EVENT = {
	START_FOLLOW: "startFollow",
	STOP_FOLLOW: "stopFollow"
};