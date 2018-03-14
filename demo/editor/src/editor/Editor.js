$(document).ready(function() {
	// setup
	Lucid.Utils.setDebug(1);

	// check support
	if (!Lucid.Utils.engineSupported()) {
		Lucid.Utils.error("Sorry - your browser does NOT support Engine - please update your browser")
		return;
	}
	
	var editor = new Lucid.Editor();
});

/**
 * This is the Editor class. It uses custom plugins and the Engine API to
 * build the editor.
 *
 * @class      Editor (name)
 */
Lucid.Editor = function() {
	// say hello
	Lucid.Utils.log("Editor");

	// required for event listener removing
	var namespace = ".Editor";

	Lucid.Debug.setEngineFPS(true);
	Lucid.Debug.setMapTileSizeGrid(true);

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

	// forms
	$("#select-map").selectmenu({
		width: "auto",
		select: function(event, ui) {
			var value = ui.item.value;
			engine.loadMap(value);
		}
	});

	// MAP: wait for the map to load its assets
	Lucid.Event.bind(Lucid.Map.EVENT.LOADING_SUCCESS + namespace, function(eventName, map) {
		// build the map!
		map.build();
	});

	Lucid.Event.bind(Lucid.Editor.EVENT.LOADED_CONFIG_FILE_SUCCESS + namespace, function(eventName, loaderItem) {
		var xml = loaderItem.getData();
		var mapsRoot = xml.getElementsByTagName("maps")[0];
		var folder = mapsRoot.getAttribute("folder");

		// engine.folderPaths.maps = folder;

		var maps = mapsRoot.getElementsByTagName("map");
		for (var i = 0; i < maps.length; ++i) {   
			var file = maps[i].getAttribute("file");
			$("#select-map").append("<option value='" + file + "'>" + file + "</option>");
		}
	});


	Lucid.Loader.add(new Lucid.LoaderItem({
		id: "config",
		dataType: Lucid.Loader.TYPE.XML,
		filePath: "cfg/editor.cfg",
		eventSuccessName: Lucid.Editor.EVENT.LOADED_CONFIG_FILE_SUCCESS,
		eventErrorName: Lucid.Editor.EVENT.LOADED_CONFIG_FILE_ERROR
	}));
};


// event constants
Lucid.Editor.EVENT = {
	LOADED_CONFIG_FILE_SUCCESS: "loadedConfigFileSuccess",
	LOADED_CONFIG_FILE_ERROR: "loadedConfigFileError"
};
