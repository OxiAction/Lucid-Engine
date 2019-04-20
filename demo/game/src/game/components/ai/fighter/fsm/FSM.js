// namespace
var Game = Game || {};
Game.AI = Game.AI || {};
Game.AI.Fighter = Game.AI.Fighter || {};

/**
* Game custom AI Fighter FSM for entities.
*/
Game.AI.Fighter.FSM = Lucid.FSM.extend({
	// config variables and their default values
	ai: null, // [required] reference to the ai

	// local variables
	root: null, // root state

	init: function(config) {
		this.componentName = "Game.AI.Fighter.FSM";

		this._super(config);

		if (!this.ai) {
			Lucid.Utils.error("Game.AI.Fighter.FSM @ init: ai is null!");
			return false;
		}

		//////////////////////////
		// step 1 -> setup states:

			// root
			this.root = new Game.AI.Fighter.FSM.Root({ componentName: "Root", fsm: this });

			// composite states (of root):
				// a) core
				var core = new Game.AI.Fighter.FSM.Root.Core({ componentName: "Core", fsm: this });

				// composite states (of core):
					// a.a) movement
					var movement = new Game.AI.Fighter.FSM.Root.Core.Movement({ componentName: "Movement", fsm: this });

					// atomic states (of movement)
						var idle = new Game.AI.Fighter.FSM.Root.Core.Movement.Idle({ componentName: "Idle", fsm: this });
						var approach = new Game.AI.Fighter.FSM.Root.Core.Movement.Approach({ componentName: "Approach", fsm: this });

					movement.addChildState(idle);
					movement.addChildState(approach);
					movement.setDefaultState(idle);

					// a.b) combat
					var combat = new Game.AI.Fighter.FSM.Root.Core.Combat({ componentName: "Combat", fsm: this });

					// atomic states (of combat)
						var attack = new Game.AI.Fighter.FSM.Root.Core.Combat.Attack({ componentName: "Attack", fsm: this });

					combat.addChildState(attack);
					combat.setDefaultState(attack);

				core.addChildState(movement);
				core.addChildState(combat);
				core.setDefaultState(movement);

				// b) defense
				var defense = new Game.AI.Fighter.FSM.Root.Defense({ componentName: "Defense", fsm: this });

				// atomic states (of defense)
					var heal = new Game.AI.Fighter.FSM.Root.Defense.Heal({ componentName: "Heal", fsm: this });

				defense.addChildState(heal);
				defense.setDefaultState(heal);

			this.root.addChildState(core);
			this.root.addChildState(defense);
			this.root.setDefaultState(core);



		//////////////////////////
		// step 2 -> setup transitions:

		idle.addTransition(new Lucid.FSMTransition({ toState: approach, eventName: Game.AI.Fighter.FSM.EVENTS.ENEMY_LINE_OF_SIGHT }));
		approach.addTransition(new Lucid.FSMTransition({ toState: idle, eventName: Game.AI.Fighter.FSM.EVENTS.NOT_ENEMY_LINE_OF_SIGHT }));

		movement.addTransition(new Lucid.FSMTransition({ toState: combat, eventName: Game.AI.Fighter.FSM.EVENTS.ENEMY_IN_RANGE }));
		combat.addTransition(new Lucid.FSMTransition({ toState: movement, eventName: Game.AI.Fighter.FSM.EVENTS.NOT_ENEMY_IN_RANGE }));

		core.addTransition(new Lucid.FSMTransition({ toState: defense, eventName: Game.AI.Fighter.FSM.EVENTS.DEFENSE_ALERT }));
		defense.addTransition(new Lucid.FSMTransition({ toState: core, eventName: Game.AI.Fighter.FSM.EVENTS.NOT_DEFENSE_ALERT }));

		//////////////////////////
		// step 3 -> start:

		this.root.setDefaultState(core);

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
		this.root.update();
	},

	/**
	 * Sets the ai.
	 *
	 * @param      {AI}  ai      The ai.
	 */
	setAI: function(ai) {
		this.ai = ai;
	},

	/**
	 * Gets the ai.
	 *
	 * @return     {AI}  The ai.
	 */
	getAI: function() {
		return this.ai;
	}
});

/**
* TODO description.
*/
Game.AI.Fighter.FSM.Root = Lucid.FSMStateComposite.extend({});

/**
* TODO description.
*/
Game.AI.Fighter.FSM.Root.Core = Lucid.FSMStateComposite.extend({
	execute: function() {
		var originEntity = this.fsm.ai.getOriginEntity();

		// lower than 80 percent health?
		if (originEntity.healthPointsCurrent / originEntity.healthPointsMaximum < 0.8) {
			this.fsm.eventName = Game.AI.Fighter.FSM.EVENTS.DEFENSE_ALERT;
		}
	}
});

