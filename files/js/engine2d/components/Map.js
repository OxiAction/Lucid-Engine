/**
* Engine2D default Map.
*/
var Map = BaseComponent.extend({
	// config variables and their default values
	name: "Untiteled Map",
	layers: null,
	engine2d: null, // reference to engine2d instance

	// local variables
	// ...

	/**
	  * Automatically called when instantiated.
	  *
	  * @param      {Object}   config  The configuration.
	  * @return     {boolean}  Returns true on success.
	  */
	init: function(config) {
		this.componentName = "Map";
		
		this._super(config);

		if (!this.layers || this.layers.length < 1) {
			EngineUtils.error("Map @ init: " + this.name + " - layers are not defined!");
			return false;
		} else if (!this.engine2d) {
			EngineUtils.error("Map @ init: " + this.name + " - Engine2D reference not defined!");
			return false;
		}

		for (var i = 0; i < this.layers.length; ++i) {
			if (this.layers[i].config !== undefined && this.layers[i].config.id !== undefined) {
				this.engine2d.createAddLayer(this.layers[i].config);
			} else {
				EngineUtils.error("Map name: " + this.name + " - tried to createAdd layer in Engine2D but Layer config or Layer id is undefined!");
			}
		}

		return true;
	},

	/**
	 * Destroys the Map and all its corresponding objects.
	 *
	 * @return     {boolean}  Returns true on success.
	 */
	destroy: function() {
		for (var i = 0; i < this.layers.length; ++i) {
			if (this.layers[i].config !== undefined && this.layers[i].config.id !== undefined) {
				this.engine2d.removeLayer(this.layers[i].config.id);
			} else {
				EngineUtils.error("Map name: " + this.name + " - tried to remove Layer from Engine2D but Layer config or Layer id is undefined!");
			}
		}

		return true;
	}
});

// forms setup for the editor
Map.FORMS = {
	name: "string"
};