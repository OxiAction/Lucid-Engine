/**
* Game custom EntityFighter - extends Entity.
*/
var EntityFighter = Lucid.Entity.extend({
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
        this.componentName = "EntityFighter";

        this._super(config);

        this.width = 32;
        this.height = 48;

        return true;
    },

    loadTileSet: function(filePath) {
      if (filePath == undefined) {
        filePath = "playground/entity_fighter.png";
      }

      this._super(filePath);
    },

    tileSetLoaded: function(event, loaderItem) {
      this._super(event, loaderItem);
    }
});