/**
 * Loader is a loader with a queue and event system (which notifies the
 * subscribers on success / error).
 *
 * @class      Loader (name)
 * @return     {Object}  Reutns public methods.
 */
Lucid.Loader = function() {
    // private variables
    var instance = null;
    var loaded = {};
    var loadingQueue = [];
    var loading = false;

/**
 * Public methods
 */

    return {
        /**
         * Add a new LoaderItem to the loading queue. This also starts
         * loading the queue.
         *
         * @param      {LoaderItem}  item    The LoaderItem.
         * @return     {Boolean}           Returns true on success.
         */
        add: function(item) {
            if (!item.isValid()) {
                Lucid.Utils.error("Loader @ add: can not add invalid item to Loader - id: " + item.id);
                return false;
            }

            // TODO: not sure if it makes sense to check if the item IS already
            // loaded. in some cases you may want to load the same file again.
            // For now we just check if its already in the loading queue:
            if (!loadingQueue.contains(item)) {
                Lucid.Utils.log("Loader @ add: item added to Loader - id: " + item.id);
                loadingQueue.push(item);
            }

            if (!loading) {
                this.loadNext();
            }

            return true;
        },

        /**
         * Load next LoaderItem in queue.
         */
        loadNext: function() {
            // check if queue is empty
            if (loadingQueue.length < 1) {
                Lucid.Utils.log("Loader @ loadNext: finished loading. Queue is empty");
                loading = false;
                // publish
                $(document).trigger(Lucid.Loader.EVENT.READY);

                // leave this place
                return;
            }

            // set state
            loading = true;

            // publish
            $(document).trigger(Lucid.Loader.EVENT.LOADING, [loadingQueue]);

            // get item
            var item = loadingQueue.pop();

            Lucid.Utils.log("Loader @ loadNext: attempting to load item - id: " + item.id + " filePath: " + item.filePath);

            // the success function
            function success(data) {
                Lucid.Utils.log("Loader @ loadNext: success loading item - id: " + item.id);

                item.setData(data);
                item.setLoaded(true);

                loaded[item.id] = item;

                $(document).trigger(item.eventSuccessName, [item]);
                this.loadNext();
            }

            // the error function
            function error(data) {
                Lucid.Utils.log("Loader @ loadNext: error loading item - id: " + item.id);
                $(document).trigger(item.eventErrorName, [item]);
                this.loadNext();
            }

            // different treatment for different dataTypes
            if (item.dataType == Lucid.Loader.TYPE.IMAGE) {
                var image = new Image();
                image.onload = success.bind(this);
                image.onerror = error.bind(this);
                image.src = item.filePath;
            } else {
                $.loadFile(item.filePath, item.dataType, success.bind(this), error.bind(this));
            }
        },

        /**
         * Get already loaded LoaderItem by id.
         *
         * @param      {String}           id      The identifier.
         * @return     {LoaderItem|null}  Returns LoaderItem if found -
         *                                otherwise null.
         */
        get: function(id) {
            if (id in loaded) {
                return loaded[id];
            }

            return null;
        },

        /**
         * Determines if loading.
         *
         * @return     {Boolean}  True if loading, False otherwise.
         */
        isLoading: function() {
            return loading;
        }
    };
}();

// event constants
Lucid.Loader.EVENT = {
    LOADING: "loading",
    READY: "ready"
};

// type constants
Lucid.Loader.TYPE = {
    XML: "xml",
    SCRIPT: "script",
    IMAGE: "image",
    DEFAULT: "application/x-www-form-urlencoded; charset=UTF-8"
};

/**
 * Item for the Loader. Use Loader.add(item).
 *
 * @type       {Loader}
 */
Lucid.LoaderItem = BaseComponent.extend({
    // config variables and their default values
    id: null, // id - required
    filePath: null, // filePath - required
    dataType: Lucid.Loader.TYPE.DEFAULT, // data type - use Lucid.Loader.TYPE.XXX
    eventSuccessName: null, // event name which will be triggered on success - required
    eventErrorName: null, // event name which will be triggered on error - required
    extraData: null, // custom extra data which you can pass through

    // local variables
    loaded: false,
    data: null,

    /**
      * Automatically called when instantiated.
      *
      * @param      {Object}   config  The configuration.
      * @return     {Boolean}  Returns true on success.
      */
    init: function(config) {
        this.componentName = "LoaderItem";
        
        this._super(config);

        return true;
    },

    setLoaded: function(value) {
        this.loaded = value;
    },

    /**
     * Sets the data.
     *
     * @param      {Object}  value   The value which then will proceeded -
     *                               depending on dataType.
     */
    setData: function(value) {
        if (this.dataType == Lucid.Loader.TYPE.XML) {
            value = $(value);
        } else if (this.dataType == Lucid.Loader.TYPE.IMAGE) {
            value = value.target;
        }

        this.data = value;
    },

    /**
     * Gets the data.
     *
     * @return     {Object}  The data.
     */
    getData: function() {
        return this.data;
    },

    /**
     * Determines if valid.
     *
     * @return     {Boolean}  True if valid, False otherwise.
     */
    isValid: function() {
        return this.id != null && this.filePath != null && this.eventSuccessName != null && this.eventErrorName != null;
    }
});