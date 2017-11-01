
// abstract Component
function Component(config) {
	EngineUtils.log("Component");

	var type = config["type"];
	var active = config["active"];
	var id = config["id"];

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

	this.getID = function() {
		return id;
	}
}