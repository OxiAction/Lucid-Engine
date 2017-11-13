/**
 * Engine default Entity.
 *
 * @type       {Entity}
 */
Lucid.Entity = BaseComponent.extend({
	// config variables and their default values
	position: {
        x: 0,
        y: 0
    },
    offset: {
    	x: 0,
    	y: 0
    },
    health: {
    	current: 100, // current health
    	min: 0, // minimum health (if reached entity is dead)
    	max: 100 // maximum health
    },
	name: "Unknown", // name
	speed: 1, // speed
	vulnerable: 1,
	weight: 80, // weight in kilograms

	// local variables
	controls: {}, // registered controls

	/**
	  * Automatically called when instantiated.
	  *
	  * @param      {Object}   config  The configuration.
	  * @return     {boolean}  Returns true on success.
	  */
	init: function(config) {
		this.componentName = "Entity";
		
		this._super(config);

		return true;
	},

	/**
	 * Adds a control.
	 *
	 * @param      {Control}  control  The control.
	 */
	addControl: function(control) {
		this.controls[control.getType()] = control;
	},

	/**
	 * Sets the active state.
	 *
	 * @param      {boolean}  value  The value.
	 */
	setActive: function(value) {
		// TODO: enable / disable controls.

		this._super(value);
	}
});

// forms setup for the editor
Lucid.Entity.FORMS = {
	position: {
		x: "int",
		y: "int"
	},
	name: "string",
	speed: "number",
	vulnerable: "boolean",
	weight: "number"
};