/**
* Game custom FSM AI Idle - extends FSMStateAtomic
*/
var AIFSMStateIdle = Lucid.FSMStateAtomic.extend({
	// config variables and their default values
	ai: null, // [required] reference to AI

	// local variables
	// ...

	init: function(config) {
		this._super(config);

		if (!this.ai) {
			Lucid.Utils.error("AIFSMStateIdle @ init: ai is null!");
			return false;
		}

		return true;
	},

	execute: function() {
		// return; 
		
		var originEntity = this.ai.getOriginEntity();
		var entitiesData = this.ai.getEntitiesData();

		for (var i = 0; i < entitiesData.length; ++i) {
			var entityData = entitiesData[i];

			var targetEntity = entityData.entity;
			var collisionData = entityData.collisionData;

			// if there exists line-of-sight ...
			if (!collisionData) {
				// ... and its an enemy unit
				if (targetEntity.type == Lucid.BaseEntity.TYPE.UNIT && targetEntity.team != originEntity.team) {
					// change state of fsm
					this.fsm.eventName = AIFSMFighter.EVENTS.ENEMY_IS_IN_LINE_OF_SIGHT;
					break;
				}
			}
		}
	}
});