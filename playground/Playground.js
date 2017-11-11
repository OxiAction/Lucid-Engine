/**
 * This is just a playground for experiments & ideas.
 * 
 * Good stuff about RAF (Request Animation Frame):
 * - http://www.javascriptkit.com/javatutors/requestanimationframe.shtml
 * - https://hacks.mozilla.org/2011/08/animating-with-javascript-from-setinterval-to-requestanimationframe/
 */

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

 window.requestAnimationFrame = window.requestAnimationFrame
    || window.mozRequestAnimationFrame
    || window.webkitRequestAnimationFrame
    || window.msRequestAnimationFrame
    || function(f){ return setTimeout(f, 1000/60); } // simulate calling code 60 
 
window.cancelAnimationFrame = window.cancelAnimationFrame
    || window.mozCancelAnimationFrame
    || function(requestID){ clearTimeout(requestID); } //fall back

// global variables
var image;
var engine;

window.onload = function() {
	image = new Image();
	image.onload = function () {
		console.log("Image loaded " + image.src);
		
	    // engine
		engine = new Engine();

		// beam it up scotty
		engine.start();

		// resize stuff
		function resize() {
			console.log("Resize event!");
			engine.resize({
				wWidth: window.innerWidth,
				wHeight: window.innerHeight
			});
		}

		// listener for resize event
		window.addEventListener("resize", resize, false);

		// update all the components initially! mandatory
		resize();
	}
	image.src = "tiles.png";
}

var Engine = Class.extend({
	animationFrameID: null,
	prevElapsed: 0,
	canvas: null, // EVERYTHING will be rendered into this canvas yo
	canvasContext: null,
	camera: null,
	map: null,
	collisionLayers: [],
	collidingLayers: [],
	normalLayers: [],

	init: function(config) {
		console.log("Engine init");

		// get canvas from HTML
		this.canvas = document.getElementById("engine2d-canvas");
		if (!this.canvas) {
			return;
		}

		// assign context
		this.canvasContext = this.canvas.getContext("2d");

		// setup camera
		this.camera = new Camera();

		// setup map
		this.map = new Map({
			camera: this.camera
		});
		// quick & dirty asign
		this.normalLayers = this.map.getLayer(); 
	},

	start: function() {
		this.animationFrameID = window.requestAnimationFrame(this.tick.bind(this));
		console.log("Engine start - animationFrameID: " + this.animationFrameID);

		/*
		// testing: manual stop after xxx seconds
		window.setTimeout(function() {
			engine.stop();
		}, 1000);
		*/
	},

	stop: function() {
		console.log("Engine stop - animationFrameID: " + this.animationFrameID);
		if (this.animationFrameID != null) {
			window.cancelAnimationFrame(this.animationFrameID);
			this.animationFrameID = null;
		}
	},

	// note: "this" scope is now "window"!
	// FIXED: with bind(this)
	tick: function(elapsed) {
		var elapsedSeconds = elapsed / 1000.0; // convert in seconds
		var delta = (elapsed - engine.prevElapsed) / 1000.0; // delta in seconds
    	delta = Math.min(delta, 0.06); // maximum delta of 60 ms
		// console.log("Engine tick - elapsedTimeSeconds: " + elapsedSeconds + " prevElapsed: " + this.prevElapsed + " delta: " + delta);
		
		this.prevElapsed = elapsed;

		/*
		// stop
		if (elapsedSeconds > 3) {
			engine.stop();
		}
		*/

		this.draw();

		// check if we should keep on shaking!
		// TLD: https://www.youtube.com/watch?v=mhzc5ZeAXYY
		// \o/
		if (this.animationFrameID) {
			// recursive call
			window.requestAnimationFrame(this.tick.bind(this));
		}
	},

	draw: function() {
		if (!this.canvasContext) {
			return;
		}

		this.canvasContext.clearRect(0, 0, this.canvas.width, this.canvas.height);

		var i;
		var layer;

		// config for them lay0rs!
		var config = {
			collisionData: []
		}

		// skip through collisionLayer
		// update them and collect collisionData
		var collisionData = [];
		for (i = 0; i < this.collisionLayers.length; ++i) {
			layer = this.collisionLayers[i];
			layer.draw(config);

			var currCollisionData = layer.getCollisionData();

			if (currCollisionData) {
				collisionData.push(currCollisionData);
			}
		}

		if (this.camera) {
			this.camera.draw(config);
		}

		// TODO: eeerm some kind of z-sorting is required here I guess :D

		// set collisionData for the next layers
		config.collisionData = collisionData;

		for (i = 0; i < this.collidingLayers.length; ++i) {
			layer = this.collidingLayers[i];

			// draw layer & engine canvas
			layer.draw(config);
			this.canvasContext.drawImage(layer.getCanvas(), 0, 0);
		}

		for (i = 0; i < this.normalLayers.length; ++i) {
			layer = this.normalLayers[i];

			// draw layer & engine canvas
			layer.draw(config);
			this.canvasContext.drawImage(layer.getCanvas(), 0, 0);
		}
	},

	resize: function(config) {
		// update engine canvas
		this.canvas.width = config.wWidth;
		this.canvas.height = config.wHeight;



		// update layers
		var i;
		var layer;

		for (i = 0; i < this.collisionLayers.length; ++i) {
			layer = this.collisionLayers[i];
			layer.resize(config);
		}

		for (i = 0; i < this.collidingLayers.length; ++i) {
			layer = this.collidingLayers[i];
			layer.resize(config);
		}

		for (i = 0; i < this.normalLayers.length; ++i) {
			layer = this.normalLayers[i];
			layer.resize(config);
		}

		// update map
		if (this.map) {
			this.map.resize(config);
		}
	}
});

