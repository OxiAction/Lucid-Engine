
function Layer(config, canvas) {
	console.log("Layer");
	var configDefault = {
		"type": 0, // 0 = menu, 1 = ui, 2 = foreground, 3 = background, 4 = collision
		"active": 0
	};

	this.config = $.extend({}, configDefault, config);

	this.active = config.active;

	this.update = function() {

	}

	// activate / deactivate layer
	this.setActive = function(active) {
		this.active = active;
	}

	// destroy layer
	this.destroy = function() {

	}
}