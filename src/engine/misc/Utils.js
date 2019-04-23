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
 * Utils is a utils collection for the Engine. It also extends some JavaScript
 * data types with new features.
 *
 * @class      Utils (name)
 * @return     {Object}  Returns public methods.
 */
Lucid.Utils = function() {
	// private variables
	var cache = {};
	var debug = 0;

	// prevent console.log, console.warn, console.debug errors on older browsers
	if (typeof console == "undefined") {
		window.console = {
			log: function () {
				// do nothing
			}
		};
		console.warn = console.debug = console.log;
	}

	// extending JavaScript data types with new features
	Number.prototype.limit = function(min, max) {
		return Math.min(max, Math.max(min, this));
	};
	
	Number.prototype.round = function(precision) {
		precision = Math.pow(10, precision || 0);
		return Math.round(this * precision) / precision;
	};

	Number.prototype.floor = function() {
		return Math.floor(this);
	};

	Number.prototype.ceil = function() {
		return Math.ceil(this);
	};

	Number.prototype.toInt = function() {
		return (this | 0);
	};

	Number.prototype.toDeg = function() {
		return (this * 180) / Math.PI;
	};

	Array.prototype.sortByKey = function(key) {
		return this.sort(function(a, b) {
			return parseFloat(a[key]) - parseFloat(b[key]);
		});
	};

	Array.prototype.erase = function (v) {
		if (this.indexOf(v) != -1) {
			this.splice(this.indexOf(v), 1);
			return true;
		}
		return false;
	}

	Array.prototype.random = function() {
		return this[Math.floor(Math.random() * this.length)];
	};

	Array.prototype.contains = function(item) {
		var i = this.length;
		while (i--) {
			if (this[i] === item) {
				return true;
			}
		}
		return false;
	}

/**
 * Public methods
 */

	return {
		/**
		 * Loads a file.
		 *
		 * @param      {String}            url       The url.
		 * @param      {String}            dataType  The data type. E.g.
		 *                                           "script", "xml",
		 *                                           "application/x-www-form-urlencoded; charset=UTF-8"
		 * @param      {loadFileCallback}  success   The success callback
		 *                                           function.
		 * @param      {loadFileCallback}  error     The error callback
		 *                                           function.
		 */
		loadFile: function(url, dataType, success, error) {
			var request = new XMLHttpRequest();
			
			// fix error message when loading on a local machine
			if (request.overrideMimeType && (dataType == "script" || dataType == "application/json")) {
			  request.overrideMimeType("application/json");
			}

			request.open("GET", url + "?" + Date.now(), true);

			request.onload = function() {
				if (request.status >= 200 && request.status < 400) {
					// success!
					if (dataType == "script") {
						var script = document.createElement("script");
						script.type = "text/javascript";
						script.text = request.responseText;
						document.body.appendChild(script);
					}

					success(request);
				} else {
					// We reached our target server, but it returned an error
					error(request);
				}
			};

			request.onerror = function() {
				// There was a connection error of some sort
				error(request.responseText);
			};

			request.send();
		},

		/**
		 * Enable / disable debug mode.
		 *
		 * @param      {Boolean}  value   The value.
		 */
		setDebug: function(value) {
			debug = value;
		},

		/**
		 * General check if the browser has all the features which are required
		 * by Engine.
		 *
		 * @return     {Boolean}  Returns true if supported.
		 */
		engineSupported: function() {
			if (!this.supportsCanvas()) {
				return false;
			}

			// TODO: this needs more checks - I guess...

			return true;
		},

		/**
		 * Testing browser for touch support
		 *
		 * @return     {Boolean}  Returns true if touch is supported.
		 */
		supportsTouch: function() {
			return "ontouchend" in document;
		},
		
		/**
		 * Testing browser for canvas support.
		 *
		 * @return     {Boolean}  Returns true if canvas is supported.
		 */
		supportsCanvas: function() {
			// check cache first
			if (cache.supportsCanvas != undefined) {
				return cache.supportsCanvas;
			}

			var elem = document.createElement("canvas");
			cache.supportsCanvas = !!(elem.getContext && elem.getContext("2d"));
			return cache.supportsCanvas;
		},
		
		/**
		 * Error reporting layer.
		 *
		 * @param      {String}  msg     The error message.
		 */
		error: function(msg) {
			// this.log("[ERROR] message: " + msg);
			throw new TypeError("[ERROR] message: " + msg);
		},

		/**
		 * console.log layer.
		 *
		 * @param      {String}  msg     The message.
		 */
		log: function(msg) {
			if (debug) {
				console.log("[" + msg + "]");
			}
		},

		/**
		 * Recursive deep copy.
		 *
		 * @param      {Object}  object  The target object
		 * @return     {Object}   The new copy.
		 */
		deepCopy: function(object) {
			if(!object || typeof(object) != "object" || object instanceof HTMLElement) {
				return object;
			} else if(object instanceof Array) {
				var copy = [];
				for (var i = 0; i < object.length; ++i) {
					copy[i] = this.deepCopy(object[i]);
				}
				return copy;
			} else {
				var copy = {};
				for(var i in object) {
					copy[i] = this.deepCopy(object[i]);
				}
				return copy;
			}
		},

		/**
		 * Determines if function.
		 *
		 * @param      {Object}   object  The object
		 * @return     {boolean}  True if function, False otherwise.
		 */
		isFunction: function(object) {
			// Support: Chrome <=57, Firefox <=52
			// In some browsers, typeof returns "function" for HTML <object> elements
			// (i.e., `typeof document.createElement( "object" ) === "function"`).
			// We don't want to classify *any* DOM node as a function.
			return typeof object === "function" && typeof object.nodeType !== "number";
		},

		/**
		 * Get global function by string. Supports namespaces.
		 * Example:
		 * var fn = stringToFunction("My.Name.Space.Foo");
		 * var foo = new fn(...args);
		 *
		 * @param      {String}  string  The string
		 * @return     {Object}  the function or null (on error).
		 */
		stringToFunction: function(string) {
			var names = string.split(".");

			var fn = (window || this);
			for (var i = 0, length = names.length; i < length; ++i) {
				fn = fn[names[i]];
			}

			if (typeof fn !== "function") {
				return null;
			}

			return fn;
		},

		/**
		 * Determines if plain object.
		 *
		 * @param      {Object}   object  The object
		 * @return     {boolean}  True if plain object, False otherwise.
		 */
		isPlainObject: function(object) {
			if (!object || object.toString() !== "[object Object]") {
				return false;
			}

			return true;
		},

		/**
		 * jQuery extend.
		 * https://github.com/jquery/jquery
		 *
		 * @return     {Object}  Returns the modified Object.
		 */
		extend: function() {
			var options, name, src, copy, copyIsArray, clone,
				target = arguments[ 0 ] || {},
				i = 1,
				length = arguments.length,
				deep = false;

			// Handle a deep copy situation
			if ( typeof target === "boolean" ) {
				deep = target;

				// Skip the boolean and the target
				target = arguments[ i ] || {};
				i++;
			}

			// Handle case when target is a string or something (possible in deep copy)
			if ( typeof target !== "object" && !this.isFunction( target ) ) {
				target = {};
			}

			// Extend jQuery itself if only one argument is passed
			if ( i === length ) {
				target = this;
				i--;
			}

			for ( ; i < length; i++ ) {

				// Only deal with non-null/undefined values
				if ( ( options = arguments[ i ] ) != null ) {

					// Extend the base object
					for ( name in options ) {
						src = target[ name ];
						copy = options[ name ];

						// Prevent never-ending loop
						if ( target === copy ) {
							continue;
						}

						// Recurse if we're merging plain objects or arrays
						if ( deep && copy && ( this.isPlainObject( copy ) ||
							( copyIsArray = Array.isArray( copy ) ) ) ) {

							if ( copyIsArray ) {
								copyIsArray = false;
								clone = src && Array.isArray( src ) ? src : [];

							} else {
								clone = src && this.isPlainObject( src ) ? src : {};
							}

							// Never move original objects, clone them
							target[ name ] = this.extend( deep, clone, copy );

						// Don't bring in undefined values
						} else if ( copy !== undefined ) {
							target[ name ] = copy;
						}
					}
				}
			}

			// Return the modified object
			return target;
		},

		/**
		 * Formated Array String.
		 *
		 * @param      {Array}   array   The Array.
		 * @return     {String}  Returns formated String.
		 */
		formatArray: function(array) {
			if (Array.isArray(array)) {
				var str = '[';
				for (var i = 0; i < array.length; ++i) {
					if (i > 0) {
						str += ', ';
					}

					str += this.formatArray(array[i]);
				}
				str += ']';
				return str;
			} else {
				return array;
			}
		}
	}
}();