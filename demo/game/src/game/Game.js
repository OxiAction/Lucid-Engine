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

"use strict";

// namespace
var Game = Game || {};

document.addEventListener("DOMContentLoaded", function() {
   // setup
	Lucid.Utils.setDebug(1);

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
	// Lucid.Debug.setPathfinding(true);
	// Lucid.Debug.setMapTileSizeGrid(true);
	// Lucid.Debug.setEntityHitBox(true);
	// Lucid.Debug.setAISightRadius(true);
	// Lucid.Debug.setAILineOfSight(true);
	// Lucid.Debug.setMapCollidingTiles(true);

	Lucid.Pathfinding.setUseDiagonals(true);

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

	// custom layer for the entities  information
	var layerEntitiesInformation = new Game.LayerEntitiesInformation({
		id: "layer-entities-information",
		type: Lucid.BaseLayer.TYPE.UI,
		z: 20,
		active: true
	});
	engine.addLayer(layerEntitiesInformation);

	// custom layer for the ui
	var layerUI = new Game.LayerUI({
		id: "layer-ui",
		type: Lucid.BaseLayer.TYPE.UI,
		z: 25,
		active: false
	});
	engine.addLayer(layerUI);

	// custom layer for the menu
	var layerMenu = new Game.LayerMenu({
		id: "layer-menu",
		type: Lucid.BaseLayer.TYPE.UI,
		z: 100 // debug layer z-index is 99
	});
	engine.addLayer(layerMenu);

	// LAYER UI: menu button key down event
	Lucid.Event.bind(Game.LayerUI.EVENT.MENU_BUTTON_KEY_DOWN + namespace, function(eventName) {
		camera.setActive(false);
		engine.getMap().setActive(false);
		layerMenu.setActive(true);
		layerUI.setActive(false);
	});

	// stores grid debug settings
	var tmpMapTileSizeGridSetting = null;

	// MAP FILE: on loading succes hide menu
	Lucid.Event.bind(Lucid.Engine.EVENT.START_LOADING_MAP_FILE + namespace, function(eventName, fileName, filePath) {
		// show pathfinding results for map3 only
		if (fileName == "map3") {
			// reset
			Lucid.Pathfinding.setDebugResultNodes(null);
			Lucid.Pathfinding.setDebugInspectedNodes(null);

			Lucid.Debug.setPathfinding(true);
			// store grid debug setting
			tmpMapTileSizeGridSetting = Lucid.Debug.getMapTileSizeGrid();
			Lucid.Debug.setMapTileSizeGrid(true);
		} else {
			// restore previous grid debug setting
			if (tmpMapTileSizeGridSetting !== null) {
				Lucid.Debug.setMapTileSizeGrid(tmpMapTileSizeGridSetting);
			}

			Lucid.Debug.setPathfinding(false);
		}

		layerMenu.setActive(false);
	});

	// MAP FILE: on loading error show menu again
	Lucid.Event.bind(Lucid.Engine.EVENT.LOADED_MAP_FILE_ERROR + namespace, function(eventName, loaderItem) {
		layerMenu.setActive(true);
	});

	// MAP: wait for the map to load its assets
	Lucid.Event.bind(Lucid.Map.EVENT.LOADING_SUCCESS + namespace, function(eventName, map) {
		map.build();
		layerUI.setActive(true);
		camera.setActive(true);
		layerMenu.setCurrentMenuConfig(layerMenu.menuConfigIngame);
	});

	// LAYER MENU: custom event for the "back to game" button in the menu
	Lucid.Event.bind(Game.LayerMenu.EVENT.CUSTOM_EVENT + namespace, function(eventName, customEventName) {
		if (customEventName == "closeMenu") {
			layerUI.setActive(true);
			layerMenu.setActive(false);
			// set the "ingame" menu
			layerMenu.setCurrentMenuConfig(layerMenu.menuConfigIngame);
			engine.getMap().setActive(true);
			camera.setActive(true);
		}
	});

	// load a map
	engine.loadMap("map1");
}