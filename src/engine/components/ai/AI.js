/**
 * This AI Object can be attached to Entities and pre-calculates
 * lots of usefull stuff, based on its attached originEntity 
 * and all the other Entities - fetched from Lucid.LayerEntities.
 * 
 * See: getEntitiesDataInSightRadius()
 * See: getHostileEntitiesInLineOfSight()
 */
Lucid.AI = Lucid.BaseComponent.extend({
	// config variables and their default values
	originEntity: null, // the entity, this AI is attached to

	// local variables
	fsm: null, // the fsm to use
	entitiesDataInSightRadius: [], // see: getEntitiesDataInSightRadius()
	hostileEntitiesInLineOfSight: [], // see: getHostileEntitiesInLineOfSight()

	/**
	 * Automatically called when instantiated.
	 *
	 * @param      {Object}   config  The configuration.
	 * @return     {Boolean}  Returns true on success.
	 */
	init: function(config) {
		this.checkSetComponentName("Lucid.AI");
		
		this._super(config);

		this.checkSetMap();
		this.checkSetEngine();
		this.checkSetCamera();

		return true;
	},

	/**
	 * Sets the fsm.
	 *
	 * @param      {FSM}  fsm     The fsm
	 */
	setFSM: function(fsm) {
		this.fsm = fsm;
	},

	/**
	 * Gets the fsm.
	 *
	 * @return     {FSM}  The fsm.
	 */
	getFSM: function() {
		return this.fsm;
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
	 * @return     {Object}  The origin entity.
	 */
	getOriginEntity: function() {
		return this.originEntity;
	},

	/**
	 * Gets the Entities data Object Array, with Entities of 
	 * all kind (but excluding the originEntity), sorted by 
	 * the distance to the originEntity, that are:
	 * 
	 * - inside the sight radius of the originEntity
	 * 
	 * Keys for each data Object:
	 * 
	 * - entity: 		The target Entity Object.
	 * - collisionData: The collision data between the 
	 * 					origin and the target Entity.
	 * 					If this is null, there exists
	 * 					line-of-sight between the 
	 * 					origin and the target Entity.
	 *
	 * @return     {Array}  The Entities data Object Array.
	 */
	getEntitiesDataInSightRadius: function() {
		return this.entitiesDataInSightRadius;
	},

	/**
	 * Gets the Entities Array, with Entity Objects (but 
	 * excluding the originEntity), sorted by the distance 
	 * to the originEntity, that are:
	 * 
	 * - inside the sight radius of the originEntity
	 * - in line-of-sight with the originEntity
	 * - of type Lucid.BaseEntity.TYPE.UNIT
	 * - hostile, which means they are not
	 *   in the same team as the originEntity
	 *
	 * @return     {Array}  The Entities Array.
	 */
	getHostileEntitiesInLineOfSight: function() {
		return this.hostileEntitiesInLineOfSight;
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
		var originEntity = this.getOriginEntity();
		var layerEntities = this.engine.getLayerEntities();
		var layerCollision = this.engine.getLayerCollision();

		if (!originEntity || !layerEntities || !layerCollision) {
			return;
		}

		var i;

		var entities = layerEntities.getEntities();

		var originEntityRelativeCenterX = originEntity.relativeCenterX;
		var originEntityRelativeCenterY = originEntity.relativeCenterY;
		var targetEntityRelativeCenterX;
		var targetEntityRelativeCenterY;

		var entitiesDataInSightRadius = [];

		for (i = 0; i < entities.length; ++i) {
			var targetEntity = entities[i];

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
					entitiesDataInSightRadius.push({
						entity: targetEntity,
						collisionData: this.getCollisionDataEntityLineOfSight(originEntity, targetEntity, layerCollision.getData(), this.map, this.camera)
					});
				}
			}
		}

		// sort entities by distance to originEntity - the first element will be the closest one!
		entitiesDataInSightRadius.sort(function(entityData1, entityData2) {
			return Lucid.Math.getDistanceBetweenTwoEntities(entityData1.entity, originEntity) - Lucid.Math.getDistanceBetweenTwoEntities(entityData2.entity, originEntity);
		});

		this.entitiesDataInSightRadius = entitiesDataInSightRadius;

		var hostileEntitiesInLineOfSight = [];

		for (i = 0; i < entitiesDataInSightRadius.length; ++i) {
			var entityData = entitiesDataInSightRadius[i];
			var targetEntity = entityData.entity;
			var collisionData = entityData.collisionData;

			// if there exists line-of-sight ...
			if (!collisionData) {
				// ... and its an enemy unit ...
				if (targetEntity.type == Lucid.BaseEntity.TYPE.UNIT && targetEntity.team != originEntity.team) {
					hostileEntitiesInLineOfSight.push(targetEntity);
				}
			}
		}

		this.hostileEntitiesInLineOfSight = hostileEntitiesInLineOfSight;

		if (this.fsm) {
			this.fsm.renderUpdate(delta);
		}
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

	/**
	 * Destroys the AI and all its corresponding objects.
	 *
	 * @return     {Boolean}  Returns true on success.
	 */
	destroy: function() {
		this.fsm = null;
		this.entitiesDataInSightRadius = null;
		this.hostileEntitiesInLineOfSight = null;

		return this._super();
	}
});