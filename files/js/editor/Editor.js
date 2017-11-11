$(document).ready(function() {
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

    // init engine
    engine2d = new Engine2D();
}