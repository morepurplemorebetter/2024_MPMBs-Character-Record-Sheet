// Functions to create player-selectable content and that are used by add-on scripts



/** Add all Fighting Style feats as choices to class features with `choicesFightingStyles` attribute
 * Possible attributes in the choicesFightingStyles object
 * @param {Object|Boolean} choicesFightingStyles setting to `true` is enough, but optionally can be an object with the following attributes:
 * @param {string} choicesFightingStyles.description added to feat's descripton
 * @param {string[]} choicesFightingStyles.exclude Fighting Style names in this array are not added to the choices
 * @param {string[]} choicesFightingStyles.include only Fighting Style names in this array are added to the choices
 * @param {string} choicesFightingStyles.submenu add this attribute to each choice (i.e. put them all in the submenu by this name)
 * @param {string} choicesFightingStyles.namePrefix add this before the name of the Fighting Style instead of the default "Fighting Style: "
 * 
 * Note that Fighting Style names are the lowercase version of their `name` attribute, or `sortName` if defined.
 */
function processChoicesFightingStyles() {
	// First go over all the feats and gather the objects that we need to add
	var fightingStylesChoices = [];
	var fightingStyles = {};
	for (var sFeat in FeatsList) {
		var oFeat = FeatsList[sFeat];
		if (/fighting style/i.test(oFeat.type)) {
			var choice = oFeat.sortname ? oFeat.sortname : oFeat.name;
			var choiceLC = choice.toLowerCase();
			fightingStylesChoices.push(choice);
			fightingStyles[choiceLC] = {
				name: "Fighting Style: " + oFeat.name,
				description: oFeat.descriptionClassFeature ? oFeat.descriptionClassFeature : "\n" + oFeat.description,
			}
			for (var key in oFeat) {
				if (fightingStyles[choiceLC][key] || /^(type|choices|selfChoosing|defaultExcluded|description(ClassFeature|Full)|calculate)$/.test(key)) continue;
				fightingStyles[choiceLC][key] = oFeat[key];
			}
		}
	}
	// Then go over all class features and see where we need to add this
	var processFsFeature = function(feaObj) {
		// Amend the choices array
		if (!feaObj.choices) feaObj.choices = [];
		feaObj.choices = feaObj.choices.concat(fightingStylesChoices);
		feaObj.choices.sort();
		var addFS = typeof feaObj.choicesFightingStyles === "object" ? feaObj.choicesFightingStyles : {};
		// Add each choice to the object
		for (var style in fightingStyles) {
			if (feaObj[style]) continue;
			if (addFS.exclude && addFS.exclude.indexOf(style) !== -1) continue;
			if (addFS.include && addFS.include.indexOf(style) === -1) continue;
			var oFS = fightingStyles[style];
			feaObj[style] = {};
			// Make a shallow copy of the object so amendments don't change the original
			for (var key in oFS) {
				feaObj[style][key] = oFS[key];
			}
			// Process any amendments if present
			if (addFS.description) feaObj[style].description += addFS.description;
			if (addFS.submenu) feaObj[style].submenu = addFS.submenu;
			if (addFS.namePrefix) {
				feaObj[style].name = feaObj[style].name.replace("Fighting Style: ", addFS.namePrefix);
			}
		}
	}
	for (var sClass in ClassList) {
		if (!ClassList[sClass].features) continue;
		for (var sFeature in ClassList[sClass].features) {
			var oFeature = ClassList[sClass].features[sFeature];
			if (oFeature.choicesFightingStyles) processFsFeature(oFeature);
		}
	}
	for (var sSubClass in ClassSubList) {
		if (!ClassSubList[sSubClass].features) continue;
		for (var sFeature in ClassSubList[sSubClass].features) {
			var oFeature = ClassSubList[sSubClass].features[sFeature];
			if (oFeature.choicesFightingStyles) processFsFeature(oFeature);
		}
	}
}

