/**
 * Item for the Loader. Use Loader.add(item).
 */
Lucid.LoaderItem = Lucid.BaseComponent.extend({
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
	 * @param      {Object}          data     The data which then will proceeded -
	 *                                        depending on dataType.
	 * @param      {XMLHttpRequest}  request  The XMLHttpRequest Object.
	 */
	setData: function(request) {
		var data = null;
		if (this.dataType == Lucid.Loader.TYPE.XML) {
				data = request.responseXML;
		} else if (this.dataType == Lucid.Loader.TYPE.IMAGE) {
			data = request.target;
		} else {
			data = request;
		}

		this.data = data;
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