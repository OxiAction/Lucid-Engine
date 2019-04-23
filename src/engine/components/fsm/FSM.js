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
 * To create a new Finite-State-Machine (FSM), extend 
 * Lucid.FSM and define the States structure inside 
 * the init() function.
 * 
 * In addition, pass your extending FSM as a reference
 * to each State, using the "fsm" config property.
 */
Lucid.FSM = Lucid.BaseComponent.extend({
	// local variables
	eventName: "", // the event name defines the current transition

	/**
	 * Automatically called when instantiated.
	 *
	 * @param      {Object}   config  The configuration.
	 * @return     {Boolean}  Returns true on success.
	 */
	init: function(config) {
		this.checkSetComponentName("Lucid.FSM");
		
		this._super(config);

		return true;
	}
});