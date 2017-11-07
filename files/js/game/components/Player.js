/**
* Game custom Player - extends Entity.
*/
var Player = Entity.extend({
    // config variables and their default values
    // ...

    // local variables
    // ...
    
    /**
      * Automatically called when instantiated.
      *
      * @param      {Object}   config  The configuration.
      * @return     {boolean}  Returns true on success.
      */
    init: function(config) {
        this.componentName = "Player";

        this._super(config);

        return true;
    }
});