(function($) {
 
    $.fn.XMLParser = function(config) {
		var defaults = {
			type: "GET",
			cache: false
		};

		config = $.extend({}, defaults, config);

		// private
		var privateFoo = function() {
			// do something ...
		}

		// public        
		this.init = function(url, id) {
			console.log("XMLParser init");
			
			$.ajax({
				type: config.type,
				url: url,
				cache: config.cache,
				dataType: "xml",
				success: function(data) {
					console.log("xml parsed:");
					console.log($(data));

					$(document).trigger("XMLParserSuccess", [id, $(data)]);
					// return $(data);
				},
				error: function (jqXHR, textStatus, errorThrown) {
					$(document).trigger("XMLParserError", [id, textStatus]);
				}
			});
		};

		return this;
    };
 
}(jQuery));