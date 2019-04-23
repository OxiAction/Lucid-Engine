/**
 * A Transition is used to change from one State to another,
 * based on the Transition eventName property and the current 
 * FSM reference Object eventName property.
 */
Lucid.FSMTransition = Lucid.BaseComponent.extend({
	// config variables and their default values
	toState: null, // [required] the state to transition to
	eventName: null, // [required] event name which triggers this transition

	// local variables
	fromState: null, // from state - this will be injected when added to a state

	/**
	 * Automatically called when instantiated.
	 *
	 * @param      {Object}   config  The configuration.
	 * @return     {Boolean}  Returns true on success.
	 */
	init: function(config) {
		this.checkSetComponentName("Lucid.FSMTransition");
		
		this._super(config);

		if (!this.toState) {
			Lucid.Utils.error(this.componentName + " @ init: toState is null!");
			return false;
		}

		if (!this.eventName) {
			Lucid.Utils.error(this.componentName + " @ init: eventName is not defined!");
			return false;
		}

		return true;
	},

	/**
	 * Sets the from State.
	 *
	 * @param      {FSMState}  fromState  The from State
	 */
	setFromState: function(fromState) {
		this.fromState = fromState;
	},

	/**
	 * Gets the from State.
	 *
	 * @return     {FSMState}  The from State.
	 */
	getFromState: function() {
		return this.fromState;
	},

	/**
	 * Sets to State.
	 *
	 * @param      {FSMState}  toState  To State
	 */
	setToState: function(toState) {
		this.toState = toState;
	},

	/**
	 * Gets to State.
	 *
	 * @return     {FSMState}  To State.
	 */
	getToState: function() {
		return this.toState;
	}
});