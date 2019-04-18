/**
* Game custom AI FSM for Fighter Entity.
*/
var AIFSMFighter = Lucid.FSM.extend({
	// config variables and their default values
	ai: null, // [required] reference to AI

	// local variables
	root: null, // root state

	init: function(config) {
		this.componentName = "AIFSMFighter";

		this._super(config);

		if (!this.ai) {
			Lucid.Utils.error("AIFSMFighter @ init: ai is null!");
			return false;
		}

	// root (AI)

		this.root = new Lucid.FSMStateComposite({
			componentName: "AI",
			fsm: this
		});

	// movement setup

		var movement = new AIFSMStateMovement({
			componentName: "Movement",
			fsm: this,
			ai: this.ai
		});

		var idle = new AIFSMStateIdle({
			componentName: "Idle",
			fsm: this,
			ai: this.ai
		});

		var approach = new AIFSMStateApproach({
			componentName: "Approach",
			fsm: this,
			ai: this.ai
		});

		idle.addTransition(new Lucid.FSMTransition({
			toState: approach,
			eventName: AIFSMFighter.EVENTS.ENEMY_IS_IN_LINE_OF_SIGHT
		}));

		approach.addTransition(new Lucid.FSMTransition({
			toState: idle,
			eventName: AIFSMFighter.EVENTS.ENEMY_NOT_IN_LINE_OF_SIGHT
		}));

		movement.addChildState(idle);
		movement.addChildState(approach);

		// default
		movement.setDefaultState(idle);

		this.root.addChildState(movement);

	// combat setup

		var combat = new AIFSMStateCombat({
			componentName: "Combat",
			fsm: this,
			ai: this.ai
		});

		var attack = new AIFSMStateAttack({
			componentName: "Attack",
			fsm: this,
			ai: this.ai
		});

		combat.addChildState(attack);

		// default
		combat.setDefaultState(attack);

		this.root.addChildState(combat);

	// transition(s) between movement and combat

		movement.addTransition(new Lucid.FSMTransition({
			toState: combat,
			eventName: AIFSMFighter.EVENTS.ENEMY_IS_IN_RANGE
		}));

		combat.addTransition(new Lucid.FSMTransition({
			toState: movement,
			eventName: AIFSMFighter.EVENTS.ENEMY_NOT_IN_RANGE
		}));
		// or
		combat.addTransition(new Lucid.FSMTransition({
			toState: movement,
			eventName: AIFSMFighter.EVENTS.ENEMY_DEAD
		}));

	// start

		this.root.setDefaultState(movement);
		this.root.setActiveState(movement);

		movement.setActiveState(idle);

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

// type constants
AIFSMFighter.EVENTS = {
	ENEMY_IS_IN_LINE_OF_SIGHT: "enemyIsInLineOfSight",
	ENEMY_NOT_IN_LINE_OF_SIGHT: "enemyNotInLineOfSight",
	ENEMY_DEAD: "enemyDead",
	ENEMY_IS_IN_RANGE: "enemyIsInRange",
	ENEMY_NOT_IN_RANGE: "enemyNotInRange"
};