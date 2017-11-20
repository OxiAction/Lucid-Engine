/**
 * Engine default User.
 *
 * @type       {User}
 */
Lucid.User = BaseComponent.extend({
	name: "Unknown User", // name
	entity: null, // associated entity

	// local variables

	/**
	  * Automatically called when instantiated.
	  *
	  * @param      {Object}   config  The configuration.
	  * @return     {Boolean}  Returns true on success.
	  */
	init: function(config) {
		this.componentName = "User";
		
		this._super(config);

		return true;
	},

	/**
	 * Sets the entity.
	 *
	 * @param      {Entity}  value   The value
	 */
	setEntity: function(value) {
		this.entity = value;
	},

	/**
	 * Gets the entity.
	 *
	 * @return     {Entity}  The entity.
	 */
	getEntity: function() {
		return this.entity;
	},

	/**
	 * Sets the active state.
	 *
	 * @param      {Boolean}  value  The value.
	 */
	setActive: function(value) {
		// TODO: enable / disable.

		this._super(value);
	}
});