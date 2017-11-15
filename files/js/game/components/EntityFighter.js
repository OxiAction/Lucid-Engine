/**
* Game custom EntityFighter - extends BaseEntity.
*/
var EntityFighter = Lucid.BaseEntity.extend({
    // config variables and their default values
    // ...

    // local variables
    animInterval: null,
    animCounter: 0,
    
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

        this.animInterval = setInterval(this.updateAnim.bind(this), 500);

        this.updateAnim();

        return true;
    },

    updateAnim: function() {
      // 0 - 1
      if (this.animCounter == 2) {
        this.animCounter = 0;
      }
      
      if (this.animCounter == 0) {
        this.sourceX = 0;
      } else if (this.animCounter == 1) {
        this.sourceX = this.width * 2;
      }

      this.animCounter++;
    },

    loadTileSet: function(filePath) {
      
      if (filePath == undefined) {
        filePath = "playground/entity_fighter.png";
      }

      this._super(filePath);
    },

    draw: function(delta, config) {
      return this._super(delta, config);
    },

    tileSetLoaded: function(event, loaderItem) {
      this._super(event, loaderItem);
    },

    destroy: function() {
      if (this.animInterval) {
        clearInterval(this.animInterval);
        this.animInterval = null;
      }

      this._super();
    }
});
