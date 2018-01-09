/**
 * Basic AI module.
 */
Lucid.BaseAIModule = Lucid.BaseComponent.extend({

	ai: null, // reference to AI

	/**
	 * Automatically called when instantiated.
	 *
	 * @param      {Object}   config  The configuration.
	 * @return     {Boolean}  Returns true on success.
	 */
	init: function(config) {
		this._super(config);

		this.checkSetMap();
		this.checkSetCamera();
		this.checkSetEngine();

		return true;
	},

	/**
	 * The renderUpdate() function should simulate anything that is affected by
	 * time. It can be called zero or more times per frame depending on the
	 * frame rate.
	 *
	 * @param      {Number}  delta   The amount of time in milliseconds to
	 *                               simulate in the update.
	 */
	renderUpdate: function(delta) {
	},

	/**
	 * Draw things.
	 *
	 * @param      {Number}  interpolationPercentage  The cumulative amount of
	 *                                                time that hasn't been
	 *                                                simulated yet, divided by
	 *                                                the amount of time that
	 *                                                will be simulated the next
	 *                                                time renderUpdate() runs.
	 *                                                Useful for interpolating
	 *                                                frames.
	 */
	renderDraw: function(interpolationPercentage) {
	},

	/**
	 * Sets the ai.
	 *
	 * @param      {AI}  ai      The ai.
	 */
	setAI: function(ai) {
		this.ai = ai;
	},

	/**
	 * Gets the ai.
	 *
	 * @return     {AI}  The ai.
	 */
	getAI: function() {
		return this.ai;
	},

	/**
	 * Resize method. Usually called when the screen / browser dimensions have
	 * changed.
	 *
	 * @param      {Object}  config  The configuration which must contain the
	 *                               properties wWidth and wHeight.
	 */
	resize: function(config) {
	},

	/**
	 * Destroys the BaseEntity and all its corresponding objects.
	 *
	 * @return     {Boolean}  Returns true on success.
	 */
	destroy: function() {
		this._super();
	}
});