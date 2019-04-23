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
 * Base Object for FSMStateAtomic and FSMStateComposite.
 */
Lucid.FSMState = Lucid.BaseComponent.extend({
	// config variables and their default values
	fsm: null, // [required] fsm reference object

	// local variables
	transitions: [], // array with transitions
	parentState: null, // reference to parent state
	activeState: null, // currently active state
	defaultState: null, // the default state

	/**
	 * Automatically called when instantiated.
	 *
	 * @param      {Object}   config  The configuration.
	 * @return     {Boolean}  Returns true on success.
	 */
	init: function(config) {
		this.checkSetComponentName("Lucid.FSMState");
		
		this._super(config);

		if (!this.fsm) {
			Lucid.Utils.error(this.componentName + " @ init: fsm is null!");
			return false;
		}

		return true;
	},

	/**
	 * Override this function to implement your own logic,
	 * which is being executed when this State is active.
	 */
	execute: function() {
		// ...
	},

	/**
	 * See FSMStateComposite -> update()
	 */
	update: function() {
		// ...
	},

	/**
	 * This method is called, if this State is left due to a Transition.
	 * This also notifies recursively other (underlying) active States!
	 */
	leave: function() {
		Lucid.Utils.log(this.componentName + " @ leave: " + this.componentName);

		if (this.getActiveState()) {
			this.getActiveState().leave();
		}
	},

	/**
	 * Sets the FSM reference Object.
	 *
	 * @param      {FSM}  fsm     The fsm
	 */
	setFSM: function(fsm) {
		this.fsm = fsm;
	},

	/**
	 * Gets the FSM reference Object.
	 *
	 * @return     {FSM}  The fsm.
	 */
	getFSM: function() {
		return this.fsm;
	},

	/**
	 * Adds a Transition to this State.
	 *
	 * @param      {FSMTransition}  transition  The Transition
	 */
	addTransition: function(transition) {
		// inject fromState
		transition.setFromState(this);
		this.transitions.push(transition);
	},

	/**
	 * Gets the Transitions Array.
	 *
	 * @return     {FSMTransition}  The Transitions.
	 */
	getTransitions: function() {
		return this.transitions;
	},

	/**
	 * Sets the parent State.
	 *
	 * @param      {FSMState}  parentState  The parent State
	 */
	setParentState: function(parentState) {
		this.parentState = parentState;
	},

	/**
	 * Gets the parent State.
	 *
	 * @return     {FSMState}  The parent State.
	 */
	getParentState: function() {
		return this.parentState;
	},

	/**
	 * Sets the active State.
	 *
	 * @param      {FSMState}  activeState  The active State
	 */
	setActiveState: function(activeState) {
		Lucid.Utils.log(this.componentName + " @ setActiveState: " + this.componentName + " to: " + activeState.componentName);
		this.activeState = activeState;
	},

	/**
	 * Gets the active State.
	 *
	 * @return     {FSMState}  The active State.
	 */
	getActiveState: function() {
		return this.activeState;
	},

	/**
	 * Sets the default State.
	 *
	 * @param      {FSMState}  defaultState  The default State
	 */
	setDefaultState: function(defaultState) {
		Lucid.Utils.log(this.componentName + " @ setDefaultState: " + this.componentName + " to: " + defaultState.componentName);
		this.defaultState = defaultState;

		if (!this.getActiveState()) {
			this.setActiveState(defaultState);
		}
	},

	/**
	 * Gets the default State.
	 *
	 * @return     {FSMState}  The default State.
	 */
	getDefaultState: function() {
		return this.defaultState;
	}
});