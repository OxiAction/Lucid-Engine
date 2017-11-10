//
// Asset loader
//

var Loader = {
    images: {}
};

Loader.loadImage = function (key, src) {
    var img = new Image();

    var d = new Promise(function (resolve, reject) {
        img.onload = function () {
            this.images[key] = img;
            resolve(img);
        }.bind(this);

        img.onerror = function () {
            reject('Could not load image: ' + src);
        };
    }.bind(this));

    img.src = src;
    return d;
};

Loader.getImage = function (key) {
    return (key in this.images) ? this.images[key] : null;
};

//
// Keyboard handler
//

var Keyboard = {};

Keyboard.LEFT = 37;
Keyboard.RIGHT = 39;
Keyboard.UP = 38;
Keyboard.DOWN = 40;

Keyboard._keys = {};

Keyboard.listenForEvents = function (keys) {
    window.addEventListener('keydown', this._onKeyDown.bind(this));
    window.addEventListener('keyup', this._onKeyUp.bind(this));

    keys.forEach(function (key) {
        this._keys[key] = false;
    }.bind(this));
}

Keyboard._onKeyDown = function (event) {
    var keyCode = event.keyCode;
    if (keyCode in this._keys) {
        event.preventDefault();
        this._keys[keyCode] = true;
    }
};

Keyboard._onKeyUp = function (event) {
    var keyCode = event.keyCode;
    if (keyCode in this._keys) {
        event.preventDefault();
        this._keys[keyCode] = false;
    }
};

Keyboard.isDown = function (keyCode) {
    if (!keyCode in this._keys) {
        throw new Error('Keycode ' + keyCode + ' is not being listened to');
    }
    return this._keys[keyCode];
};

//
// Game object
//

var viewportWidth = 576;
var viewportHeight = 512;

var Game = {};

Game.run = function (context) {
    console.log("run");
    this.ctx = context;
    this._previousElapsed = 0;

    var p = this.load();
    Promise.all(p).then(function (loaded) {
        this.init();
        window.requestAnimationFrame(this.tick);
    }.bind(this));
};

Game.tick = function (elapsed) {
    window.requestAnimationFrame(this.tick);

    // clear previous frame
    this.ctx.clearRect(0, 0, viewportWidth, viewportHeight);

    // compute delta time in seconds -- also cap it
    var delta = (elapsed - this._previousElapsed) / 1000.0;
    delta = Math.min(delta, 0.25); // maximum delta of 250 ms
    this._previousElapsed = elapsed;

    this.update(delta);
    this.render();
}.bind(Game);

// override these methods to create the demo
Game.init = function () {};
Game.update = function (delta) {};
Game.render = function () {};

//
// start up function
//

var canvasDefaultStyle = "";

window.onload = function () {
    var canvas = document.getElementById('demo');
    var context = canvas.getContext('2d');
    Game.run(context);
    var canvasDefaultStyle = canvas.getAttribute("style") || "";
    window.addEventListener('resize', function () {fullscreenify(canvas);}, false);
    fullscreenify(canvas);
    
};

function fullscreenify(canvas) {
    // full screen
    viewportWidth = window.innerWidth;
    viewportHeight = window.innerHeight;
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    if (Game.camera !== undefined) {
        Game.camera.update(map, viewportWidth, viewportHeight);
    }
    return;
/*
    var newStyle = "";
    
    videoRatio = viewportWidth / viewportHeight;
    windowRatio = window.innerHeight / window.innerWidth;

    

    if (windowRatio < videoRatio) {
        video.height = window.innerHeight;
    } else {
        video.width = window.innerWidth;
    }
   

    if (window.innerHeight < window.innerWidth) {
        newStyle = " width: auto; height: " + window.innerHeight + "px;";
    } else {
        newStyle = " height: auto; width: " + window.innerWidth + "px;";
    }

    canvas.setAttribute("style", canvasDefaultStyle + newStyle);
     */
/*

    var style = canvas.getAttribute('style') || '';
    
    // window.addEventListener('resize', function () {resize(canvas);}, false);

    // resize(canvas);

    // function resize(canvas) {
        var scale = {x: 1, y: 1};
        scale.x = (window.innerWidth - 10) / viewportWidth;
        scale.y = (window.innerHeight - 10) / viewportHeight;
        
        if (scale.x < 1 || scale.y < 1) {
            scale = '1, 1';
        } else if (scale.x < scale.y) {
            scale = scale.x + ', ' + scale.x;
        } else {
            scale = scale.y + ', ' + scale.y;
        }
        
        canvas.setAttribute('style', style + ' ' + '-ms-transform-origin: center top; -webkit-transform-origin: center top; -moz-transform-origin: center top; -o-transform-origin: center top; transform-origin: center top; -ms-transform: scale(' + scale + '); -webkit-transform: scale3d(' + scale + ', 1); -moz-transform: scale(' + scale + '); -o-transform: scale(' + scale + '); transform: scale(' + scale + ');');
    // }
    */
}
