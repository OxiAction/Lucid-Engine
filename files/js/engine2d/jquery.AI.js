(function($) {
 
    $.fn.AI = function(config) {
		var defaults = {
		};

		config = $.extend({}, defaults, config);

		// private
		var privateFoo = function() {
			// do something ...
		}

		// public        
		this.publicFoo = function(xml) {
			// do something ...
		};

		return this;
    };
 
}(jQuery));