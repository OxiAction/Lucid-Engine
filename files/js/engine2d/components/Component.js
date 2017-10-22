
// abstract Component
function Component(config) {
	EngineUtils.log("Component");

	var type = config.type;
	var active = config.active;

	this.setType = function(value) {
		type = value;
	}

	this.getType = function() {
		return type;
	}

	this.setActive = function(value) {
		active = value;
	}

	this.getActive = function() {
		return active;
	}

	this.destroy = function() {
	}
}