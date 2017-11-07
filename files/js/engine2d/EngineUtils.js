/* Simple JavaScript Inheritance
 * By John Resig
 * https://johnresig.com/blog/simple-javascript-inheritance/
 * MIT Licensed.
 */
// Inspired by base2 and Prototype
(function(){
  var initializing = false, fnTest = /xyz/.test(function(){xyz;}) ? /\b_super\b/ : /.*/;
 
  // The base Class implementation (does nothing)
  this.Class = function(){};
   
  // Create a new Class that inherits from this class
  Class.extend = function(prop) {
    var _super = this.prototype;
     
    // Instantiate a base class (but only create the instance,
    // don't run the init constructor)
    initializing = true;
    var prototype = new this();
    initializing = false;
     
    // Copy the properties over onto the new prototype
    for (var name in prop) {
      // Check if we're overwriting an existing function
      prototype[name] = typeof prop[name] == "function" && 
        typeof _super[name] == "function" && fnTest.test(prop[name]) ?
        (function(name, fn){
          return function() {
            var tmp = this._super;
             
            // Add a new ._super() method that is the same method
            // but on the super-class
            this._super = _super[name];
             
            // The method only need to be bound temporarily, so we
            // remove it when we're done executing
            var ret = fn.apply(this, arguments);        
            this._super = tmp;
             
            return ret;
          };
        })(name, prop[name]) :
        prop[name];
    }
     
    // The dummy class constructor
    function Class() {
      // All construction is actually done in the init method
      if ( !initializing && this.init )
        this.init.apply(this, arguments);
    }
     
    // Populate our constructed prototype object
    Class.prototype = prototype;
     
    // Enforce the constructor to be what we expect
    Class.prototype.constructor = Class;
 
    // And make this class extendable
    Class.extend = arguments.callee;
     
    return Class;
  };
})();

function EngineUtils() {
    var cache = {};
    var debug = 0;

    /**
    * enable / disable debug mode
    *
    * value:             bool
    */
    this.setDebug = function(value) {
        debug = value;
    }

    /**
    * testing browser for touch support
    */
    this.supportsTouch = function() {
    	return "ontouchend" in document;
    }

    /**
    * testing browser for canvas support
    */
    this.supportsCanvas = function() {
        // check cache first
    	if (cache.supportsCanvas != undefined) {
    		return cache.supportsCanvas;
    	}

		var elem = document.createElement("canvas");
		cache.supportsCanvas = !!(elem.getContext && elem.getContext("2d"));
		return cache.supportsCanvas;
    }

    /**
    * error reporting
    *
    * msg:             object
    */
    this.error = function(msg) {
        this.log("[ERROR] message: " + msg);
    }

    /**
    * console.log layer
    *
    * msg:             object
    */
    this.log = function(msg) {
        if (debug) {
            console.log("[" + msg + "]");
        }
    }

    // prevent console.log errors on older browsers
    if (typeof console == "undefined") {
        window.console = {
            log: function () {
                // do nothing
            }
        };
        console.warn = console.debug = console.log;
    }

    // prototyping: extending js defaults stuff

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

    Array.prototype.erase = function(item) {
        for(var i = this.length; --i;) {
            if(this[i] === item) {
                this.splice(i, 1);
            }
        }
        return this;
    };

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

    // custom jQuery scripts

    /**
    * used for loading js scripts
    *
    * url:              string the file path
    * success:          function
    * error:            function
    */
    $.loadScript = function (url, success, error) {
        jQuery.ajax({
            "url": url,
            "dataType": "script",
            "success": success,
            "error": error,
            "async": true
        });
    }

    /**
    * used for reading GET parameters value
    *
    * name:             string
    * return:           string - value of the param
    */
    $.urlParam = function(name){
        var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
        if (results==null){
           return null;
        }
        else{
           return decodeURI(results[1]) || 0;
        }
    }
}