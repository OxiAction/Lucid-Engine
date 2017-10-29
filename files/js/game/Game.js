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
    player.addControl(new Control({"type": TYPE_CONTROL_LEFT, "key": 37}));
    player.addControl(new Control({"type": TYPE_CONTROL_RIGHT, "key": 39}));

    var engine2d = new Engine2D({"type": TYPE_ENGINE_SIDE_SCROLL});
    engine2d.setLayers(layers);

    // testing...
    $(document).trigger(EVENT_ENGINE_LOAD_MAP, "testmap");

    engine2d.destroy();
    engine2d = null;

    /*
    ////////////////////////////////////////////////
    TODO:   this is how it should look like
            just some ideas how this engine should work
    
    // the engine
    var engine2d = new Engine2D();
    
    // player object
    var player1 = new Player();
    
    // removing a player from the engine will result in removing the player from the map and from the group
    engine2d.addPlayer(player1);
    // engine2d.removePlayer(player1);

    // something like this should be possible:
    player1.setActive(false); // diasable player (controls, chat etc.)
    // player1.setActive(true); // enable
    

    // show menu
    engine2d.showLayer("menu");

    ---> now if the player selects a map in the menu - e.g. "map1":

    // event listener for the map selection event
    mapSelected {
        // load selected map
        engine2d.loadMap("map1");
        
        // event listener for the map loaded event
        mapLoaded {
            // return current Map() object
            var currentMap = engine2d.getCurrentMap();

            // this should return some information like: player start x/y, difficulty of the map, map title and so on...
            var mapConfig = currentMap.getConfig(); 
            
            // add controls
            // default controls
            player1.addControl(new Control({"type": TYPE_CONTROL_LEFT, "key": 37}));
            player1.addControl(new Control({"type": TYPE_CONTROL_RIGHT, "key": 39}));
            
            // you must be able to implement some kind of custom controls
            // this triggers an event and you can react to it (e.g. for game menu show / hide)
            player1.addControl(new Control({"type": TYPE_CONTROL_CUSTOM, "key": 40}));
            
            // add player to map
            currentMap.addPlayer(player1);
            
            // for multiplayer we would need this - transmitting other players data and setting their position
            var players = [];
            var player = new Player();
            currentMap.updatePlayer(players);

            // event listener for the map being finished
            mapFinished {
                // remove interaction
                player1.removeAllControls();

                engine2d.unloadMap();
                
                // something like this
                engine2d.showLayer("menu");
            } // end map finished
        } // end map loaded
    } // end map selected

    */
}