/** Add all weapons and masteries as extrachoices to class features with `choicesWeaponMasteries` attribute
 * Possible attributes in the choicesWeaponMasteries object
 * @param {Object|Boolean} choicesWeaponMasteries setting to `true` is enough, but optionally can be an object with the following attributes:
 * @param {string[]} choicesWeaponMasteries.exclude Weapon Mastery keys in this array are not added to the choices
 * @param {string[]} choicesWeaponMasteries.include only Weapon Mastery keys in this array are added to the choices
 */
function processChoicesWeaponMasteries() {
	/** Submenus:
	 *  Simple Melee Weapons  -> Club (Slow)        " " prefix to make it first in the menu
	 *  Simple Ranged Weapons -> Dart (Vex)
	 * Martial Melee Weapons  -> Battleaxe (Topple)
	 * Martial Ranged Weapons -> Blowgun (Vex)
	 * With "Cleave" Mastery  -> Halberd (Cleave)   Do this for each mastery
	 * \xA0Mastery Text Only  -> Cleave             "\xA0" prefix to make it last in the menu
	 */
	var reCalcWeaponsOnSelection = function() { ReCalcWeapons(); };
	var reCalcWeaponsOnDeselection = function() { ReCalcWeapons(false, true); };
	var createChoiceObject = function(name, oMastery, submenus, weaponKey, addEvals) {
		var choiceObj = {
			name: name,
			source: oMastery.source,
			description: "\n" + oMastery.description,
			submenu: submenus,
		};
		if (weaponKey) choiceObj.weaponMastery = weaponKey;
		if (addEvals) {
			choiceObj.eval = reCalcWeaponsOnSelection;
			choiceObj.removeeval = reCalcWeaponsOnDeselection;
		}
		return choiceObj;
	}
	var weaponMasteryChoices = [];
	var weaponMasteries = {};
	// First go over all the weapons and gather the objects that we need to add
	for (var sWeapon in WeaponsList) {
		var oWeapon = WeaponsList[sWeapon];
		var oMastery = WeaponMasteriesList[oWeapon.mastery];
		if (!oMastery || oWeapon.baseWeapon) continue;
		var submenus = ['With "' + oMastery.name + '" Mastery'];
		if (/simple|martial/i.test(oWeapon.type) && /melee|ranged/i.test(oWeapon.list)) {
			var submenuType = /simple/i.test(oWeapon.type) ? " Simple" : "Martial";
			submenuType += /ranged/i.test(oWeapon.list) ? " Ranged Weapon" : " Melee Weapon";
			submenus.push(submenuType);
		}
		var weaponNameCp = oWeapon.name.capitalize()
		var choiceName = weaponNameCp + " (" + oMastery.name + ")";
		var displayName = weaponNameCp + ": " + oMastery.name;
		weaponMasteryChoices.push(choiceName);
		weaponMasteries[choiceName.toLowerCase()] = createChoiceObject(displayName, oMastery, submenus, sWeapon, true);
	}
	// Then go over all the weapon masteries and add "Mastery Text Only" options for them
	for (var sMastery in WeaponMasteriesList) {
		var oMastery = WeaponMasteriesList[sMastery];
		weaponMasteryChoices.push(oMastery.name);
		weaponMasteries[oMastery.name.toLowerCase()] = createChoiceObject(oMastery.name, oMastery, "\xA0Mastery Text Only");
	}
	// Then go over all class features and see where we need to add this
	var processWmFeature = function(feaObj) {
		// Amend the choices array
		if (!feaObj.extrachoices) feaObj.extrachoices = [];
		feaObj.extrachoices = feaObj.extrachoices.concat(weaponMasteryChoices);
		// Add each extrachoice to the object
		for (var mastery in weaponMasteries) {
			if (feaObj[mastery]) continue;
			var addWM = typeof feaObj.choicesWeaponMasteries === "object" ? feaObj.choicesWeaponMasteries : {};
			if (addWM.exclude && addWM.exclude.indexOf(mastery) !== -1) continue;
			if (addWM.include && addWM.include.indexOf(mastery) === -1) continue;
			var oWM = weaponMasteries[mastery];
			feaObj[mastery] = {};
			// Make a shallow copy of the object so amendments don't change the original
			for (var key in oWM) {
				feaObj[mastery][key] = oWM[key];
			}
		}
	}
	for (var sClass in ClassList) {
		if (!ClassList[sClass].features) continue;
		for (var sFeature in ClassList[sClass].features) {
			var oFeature = ClassList[sClass].features[sFeature];
			if (oFeature.choicesWeaponMasteries) processWmFeature(oFeature);
		}
	}
	for (var sSubClass in ClassSubList) {
		if (!ClassSubList[sSubClass].features) continue;
		for (var sFeature in ClassSubList[sSubClass].features) {
			var oFeature = ClassSubList[sSubClass].features[sFeature];
			if (oFeature.choicesWeaponMasteries) processWmFeature(oFeature);
		}
	}
}

