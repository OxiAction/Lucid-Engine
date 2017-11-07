/*JSON[*/
// object name has to be the same as the filename!
var levelMap1 = {
	"config": {
		"name": "Map 1",
		"width": 3000,
		"height": 500,
		"tilesize": 20,
		"type": Engine2D.TYPE.SIDE_SCROLL,
		"velocity": 1,
		"tileset": 1,
		"layers": [
			/*
			{
				"config": {
					"id": "layer-background",
					"width": 200,
					"height": 200,
					"type": TYPE_LAYER_GRAPHICAL,
					"effects": ["repeat", "parallax"], // TODO -> constants for this
					"data": [
					//...
					]
				}
			},
			*/
			{
				"config": {
					"id": "layer-foreground",
					"width": 3000,
					"height": 500,
					"type": Layer.TYPE.GRAPHICAL,
					"effects": [],
					"data": [
						// [tiletype, posX, posY]
						[0, 0, 70], [0, 20, 70], [0, 40, 70]
					]
				}
			},
			{
				"config": {
					"id": "layer-objects",
					"width": 3000,
					"height": 500,
					"type": Layer.TYPE.OBJECTS,
					"effects": [],
					"data": [
						// spawn point - type 0
						[0, 10, 50]
					]
				}
			},
			{
				"config": {
					"id": "layer-collision",
					"width": 3000,
					"height": 500,
					"type": Layer.TYPE.COLLISION,
					"effects": [],
					"data": [
						[0, 0, 20], [0, 20, 20], [0, 40, 20]
					]
				}
			}
		]
	}
};
/*]JSON*/