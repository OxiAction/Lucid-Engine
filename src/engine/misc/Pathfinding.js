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
 * Pathfinding.
 *
 * @class      Pathfinding (name)
 * @return     {Object}  Returns public methods.
 */
Lucid.Pathfinding = function() {
	var grid = null;
	var gridWidth = 0;
	var gridHeight = 0;
	var pathsQueue = [];
	var useDiagonals = false;
	var diagonalCost = Math.SQRT2; // 1.41....
	var straightCost = 1.0;
/**
 * Public methods
 */

	return {
		// See for various grid heuristics:
		// http://theory.stanford.edu/~amitp/GameProgramming/Heuristics.html#S7
		getDistanceManhatten(x1, y1, x2, y2) {
			return Math.abs(x1 - x2) + Math.abs(y1 - y2);
		},

		getDistanceOctile(x1, y1, x2, y2) {
			var dx = Math.abs(x1 - x2);
			var dy = Math.abs(y1 - y2);

			if (dx < dy) {
				return diagonalCost * dx + dy;
			} else {
				return diagonalCost * dy + dx;
			}
		},

		getDistanceDijkstra(x1, y1, x2, y2) {
			// yep :D thats it!
			return 0;
		},

		setUseDiagonals: function(value) {
			useDiagonals = value;
		},

		setDiagonalCost(value) {
			diagonalCost = value;
		},

		setStraightCost(value) {
			straightCost = value;
		},

		setGrid: function(value) {
			grid = value;
			gridWidth = value[0].length;
			gridHeight = value.length;
		},

		findPath: function(startX, startY, endX, endY, callback) {
			var path = new Lucid.PathfindingPath(startX, startY, endX, endY, callback);
			pathsQueue.push(path);
		},

		backtrace: function(node) {
			var path = [{x: node.x, y: node.y}];
			while (node.parent) {
				node = node.parent;
				path.push({x: node.x, y: node.y});
			}
			return path.reverse();
		},

		calculate: function() {
			if (pathsQueue.length === 0) {
				return;
			}

			var path = pathsQueue[0];
			
			// create a new heap and set sorting to property f (ascending)
			var nodesToVisit = new BinaryHeap(function(element) {
				return element.f;
			});

			var nodes = [];

			// grid not null?
			if (grid != null) {
				
				for (var y = 0; y < grid.length; ++y) {
					for (var x = 0; x < grid[y].length; ++x) {
						if (!nodes[y]) {
							nodes[y] = [];
						}

						// create a node object
						nodes[y][x] = {x: x, y: y, walkable: grid[y][x] == 1 ? false : true};
					}
				}

				var startNode = nodes[path.getStartY()][path.getStartX()];
				startNode.g = 0;
				startNode.f = 0;

				var endNode = nodes[path.getEndY()][path.getEndX()];

				nodesToVisit.push(startNode);
				startNode.opened = true;

				while (nodesToVisit.size() > 0) {
					// get first node
					var current = nodesToVisit.pop();
					current.closed = true;

					if (current.x == path.getEndX() && current.y == path.getEndY()) {
						var result = this.backtrace(current);
						path.triggerCallback(result);
						break;
					}

					// neighbors
					var neighbors = [];

					// determine what directions we are using
					var useTopNeighbor = false;
					var useRightNeighbor = false;
					var useBottomNeighbor = false;
					var useLeftNeighbor = false;

					// ↑ top
					var neighborNode = current.y - 1 >= 0 ? nodes[current.y - 1][current.x] : null;
					if (neighborNode && neighborNode.walkable) {
						neighbors.push(neighborNode);
						useTopNeighbor = true;
					}

					// → right
					neighborNode = current.x + 1 < gridWidth ? nodes[current.y][current.x + 1] : null;
					if (neighborNode && neighborNode.walkable) {
						neighbors.push(neighborNode);
						useRightNeighbor = true;
					}

					// ↓ bottom
					neighborNode = current.y + 1 < gridHeight ? nodes[current.y + 1][current.x] : null;
					if (neighborNode && neighborNode.walkable) {
						neighbors.push(neighborNode);
						useBottomNeighbor = true;
					}

					// ← left
					neighborNode = current.x - 1 >= 0 ? nodes[current.y][current.x - 1] : null;
					if (neighborNode && neighborNode.walkable) {
						neighbors.push(neighborNode);
						useLeftNeighbor = true;
					}

					if (useDiagonals) {
						// top right - check to not cut corners
						if (useTopNeighbor && useRightNeighbor) {
							neighborNode = nodes[current.y - 1][current.x + 1];
							if (neighborNode.walkable) {
								neighbors.push(neighborNode);
							}
						}

						// bottom right - check to not cut corners
						if (useBottomNeighbor && useRightNeighbor) {
							neighborNode = nodes[current.y + 1][current.x + 1];
							if (neighborNode.walkable) {
								neighbors.push(neighborNode);
							}
						}

						// bottom left - check to not cut corners
						if (useBottomNeighbor && useLeftNeighbor) {
							neighborNode = nodes[current.y + 1][current.x - 1];
							if (neighborNode.walkable) {
								neighbors.push(neighborNode);
							}
						}

						// top left - check to not cut corners
						if (useTopNeighbor && useLeftNeighbor) {
							neighborNode = nodes[current.y - 1][current.x - 1];
							if (neighborNode.walkable) {
								neighbors.push(neighborNode);
							}
						}
					}

					var heuristicCost;

					for (var i = 0; i < neighbors.length; ++i) {
						var neighbor = neighbors[i];

						if (neighbor.closed) {
							continue;
						}
						
						// new g is current g and straight / diagonal cost
						var new_g;
						if (neighbor.x == current.x || neighbor.y == current.y) {
							new_g = current.g + straightCost;
						} else {
							new_g = current.g + diagonalCost;
						}

						// check if the neighbor has not been inspected yet, or
						// can be reached with smaller cost from the current node
						if (!neighbor.opened || new_g < neighbor.g) {

							// resource: http://theory.stanford.edu/~amitp/GameProgramming/AStarComparison.html

							neighbor.g = new_g; // g(n) represents the exact cost of the path from the starting point to any vertex n

							if (!neighbor.h) {
								if (useDiagonals) {
									neighbor.h = 1 * this.getDistanceOctile(neighbor.x, neighbor.y, path.getEndX(), path.getEndY());
								} else {
									neighbor.h = 1 * this.getDistanceManhatten(neighbor.x, neighbor.y, path.getEndX(), path.getEndY());
								}
							}
							neighbor.f = neighbor.g + neighbor.h; // vertexes (n) with lower f(n) = g(n) + h(n) will get processed first
							neighbor.parent = current;

							if (!neighbor.opened) {
								nodesToVisit.push(neighbor);
								neighbor.opened = true;
							} else {
								// the neighbor can be reached with smaller cost.
								// reindex because of the changed f value
								// TODO: maybe implement some update method in heap?
								nodesToVisit.remove(neighbor);
								nodesToVisit.push(neighbor);
							}
						}
					}
				}
			}

			// remove path form queue
			pathsQueue.splice(0, 1);
		}
	}
}();

