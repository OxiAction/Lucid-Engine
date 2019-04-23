// namespace
var Lucid = Lucid || {};

/**
 * Publish / subscribe pattern event system.
 * 
 * Example (simple):
 * 
 * Lucid.Event.bind("myevent", function(eventName, argument1, argument2, ...) { ... });
 * Lucid.Event.trigger("myevent", argument1, argument2, ...);
 * Lucid.Event.unbind("myevent");
 * 
 * Namespace example:
 * 
 * Lucid.Event.bind("myevent.namespace1", function(eventName, argument1, argument2, ...) { ... });
 * // this will also trigger all bindings with "myevent.XXXXXX"!
 * Lucid.Event.trigger("myevent", argument1, argument2, ...);
 * Lucid.Event.unbind("myevent.namespace1");
 * 
 * @class      Event (name)
 * @return     {Object}  Public methods.
 */
Lucid.Event = function() {
	// local variables
	var events = {};

/**
 * Public methods
 */

	return {
		getEvents: function() {
			return events;
		},

		bind: function(eventName, callback) {
			if (!events[eventName]) {
				events[eventName] = [];
			}
			
			events[eventName].push(callback);
		},

		unbind: function(eventName, callback){
			if(eventName in events === false) {
				return;
			}

			if (callback == undefined) {
				delete events[eventName];
			} else {
				for (var i = 0; i < events[eventName].length; ++i) {
					if (events[eventName][i].toString() == callback.toString()) {
						events[eventName].splice(i, 1);
					}
				}
			}

			// DEPRECATED: This does not work with bound functions!
			// 
			// events[eventName].splice(events[eventName].indexOf(callback), 1);
		},
		
		trigger: function(eventName /* , args... */){
			// check all events entries...
			for (var orgPropertyName in events) {
				// ...save original property name...
				var propertyName = orgPropertyName;

				// ...check for namespace bindings - example:
				// Lucid.Event.bind("foo.namespace1")
				// so we check for a dot.
				var dotIndex = orgPropertyName.indexOf(".");
				// but only if our trigger eventName does NOT include a dot!
				if (dotIndex != -1 && eventName.indexOf(".") == -1) {
					// cut down propertyName to the part BEFORE the dot
					propertyName = orgPropertyName.substr(0, dotIndex); 
				}

				// now lets check if the propertyName is the same as the eventName
				if (propertyName == eventName && events[orgPropertyName]) {
					var i = 0;
					while(events[orgPropertyName]) {
						var callback = events[orgPropertyName][i];
						if (callback) {
							// pass through parameters - starting with the eventName and
							// followed by the custom arguments
							callback.apply(this, arguments);
						}

						++i;

						// IF (at runtime) the events[orgPropertyName] gets null (for whatever reason)
						// OR if we have run through all entries
						// -> stop!
						if (!events[orgPropertyName] || i >= events[orgPropertyName].length) {
							break;
						}
					}
				}
			}
		}
	};
}();