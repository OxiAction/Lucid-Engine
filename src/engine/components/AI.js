/**
 * Engine default AI. This component also handles pathfinding.
 */
Lucid.AI = Lucid.BaseComponent.extend({
	// config variables and their default values
	behavior: null,
	target: null,

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

	setTarget: function(target) {
		this.target = target;
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
		var target = this.target;
		var layerEntities = this.engine.getLayerEntities();
		var layerCollision = this.engine.getLayerCollision();

		// TODO: this is just quick & dirty
		var layerAIDebug = this.engine.getLayer("layer-ai-debug");

		if (!target || !layerEntities || !layerCollision || !layerAIDebug) {
			return;
		}

		var canvasContext = layerAIDebug.getCanvasContext();
		canvasContext.width = this.camera.width;
		canvasContext.height = this.camera.height;
		canvasContext.clearRect(0, 0, this.camera.width, this.camera.height);

		canvasContext.beginPath();

		var entities = layerEntities.getEntities();

		var targetRelativeX = Math.floor(target.x - this.camera.x) + target.width / 2;
		var targetRelativeY = Math.floor(target.y - this.camera.y) + target.height / 2;
		var entityRelativeX;
		var entityRelativeY;
		var angle;
		var headlen = 10;

		canvasContext.strokeStyle = "black";
		canvasContext.arc(targetRelativeX, targetRelativeY, target.sightRadius, 0, 2 * Math.PI, false);
		canvasContext.fillStyle = "rgba(255, 255, 255, 0.1)";
		canvasContext.fill();

		for (var i = 0; i < entities.length; ++i) {
			var entity = entities[i];

			if (target != entity) {
				entityRelativeX = Math.floor(entity.x - this.camera.x) + entity.width / 2;
				entityRelativeY = Math.floor(entity.y - this.camera.y) + entity.height / 2;

				var entityInTargetSightRadius = this.pointInCircle(entityRelativeX, entityRelativeY, targetRelativeX, targetRelativeY, target.sightRadius);
				
				if (entityInTargetSightRadius) {
					
					// var offset = Math.max(entity.width / 2, entity.height / 2);
					angle = Math.atan2(entityRelativeY - targetRelativeY, entityRelativeX - targetRelativeX);

					canvasContext.strokeStyle = "red";
					canvasContext.moveTo(targetRelativeX, targetRelativeY);

					var collisionPoint = this.getCollisionPoint(target.x + (target.width / 2), target.y + (target.height / 2), target.sightRadius, {x: targetRelativeX, y: targetRelativeY}, {x: entityRelativeX, y: entityRelativeY});
					if (collisionPoint) {
						entityRelativeX = collisionPoint.x;
						entityRelativeY = collisionPoint.y;
					}

					
					// entityRelativeX -= offset;
					// entityRelativeY -= offset;
					canvasContext.lineTo(entityRelativeX, entityRelativeY);
					canvasContext.lineTo(entityRelativeX - headlen * Math.cos(angle - Math.PI/6), entityRelativeY - headlen * Math.sin(angle - Math.PI/6));
					canvasContext.moveTo(entityRelativeX, entityRelativeY);
					canvasContext.lineTo(entityRelativeX - headlen * Math.cos(angle + Math.PI/6), entityRelativeY - headlen * Math.sin(angle + Math.PI/6));
				}
			}
		}

		canvasContext.stroke();
	},

	/**
	 * Tests if x / y is inside circle.
	 *
	 * @param      {number}  x       x point to test.
	 * @param      {number}  y       y point to test.
	 * @param      {number}  cx      circle center x.
	 * @param      {number}  cy      circle center y.
	 * @param      {number}  radius  The radius.
	 * @return     {number}  Returns true if point is in circle.
	 */
	pointInCircle: function(x, y, cx, cy, radius) {
		return Math.sqrt((x - cx) * (x - cx) + (y - cy) * (y - cy)) <= radius;
	},

	/**
	 * http://paulbourke.net/geometry/pointlineplane/
	 *
	 * @param      {number}  x1      The start x of line 1.
	 * @param      {number}  y1      The start y of line 1.
	 * @param      {number}  x2      The end x of line 1.
	 * @param      {number}  y2      The end y of line 1.
	 * @param      {number}  x3      The start x of line 2.
	 * @param      {number}  y3      The start y of line 2.
	 * @param      {number}  x4      The end x of line 2.
	 * @param      {number}  y4      The end y of line 2.
	 * @return     {Object}  An Object which contains information about the
	 *                       intersection or null if nothing intersects. If
	 *                       Object.seg1 and Object.seg2 both are true, the
	 *                       lines actually collide.
	 */
	twoLinesIntersect: function(x1, y1, x2, y2, x3, y3, x4, y4) {
		var denom = (y4 - y3)*(x2 - x1) - (x4 - x3)*(y2 - y1);

		if (denom == 0) {
			return null;
		}
		var ua = ((x4 - x3) * (y1 - y3) - (y4 - y3) * (x1 - x3)) / denom;
		var ub = ((x2 - x1) * (y1 - y3) - (y2 - y1) * (x1 - x3)) / denom;

		return {
			x: x1 + ua * (x2 - x1),
			y: y1 + ua * (y2 - y1),
			seg1: ua >= 0 && ua <= 1,
			seg2: ub >= 0 && ub <= 1
		};
	},

	getCollisionPoint: function(x, y, radius, targetVector, entityVector) {
		var tileSize = this.map.tileSize;

		var originCellX = Math.floor(x / tileSize);
		var originCellY = Math.floor(y / tileSize);
		var radiusInCells = Math.round(radius / tileSize);

		var data = this.engine.getLayerCollision().getData();

		for (var i = originCellY - radiusInCells; i < originCellY + radiusInCells; ++i) {
			if (data[i]) {
				for (var j = originCellX - radiusInCells; j < originCellX + radiusInCells; ++j) {
					var cell = data[i][j];
					if (cell && cell == 1) {
						var offsetX = j * tileSize - this.camera.x;
						var offsetY = i * tileSize - this.camera.y;

						var cellSides = [];

						if (targetVector.x < entityVector.x) {
							// left side of the cell
							cellSides.push({
								start: {
									x: offsetX,
									y: offsetY
								},
								end: {
									x: offsetX,
									y: offsetY + tileSize
								}
							});
						} else {
							// right side of the cell
							cellSides.push({
								start: {
									x: offsetX + tileSize,
									y: offsetY
								},
								end: {
									x: offsetX + tileSize,
									y: offsetY + tileSize
								}
							});
						}

						if (targetVector.y < entityVector.y) {
							// top side of the cell
							cellSides.push({
								start: {
									x: offsetX,
									y: offsetY
								},
								end: {
									x: offsetX + tileSize,
									y: offsetY
								}
							});
						} else {
							// bottom side of the cell
							cellSides.push({
								start: {
									x: offsetX,
									y: offsetY + tileSize
								},
								end: {
									x: offsetX + tileSize,
									y: offsetY + tileSize
								}
							});
						}

						for (var k = 0; k < cellSides.length; ++k) {
							var cellSide = cellSides[k];
							var intersection = this.twoLinesIntersect(targetVector.x, targetVector.y, entityVector.x, entityVector.y, cellSide.start.x, cellSide.start.y, cellSide.end.x, cellSide.end.y);

							if (intersection && intersection.seg1 && intersection.seg2) {
								return {
									x: intersection.x,
									y: intersection.y
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