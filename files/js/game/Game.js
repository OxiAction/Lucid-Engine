// gloabl Utils
var GameUtils;

function Game() {
    EngineUtils.setDebug(1);
    
    EngineUtils.log("Game");

    // check support
    if (!EngineUtils.supportsCanvas()) {
        EngineUtils.error(this, "browser does NOT support canvas")
        return;
    }

    
    
    // var layerMenu = new LayerMenu("#layer-menu");
    // var layerUI = new LayerUI("#layer-ui");
    // var layerObjects = new LayerObjects("#layer-objects");
    // var layerForeground = new LayerForeground("#layer-foreground");
    // var layerBackground = new LayerBackground("#layer-background");


    var layerMenu = new LayerMenu({"target": "#layer-menu", "type": TYPE_LAYER_MENU});
    var layerUI = new LayerUI({"target": "#layer-ui", "type": TYPE_LAYER_UI});
    var layerObjects = new Layer({"target": "#layer-objects", "type": TYPE_LAYER_OBJECTS});
    var layerForeground = new Layer({"target": "#layer-foreground", "type": TYPE_LAYER_GRAPHICAL});
    var layerBackground = new Layer({"target": "#layer-background", "type": TYPE_LAYER_GRAPHICAL});
    var layers = {layerMenu, layerUI, layerObjects, layerForeground, layerBackground};

    var player = new Player({});
    player.addControl(new Control({"type": TYPE_CONTROL_RIGHT, "key": 37}));
    player.addControl(new Control({"type": TYPE_CONTROL_RIGHT, "key": 39}));

    var engine2d = new Engine2D({"type": TYPE_ENGINE_SIDE_SCROLL});
}