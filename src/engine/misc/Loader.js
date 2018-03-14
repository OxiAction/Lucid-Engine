// namespace
var Lucid = Lucid || {};

/**
 * Loader is a loader with a queue and event system (which notifies the
 * subscribers on success / error).
 *
 * @class      Loader (name)
 * @return     {Object}  Returns object with public methods.
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
			// Possible solution: A variable "cache" which can be altered on demand.
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
					Lucid.Event.trigger(Lucid.Loader.EVENT.READY);

					// leave this place
					return;
			}

			// set state
			loading = true;

			// publish
			Lucid.Event.trigger(Lucid.Loader.EVENT.LOADING, loadingQueue);

			// get item
			var item = loadingQueue.pop();

			Lucid.Utils.log("Loader @ loadNext: attempting to load item - id: " + item.id + " filePath: " + item.filePath);

			// the success function
			function success(request) {
					Lucid.Utils.log("Loader @ loadNext: success loading item - id: " + item.id);

					item.setData(request);
					item.setLoaded(true);

					loaded[item.id] = item;

					Lucid.Event.trigger(item.eventSuccessName, item);
					this.loadNext();
			}

			// the error function
			function error(request) {
					Lucid.Utils.log("Loader @ loadNext: error loading item - id: " + item.id);
					Lucid.Event.trigger(item.eventErrorName, item);
					this.loadNext();
			}

			// different treatment for different dataTypes
			if (item.dataType == Lucid.Loader.TYPE.IMAGE) {
					var image = new Image();
					image.onload = success.bind(this);
					image.onerror = error.bind(this);
					image.src = item.filePath;
			} else {
					Lucid.Utils.loadFile(item.filePath, item.dataType, success.bind(this), error.bind(this));
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