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