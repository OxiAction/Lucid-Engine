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
        this.componentName = "Player";

        this._super(config);

        return true;
    },

    loadTileSet: function(filePath) {
      if (filePath == undefined) {
        filePath = "playground/entity_fighter.png";
      }

      this.tileSize.width = 32;
      this.tileSize.height = 48;

      this._super(filePath);
    },

    tileSetLoaded: function(event, loaderItem) {
      this._super(event, loaderItem);
    }
});