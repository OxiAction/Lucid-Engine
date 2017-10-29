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

    // custom layers
    var layerMenu = new LayerMenu({"target": "#layer-menu", "type": TYPE_LAYER_MENU});
    var layerUI = new LayerUI({"target": "#layer-ui", "type": TYPE_LAYER_UI});

    // engine default layers
    var layerObjects = new Layer({"target": "#layer-objects", "type": TYPE_LAYER_OBJECTS});
    var layerForeground = new Layer({"target": "#layer-foreground", "type": TYPE_LAYER_GRAPHICAL});
    var layerBackground = new Layer({"target": "#layer-background", "type": TYPE_LAYER_GRAPHICAL});
    var layers = {layerMenu, layerUI, layerObjects, layerForeground, layerBackground};

    var player = new Player({});
    player.addControl(new Control({"type": TYPE_CONTROL_RIGHT, "key": 37}));
    player.addControl(new Control({"type": TYPE_CONTROL_RIGHT, "key": 39}));

    var engine2d = new Engine2D({"type": TYPE_ENGINE_SIDE_SCROLL});
    engine2d.setLayers(layers);

    // testing...
    $(document).trigger(EVENT_ENGINE_LOAD_MAP, "testmap");

    engine2d.destroy();
    engine2d = null;
}