Lucid.PathfindingPath = function(startX, startY, endX, endY, callback) {
	var isReady = false;

	return {
		getIsReady: function() {
			return isReady;
		},

		setIsReady: function(value) {
			isReady = value;
		},

		getStartX: function() {
			return startX;
		},

		getStartY: function() {
			return startY;
		},

		getEndX: function() {
			return endX;
		},

		getEndY: function() {
			return endY;
		},

		triggerCallback: function(resultPath) {
			callback(resultPath);
		}
	};
};

// http://eloquentjavascript.net/1st_edition/appendix2.html
function BinaryHeap(scoreFunction){
	this.content = [];
	this.scoreFunction = scoreFunction;
}

BinaryHeap.prototype = {
	push: function(element) {
		// Add the new element to the end of the array.
		this.content.push(element);
		// Allow it to bubble up.
		this.bubbleUp(this.content.length - 1);
	},

	pop: function() {
		// Store the first element so we can return it later.
		var result = this.content[0];
		// Get the element at the end of the array.
		var end = this.content.pop();
		// If there are any elements left, put the end element at the
		// start, and let it sink down.
		if (this.content.length > 0) {
			this.content[0] = end;
			this.sinkDown(0);
		}

		return result;
	},

	remove: function(node) {
		var length = this.content.length;
		// To remove a value, we must search through the array to find
		// it.
		for (var i = 0; i < length; i++) {
			if (this.content[i] != node) continue;
			// When it is found, the process seen in 'pop' is repeated
			// to fill up the hole.
			var end = this.content.pop();
			// If the element we popped was the one we needed to remove,
			// we're done.
			if (i == length - 1) break;
			// Otherwise, we replace the removed element with the popped
			// one, and allow it to float up or sink down as appropriate.
			this.content[i] = end;
			this.bubbleUp(i);
			this.sinkDown(i);
			break;
		}
	},

	size: function() {
		return this.content.length;
	},

	bubbleUp: function(n) {
		// Fetch the element that has to be moved.
		var element = this.content[n], score = this.scoreFunction(element);
		// When at 0, an element can not go up any further.
		while (n > 0) {
			// Compute the parent element's index, and fetch it.
			var parentN = Math.floor((n + 1) / 2) - 1,
			parent = this.content[parentN];
			// If the parent has a lesser score, things are in order and we
			// are done.
			if (score >= this.scoreFunction(parent))
				break;

			// Otherwise, swap the parent with the current element and
			// continue.
			this.content[parentN] = element;
			this.content[n] = parent;
			n = parentN;
		}
	},

	sinkDown: function(n) {
		// Look up the target element and its score.
		var length = this.content.length,
		element = this.content[n],
		elemScore = this.scoreFunction(element);

		while(true) {
			// Compute the indices of the child elements.
			var child2N = (n + 1) * 2, child1N = child2N - 1;
			// This is used to store the new position of the element,
			// if any.
			var swap = null;
			// If the first child exists (is inside the array)...
			if (child1N < length) {
				// Look it up and compute its score.
				var child1 = this.content[child1N],
				child1Score = this.scoreFunction(child1);
				// If the score is less than our element's, we need to swap.
				if (child1Score < elemScore)
					swap = child1N;
			}
			// Do the same checks for the other child.
			if (child2N < length) {
				var child2 = this.content[child2N],
				child2Score = this.scoreFunction(child2);

				if (child2Score < (swap == null ? elemScore : child1Score))
					swap = child2N;
			}

			// No need to swap further, we are done.
			if (swap == null) break;

			// Otherwise, swap and continue.
			this.content[n] = this.content[swap];
			this.content[swap] = element;
			n = swap;
		}
	}
};