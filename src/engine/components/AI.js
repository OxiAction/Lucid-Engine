/**
 * Engine default AI. This component also handles pathfinding.
 */
Lucid.AI = Lucid.BaseComponent.extend({
	// config variables and their default values
	behavior: null,
	originEntity: null, // the entity, this AI is attached to
	drawData: {
		entitiesLineOfSight: []
	},

	// local variables
	// ...

	/**
	 * Automatically called when instantiated.
	 *
	 * @param      {Object}   config  The configuration.
	 * @return     {Boolean}  Returns true on success.
	 */
	init: function(config) {
		this.componentName = "AI";
		
		this._super(config);

		this.checkSetMap();
		this.checkSetEngine();
		this.checkSetCamera();

		return true;
	},

	/**
	 * Sets the origin entity.
	 *
	 * @param      {Object}  originEntity  The origin entity.
	 */
	setOriginEntity: function(originEntity) {
		this.originEntity = originEntity;
	},

	/**
	 * Gets the origin entity.
	 *
	 * @return     {Object}  The origin entity..
	 */
	getOriginEntity: function() {
		return this.originEntity;
	},

	/**
	 * Change behavior by setting a new AI.BEHAVIOR.TYPE.XXX (some TYPES require
	 * additional data)
	 *
	 * @param      {String}  type    The new AI.BEHAVIOR.TYPE.XXX.
	 * @param      {Object}  data    The data. See comments about
	 *                               AI.BEHAVIOR.XXX constants for further data
	 *                               Object explanations.
	 */
	changeBehavior: function(type, data) {
		// TODO: ...
	},

	renderUpdate: function(delta) {
		var originEntity = this.getOriginEntity();
		var layerEntities = this.engine.getLayerEntities();
		var layerCollision = this.engine.getLayerCollision();

		if (!originEntity || !layerEntities || !layerCollision) {
			return;
		}

		var entities = layerEntities.getEntities();

		var originEntityRelativeCenterX = originEntity.relativeCenterX;
		var originEntityRelativeCenterY = originEntity.relativeCenterY;
		var targetEntityRelativeCenterX;
		var targetEntityRelativeCenterY;

		this.drawData.entitiesLineOfSight = [];

		for (var i = 0; i < entities.length; ++i) {
			var targetEntity = entities[i];
			var targetEntityID = targetEntity.getID();;

			if (originEntity != targetEntity) {
				targetEntityRelativeCenterX = targetEntity.relativeCenterX;
				targetEntityRelativeCenterY = targetEntity.relativeCenterY;

				var targetEntityInOriginEntitySightRadius = Lucid.Math.getPointInCircle({
						x: targetEntityRelativeCenterX,
						y: targetEntityRelativeCenterY
					}, {
						x: originEntityRelativeCenterX,
						y: originEntityRelativeCenterY,
						radius: originEntity.sightRadius
					});
				
				if (targetEntityInOriginEntitySightRadius) {
					var collisionDataEntityLineOfSight = this.getCollisionDataEntityLineOfSight(originEntity, targetEntity, layerCollision.getData(), this.map, this.camera);

					if (collisionDataEntityLineOfSight) {
						targetEntityRelativeCenterX = collisionDataEntityLineOfSight.x;
						targetEntityRelativeCenterY = collisionDataEntityLineOfSight.y;
					}

					this.drawData.entitiesLineOfSight.push({
						x: targetEntityRelativeCenterX,
						y: targetEntityRelativeCenterY
					});
				}
			}
		}
	},

	renderDraw: function(interpolationPercentage) {
		var originEntity = this.getOriginEntity();
		var layerAIDebug = this.engine.getLayer("layer-ai-debug");

		if (!originEntity || !layerAIDebug) {
			return;
		}

		var canvasContext = layerAIDebug.getCanvasContext();
		canvasContext.width = this.camera.width;
		canvasContext.height = this.camera.height;
		canvasContext.clearRect(0, 0, this.camera.width, this.camera.height);

		canvasContext.beginPath();

		var originEntityRelativeCenterX = originEntity.relativeCenterX;
		var originEntityRelativeCenterY = originEntity.relativeCenterY;

		
		canvasContext.arc(originEntityRelativeCenterX, originEntityRelativeCenterY, originEntity.sightRadius, 0, 2 * Math.PI, false);
		canvasContext.fillStyle = "rgba(255, 255, 255, 0.1)";
		canvasContext.fill();

		if (this.drawData.entitiesLineOfSight.length) {
			canvasContext.strokeStyle = "red";
		} else {
			canvasContext.strokeStyle = "black";
		}
		
		for (var i = 0; i < this.drawData.entitiesLineOfSight.length; ++i) {
			var entityLineOfSight = this.drawData.entitiesLineOfSight[i];
			var entityLineOfSightX = entityLineOfSight.x;
			var entityLineOfSightY = entityLineOfSight.y;

			canvasContext.moveTo(originEntityRelativeCenterX, originEntityRelativeCenterY);
			canvasContext.lineTo(entityLineOfSightX, entityLineOfSightY);

			// draw arrow
			var lineOfSightAngle = Math.atan2(entityLineOfSightY - originEntityRelativeCenterY, entityLineOfSightX - originEntityRelativeCenterX);
			canvasContext.lineTo(entityLineOfSightX - 20 * Math.cos(lineOfSightAngle - Math.PI / 6), entityLineOfSightY - 20 * Math.sin(lineOfSightAngle - Math.PI / 6));
			canvasContext.moveTo(entityLineOfSightX, entityLineOfSightY);
			canvasContext.lineTo(entityLineOfSightX - 20 * Math.cos(lineOfSightAngle + Math.PI / 6), entityLineOfSightY - 20 * Math.sin(lineOfSightAngle + Math.PI / 6));
		}

		canvasContext.stroke();
	},

	/**
	 * If targetEntity is in line-of-sight of originEntity returns null.
	 * Otherwise returns the line-of-sight collision x/y.
	 *
	 * @param      {Object}  originEntity   The origin entity.
	 * @param      {Object}  targetEntity   The target entity.
	 * @param      {Array}   collisionData  The collision data (2D-Array data -
	 *                                      1 values mean colliding).
	 * @param      {Map}     map            Map Object.
	 * @param      {Camera}  camera         Camera Object.
	 * @return     {Object}  Returns the line-of-sight collision x/y OR null if
	 *                       targetEntity is in line-of-sight.
	 */
	getCollisionDataEntityLineOfSight: function(originEntity, targetEntity, collisionData, map, camera) {
		var tileSize = map.tileSize;

		var originEntityGridIndices = Lucid.Math.getEntityToGridIndices(originEntity, tileSize);

		var originEntityGridIndexX = originEntityGridIndices[0];
		var originEntityGridIndexY = originEntityGridIndices[1];

		var radiusInCells = Math.round(originEntity.sightRadius / tileSize);

		var line1 = {
			startX: originEntity.relativeCenterX,
			startY: originEntity.relativeCenterY,
			endX: targetEntity.relativeCenterX,
			endY: targetEntity.relativeCenterY
		};

		for (var i = originEntityGridIndexY - radiusInCells; i < originEntityGridIndexY + radiusInCells; ++i) {
			if (collisionData != undefined && collisionData[i]) {
				for (var j = originEntityGridIndexX - radiusInCells; j < originEntityGridIndexX + radiusInCells; ++j) {
					var cell = collisionData[i][j];
					if (cell && cell == 1) {
						var offsetX = j * tileSize - camera.x;
						var offsetY = i * tileSize - camera.y;

						var cellSides = [];

						if (originEntity.relativeCenterX < targetEntity.relativeCenterX) {
							// left side of the cell
							cellSides.push({
								startX: offsetX,
								startY: offsetY,
								endX: offsetX,
								endY: offsetY + tileSize
							});
						} else {
							// right side of the cell
							cellSides.push({
								startX: offsetX + tileSize,
								startY: offsetY,
								endX: offsetX + tileSize,
								endY: offsetY + tileSize
							});
						}

						if (originEntity.relativeCenterY < targetEntity.relativeCenterY) {
							// top side of the cell
							cellSides.push({
								startX: offsetX,
								startY: offsetY,
								endX: offsetX + tileSize,
								endY: offsetY
							});
						} else {
							// bottom side of the cell
							cellSides.push({
								startX: offsetX,
								startY: offsetY + tileSize,
								endX: offsetX + tileSize,
								endY: offsetY + tileSize
							});
						}

						for (var k = 0; k < cellSides.length; ++k) {
							var cellSide = cellSides[k];
							var collisionDataLineVsLine = Lucid.Math.getCollisionDataLineVsLine(line1, cellSide);

							if (collisionDataLineVsLine && collisionDataLineVsLine.seg1 && collisionDataLineVsLine.seg2) {
								return {
									x: collisionDataLineVsLine.x,
									y: collisionDataLineVsLine.y
								}
							}
						}
					}
				}
			}
		}

		return null;
	},

	destroy: function() {
		this._super();
	}

	
});

// behavior constants
Lucid.AI.BEHAVIOR = {
	TYPE: {
		/**
		 * follow another Entity
		 * 
		 * data = {
		 * 	target: Entity,			// the target Entity to follow
		 * 	keepDistance: number	// the distance kept between target and this
		 * }
		 */
		FOLLOW: "follow",

		/**
		 * randomly patrol a certrain radius using the origin position as center
		 * 
		 * data = {
		 * 	radius: number,		// radius to patrol
		 * 	allowJump: boolean	// stay on the ground currently attached on or jump on higher / lower grounds too
		 * }
		 */
		PATROL: "patrol",

		/**
		 * hold origin position
		 * 
		 * data = {
		 * 	moveOnTrigger: boolean	// move when triggered - e.g. when engaging a fight with another Entity - after the fight returns to origin position
		 * }
		 */
		HOLD: "holdPosition"
	}
};