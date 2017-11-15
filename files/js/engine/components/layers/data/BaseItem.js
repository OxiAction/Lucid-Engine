/**
 * Engine default BaseItem. This Component is Layer related and represented by
 * the Layer.data value(s).
 *
 * @type       {BaseItem}
 */
Lucid.BaseItem = Lucid.BaseEntity.extend({
	/**
	  * Automatically called when instantiated.
	  *
	  * @param      {Object}   config  The configuration.
	  * @return     {boolean}  Returns true on success.
	  */
	init: function(config) {
		this.componentName = "BaseItem";
		
		return this._super(config);
	}
});