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

/**
 * A Composite State is a container State, which means it does
 * contain one or multiple child States.
 * 
 * By default, the first active State is the specified default State.
 */
Lucid.FSMStateComposite = Lucid.FSMState.extend({
	// local variables
	childStates: [], // array with child states

	/**
	 * Automatically called when instantiated.
	 *
	 * @param      {Object}   config  The configuration.
	 * @return     {Boolean}  Returns true on success.
	 */
	init: function(config) {
		this.checkSetComponentName("Lucid.FSMStateComposite");
		
		this._super(config);

		return true;
	},

	/**
	 *  Checks the currently active State Transitions and (if necessary)
	 *  changes to a new active State. This happens, by comparing the Transitions 
	 *  eventName property with the FSM reference Object eventName property.
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
					Lucid.Utils.log(this.componentName + " @ update transition details:\neventName -> " + this.getFSM().eventName + "\ndeactivate -> " + transition.getFromState().componentName + "\nactivate -> " + transition.getToState().componentName);

					// set toState as currently active state
					this.setActiveState(toState);
					
					// set toState active state to its default state (if available)
					if (toState.getDefaultState()) {
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