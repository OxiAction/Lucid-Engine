// gloabl Utils
var GameUtils;

function hijack(object, funcName, override) {
    var original = object[funcName];
    object[funcName] = override(original);
    return original;
}

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

    // engine2d
    var engine2d;

    // custom update function
    this.update = function() {
        // call original
        engine2d.update();

        // custom code goes here...
    }

    // init engine
    engine2d = new Engine2D({
        "layerContainer": "layer-container",
        "customUpdateFunction": this.update
    });

    // custom layer for menu - persistent
    var layerMenu = engine2d.createAddLayer({
        "id": "layer-menu",
        "persistent": true,
        "type": TYPE_LAYER_MENU
    });

    // custom layer for ui - persitent
    var layerUI = engine2d.createAddLayer({
        "id": "layer-ui",
        "persistent": true,
        "type": TYPE_LAYER_UI
    });

    // engine2d.removeLayerByID("layer-ui");
    
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

    // start engine2d
    engine2d.start();

    var mapName = "levelMap1";

    // load the file into DOM
    engine2d.loadMapFile(mapName);

    // event is triggered if map 
    $(document).on(EVENT_ENGINE_LOADED_MAP_FILE_SUCCESS + namespace, function(event, mapName) {
        var map = engine2d.buildMap(mapName);

        // cleanup testing
        setTimeout(function() {
            engine2d.stop();
            engine2d.destoryMap(mapName);
            map = null;
            $(document).off(EVENT_ENGINE_LOADED_MAP_FILE_SUCCESS + namespace);
        }, 3000);
    });
}