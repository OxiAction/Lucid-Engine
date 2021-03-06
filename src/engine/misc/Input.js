/**
 * Lucid Engine
 * Copyright (C) 2019 Michael Schreiber
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 * 
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

// namespace
var Lucid = Lucid || {};

/**
 * Input manager.
 * 
 * @class      Input (name)
 * @return     {Object}  Public methods.
 */
Lucid.Input = function() {
	// local variables
	var target = null;
	var pressed = {};
	var position = {
		x: 0,
		y: 0
	};

/**
 * Private functions
 */

 	function validTagName(tagName) {
		return !(tagName == "INPUT" || tagName == "TEXTAREA");
 	}

 	function getKeyCode(type, event) {
 		var code = event.type;

		if (code == type) {
			code = event.keyCode;
		} else if (event.buttons == 1) {
			code = Lucid.Input.KEYS.MOUSE_LEFT;
		} else if (event.buttons == 2) {
			code = Lucid.Input.KEYS.MOUSE_RIGHT;
		} else if (event.buttons == 3 || event.buttons == 4) {
			code = Lucid.Input.KEYS.MOUSE_MIDDLE;
		}

 		return code;
 	}

	function keyDown(event) {
		if (!validTagName(event.target.tagName)) {
			return;
		}

		var code = getKeyCode("keydown", event);

		if(event.type == "mousedown" || event.type == "touchstart") {
			mouseMove(event);
		}

		pressed[code] = true;

		Lucid.Event.trigger(Lucid.Input.EVENTS.KEY_DOWN, code);

		event.stopPropagation();
		event.preventDefault();
	}

	function keyUp(event) {
		if (!validTagName(event.target.tagName)) {
			return;
		}

		var code = getKeyCode("keyup", event);

		pressed[code] = false;

		Lucid.Event.trigger(Lucid.Input.EVENTS.KEY_UP, code);

		event.stopPropagation();
		event.preventDefault();
	}

	function mouseWheel(event) {
		// TODO
	}

	function mouseMove(event) {
		if (event.touches) {
			event = event.touches[0];
		}

		position.x = event.clientX;
		position.y = event.clientY;
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
		},

		getPressed: function() {
			return pressed;
		},

		getPosition: function() {
			return position;
		}
	};
}();

Lucid.Input.EVENTS = {
	KEY_DOWN: "keyDown",
	KEY_UP: "keyUp"
}

// the mouse integers are internal values and do not reflect the actual buttons
// code
Lucid.Input.KEYS = {
	"MOUSE_LEFT": 1,
	"MOUSE_MIDDLE": 2,
	"MOUSE_RIGHT": 3,
	"MWHEEL_UP": 4,
	"MWHEEL_DOWN": 5,
	
	"BACKSPACE": 8,
	"TAB": 9,
	"ENTER": 13,
	"PAUSE": 19,
	"CAPS": 20,
	"ESC": 27,
	"SPACE": 32,
	"PAGE_UP": 33,
	"PAGE_DOWN": 34,
	"END": 35,
	"HOME": 36,
	"LEFT_ARROW": 37,
	"UP_ARROW": 38,
	"RIGHT_ARROW": 39,
	"DOWN_ARROW": 40,
	"INSERT": 45,
	"DELETE": 46,
	"_0": 48,
	"_1": 49,
	"_2": 50,
	"_3": 51,
	"_4": 52,
	"_5": 53,
	"_6": 54,
	"_7": 55,
	"_8": 56,
	"_9": 57,
	"A": 65,
	"B": 66,
	"C": 67,
	"D": 68,
	"E": 69,
	"F": 70,
	"G": 71,
	"H": 72,
	"I": 73,
	"J": 74,
	"K": 75,
	"L": 76,
	"M": 77,
	"N": 78,
	"O": 79,
	"P": 80,
	"Q": 81,
	"R": 82,
	"S": 83,
	"T": 84,
	"U": 85,
	"V": 86,
	"W": 87,
	"X": 88,
	"Y": 89,
	"Z": 90,
	"NUMPAD_0": 96,
	"NUMPAD_1": 97,
	"NUMPAD_2": 98,
	"NUMPAD_3": 99,
	"NUMPAD_4": 100,
	"NUMPAD_5": 101,
	"NUMPAD_6": 102,
	"NUMPAD_7": 103,
	"NUMPAD_8": 104,
	"NUMPAD_9": 105,
	"MULTIPLY": 106,
	"ADD": 107,
	"SUBSTRACT": 109,
	"DECIMAL": 110,
	"DIVIDE": 111,
	"F1": 112,
	"F2": 113,
	"F3": 114,
	"F4": 115,
	"F5": 116,
	"F6": 117,
	"F7": 118,
	"F8": 119,
	"F9": 120,
	"F10": 121,
	"F11": 122,
	"F12": 123,
	"SHIFT": 16,
	"CTRL": 17,
	"ALT": 18,
	"PLUS": 187,
	"COMMA": 188,
	"MINUS": 189,
	"PERIOD": 190
};