/** Add the ability score choices for a feat
 * @param {object} oFeat a FeatsList object that should be edited
 * @param {array} [abilities] array of abilities to add. Does all 6 if `!abilities`
 * @param {number} [iScoresMaximum] add a scoresMaximum for each ability with the given number
 * @param {boolean} [bAddNameAbbreviations] set to true if only the 3-letter abbreviation of the ability should be added to the choices' name
 * @param {boolean} [bAddNameAbbreviations] set to true if only the 3-letter abbreviation of the ability should be added to the choices' description
 */
function addAbilityScoreChoicesToFeat(oFeat, abilities, iScoresMaximum, bAddNameAbbreviations, bAddDescriptionAbbreviations) {
	if (!abilities) abilities = ["Strength", "Dexterity", "Constitution", "Intelligence", "Wisdom", "Charisma"];
	for (var i = 0; i < abilities.length; i++) {
		var abi = abilities[i];
		// Make sure what we got is usable
		if (!isNaN(abi)) {
			if (abi > 5) continue;
			abi = AbilityScores.names[abi];
		} else if (abi.length === 3) {
			var abiAbrIdx = AbilityScores.abbreviations.indexOf(abi.capitalize());
			if (abiAbrIdx === -1) continue;
			abi = AbilityScores.names[abiAbrIdx];
		} else {
			abi = abi.capitalize();
			if (!AbilityScores.names.indexOf(abi) === -1) continue;
		}
		var abiLC = abi.toLowerCase();
		var abiAbbr = abi.substring(0, 3);
		var abiIdx = AbilityScores[abiLC].index;
		if (!oFeat.choices) oFeat.choices = [];
		// Add it to the choices array if it doesn't exist
		if (oFeat.choices.indexOf(abi) === -1) oFeat.choices.push(abi);
		// Create an object for it if it doesn't exist
		if (!oFeat[abiLC]) {
			oFeat[abiLC] = {
				description: oFeat.description + " [+1 " + (bAddDescriptionAbbreviations ? abiAbbr : abi) + "]",
				scores: [0, 0, 0, 0, 0, 0],
			}
			oFeat[abiLC].scores[abiIdx] = 1;
			if (iScoresMaximum) {
				oFeat[abiLC].scoresMaximum = [0, 0, 0, 0, 0, 0];
				oFeat[abiLC].scoresMaximum[abiIdx] = iScoresMaximum;
			}
			if (bAddNameAbbreviations) oFeat[abiLC].name = oFeat.name + " [" + abiAbbr + "]";
			if (oFeat.calculate) oFeat[abiLC].calculate = oFeat.calculate;
		}
	}
	if (oFeat.choicesNotInMenu === undefined) oFeat.choicesNotInMenu = true;
};

/** Create a range object to use with getHighestTotal, given a certain base range
 * This object can than be supplemented with other entries before calculated
 * using getHighestTotal.
 * @param {string} range a string with a number and unit (e.g. "20 ft" or "6 m")
 * @param {function} [stopFunction] a function to stop the addition when returned true
 * 
 * @returns {object} {number} range in feet, prefix and suffix of that range
 * @returns {undefined} if the input wasn't usable
 */
