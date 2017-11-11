$(document).ready(function() {
    // setup
    EngineUtils.setDebug(1);

    // check support
    if (!EngineUtils.engineSupported()) {
        EngineUtils.error("Sorry - your browser does NOT support Engine2D - please update your browser")
        return;
    }
    
    var game = new Game();
});


/**
 * This is the Game class. It uses custom plugins and the Engine2D API to build
 * the game.
 *
 * @class      Game (name)
 */
function Game() {
    // say hello
    EngineUtils.log("Game");

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
    engine2d = new Engine2D();

    
    // custom layer for menu - persistent
    var layerMenu = engine2d.createAddLayer({
        z: 20,
        id: "layer-menu",
        persistent: true,
        type: Layer.TYPE.MENU
    });

    // custom layer for ui - persitent
    var layerUI = engine2d.createAddLayer({
        z: 19,
        id: "layer-ui",
        persistent: true,
        type: Layer.TYPE.UI
    });
    

    // start engine2d
    // engine2d.start();

    var mapName = "map1";
    
    // setup Camera
    engine2d.setCamera(new Camera());

    // load the file into DOM
    engine2d.loadMapFile(mapName);

    // event is triggered if map 
    $(document).on(Engine2D.EVENT.LOADED_MAP_FILE_SUCCESS + namespace, function(event, loaderItem) {
        var mapFileName = loaderItem.getID();
        var map = engine2d.setMap(mapFileName);

        // cleanup testing
        setTimeout(function() {
            // engine2d.stop();
            engine2d.destoryMap();
            map = null;
            $(document).off(Engine2D.EVENT.LOADED_MAP_FILE_SUCCESS + namespace);
        }, 3000);
    });
}