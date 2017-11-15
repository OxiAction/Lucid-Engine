/**
* Engine default Map.
*/
Lucid.Map = BaseComponent.extend({
	// config variables and their default values
	name: "Untiteled Map",
	cols: 16,
	rows: 16,
	tileSize: 64,
	layers: null,
	engine: null,
	camera: null, // reference to camera

	// local variables
	loading: false,
	_tileSetLoaded: false,
	_entitySetLoaded: false,

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

		return true;
	},

	draw: function(delta, camera, config) {

	},

	loadAssets: function() {
		if (this.assetsLoaded()) {
			Lucid.Utils.log("Map @ loadAssets: assets are already loaded");
			return;
		}

		Lucid.Utils.log("Map @ loadAssets: " + this.name + " - loading assets");

		this.loading = true;
		
		this.loadTileSet();
		this.loadEntitySet();
	},

	loadTileSet: function() {
		this._tileSetLoaded = false;

		var loaderItem = new Lucid.LoaderItem({
	        id: "tiles",
	        dataType: Lucid.Loader.TYPE.IMAGE,
	        filePath: "playground/map_tiles.png",
	        eventSuccessName: Lucid.Map.EVENT.LOADED_TILESET_FILE_SUCCESS,
	        eventErrorName: Lucid.Map.EVENT.LOADED_TILESET_FILE_ERROR
	    });

	    Lucid.Loader.add(loaderItem);

	    $(document).on(Lucid.Map.EVENT.LOADED_TILESET_FILE_SUCCESS + this.componentNamespace, this.tileSetLoaded.bind(this));
	},

	tileSetLoaded: function(event, loaderItem) {
		Lucid.Utils.log("Map @ loadTileset: loaded tileset");
    	$(document).off(Lucid.Map.EVENT.LOADED_TILESET_FILE_SUCCESS + this.componentNamespace);
        this._tileSetLoaded = true;
        this.tileSet = loaderItem.getData();
        this.checkLoadingState();
	},

	loadEntitySet: function() {
		// TODO...
		this._entitySetLoaded = true;
		this.checkLoadingState();
	},

	checkLoadingState: function() {
		if (this.assetsLoaded()) {
			Lucid.Utils.log("Map @ checkLoadingState: assets are loaded! Much appreciated...");
			this.loading = false;
			$(document).trigger(Lucid.Map.EVENT.LOADED_ASSETS_SUCCESS, [this]);
		}
	},

	assetsLoaded: function() {
		if (this._tileSetLoaded && this._entitySetLoaded) {
			return true;
		}
		return false;
	},

	build: function() {
		if (!this.assetsLoaded()) {
			Lucid.Utils.log("Map @ build: assets are NOT loaded yet");
			return false;
		}

		if (!this.layers || this.layers.length < 1) {
			Lucid.Utils.error("Map @ build: " + this.name + " - layers are not defined!");
			return false;
		} else if (!this.engine) {
			Lucid.Utils.error("Map @ build: " + this.name + " - Engine reference not defined!");
			return false;
		}

		Lucid.Utils.log("Map @ build: createAddLayers in Engine");
		for (var i = 0; i < this.layers.length; ++i) {
			if (this.layers[i].config !== undefined && this.layers[i].config.id !== undefined) {
				// map reference
				this.layers[i].config.map = this;
				// TODO - tileSets, entitySet... seems a bit too static - maybe we have other types?
				// tileset reference
				// this.layers[i].config.image = this.tileSet;
				this.engine.createAddLayer(this.layers[i].config);
			} else {
				Lucid.Utils.error("Map @ build: tried to createAddLayer in Engine but Layer.config or Layer.id is not set!");
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
		$(document).off(Lucid.Map.EVENT.LOADED_TILESET_FILE_SUCCESS + this.componentNamespace);

		// only if build we need to remove layers
		if (this.build) {
			for (var i = 0; i < this.layers.length; ++i) {
				var layer = this.layers[i];
				if (layer != null && layer.config !== undefined && layer.config.id !== undefined) {
					// no need for layer.destroy here - because the Engine will take care of this!
					this.engine.removeLayer(layer.config.id);
				} else {
					Lucid.Utils.error("Map name: " + this.name + " - tried to remove Layer from Engine but Layer config or Layer id is undefined!");
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
	},

	getTileSet: function() {
		return this.tileSet;
	},

	setTileSet: function(value) {
		this.tileSet = value;
	}
});

// forms setup for the editor
Lucid.Map.FORMS = {
	name: "string"
};

// event constants
Lucid.Map.EVENT = {
	LOADED_TILESET_FILE_SUCCESS: "MapLoadedTileSetFileSuccess",
	LOADED_TILESET_FILE_ERROR: "MapLoadedTileSetFileError",
	LOADED_ASSETS_SUCCESS: "MapLoadedAssetsSuccess",
	LOADED_ASSETS_ERROR: "MapLoadedAssetsError"
};