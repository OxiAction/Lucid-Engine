(function($) {
 
    $.fn.Engine2D = function(config) {
		var defaults = {
		};

		config = $.extend({}, defaults, config);
		var test;
		var thingsOnMap = [
			[50,50],
			[55,70],
			[15,22],
			[150,20],
			[120,80],
			[100,10],
			[170,40],
			[130,70],
			[230,10],
			[330,45],
			[250,65]
		];
		var gameSettings = {
			"difficulty": 1,
			"speed": 1,
			"velocity": 1,
			"type": "side-scroll",
			"tilesize": 20
		};
		var objectsLayer = [
			["Player", [gameSettings, "player_default"], 20, 20],
			["AI", [gameSettings, "enemy_bandit"], 100, 20]
		];

		var foregroundLayer = [

		];

		var backgroundLayer = [

		];

		var playerX = 20;
		var playerY = 20;
		var offsetX = 0;
		var offsetY = 0;
		var width = 0;
		var height = 0;

		var engine = this;
		
		// convert to DOM element
		var can = engine.get(0);

		// context of canvas
		var ctx = can.getContext('2d');
		ctx.font = '8px sans';
		ctx.mozImageSmoothingEnabled = false;
		ctx.webkitImageSmoothingEnabled = false;
		ctx.msImageSmoothingEnabled = false;
		ctx.imageSmoothingEnabled = false;
		var tileset = document.getElementById('tileset');

		this.draw = function() {
		    ctx.save();
		    ctx.translate(offsetX, offsetY);
		    // clear the viewport
		    ctx.clearRect(-offsetX, -offsetY, width, height);
		    
		    // draw the player
		    ctx.fillStyle = 'red';
		    ctx.fillRect(playerX-offsetX, playerY-offsetY, 8, 8);
		    
		    for (var i = 0; i < 10; i++) {
		    	// 1.283px × 654px
		    	// 1 posx on image, 2 posy on image, 3 img width, 4 img height, 5 pos x on img rec, 6 pos y on img rec
		    	ctx.drawImage(tileset, 17, 0, 16, 16, 16*i, 0, 16, 16);
		    }

		    // draw the other stuff
		    var l = thingsOnMap.length;
		    for (var i = 0; i < l; i++) {
		        // TODO: only draw whats necessary :X
		        var x = thingsOnMap[i][0];
		        var y = thingsOnMap[i][1];
		        ctx.fillStyle = 'lightblue';
		        ctx.fillRect(x, y, 20, 20);
		        ctx.fillStyle = 'black';
		        ctx.fillText(x + ', ' + y, x, y) // just to show where we are drawing these things
		    }
		    
		    ctx.restore();
		    console.log("draw");
		}

		this.resize = function() {
			
			width = document.body.clientWidth;
			height = document.body.clientHeight;

			can.width = width;
			can.height = height;
			// width = can.width;
			// height = can.height;
			console.log("w:" + width + " h:" + height);
			engine.draw();
		}

		// var drawInterval = setInterval(engine.draw, 20);

		can.tabIndex = 1;
		can.addEventListener('keydown', function(e) {
			if (e.keyCode === 37) {
				offsetX++;
			} else if (e.keyCode === 39) {
				offsetX--;
			}
			engine.draw();
		}, false);

		engine.draw();
		engine.resize();

		return this;
    };
 
}(jQuery));