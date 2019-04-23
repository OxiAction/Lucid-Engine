/**
 * Lucid Engine
 * Copyright (C) 2019 Michael Schreiber
 * 
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 * 
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

/**
 * Item for the Loader. Use Loader.add(item).
 */
Lucid.LoaderItem = Lucid.BaseComponent.extend({
	// config variables and their default values
	id: null, // [required] unique identifier
	filePath: null, // [required] filePath
	eventSuccessName: null, // [required] event name which will be triggered on success
	eventErrorName: null, // [required] event name which will be triggered on error
	dataType: Lucid.Loader.TYPE.DEFAULT, // data type - use Lucid.Loader.TYPE.XXX
	extraData: null, // custom extra data which you can pass through

	// local variables
	loaded: false,
	data: null, // the actual content of the loaded item - see setData

	/**
		* Automatically called when instantiated.
		*
		* @param      {Object}   config  The configuration.
		* @return     {Boolean}  Returns true on success.
		*/
	init: function(config) {
		this.checkSetComponentName("Lucid.LoaderItem");
		
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