/**
* TODO description.
*/
Game.AI.Fighter.FSM.Root.Core.Movement = Lucid.FSMStateComposite.extend({
	execute: function() {
		var originEntity = this.fsm.ai.getOriginEntity();
		var entitiesData = this.fsm.ai.getEntitiesData();

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
						this.fsm.eventName = Game.AI.Fighter.FSM.EVENTS.ENEMY_IN_RANGE;
						break;
					}
				}
			}
		}
	}
});

/**
* TODO description.
*/
Game.AI.Fighter.FSM.Root.Core.Movement.Idle = Lucid.FSMStateAtomic.extend({
	execute: function() {
		var originEntity = this.fsm.ai.getOriginEntity();
		var entitiesData = this.fsm.ai.getEntitiesData();

		for (var i = 0; i < entitiesData.length; ++i) {
			var entityData = entitiesData[i];

			var targetEntity = entityData.entity;
			var collisionData = entityData.collisionData;

			// if there exists line-of-sight ...
			if (!collisionData) {
				// ... and its an enemy unit
				if (targetEntity.type == Lucid.BaseEntity.TYPE.UNIT && targetEntity.team != originEntity.team) {
					this.fsm.eventName = Game.AI.Fighter.FSM.EVENTS.ENEMY_LINE_OF_SIGHT;
					break;
				}
			}
		}
	}
});

/**
* TODO description.
*/
Game.AI.Fighter.FSM.Root.Core.Movement.Approach = Lucid.FSMStateAtomic.extend({
	init: function(config) {
		this._super(config);

		// check / set map reference
		this.checkSetMap();

		return true;
	},

	execute: function() {
		var originEntity = this.fsm.ai.getOriginEntity();
		var entitiesData = this.fsm.ai.getEntitiesData();

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
							originEntity.setPath(path);
						}
					}.bind(this));

					Lucid.Pathfinding.calculate();
					break;
				}
			}
		}

		if (!foundEntityOfAnotherTeam) {
			// change state of fsm
			this.fsm.eventName = Game.AI.Fighter.FSM.EVENTS.NOT_ENEMY_LINE_OF_SIGHT;
		}
	},

	leave: function() {
		this._super();

		// reset path
		this.fsm.ai.getOriginEntity().setPath(null);
	}
});

/**
* TODO description.
*/
Game.AI.Fighter.FSM.Root.Core.Combat = Lucid.FSMStateComposite.extend({
	init: function(config) {
		this._super(config);

		// check / set map reference
		this.checkSetMap();

		return true;
	},

	execute: function() {
		var originEntity = this.fsm.ai.getOriginEntity();
		var entitiesData = this.fsm.ai.getEntitiesData();

		for (var i = 0; i < entitiesData.length; ++i) {
			var entityData = entitiesData[i];

			var targetEntity = entityData.entity;
			var collisionData = entityData.collisionData;

			// no collisionData means targetEntity is in line of sight!
			if (!collisionData) {

				// check type & team
				if (targetEntity.type == Lucid.BaseEntity.TYPE.UNIT && targetEntity.team != originEntity.team) {

					// get distance between targetEntity and originEntity and check if its > minimumRange
					if (Lucid.Math.getDistanceBetweenTwoEntities(targetEntity, originEntity) > targetEntity.minimumAttackRange) {
						this.fsm.eventName = Game.AI.Fighter.FSM.EVENTS.NOT_ENEMY_IN_RANGE;
						break;
					}
				}
			}
		}
	}
});

/**
* TODO description & implementation.
*/
Game.AI.Fighter.FSM.Root.Core.Combat.Attack = Lucid.FSMStateAtomic.extend({});

/**
* TODO description.
*/
Game.AI.Fighter.FSM.Root.Defense = Lucid.FSMStateComposite.extend({
	execute: function() {
		var originEntity = this.fsm.ai.getOriginEntity();

		// higher (or equal) than 80 percent health?
		if (originEntity.healthPointsCurrent / originEntity.healthPointsMaximum >= 0.8) {
			this.fsm.eventName = Game.AI.Fighter.FSM.EVENTS.NOT_DEFENSE_ALERT;
		}
	}
});

/**
* TODO description.
*/
Game.AI.Fighter.FSM.Root.Defense.Heal = Lucid.FSMStateAtomic.extend({
	execute: function() {
		var originEntity = this.fsm.ai.getOriginEntity();

		// heal :)
		originEntity.healthPointsCurrent += 0.1;
	}
});

// event constants
Game.AI.Fighter.FSM.EVENTS = {
		ENEMY_LINE_OF_SIGHT: "enemyLineOfSight",
	NOT_ENEMY_LINE_OF_SIGHT: "notEnemyLineOfSight",

		ENEMY_IN_RANGE: "enemyInRange",
	NOT_ENEMY_IN_RANGE: "notEnemyInRange",

		DEFENSE_ALERT: "defenseAlert",
	NOT_DEFENSE_ALERT: "notDefenseAlert"
};