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
 * A Transition is used, to change from one State to another,
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