/**
 * Engine default AI. This component also handles pathfinding.
 */
Lucid.AI = BaseComponent.extend({
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

		var targetRelativeX = target.relativeX + target.width / 2;
		var targetRelativeY = target.relativeY + target.height / 2;
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
				entityRelativeX = entity.relativeX + entity.width / 2;
				entityRelativeY = entity.relativeY + entity.height / 2;

				var entityInTargetSightRadius = this.pointInCircle(entityRelativeX, entityRelativeY, targetRelativeX, targetRelativeY, target.sightRadius);
				
				if (entityInTargetSightRadius) {
					angle = Math.atan2(entityRelativeY - targetRelativeY, entityRelativeX - targetRelativeX);

					canvasContext.strokeStyle = "red";
					canvasContext.moveTo(targetRelativeX, targetRelativeY);
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
		// var r = (x - cx) * (x - cx) + (y - cy) * (y - cy) <= radius * radius;
		return Math.sqrt((x - cx) * (x - cx) + (y - cy) * (y - cy)) <= radius;
	},

	supercover_line: function(p0, p1) {
		var dx = p1.x-p0.x, dy = p1.y-p0.y;
		var nx = Math.abs(dx), ny = Math.abs(dy);
		var sign_x = dx > 0? 1 : -1, sign_y = dy > 0? 1 : -1;

		var p = new Point(p0.x, p0.y);
		var points = [new Point(p.x, p.y)];
		for (var ix = 0, iy = 0; ix < nx || iy < ny;) {
			if ((0.5+ix) / nx == (0.5+iy) / ny) {
				// next step is diagonal
				p.x += sign_x;
				p.y += sign_y;
				ix++;
				iy++;
			} else if ((0.5+ix) / nx < (0.5+iy) / ny) {
				// next step is horizontal
				p.x += sign_x;
				ix++;
			} else {
				// next step is vertical
				p.y += sign_y;
				iy++;
			}
			points.push(new Point(p.x, p.y));
		}
		return points;
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