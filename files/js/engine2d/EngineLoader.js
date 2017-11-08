/**
 * EngineLoader is a loader with a queue and event system (which notifies the
 * observers on success / error).
 *
 * @class      EngineLoader (name)
 * @return     {boolean}  Returns true on success.
 */
function EngineLoader() {
    var self = this;

    var loaded = {};
    var loadingQueue = [];
    var loading = false;

    /**
     * Add a new EngineLoaderItem to the loading queue. This also starts loading
     * the queue.
     *
     * @param      {EngineLoaderItem}  item    The EngineLoaderItem.
     * @return     {boolean}           Returns true on success.
     */
    this.add = function(item) {
        if (!item.isValid()) {
            EngineUtils.error("can not add invalid item to EngineLoader - id: " + item.getID());
            return false;
        }

        // TODO: not sure if it makes sense to check if the item IS already
        // loaded. in some cases you may want to load the same file again

        if (!loadingQueue.contains(item)) {
            EngineUtils.log("item added to EngineLoader - id: " + item.getID());
            loadingQueue.push(item);
        }

        if (!loading) {
            self.loadNext();
        }

        return true;
    }

    /**
     * Load next EngineLoaderItem in queue.
     */
    this.loadNext = function() {
        if (loadingQueue.length < 1) {
            EngineUtils.log("EngineLoader has finished loading. Queue is empty");
            loading = false;
            $(document).trigger(EngineLoader.EVENT.READY);
            return;
        }

        loading = true;
        $(document).trigger(EngineLoader.EVENT.LOADING, [loadingQueue]);

        var item = loadingQueue.pop();
        var id = item.getID();

        EngineUtils.log("EngineLoader attempting to load item - id: " + id + " filePath: " + item.getFilePath());

        $.loadFile(item.getFilePath(), item.getDataType(), function(data) {
            EngineUtils.log("EngineLoader success loading item - id: " + id);

            item.setData(data);
            item.setLoaded(true);

            loaded[id] = item;

            $(document).trigger(item.getEventSuccessName(), [item]);
            self.loadNext();
        }, function() {
            EngineUtils.log("EngineLoader error loading item - id: " + id);
            $(document).trigger(item.getEventErrorName(), [item]);
            self.loadNext();
        });
    }

    /**
     * Get already loaded EngineLoaderItem by id.
     *
     * @param      {string}                 id      The identifier.
     * @return     {EngineLoaderItem|null}  Returns EngineLoaderItem if found -
     *                                      otherwise null.
     */
    this.get = function(id) {
        if (id in loaded) {
            return loaded[id];
        }

        return null;
    }

    // event constants
    this.EVENT = {
        LOADING: "loading",
        READY: "ready"
    }

    return true;
}

/**
 * Item for the EngineLoader. Use EngineLoader.add(item).
 *
 * @class      EngineLoaderItem (name)
 * @param      {Object}   config  The configuration.
 * @return     {boolean}  Returns true on success.
 */
function EngineLoaderItem(config) {
    var configDefault = {
        id: null, // id - required
        filePath: null, // filePath - required
        dataType: "application/x-www-form-urlencoded; charset=UTF-8", // data type - e.g. "script", "xml" - see
                                                                      // http://api.jquery.com/jquery.ajax/
        eventSuccessName: null, // event name which will be triggered on success - required
        eventErrorName: null, // event name which will be triggered on error - required
        extraData: null // custom extra data which you can pass through
    };

    var config = $.extend({}, configDefault, config);

    var self = this;

    var id = config.id;
    var filePath = config.filePath;
    var dataType = config.dataType;
    var success = config.success;
    var error = config.error;
    var eventSuccessName = config.eventSuccessName;
    var eventErrorName = config.eventErrorName;
    var extraData = config.extraData;

    var loaded = false;
    var data = null;

    this.getID = function() {
        return id;
    }

    this.setID = function(value) {
        id = value;
    }

    this.getFilePath = function() {
        return filePath;
    }

    this.getDataType = function() {
        return dataType;
    }

    this.getEventSuccessName = function() {
        return eventSuccessName;
    }

    this.getEventErrorName = function() {
        return eventErrorName;
    }

    this.getExtraData = function() {
        return extraData;
    }

    this.setExtraData = function(value) {
        extraData = value;
    }

    this.getLoaded = function() {
        return loaded;
    }

    this.setLoaded = function(value) {
        loaded = value;
    }

    this.getData = function() {
        return data;
    }

    this.setData = function(value) {
        if (dataType == "xml") {
            value = $(value);
        }

        data = value;
    }

    this.isValid = function() {
        return id != null && filePath != null && eventSuccessName != null && eventErrorName != null;
    }

    return true;
}