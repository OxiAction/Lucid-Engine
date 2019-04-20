/**
 * TODO description.
 */
Lucid.FSMStateAtomic = Lucid.FSMState.extend({

	/**
	 * Automatically called when instantiated.
	 *
	 * @param      {Object}   config  The configuration.
	 * @return     {Boolean}  Returns true on success.
	 */
	init: function(config) {
		this.componentName = "FSMStateAtomic";
		
		this._super(config);

		return true;
	}
});