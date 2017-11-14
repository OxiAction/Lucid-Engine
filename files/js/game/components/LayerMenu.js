/**
* Game custom menu Layer - extends Layer.
*/
var LayerMenu = Lucid.BaseLayer.extend({
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
    }
});