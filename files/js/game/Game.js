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
        id: "layer-menu",
        persistent: true,
        type: Layer.TYPE.MENU
    });

    // custom layer for ui - persitent
    var layerUI = engine2d.createAddLayer({
        id: "layer-ui",
        persistent: true,
        type: Layer.TYPE.UI
    });

    var loaderItem = new EngineLoaderItem({
        id: "tiles",
        dataType: EngineLoader.TYPE.IMAGE,
        filePath: "playground/tiles.png",
        eventSuccessName: Map.EVENT.LOADED_TILESET_FILE_SUCCESS,
        eventErrorName: Map.EVENT.LOADED_TILESET_FILE_ERROR
    });

    EngineLoader.add(loaderItem);

    $(document).on(Map.EVENT.LOADED_TILESET_FILE_SUCCESS + namespace, function(event, loaderItem) {
        console.log(loaderItem.getData());
    });

    /*
    // create player object
    var player1 = new Player({
        id: 1,
        name: "John Doe"
    });
    
    // add player
    engine2d.addPlayer(player1);

    // enable player interaction abillities
    player1.setActive(true);
    
    // show menu
    engine2d.setLayerDisplay("layer-menu", true);

    // start engine2d
    engine2d.start();

    var mapName = "map1";
    
    // load the file into DOM
    engine2d.loadMapFile(mapName);

    // event is triggered if map 
    $(document).on(Engine2D.EVENT.LOADED_MAP_FILE_SUCCESS + namespace, function(event, loaderItem) {
        var mapFileName = loaderItem.getID();
        var map = engine2d.buildMap(mapFileName);

        // cleanup testing
        setTimeout(function() {
            engine2d.stop();
            engine2d.destoryMap(mapFileName);
            map = null;
            $(document).off(Engine2D.EVENT.LOADED_MAP_FILE_SUCCESS + namespace);
        }, 3000);
    });
    */
}