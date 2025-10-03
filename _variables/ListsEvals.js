var Base_DefaultEvalsList = {
	"Shillelagh damage progression": {
		atkAdd: [
			function (fields, v) {
				if (v.WeaponName === "shillelagh-club" || v.WeaponName === "shillelagh-quarterstaff") {
					fields.Damage_Die = function(n){ return n < 5 ? '1d8' : n < 11 ? '1d10' : n < 17 ? '1d12' : '2d6'}(classes.totallevel);
				}
			},
			'', // no description means it doesn't appear in the dialog/menu listing changes
			1 // highest priority
		]
	},
	"Spare the Dying range progression": {
		spellAdd: [
			function (spellKey, spellObj, spName, isDuplicate) {
				if (spellKey === "spare the dying" && classes.totallevel) {
					var cDie = cantripDie[Math.min(classes.totallevel, cantripDie.length) - 1];
					var range = 15 * Math.pow(2, cDie-1) + " ft";
					if (What("Unit System") === "metric") range = ConverToMetric(range, 0.5);
					spellObj.range = range;
				}
			},
			"",
			1
		]
	},
	"True Strike": {
		atkAdd: [
			function (fields, v) {
				if (v.isWeapon && v.baseWeaponName !== 'true strike' && /true.strike|[\(\[]TS[\]\)]/i.test(v.WeaponTextName)) {
					// Radiant damage type optional
					if (!/radiant|[,; /\-]/i.test(fields.Damage_Type)) {
						fields.Damage_Type = fields.Damage_Type.capitalize().replace("eoning", ".") + "/Radiant";
					}
					// Bonus damage to description
					if (classes.totallevel >= 5) {
						fields.Description += (fields.Description ? '; ' : '') + '+' + EvalDmgDie('Bd6') + ' Radiant damage';
					}
					// Use highest spellcasting ability
					if (!v.theWea.useSpellMod) {
						var aCasters = isSpellUsed('true strike');
						if (!aCasters.length) aCasters = Object.keys(CurrentSpells);
						if (aCasters.length) v.theWea.useSpellMod = aCasters;
					}
				}
			},
			'Add the text "True Strike", "[TS]", or "(TS)" to the name of a weapon to have the bonuses of the True Strike cantrip added to it and its ability selection default to the correct one.\n   IMPORTANT: when using this, you will no longer be able to manually change the ability, it will instead be determined by the generated spell sheet.',
			1
		],
		atkCalc: [
			function (fields, v, output) {
				if (v.isWeapon && v.baseWeaponName !== 'true strike' && /true strike|[\(\[]TS[\]\)]/i.test(v.WeaponTextName)) {
					// Use highest spellcasting ability
					if (!v.theWea.useSpellMod) {
						var aCasters = isSpellUsed('true strike');
						if (!aCasters.length) aCasters = Object.keys(CurrentSpells);
						if (aCasters.length) v.theWea.useSpellMod = aCasters;
					}
				}
			},
			'',
			1
		]
	}
}