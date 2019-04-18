/**
* Game custom FSM AI Approach - extends FSMStateAtomic
*/
var AIFSMStateApproach = Lucid.FSMStateAtomic.extend({
	// config variables and their default values
	ai: null, // [required] reference to AI

	// local variables
	// ...

	init: function(config) {
		this._super(config);

		if (!this.ai) {
			Lucid.Utils.error("AIFSMStateApproach @ init: ai is null!");
			return false;
		}

		// check / set map reference
		this.checkSetMap();

		return true;
	},

	execute: function() {
		var originEntity = this.ai.getOriginEntity();
		var entitiesData = this.ai.getEntitiesData();

		var foundEntityOfAnotherTeam = false;

		for (var i = 0; i < entitiesData.length; ++i) {
			var entityData = entitiesData[i];

			var targetEntity = entityData.entity;
			var collisionData = entityData.collisionData;

			// if there exists line-of-sight ...
			if (!collisionData) {
				// ... and its an enemy unit
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

			// change state of fsm
			this.fsm.eventName = AIFSMFighter.EVENTS.ENEMY_NOT_IN_LINE_OF_SIGHT;
		}
	},

	startFollow: function(originEntity, targetEntity, path) {
		var tmpPath = originEntity.getPath();

		originEntity.setPath(path);

		// only triggered if entity wasnt already following
		if (!tmpPath) {
			// TODO Lucid.Event.trigger(..., originEntity, targetEntity, path);
		}
	},

	stopFollow: function(originEntity) {
		var tmpPath = originEntity.getPath();

		originEntity.setPath(null);

		// only triggered if entity was following before stopping
		if (tmpPath) {
			// TODO Lucid.Event.trigger(..., originEntity);
		}
	}
});