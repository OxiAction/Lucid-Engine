/**
* Game custom FSM AI Attack - extends FSMStateAtomic
*/
var AIFSMStateAttack = Lucid.FSMStateAtomic.extend({
	// config variables and their default values
	ai: null, // [required] reference to AI

	// local variables
	// ...

	init: function(config) {
		this._super(config);

		if (!this.ai) {
			Lucid.Utils.error("AIFSMStateAttack @ init: ai is null!");
			return false;
		}

		// check / set map reference
		this.checkSetMap();

		return true;
	},

	execute: function() {
		

	}
});