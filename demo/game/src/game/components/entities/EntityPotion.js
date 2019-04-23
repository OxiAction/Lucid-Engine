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
var Game = Game || {};

/**
* Game custom EntityFighter - extends BaseEntity.
*/
Game.EntityPotion = Lucid.BaseEntity.extend({
	// config variables and their default values
	// ...

	// local variables
	// ...

	init: function(config) {
		this.componentName = "Game.EntityPotion";
		this.width = 16;
		this.height = 17;
		this.sightRadius = 400;
		this.assetFilePath = "assets/potion.png";
		
		this._super(config);

		return true;
	},

	renderUpdate: function(delta) {
		this._super(delta);
	},

	renderDraw: function(interpolationPercentage) {
		this._super(interpolationPercentage);
	},

	destroy: function() {
		this._super();
	}
});