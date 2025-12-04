var Base_DefaultEvalsList = {
	"Shillelagh damage progression": {
		atkAdd: [
			function (fields, v) {
				if (v.WeaponName === "shillelagh-club" || v.WeaponName === "shillelagh-quarterstaff") {
					fields.Damage_Die = function(n){ return n < 5 ? '1d8' : n < 11 ? '1d10' : n < 17 ? '1d12' : '2d6'}(classes.totallevel);
				};
			},
			'', // no description means it doesn't appear in the dialog/menu listing changes
			1, // highest priority
		],
	},
	"Spare the Dying range progression": {
		spellAdd: [
			function (spellKey, spellObj, spName, isDuplicate) {
				if (spellKey === "spare the dying" && classes.totallevel) {
					var cDie = cantripDie[Math.min(classes.totallevel, cantripDie.length) - 1];
					var range = 15 * Math.pow(2, cDie-1) + " ft";
					if (What("Unit System") === "metric") range = ConverToMetric(range, 0.5);
					spellObj.range = range;
				};
			},
			"",
			1,
		],
	},
	"True Strike": {
		atkAdd: [
			function (fields, v) {
				if (v.isWeapon && v.baseWeaponName !== 'true strike' && /true.strike|[\(\[]TS[\]\)]/i.test(v.WeaponTextName)) {
					// Radiant damage type optional
					if (!/radiant|[,; /\-]/i.test(fields.Damage_Type)) {
						fields.Damage_Type = fields.Damage_Type.capitalize().replace("eoning", ".") + "/Radiant";
					};
					// Bonus damage to description
					if (classes.totallevel >= 5) {
						fields.Description += (fields.Description ? '; ' : '') + '+' + EvalDmgDie('Bd6') + ' Radiant damage';
					};
					// Use highest spellcasting ability
					if (!v.theWea.useSpellMod) {
						var aCasters = isSpellUsed('true strike');
						if (!aCasters.length) aCasters = Object.keys(CurrentSpells);
						if (aCasters.length) v.theWea.useSpellMod = aCasters;
					};
				};
			},
			'Add the text "True Strike", "[TS]", or "(TS)" to the name of a weapon to have the bonuses of the True Strike cantrip added to it and its ability selection default to the correct one.\n   IMPORTANT: when using this, you will no longer be able to manually change the ability, it will instead be determined by the generated spell sheet.',
			1,
		],
		atkCalc: [
			function (fields, v, output) {
				if (v.isWeapon && v.baseWeaponName !== 'true strike' && /true strike|[\(\[]TS[\]\)]/i.test(v.WeaponTextName)) {
					// Use highest spellcasting ability
					if (!v.theWea.useSpellMod) {
						var aCasters = isSpellUsed('true strike');
						if (!aCasters.length) aCasters = Object.keys(CurrentSpells);
						if (aCasters.length) v.theWea.useSpellMod = aCasters;
					};
				};
			},
			'',
			1,
		],
	},
	"Mastery Property": {
		atkAdd: [
			function (fields, v) {
				if (v.masteryAdded || !v.theWea.mastery || !WeaponMasteriesList[v.theWea.mastery]) return;
				var addMastery = /mastery|[\(\[]M[\]\)]/i.test(v.WeaponTextName);
				if (!addMastery && v.baseWeaponName && CurrentFeatureChoices.classes) {
					// test if weapon eligible through Weapon Mastery class feature
					for (var sClass in CurrentFeatureChoices.classes) {
						var chObj = CurrentFeatureChoices.classes[sClass];
						var clFea = CurrentClasses[sClass].features;
						if (!clFea) continue;
						for (var sFea in chObj) {
							var oFeaChoices = chObj[sFea];
							var oClassFea = clFea[sFea];
							if (!oClassFea.choicesWeaponMasteries || !oFeaChoices.extrachoices) continue;
							var weapons = oFeaChoices.extrachoices.map(function (choice) {
								return oClassFea[choice].weaponMastery ? oClassFea[choice].weaponMastery : '';
							});
							if (weapons.indexOf(v.baseWeaponName) !== -1) {
								addMastery = true;
								break;
							};
						};
						if (addMastery) break;
					};
				};
				if (addMastery) {
					var oMastery = WeaponMasteriesList[v.theWea.mastery];
					if (fields.Description) fields.Description += fields.Description.indexOf(';') !== -1 ? '; ' : ', ';
					fields.Description += oMastery.name;
					if (fields.Description_Tooltip) fields.Description_Tooltip += '\n\n';
					fields.Description_Tooltip += toUni(oMastery.name + ' Weapon Mastery', "bold");
					fields.Description_Tooltip += stringSource(oMastery, "first,abbr", " (", ")");
					fields.Description_Tooltip += '\n' + formatDescriptionFull(oMastery.descriptionFull);
					v.masteryAdded = true;
				};
			},
			'Add the text "Mastery", "[M]", or "(M)" to the name of a weapon that has a mastery property to have this mastery listed in the description and its explanation added to tooltip of the description field.\n   This is done automatically for weapons selected with the "Choose Feature" button for class features that grant weapon masteries, regardless of the aforementioned text being present.',
			1,
		],
	},
};
