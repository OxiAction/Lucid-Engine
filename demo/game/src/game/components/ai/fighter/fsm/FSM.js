/**
 * Lucid Engine
 * Copyright (C) 2019 Michael Schreiber
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 * 
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

// namespace
var Game = Game || {};
Game.AI = Game.AI || {};
Game.AI.Fighter = Game.AI.Fighter || {};

/**
 * Definition of an Finite-State-Machine (FSM) Object, 
 * used in an Lucid.AI Object. This Lucid.AI Object 
 * can be attached to Entities and ultimately simulates 
 * artificial intelligence, based on the concept of the FSM.
 * 
 * @see Lucid.AI
 * @see Lucid.BaseEntity
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
			Lucid.Utils.error(this.componentName + " @ init: ai is null!");
			return false;
		}

		//////////////////////////
		// step 1 -> setup states:

			// root
			this.root = new Game.AI.Fighter.FSM.Root({ componentName: this.componentName + ".Root", fsm: this });

			// composite states (of root):
				// a) core
				var core = new Game.AI.Fighter.FSM.Root.Core({ componentName: this.componentName + ".Core", fsm: this });

				// composite states (of core):
					// a.a) movement
					var movement = new Game.AI.Fighter.FSM.Root.Core.Movement({ componentName: this.componentName + ".Movement", fsm: this });

					// atomic states (of movement)
						var idle = new Game.AI.Fighter.FSM.Root.Core.Movement.Idle({ componentName: this.componentName + ".Idle", fsm: this });
						var approach = new Game.AI.Fighter.FSM.Root.Core.Movement.Approach({ componentName: this.componentName + ".Approach", fsm: this });

					movement.addChildState(idle);
					movement.addChildState(approach);
					movement.setDefaultState(idle);

					// a.b) combat
					var combat = new Game.AI.Fighter.FSM.Root.Core.Combat({ componentName: this.componentName + ".Combat", fsm: this });

					// atomic states (of combat)
						var attack = new Game.AI.Fighter.FSM.Root.Core.Combat.Attack({ componentName: this.componentName + ".Attack", fsm: this });

					combat.addChildState(attack);
					combat.setDefaultState(attack);

				core.addChildState(movement);
				core.addChildState(combat);
				core.setDefaultState(movement);

				// b) defense
				var defense = new Game.AI.Fighter.FSM.Root.Defense({ componentName: this.componentName + ".Defense", fsm: this });

				// atomic states (of defense)
					var heal = new Game.AI.Fighter.FSM.Root.Defense.Heal({ componentName: this.componentName + ".Heal", fsm: this });

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
 * The root container State.
 */
Game.AI.Fighter.FSM.Root = Lucid.FSMStateComposite.extend({});

/**
 * In case originEntity healtPoints are lower than
 * defined percent, change eventName to DEFENSE_ALERT.
 */
Game.AI.Fighter.FSM.Root.Core = Lucid.FSMStateComposite.extend({
	execute: function() {
		var originEntity = this.fsm.ai.getOriginEntity();

		// if lower than defined percent ...
		if (originEntity.healthPointsCurrent / originEntity.healthPointsMaximum < 0.3) {
			// ... change eventName to DEFENSE_ALERT
			this.fsm.eventName = Game.AI.Fighter.FSM.EVENTS.DEFENSE_ALERT;
		}
	}
});

/**
 * Check for hostile Entities in line-of-sight and 
 * change eventName to ENEMY_IN_RANGE.
 */
Game.AI.Fighter.FSM.Root.Core.Movement = Lucid.FSMStateComposite.extend({
	execute: function() {
		var originEntity = this.fsm.ai.getOriginEntity();
		// // try to get the first (closest) hostile entity in line-of-sight ...
		var closestHostileEntityInLineOfSight = this.fsm.ai.getHostileEntitiesInLineOfSight()[0];

		// ... if available ...
		if (closestHostileEntityInLineOfSight) {
			// ... check if its within the originEntity minimumAttackRange ...
			if (Lucid.Math.getDistanceBetweenTwoEntities(closestHostileEntityInLineOfSight, originEntity) <= originEntity.minimumAttackRange) {
				// ... change eventName to ENEMY_IN_RANGE
				this.fsm.eventName = Game.AI.Fighter.FSM.EVENTS.ENEMY_IN_RANGE;
			}
		}
	}
});

/**
 * Change eventName to ENEMY_LINE_OF_SIGHT, in case 
 * there exists a hostile Entity within line-of-sight.
 */
Game.AI.Fighter.FSM.Root.Core.Movement.Idle = Lucid.FSMStateAtomic.extend({
	execute: function() {
		var originEntity = this.fsm.ai.getOriginEntity();
		// try to get the first (closest) hostile entity in line-of-sight ...
		var closestHostileEntityInLineOfSight = this.fsm.ai.getHostileEntitiesInLineOfSight()[0];

		// ... if available ...
		if (closestHostileEntityInLineOfSight) {
			// ... change eventName to ENEMY_LINE_OF_SIGHT
			this.fsm.eventName = Game.AI.Fighter.FSM.EVENTS.ENEMY_LINE_OF_SIGHT;
		}
	}
});

