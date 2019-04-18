/**
 * TODO description
 */
Lucid.FSMState = Lucid.BaseComponent.extend({
	// config variables and their default values
	fsm: null, // [required] reference to the main FSM

	// local variables
	transitions: [], // array with FSMTransitions
	parentState: null, // reference to parent FSMState
	activeState: null, // currently active FSMState
	defaultState: null, // the default FSMState

	/**
	 * Automatically called when instantiated.
	 *
	 * @param      {Object}   config  The configuration.
	 * @return     {Boolean}  Returns true on success.
	 */
	init: function(config) {
		this.componentName = "FSMState";
		
		this._super(config);

		if (!this.fsm) {
			Lucid.Utils.error("FSMState @ init: fsm is null!");
			return false;
		}

		return true;
	},

	/**
	 * Execute the state.
	 */
	execute: function() {
		// ...
	},

	/**
	 * See FSMStateComposite's update method.
	 */
	update: function() {
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
	 * Adds a transition to this state.
	 *
	 * @param      {FSMTransition}  transition  The transition
	 */
	addTransition: function(transition) {
		// inject fromState
		transition.setFromState(this);
		this.transitions.push(transition);
	},

	/**
	 * Gets the transitions.
	 *
	 * @return     {FSMTransition}  The transitions.
	 */
	getTransitions: function() {
		return this.transitions;
	},

	/**
	 * Sets the parent state.
	 *
	 * @param      {FSMState}  parentState  The parent state
	 */
	setParentState: function(parentState) {
		this.parentState = parentState;
	},

	/**
	 * Gets the parent state.
	 *
	 * @return     {FSMState}  The parent state.
	 */
	getParentState: function() {
		return this.parentState;
	},

	/**
	 * Sets the active state.
	 *
	 * @param      {FSMState}  activeState  The active state
	 */
	setActiveState: function(activeState) {
		Lucid.Utils.log("FSMState @ setActiveState: " + this.componentName + " to: " + activeState.componentName);
		this.activeState = activeState;
	},

	/**
	 * Gets the active state.
	 *
	 * @return     {FSMState}  The active state.
	 */
	getActiveState: function() {
		return this.activeState;
	},

	/**
	 * Sets the default state.
	 *
	 * @param      {FSMState}  defaultState  The default state
	 */
	setDefaultState: function(defaultState) {
		Lucid.Utils.log("FSMState @ setDefaultState: " + this.componentName + " to: " + defaultState.componentName);
		this.defaultState = defaultState;
	},

	/**
	 * Gets the default state.
	 *
	 * @return     {FSMState}  The default state.
	 */
	getDefaultState: function() {
		return this.defaultState;
	}
});