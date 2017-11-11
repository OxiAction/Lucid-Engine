/**
* Engine2D BaseComponent
*/
var BaseComponent = Class.extend({
	// config variables and their default values
	// @type       {string}
	id: null,
	// @type       {string}
	type: null,
	// @type       {boolean}
	active: true,

	// local variables
	// component name
	componentName: "UndefinedComponentName",
	// namespace - e.g. required event publishing
	componentNamespace: ".UndefinedComponentName",

	/**
	  * Automatically called when instantiated.
	  *
	  * @param      {Object}   config  The configuration.
	  * @return     {boolean}  Returns true on success.
	  */
	init: function(config){
		EngineUtils.log("Component " + this.componentName);

		this.componentNamespace = "." + this.componentName;

		// write target, default values target, new values (overrides default values)
		$.extend(this, this, config);

		return true;
	},

	/**
	 * Sets the type.
	 *
	 * @param      {string}  value   The value.
	 */
	setType: function(value) {
		this.type = value;
	},

	/**
	 * Gets the type.
	 *
	 * @return     {string}  The type.
	 */
	getType: function() {
		return this.type;
	},

	/**
	 * Sets the active state.
	 *
	 * @param      {boolean}  value   The value.
	 */
	setActive: function(value) {
		this.active = value;
	},

	/**
	 * Gets the active.
	 *
	 * @return     {boolean}  The active state.
	 */
	getActive: function() {
		return this.active;
	},

	/**
	 * Gets the id.
	 *
	 * @return     {string}  The id.
	 */
	getID: function() {
		return this.id;
	}
});