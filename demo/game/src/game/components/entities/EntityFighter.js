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
Game.EntityFighter = Lucid.BaseEntity.extend({
	// config variables and their default values
	// ...

	// local variables
	animInterval: null,
	animCounter: 0,

	showInformation: true, // render informations
	healthPointsMaximum: 100,
	healthPointsCurrent: 60,
	manaPointsMaximum: 50,
	manaPointsCurrent: 40,

	init: function(config) {
		this.componentName = "Game.EntityFighter";
		this.width = 32;
		this.height = 48;
		this.speed = 50;
		this.minimumAttackRange = 60;
		this.sightRadius = 400;
		this.assetFilePath = "assets/entity_fighter.png";
		
		this._super(config);

		// randomize values :D
		this.healthPointsCurrent = Math.random() * (this.healthPointsMaximum - 5) + 5;
		this.manaPointsCurrent = Math.random() * (this.manaPointsMaximum - 5) + 5;
		
		this.animInterval = setInterval(this.updateAnim.bind(this), 500);
		this.updateAnim();

		Lucid.Event.bind(Lucid.BaseEntity.EVENT.COLLISION + this.componentNamespace, this.handleCollision.bind(this));

		var ai = new Lucid.AI({
			originEntity: this
		});

		var fsm = new Game.AI.Fighter.FSM({
			ai: ai
		});

		ai.setFSM(fsm);

		this.setAI(ai);

		return true;
	},

	handleCollision: function(eventName, originEntity, item, collisionData) {
		if (originEntity != this) {
			return;
		}

		if (item.componentName == "Game.EntityPotion") {
			var layerEntities = this.engine.getLayerEntities();
			if (layerEntities) {
				layerEntities.removeEntity(item.id);
			}
		}
	},

	updateAnim: function() {
		if (!this.getActive()) {
			return;
		}

		// 0 - 1
		if (this.animCounter == 2) {
			this.animCounter = 0;
		}

		if (this.animCounter == 0) {
			this.assetX = 0;
		} else if (this.animCounter == 1) {
			this.assetX = this.width * 2;
		}

		this.animCounter++;
	},

	renderUpdate: function(delta) {
		if (this.healthPointsCurrent <= 0) {
			var layerEntities = this.engine.getLayerEntities();
			if (layerEntities) {
				layerEntities.removeEntity(this.id);
			}
		}

		this._super(delta);
	},

	renderDraw: function(interpolationPercentage) {
		switch (this.dir) {
			case Lucid.BaseEntity.DIR.RIGHT:
			this.assetY = 96;
			break;

			case Lucid.BaseEntity.DIR.LEFT:
			this.assetY = 48;
			break;

			case Lucid.BaseEntity.DIR.UP:
			this.assetY = 144;
			break;

			default:
			this.assetY = 0;
		}

		this._super(interpolationPercentage);
	},

	destroy: function() {
		if (this.animInterval) {
			clearInterval(this.animInterval);
			this.animInterval = null;
		}
		
		Lucid.Event.unbind(Lucid.BaseEntity.EVENT.COLLISION + this.componentNamespace);

		this._super();
	}
});