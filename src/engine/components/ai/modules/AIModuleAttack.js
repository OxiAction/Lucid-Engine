/**
 * AI module for entity attack logic.
 */
Lucid.AIModuleAttack = Lucid.BaseAIModule.extend({
	// config variables and their default values
	minimumRange: 60, // the minimum distance between the attacker and the victim to trigger an attack event

	// private variables

	attacking: false,

	/**
	 * Automatically called when instantiated.
	 *
	 * @param      {Object}   config  The configuration.
	 * @return     {Boolean}  Returns true on success.
	 */
	init: function(config) {
		this.componentName = "AIModuleAttack";

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

				// no collisionData means targetEntity is in line of sight!
				if (!collisionData) {

					// check type & team
					if (targetEntity.type == Lucid.BaseEntity.TYPE.UNIT && targetEntity.team != originEntity.team) {

						// get distance between targetEntity and originEntity and check if its <= minimumRange
						if (Lucid.Math.getDistanceBetweenTwoEntities(targetEntity, originEntity) <= this.minimumRange) {
							foundEntityOfAnotherTeam = true;
							this.startAttack(originEntity, targetEntity);
						}

						break;
					}
				}
			}

			if (!foundEntityOfAnotherTeam) {
				this.stopAttack(originEntity);
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
		this._super(interpolationPercentage);
	},

	startAttack: function(originEntity, targetEntity) {
		if (this.attacking) {
			return;
		}

		this.attacking = true;
		Lucid.Event.trigger(Lucid.AIModuleAttack.EVENT.START_ATTACK, originEntity, targetEntity);
	},

	stopAttack: function(originEntity) {
		if (!this.attacking) {
			return;
		}

		this.attacking = false;
		Lucid.Event.trigger(Lucid.AIModuleAttack.EVENT.STOP_ATTACK, originEntity);
	},

	setActive: function(active) {
		if (!active) {
			this.stopAttack(this.getAI().getOriginEntity());
		}

		this._super(active);
	}
});

Lucid.AIModuleAttack.EVENT = {
	START_ATTACK: "startAttack",
	STOP_ATTACK: "stopAttack"
};