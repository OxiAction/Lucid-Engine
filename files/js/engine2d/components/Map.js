/**
* Engine2D default Map.
*/
var Map = BaseComponent.extend({
	// config variables and their default values
	name: "Untiteled Map",
	layers: null,
	engine2d: null,
	camera: null, // reference to camera
	// file names of files required by Engine2D
	fileNames: {
		config: "engine"
	},
	// folder structure
	folderPaths: {
		maps: "files/maps/",
		tileSets: "files/tilesets/",
		config: "files/config/"
	},
	// extensions
	extensions: {
		maps: ".map",
		tileSets: ".ts",
		config: ".cfg"
	},

	// local variables
	loading: false,

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
		EngineUtils.log("Map @ init: createAddLayers in Engine2D");
		for (var i = 0; i < this.layers.length; ++i) {
			if (this.layers[i].config !== undefined && this.layers[i].config.id !== undefined) {
				// map reference
				this.layers[i].config.map = this;
				this.engine2d.createAddLayer(this.layers[i].config);
			} else {
				EngineUtils.error("Map @ init: tried to createAddLayer in Engine2D but Layer.config or Layer.id is not set!");
			}
		}

		return true;
	},

	draw: function(config) {

	},

	loadAssets: function() {
		EngineUtils.log("Map @ loadAssets: " + this.name + " - loading assets");

		this.loading = true;

		var loaderItem = new EngineLoaderItem({
	        id: "tiles",
	        dataType: EngineLoader.TYPE.IMAGE,
	        filePath: "playground/tiles.png",
	        eventSuccessName: Map.EVENT.LOADED_TILESET_FILE_SUCCESS,
	        eventErrorName: Map.EVENT.LOADED_TILESET_FILE_ERROR
	    });

	    EngineLoader.add(loaderItem);

	    $(document).on(Map.EVENT.LOADED_TILESET_FILE_SUCCESS + this.componentNamespace, function(event, loaderItem) {
	    	EngineUtils.log("Map @ loadAssets: loaded tileset:");
	        console.log(loaderItem.getData());
	    });
	},

	resize: function(config) {
		
	},

	/**
	 * Destroys the Map and all its corresponding objects.
	 *
	 * @return     {boolean}  Returns true on success.
	 */
	destroy: function() {
		$(document).off(Map.EVENT.LOADED_TILESET_FILE_SUCCESS + this.componentNamespace);

		for (var i = 0; i < this.layers.length; ++i) {
			var layer = this.layers[i];
			if (layer != null && layer.config !== undefined && layer.config.id !== undefined) {
				// no need for layer.destroy here - because the Engine2D will take care of this!
				this.engine2d.removeLayer(layer.config.id);
			} else {
				EngineUtils.error("Map name: " + this.name + " - tried to remove Layer from Engine2D but Layer config or Layer id is undefined!");
			}
		}

		this.layers = null;
		this.engine2d = null;
		this.camera = null;

		return true;
	},

	getCamera: function() {
		return this.camera;
	},

	setCamera: function(value) {
		this.camera = value;
	},

	getEngine2D: function() {
		return this.engine2d;
	},

	setEngine2D: function(value) {
		this.engine2d = value;
	}
});

// forms setup for the editor
Map.FORMS = {
	name: "string"
};

// event constants
Map.EVENT = {
	LOADED_TILESET_FILE_SUCCESS: "loadedTilesetFileSuccess",
	LOADED_TILESET_FILE_ERROR: "loadedTilesetFileError",
	LOADED_ASSETS_SUCCESS: "loadedAssetsSuccess",
	LOADED_ASSETS_ERROR: "loadedAssetsError"
};