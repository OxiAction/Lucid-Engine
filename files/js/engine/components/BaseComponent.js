/**
* Engine BaseComponent
*/
var BaseComponent = Class.extend({
	// config variables and their default values
	// @type       {String}
	id: null,
	// @type       {String}
	type: null,
	// @type       {Boolean}
	active: true,
	// @type       {Map}
	map: null,
	// @type       {Camera}
	camera: null,
	// @type       {Engine}
	engine: null,

	// local variables
	// component name
	componentName: "UndefinedComponentName",
	// namespace - e.g. required event publishing
	componentNamespace: ".UndefinedComponentName",

	/**
	  * Automatically called when instantiated.
	  *
	  * @param      {Object}   config  The configuration.
	  * @return     {Boolean}  Returns true on success.
	  */
	init: function(config){
		Lucid.Utils.log("Component " + this.componentName);

		this.componentNamespace = "." + this.componentName;

		// write target, default values target, new values (overrides default values)
		$.extend(this, this, config);

		return true;
	},

	/**
	 * Checks if this.map is defined. If not, tries to set this.map to
	 * Lucid.data.engine.getCamera(). On fail -> error.
	 *
	 * @return     {Boolean}  Returns true on success.
	 */
	checkSetMap: function() {
		if (!this.map) {
			var map = Lucid.data.engine.getMap();
			if (!map) {
				Lucid.Utils.error("BaseComponent @ init: this.map AND Lucid.data.engine.getMap() is null!");
				return false;
			} else {
				this.setMap(map);
			}
		}

		return true;
	},

	/**
	 * Checks if this.camera is defined. If not, tries to set this.camera to
	 * Lucid.data.engine.getCamera(). On fail -> error.
	 *
	 * @return     {Boolean}  Returns true on success.
	 */
	checkSetCamera: function() {
		if (!this.camera) {
			var camera = Lucid.data.engine.getCamera();
			if (!camera) {
				Lucid.Utils.error("BaseComponent @ init: this.camera AND Lucid.data.engine.getCamera() is null!");
				return false;
			} else {
				this.setCamera(camera);
			}
		}

		return true;
	},

	/**
	 * Checks if this.engine is defined. If not, tries to set this.engine to
	 * Lucid.data.engine. On fail -> error.
	 *
	 * @return     {Boolean}  Returns true on success.
	 */
	checkSetEngine: function() {
		if (!this.engine) {
			var engine = Lucid.data.engine;
			if (!engine) {
				Lucid.Utils.error("BaseComponent @ init: this.engine AND Lucid.data.engine is null!");
				return false;
			} else {
				this.setEngine(engine);
			}
		}

		return true;
	},

	/**
	 * Destroy.
	 */
	destroy: function() {
		this.map = null;
		this.camera = null;
		this.engine = null;
	},

	/**
	 * Sets the type.
	 *
	 * @param      {String}  value   The value.
	 */
	setType: function(value) {
		this.type = value;
	},

	/**
	 * Gets the type.
	 *
	 * @return     {String}  The type.
	 */
	getType: function() {
		return this.type;
	},

	/**
	 * Sets the active state.
	 *
	 * @param      {Boolean}  value   The value.
	 */
	setActive: function(value) {
		this.active = value;
	},

	/**
	 * Gets the active.
	 *
	 * @return     {Boolean}  The active state.
	 */
	getActive: function() {
		return this.active;
	},

	/**
	 * Gets the id.
	 *
	 * @return     {String}  The id.
	 */
	getID: function() {
		return this.id;
	},

	/**
	 * Gets the map.
	 *
	 * @return     {Map}  The map.
	 */
	getMap: function() {
		return this.map;
	},

	/**
	 * Sets the map.
	 *
	 * @param      {Map}  map     The map
	 */
	setMap: function(map) {
		this.map = map;
	},

	/**
	 * Gets the camera.
	 *
	 * @return     {Camera}  The camera.
	 */
	getCamera: function() {
		return this.camera;
	},

	/**
	 * Sets the camera.
	 *
	 * @param      {Camera}  camera  The camera
	 */
	setCamera: function(camera) {
		this.camera = camera;
	},

	/**
	 * Gets the engine.
	 *
	 * @return     {Engine}  The engine.
	 */
	getEngine: function() {
		return this.engine;
	},

	/**
	 * Sets the engine.
	 *
	 * @param      {Engine}  engine  The engine
	 */
	setEngine: function(engine) {
		this.engine = engine;
	}
});