// namespace
var Lucid = Lucid || {};

/**
 * Pathfinding.
 *
 * @class      Pathfinding (name)
 * @return     {Object}  Returns public methods.
 */
Lucid.Pathfinding = function() {
	// initialize and config EasyStar.js
	var easystar = new EasyStar.js();
	easystar.enableDiagonals();			// this should be fine and makes animation a bit smoother
	easystar.disableCornerCutting(); 	// we dont want to bug through objects!
	easystar.setAcceptableTiles([0]); 	// use zero values in the array as valid (walkable) tiles

/**
 * Public methods
 */

	return {
		setGrid: function(grid) {
			easystar.setGrid(grid);
		},

		findPath: function(startX, startY, endX, endY, callback) {
			return easystar.findPath(startX, startY, endX, endY, callback);
		},

		calculate: function() {
			easystar.calculate();
		}
	}
}();