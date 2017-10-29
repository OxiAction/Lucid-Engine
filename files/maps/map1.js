levelMap1=/*JSON*/{
	"config": {
		"name": "Test Map 1",
		"width": 3000,
		"height": 500,
		"tilesize": 20,
		"type": TYPE_ENGINE_SIDE_SCROLL,
		"velocity": 1,
		"tileset": 1
	},
	"layers": [
		{
			"config": {
				"name": "layer-background",
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
				"name": "layer-foreground",
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
				"name": "layer-objects",
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
				"name": "layer-collision",
				"width": 3000,
				"height": 500,
				"type": TYPE_LAYER_COLLISION,
				"effects": []
			},
			"data": [
				//...
			]
		},
	]
}