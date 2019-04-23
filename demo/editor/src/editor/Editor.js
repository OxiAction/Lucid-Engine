/**
 * Lucid Engine
 * Copyright (C) 2019 Michael Schreiber
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 * 
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

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
