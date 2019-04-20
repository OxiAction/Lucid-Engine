/**
 * TODO description.
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
	 * TODO description.
	 */
	update: function() {
		if (!this.getActiveState()) {
			return false;
		}

		// CASE 1: transition required for this active state

		// fetch transitions from this active state
		transitions = this.getActiveState().getTransitions();

		// sanity check
		if (transitions.length > 0) {

			for (i = 0; i < transitions.length; ++i) {
				var transition = transitions[i];
				
				if (transition && this.getFSM().eventName == transition.eventName) {
					// get fromState and new toState from transition
					fromState = transition.getFromState();
					toState = transition.getToState();

					// leave fromState (possible recursion)
					fromState.leave();

					// debug
					Lucid.Utils.log("FSMStateComposite @ update transition details:\neventName -> " + this.getFSM().eventName + "\ndeactivate -> " + transition.getFromState().componentName + "\nactivate -> " + transition.getToState().componentName);

					// set toState as currently active state
					this.setActiveState(toState);
					
					// set toState active state to its default state (if available)
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

		// CASE 2: there was no transition - just execute this active state.
		// NOTE: if this active state changed the eventName, we dont want to update
		// it (the active state), as its childs could possibly change the eventName again!
		
		var tmpEventName = this.getFSM().eventName;
		this.getActiveState().execute();
		if (this.getFSM().eventName == tmpEventName) {
			this.getActiveState().update();
		}
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