var Layer = Class.extend({
	map: null,
	type: null,
	data: null,
	canvas: null,
	canvasContext: null,

	// wWidth: 0,
	// wHeight: 0,
	vWidth: 0, // TODO
	vHeight: 0, // TODO

	init: function(config) {
		console.log("Layer init");

		this.map = config.map;
		this.type = config.type;
		this.data = config.data;

		this.canvas = document.createElement("canvas");
		this.canvasContext = this.canvas.getContext("2d");
	},

	draw: function(config) {
		// if there is NO map reference, its probably a custom Layer
		// and in this case, the draw function should be overriden
		// with custom drawing logic
		var map = this.map; // variable caching -> performance inc.
		if (!map) {
			console.log("Layer has no map!");
			return;
		}

		var camera = this.map.getCamera(); // variable caching -> performance inc.
		if (!camera) {
			console.log("Layer has no camera!");
			return;
		}

		if (!this.data) {
			console.log("Layer has no data!");
			return;
		}

		var cameraWidth = camera.width;
		var cameraHeight = camera.height;

		var canvasContext = this.canvasContext;

		// draw stuff
		canvasContext.width = cameraWidth;
		canvasContext.height = cameraHeight;
		canvasContext.clearRect(0, 0, cameraWidth, cameraHeight);

		var cols = map.cols;
		var rows = map.rows;
		var tileSize = map.tileSize;

		var startCol = Math.floor(camera.x / tileSize);
		var endCol = Math.min(cols - 1, (startCol + cameraWidth / tileSize) + 1);

		var startRow = Math.floor(camera.y / tileSize);
		var endRow = Math.min(rows - 1, (startRow + cameraHeight / tileSize) + 1);

		var offsetX = -camera.x + startCol * tileSize;
		var offsetY = -camera.y + startRow * tileSize;

		for (var col = startCol; col <= endCol; ++col) {
			for (var row = startRow; row <= endRow; ++row) {

				
				var x = Math.round((col - startCol) * tileSize + offsetX);// 100;
				var y = Math.round((row - startRow) * tileSize + offsetY);

				if (x >= -camera.x && y >= -camera.y) {
					var tileIndex = row * cols + col;
					var tileType = this.getTile(tileIndex);

					if (tileType !== 0) { // 0 => empty tile
						canvasContext.drawImage(
							image, // image TODO: ...
							(tileType - 1) * tileSize, // source x
							0, // source y
							tileSize, // source width
							tileSize, // source height
							x,  // target x
							y, // target y
							tileSize, // target width
							tileSize // target height
						);
					}
				}
			}
		}
		

		return this.canvas;
	},

	getTile: function (index) {
		if (index < this.data.length) {
			return this.data[index];
		} else {
			return 0;
		}
	},

	getCollisionData: function() {
		return null;
	},

	getCanvas: function() {
		return this.canvas;
	},

	resize: function(config) {
		// this.wWidth = config.wWidth;
		// this.wHeight = config.wHeight;

		this.canvas.width = config.wWidth;
		this.canvas.height = config.wHeight;
	}
});

// type constants
Layer.TYPE = {
	MENU: "menu", // menus
	UI: "ui", // ui
	GRAPHICAL: "graphical", // precise graphics rendering
	COLLISION: "collision", // invisible collision layer
	OBJECTS: "objects" // objects (e.g. invisible triggers)
};

