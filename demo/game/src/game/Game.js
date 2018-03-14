document.addEventListener("DOMContentLoaded", function() {
   // setup
	Lucid.Utils.setDebug(0);

	// check support
	if (!Lucid.Utils.engineSupported()) {
		Lucid.Utils.error("Sorry - your browser does NOT support Lucid Engine - please update your browser.")
		return;
	}
	
	var game = new Game();
});

/**
 * This is the Game class. It uses custom plugins and the Engine API to build
 * the game.
 *
 * @class      Game (name)
 */
function Game() {
	// say hello
	Lucid.Utils.log("Game");

	// required for event listener removing
	var namespace = ".Game";

	// set-up debugging related stuff
	Lucid.Debug.setEngineFPS(true);
	Lucid.Debug.setMapTileSizeGrid(true);
	Lucid.Debug.setEntityHitBox(false);
	Lucid.Debug.setAISightRadius(true);
	Lucid.Debug.setAILineOfSight(true);
	Lucid.Debug.setMapCollidingTiles(false);

	// init engine
	var engine = new Lucid.Engine();
	engine.start();

	// setup camera
	var camera = new Lucid.Camera();
	engine.setCamera(camera);

	// listener for resize event
	window.addEventListener("resize", engine.resize.bind(engine), false);

	// setup input manager
	Lucid.Input.init(engine.getCanvas());

	// custom layer for the ui
	var layerUI = new LayerUI({
		id: "layer-ui",
		type: Lucid.BaseLayer.TYPE.UI,
		z: 20,
		active: false
	});
	engine.addLayer(layerUI);

	// custom layer for the menu
	var layerMenu = new LayerMenu({
		id: "layer-menu",
		type: Lucid.BaseLayer.TYPE.UI,
		z: 30
	});
	engine.addLayer(layerMenu);

	// LAYER UI: menu button key down event
	Lucid.Event.bind(LayerUI.EVENT.MENU_BUTTON_KEY_DOWN + namespace, function(eventName) {
		engine.getMap().setActive(false);
		layerMenu.setActive(true);
		layerUI.setActive(false);
	});

	// MAP FILE: on loading succes hide menu
	Lucid.Event.bind(Lucid.Engine.EVENT.START_LOADING_MAP_FILE + namespace, function(eventName, fileName, filePath) {
		layerMenu.setActive(false);
	});

	// MAP FILE: on loading error show menu again
	Lucid.Event.bind(Lucid.Engine.EVENT.LOADED_MAP_FILE_ERROR + namespace, function(eventName, loaderItem) {
		layerMenu.setActive(true);
	});

	// MAP: wait for the map to load its assets
	Lucid.Event.bind(Lucid.Map.EVENT.LOADING_SUCCESS + namespace, function(eventName, map) {
		// build the map!
		map.build();

		// show LayerUI
		layerUI.setActive(true);

		// change menu for LayerMenu
		layerMenu.setCurrentMenuConfig(layerMenu.menuConfigIngame);
	});

	// LAYER MENU: custom event for the "back to game" button in the menu
	Lucid.Event.bind(LayerMenu.EVENT.CUSTOM_EVENT + namespace, function(eventName, customEventName) {
		if (customEventName == "closeMenu") {
			layerUI.setActive(true);
			layerMenu.setActive(false);
			engine.getMap().setActive(true);
		}
	});

	// for testing purpose...
	// engine.loadMap("map2");
}