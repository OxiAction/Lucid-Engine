/**
 * A Atomic State is a final State, which means it does
 * not contain any child States.
 */
Lucid.FSMStateAtomic = Lucid.FSMState.extend({

	/**
	 * Automatically called when instantiated.
	 *
	 * @param      {Object}   config  The configuration.
	 * @return     {Boolean}  Returns true on success.
	 */
	init: function(config) {
		this.checkSetComponentName("Lucid.FSMStateAtomic");
		
		this._super(config);

		return true;
	}
});