var Map = Class.extend({
	camera: null,
	tileSize: 64,
	cols: 12,
	rows: 12,
	vWidth: 512,
	vHeight: 512,
	layers: null,

	init: function(config) {
		console.log("Map init");

		this.camera = config.camera;

		if (!this.camera) {
			return;
		}

		this.layers = [
			new Layer({
				map: this,
				type: Layer.TYPE.GRAPHICAL,
				data: [
					3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3,
					3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3,
					3, 1, 3, 1, 1, 1, 1, 1, 1, 1, 1, 3,
					3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3,
					3, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 3,
					3, 1, 1, 1, 1, 1, 2, 1, 1, 1, 1, 3,
					3, 1, 2, 2, 1, 1, 1, 1, 1, 1, 1, 3,
					3, 1, 2, 2, 1, 1, 1, 1, 1, 1, 1, 3,
					3, 1, 1, 1, 2, 1, 1, 1, 1, 1, 1, 3,
					3, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 3,
					3, 1, 1, 1, 1, 2, 1, 1, 1, 1, 1, 3,
					3, 3, 3, 1, 1, 2, 3, 3, 3, 3, 3, 3
				]
			}),
			new Layer({
				map: this,
				type: Layer.TYPE.GRAPHICAL,
				data: [
					4, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4,
					4, 0, 4, 0, 0, 0, 0, 0, 0, 0, 0, 4,
					4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
					4, 0, 0, 5, 0, 0, 0, 0, 0, 5, 0, 4,
					4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
					4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
					4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
					4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
					4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
					4, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 4,
					4, 4, 4, 0, 5, 4, 4, 4, 4, 4, 4, 4,
					4, 4, 4, 0, 0, 3, 3, 3, 3, 3, 3, 3
				]
			})
		];
	},

	getLayer: function() {
		return this.layers;
	},

	getCamera: function() {
		return this.camera;
	},

	draw: function(config) {

	},

	resize: function(config) {
		if (this.camera) {
			this.camera.resize(config);
		}
	}
});

var Camera = Class.extend({
	x: 0,
	y: 0,
	width: 0,
	height: 0,
	// TODO: remove this
	// this is just quick & dirty controls implementation
	// usually this should be done using a Control component and accessing the Camera.x / Camera.y
	pressedKeys: {},

	keyDownHandler: null,
	keyUpHandler: null,

	init: function(config) {
		console.log("Camera init");

		this.keyDownHandler = this.onKeyDown.bind(this);
		window.addEventListener("keydown", this.keyDownHandler);
    	this.keyUpHandler = this.onKeyUp.bind(this);
    	window.addEventListener("keyup", this.keyUpHandler);

    	// window.removeEventListener("keydown", this.keyDownHandler);
	},

	// TODO: remove this
	// this is just quick & dirty controls implementation
	// usually this should be done using a Control component and accessing the Camera.x / Camera.y
	onKeyDown: function(e) {
		var keyCode = e.keyCode;
		if (keyCode in Camera.KEYCODE) {
			e.preventDefault();
			this.pressedKeys[keyCode] = true;
		}
	},

	// TODO: remove this
	// this is just quick & dirty controls implementation
	// usually this should be done using a Control component and accessing the Camera.x / Camera.y
	onKeyUp: function(e) {
		var keyCode = e.keyCode;
		if (keyCode in Camera.KEYCODE) {
			e.preventDefault();
			this.pressedKeys[keyCode] = false;
		}
	},

	draw: function(config) {
		for (var key in this.pressedKeys) {
			if (this.pressedKeys[key] == true) {
				if (key == 38) {
					this.y -= 1;
				}
				if (key == 39) {
					this.x += 1;
				}
				if (key == 40) {
					this.y += 1;
				}
				if (key == 37) {
					this.x -= 1;
				}
			}
		}
	},

	resize: function(config) {
		this.width = config.wWidth;
		this.height = config.wHeight;
	}
});

// TODO: remove this
// this is just quick & dirty controls implementation
// usually this should be done using a Control component and accessing the Camera.x / Camera.y
Camera.KEYCODE = {
	38: "up",
	39: "right",
	40: "down",
	37: "left"
}

// type constants
Camera.TYPE = {
	CENTER: "center"
};

var Entity = Class.extend({
	x: 0,
	y: 0,

	init: function(config) {
		console.log("Entity init");
	}
});