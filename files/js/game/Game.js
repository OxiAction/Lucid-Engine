$(document).ready(function() {
    // setup
    EngineUtils.setDebug(1);

    // check support
    if (!EngineUtils.engineSupported()) {
        EngineUtils.error("Sorry - your browser does NOT support Engine - please update your browser")
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
    EngineUtils.log("Game");

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
    engine = new Lucid.Engine();
    
    // custom layer for menu - persistent
    var layerMenu = engine.createAddLayer({
        z: 20,
        id: "layer-menu",
        persistent: true,
        type: Layer.TYPE.MENU
    });

    // custom layer for ui - persitent
    var layerUI = engine.createAddLayer({
        z: 19,
        id: "layer-ui",
        persistent: true,
        type: Layer.TYPE.UI
    });

    // start engine
    engine.start();

    // resize stuff
    function resize() {
        engine.resize();
    }

    // listener for resize event
    window.addEventListener("resize", resize, false);

    // update all the components initially! mandatory
    resize();

    var mapName = "map1";
    
    // setup Camera
    engine.setCamera(new Camera());

    // load the file into DOM
    engine.loadMapFile(mapName);

    // event is triggered if Engine has loaded the map file
    $(document).on(Lucid.Engine.EVENT.LOADED_MAP_FILE_SUCCESS + namespace, function(event, loaderItem) {
        var mapFileName = loaderItem.getID();
        var map = engine.buildMapByFileName(mapFileName);

        // event is triggered if Map has loaded all the required assets
        $(document).on(Map.EVENT.LOADED_ASSETS_SUCCESS + namespace, function(event, map) {
            // build the map
            map.build();

            resize();

            // setTimeout(function() {
                // engine.stop();
                // engine.destoryMap();
                // map = null;
                // $(document).off(Lucid.Engine.EVENT.LOADED_MAP_FILE_SUCCESS + namespace);
            // }, 3000);
        });

        // set the map - this will also start loading the map assets
        engine.setMap(map);
    });
}