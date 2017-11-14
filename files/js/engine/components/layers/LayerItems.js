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
	  * @return     {boolean}  Returns true on success.
	  */
	init: function(config) {
		this.componentName = "LayerItems";
		
		this._super(config);

		return true;
	},

	/**
	 * Draws a Canvas.
	 *
	 * @param      {number}  delta   The delta.
	 * @param      {Object}  config  The configuration.
	 * @return     {Canvas}  Returns the drawn Canvas.
	 */
	draw: function(delta, config) {
		return this._super(delta, config);
	},

	resize: function(config) {
		this._super(config);
	},

	/**
	 * Destroys the Layer and all its corresponding objects.
	 *
	 * @return     {boolean}  Returns true on success.
	 */
	destroy: function() {
		return this._super();
	}
});