function rangeStringToPartsObject(range, stopFunction) {
	// First test if this is an actual range that we can use
	var rangeParts = range.match(/(\d*[,.]?\d+).?(ft|feet|foot|m\b|metre|meter)/i);
	if (!rangeParts) return;
	var rangeFT = Number(rangeParts[1].replace(",", "."));
	if (rangeParts[2].toLowerCase()[0] === 'm') {
		// If the range is in metres, convert it to feet
		rangeFT = RoundTo(rangeFT / UnitsList.metric.length, 0.5);
	}
	var rangeSplit = range.split(rangeParts[0]);
	// Create and return the object
	var returnObject = {
		forHighestTotal: { base: rangeFT },
		prefix: rangeSplit[0],
		suffix: rangeSplit[1],
	};
	// If a stopFunction is provided, stop the creation if it returns true
	if (stopFunction && typeof stopFunction === "function") {
		if (stopFunction(range, rangeFT)) return;
	}
	return returnObject;
}

/** Amends an object created by `rangeStringToPartsObject` with an addition
 *  and processes it using getHighestTotal.
 * 
 * @param {string|object} range `rangeStringToPartsObject` function output (created if this input is a string)
 * @param {string} srcName name of the addition (or thing to overwrite)
 * @param {string} addition number modifier (e.g. "+60", "*2", "fixed10")
 * @param {function} [stopFunction] a function to stop the addition when returned true
 * 
 * @returns {object|undefined} new `rangeObject` with the attributes `result` and
 * `resultFT` the output from getHighestTotal, or undefined if the input wasn't usable.
 */
function amendRangeObject(range, srcName, addition, stopFunction) {
	var rangeObject = range;
	// If the input `range` is a string, create the object from it
	if (typeof range === "string") {
		rangeObject = rangeStringToPartsObject(range, stopFunction);
		if (!rangeObject) return; // invalid input, or stopFunction returned true
	} else if (stopFunction && typeof stopFunction === "function") {
		// If there is a stopFunction and it wasn't already used in `rangeStringToPartsObject`, do it now
		if (!rangeObject.result) {
			// If no result is set, create it now before the addition
			var preProcess = getHighestTotal(rangeObject.forHighestTotal, false, false, false, false, true);
			rangeObject.result = rangeObject.prefix + preProcess[0] + rangeObject.suffix;
			rangeObject.resultFT = preProcess[1];
		}
		if (stopFunction(rangeObject.result, rangeObject.resultFT)) return rangeObject;
	}
	// Add the addition
	rangeObject.forHighestTotal[srcName] = addition;
	var process = getHighestTotal(rangeObject.forHighestTotal, false, false, false, false, true);
	rangeObject.result = rangeObject.prefix + process[0] + rangeObject.suffix;
	rangeObject.resultFT = process[1];
	return rangeObject;
}

/** Create features that are dependent on other content.
 * This function is invoked after the lists are created and the user scripts are processed.
 */
