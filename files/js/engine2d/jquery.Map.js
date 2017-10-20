(function($) {
 
    $.fn.Map = function(config) {
		var defaults = {
		};

		config = $.extend({}, defaults, config);

		var mapObject;
        var size;
        var difficulity;
        var tileset;

		// private
		var privateFoo = function() {
			// do something ...
		}

		// public        
		this.init = function(xml) {
			console.log("Map init");
			
			mapObject = xml.find("map");
        	size = mapObject.attr("size");
        	difficulity = mapObject.attr("difficulity");
        	tileset = mapObject.attr("tileset");

        	console.log("map attributes -> size: " + size + " difficulity: " + difficulity + " tileset: " + tileset);
		};

		return this;
    };
 
}(jQuery));