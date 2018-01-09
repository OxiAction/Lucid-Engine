/**
 * Engine default Map.
 */
Lucid.Map = Lucid.BaseComponent.extend({
	// config variables and their default values
	type: null,
	name: "Untiteled Map", // the display name of the map
	cols: 16, // num of tile columns
	rows: 16, // num of tile rows
	tileSize: 64, // size of layer tiles
	assetFilePath: null, // image path for layers
	layers: null, // layers array

	// local variables
	asset: null, // the loaded image for layers
	loaded: false, // determines if map has loaded everything
	build: false, // determines if map is build

	/**
	 * Automatically called when instantiated.
	 *
	 * @param      {Object}   config  The configuration.
	 * @return     {Boolean}  Returns true on success.
	 */
	init: function(config) {
		this.componentName = "Map";
		
		this._super(config);

		this.checkSetEngine();

		// events for loading the asset
		Lucid.Event.bind(Lucid.Map.EVENT.LOADED_ASSET_FILE_SUCCESS + this.componentNamespace, this.assetLoadingSuccess.bind(this));
		Lucid.Event.bind(Lucid.Map.EVENT.LOADED_ASSET_FILE_ERROR + this.componentNamespace, this.assetLoadingError.bind(this));

		return true;
	},

	/**
	 * Start loading.
	 */
	load: function() {
		Lucid.Utils.log("Map @ load: starting to load in Map with name: " + this.name);
		this.loadAsset();
	},

	/**
	 * General loading success.
	 */
	loadingSuccess: function() {
		Lucid.Utils.log("Map @ loadingSuccess: loaded everything in Map with name: " + this.name);
		this.loaded = true;
		Lucid.Event.trigger(Lucid.Map.EVENT.LOADING_SUCCESS, this);
	},

	/**
	 * General loading error.
	 */
	loadingError: function() {
		Lucid.Utils.log("Map @ loadingError: ERROR occurred while loading in Map with name: " + this.name);
		this.loaded = false;
		Lucid.Event.trigger(Lucid.Map.EVENT.LOADING_ERROR, this);
	},

	/**
	 * Loads the asset.
	 */
	loadAsset: function() {
		Lucid.Utils.log("Map @ loadAsset: " + this.name + " - loading asset");

		var loaderItem = new Lucid.LoaderItem({
			id: this.assetFilePath,
			dataType: Lucid.Loader.TYPE.IMAGE,
			filePath: this.assetFilePath,
			eventSuccessName: Lucid.Map.EVENT.LOADED_ASSET_FILE_SUCCESS,
			eventErrorName: Lucid.Map.EVENT.LOADED_ASSET_FILE_ERROR
		});
		
		Lucid.Loader.add(loaderItem);
	},

	/**
	 * Asset loading success.
	 *
	 * @param      {String}      eventName   The event.
	 * @param      {LoaderItem}  loaderItem  The loader item.
	 */
	assetLoadingSuccess: function(eventName, loaderItem) {
		this.asset = loaderItem.getData();

		this.loadingSuccess();
	},

	/**
	 * Asset loading error.
	 *
	 * @param      {String}      eventName   The event.
	 * @param      {LoaderItem}  loaderItem  The loader item.
	 */
	assetLoadingError: function(eventName, loaderItem) {
		this.asset = null;

		this.loadingError();
	},

	/**
	 * Gets the asset.
	 *
	 * @return     {Object}  The asset.
	 */
	getAsset: function() {
		return this.asset;
	},

	/**
	 * Sets the asset.
	 *
	 * @param      {Object}  asset   The asset.
	 */
	setAsset: function(asset) {
		this.asset = asset;
	},

	/**
	 * Builds the map.
	 *
	 * @return     {boolean}  Returns true on success.
	 */
	build: function() {
		if (!this.build) {
			Lucid.Utils.log("Map @ build: already build!");
			return false;
		}

		if (!this.asset) {
			Lucid.Utils.log("Map @ build: asset is NOT loaded yet - call loadAsset() first");
			return false;
		}

		if (!this.layers || this.layers.length < 1) {
			Lucid.Utils.error("Map @ build: " + this.name + " - layers are not defined!");
			return false;
		}

		Lucid.Utils.log("Map @ build: createAddLayers in Engine");
		for (var i = 0; i < this.layers.length; ++i) {
			if (this.layers[i].config !== undefined && this.layers[i].config.id !== undefined) {
				this.engine.createAddLayer(this.layers[i].config);
			} else {
				Lucid.Utils.log("Map @ build: tried to createAddLayer in Engine but Layer.config or Layer.id is not set! Index in layers Array: " + i);
			}
		}

		this.build = true;

		return true;
	},

	/**
	 * Destroys the Map and all its corresponding objects.
	 *
	 * @return     {Boolean}  Returns true on success.
	 */
	destroy: function() {
		Lucid.Event.unbind(Lucid.Map.EVENT.LOADED_ASSET_FILE_SUCCESS + this.componentNamespace);
		Lucid.Event.unbind(Lucid.Map.EVENT.LOADED_ASSET_FILE_ERROR + this.componentNamespace);

		// only if build we need to remove layers
		if (this.build) {
			for (var i = 0; i < this.layers.length; ++i) {
				var layer = this.layers[i];
				if (layer != null && layer.config !== undefined && layer.config.id !== undefined) {
					// no need for layer.destroy here - because the Engine will take care of this!
					this.engine.removeLayer(layer.config.id);
				} else {
					Lucid.Utils.error("Map @ destroy: map name: " + this.name + " - tried to remove Layer from Engine but Layer config or Layer id is undefined!");
				}
			}
		}

		this.layers = null;
		this.loaded = false;
		this.build = false;

		this._super();

		return true;
	}
});

// forms setup for the editor
Lucid.Map.FORMS = {
	id: "string",
	type: "_mapType",
	name: "string",
	cols: "integer",
	rows: "integer",
	tileSize: "_mapTileSize",
	assetFilePath: "_mapAssetFilePath"
};

Lucid.Map.TYPE = {
	SIDE_SCROLL: "MapTypeSideScroll",
	TOP_DOWN: "MapTypeTopDown"
};

// event constants
Lucid.Map.EVENT = {
	LOADED_ASSET_FILE_SUCCESS: "MapLoadedAssetFileSuccess",
	LOADED_ASSET_FILE_ERROR: "MapLoadedAssetFileError",
	LOADING_SUCCESS: "MapLoadingComplete",
	LOADING_ERROR: "MapLoadingError"
};