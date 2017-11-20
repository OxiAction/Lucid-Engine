/**
 * Engine default LayerItems.
 * Extends the BaseLayer.
 */
Lucid.LayerItems = Lucid.BaseLayer.extend({
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
		this.componentName = "LayerItems";
		
		this._super(config);

		this.checkSetMap();
		this.checkSetCamera();

		return true;
	},

	resize: function(config) {
		this._super(config);
	},

	/**
	 * Destroys the Layer and all its corresponding objects.
	 *
	 * @return     {Boolean}  Returns true on success.
	 */
	destroy: function() {
		return this._super();
	}
});