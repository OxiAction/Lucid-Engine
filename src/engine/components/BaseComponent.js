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

// namespace
var Lucid = Lucid || {};

/**
 * Engine BaseComponent
 */
Lucid.BaseComponent = Class.extend({
	// config variables and their default values
	componentName: null, // [required] a name for this component
	id: null, // identifier
	active: true, // determines if this component is active or not
	map: null, // reference to the current map - use checkSetMap()
	camera: null, // reference to the current camera - use checkSetCamera()
	engine: null, // reference to the current engine - use checkSetEngine()

	// local variables
	componentNamespace: null, // namespace - e.g. required for publish / subscribe pattern (events)

	/**
	 * Automatically called when instantiated.
	 *
	 * @param      {Object}   config  The configuration.
	 * @return     {Boolean}  Returns true on success.
	 */
	init: function(config){
		// write target, default values target, new values (overrides default values)
		Lucid.Utils.extend(this, this, config);

		if (!this.componentName) {
			Lucid.Utils.error("Lucid.BaseComponent @ init: error - you have not defined a componentName!");
			return false;
		} else {
			this.setComponentName(this.componentName);
		}

		Lucid.Utils.log(this.componentName + " @ init");

		return true;
	},

	/**
	 * Checks if this.map is defined. If not, tries to set this.map to
	 * Lucid.data.engine.getMap(). On fail -> error.
	 *
	 * @return     {Boolean}  Returns true on success.
	 */
	checkSetMap: function() {
		if (!this.map) {
			var map = Lucid.data.engine.getMap();
			if (!map) {
				Lucid.Utils.error(this.componentName + " @ checkSetMap: this.map AND Lucid.data.engine.getMap() is null!");
				return false;
			} else {
				this.setMap(map);
			}
		}

		return true;
	},

	/**
	 * Checks if this.camera is defined. If not, tries to set this.camera to
	 * Lucid.data.engine.getCamera(). On fail -> error.
	 *
	 * @return     {Boolean}  Returns true on success.
	 */
	checkSetCamera: function() {
		if (!this.camera) {
			var camera = Lucid.data.engine.getCamera();
			if (!camera) {
				Lucid.Utils.error(this.componentName + " @ checkSetCamera: this.camera AND Lucid.data.engine.getCamera() is null!");
				return false;
			} else {
				this.setCamera(camera);
			}
		}

		return true;
	},

	/**
	 * Checks if this.engine is defined. If not, tries to set this.engine to
	 * Lucid.data.engine. On fail -> error.
	 *
	 * @return     {Boolean}  Returns true on success.
	 */
	checkSetEngine: function() {
		if (!this.engine) {
			var engine = Lucid.data.engine;
			if (!engine) {
				Lucid.Utils.error(this.componentName + " @ checkSetEngine: this.engine AND Lucid.data.engine is null!");
				return false;
			} else {
				this.setEngine(engine);
			}
		}

		return true;
	},

	/**
	 * Destroys the BaseComponent and all its corresponding objects.
	 *
	 * @return     {Boolean}  Returns true on success.
	 */
	destroy: function() {
		this.map = null;
		this.camera = null;
		this.engine = null;

		return true;
	},

	/**
	 * Sets the active state.
	 *
	 * @param      {Boolean}  active  The value
	 */
	setActive: function(active) {
		this.active = active;
	},

	/**
	 * Gets the active.
	 *
	 * @return     {Boolean}  The active state.
	 */
	getActive: function() {
		return this.active;
	},

	/**
	 * Sets the map.
	 *
	 * @param      {Map}  map	The map
	 */
	setMap: function(map) {
		this.map = map;
	},

	/**
	 * Gets the map.
	 *
	 * @return     {Map}  The map.
	 */
	getMap: function() {
		return this.map;
	},

	/**
	 * Sets the camera.
	 *
	 * @param      {Camera}  camera  The camera
	 */
	setCamera: function(camera) {
		this.camera = camera;
	},

	/**
	 * Gets the camera.
	 *
	 * @return     {Camera}  The camera.
	 */
	getCamera: function() {
		return this.camera;
	},

	/**
	 * Sets the engine.
	 *
	 * @param      {Engine}  engine  The engine
	 */
	setEngine: function(engine) {
		this.engine = engine;
	},

	/**
	 * Gets the engine.
	 *
	 * @return     {Engine}  The engine.
	 */
	getEngine: function() {
		return this.engine;
	},

	/**
	 * Sets the component name.
	 *
	 * @param      {String}  componentName  The component name
	 */
	setComponentName: function(componentName) {
		this.componentName = componentName;
		this.componentNamespace = "." + componentName;
	},

	/**
	 * Sets the component name only if not set yet.
	 *
	 * @param      {String}  componentName  The component name.
	 */
	checkSetComponentName: function(componentName) {
		if (!this.componentName) {
			this.setComponentName(componentName);
		}
	}
});