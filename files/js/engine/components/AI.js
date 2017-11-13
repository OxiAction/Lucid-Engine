/**
 * Engine default AI.
 * This component also handles pathfinding.
 *
 * @type       {AI}
 */
Lucid.AI = BaseComponent.extend({
	// config variables and their default values
	

	// local variables

	/**
	  * Automatically called when instantiated.
	  *
	  * @param      {Object}   config  The configuration.
	  * @return     {boolean}  Returns true on success.
	  */
	init: function(config) {
		this.componentName = "AI";
		
		this._super(config);

		return true;
	},

	/**
	 * Change behavior by setting a new AI.BEHAVIOR.XXX (some TYPES require
	 * additional data)
	 *
	 * @param      {string}  type    The new AI.BEHAVIOR.XXX.
	 * @param      {Object}  data    The data. See comments about
	 *                               AI.BEHAVIOR.XXX constants for further data
	 *                               Object explanations.
	 */
	changeBehavior: function(type, data) {
		// TODO: ...
	},

	/**
	 * Sets the active state.
	 *
	 * @param      {boolean}  value   The value.
	 */
	setActive: function(value) {
		// TODO: enable / disable.

		this._super(value);
	}
});

// behavior constants
Lucid.AI.BEHAVIOR = {
	/**
	 * follow another Entity
	 * 
	 * data = {
	 * 	target: Entity, // the target Entity to follow
	 * 	keepDistance: number // the distance kept between target and this
	 * }
	 */
	FOLLOW: "follow",

	/**
	 * randomly patrol a certrain radius using the origin position as center
	 * 
	 * data = {
	 * 	radius: number, // radius to patrol
	 * 	useYAxis: boolean // stay on the ground currently attached on or jump on higher / lower grounds too
	 * }
	 */
	PATROL: "patrol",

	/**
	 * hold origin position
	 * 
	 * data = {
	 * 	moveOnTrigger: boolean // move when triggered - e.g. when engaging a fight with another Entity - after the fight returns to origin position
	 * }
	 */
	HOLD: "holdPosition"
};