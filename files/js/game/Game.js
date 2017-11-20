$(document).ready(function() {
	// setup
	Lucid.Utils.setDebug(1);

	// check support
	if (!Lucid.Utils.engineSupported()) {
		Lucid.Utils.error("Sorry - your browser does NOT support Engine - please update your browser")
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
		debugGrid: true
	});

	// start engine
	engine.start();

	// listener for resize event
	window.addEventListener("resize", engine.resize.bind(engine), false);

	// update all the components initially! mandatory
	engine.resize();

	var mapName = "map1";
	
	// setup Camera
	engine.setCamera(new Lucid.Camera());

	// load the file into DOM
	engine.loadMapFile(mapName);

	// setup control group
	var controlGroup = new Lucid.ControlGroup({
		controls: [
			new Lucid.Control({
				key: Lucid.Control.KEY.UP,
				callback: function(target, key) {
					target.y -= 5;
				}
			}),
			new Lucid.Control({
				key: Lucid.Control.KEY.DOWN,
				callback: function(target, key) {
					target.y += 5;
				}
			}),
			new Lucid.Control({
				key: Lucid.Control.KEY.RIGHT,
				callback: function(target, key) {
					target.x += 5;
				}
			}),
			new Lucid.Control({
				key: Lucid.Control.KEY.LEFT,
				callback: function(target, key) {
					target.x -= 5;
				}
			})
		]
	});
	// add to engine
	engine.addControlGroup(controlGroup);
	// and set target to camera
	controlGroup.setTarget(Lucid.data.engine.getCamera());

	// easystar
	var easystar = new EasyStar.js();
	easystar.enableDiagonals();
	easystar.disableCornerCutting();
	easystar.setAcceptableTiles([0]);

	// event is triggered if Engine has loaded the map file
	$(document).on(Lucid.Engine.EVENT.LOADED_MAP_FILE_SUCCESS + namespace, function(event, loaderItem) {
		var mapFileName = loaderItem.getID();
		var map = engine.buildMapByFileName(mapFileName);
		
		// set the map - this will also start loading the map assets
		engine.setMap(map);

		// event is triggered if Map has loaded all the required assets
		$(document).on(Lucid.Map.EVENT.LOADED_ASSETS_SUCCESS + namespace, function(event, map) {
			// build the map
			map.build();

			// TODO: if we dont call this NOW its all messed up... needs to be fixed!
			engine.resize();

			// add click event
			window.addEventListener("click", function(e) {
				
				// get grid data from collision layer
				var collisionData = engine.getLayerCollision().getData();

				// set the collision grid data
				easystar.setGrid(collisionData);

				// layer for the entities
				var layerEntities = engine.getLayer("layer-entities");
				// if valid
				if (layerEntities) {

					// get entity with id passant1
					var entity = layerEntities.getEntity("passant1");
					// if valid
					if (entity) {

						var clickedGridIndices = engine.getLayerCollision().getGridIndicesByMouse(e.clientX, e.clientY);
						var entityGridIndices = entity.getGridIndices();
						
						// check if both "vectors" are valid
						if (clickedGridIndices && entityGridIndices) {
							Lucid.Utils.log("Game: clicked on tile @ " + clickedGridIndices[0] + "/" + clickedGridIndices[1]);

							// set new path indices
							// params: startX, startY, endX, endY, callback
							easystar.findPath(entityGridIndices[0], entityGridIndices[1], clickedGridIndices[0], clickedGridIndices[1], function(path) {
								if (path === null) {
									Lucid.Utils.log("Game: path was not found");
								} else if (path.length > 1) {
									Lucid.Utils.log("Game: path was found - last point is @ " + path[path.length - 1].x + "/" + path[path.length - 1].y);
								}

								// set path for entity!
								entity.setPath(path);
							});

							// after setting a path, we need to run calculate()
							easystar.calculate();
						}
					}
				}
				
			});
		});
	});
	
	
	
	


	
}