function dynamicFeatureCreation() {
	// Warlock invocations that change cantrips: add one for each eligible cantrip
	var invocationFeature = ClassList.warlock.features['eldritch invocations'];
	var dmgSpellRx = /(takes?|or) \d+d\d+ \w* ?(damage|dmg)/i;
	// Debatable if this should include True Strike, or only from level 5 onwards, but this automation has it as an option so the DM can decide to allow it or not.
	var dmgSpellEx = ['true strike', 'green-flame blade', 'booming blade'];
	var atkSpellRx = /spell at(tac)?k/i;
	var atkSpellEx = dmgSpellEx;
	var rngSpellRx = /^(?!.*(S:|rad|touch|self|cone|cube)).*\d+([.,]\d+)?.?(f.{0,2}t|m).*$/i;
	var range10FtFunc = function (sRange, nRangeFT) { return nRangeFT < 10; };
	var prereqFunc = function(v) {
		var invocationFeature = ClassList.warlock.features['eldritch invocations'];
		var cantrip = invocationFeature[v.choice].invocationMeta.cantrip;
		var oSpell = SpellsList[cantrip];
		if (!cantrip || !oSpell || !oSpell.classes || !classes.known.warlock) return "skip";
		var isWarlockSpell = oSpell.classes.indexOf("warlock") !== -1;
		return classes.known.warlock.level >= 2 && isSpellUsed(cantrip).find(/warlock/i) !== -1 ? true : isWarlockSpell ? false : "skip";
	};
	var evalFunc = function(lvlA, choiceA) {
		var addIt = lvlA[1] ? true : false;
		var choice = choiceA[addIt ? 1 : 0];
		var invocationFeature = ClassList.warlock.features['eldritch invocations'];
		var invocation = invocationFeature[choice].invocationMeta.type;
		var otherInvocationsOfSameType = getActiveInvocations(invocation, false, choice);
		// Only do something if there are no active other invocations of the same type ( i.e. only add if the first / remove if the last of its type)
		if (!otherInvocationsOfSameType.length) {
			var genericFeature = GenericClassFeatures[invocation];
			addEvals(genericFeature.calcChanges, "Warlock: " + genericFeature.name, addIt, "classes");
		}
	};
	var agonizingBlastSubMenu = "Agonizing Blast (req: lvl 2+)" + stringSource(GenericClassFeatures["agonizing blast"], "first,abbr", "   \t[", "]");
	var eldritchSpearSubMenu = "Eldritch Spear (req: lvl 2+)" + stringSource(GenericClassFeatures["eldritch spear"], "first,abbr", "   \t[", "]");
	var eldritchSpearAdditional = levels.map(function (n) { return "+" + (n * 30) + " ft range" });
	var repellingBlastSubMenu = "Repelling Blast (req: lvl 2+)" + stringSource(GenericClassFeatures["repelling blast"], "first,abbr", "   \t[", "]");
	for (var key in SpellsList) {
		var oSpell = SpellsList[key];
		var descriptions = oSpell.description + oSpell.descriptionFull;
		// Only cantrips that deal damage
		if (oSpell.psionic || !oSpell.classes || oSpell.level !== 0 || (dmgSpellEx.indexOf(key) === -1 && !dmgSpellRx.test(descriptions))) continue;
		// Agonizing Blast: cantrips that deal damage
		var agonizingName = "Agonizing Blast: " + oSpell.name;
		var spellSubMenu = "[upgrades " + oSpell.name + "]";
		invocationFeature[agonizingName.toLowerCase()] = {
			name: agonizingName,
			source: oSpell.source,
			invocationMeta: { type: "agonizing blast", cantrip: key },
			eval: evalFunc, removeeval: evalFunc, prereqeval: prereqFunc,
			submenu: [spellSubMenu, agonizingBlastSubMenu],
			description: "\nI can add my Charisma modifier to the damage rolls of " + oSpell.name + ".",
		};
		invocationFeature.extrachoices.push(agonizingName);
		// Eldritch Spear: cantrips that deal damage with 10+ ft range
		var isRngSpell = rngSpellRx.test(oSpell.range) && rangeStringToPartsObject(oSpell.range, range10FtFunc);
		if (isRngSpell) {
			var spearName = "Eldritch Spear: " + oSpell.name;
			invocationFeature[spearName.toLowerCase()] = {
				name: spearName,
				source: oSpell.source,
				invocationMeta: { type: "eldritch spear", cantrip: key },
				eval: evalFunc, removeeval: evalFunc, prereqeval: prereqFunc,
				submenu: [spellSubMenu, eldritchSpearSubMenu],
				additional: eldritchSpearAdditional,
				description: "\nWhen I cast " + oSpell.name + ", its range increases by 30 ft times my Warlock level.",
			};
			invocationFeature.extrachoices.push(spearName);
		}
		// Repelling Blast: cantrips that deal damage via an attack roll
		var isAtkSpell = atkSpellEx.indexOf(key) !== -1 || atkSpellRx.test(descriptions);
		if (isAtkSpell) {
			var repellingName = "Repelling Blast: " + oSpell.name;
			invocationFeature[repellingName.toLowerCase()] = {
				name: repellingName,
				source: oSpell.source,
				invocationMeta: { type: "repelling blast", cantrip: key },
				eval: evalFunc, removeeval: evalFunc, prereqeval: prereqFunc,
				submenu: [spellSubMenu, repellingBlastSubMenu],
				description: "\nWhen I hit a \u2264Large creature with " + oSpell.name + ", I can push it up to 10 ft away from me.",
			};
			invocationFeature.extrachoices.push(repellingName);
		}
	}
	// Warlock invocations that add origin feat
	var prereqFuncFeat = function(v) {
		var invocationFeature = ClassList.warlock.features['eldritch invocations'];
		var invocationMeta = invocationFeature[v.choice].invocationMeta;
		var feat = invocationMeta.feat;
		var featChoice = invocationMeta.choice;
		return !CurrentFeats.known.some(function (n, idx) {
			var nChoice = CurrentFeats.choices[idx];
			return n === feat && (!featChoice || nChoice === featChoice);
		});
	};
	var lessonsOfTheFirstOnesSubMenu = "Lessons of the First Ones (req: lvl 2+)" + stringSource({source: [["SRD24", 73], ["P24", 156]]}, "first,abbr", "   \t[", "]");
	for (var key in FeatsList) {
		var oFeat = FeatsList[key];
		if (/origin/i.test(oFeat.type)) {
			var featNames = [{ name: oFeat.name, source: oFeat.source, key: key }];
			if (oFeat.choices && oFeat.allowDuplicates) {
				featNames = oFeat.choices.map(function (choice) {
					var choiceLC = choice.toLowerCase();
					var oChoice = oFeat[choiceLC];
					return {
						name: oChoice.name ? oChoice.name : oFeat.name + " [" + choice + "]",
						source: oChoice.source ? oChoice.source : oFeat.source,
						key: key,
						choice: choiceLC,
					};
				});
			}
			featNames.forEach(function (obj) {
				var lessonsOfTheFirstOnesName = "Lessons of the First Ones: " + obj.name;
				invocationFeature[lessonsOfTheFirstOnesName.toLowerCase()] = {
					name: lessonsOfTheFirstOnesName,
					source: obj.source,
					minlevel: 2,
					invocationMeta: { type: "lessons of the first ones", feat: obj.key, choice: obj.choice },
					prereqeval: prereqFuncFeat,
					submenu: lessonsOfTheFirstOnesSubMenu,
					description: " [gain the feat]",
					featsAdd: [{ key: obj.key, choice: obj.choice }],
				};
				invocationFeature.extrachoices.push(lessonsOfTheFirstOnesName);
			});
		}
	}
}

/** For warlock invocations to check which invocations are selected, filtered by
 * the `invocationMeta` attribute.
 * 
 * @param {string} invocation the `type` attribute of `invocationMeta`
 * @param {object|boolean} [matchObject] object with attributes to match with `invocationMeta`
 * @param {string} [skipInvocation] invocation entry key to ignore
 * 
 * @returns {boolean|array} `false` if nothing to return, otherwise an array with all
 * invocation keys that match the provided parameters
 */
function getActiveInvocations(invocation, matchObject, skipInvocation) {
	var activeInvocations = GetFeatureChoice('classes', 'warlock', 'eldritch invocations', true);
	var invocationFeature = ClassList.warlock.features['eldritch invocations'];
	var matchingInvocations = activeInvocations.filter(function (n) {
		var obj = invocationFeature[n];
		if (n === skipInvocation || !obj || !obj.invocationMeta) return false;
		if (obj.invocationMeta.type.indexOf(invocation) === -1) return false;
		if (!matchObject) return true;
		for (var key in matchObject) {
			if (!obj.invocationMeta[key] || obj.invocationMeta[key] !== matchObject[key]) return false;
		}
		return true;
	});
	return matchingInvocations.length ? matchingInvocations : false;
}
