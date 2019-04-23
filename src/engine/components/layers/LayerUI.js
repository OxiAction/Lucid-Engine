/**
 * Engine default LayerUI. Extends the BaseLayer.
 */
Lucid.LayerUI = Lucid.BaseLayer.extend({
	// config variables and their default values
	// ...

	// local variables
	// ...

/**
 * Core
 */

	/**
	 * Automatically called when instantiated.
	 *
	 * @param      {Object}   config  The configuration.
	 * @return     {Boolean}  Returns true on success.
	 */
	init: function(config) {
		this.checkSetComponentName("Lucid.LayerUI");
		
		this._super(config);

		this.checkSetMap();
		this.checkSetCamera();

		return true;
	}
});