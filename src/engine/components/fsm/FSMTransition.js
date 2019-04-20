/**
 * TODO description.
 */
Lucid.FSMTransition = Lucid.BaseComponent.extend({
	// config variables and their default values
	toState: null, // [required] to state
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
		this.componentName = "FSMTransition";
		
		this._super(config);

		if (!this.toState) {
			Lucid.Utils.error("FSMState @ init: toState is null!");
			return false;
		}

		if (!this.eventName) {
			Lucid.Utils.error("FSMState @ init: eventName is not defined!");
			return false;
		}

		return true;
	},

	/**
	 * Sets the from state.
	 *
	 * @param      {FSMState}  fromState  The from state
	 */
	setFromState: function(fromState) {
		this.fromState = fromState;
	},

	/**
	 * Gets the from state.
	 *
	 * @return     {FSMState}  The from state.
	 */
	getFromState: function() {
		return this.fromState;
	},

	/**
	 * Sets to state.
	 *
	 * @param      {FSMState}  toState  To state
	 */
	setToState: function(toState) {
		this.toState = toState;
	},

	/**
	 * Gets to state.
	 *
	 * @return     {FSMState}  To state.
	 */
	getToState: function() {
		return this.toState;
	}
});