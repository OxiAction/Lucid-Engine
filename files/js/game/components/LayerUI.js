/**
* Game custom ui Layer - extends Layer.
*/
var LayerUI = Lucid.Layer.extend({
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
        this.componentName = "LayerMenu";

        this._super(config);

        return true;
    },

    /**
     * Update step.
     *
     * @param      {Object}  config  The configuration.
     */
    update: function(config) {
    	// TODO: implement override stuff here!

      this._super(config);
    }
});