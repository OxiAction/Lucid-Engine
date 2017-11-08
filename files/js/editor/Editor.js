// global utils - mandatory
var EngineUtils;

// global loader - mandatory
var EngineLoader;

$(document).ready(function() {
    // mandatory Engine2D stuff
    EngineUtils = new EngineUtils();
    EngineLoader = new EngineLoader();

    // setup
    EngineUtils.setDebug(1);

    // check support
    if (!EngineUtils.engineSupported()) {
        EngineUtils.error("Sorry - your browser does NOT support Engine2D - please update your browser")
        return;
    }
    
    var editor = new Editor();
});

/**
 * This is the Editor class. It uses custom plugins and the Engine2D API to
 * build the editor.
 *
 * @class      Editor (name)
 */
function Editor() {
    // say hello
    EngineUtils.log("Editor");

    // required for event listener removing
    var namespace = ".Editor";

    // engine2d
    var engine2d;

    // forms
    $("#select-map").selectmenu({
        width: "auto"
    });

    // custom update function
    this.update = function() {
        // call original
        engine2d.update();

        // custom code goes here...
    }

    // init engine
    engine2d = new Engine2D({
        "layerContainer": "layer-container",
        "customUpdateFunction": this.update,
        "editMode": true
    });

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
    
}