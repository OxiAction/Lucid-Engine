/*JSON[*/
// object name has to be the same as the filename!
var levelMap1 = {
	"config": {
		"name": "Map 1",
		"width": 3000,
		"height": 500,
		"tilesize": 20,
		"type": TYPE_ENGINE_SIDE_SCROLL,
		"velocity": 1,
		"tileset": 1,
		"layers": [
			{
				"config": {
					"id": "layer-background",
					"width": 200,
					"height": 200,
					"type": TYPE_LAYER_GRAPHICAL,
					"effects": ["repeat", "parallax"] // TODO -> constants for this
				},
				"data": [
					//...
				]
			},
			{
				"config": {
					"id": "layer-foreground",
					"width": 3000,
					"height": 500,
					"type": TYPE_LAYER_GRAPHICAL,
					"effects": []
				},
				"data": [
					//...
				]
			},
			{
				"config": {
					"id": "layer-objects",
					"width": 3000,
					"height": 500,
					"type": TYPE_LAYER_OBJECTS,
					"effects": []
				},
				"data": [
					//...
				]
			},
			{
				"config": {
					"id": "layer-collision",
					"width": 3000,
					"height": 500,
					"type": TYPE_LAYER_COLLISION,
					"effects": []
				},
				"data": [
					//...
				]
			}
		]
	}
};
/*]JSON*/