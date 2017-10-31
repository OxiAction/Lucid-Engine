// gloabl Utils
var GameUtils;

/**
* This is the main Game object. It uses the Engine2D API to build the game.
*/
function Game() {
    EngineUtils.setDebug(1);
    
    EngineUtils.log("Game");

    // check support
    if (!EngineUtils.supportsCanvas()) {
        EngineUtils.error("browser does NOT support canvas")
        return;
    }

    // required for event listener removing
    var namespace = ".Game";

    // custom layers
    var layerMenu = new LayerMenu({
        "id": "layer-menu",
        "type": TYPE_LAYER_MENU
    });

    var layerUI = new LayerUI({
        "id": "layer-ui",
        "type": TYPE_LAYER_UI
    });
    
    // the engine
    var engine2d = new Engine2D();

    // add the custom layers
    engine2d.addLayer(layerMenu);
    engine2d.addLayer(layerUI);
    
    // create player object
    var player1 = new Player({
        "id": 1,
        "name": "John Doe"
    });
    
    // add player
    engine2d.addPlayer(player1);

    // enable player interaction abillities
    player1.setActive(true);
    
    // show menu
    engine2d.setLayerDisplayByID("layer-menu", true);

    var mapName = "levelMap1";

    // load the file into DOM
    engine2d.loadMapFile(mapName);

    // event is triggered if map 
    $(document).on(EVENT_ENGINE_LOADED_MAP_FILE_SUCCESS + namespace, function(event, mapName) {
        engine2d.buildMap(mapName);
        engine2d.enterMap(mapName);
    });

    // remove event listener
    // $(document).off(EVENT_ENGINE_LOADED_MAP_FILE_SUCCESS + namespace);

    /*
    TODO this is how it should work :D Just some ideas...

    // layer-menu event listener for the map selection event
    mapSelected {
        // load selected map
        engine2d.loadMapFile("map1");
        
        // event listener for the map loaded event
        mapLoaded {
            // return current Map() object
            var currentMap = engine2d.getCurrentMap();

            // this should return some information like: player start x/y, difficulty of the map, map title and so on...
            var mapConfig = currentMap.getConfig(); 
            
            // add controls
            // default controls
            player1.addControl(new Control({"type": TYPE_CONTROL_LEFT, "key": 37}));
            player1.addControl(new Control({"type": TYPE_CONTROL_RIGHT, "key": 39}));
            
            // you must be able to implement some kind of custom controls
            // this triggers an event and you can react to it (e.g. for game menu show / hide)
            player1.addControl(new Control({"type": TYPE_CONTROL_CUSTOM, "key": 40}));
            
            // add player to map
            currentMap.addPlayer(player1);
            
            // for multiplayer we would need this - transmitting other players data and setting their position
            var players = [];
            var player = new Player();
            currentMap.updatePlayer(players);

            // event listener for the map being finished
            mapFinished {
                // remove interaction
                player1.removeAllControls();

                engine2d.unloadCurrentMap();
                
                // something like this
                engine2d.showLayerByID("layer-menu");
            } // end map finished
        } // end map loaded
    } // end map selected
    */
}