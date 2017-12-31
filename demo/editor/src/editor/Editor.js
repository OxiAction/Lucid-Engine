$(document).ready(function() {
    // setup
    Lucid.Utils.setDebug(1);

    // check support
    if (!Lucid.Utils.engineSupported()) {
        Lucid.Utils.error("Sorry - your browser does NOT support Engine - please update your browser")
        return;
    }
    
    var editor = new Lucid.Editor();
});

/**
 * This is the Editor class. It uses custom plugins and the Engine API to
 * build the editor.
 *
 * @class      Editor (name)
 */
Lucid.Editor = function() {
    // say hello
    Lucid.Utils.log("Editor");

    // required for event listener removing
    var namespace = ".Editor";

    // engine
    var engine;

    // forms
    $("#select-map").selectmenu({
        width: "auto"
    });

    // init engine
    engine = new Lucid.Engine();
}