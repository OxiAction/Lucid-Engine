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
 * Math related util functions.
 *
 * @class      Math (name)
 * @return     {Object}  Returns public methods.
 */
Lucid.Math = function() {
	// local variables
	// ...

/**
 * Public methods
 */

	return {
		/**
		 * Tests if point is inside circle.
		 *
		 * @param      {Object}  point   Data Object for point. Required
		 *                               properties: x, y
		 * @param      {Object}  circle  Data Object for circle. Required
		 *                               properties: x (center), y (center),
		 *                               radius
		 * @return     {number}  Returns true if point is inside circle.
		 */
		getPointInCircle: function(point, circle) {
			return Math.sqrt((point.x - circle.x) * (point.x - circle.x) + (point.y - circle.y) * (point.y - circle.y)) <= circle.radius;
		},

		/**
		 * Checks if two line1 intersects with line2 at some point.
		 *
		 * http://paulbourke.net/geometry/pointlineplane/
		 *
		 * Section on website: Intersection point of two line segments in 2
		 * dimensions
		 *
		 * Notes:
		 * - The denominators for the equations for ua and ub are the same.
		 *
		 * - If the denominator for the equations for ua and ub is 0 then the
		 *   two lines are parallel.
		 *
		 * - If the denominator and numerator for the equations for ua and ub
		 *   are 0 then the two lines are coincident.
		 *
		 * - The equations apply to lines, if the intersection of line segments
		 *   is required then it is only necessary to test if ua and ub lie
		 *   between 0 and 1. Whichever one lies within that range then the
		 *   corresponding line segment contains the intersection point. If both
		 *   lie within the range of 0 to 1 then the intersection point is
		 *   within both line segments.
		 *
		 * @param      {Object}  line1   Data Object for line1. Required
		 *                               properties: startX, startY, endX, endY.
		 * @param      {Object}  line2   Data Object for line2. Required
		 *                               properties: startX, startY, endX, endY.
		 * @return     {Object}  An Object which contains information about the
		 *                       intersection or null if nothing intersects. If
		 *                       Object.seg1 and Object.seg2 both are true, the
		 *                       lines actually overlap.
		 */
		getCollisionDataLineVsLine: function(line1, line2) {
			var denominator = (line2.endY - line2.startY) * (line1.endX - line1.startX) - (line2.endX - line2.startX) * (line1.endY - line1.startY);

			if (denominator == 0) {
				return null;
			}

			var unknwonLine1 = ((line2.endX - line2.startX) * (line1.startY - line2.startY) - (line2.endY - line2.startY) * (line1.startX - line2.startX)) / denominator;
			var unknownLine2 = ((line1.endX - line1.startX) * (line1.startY - line2.startY) - (line1.endY - line1.startY) * (line1.startX - line2.startX)) / denominator;

			return {
				x: line1.startX + unknwonLine1 * (line1.endX - line1.startX),
				y: line1.startY + unknwonLine1 * (line1.endY - line1.startY),
				seg1: unknwonLine1 >= 0 && unknwonLine1 <= 1,
				seg2: unknownLine2 >= 0 && unknownLine2 <= 1
			};
		},

		/**
		 * Simulates a (potential) collision between box1 and box2. In case of
		 * collision: Returns corrected position data for box1.
		 *
		 * @param      {Object}  box1    Data Object for box1. Required
		 *                               properties: x, y, width, height, lastX,
		 *                               lastY. lastX / lastY are required, to
		 *                               determine the direction box1 is coming
		 *                               from.
		 * @param      {Object}  box2    Data Object for box2. Required
		 *                               properties: x, y, width, height
		 * @return     {Object}  The collision data Object with properties: x
		 *                       (the new x-position for box1), y (the new
		 *                       y-position for box1), collisionX (true if there
		 *                       was x-axis collision), collisionY (true if
		 *                       there was y-axis collision), originFromDir (the
		 *                       original direction, box1 is coming from)
		 */
		getCollisionDataBoxVsBox: function(box1, box2) {
			var x = box1.x;
			var y = box1.y;
			var collisionX = false;
			var collisionY = false;
			var originFromDir = null;

			// is box1 overlapping box2?
			if (box1.x < box2.x + box2.width &&
				box1.x + box1.width > box2.x &&
				box1.y < box2.y + box2.height &&
				box1.y + box1.height > box2.y) {

				// box1 comes from the left side
				if (box1.lastX + box1.width <= box2.x) {
					x = box2.x - box1.width;
					collisionX = true;
					originFromDir = "left";
				}
				// box1 comes from the right side
				else if (box1.lastX >= box2.x + box2.width) {
					x = box2.x + box2.width;
					collisionX = true;
					originFromDir = "right";
				}

				// box1 comes from the up side
				if (box1.lastY + box1.height <= box2.y) {
					y = box2.y - box1.height;
					collisionY = true;
					originFromDir = "up";
				}
				// box1 comes from the down side
				else if (box1.lastY >= box2.y + box2.height) {
					y = box2.y + box2.height;
					collisionY = true;
					originFromDir = "down";
				}
			}

			return {
				x: x,
				y: y,
				collisionX: collisionX,
				collisionY: collisionY,
				originFromDir: originFromDir
			};
		},

		/**
		 * Translates entity x/y to grid based array indices.
		 *
		 * @param      {Object}  entity    Data Object for entity. Required
		 *                                 properties: x, y, halfWidth, halfHeight.
		 * @param      {Number}  tileSize  The tile size.
		 * @return     {Array}   The grid indices.
		 */
		getEntityToGridIndices: function(entity, tileSize) {
			return [Math.floor((entity.x + entity.halfWidth) / tileSize), Math.floor((entity.y + entity.halfHeight) / tileSize)];
		},

		/**
		 * Translates mouse x/y to grid based array indices.
		 *
		 * @param      {Number}  mouseX  The mouse x value.
		 * @param      {Number}  mouseY  The mouse y value.
		 * @param      {Map}     map     Map Object.
		 * @param      {Camera}  camera  Camera Object.
		 * @return     {Array}   The valid grid indices OR null (e.g. if out of
		 *                       grid bounds).
		 */
		getMouseToGridIndices: function(mouseX, mouseY, map, camera) {
			var x = Math.floor((mouseX + camera.x) / map.tileSize);
			var y = Math.floor((mouseY + camera.y) / map.tileSize);
			
			// check bounds
			if (x < 0 ||
				x > map.cols - 1 ||
				y < 0 ||
				y > map.rows - 1) {
				return null;
			}

			return [x, y];
		},

		getDistanceBetweenTwoEntities: function(entity1, entity2) {
			var x = entity1.relativeCenterX - entity2.relativeCenterX;
			var y = entity1.relativeCenterY - entity2.relativeCenterY;
			
			return Math.sqrt(x * x + y * y);
		}
	}
}();