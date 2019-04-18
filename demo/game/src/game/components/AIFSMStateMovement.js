/**
* Game custom FSM AI Movement - extends FSMStateComposite
*/
var AIFSMStateMovement = Lucid.FSMStateComposite.extend({
	// config variables and their default values
	ai: null, // [required] reference to AI

	// local variables
	// ...

	init: function(config) {
		this._super(config);

		if (!this.ai) {
			Lucid.Utils.error("AIFSMStateMovement @ init: ai is null!");
			return false;
		}

		// check / set map reference
		this.checkSetMap();

		return true;
	},

	execute: function() {
		var originEntity = this.ai.getOriginEntity();
		var entitiesData = this.ai.getEntitiesData();

		for (var i = 0; i < entitiesData.length; ++i) {
			var entityData = entitiesData[i];

			var targetEntity = entityData.entity;
			var collisionData = entityData.collisionData;

			// no collisionData means targetEntity is in line of sight!
			if (!collisionData) {

				// check type & team
				if (targetEntity.type == Lucid.BaseEntity.TYPE.UNIT && targetEntity.team != originEntity.team) {

					// get distance between targetEntity and originEntity and check if its <= minimumRange
					if (Lucid.Math.getDistanceBetweenTwoEntities(targetEntity, originEntity) <= targetEntity.minimumAttackRange) {
						this.fsm.eventName = AIFSMFighter.EVENTS.ENEMY_IS_IN_RANGE;
					}

					break;
				}
			}
		}
	}
});