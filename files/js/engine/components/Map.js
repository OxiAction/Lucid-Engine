/**
* Engine default Map.
*/
var Map = BaseComponent.extend({
	// config variables and their default values
	name: "Untiteled Map",
	cols: 16,
	rows: 16,
	tileSize: 64,
	layers: null,
	engine: null,
	camera: null, // reference to camera
	// file names of files
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
	tileSetLoaded: false,
	entitySetLoaded: false,

	tileSet: null,
	entitySet: null,

	build: false, // determines if map is build

	/**
	  * Automatically called when instantiated.
	  *
	  * @param      {Object}   config  The configuration.
	  * @return     {boolean}  Returns true on success.
	  */
	init: function(config) {
		this.componentName = "Map";
		
		this._super(config);
		console.log(this);
		return true;
	},

	draw: function(config) {

	},

	loadAssets: function() {
		if (this.assetsLoaded()) {
			EngineUtils.log("Map @ loadAssets: assets are already loaded");
			return;
		}

		EngineUtils.log("Map @ loadAssets: " + this.name + " - loading assets");

		this.loading = true;
		
		this.loadTileSet();
		this.loadEntitySet();
	},

	loadTileSet: function() {
		this.tileSetLoaded = false;

		var loaderItem = new EngineLoaderItem({
	        id: "tiles",
	        dataType: EngineLoader.TYPE.IMAGE,
	        filePath: "playground/tiles.png",
	        eventSuccessName: Map.EVENT.LOADED_TILESET_FILE_SUCCESS,
	        eventErrorName: Map.EVENT.LOADED_TILESET_FILE_ERROR
	    });

	    EngineLoader.add(loaderItem);

	    $(document).on(Map.EVENT.LOADED_TILESET_FILE_SUCCESS + this.componentNamespace, function(event, loaderItem) {
	    	EngineUtils.log("Map @ loadTileset: loaded tileset");
	    	$(document).off(Map.EVENT.LOADED_TILESET_FILE_SUCCESS + this.componentNamespace);
	        this.tileSetLoaded = true;
	        this.tileSet = loaderItem.getData();
	        this.checkLoadingState();
	    }.bind(this));
	},

	loadEntitySet: function() {
		// TODO...
		this.entitySetLoaded = true;
		this.checkLoadingState();
	},

	checkLoadingState: function() {
		if (this.assetsLoaded()) {
			EngineUtils.log("Map @ checkLoadingState: assets are loaded! Much appreciated...");
			this.loading = false;
			$(document).trigger(Map.EVENT.LOADED_ASSETS_SUCCESS, [this]);
		}
	},

	assetsLoaded: function() {
		if (this.tileSetLoaded && this.entitySetLoaded) {
			return true;
		}
		return false;
	},

	build: function() {
		if (!this.assetsLoaded()) {
			EngineUtils.log("Map @ build: assets are NOT loaded yet");
			return false;
		}

		if (!this.layers || this.layers.length < 1) {
			EngineUtils.error("Map @ build: " + this.name + " - layers are not defined!");
			return false;
		} else if (!this.engine) {
			EngineUtils.error("Map @ build: " + this.name + " - Engine reference not defined!");
			return false;
		}

		EngineUtils.log("Map @ build: createAddLayers in Engine");
		for (var i = 0; i < this.layers.length; ++i) {
			if (this.layers[i].config !== undefined && this.layers[i].config.id !== undefined) {
				// map reference
				this.layers[i].config.map = this;
				// TODO - tileSets, entitySet... seems a bit too static - maybe we have other types?
				// tileset reference
				this.layers[i].config.image = this.tileSet;
				this.engine.createAddLayer(this.layers[i].config);
			} else {
				EngineUtils.error("Map @ build: tried to createAddLayer in Engine but Layer.config or Layer.id is not set!");
			}
		}

		this.build = true;

		return true;
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

		// only if build we need to remove layers
		if (this.build) {
			for (var i = 0; i < this.layers.length; ++i) {
				var layer = this.layers[i];
				if (layer != null && layer.config !== undefined && layer.config.id !== undefined) {
					// no need for layer.destroy here - because the Engine will take care of this!
					this.engine.removeLayer(layer.config.id);
				} else {
					EngineUtils.error("Map name: " + this.name + " - tried to remove Layer from Engine but Layer config or Layer id is undefined!");
				}
			}
		}

		this.layers = null;
		this.engine = null;
		this.camera = null;

		this.build = false;

		return true;
	},

	getCamera: function() {
		return this.camera;
	},

	setCamera: function(value) {
		this.camera = value;
	},

	getEngine: function() {
		return this.engine;
	},

	setEngine: function(value) {
		this.engine = value;
	}
});

// forms setup for the editor
Map.FORMS = {
	name: "string"
};

// event constants
Map.EVENT = {
	LOADED_TILESET_FILE_SUCCESS: "loadedTileSetFileSuccess",
	LOADED_TILESET_FILE_ERROR: "loadedTileSetFileError",
	LOADED_ASSETS_SUCCESS: "loadedAssetsSuccess",
	LOADED_ASSETS_ERROR: "loadedAssetsError"
};