/**
 * Check for a hostile Entity in line-of-sight and 
 * approach it. If no valid hostile Entity was found, 
 * change eventName to NOT_ENEMY_LINE_OF_SIGHT.
 * 
 * Clear path (stop movement) when this State is left.
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
		// try to get the first (closest) hostile entity in line-of-sight ...
		var closestHostileEntityInLineOfSight = this.fsm.ai.getHostileEntitiesInLineOfSight()[0];
		
		// ... if available ...
		if (closestHostileEntityInLineOfSight) {
			var originEntityGridIndices = Lucid.Math.getEntityToGridIndices(originEntity, this.map.tileSize);
			var targetEntityGridIndices = Lucid.Math.getEntityToGridIndices(closestHostileEntityInLineOfSight, this.map.tileSize);

			// ... approach it
			Lucid.Pathfinding.findPath(originEntityGridIndices[0], originEntityGridIndices[1], targetEntityGridIndices[0], targetEntityGridIndices[1], function(path) {
				if (path) {
					this.fsm.ai.getOriginEntity().setPath(path);
				}
			}.bind(this));

			Lucid.Pathfinding.calculate();
		} 
		// ... if not available ...
		else {
			// ... change eventName to NOT_ENEMY_LINE_OF_SIGHT
			this.fsm.eventName = Game.AI.Fighter.FSM.EVENTS.NOT_ENEMY_LINE_OF_SIGHT;
		}
	},

	leave: function() {
		this._super();

		// stop movement
		this.fsm.ai.getOriginEntity().setPath(null);
	}
});

/**
 * Change eventName to NOT_ENEMY_IN_RANGE, in case 
 * there is no hostile Entity within the originEntity 
 * minimumAttackRange.
 */
Game.AI.Fighter.FSM.Root.Core.Combat = Lucid.FSMStateComposite.extend({
	execute: function() {
		var originEntity = this.fsm.ai.getOriginEntity();

		// try to get the first (closest) hostile entity in line-of-sight ...
		var closestHostileEntityInLineOfSight = this.fsm.ai.getHostileEntitiesInLineOfSight()[0];

		// ... if available ...
		if (closestHostileEntityInLineOfSight) {
			// ... check if its outside of the originEntity minimumAttackRange ...
			if (Lucid.Math.getDistanceBetweenTwoEntities(closestHostileEntityInLineOfSight, originEntity) > originEntity.minimumAttackRange) {
				// ... change eventName to NOT_ENEMY_IN_RANGE
				this.fsm.eventName = Game.AI.Fighter.FSM.EVENTS.NOT_ENEMY_IN_RANGE;
			}
		}
	}
});

/**
 * Apply damage to the first hostile Entity, within 
 * originEntity minimumAttackRange.
 * 
 * Note: 	In case we want to deal Area-of-Effect (AoE) 
 * 			damage, we could also iterate through the 
 * 			hostile Entities Array and apply the damage 
 * 			for each Entity within range.
 */
Game.AI.Fighter.FSM.Root.Core.Combat.Attack = Lucid.FSMStateAtomic.extend({
	execute: function() {
		var originEntity = this.fsm.ai.getOriginEntity();

		// try to get the first (closest) hostile entity in line-of-sight ...
		var closestHostileEntityInLineOfSight = this.fsm.ai.getHostileEntitiesInLineOfSight()[0];

		// ... if available ...
		if (closestHostileEntityInLineOfSight) {
			// ... check if its within of the originEntity minimumAttackRange
			if (Lucid.Math.getDistanceBetweenTwoEntities(closestHostileEntityInLineOfSight, originEntity) <= originEntity.minimumAttackRange) {
				closestHostileEntityInLineOfSight.healthPointsCurrent = Math.max(0, closestHostileEntityInLineOfSight.healthPointsCurrent - 0.5);
			}
		}
	}
});

/**
 * Check if originEntity has enough healthPoints and
 * change eventName to NOT_DEFENSE_ALERT.
 */
Game.AI.Fighter.FSM.Root.Defense = Lucid.FSMStateComposite.extend({
	execute: function() {
		var originEntity = this.fsm.ai.getOriginEntity();

		// higher (or equal) than defined percent health?
		if (originEntity.healthPointsCurrent / originEntity.healthPointsMaximum >= 0.3) {
			this.fsm.eventName = Game.AI.Fighter.FSM.EVENTS.NOT_DEFENSE_ALERT;
		}
	}
});

/**
 * Recover healthPoints of originEntity.
 */
Game.AI.Fighter.FSM.Root.Defense.Heal = Lucid.FSMStateAtomic.extend({
	execute: function() {
		var originEntity = this.fsm.ai.getOriginEntity();

		// recover healthPoints
		originEntity.healthPointsCurrent += 0.1;
	}
});

// FSM eventName constants
Game.AI.Fighter.FSM.EVENTS = {
		ENEMY_LINE_OF_SIGHT: "enemyLineOfSight",
	NOT_ENEMY_LINE_OF_SIGHT: "notEnemyLineOfSight",

		ENEMY_IN_RANGE: "enemyInRange",
	NOT_ENEMY_IN_RANGE: "notEnemyInRange",

		DEFENSE_ALERT: "defenseAlert",
	NOT_DEFENSE_ALERT: "notDefenseAlert"
};