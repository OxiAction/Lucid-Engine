/**
 * A fsm container.
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
		this.componentName = "FSM";
		
		this._super(config);

		return true;
	}
});