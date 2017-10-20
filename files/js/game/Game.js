// gloabl Utils
var GameUtils;

function Game() {
    console.log("Game");

    // check support
    if (!EngineUtils.supportsCanvas()) {
        return;
    }

    console.log("browser supports touch: " + EngineUtils.supportsTouch());
    
    var layerMenu = new LayerMenu("#layer-menu");
    var layerUI = new LayerUI("#layer-ui");
    var layerForeground = new LayerForeground("#layer-foreground");
    var layerBackground = new LayerBackground("#layer-background");
}