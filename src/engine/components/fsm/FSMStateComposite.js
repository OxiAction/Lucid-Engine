/**
 * TODO description
 */
Lucid.FSMStateComposite = Lucid.FSMState.extend({
	// local variables
	childStates: [], // array with (children) FSMStates

	/**
	 * Automatically called when instantiated.
	 *
	 * @param      {Object}   config  The configuration.
	 * @return     {Boolean}  Returns true on success.
	 */
	init: function(config) {
		this.componentName = "FSMStateComposite";
		
		this._super(config);

		return true;
	},

	/**
	 * TODO description
	 */
	update: function() {
		if (this.getActiveState() == null) {
			return false;
		}

		// CASE 1: transition required

		// fetch transitions from this active (child) state
		transitions = this.getActiveState().getTransitions();
		
		if (typeof transitions !== 'undefined' && transitions.length > 0) {

			for (i = 0; i < transitions.length; ++i) {
				var transition = transitions[i];
				
				if (transition && this.getFSM().eventName == transition.eventName) {
					// get new toState from transition ...
					toState = transition.getToState();

					// ... and set it as currently active state
					this.setActiveState(toState);

					Lucid.Utils.log("FSMStateComposite @ update transition details:\neventName -> " + this.getFSM().eventName + "\ndeactivate -> " + transition.getFromState().componentName + "\nactivate -> " + transition.getToState().componentName);

					// set the toState active state to the default state (if available)
					if (toState.getDefaultState() != null) {
						toState.setActiveState(toState.getDefaultState());
					}

					// execute / update the new toState (possible recursion)
					toState.execute();
					toState.update();

					// leave here, so we dont end up in CASE 2
					return;
				}
			}
		}

		// CASE 2: there was no transition - just execute / update this active state
		
		this.getActiveState().execute();
		this.getActiveState().update();
	},

	/**
	 * Execute the composite state.
	 */
	execute: function() {
		// ...
	},

	/**
	 * Adds a child state.
	 *
	 * @param      {FSMState}  state   The state
	 */
	addChildState: function(state) {
		this.childStates.push(state);
		state.setParentState(this);
	},

	/**
	 * Gets the child states.
	 *
	 * @return     {Array}  The child states.
	 */
	getChildStates: function() {
		return this.childStates;
	}
});