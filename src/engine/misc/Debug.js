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
 * Simple debugging helper.
 *
 * @class      Event (name)
 * @return     {Object}  Public methods.
 */
Lucid.Debug = function() {
	// local variables
	var enabled = false;
	var layerDebug = null;

	var engineFPS = false;
	var enginePanic = false;
	var mapTileSizeGrid = false;
	var mapCollidingTiles = false;
	var entityHitBox = false;
	var aiSightRadius = false;
	var aiLineOfSight = false;

	function enableDebug() {
		if (!enabled && Lucid.data && Lucid.data.engine) {
			layerDebug = new Lucid.BaseLayer({
				componentName: "LayerEngineDebug",
				id: "layer-engine-debug",
				type: Lucid.BaseLayer.TYPE.UI,
				z: 99,
				active: true
			});

			Lucid.data.engine.addLayer(layerDebug);

			enabled = true;
		}
	}

/**
 * Public methods
 */

	return {

		getEnabled: function() {
			return enableDebug;
		},

		getLayerDebug: function() {
			enableDebug();
			return layerDebug;
		},

	// CONFIG GETTER & SETTER

		// engine fps

		setEngineFPS: function(value) {
			if (value) {
				enableDebug();
			}
			engineFPS = value;
		},

		getEngineFPS: function() {
			return engineFPS;
		},

		// engine panic

		setEnginePanic: function(value) {
			if (value) {
				enableDebug();
			}
			enginePanic = value;
		},

		getEnginePanic: function() {
			return enginePanic;
		},

		// map tile size grid

		setMapTileSizeGrid: function(value) {
			if (value) {
				enableDebug();
			}
			mapTileSizeGrid = value;
		},

		getMapTileSizeGrid: function() {
			return mapTileSizeGrid;
		},

		// map colliding tiles

		setMapCollidingTiles: function(value) {
			if (value) {
				enableDebug();
			}
			mapCollidingTiles = value;
		},

		getMapCollidingTiles: function() {
			return mapCollidingTiles;
		},

		// entity hig box

		setEntityHitBox: function(value) {
			if (value) {
				enableDebug();
			}
			entityHitBox = value;
		},

		getEntityHitBox: function() {
			return entityHitBox;
		},

		// ai sight radius

		setAISightRadius: function(value) {
			if (value) {
				enableDebug();
			}
			aiSightRadius = value;
		},

		getAISightRadius: function() {
			return aiSightRadius;
		},

		// ai line of sight

		setAILineOfSight: function(value) {
			if (value) {
				enableDebug();
			}
			aiLineOfSight = value;
		},

		getAILineOfSight: function() {
			return aiLineOfSight;
		}
	};
}();