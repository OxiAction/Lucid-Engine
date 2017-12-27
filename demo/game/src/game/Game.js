

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

	// engine
	var engine;

	// custom update function
	this.update = function() {
		// call original
		engine.update();

		// custom code goes here...
	}

	// init engine
	engine = new Lucid.Engine({
		debugFPS: true,
		debugPanic: true,
		debugGrid: true
	});

	// Lucid.Input.init(engine.getCanvas());
	
	// start engine
	engine.start();

	// listener for resize event
	window.addEventListener("resize", engine.resize.bind(engine), false);

	// update all the components initially! mandatory
	engine.resize();
	
	// setup Camera
	var camera = new Lucid.Camera();
	engine.setCamera(camera);

	// load the map file into DOM
	engine.loadMapFile("map1");

	// initialize and config EasyStar.js
	var easystar = new EasyStar.js();
	easystar.enableDiagonals();			// this should be fine and makes animation a bit smoother
	easystar.disableCornerCutting(); 	// we dont want to bug through objects!
	easystar.setAcceptableTiles([0]); 	// use zero values in the array as valid (walkable) tiles

	// event is triggered if Engine has loaded the map file
	Lucid.Event.bind(Lucid.Engine.EVENT.LOADED_MAP_FILE_SUCCESS + namespace, function(eventName, loaderItem) {
		var mapFileName = loaderItem.getID();
		var map = engine.buildMapByFileName(mapFileName);
		
		// set the map - this will also start loading the map assets
		engine.setMap(map);

		// event is triggered if Map has loaded everything
		Lucid.Event.bind(Lucid.Map.EVENT.LOADING_SUCCESS + namespace, function(eventName, map) {
			// build the map
			map.build();

			// TODO: if we dont call this NOW its all messed up... needs to be fixed!
			engine.resize();

		// START of pathfinding testing stuff ...
			
			// get the layer which is responsible for entities
			//
			// we could just get it by id: var layerEntities =
			// engine.getLayer("layer-entities");
			//
			// but as there can only be ONE layer which is responsible for
			// entities, we can simply use:
			var layerEntities = engine.getLayerEntities();

			// get entity with id "passant1" from entities layer
			var entityPassant = layerEntities.getEntity("passant1");
			var entityFighter = layerEntities.getEntity("fighter1");

			// check if entityPassant is present
			if (layerEntities && entityPassant) {
				// tell the camera to follow entity passant
				camera.setFollowTarget(entityPassant);

				// some key listeners...
				window.addEventListener("keydown", function(e) {
					if (e.keyCode == 37) {
						entityPassant.move(Lucid.BaseEntity.DIR.LEFT, true);
					} else if (e.keyCode == 39) {
						entityPassant.move(Lucid.BaseEntity.DIR.RIGHT, true);
					} else if (e.keyCode == 40) {
						entityPassant.move(Lucid.BaseEntity.DIR.DOWN, true);
					} else if (e.keyCode == 38) {
						entityPassant.move(Lucid.BaseEntity.DIR.UP, true);
					}
				});
				window.addEventListener("keyup", function(e) {
					if (e.keyCode == 37) {
						entityPassant.move(Lucid.BaseEntity.DIR.LEFT, false);
					} else if (e.keyCode == 39) {
						entityPassant.move(Lucid.BaseEntity.DIR.RIGHT, false);
					} else if (e.keyCode == 40) {
						entityPassant.move(Lucid.BaseEntity.DIR.DOWN, false);
					} else if (e.keyCode == 38) {
						entityPassant.move(Lucid.BaseEntity.DIR.UP, false);
					}
				});
			}

			// add click event
			window.addEventListener("click", function(e) {
				// get layer collision from engine
				var layerCollision = engine.getLayerCollision();

				// get grid data from layer collision
				var collisionData = layerCollision.getData();

				// set easystars grid to our layer collision data
				easystar.setGrid(collisionData);

				if (layerEntities && entityPassant) {
					// entity passant are our start x / y indices
					var entityPassantGridIndices = Lucid.Math.getEntityToGridIndices(entityPassant, layerCollision.getMap().tileSize);
					// clicked are our end x / y indices
					var clickedGridIndices = Lucid.Math.getMouseToGridIndices(e.clientX, e.clientY, layerCollision.getMap(), layerCollision.getCamera());
					
					// check if both "vectors" are valid
					if (entityPassantGridIndices && clickedGridIndices) {
						Lucid.Utils.log("Game: clicked on tile @ " + clickedGridIndices[0] + "/" + clickedGridIndices[1]);

						// set new path indices
						// params: startX, startY, endX, endY, callback
						easystar.findPath(entityPassantGridIndices[0], entityPassantGridIndices[1], clickedGridIndices[0], clickedGridIndices[1], function(path) {
							if (!path) {
								Lucid.Utils.log("Game: path was not found");
							} else if (path.length) {
								Lucid.Utils.log("Game: path was found - last point is @ " + path[path.length - 1].x + "/" + path[path.length - 1].y);
							} 
							// case: entityGridIndices are the same as clickedGridIndices
							// this means there is no easystar path.
							else {
								path.push({
									x: entityPassantGridIndices[0],
									y: entityPassantGridIndices[1]
								});

								Lucid.Utils.log("Game: path was found - last point is @ " + path[path.length - 1].x + "/" + path[path.length - 1].y);
							}
							
							// set path for entityPassant if not null
							if (path) {
								entityPassant.setPath(path);
							}
						});

						// after setting a path, we need to run calculate()
						easystar.calculate();
					}
				}
			});

		// ... END of pathfinding testing stuff
			
		});
	});
	
	
	
	


	
}