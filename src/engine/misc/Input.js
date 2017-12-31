// namespace
var Lucid = Lucid || {};

/**
 * Input manager.
 * 
 * @class      Input (name)
 * @return     {Object}  Public methods.
 */
Lucid.Input = function() {
	// private variables
	var events = {"test":"testv"};
	var target = null;

/**
 * Private functions
 */

 	function validTagName(tagName) {
		return !(tagName == "INPUT" || tagName == "TEXTAREA");
 	}

	function keyDown(event) {
		if (!validTagName(event.target.tagName)) {
			return;
		}
		console.log("Lucid.Input @ keyDown: event " + event);
	}

	function keyUp(event) {
		if (!validTagName(event.target.tagName)) {
			return;
		}
		console.log("Lucid.Input @ keyUp: event " + event);
	}

	function mouseWheel(event) {
		console.log("Lucid.Input @ mouseWheel: event " + event);
	}

	function mouseMove(event) {
		console.log("Lucid.Input @ mouseWheel: event " + event);
	}

/**
 * Public methods
 */

	return {
		init: function(target) {
			if (!target) {
				Lucid.Utils.error("Lucid.Input @ init: undefined target parameter!");
				return false;
			}
			target.addEventListener("mousedown", keyDown);
			target.addEventListener("touchstart", keyDown);
			window.addEventListener("keydown", keyDown);

			target.addEventListener("mouseup", keyUp);
			target.addEventListener("touchend", keyUp);
			window.addEventListener("keyup", keyUp);

			target.addEventListener("mousewheel", mouseWheel);
			target.addEventListener("DOMMouseScroll", mouseWheel);

			target.addEventListener("mousemove", mouseMove);
			target.addEventListener("touchmove", mouseMove);

			return true;
		}
	};
}();