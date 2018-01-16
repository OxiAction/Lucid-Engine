"use strict";

// namespace
var Lucid = Lucid || {};

Lucid.data = {
	maps: {}, // namespace for maps
	engine: null // engine reference
}

/**
 * Engine core.
 *
 * @type       {Engine}
 */
Lucid.Engine = Lucid.BaseComponent.extend({
	// config variables and their default values
	// file names of files required by Engine
	fileNames: {
		config: "engine"
	},
	// folder structure
	folderPaths: {
		maps: "maps/",
		tileSets: "tilesets/",
		config: "config/"
	},
	// extensions
	extensions: {
		maps: ".map",
		tileSets: ".ts",
		config: ".cfg"
	},
	containerID: "engine-container", // wrapper / container ID
	canvasID: "engine-canvas", // cavas ID

	// local variables
	
	container: null, // the wrapper / container
	canvas: null, // EVERYTHING will be rendered into this canvas
	canvasContext: null,

	layerCollision: null, // LayerCollision instance. UNIQUE
	layerEntities: null, // LayerEntities instance. UNIQUE
	layers: [], // collection of all layers

	currentMapFileName: null, // holds the fileName of the currently loading OR loaded Map

	
	// rendering frame related stuff

	renderFrameID: null, // the request animation frame ID

	started: false, // determines if the engine is running its rendering

	simulationTimestep: 1000 / 60, // the amount of time (in milliseconds) to simulate each time
								   // update() runs

	frameDelta: 0, // the cumulative amount of in-app time that hasn't been simulated yet

	lastFrameTimeMs: 0, // the last time the loop was run

	fps: 10, // an exponential moving average of the frames per second

	fpsAlpha: 0.9, // a factor that affects how heavily to weight more recent seconds
				   // performance when calculating the average frames per second

	fpsUpdateInterval: 1000, // the minimum duration between updates to the frames-per-second
							 // estimate - higher values means more accuray

	lastFpsUpdate: 0, // the timestamp (in milliseconds) of the last time the "fps" moving
					  // average was updated.

	framesSinceLastFpsUpdate: 0, // The number of frames delivered since the last time the "fps"
								 // moving average was updated (i.e. since "lastFpsUpdate").

	numUpdateSteps: 0, // the number of times update() is called in a given frame

	minFrameDelay: 0, // the minimum amount of time in milliseconds that must pass since
					  // the last frame was executed before another frame can be executed

	panic: false, // whether the simulation has fallen too far behind real time

/**
 * Core
 */

	/**
	 * Automatically called when instantiated.
	 *
	 * @param      {Object}   config  The configuration.
	 * @return     {Boolean}  Returns true on success.
	 */
	init: function(config) {
		if (Lucid.data.engine != null) {
			Lucid.Utils.error("Engine @ init: you can not instantiate the Engine more then once!");
			return false;
		} else {
			Lucid.data.engine = this;
		}

		this.componentName = "Engine";
		
		this._super(config);

		// get wrapper / container from HTML
		this.container = document.getElementById(this.containerID);
		if (!this.container) {
			Lucid.Utils.error("Engine @ init: could not find container with id: " + this.containerID);
			return;
		}

		// get canvas from HTML
		this.canvas = document.getElementById(this.canvasID);
		if (!this.canvas) {
			Lucid.Utils.error("Engine @ init: there is no DOM canvas with id: " + this.canvasID);
			return false;
		}

		// assign context
		this.canvasContext = this.canvas.getContext("2d");
		
		return true;
	},

	/**
	 * Main render method for request animation frame loop.
	 *
	 * @param      {Number}  timestamp  The timestamp.
	 */
	renderFrame: function(timestamp) {
		// run this.renderFrame() again the next time the browser is ready to render
		this.renderFrameID = window.requestAnimationFrame(this.renderFrame.bind(this));

		// throttle the frame rate (if minFrameDelay is set to a non-zero value)
		if (timestamp < this.lastFrameTimeMs + this.minFrameDelay) {
			return;
		}

		// frameDelta is the cumulative amount of in-app time that hasn't been simulated yet.
		this.frameDelta += timestamp - this.lastFrameTimeMs;
		this.lastFrameTimeMs = timestamp;

		this.renderBegin(timestamp, this.frameDelta);

		// calculate frames per second
		 if (timestamp > this.lastFpsUpdate + this.fpsUpdateInterval) {
			// Compute the new exponential moving average.
			this.fps =
				// Divide the number of frames since the last FPS update by the
				// amount of time that has passed to get the mean frames per second
				// over that period. This is necessary because slightly more than a
				// second has likely passed since the last update.
				this.fpsAlpha * this.framesSinceLastFpsUpdate * 1000 / (timestamp - this.lastFpsUpdate) +
				(1 - this.fpsAlpha) * this.fps;

			// Reset the frame counter and last-updated timestamp since their
			// latest values have now been incorporated into the FPS estimate.
			this.lastFpsUpdate = timestamp;
			this.framesSinceLastFpsUpdate = 0;
		}
		this.framesSinceLastFpsUpdate++;

		this.numUpdateSteps = 0;
		while (this.frameDelta >= this.simulationTimestep) {
			// update stuff - e.g. positions x/y etc...
			this.renderUpdate(this.simulationTimestep / 100);
			this.frameDelta -= this.simulationTimestep;

			// sanity check: bail if we run the loop too many times. Triggers
			// after 4 seconds because most browsers will alert after 5 seconds
			if (++this.numUpdateSteps >= 240) {
				this.panic = true;
				break;
			}
		}

		// draw!
		this.renderDraw(this.frameDelta / this.simulationTimestep);

		this.renderEnd(this.fps, this.panic);
	},

	/**
	 * Drawing debug related stuff.
	 *
	 * @param      {Number}  timestamp   The current timestamp (when the frame
	 *                                   started), in milliseconds.
	 * @param      {Number}  frameDelta  The total elapsed time that has not yet
	 *                                   been simulated, in milliseconds.
	 */
	renderBegin: function(timestamp, frameDelta) {
		if (Lucid.Debug.getEnabled()) {
			var layerDebug = Lucid.Debug.getLayerDebug();
			var layerDebugCanvasContext = layerDebug.getCanvasContext();

			layerDebugCanvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height);

			layerDebugCanvasContext.font = "normal 12px Arial, Helvetica Neue, Helvetica, sans-serif";

			// draw a grid (depending on the map.tileSize)
			if (Lucid.Debug.getMapTileSizeGrid() && this.map && this.camera) {
				layerDebugCanvasContext.beginPath();
				layerDebugCanvasContext.strokeStyle = "black";

				var tileSize = this.map.tileSize;

				var i;
				var numColsScreen = Math.floor(this.camera.width / tileSize) + 2;
				for (i = 0; i < numColsScreen; ++i) {
					var posX = i * tileSize - this.camera.x % tileSize + 0.5; // + 0.5 fixes lines pixel snapping
					layerDebugCanvasContext.moveTo(posX, 0);
					layerDebugCanvasContext.lineTo(posX, this.camera.height);
				}
				var numRowsScreen = Math.floor(this.camera.height / tileSize) + 2;
				for (i = 0; i < numRowsScreen; ++i) {
					var posY = i * tileSize - this.camera.y % tileSize + 0.5;
					layerDebugCanvasContext.moveTo(0, posY);
					layerDebugCanvasContext.lineTo(this.camera.width, posY);
				}

				layerDebugCanvasContext.stroke();
			}

			var debugTextsYOffset = 20;

			// draw frames per second as text
			if (Lucid.Debug.getEngineFPS()) {
				layerDebugCanvasContext.fillStyle = "red";
				layerDebugCanvasContext.fillText("FPS: " + Math.round(this.fps), 10, debugTextsYOffset);
				debugTextsYOffset += 15;
			}

			// draw panic status
			if (Lucid.Debug.getEnginePanic()) {
				layerDebugCanvasContext.fillStyle = "red";
				layerDebugCanvasContext.fillText("Panic: " + this.panic, 10, debugTextsYOffset);
				debugTextsYOffset += 15;
			}
		}
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
		var i;

		/**
		 * Camera
		 */

		if (this.camera) {
			this.camera.renderUpdate(delta);
		}

		/**
		 * Collision Data
		 */
		var collisionData = [];
		if (this.layerCollision) {
			collisionData = this.layerCollision.getData();
		}

		/**
		 * Layer(s)
		 */
		
		for (i = 0; i < this.layers.length; ++i) {
			var layer = this.layers[i];
			layer.setCollisionData(collisionData);
			layer.renderUpdate(delta);
		}
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
		var engineCanvasContext = this.canvasContext;
		var engineCanvas = this.canvas;

		var i;

		/**
		 * CanvasContext
		 */

		engineCanvasContext.clearRect(0, 0, engineCanvas.width, engineCanvas.height);

		/**
		 * Layers
		 */
		
		for (i = 0; i < this.layers.length; ++i) {
			var layer = this.layers[i];
			layer.renderDraw(interpolationPercentage);
			var layerCanvas = layer.getCanvas();
			if (layerCanvas) {
				engineCanvasContext.drawImage(
					layerCanvas,	// specifies the image, canvas, or video element to use
					0,				// the x coordinate where to start clipping
					0				// the y coordinate where to start clipping
				);
			}
		}
	},

	/**
	 * renderEnd() always runs exactly once per frame. This makes it useful
	 * for any updates that are not dependent on time in the simulation.
	 *
	 * @param      {Number}   fps     The exponential moving average of the
	 *                                frames per second.
	 * @param      {Boolean}  panic   Indicates whether the simulation has
	 *                                fallen too far behind real time.
	 */
	renderEnd: function(fps, panic) {
		/*
		// cache variable
		var canvasContext = this.canvasContext;

		this.canvasContext.fillStyle = "red";
		this.canvasContext.font = "normal 12px Arial, Helvetica Neue, Helvetica, sans-serif";

		// draw a grid (depending on the map.tileSize)
		if (Lucid.Debug.getMapTileSizeGrid() && this.map && this.camera) {
			canvasContext.strokeStyle = "black";

			var tileSize = this.map.tileSize;

			canvasContext.beginPath();

			var i;
			var numColsScreen = Math.floor(this.camera.width / tileSize) + 2;
			for (i = 0; i < numColsScreen; ++i) {
				var posX = i * tileSize - this.camera.x % tileSize + 0.5; // + 0.5 fixes lines pixel snapping
				canvasContext.moveTo(posX, 0);
				canvasContext.lineTo(posX, this.camera.height);
			}
			var numRowsScreen = Math.floor(this.camera.height / tileSize) + 2;
			for (i = 0; i < numRowsScreen; ++i) {
				var posY = i * tileSize - this.camera.y % tileSize + 0.5;
				canvasContext.moveTo(0, posY);
				canvasContext.lineTo(this.camera.width, posY);
			}

			canvasContext.stroke();
		}

		var debugTextsYOffset = 20;

		// draw frames per second as text
		if (Lucid.Debug.getEngineFPS()) {
			canvasContext.fillText("FPS: " + Math.round(fps), 10, debugTextsYOffset);
			debugTextsYOffset += 15;
		}

		if (Lucid.Debug.getEnginePanic()) {
			canvasContext.fillText("Panic: " + panic, 10, debugTextsYOffset);
			debugTextsYOffset += 15;
		}
		*/

		if (panic) {
			// TODO: handle panic!
			// For now: discard frameDelta
			this.panic = false;
			this.resetFrameDelta();
		}
	},

	/**
	 * Start rendering.
	 */
	start: function() {
		if (this.started) {
			return;
		}

		this.started = true;

		// this.setMaxAllowedFPS(50);

		this.renderFrameID = window.requestAnimationFrame(function(timestamp) {
			Lucid.Utils.log("Engine @ start: renderFrameID: " + this.renderFrameID);
			// Render the initial state before any updates occur.
			this.renderFrame(1);

			// Reset variables that are used for tracking time so that we
			// don't simulate time passed while the application was paused.
			this.lastFrameTimeMs = timestamp;
			this.lastFpsUpdate = timestamp;
			this.framesSinceLastFpsUpdate = 0;

			// Start the main loop.
			this.renderFrameID = window.requestAnimationFrame(this.renderFrame.bind(this));
		}.bind(this));
	},

	/**
	 * Stop rendering.
	 */
	stop: function() {
		this.started = false;
		Lucid.Utils.log("Engine @ stop: renderFrameID: " + this.renderFrameID);
		if (this.renderFrameID != null) {
			window.cancelAnimationFrame(this.renderFrameID);
			this.renderFrameID = null;
		}
	},

	/**
	 * Sets the camera.
	 *
	 * @param      {Camera}  camera  The camera
	 */
	setCamera: function(camera) {
		this._super(camera);

		// call resize event to update the new Camera
		this.resize();
	},

	/**
	 * Main resize event. Iterates through all all relevant Objects and updates them.
	 *
	 * @param      {Object}  config  The configuration.
	 */
	resize: function(config) {
		// if nothing is set...
		if (config === undefined) {
			config = {};
		}
		// we use the canvas containers width / height
		if (config.wWidth === undefined) {
			config.wWidth = this.container.clientWidth;
		}
		if (config.wHeight === undefined) {
			config.wHeight = this.container.clientHeight;
		}

		// update engine canvas
		this.canvas.width = config.wWidth;
		this.canvas.height = config.wHeight;

		// update camera
		if (this.camera) {
			this.camera.resize(config);
		}

		// update layers
		for (var i = 0; i < this.layers.length; ++i) {
			var layer = this.layers[i];
			layer.resize(config);
		}
	},

	/**
	 * Destroy & remove all events, intervals, timeouts
	 *
	 * @return     {Boolean}  Returns true on success.
	 */
	destroy: function() {
		this.stop();

		if (this.map) {
			this.destroyMap();
		}

		Lucid.data.engine = null;

		return true;
	},

	/**
	 * Sets the maximum allowed fps.
	 *
	 * @param      {number}  fps     The fps limit.
	 */
	setMaxAllowedFPS: function(fps) {
		if (typeof fps === 'undefined') {
			fps = Infinity;
		}
		if (fps === 0) {
			this.stop();
		}
		else {
			// dividing by infinity returns zero
			this.minFrameDelay = 1000 / fps;
		}
	},
	
	/**
	 * The cumulative amount of elapsed time in milliseconds that has not yet
	 * been simulated, but is being discarded as a result of calling this
	 * function.
	 *
	 * @return     {Number}  The current frameDelta.
	 */
	resetFrameDelta: function() {
		var oldFrameDelta = this.frameDelta;
		this.frameDelta = 0;
		return oldFrameDelta;
	},

/**
 * Map
 */

 	loadMap: function(fileName) {
 		// remove current map
		this.destroyMap();

 		this.currentMapFileName = fileName;

 		Lucid.Utils.log("Engine @ loadMap: load map with fileName: " + fileName);

 		var filePath = this.folderPaths.maps + fileName + this.extensions.maps;

 		// notify everyone that we have started loading the map file
 		Lucid.Event.trigger(Lucid.Engine.EVENT.START_LOADING_MAP_FILE, fileName, filePath);
 		
 		// error event handling
		Lucid.Event.bind(Lucid.Engine.EVENT.LOADED_MAP_FILE_ERROR + this.componentNamespace, function(eventName, loaderItem) {
			this.cleanupMapLoading();
			this.currentMapFileName = null;
		}.bind(this));

		// success event handling
		Lucid.Event.bind(Lucid.Engine.EVENT.LOADED_MAP_FILE_SUCCESS + this.componentNamespace, function(eventName, loaderItem) {
			this.cleanupMapLoading();

			var mapFileName = loaderItem.getID();

			// lets check if the currently loaded Map file is still the one required!
			if (this.currentMapFileName && mapFileName != this.currentMapFileName) {

				// restart loading process
				this.loadMap(this.currentMapFileName);

				return;
			}

			// set the Map and start loading its assets
			this.setMapByFileName(mapFileName);

		}.bind(this));

		// load map file
		var loaderItem = new Lucid.LoaderItem({
			id: fileName,
			dataType: Lucid.Loader.TYPE.SCRIPT,
			filePath: filePath,
			eventSuccessName: Lucid.Engine.EVENT.LOADED_MAP_FILE_SUCCESS,
			eventErrorName: Lucid.Engine.EVENT.LOADED_MAP_FILE_ERROR
		});

		Lucid.Loader.add(loaderItem);
 	},

 	/**
 	 * Removes Map loading related stuff.
 	 */
 	cleanupMapLoading: function() {
 		Lucid.Event.unbind(Lucid.Engine.EVENT.LOADED_MAP_FILE_ERROR + this.componentNamespace);
 		Lucid.Event.unbind(Lucid.Engine.EVENT.LOADED_MAP_FILE_SUCCESS + this.componentNamespace);
 	},

	/**
	 * Sets a Map by fileName. The fileName will be used to fetch the Map data
	 * from the DOM. After that, a new Map object will be instantiated with the
	 * given data. This will also trigger the loading process of the Map assets.
	 *
	 * @param      {String}  fileName  The Map file name.
	 * @return     {Map}     The build Map.
	 */
	setMapByFileName: function(fileName) {
		var loaderItem = Lucid.Loader.get(fileName);

		if (!loaderItem) {
			Lucid.Utils.error("Engine @ setBuildMapByFileName: cannot build Map - not loaded yet: " + fileName);
			return null;
		}

		Lucid.Utils.log("Engine @ setMapByFileName: building Map: " + fileName);

		// fetch data from DOM
		var mapData = window.Lucid.data.maps[fileName];

		var mapConfig = mapData.config;
		if (mapConfig === undefined) {
			Lucid.Utils.error("Engine @ setMapByFileName: Map data doesnt have a config: " + fileName);
			return null;
		}

		// inject stuff
		mapConfig.engine = this;
		mapConfig.camera = this.getCamera();

		this.setMap(new Lucid.Map(mapConfig));
	},

	/**
	 * Sets a Map. This will also trigger the loading process of the Map assets.
	 *
	 * @param      {Map}  map     The map.
	 * @override
	 */
	setMap: function(map) {
		this.map = map;

		Lucid.Event.trigger(Lucid.Engine.EVENT.SET_MAP, map);

		// start loading assets
		this.map.load();
	},

	/**
	 * Destroy the current Map. If the Map was build this process will
	 * also remove the corresponding Layers from the Engine.
	 *
	 * @return     {Boolean}  Returns true on success.
	 */
	destroyMap: function() {
		if (this.map == null) {
			Lucid.Utils.log("Engine @ destroyMap: Engine.map is null - nothing to destroy");
			return false;
		}

		Lucid.Event.trigger(Lucid.Engine.EVENT.DESTROY_MAP, this.map);

		this.map.destroy();
		this.map = null;

		return true;
	},

/**
 * Layer
 */

	/**
	 * Creates and adds a Layer based on the config.
	 *
	 * @param      {Object}  config  The Layer configuration.
	 * @return     {Layer}   Returns the created Layer or null.
	 */
	createAddLayer: function(config) {
		if (config === undefined) {
			Lucid.Utils.error("Engine @ createAddLayer: config is undefined!");
			return null;
		} else if (config.id == null, config.type == null) {
			Lucid.Utils.error("Engine @ createAddLayer: id or type is null - please asign an id and Layer.TYPE.XXX!");
			return null;
		}

		// inject stuff
		config.camera = this.getCamera();

		var layer = this.createLayer(config);
		if (this.addLayer(layer)) {
			return layer;
		} else {
			layer.destroy();
			layer = null;
			return null;
		}
	},

	/**
	 * Creates a layer based on the config.
	 *
	 * @param      {Object}  config  The Layer configuration.
	 * @return     {Layer}   Returns a new Layer instance.
	 */
	createLayer: function(config) {
		Lucid.Utils.log("Engine @ createLayer: creating / instantiating a new Layer - config: " + config);

		switch (config.type) {
			case Lucid.BaseLayer.TYPE.UI:
				return new Lucid.LayerUI(config);
			break;

			case Lucid.BaseLayer.TYPE.TILESET:
				return new Lucid.LayerTileSet(config);
			break;

			case Lucid.BaseLayer.TYPE.COLLISION:
				return new Lucid.LayerCollision(config);
			break;

			case Lucid.BaseLayer.TYPE.ITEMS:
				return new Lucid.LayerItems(config);
			break;

			case Lucid.BaseLayer.TYPE.ENTITIES:
				return new Lucid.LayerEntities(config);
			break;

			case Lucid.BaseLayer.TYPE.EVENTS:
				return new Lucid.LayerEvents(config);
			break;

			default:
				return new BaseLayer(config);
		}
	},

	/**
	 * Adds a Layer.
	 *
	 * @param      {Layer}    layer   The Layer.
	 * @return     {Boolean}  Returns true on success.
	 */
	addLayer: function(layer) {
		Lucid.Utils.log("Engine @ addLayer: add layer id: " + layer.id + " type: " + layer.type);
		
		// check for LayerCollision
		if (layer.type == Lucid.BaseLayer.TYPE.COLLISION) {
			if (this.layerCollision != null) {
				EngineUtils.error("Engine @ addLayer: you can only have one Layer with type Lucid.BaseLayer.TYPE.COLLISION!");
				return false;
			}
			this.layerCollision = layer;

			Lucid.Pathfinding.setGrid(layer.getData());
		}
		// check for LayerEntities
		else if (layer.type == Lucid.BaseLayer.TYPE.ENTITIES) {
			if (this.layerEntities != null) {
				EngineUtils.error("Engine @ addLayer: you can only have one Layer with type Lucid.BaseLayer.TYPE.ENTITIES!");
				return false;
			}
			this.layerEntities = layer;
		}
		
		// add to general layers array
		this.layers.push(layer);

		// update z-sorting
		this.layers.sortByKey("z");

		// call resize event to update the new Layer(s)
		this.resize();

		return true;
	},

	/**
	 * Gets the layer.
	 *
	 * @param      {String}  id      The identifier
	 * @return     {Layer}  The layer.
	 */
	getLayer: function(id) {
		for (var i = 0; i < this.layers.length; ++i) {
			var layer = this.layers[i];
			if (layer.id == id) {
				return layer;
			}
		}
	},

	/**
	 * Gets the collision layer.
	 *
	 * @return     {LayerCollision}  The layer collision.
	 */
	getLayerCollision: function() {
		return this.layerCollision;
	},

	/**
	 * Gets the entities layer.
	 *
	 * @return     {LayerEntities}  The layer entities.
	 */
	getLayerEntities: function() {
		return this.layerEntities;
	},

	/**
	 * Removes a Layer.
	 *
	 * @param      {String}   layerID  The Layer id.
	 * @return     {Boolean}  Returns true if Layer was removed successfully.
	 */
	removeLayer: function(layerID) {
		var layer;
		for (var i = 0; i < this.layers.length; ++i) {
			layer = this.layers[i];
			if (layer.id == layerID) {
				// check for LayerCollision
				if (layer.type == Lucid.BaseLayer.TYPE.COLLISION) {
					this.layerCollision = null;
				}
				// check for LayerEntities
				else if (layer.type == Lucid.BaseLayer.TYPE.ENTITIES) {
					this.layerEntities = null;
				}

				this.layers.erase(layer);
				layer.destroy();
				layer = null;

				return true;
			}
		}

		return false;
	},

	/**
	 * Gets the canvas.
	 *
	 * @return     {Canvas}  The canvas.
	 */
	getCanvas: function() {
		return this.canvas;
	},

	/**
	 * Gets the canvas context.
	 *
	 * @return     {Object}  The canvas.
	 */
	getCanvasContext: function() {
		return this.canvasContext;
	}
});

// event constants
Lucid.Engine.EVENT = {
	TOGGLE_LAYER: "toggleLayer",
	PAUSE: "pause",
	PLAY: "play",
	SET_MAP: "setMap", // eventName, Map
	DESTROY_MAP: "setMap", // eventName, Map
	START_LOADING_MAP_FILE: "startLoadingMapFile", // eventName, fileName, filePath
	LOADED_MAP_FILE_SUCCESS: "loadedMapFileSuccess", // eventName, LoaderItem
	LOADED_MAP_FILE_ERROR: "loadedMapFileError" // eventName, LoaderItem
};