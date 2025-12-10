// No longer used, but kept for legacy sources that use it
var FightingStyles = {
	archery : {
		name : "Archery Fighting Style",
		description : desc("+2 bonus to attack rolls I make with ranged weapons"),
		calcChanges : {
			atkCalc : [
				function (fields, v, output) {
					if (v.isRangedWeapon && !v.isNaturalWeapon && !v.isDC) output.extraHit += 2;
				},
				"My ranged weapons get a +2 bonus on the To Hit."
			]
		}
	},
	defense : {
		name : "Defense Fighting Style",
		description : desc("+1 bonus to AC when I'm wearing armor"),
		extraAC : {
			name : "Defense Fighting Style", // necessary for features referring to fighting style properties directly
			mod : 1,
			text : "I gain a +1 bonus to AC while wearing armor.",
			stopeval : function (v) { return !v.wearingArmor; }
		}
	},
	dueling : {
		name : "Dueling Fighting Style",
		description : desc("+2 to damage rolls when wielding a melee weapon in one hand and no other weapons"),
		calcChanges : {
			atkCalc : [
				function (fields, v, output) {
					for (var i = 1; i <= FieldNumbers.actions; i++) {
						if (/off.hand.attack/i.test(What('Bonus Action ' + i))) return;
					};
					if (v.isMeleeWeapon && !v.isNaturalWeapon && !/((^|[^+-]\b)2|\btwo).?hand(ed)?s?\b/i.test(fields.Description)) output.extraDmg += 2;
				},
				"When I'm wielding a melee weapon in one hand and no weapon in my other hand, I do +2 damage with that melee weapon. This condition will always be false if the bonus action 'Off-hand Attack' exists."
			]
		}
	},
	great_weapon : {
		name : "Great Weapon Fighting Style",
		description : desc("Reroll 1 or 2 on damage if wielding two-handed/versatile melee weapon in both hands"),
		calcChanges : {
			atkAdd : [
				function (fields, v) {
					if (v.isMeleeWeapon && /\bversatile\b|((^|[^+-]\b)2|\btwo).?hand(ed)?s?\b/i.test(fields.Description)) {
						fields.Description += (fields.Description ? '; ' : '') + 'Re-roll 1 or 2 on damage die' + (/versatile/i.test(fields.Description) ? ' when two-handed' : '');
					}
				},
				"While wielding a two-handed or versatile melee weapon in two hands, I can re-roll a 1 or 2 on any damage die once."
			]
		}
	},
	protection : {
		name : "Protection Fighting Style",
		description : desc([
			"As a reaction, I can give disadv. on an attack made vs. someone within 5 ft of me",
			"I need to be wielding a shield and be able to see the attacker to do this"
		]),
		action : [["reaction", ""]]
	},
	two_weapon : {
		name : "Two-Weapon Fighting Style",
		description : desc("I can add my ability modifier to the damage of my off-hand attacks"),
		calcChanges : {
			atkCalc : [
				function (fields, v, output) {
					if (v.isOffHand) output.modToDmg = true;
				},
				'When engaging in two-weapon fighting, I can add my ability modifier to the damage of my off-hand attacks. If a melee weapon includes "off-hand" or "secondary" in its name or description, it is considered an off-hand attack.'
			]
		}
	}
};

var GenericClassFeatures = {
	// Potent Spellcasting is no longer used, but kept for legacy sources that use it
	"potent spellcasting": {
		name: "Potent Spellcasting",
		description: desc("I add my Wisdom modifier to the damage I deal with my cleric cantrips"),
		calcChanges: {
			atkCalc: [
				function (fields, v, output) {
					if (v.thisWeapon[3] && /\bcleric\b/.test(v.thisWeapon[4]) && SpellsList[v.thisWeapon[3]].level === 0 && /\d/.test(fields.Damage_Die)) {
						output.extraDmg += Number(What('Wis Mod'));
					};
				},
				"My cleric cantrips get my Wisdom modifier added to their damage.",
			],
			spellAdd: [
				function (spellKey, spellObj, spName) {
					var wisMod = Number(What("Wis Mod"));
					if (spellObj.psionic || spellObj.level !== 0 || spName.indexOf("cleric") == -1 || wisMod <= 0) return;
					return genericSpellDmgEdit(spellKey, spellObj, "\\w+\\.?", wisMod);
				},
				"My cleric cantrips get my Wisdom modifier added to their damage.",
			],
		},
	},
	// Warlock: Eldritch Invocations that alter how cantrips function
	"agonizing blast": {
		name: "Agonizing Blast",
		source: [["SRD24", 72], ["P24", 155]],
		calcChanges: {
			atkAdd: [
				function (fields, v) {
					// Stop if not a recognized spell, Charisma modifier is 0 or less, or no matching agonizing blast selected for this cantrip
					var spellKey = v.thisWeapon[3];
					var chaMod = Number(What("Cha Mod"));
					if (!spellKey || chaMod <= 0 || !getActiveCantripInvocations('agonizing blast', { cantrip: spellKey })) return;

					output.extraDmg += chaMod;
				},
				"When I hit a creature with a warlock cantrips for which I have selected the Agonizing Blast Eldritch Invocation, I can add my Charisma modifier to the spell's damage rolls.",
			],
			spellAdd: [
				function (spellKey, spellObj, spName) {
					// Stop if Charisma modifier is 0 or less or no matching agonizing blast selected for this cantrip
					var chaMod = Number(What("Cha Mod"));
					if (chaMod <= 0 || !getActiveCantripInvocations('agonizing blast', { cantrip: spellKey })) return;

					genericSpellDmgEdit(spellKey, spellObj, "\\w+\\.?", chaMod, false, true);
				},
				"When I hit a creature with a warlock cantrips for which I have selected the Agonizing Blast Eldritch Invocation, I can add my Charisma modifier to the spell's damage rolls.",
			],
		},
	},
	"eldritch spear": {
		name: "Eldritch Spear",
		source: [["SRD24", 73], ["P24", 155]],
		calcChanges: {
			atkAdd: [
				function (fields, v) {
					// Stop if not a recognized spell, no warlock levels present, or no matching eldritch spear selected for this cantrip
					var spellKey = v.thisWeapon[3];
					if (!spellKey || !classes.known.warlock || !getActiveCantripInvocations('eldritch spear', { cantrip: spellKey })) return;

					var name = "eldritch spear";
					var addition = "+" + (classes.known.warlock.level * 30);
					var useRange = v.rangeObject ? v.rangeObject : fields.Range;
					var stopFunction = function (sRange, nRangeFT) { return nRangeFT < 10; };
					v.rangeObject = amendRangeObject(useRange, name, addition, stopFunction);
					// Only apply if something changed
					if (v.rangeObject && v.rangeObject.result !== fields.Range) {
						fields.Range = v.rangeObject.result;
					}
				},
				"My warlock cantrips for which I have selected the Eldritch Spear Eldritch Invocation gain +30 ft range per Warlock level.",
				700,
			],
			spellAdd: [
				function (spellKey, spellObj, spName) {
					// Stop if no warlock levels present or no matching eldritch spear selected for this cantrip
					if (!classes.known.warlock || !getActiveCantripInvocations('eldritch spear', { cantrip: spellKey })) return;

					var name = "eldritch spear";
					var addition = "+" + (classes.known.warlock.level * 30);
					var useRange = spellObj.rangeObject ? spellObj.rangeObject : spellObj.range;
					var stopFunction = function (sRange, nRangeFT) { return nRangeFT < 10; };
					spellObj.rangeObject = amendRangeObject(useRange, name, addition, stopFunction);
					// Only apply if something changed
					if (spellObj.rangeObject && spellObj.rangeObject.result !== spellObj.range) {
						spellObj.range = spellObj.rangeObject.result;
						return true;
					}
				},
				"My warlock cantrips for which I have selected the Eldritch Spear Eldritch Invocation gain +30 ft range per Warlock level.",
				700,
			],
		},
	},
	"repelling blast": {
		name: "Repelling Blast",
		source: [["SRD24", 74], ["P24", 157]],
		calcChanges: {
			atkAdd: [
				function (fields, v) {
					// Stop if not a recognized spell, requires a save, or no matching repelling blast selected for this cantrip
					var spellKey = v.thisWeapon[3];
					if (!spellKey || v.isDC || !getActiveCantripInvocations('repelling blast', { cantrip: spellKey })) return;

					fields.Description += (fields.Description ? '; ' : '') + '\u2264Large push 10 ft';
				},
				"When I hit a Large or smaller creature with a warlock cantrips for which I have selected the Repelling Blast Eldritch Invocation, I can push it 10 ft straight away from me.",
			],
			spellAdd: [
				function (spellKey, spellObj, spName) {
					// Stop if no matching repelling blast selected for this cantrip
					if (!getActiveCantripInvocations('repelling blast', { cantrip: spellKey })) return;

					// Only amend the spell short description if using the special cantrip die description, otherwise it'll never fit
					if (CurrentCasters.amendSpDescr && spellObj.descriptionCantripDie && spName) {
						// Do the default short description replacements to save space
						var newDescr = spellObj.genericSpellDmgEdit ? spellObj.description : getSpellShortDescription(spellObj.description, spellObj);
						if (/pull\D+(10 ?ft|3 ?m)\b/i.test(newDescr)) {
							// Thorn Whip
							newDescr = newDescr.replace(/(pull)/i, "$1/push").replace(" closer", "");
						} else {
							var distance = What("Unit System") === "metric" ? ConvertToMetric("10ft", 0.5) : "10ft";
							newDescr = newDescr.replace(/(\d)[ -](ft|m)/g, "$1$2")
								.replace(", but can be", ", can be") // Eldritch Blast
								.replace("Act end with", "Act end: ") // Produce Flame
								.replace("\x26 not Invisible", ", no Invis.") // Starry Wisp
								.replace(/(p)roficient/g, "$1rof.") // True Strike
								.replace("dmg \x26", "dmg \x26 push " + distance + " \x26");
							if (newDescr.indexOf("dmg \x26 push " + distance) === -1) {
								newDescr = newDescr.replace("dmg", "dmg, push " + distance);
							}
						}
						if (spellObj.description != newDescr) {
							spellObj.description = newDescr;
							return true;
						}
					}
				},
				"When I hit a Large or smaller creature with a warlock cantrips for which I have selected the Repelling Blast Eldritch Invocation, I can push it 10 ft straight away from me.",
			],
		},
	},
};

var Base_ClassList = {
	"barbarian": {
		regExpSearch: /^((?=.*(marauder|barbarian|viking|(norse|tribes?|clans?)(wo)?m(a|e)n))|((?=.*(warrior|fighter))(?=.*(feral|tribal)))).*$/i,
		name: "Barbarian",
		source: [["SRD24", 28], ["P24", 51]],
		primaryAbility: "Strength",
		prereqs: "Strength 13",
		improvements: [0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 5, 5],
		die: 12,
		saves: ["Str", "Con"],
		skillstxt: {
			primary: "Choose 2: Animal Handling, Athletics, Intimidation, Nature, Perception, or Survival.",
		},
		armorProfs: {
			primary:   [true,  true,  false, true],
			secondary: [false, false, false, true],
		},
		weaponProfs: {
			primary:   [true,  true],
			secondary: [false, true],
		},
		startingEquipment: [{
			gold: 15,
			pack: "explorer",
			equipright: [
				["Greataxe", "", 7],
				["Handaxes", 4, 2],
			],
			equip1stPage: {
				weapons: ["Greataxe", "Handaxe"],
				ammo: [["Handaxes", 4]],
			},
		}, {
			gold: 75,
		}],
		subclasses : ["Barbarian Subclass", ["barbarian-berserker"]],
		attacks: [1, 1, 1, 1, 2],
		features: {
			"rage": {
				name: "Rage",
				source: [["SRD24", 28], ["P24", 51]],
				minlevel: 1,
				description: desc([
					"As a Bonus Action, I can enter a Rage if I'm not wearing Heavy armor. While I'm in a Rage:",
 					" \u2022 I have Resistance to Bludgeoning, Piercing, and Slashing damage.",
 					" \u2022 I add bonus damage to my weapon and Unarmed Strike attacks that use Strength.",
 					" \u2022 I have Advantage on Strength checks and saves, but can't maintain Concentration.",
					"Rage lasts until the end of my next turn, I don Heavy armor, or I become Incapacitated.",
					"On my turn I can extend its duration for another round by attacking an enemy, forcing an enemy to save, or by using a Bonus Action. I can maintain a Rage for up to 10 minutes."
				], "\n"),
				additional: levels.map(function (n) {
					return "+" + (n < 9 ? 2 : n < 16 ? 3 : 4) + " damage, regain 1/SR";
				}),
				usages: levels.map(function (n) {
					return n < 3 ? 2 : n < 6 ? 3 : n < 12 ? 4 : n < 17 ? 5 : 6;
				}),
				recovery: "Long Rest",
				action: [["bonus action", " (start/extend)"]],
				dmgres: [
					["Bludgeoning", "Bludgeon. (in rage)"],
					["Piercing", "Piercing (in rage)"],
					["Slashing", "Slashing (in rage)"],
				],
				savetxt: { text: ["Adv. on Str saves in rage"] },
				calcChanges: {
					atkCalc: [
						function (fields, v, output) {
							var lvl = classes.known.barbarian ? classes.known.barbarian.level : false;
							if (lvl && v.isWeapon && fields.Mod === 1 && /\b(rage|frenzy)\b/i.test(v.WeaponTextName)) {
								output.extraDmg += lvl < 9 ? 2 : lvl < 16 ? 3 : 4;
							}
						},
						"Add the text \"Rage\" or \"Frenzy\" to the name of a weapon that uses Strength to have the Rage's bonus damage added to it."
					],
				},
			},
			"unarmored defense": {
				name: "Unarmored Defense",
				source: [["SRD24", 29], ["P24", 51]],
				minlevel: 1,
				description: "\nIf not wearing armor, my AC is 10 + Dexterity modifier + Constitution modifier + Shield.",
				armorOptions: [{
					regExpSearch: /justToAddToDropDownAndEffectWildShape/,
					name: "Unarmored Defense (Con)",
					source: [["SRD24", 29], ["P24", 51]],
					ac: "10+Con",
					affectsWildShape: true,
					selectNow: true,
				}],
			},
			"weapon mastery": {
				name: "Weapon Mastery",
				source: [["SRD24", 29], ["P24", 52]],
				minlevel: 1,
				description: '\nI gain mastery with a number of Simple/Martial weapons. Whenever I finish a Long Rest,\nI can change one of these choices. Use the "Choose Feature" button above to select them.',
				additional: levels.map(function (n) {
					return (n < 4 ? 2 : n < 10 ? 3 : 4) + " Weapon Masteries";
				}),
				extraTimes: levels.map(function (n) { return n < 4 ? 2 : n < 10 ? 3 : 4 }),
				extraname: "Weapon Mastery",
				choicesWeaponMasteries: true,
			},
			"danger sense": {
				name: "Danger Sense",
				source: [["SRD24", 29], ["P24", 52]],
				minlevel: 2,
				description: "\nI have Advantage on Dexterity saving throws unless I have the Incapacitated condition.",
				savetxt: { text: ["Adv. on Dex saves"] },
				advantages: [["Dexterity", true]],
			},
			"reckless attack": {
				name: "Reckless Attack",
				source: [["SRD24", 29], ["P24", 52]],
				minlevel: 2,
				description: "\nAs I roll my first attack on my turn, I can decide to attack recklessly. This gives me Adv. on attacks using Strength until my next turn starts, but then attacks against me also gain Adv.",
			},
			"subclassfeature3": {
				name: "Barbarian Subclass",
				source: [["SRD24", 29], ["P24", 52]],
				minlevel: 3,
				description: '\nChoose a Barbarian Subclass using the "Class" button/bookmark or type its name into the "Class" field.',
			},
			"primal knowledge": {
				name: "Primal Knowledge",
				source: [["SRD24", 29], ["P24", 52]],
				minlevel: 3,
				description: '\nI gain proficiency in one more Barbarian skill. Use the "Choose Feature" button above to select Animal Handling, Athletics, Intimidation, Nature, Perception, or Survival.\nWhile Raging, I can use Strength for my Acrobatics, Intimidation, Perception, Stealth, and Survival checks even if they normally use a different ability.',
				choices: ["Animal Handling", "Athletics", "Intimidation", "Nature", "Perception", "Survival"],
				"animal handling": {
					name: "Primal Knowledge: Animal Handling",
					description: '\nWhile Raging, I can use Strength for my Acrobatics, Intimidation, Perception, Stealth, and Survival checks even if they normally use a different ability. I gain Animal Handling ' + (typePF ? 'proficiency.' : 'prof.'),
					skills: ["Animal Handling"],
				},
				"athletics": {
					name: "Primal Knowledge: Athletics",
					description: '\nWhile Raging, I can use Strength for my Acrobatics, Intimidation, Perception, Stealth, and Survival checks even if they normally use a different ability. I gain Athletics proficiency.',
					skills: ["Athletics"],
				},
				"intimidation": {
					name: "Primal Knowledge: Intimidation",
					description: '\nWhile Raging, I can use Strength for my Acrobatics, Intimidation, Perception, Stealth, and Survival checks even if they normally use a different ability. I gain Intimidation proficiency.',
					skills: ["Intimidation"],
				},
				"nature": {
					name: "Primal Knowledge: Nature",
					description: '\nWhile Raging, I can use Strength for my Acrobatics, Intimidation, Perception, Stealth, and Survival checks even if they normally use a different ability. I gain Nature proficiency.',
					skills: ["Nature"],
				},
				"perception": {
					name: "Primal Knowledge: Perception",
					description: '\nWhile Raging, I can use Strength for my Acrobatics, Intimidation, Perception, Stealth, and Survival checks even if they normally use a different ability. I gain Perception proficiency.',
					skills: ["Perception"],
				},
				"survival": {
					name: "Primal Knowledge: Survival",
					description: '\nWhile Raging, I can use Strength for my Acrobatics, Intimidation, Perception, Stealth, and Survival checks even if they normally use a different ability. I gain Survival proficiency.',
					skills: ["Survival"],
				},
			},
			"fast movement" : {
				name: "Fast Movement",
				source: [["SRD24", 29], ["P24", 53]],
				minlevel: 5,
				description: "\nMy speed increases by 10 ft while I'm not wearing Heavy armor.",
				speed: { allModes: "+10" },
			},
			"feral instinct": {
				name: "Feral Instinct",
				source: [["SRD24", 29], ["P24", 53]],
				minlevel: 7,
				description: "\nI have Advantage on Initiative rolls because my instincts are so honed.",
				advantages: [["Initiative", true]],
			},
			"brutal strike": { // includes the level 13 and 17 Improved Brutal Strike features
				name: "Brutal Strike",
				source: [["SRD24", 29], ["P24", 53]],
				minlevel: 9,
				description: levels.map(function (n) {
					var multiplier = n < 17 ? 1 : 2;
					var effects = multiplier + ' effect';
					if (multiplier > 1) effects += 's';
					var description = [
						"\nIf I use Reckless Attack, I can forgo any Advantage on one Strength-based attack on my turn that doesn't have Disadvantage. On a hit, it does +" + multiplier + "d10 damage and " + effects + " below:",
						" \u2022 **Forceful Blow**. The target is pushed 15 ft straight away from me. I can then move\n   half my Speed straight toward the target without provoking Opportunity Attacks.",
						" \u2022 **Hamstring Blow**. The target has -15 ft Speed until the start of my next turn.\n   A target can only be affected by the most recent Hamstring Blow, they're not cumulative.",
					];
					if (n >= 13) {
						description.push(" \u2022 **Staggering Blow**. The target has Disadvantage on their next saving throw,\n   and it can't make Opportunity Attacks until the start of my next turn.");
						description.push(" \u2022 **Sundering Blow**. +5 on the next attack roll against the target made by another\n   creature before the start of my next turn. An attack can gain this bonus only once.");
					}
					return description.join("\n");
				}),
				additional: levels.map(function (n) {
					return n < 17 ? '+1d10 damage, 1 effect' : '+2d10 damage, 2 effects';
				}),
			},
			"relentless rage" : {
				name : "Relentless Rage",
				source: [["SRD24", 30], ["P24", 53]],
				minlevel : 11,
				description: "\nWhile Raging, if I drop to 0 HP and don't die, I can make a DC 10 Con save to instead have twice my Barbarian level HP. Each attempt adds +5 DC. DC resets to 10 after a Short Rest.",
				additional: levels.map(function (n) {
					return (n * 2) + " HP";
				}),
				usages: "DC 10 +5/try per ",
				recovery: "Short Rest",
				usagescalc: "var FieldNmbr = parseFloat(event.target.name.slice(-2)); var usages = Number(What('Limited Feature Used ' + FieldNmbr)); var DCval = Number(usages * 5 + 10); event.value = isNaN(usages) || isNaN(DCval) ? 'DC\u2003\u2003' : 'DC ' + DCval;",
			},
			"persistent rage": {
				name: "Persistent Rage",
				source: [["SRD24", 30], ["P24", 53]],
				minlevel: 15,
				description: "\nOnce per long rest when I roll initiative, I can regain all my expended uses of Rage.\nMy Rage now only ends early if I choose to end it, fall Unconscious, or don Heavy armor.",
				additional: "regain Rage uses",
				usages: 1,
				recovery: "Long Rest",
			},
			"indomitable might": {
				name: "Indomitable Might",
				source: [["SRD24", 30], ["P24", 53]],
				minlevel: 18,
				description: "\nIf a Strength check or save is lower than my Strength score, I can use the score instead."
			},
			"primal champion": {
				name: "Primal Champion",
				source: [["SRD24", 30], ["P24", 53]],
				minlevel: 20,
				description: "\nMy Strength and Constitution scores increase by 4, to a maximum of 25.",
				scores:        [ 4, 0,  4, 0, 0, 0],
				scoresMaximum: [25, 0, 25, 0, 0, 0],
			},
		}
	},
/*
	"bard": {
		regExpSearch: /(bard|minstrel|troubadour|jongleur)/i,
		name: "Bard",
		source: [["SRD24", 31], ["P24", 59]],
		primaryAbility: "Charisma",
		abilitySave: 6,
		prereqs: "Charisma 13",
		improvements: [0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 5, 5],
		die: 8,
		save: ["Dex", "Cha"],
		skillstxt: {
			primary:   "Choose any 3 skills.",
			secondary: "Choose any 1 skill.",
		},
		toolProfs: {
			primary:   [["Musical instrument", 3]],
			secondary: [["Musical instrument", 1]],
		},
		armorProfs: {
			primary:   [true, false, false, false],
			secondary: [true, false, false, false],
		},
		weaponProfs: {
			primary: [true, false],
		},
		startingEquipment: [{
			gold: 19,
			pack: "entertainer",
			equipright: [
				["Leather armor", "", 10],
				["Dagger", 2, 1],
				["Musical Instrument of my choice", "", ""],
			],
			equip1stPage: {
				armor: "Leather",
				weapons: ["Dagger", "Dagger (off-hand)"],
			},
		}, {
			gold: 90,
		}],
		subclasses: ["Bard Subclass", ["bard-lore"]],
		spellcastingFactor: 1,
		spellcastingKnown: {
			cantrips: [2, 2, 2, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
			spells: [4, 5, 6, 7, 9, 10, 11, 12, 14, 15, 16, 16, 17, 17, 18, 18, 19, 20, 21, 22],
		},
		features: {
			"bardic inspiration" : {
				name : "Bardic Inspiration",
				source: [["SRD24", 31], ["P24", 59]],
				minlevel : 1,
				description : desc([
					"As a bonus action, I give a creature in 60 ft that can hear me an inspiration die (max 1)",
					"For 10 min, the recipient can add it to one ability check, attack roll, or saving throw",
					"This addition can be done after seeing the d20 roll, but before knowing the outcome"
				]),
				additional : ["d6", "d6", "d6", "d6", "d8", "d8", "d8", "d8", "d8", "d10", "d10", "d10", "d10", "d10", "d12", "d12", "d12", "d12", "d12", "d12"],
				usages : "Charisma modifier per ",
				usagescalc : "event.value = Math.max(1, What('Cha Mod'));",
				recovery : levels.map(function (n) {
					return n < 5 ? "long rest" : "short rest";
				}),
				action : [["bonus action", ""]]
			},
			"spellcasting": {
				name: "Spellcasting",
				source: [["SRD24", 31], ["P24", 59]],
				minlevel: 1,
				description: "\nI can cast Bard cantrips/spells I know, using Cha as my spellcasting ability. I can use Musical Instruments as Spellcasting Focus for them. I can swap 1 cantrip \x26 spell when I gain a level.",
				additional: levels.map(function (n, idx) {
					var cantrips = [2, 2, 2, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4][idx];
					var spells = [4, 5, 6, 7, 9, 10, 11, 12, 14, 15, 16, 16, 17, 17, 18, 18, 19, 20, 21, 22][idx];
					return cantrips + " cantrips \x26 " + spells + " spells known";
				}),
			},
			"expertise": function() {
				var a = {
					name: "Expertise",
					source: [["SRD24", 32], ["P24", 60]],
					minlevel: 2,
					description: "\nI gain Expertise with two skills I am proficient with, and two more at 9th level.",
					skillstxt: "Expertise with any two skill proficiencies, and two more at 9th level",
					additional: levels.map(function (n) {
						return n < 2 ? "" : "with " + (n < 9 ? 2 : 4) + " skills";
					}),
					extraTimes: levels.map(function (n) { return n < 2 ? 0 : n < 9 ? 2 : 4; }),
					extraname: "Expertise",
					extrachoices: ["Acrobatics", "Animal Handling", "Arcana", "Athletics", "Deception", "History", "Insight", "Intimidation", "Investigation", "Medicine", "Nature", "Perception", "Performance", "Persuasion", "Religion", "Sleight of Hand", "Stealth", "Survival"],
				}
				for (var i = 0; i < a.extrachoices.length; i++) {
					a[a.extrachoices[i].toLowerCase()] = {
						name: a.extrachoices[i],
						skills: [[a.extrachoices[i], "only"]],
						prereqeval: function(v) {
							return v.skillProfsLC.indexOf(v.choice) === -1 ? false : v.skillExpertiseLC.indexOf(v.choice) === -1 ? true : "markButDisable";
						},
					}
				}
				return a;
			}(),
			"jack of all trades" : {
				name : "Jack of All Trades",
				source: [["SRD24", 32], ["P24", 60]],
				minlevel : 2,
				description : desc("I can add half my Proficiency Bonus to any ability check that doesn't already include it"),
				eval : function() { Checkbox('Jack of All Trades', true); },
				removeeval : function() { Checkbox('Jack of All Trades', false); }
			},
			"subclassfeature3": {
				name: "Bard Subclass",
				source: [["SRD24", 32], ["P24", 60]],
				minlevel: 3,
				description: '\nChoose a Bard Subclass using the "Class" button/bookmark or type its name into the "Class" field.',
			},
			"font of inspiration": {
				name: "Font of Inspiration",
				source: [["SRD24", 32], ["P24", 61]],
				minlevel: 5,
				description : desc("I can now also recover my expended Bardic Inspiration uses after a short rest")
			},
			"countercharm" : {
				name : "Countercharm",
				source : [["SRD", 13], ["P", 54]],
				minlevel : 6,
				description : desc([
					"As an action, I can do a performance that lasts until the end of my next turn",
					"While it lasts, any friend in earshot \x26 30 ft has adv. on saves vs. frightened/charmed"
				]),
				action : [["action", ""]]
			},
			"magical secrets" : {
				name : "Magical Secrets",
				source : [["SRD", 13], ["P", 54]],
				minlevel : 10,
				description : desc("I can add two spells/cantrips from any class to my spells known; +2 at level 14 \x26 18"),
				additional : levels.map(function (n) {
					return n < 10 ? "" : (n < 14 ? 2 : n < 18 ? 4 : 6) + " spells/cantrips";
				}),
				spellcastingBonus : [{
					name : "Magical Secret",
					"class" : "any",
					times : levels.map(function (n) {
						return n < 10 ? 0 : n < 14 ? 2 : n < 18 ? 4 : 6;
					})
				}]
			},
			"superior inspiration" : {
				name : "Superior Inspiration",
				source : [["SRD", 13], ["P", 54]],
				minlevel : 20,
				description : desc("I regain one use of Bardic Inspiration if I have no more remaining when I roll initiative")
			}
		}
	},
*/
	"cleric": {
		regExpSearch: /cleric|priest|clergy|acolyte/i,
		name: "Cleric",
		source: [["SRD24", 36], ["P24", 69]],
		primaryAbility: "Wisdom",
		abilitySave: 5,
		prereqs: "Wisdom 13",
		improvements: [0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 5, 5],
		die: 8,
		saves: ["Wis", "Cha"],
		skillstxt: {
			primary: "Choose 2: History, Insight, Medicine, Persuasion, or Religion.",
		},
		armorProfs: {
			primary:   [true, true, false, true],
			secondary: [true, true, false, true],
		},
		weaponProfs: {
			primary: [true, false],
		},
		startingEquipment: [{
			gold: 7,
			pack: "priest",
			equipright: [
				["Chain shirt", "", 20],
				["Shield", "", 6],
				["Mace", "", 4],
				["Holy Symbol of my choice", "", ""],
			],
			equip1stPage: {
				armor: "Chain Shirt",
				shield: "Shield",
				weapons: ["Mace"],
			},
		}, {
			gold: 110,
		}],
		subclasses: ["Cleric Subclass", ["cleric-life"]],
		spellcastingFactor: 1,
		spellcastingKnown: {
			cantrips: [3, 3, 3, 4, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
			spells: "list",
			prepared: [4, 5, 6, 7, 9, 10, 11, 12, 14, 15, 16, 16, 17, 17, 18, 18, 19, 20, 21, 22],
		},
		features: {
			"spellcasting": {
				name: "Spellcasting",
				source: [["SRD24", 36], ["P24", 69]],
				minlevel: 1,
				description: "\nI can cast known/prepared Cleric cantrips/spells, using Wisdom as my spellcasting ability. I can use a Holy Symbol as a Spellcasting Focus for them. I can swap out 1 cantrip whenever I gain a Cleric level and change all my prepared Cleric spells whenever I finish a Long Rest.",
				additional: levels.map(function (n, idx) {
					var cantrips = [3, 3, 3, 4, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5][idx];
					var spells = [4, 5, 6, 7, 9, 10, 11, 12, 14, 15, 16, 16, 17, 17, 18, 18, 19, 20, 21, 22][idx];
					return cantrips + " cantrips known \x26 " + spells + " spells to prepare";
				}),
			},
			"divine order": {
				name: "Divine Order",
				source: [["SRD24", 37], ["P24", 70]],
				minlevel: 1,
				description: '\nSelect a Divine Order using the "Choose Feature" button above.',
				choices: ["Protector", "Thaumaturge"],
				"protector": {
					name: "Protector Divine Order",
					description: '\nI gain proficiency with Martial weapons and training with Heavy armor.',
					armorProfs: [false, false, true, false],
					weaponProfs: [false, true],
				},
				"thaumaturge": {
					name: "Thaumaturge Divine Order",
					description: '\nI add my Wis mod to my Int (Arcana or Religion) checks and know one extra Cleric cantrip.',
					addMod: [
						{type: "skill", field: "Arcana", mod: "max(Wis|1)", text: "I add my Wisdom modifier (minimum +1) to my Intelligence (Arcana) checks."},
						{type: "skill", field: "Religion", mod: "max(Wis|1)", text: "I add my Wisdom modifier (minimum +1) to my Intelligence (Religion) checks."},
					],
					spellcastingBonus: [{
						name: "Thaumaturge Divine Order",
						"class": ["cleric"],
						level: [0, 0],
					}],
				},
			},
			"channel divinity": {
				name: "Channel Divinity",
				source: [["SRD24", 37], ["P24", 70]],
				minlevel: 2,
				description: "\nI regain one use on a Short Rest. Effects use my Cleric spell save DC. See options below.",
				usages: [0, 2, 2, 2, 2, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 3, 4, 4, 4],
				recovery: "Long Rest",
				additional: "regain 1/SR",
			},
			"divine spark": {
				name: "Divine Spark",
				source: [["SRD24", 37], ["P24", 70]],
				minlevel: 2,
				description: levels.map(function (n) {
					var dice = n < 7 ? 1 : n < 13 ? 2 : n < 18 ? 3 : 4;
					return "\nAs a Magic action, I can expend a use of Channel Divinity to focus divine energy on another I can see within 30 ft. I either restore " + dice + "d8 + my Wisdom modifier of its HP or deal that in Necrotic or Radiant damage (my choice). It can make a Constitution save for half damage.";
				}),
				action: [["action", "Divine Spark (Channel Divinity)"]],
				additional: levels.map(function (n) {
					return n < 2 ? "" : (n < 7 ? 1 : n < 13 ? 2 : n < 18 ? 3 : 4) + "d8 + Wisdom modifier";
				}),
			},
			"turn undead": {
				name: "Turn Undead",
				source: [["SRD24", 37], ["P24", 70]],
				minlevel: 2,
				description: levels.map(function (n) {
					var txt = "\nAs a Magic action, I can expend a use of Channel Divinity to have all chosen undead within 30 ft make a Wisdom save or be Frightened, Incapacitated, and move as far from me as it can on its turns. This lasts for 1 minute or until it takes damage, I'm Incapacitated, or I die.";
					if (n >= 5) txt += "\nIf it fails its save, it also takes my Wisdom modifier (min 1) number of d8s Radiant damage.";
					return txt;
				}),
				action: [["action", "Turn Undead (Channel Divinity)"]],
				additional: levels.map(function (n) {
					// from Sear Undead
					return n < 5 ? "" : "Wis mod d8s Radiant " + (typePF ? "dmg" : "damage");
				}),
			},
			"subclassfeature3": {
				name: "Cleric Subclass",
				source: [["SRD24", 37], ["P24", 71]],
				minlevel: 3,
				description: '\nChoose a Cleric Subclass using the "Class" button/bookmark or type its name into the "Class" field.',
			},
			"sear undead": {
				name: "Sear Undead",
				source: [["SRD24", 37], ["P24", 71]],
				minlevel: 5,
				description: " [Turn Undead deals damage]",
			},
			"blessed strikes": {
				name: "Blessed Strikes",
				source: [["SRD24", 38], ["P24", 71]],
				minlevel: 7,
				description: '\nSelect a Blessed Strikes option using the "Choose Feature" button above.',
				choices: ["Divine Strike", "Potent Spellcasting"],
				"divine strike": {
					name: "Divine Strike",
					description: levels.map(function (n) {
						var dice = n < 14 ? 1 : 2;
						return n < 7 ? "" : "\nOnce per turn I can deal +" + dice + "d8 Radiant/Necrotic damage to a creature I hit with a weapon.";
					}),
					additional: levels.map(function (n) {
						return n < 7 ? "" : "+" + (n < 14 ? 1 : 2) + "d8 Radiant or Necrotic damage";
					}),
					calcChanges : {
						atkAdd : [
							function (fields, v) {
								if (classes.known.cleric && v.isWeapon && !v.isDC) {
									fields.Description += (fields.Description ? '; ' : '') + '1/turn +' + (classes.known.cleric.level < 14 ? 1 : 2) + 'd8 Radiant/Necrotic damage';
								}
							},
							"Once per turn when I hit a creature with an attack roll using a weapon, I can deal the target extra Necrotic or Radiant damage (my choice).",
						],
					},
				},
				"potent spellcasting": {
					name: "Potent Spellcasting",
					description: levels.map(function (n) {
						return n < 14 ? "\nI add my Wisdom modifier to the damage I deal with my Cleric cantrips." : "\nMy Cleric cantrips get my Wisdom modifier added to their damage. When I deal damage with one, I can grant myself or a creature within 60 ft twice my Wisdom mod in Temp " + (typePF ? "Hit Points." : "HP.");
					}),
					calcChanges: {
						atkCalc: [
							function (fields, v, output) {
								if (v.thisWeapon[3] && /\bcleric\b/.test(v.thisWeapon[4]) && SpellsList[v.thisWeapon[3]].level === 0 && /\d/.test(fields.Damage_Die)) {
									output.extraDmg += Number(What('Wis Mod'));
								};
							},
							"My Cleric cantrips get my Wisdom modifier added to their damage.",
						],
						spellAdd: [
							function (spellKey, spellObj, spName) {
								var wisMod = Number(What("Wis Mod"));
								if (spellObj.psionic || spellObj.level !== 0 || spName.indexOf("cleric") == -1 || wisMod <= 0) return;
								return genericSpellDmgEdit(spellKey, spellObj, "\\w+\\.?", wisMod);
							},
							"My cleric cantrips get my Wisdom modifier added to their damage.",
						],
					},
				},
				choiceDependencies: [{
					feature: "improved blessed strikes",
				}],
			},
			"divine intervention": {
				name: "Divine Intervention",
				source: [["SRD24", 38], ["P24", 71]],
				minlevel: 10,
				description: "\nAs a Magic action, I can cast one Cleric spell of level 5 or lower of my choice that doesn't require a Reaction to cast. I cast it without requiring a spell slot or Material components.",
				action: [["action", ""]],
				usages: 1,
				recovery: "Long Rest",
			},
			"improved blessed strikes": {
				name: "Improved Blessed Strikes",
				source: [["SRD24", 38], ["P24", 71]],
				minlevel: 14,
				description: '\nSelect a Blessed Strikes option using the "Choose Feature" button above.',
				choices: ["divine strike", "potent spellcasting"],
				choicesNotInMenu: true,
				"divine strike": {
					name: "Improved Divine Strike",
					description: " [damage increases to 2d8]",
				},
				"potent spellcasting": {
					name: "Improved Potent Spellcasting",
					description: " [grants Temporary Hit Points]",
				},
			},
			"greater divine intervention": {
				name: "Greater Divine Intervention",
				source: [["SRD24", 38], ["P24", 71]],
				minlevel: 20,
				description: desc([
					"When I use Divine Intervention, I can choose Wish when I select a spell.",
					"If I do so, I can't use Divine Intervention again until I finish 2d4 Long Rests.",
				], "\n"),
			},
		},
	},
/*
	"druid": {
		regExpSearch: /druid|shaman/i,
		name: "Druid",
		source: [["SRD24", 41], ["P24", 79]],
		primaryAbility: "Wisdom",
		abilitySave: 5,
		prereqs: "Wisdom 13",
		improvements: [0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 5, 5],
		die: 8,
		saves: ["Int", "Wis"],
		skillstxt: {
			primary: "Choose 2: Arcana, Animal Handling, Insight, Medicine, Nature, Perception, Religion, or Survival.",
		},
		toolProfs: {
			primary: ["Herbalism kit"],
		},
		armorProfs: {
			primary:   [true, false, false, true],
			secondary: [true, false, false, true],
		},
		weaponProfs: {
			primary: [true, false],
		},
		startingEquipment: [{
			gold: 9,
			pack: "explorer",
			equipleft: [
				["Herbalism kit", "", 3],
			],
			equipright: [
				["Leather armor", "", 10],
				["Shield", "", 6],
				["Sickle", "", 2],
				["Wooden staff druidic focus", "", 4],
			],
			equip1stPage: {
				armor: "Leather",
				shield: "Shield",
				weapons: ["Sickle", "Quarterstaff"],
			},
		}, {
			gold: 50,
		}],
		subclasses: ["Druid Subclass", ["druid-land"]],
		spellcastingFactor: 1,
		spellcastingKnown: {
			cantrips: [2, 2, 2, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
			spells: "list",
			prepared: [4, 5, 6, 7, 9, 10, 11, 12, 14, 15, 16, 16, 17, 17, 18, 18, 19, 20, 21, 22],
		},
		features: {
			"spellcasting": {
				name: "Spellcasting",
				source: [["SRD24", 41], ["P24", 79]],
				minlevel: 1,
				description: "\nI can cast known/prepared Druid cantrips/spells, using Wisdom as my spellcasting ability. I can use a Druidic Focus as a Spellcasting Focus for them. I can swap out 1 cantrip whenever I gain a Druid level and change all my prepared Druid spells whenever I finish a Long Rest.",
				additional: levels.map(function (n, idx) {
					var cantrips = [2, 2, 2, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4][idx];
					var spells = [4, 5, 6, 7, 9, 10, 11, 12, 14, 15, 16, 16, 17, 17, 18, 18, 19, 20, 21, 22][idx];
					return cantrips + " cantrips known \x26 " + spells + " spells to prepare";
				}),
			},
			"druidic": { // nog niet klaar
				name: "Druidic",
				source: [["SRD24", 42], ["P24", 80]],
				minlevel: 1,
				description : desc("I know Druidic; Hidden messages with it are only understood by those who know Druidic"),
				languageProfs: ["Druidic"]
			},
			"subclassfeature2.wild shape" : {
				name : "Wild Shape",
				source : [["SRD", 20], ["P", 66]],
				minlevel : 2,
				description : desc([
					"As an action, I assume the shape of a beast I have seen before with the following rules:",
					" \u2022 I gain all its game statistics except Intelligence, Wisdom, or Charisma",
					" \u2022 I get its skill/saving throw prof. while keeping my own, using whichever is higher",
					" \u2022 I assume the beast's HP and HD; I get mine back when I revert back",
					" \u2022 I can't cast spells in beast form, but transforming doesn't break concentration",
					" \u2022 I retain features from class, race, etc., but I don't retain special senses",
					" \u2022 I can choose whether equipment falls to the ground, merges, or stays worn",
					" \u2022 I revert if out of time or unconscious; if KOd by damage, excess damage carries over"
				]),
				usages : [0, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, "\u221E\xD7 per "],
				recovery : "Short Rest",
				additional : levels.map(function (n) {
					if (n < 2) return "";
					var cr = n < 4 ? "1/4" : n < 8 ? "1/2" : 1;
					var hr = Math.floor(n/2);
					var restr = n < 4 ? ", no fly/swim" : n < 8 ? ", no fly" : "";
					return "CR " + cr + restr + "; " + hr + (restr.length ? " h" : " hours");
				}),
				action : [["action", " (start)"], ["bonus action", " (end)"]]
			},
			"subclassfeature3": {
				name: "Druid Subclass",
				source: [["SRD24", 43], ["P24", 81]],
				minlevel: 3,
				description: '\nChoose a Druid Subclass using the "Class" button/bookmark or type its name into the "Class" field.',
			},
			"timeless body" : {
				name : "Timeless Body",
				source : [["SRD", 21], ["P", 67]],
				minlevel : 18,
				description : desc("I age more slowly, only 1 year for every 10 years that pass")
			},
			"beast spells" : {
				name : "Beast Spells",
				source : [["SRD", 21], ["P", 67]],
				minlevel : 18,
				description : desc("I can perform the somatic and verbal components of druid spells while in a beast shape")
			},
			"archdruid" : {
				name : "Archdruid",
				source : [["SRD", 21], ["P", 67]],
				minlevel : 20,
				description : desc([
					"I can use Wild Shape an unlimited number of times",
					"My druid spells don't require verbal, somatic, or free material components"
				]),
				calcChanges : {
					spellAdd : [
						function (spellKey, spellObj, spName) {
							if (spName == "druid") {
								if (spellObj.compMaterial && !(/M[\u0192\u2020]/i).test(spellObj.components)) spellObj.compMaterial = "";
								spellObj.components = spellObj.components.replace(/V,?|S,?|M$/ig, '');
								return true;
							};
						},
						"My druid spells don't require verbal, somatic, or material components."
					]
				}
			}
		}
	},
*/
	"fighter": {
		regExpSearch: /fighter/i,
		name: "Fighter",
		source: [["SRD24", 47], ["P24", 91]],
		primaryAbility: "Strength or Dexterity",
		prereqs: "Strength 13 or Dexterity 13",
		die: 10,
		improvements: [0, 0, 0, 1, 1, 2, 2, 3, 3, 3, 3, 4, 4, 5, 5, 6, 6, 6, 7, 7],
		saves: ["Str", "Con"],
		skillstxt: {
			primary: "Choose 2: Acrobatics, Animal Handling, Athletics, History, Insight, Intimidation, Persuasion, Perception, or Survival."
		},
		armorProfs: {
			primary:   [true, true, true,  true],
			secondary: [true, true, false, true],
		},
		weaponProfs: {
			primary:   [true,  true],
			secondary: [false, true],
		},
		startingEquipment: [{
			gold: 4,
			pack: "dungeoneer",
			equipright: [
				["Chain mail", "", 55],
				["Greatsword", "", 6],
				["Flail", "", 2],
				["Javelins", 8, 2],
			],
			equip1stPage: {
				armor: "Chain Mail",
				weapons: ["Greatsword", "Flail", "Javelin"],
				ammo: [["Javelins", 8]],
			},
		}, {
			gold: 11,
			pack: "dungeoneer",
			equipright: [
				["Studded leather armor", "", 13],
				["Scimitar", "", 3],
				["Shortsword", "", 2],
				["Longbow", "", 2],
				["Quiver, with:", "", 2],
				["Arrows", 20, 0.05],
			],
			equip1stPage: {
				armor: "Studded Leather",
				weapons: ["Longbow", "Scimitar", "Shortsword"],
				ammo: [["Arrows", 20]],
			},
		}, {
			gold: 155,
		}],
		subclasses: ["Fighter Subclass", ["fighter-champion"]],
		attacks: levels.map(function (n) { return n < 5 ? 1 : n < 11 ? 2 : n < 20 ? 3 : 4; }),
		features: {
			"fighting style": {
				name: "Fighting Style",
				source: [["SRD24", 47], ["P24", 91]],
				minlevel: 1,
				description: '\nChoose a Fighting Style Feat using the "Choose Feature" button above.\nI can swap this fighting style for another whenever I gain a Fighter level.',
				choicesFightingStyles: {
					description: '\nI can swap this fighting style for another whenever I gain a Fighter level.',
				},
			},
			"second wind": {
				name: "Second Wind",
				source: [["SRD24", 48], ["P24", 91]],
				minlevel: 1,
				description: "\nAs a bonus action, I regain 1d10 + my Fighter level HP.",
				additional: levels.map(function (n) { return "1d10+" + n + ", regain 1/SR"; }),
				usages: levels.map(function (n) { return n < 4 ? 2 : n < 10 ? 3 : 4; }),
				recovery: "Long Rest",
				action: [["bonus action", ""]],
			},
			"weapon mastery": {
				name: "Weapon Mastery",
				source: [["SRD24", 48], ["P24", 91]],
				minlevel: 1,
				description: '\nI gain mastery with a number of Simple/Martial weapons. Whenever I finish a Long Rest,\nI can change one of these choices. Use the "Choose Feature" button above to select them.',
				additional: levels.map(function (n) {
					return (n < 4 ? 3 : n < 10 ? 4 : n < 16 ? 5 : 6) + " Weapon Masteries";
				}),
				extraTimes: levels.map(function (n) { return n < 4 ? 3 : n < 10 ? 4 : n < 16 ? 5 : 6; }),
				extraname: "Weapon Mastery",
				choicesWeaponMasteries: true,
			},
			"action surge": {
				name: "Action Surge",
				source: [["SRD24", 48], ["P24", 91]],
				minlevel: 2,
				description: levels.map(function (n) {
					return "\nOn my turn I can take an additional action, except the Magic action." + (n < 17 ? '' : " Only once per turn.");
				}),
				usages: levels.map(function (n) { return n < 2 ? 0 : n < 17 ? 1 : 2; }),
				recovery: "Short Rest",
			},
			"tactical mind": {
				name: "Tactical Mind",
				source: [["SRD24", 48], ["P24", 91]],
				minlevel: 2,
				description: "\nIf I fail an ability check, I can expend a Second Wind to add 1d10. If still fail, not expended.",
			},
			"subclassfeature3" : {
				name: "Fighter Subclass",
				source: [["SRD24", 48], ["P24", 92]],
				minlevel: 3,
				description: '\nChoose a Fighter Subclass using the "Class" button/bookmark or type its name into the "Class" field.',
			},
			"tactical shift": {
				name: "Tactical Shift",
				source: [["SRD24", 48], ["P24", 92]],
				minlevel: 5,
				description: "\nWhen I use Second Wind, I can move half my speed without provoking Opportunity Attacks.",
			},
			"indomitable": {
				name: "Indomitable",
				source: [["SRD24", 48], ["P24", 92]],
				minlevel: 9,
				description: "\nI can reroll a failed saving throw and add my Fighter level, but must keep the new result.",
				usages: levels.map(function (n) { return n < 9 ? 0 : n < 13 ? 1 : n < 17 ? 2 : 3; }),
				recovery: "Long Rest",
			},
			"studied attacks": {
				name: "Studied Attacks",
				source: [["SRD24", 48], ["P24", 92]],
				minlevel: 13,
				description: "\nIf I miss an attack, I have Adv. on next attack vs. same creature before my next turn ends.",
			},
		},
	},

	"monk": {
		regExpSearch: /^((?=.*(monk|monastic))|(((?=.*martial)(?=.*(artist|arts)))|((?=.*spiritual)(?=.*warrior)))).*$/i,
		name: "Monk",
		source: [["SRD24", 49], ["P24", 101]],
		primaryAbility: "Dexterity and Wisdom",
		abilitySave: 5,
		prereqs: "Dexterity 13 and Wisdom 13",
		die: 8,
		improvements: [0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 5, 5],
		saves: ["Str", "Dex"],
		toolProfs: {
			primary: [["Artisan's tool or Musical instrument", 1]],
		},
		skillstxt: {
			primary: "Choose 2: Acrobatics, Athletics, History, Insight, Religion, or Stealth.",
		},
		weaponProfs: {
			primary: [true, false, ["Light Martial Weapons"]],
		},
		startingEquipment: [{
			gold: 11,
			pack: "explorer",
			equipright: [
				["Spear", "", 3],
				["Daggers", 5, 1],
				["Choice of Artisan's Tools or Musical Instrument I'm proficient with", "", ""],
			],
			equip1stPage: {
				weapons: ["Spear", "Dagger"],
				ammo: [["Daggers", 5]],
			},
		}, {
			gold: 50,
		}],
		subclasses : ["Monastic Tradition", []], //["monk-open hand"]],
		attacks: [1, 1, 1, 1, 2],
		features: {
			"martial arts": {
				name: "Martial Arts",
				source: [["SRD24", 50], ["P24", 101]],
				minlevel: 1,
				description: desc([
					"Monk weapons: Unarmed Strike, Simple Melee weapons, and Light Martial Melee weapons.",
					"When wielding only Monk weapons and no armor or shield, I can use Dex instead of Str, use my Martial Arts die instead of the weapon's, and do an Unarmed Strike as a Bonus Action.",
				], "\n"),
				additional: levels.map(function (n) {
					var die = n < 5 ? 6 : n < 11 ? 8 : n < 17 ? 10 : 12;
					return "1d" + die;
				}),
				action : [["bonus action", "Unarmed Strike"]],
				calcChanges: {
					atkAdd: [
						function (fields, v) {
							// Stop if no Monk levels are present
							if (!classes.known.monk || !classes.known.monk.level) return;
							// Mark light martial weapons as proficient if Monk is the primary class
							var isLightMartial = /martial/i.test(v.theWea.type) && /\blight\b/i.test(fields.Description);
							if ( classes.primary === "monk" && !fields.Proficiency && isLightMartial ) {
								fields.Proficiency = true;
							};
							// The rest is for Monk weapons, so stop if explicitly set to false
							if ( v.theWea.monkweapon === false ) return;
							// Change damage die and used ability if a Monk weapon
							if ( v.theWea.monkweapon || ( v.isMeleeWeapon && ( isLightMartial || /simple/i.test(v.theWea.type) ) ) ) {
								v.theWea.monkweapon = true;
								// Improve the damage die if there is one and the Martial Arts die is better
								var aMonkDie = function (n) { return n < 5 ? 6 : n < 11 ? 8 : n < 17 ? 10 : 12; }(classes.known.monk.level);
								var rxDice = /(\d+)d?(\d*)/i;
								if (rxDice.test(fields.Damage_Die)) {
									var curDie = fields.Damage_Die.match(rxDice);
									var curDieSize = Math.max(Number(curDie[1]), 1) * Math.max(Number(curDie[2]), 1);
									if (curDieSize < aMonkDie) {
										fields.Damage_Die = fields.Damage_Die.replace(curDie[0], '1d' + aMonkDie);
									}
								}
								// Set the ability to the highest of Str and Dex, if currently one of those
								if (fields.Mod === 1 || fields.Mod === 2 || What(AbilityScores.abbreviations[fields.Mod - 1] + " Mod") < What(AbilityScores.abbreviations[v.StrDex - 1] + " Mod")) {
									fields.Mod = v.StrDex;
								}
							};
						},
						"I can use either Strength or Dexterity and my Martial Arts damage die in place of the normal damage die for any 'Monk Weapons', which include Unarmed Strike, Simple melee weapons, and Martial melee weapons with the Light property.",
						5
					],
				},
			},
			"unarmored defense": {
				name: "Unarmored Defense",
				source: [["SRD24", 50], ["P24", 101]],
				minlevel: 1,
				description: "\nWithout armor and no shield, my AC is 10 + Dexterity modifier + Wisdom modifier.",
				armorOptions: [{
					regExpSearch: /justToAddToDropDownAndEffectWildShape/,
					name: "Unarmored Defense (Wis)",
					source: [["SRD24", 50], ["P24", 101]],
					ac: "10+Wis",
					affectsWildShape: true,
					selectNow: true,
				}],
			},
			"monk's focus": {
				name: "Monk's Focus",
				source: [["SRD24", 50], ["P24", 101]],
				minlevel: 2,
				description: "",
				limfeaname: "Focus Points",
				usages: levels.map(function (n) { return n < 2 ? "" : n }),
				recovery: "Short Rest",
				extraname: "Focus Feature",
				action: [["bonus action", "Dash / Disengage"]],
				"flurry of blows": {
					name: "Flurry of Blows",
					source: [["SRD24", 50], ["P24", 102]],
					description: levels.map(function (n) {
						return "\nAs a Bonus Action, I can make " + (n < 10 ? "two" : "three") + " Unarmed Strikes."
					}),
					additional: "1 Focus Point",
					action: [["bonus action", " (1 FP)"]],
				},
				"patient defense": {
					name: "Patient Defense",
					source: [["SRD24", 50], ["P24", 102]],
					description: levels.map(function (n) {
						return n < 10 ? "\nAs a Bonus Action, I can take the Disengage action. As a Bonus Action, I can expend 1 Focus Point to take both the Disengage and the Dodge actions." : "\nAs a Bonus Action, I can take the Disengage action or, if I expend 1 Focus Point, take both the Disengage and Dodge actions and gain Temp HP equal to 2 rolls of my Martial Arts die.";
					}),
					additional: "0 or 1 Focus Point",
					additional: levels.map(function (n) {
						return n < 10 ? "0 or 1 Focus Point" : "0 or 1 Focus Point; 2d" + (n < 11 ? 8 : n < 17 ? 10 : 12) + " Temp HP";
					}),
					action: [["bonus action", " (Disengage \x26 Dodge; 1 FP)"]],
				},
				"step of the wind": {
					name: "Step of the Wind",
					source: [["SRD24", 51], ["P24", 102]],
					description : desc("As a bonus action, I can either Dash or Disengage; My jump distance doubles when I do so"),
					description: levels.map(function (n) {
						return n < 10 ? "\nAs a Bonus Action, I can take the Dash action. As a Bonus Action, I can " + (typePF ? "expend" : "use") + " 1 Focus Point to take both the Disengage and the Dash actions and double my jump distance for the turn." : "\nAs a Bonus Action, I can take the Dash action. As a Bonus Action, I can expend 1 Focus Point to take both the Disengage and Dash actions, double my jump distance for the turn, and choose a willing Large or smaller creature within 5 ft to move with me until the end of my turn. The creature's movement doesn't provoke Opportunity Attacks.";
					}),
					additional: "0 or 1 Focus Point",
					action: [["bonus action", " (Disengage \x26 Dash; 1 FP)"]],
				},
				autoSelectExtrachoices: [{
					extrachoice: "flurry of blows",
				}, {
					extrachoice: "patient defense",
				}, {
					extrachoice: "step of the wind",
				}],
			},
			"unarmored movement": {
				name: "Unarmored Movement",
				source: [["SRD24", 51], ["P24", 102]],
				minlevel: 2,
				description: "\nMy speed increases while I'm not wearing armor or wielding a shield.",
				additional: levels.map(function (n) {
					var spd = n < 2 ? 0 : n < 6 ? 10 : n < 10 ? 15 : n < 14 ? 20 : n < 18 ? 25 : 30;
					return !spd ? "" : "+" + spd + " ft" + (n < 9 ? "" : "; Vertical surfaces and liquids");
				}),
				changeeval: function (lvl) {
					var n = lvl[1];
					var spd = n < 2 ? 0 : n < 6 ? 10 : n < 10 ? 15 : n < 14 ? 20 : n < 18 ? 25 : 30;
					SetProf('speed', !!spd, {allModes: "+" + spd}, "Monk: Unarmored Movement");
				},
			},
			"uncanny metabolism": {
				name: "Uncanny Metabolism",
				source: [["SRD24", 51], ["P24", 102]],
				minlevel: 2,
				description: "\nWhen I roll initiative, I can regain all Focus Points and heal 1 Martial Arts die + Monk level.",
				usages: 1,
				recovery: "Long Rest",
				additional: levels.map(function (n) {
					if (n < 2) return "";
					var die = n < 5 ? 6 : n < 11 ? 8 : n < 17 ? 10 : 12;
					return "1d" + die + "+" + n;
				}),
			},
			"deflect attacks": {
				name: "Deflect Attacks",
				source: [["SRD24", 51], ["P24", 102]],
				minlevel: 3,
				description: levels.map(function (n) {
					var dmgType = n < 13 ? "Bludgeoning, Piercing, or Slashing " : "";
					var atkOrigin = n < 13 ? "" : "a melee attack or a creature I can see ";
					return "As a Reaction when I take " + dmgType + "damage from an attack roll, I can reduce it by 1d10 + Monk level + my Dex mod. If it's reduced to 0 and it originated from " + atkOrigin + "within 60 ft, I can expend 1 Focus Point to have a creature I can see within 5 ft make a Dex save or take 2\xD7 Martial Arts die + my Dex mod damage of the same type.";
				}),
				action: [["reaction", "Deflect Attack (1 FP to redirect)"]],
				additional: levels.map(function (n) {
					if (n < 3) return "";
					var die = n < 5 ? 6 : n < 11 ? 8 : n < 17 ? 10 : 12;
					var part1 = typePF ? "" : " mod";
					var part2 = typePF ? "" : n < 10 ? " md" : " m";
					return "1d10+" + n + "+Dex" + part1 + "; 1 FP: redirect 2d" + die + "+Dex" + part2;
				}),
			},
			"subclassfeature3": {
				name: "Monk Subclass",
				source: [["SRD24", 51], ["P24", 103]],
				minlevel: 3,
				description: '\nChoose a Monk Subclass using the "Class" button/bookmark or type its name into the "Class" field.',
			},
			"slow fall": {
				name: "Slow Fall",
				source: [["SRD24", 51], ["P24", 103]],
				minlevel: 4,
				description: "\nAs a Reaction when I fall, I can reduce the damage I take from it by " + (typePF ? "five times" : "5\xD7") + " my Monk level.",
				additional : levels.map(function (n) {
					return n < 4 ? "" : (n * 5) + " less falling damage";
				}),
				action : [["reaction", ""]],
			},
			"stunning strike": {
				name: "Stunning Strike",
				minlevel: 5,
				source: [["SRD24", 51], ["P24", 103]],
				extraname: "Focus Feature",
				"stunning strike": {
					name: "Stunning Strike",
					extraname: "Monk 5",
					source: [["SRD24", 51], ["P24", 103]],
					description: "\nOnce per turn when I hit a creature with a Monk weapon, I can expend 1 Focus Point to have it make a Constitution save. *Failure:* it is Stunned. *Success:* its Speed is halved and the next attack against it has Advantage. These effects last until the start of my next turn.",
					additional: "1 Focus Point",
				},
				autoSelectExtrachoices: [{ extrachoice: "stunning strike" }],
			},
			"empowered strikes": {
				name: "Empowered Strikes",
				source: [["SRD24", 51], ["P24", 103]],
				minlevel: 6,
				description: "\nI can deal Force damage with my Unarmed Strike instead of its normal damage type.",
				calcChanges: {
					atkAdd: [
						function (fields, v) {
							if (v.baseWeaponName === "unarmed strike" && DamageTypes[fields.Damage_Type.toLowerCase()] && !/force/i.test(fields.Damage_Type)) {
								var shortOldType = fields.Damage_Type.replace(/(tic|(eon)?ing)$/i, ".").capitalize();
								fields.Damage_Type = shortOldType + '/Force';
							};
						},
						"I can deal Force damage with my Unarmed Strike instead of its normal damage type.",
					],
				},
			},
			"evasion": {
				name: "Evasion",
				source: [["SRD24", 51], ["P24", 103]],
				minlevel: 7,
				description: " [if not Incapacitated]\nWhen I make a Dex save to halve damage, I instead take none if I succeed and half if I fail.",
				savetxt: { text: ["**Dex Save for Half**. *Failure:* half dmg, *Success:* no dmg"] },
			},
			"acrobatic movement": {
				name: "Acrobatic Movement",
				source: [["SRD24", 51], ["P24", 103]],
				minlevel: 9,
				description: "\nIf without armor or shield, I can move on vertical surfaces or across liquids during my turn.",
			},
			"heightened focus": {
				name: "Heightened Focus",
				source: [["SRD24", 51], ["P24", 103]],
				minlevel: 10,
				description: " [improves Focus Features]",
			},
			"self-restoration": {
				name: "Self-Restoration",
				source: [["SRD24", 52], ["P24", 103]],
				minlevel: 10,
				description: "\nAt the end of each of my turns, I can remove the Charmed, Frightened, or Poisoned condition from myself. Forgoing food and drink doesn't give me levels of Exhaustion.",
			},
			"deflect energy": {
				name: "Deflect Energy",
				source: [["SRD24", 52], ["P24", 103]],
				minlevel: 13,
				description: " [improves Deflect Attacks: any damage type]",
			},
			"disciplined survivor": {
				name: "Disciplined Survivor",
				source: [["SRD24", 52], ["P24", 103]],
				minlevel: 14,
				saves: ["Str", "Dex", "Con", "Int", "Wis", "Cha"],
				savetxt: { text: ["**Failed Save**. 1 FP to reroll"] },
				extraname: "Focus Feature",
				"disciplined survivor": {
					name: "Disciplined Survivor",
					extraname: "Monk 14",
					source: [["SRD24", 51], ["P24", 103]],
					description: "\nWhen I fail a save, I can expend 1 Focus Point to reroll it once. I'm proficient in all saves.",
					additional: "1 Focus Point",
				},
				autoSelectExtrachoices: [{ extrachoice: "disciplined survivor" }],
			},
			"perfect focus": {
				name: "Perfect Focus",
				source: [["SRD24", 52], ["P24", 103]],
				minlevel: 15,
				description: "\nWhen I roll Initiative and I have less than 4 Focus Points, I regain them until I have 4.",
			},
			"superior defense": {
				name: "Superior Defense",
				source: [["SRD24", 52], ["P24", 103]],
				minlevel: 18,
				dmgres: ["3FP: all -Force"],
				extraname: "Focus Feature",
				"superior defense": {
					name: "Superior Defense",
					extraname: "Monk 18",
					source: [["SRD24", 52], ["P24", 103]],
					description: "\nAt the start of my turn, I can expend 3 Focus Points to gain Resistance to all types of damage except Force damage for 1 minute, or until I'm Incapacitated.",
					additional: "3 Focus Points",
				},
				autoSelectExtrachoices: [{ extrachoice: "superior defense" }],
			},
			"body and mind": {
				name: "Body and Mind",
				source: [["SRD24", 52], ["P24", 103]],
				minlevel: 20,
				description: " [+4 Dexterity and +4 Wisdom, up to max 25]",
				scores:        [0,  4, 0, 0,  4, 0],
				scoresMaximum: [0, 25, 0, 0, 25, 0],
			},
		},
	},
/*
	"paladin": {
		regExpSearch: /^((?=.*paladin)|((?=.*(exalted|sacred|holy|divine))(?=.*(knight|fighter|warrior|warlord|trooper)))).*$/i,
		name: "Paladin",
		source: [["SRD24", 53], ["P24", 109]],
		primaryAbility: "Strength and Charisma",
		abilitySave: 6,
		prereqs: "Strength 13 and Charisma 13",
		improvements: [0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 5, 5],
		die: 10,
		saves: ["Wis", "Cha"],
		skillstxt: {
			primary: "Choose 2: Athletics, Insight, Intimidation, Medicine, Persuasion, or Religion.",
		},
		armorProfs: {
			primary:   [true, true,  true, true],
			secondary: [true, true, false, true],
		},
		weaponProfs: {
			primary:   [true,  true],
			secondary: [false, true],
		},
		startingEquipment: [{
			gold: 9,
			pack: "priest",
			equipright: [
				["Chain Mail", "", 55],
				["Shield", "", 6],
				["Longsword", "", 3],
				["Javelins", 6, 2],
				["Holy Symbol of my choice", "", ""],
			],
			equip1stPage: {
				armor: "Chain Mail",
				shield: "Shield",
				weapons: ["Longsword", "Javelin"],
				ammo: [["Javelins", 6]],
			},
		}, {
			gold: 150,
		}],
		subclasses : ["Paladin Subclass", ["paladin-devotion"]],
		attacks: [1, 1, 1, 1, 2],
		spellcastingFactor: 2,
		spellcastingKnown: {
			spells: "list",
			prepared: [2, 3, 4, 5, 6, 6, 7, 7, 9, 9, 10, 10, 11, 11, 12, 12, 14, 14, 15, 15],
		},
		spellcastingFactorRoundupMulti: true,
		features: {
			"spellcasting": {
				name: "Spellcasting",
				source: [["SRD24", 54], ["P24", 109]],
				minlevel: 1,
				description: "\nI can cast prepared Paladin spells, using Cha as spellcasting ability. I can use a Holy Symbol as Spellcasting Focus for them. I can change 1 prepared spell whenever I finish a Long Rest.",
				additional: levels.map(function (n, idx) {
					var spells = [2, 3, 4, 5, 6, 6, 7, 7, 9, 9, 10, 10, 11, 11, 12, 12, 14, 14, 15, 15][idx];
					return spells + " spells to prepare";
				}),
			},
			"divine sense" : {
				name : "Divine Sense",
				source : [["SRD", 30], ["P", 84]],
				minlevel : 1,
				description : desc([
					"As an action, I sense celestials/fiends/undead/consecrated/desecrated within 60 ft",
					"Until the end of my next turn, I sense the type/location if it is not behind total cover"
				]),
				usages : "1 + Charisma modifier per ",
				usagescalc : "event.value = 1 + What('Cha Mod');",
				recovery : "Long Rest",
				action : [["action", ""]]
			},
			"lay on hands" : {
				name : "Lay on Hands",
				source : [["SRD", 31], ["P", 84]],
				minlevel : 1,
				description : desc([
					"As an action, I can use points in my pool to heal a touched, living creature's hit points",
					"I can neutralize poisons/diseases instead at a cost of 5 points per affliction"
				]),
				usages : [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100],
				recovery : "Long Rest",
				action : [["action", ""]]
			},
			"fighting style" : {
				name : "Fighting Style",
				source : [["SRD", 31], ["P", 84]],
				minlevel : 2,
				description : desc('Choose a Fighting Style for the paladin using the "Choose Feature" button above'),
				choices : ["Defense", "Dueling", "Great Weapon Fighting", "Protection"],
				"defense" : FightingStyles.defense,
				"dueling" : FightingStyles.dueling,
				"great weapon fighting" : FightingStyles.great_weapon,
				"protection" : FightingStyles.protection
			},
			"divine smite" : {
				name : "Divine Smite",
				source : [["SRD", 31], ["P", 85]],
				minlevel : 2,
				description : desc([
					"When I hit a melee weapon attack, I can expend a spell slot to do +2d8 radiant damage",
					"This increases by +1d8 for each spell slot level above 1st and +1d8 against undead/fiends"
				])
			},
			"subclassfeature3.0-channel divinity" : {
				name : "Channel Divinity",
				source : [["SRD", 32], ["P", 85]],
				minlevel : 3,
				description : "",
				usages : 1,
				recovery : "Short Rest"
			},
			"subclassfeature3" : {
				name : "Sacred Oath",
				source : [["SRD", 32], ["P", 85]],
				minlevel : 3,
				description : desc('Choose a Sacred Oath you swear to and put it in the "Class" field ')
			},
			"divine health" : {
				name : "Divine Health",
				source : [["SRD", 32], ["P", 85]],
				minlevel : 3,
				description : desc("I am immune to disease, thanks to the power of my faith"),
				savetxt : { immune : ["disease"] }
			},
			"aura of protection" : {
				name : "Aura of Protection",
				source : [["SRD", 32], ["P", 85]],
				minlevel : 6,
				description : desc("While I'm conscious, allies within range and I can add my Cha mod (min 1) to saves"),
				additional : ["", "", "", "", "", "10-foot aura", "10-foot aura", "10-foot aura", "10-foot aura", "10-foot aura", "10-foot aura", "10-foot aura", "10-foot aura", "10-foot aura", "10-foot aura", "10-foot aura", "10-foot aura", "30-foot aura", "30-foot aura", "30-foot aura"],
				addMod : { type : "save", field : "all", mod : "max(Cha|1)", text : "While I'm conscious I can add my Charisma modifier (min 1) to all my saving throws." }
			},
			"aura of courage" : {
				name : "Aura of Courage",
				source : [["SRD", 32], ["P", 85]],
				minlevel : 10,
				description : desc("While I'm conscious, allies within range and I can't be frightened"),
				additional : ["", "", "", "", "", "", "", "", "", "10-foot aura", "10-foot aura", "10-foot aura", "10-foot aura", "10-foot aura", "10-foot aura", "10-foot aura", "10-foot aura", "30-foot aura", "30-foot aura", "30-foot aura"],
				savetxt : { immune : ["frightened"] }
			},
			"improved divine smite" : {
				name : "Improved Divine Smite",
				source : [["SRD", 32], ["P", 85]],
				minlevel : 11,
				description : desc("Whenever I hit a creature with a melee weapon, I do an extra 1d8 radiant damage"),
				calcChanges : {
					atkAdd : [
						function (fields, v) {
							if (v.isMeleeWeapon) fields.Description += (fields.Description ? '; ' : '') + '+1d8 Radiant damage' + (v.isThrownWeapon ? ' in melee' : '');
						},
						"With my melee weapon attacks I deal an extra 1d8 radiant damage."
					]
				}
			},
			"cleansing touch" : {
				name : "Cleansing Touch",
				source : [["SRD", 32], ["P", 85]],
				minlevel : 14,
				description : desc("As an action, I can end one spell on me or another willing creature by touch"),
				usages : "Charisma modifier per ",
				usagescalc : "event.value = Math.max(1, What('Cha Mod'));",
				recovery : "Long Rest",
				action : [["action", ""]]
			}
		}
	},

	"ranger": {
		regExpSearch: /^((?=.*(ranger|strider))|((?=.*(nature|natural))(?=.*(knight|fighter|warrior|warlord|trooper)))).*$/i,
		name: "Ranger",
		source: [["SRD24", 57], ["P24", 119]],
		primaryAbility: "Dexterity and Wisdom",
		abilitySave: 5,
		prereqs: "Dexterity 13 and Wisdom 13",
		improvements: [0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 5, 5],
		die: 10,
		saves: ["Str", "Dex"],
		skillstxt: {
			primary: "Choose 3: Animal Handling, Athletics, Insight, Investigation, Nature, Perception, Stealth, or Survival.",
			secondary: "Choose 1: Animal Handling, Athletics, Insight, Investigation, Nature, Perception, Stealth, or Survival.",
		},
		armorProfs: {
			primary:   [true, true, false, true],
			secondary: [true, true, false, true],
		},
		weaponProfs: {
			primary:   [true,  true],
			secondary: [false, true],
		},
		startingEquipment: [{
			gold: 7,
			pack: "explorer",
			equipright: [
				["Studded leather armor", "", 13],
				["Shortsword", "", 2],
				["Scimitar", "", 3],
				["Longbow", "", 2],
				["Quiver, with:", "", 2],
				["Arrows", 20, 0.05],
				["Sprig of mistletoe druidic focus", "", ""],
			],
			equip1stPage: {
				armor: "Studded Leather",
				weapons: ["Longbow", "Shortsword", "Scimitar (off-hand)"],
				ammo: [["Arrows", 20]],
			},
		}, {
			gold: 150,
		}],
		subclasses: ["Ranger Subclass", ["ranger-hunter"]],
		attacks: [1, 1, 1, 1, 2],
		spellcastingFactor: 2,
		spellcastingKnown: {
			spells: "list",
			prepared: [2, 3, 4, 5, 6, 6, 7, 7, 9, 9, 10, 10, 11, 11, 12, 12, 14, 14, 15, 15],
		},
		spellcastingFactorRoundupMulti: true,
		features: {
			"spellcasting": {
				name: "Spellcasting",
				source: [["SRD", 36], ["P", 91]],
				minlevel: 1,
				description: "\nI can cast prepared Ranger spells, using Wis as spellcasting ability. I can use a Druidic Focus as Spellcasting Focus for them. I can change 1 prepared spell whenever I finish a Long Rest.",
				additional: levels.map(function (n, idx) {
					var spells = [2, 3, 4, 5, 6, 6, 7, 7, 9, 9, 10, 10, 11, 11, 12, 12, 14, 14, 15, 15][idx];
					return spells + " spells to prepare";
				}),
			},
			"favored enemy" : {
				name : "Favored Enemy",
				source : [["SRD", 35], ["P", 91]],
				minlevel : 1,
				description : desc([
					'Use the "Choose Feature" button above to add a favored enemy to the third page',
					"When selecting a favored enemy, I also learn one of the languages it speaks",
					"I have adv. on Wis (Survival) checks to track and Int checks to recall info about them"
				]),
				additional : levels.map(function (n) {
					return n < 6 ? "1 favored enemy" : (n < 14 ? 2 : 3) + " favored enemies";
				}),
				extraname : "Favored Enemy",
				extrachoices : ["Aberrations", "Beasts", "Celestials", "Constructs", "Dragons", "Elementals", "Fey", "Fiends", "Giants", "Monstrosities", "Oozes", "Plants", "Undead", "Two Races of Humanoids"],
				extraTimes : levels.map(function (n) { return n < 6 ? 1 : n < 14 ? 2 : 3; }),
				"aberrations" : {
					name : "Aberrations",
					description : "",
					source : [["SRD", 35], ["P", 91]],
					languageProfs : [1]
				},
				"beasts" : {
					name : "Beasts",
					description : "",
					source : [["SRD", 35], ["P", 91]],
					languageProfs : [1]
				},
				"celestials" : {
					name : "Celestials",
					description : "",
					source : [["SRD", 35], ["P", 91]],
					languageProfs : [1]
				},
				"constructs" : {
					name : "Constructs",
					description : "",
					source : [["SRD", 35], ["P", 91]],
					languageProfs : [1]
				},
				"dragons" : {
					name : "Dragons",
					description : "",
					source : [["SRD", 35], ["P", 91]],
					languageProfs : [1]
				},
				"elementals" : {
					name : "Elementals",
					description : "",
					source : [["SRD", 35], ["P", 91]],
					languageProfs : [1]
				},
				"fey" : {
					name : "Fey",
					description : "",
					source : [["SRD", 35], ["P", 91]],
					languageProfs : [1]
				},
				"fiends" : {
					name : "Fiends",
					description : "",
					source : [["SRD", 35], ["P", 91]],
					languageProfs : [1]
				},
				"giants" : {
					name : "Giants",
					description : "",
					source : [["SRD", 35], ["P", 91]],
					languageProfs : [1]
				},
				"monstrosities" : {
					name : "Monstrosities",
					description : "",
					source : [["SRD", 35], ["P", 91]],
					languageProfs : [1]
				},
				"oozes" : {
					name : "Oozes",
					description : "",
					source : [["SRD", 35], ["P", 91]],
					languageProfs : [1]
				},
				"plants" : {
					name : "Plants",
					description : "",
					source : [["SRD", 35], ["P", 91]],
					languageProfs : [1]
				},
				"undead" : {
					name : "Undead",
					description : "",
					source : [["SRD", 35], ["P", 91]],
					languageProfs : [1]
				},
				"two races of humanoids" : {
					name : "Two Races of Humanoids",
					description : "",
					source : [["SRD", 35], ["P", 91]],
					languageProfs : [1]
				}
			},
			"natural explorer" : {
				name : "Natural Explorer",
				source : [["SRD", 36], ["P", 91]],
				minlevel : 1,
				description : desc('Use the "Choose Feature" button above to add a favored terrain to the third page'),
				additional :  levels.map(function (n) {
					return n < 6 ? "1 favored terrain" : (n < 10 ? 2 : 3) + " favored terrains";
				}),
				extraname : "Favored Terrain",
				extrachoices : ["Arctic", "Coast", "Desert", "Forest", "Grassland", "Mountain", "Swamp", "Underdark"],
				extraTimes : levels.map(function (n) { return n < 6 ? 1 : n < 10 ? 2 : 3; }),
				"arctic" : {
					name : "Arctic",
					source : [["SRD", 36], ["P", 91]],
					description : ""
				},
				"coast" : {
					name : "Coast",
					source : [["SRD", 36], ["P", 91]],
					description : ""
				},
				"desert" : {
					name : "Desert",
					source : [["SRD", 36], ["P", 91]],
					description : ""
				},
				"forest" : {
					name : "Forest",
					source : [["SRD", 36], ["P", 91]],
					description : ""
				},
				"grassland" : {
					name : "Grassland",
					source : [["SRD", 36], ["P", 91]],
					description : ""
				},
				"mountain" : {
					name : "Mountain",
					source : [["SRD", 36], ["P", 91]],
					description : ""
				},
				"swamp" : {
					name : "Swamp",
					source : [["SRD", 36], ["P", 91]],
					description : ""
				},
				"underdark" : {
					name : "Underdark",
					source : [["SRD", 36], ["P", 91]],
					description : ""
				},
				"travel benefits" : {
					name : "Favored Terrain Travel Benefits",
					source : [["SRD", 36], ["P", 91]],
					extraname : "Ranger 1",
					description : desc([
						"I can double my Proficiency Bonus for Int/Wis checks concerning my favored terrains",
						"While traveling for an hour or more in a favored terrain, I gain the following benefits:",
						" \u2022 My allies and I are not slowed by difficult terrain and can't get lost except by magic",
						" \u2022 I am alert to danger even when doing something else; I forage twice as much food",
						" \u2022 If alone (or alone with beast companion), I can move stealthily at my normal pace",
						" \u2022 When tracking, I also learn the exact number, size, and time since passing"
					])
				},
				autoSelectExtrachoices : [{
					extrachoice : "travel benefits"
				}]
			},
			"fighting style" : {
				name : "Fighting Style",
				source : [["SRD", 36], ["P", 91]],
				minlevel : 2,
				description : desc('Choose a Fighting Style for the ranger using the "Choose Feature" button above'),
				choices : ["Archery", "Defense", "Dueling", "Two-Weapon Fighting"],
				"archery" : FightingStyles.archery,
				"defense" : FightingStyles.defense,
				"dueling" : FightingStyles.dueling,
				"two-weapon fighting" : FightingStyles.two_weapon
			},
			"subclassfeature3" : {
				name : "Ranger Archetype",
				source : [["SRD", 37], ["P", 92]],
				minlevel : 3,
				description : desc('Choose a Ranger Archetype you strive to emulate and put it in the "Class" field ')
			},
			"primeval awareness" : {
				name : "Primeval Awareness",
				source : [["SRD", 37], ["P", 92]],
				minlevel : 3,
				description : desc([
					"As an action, I can use a spell slot to focus my awareness for 1 min per spell slot level",
					"Out to 1 mile (6 in favored terrain), I sense if certain types of creatures are present"
				]),
				additional : "aber./celest./dragon/elem./fey/fiend/undead",
				action : [["action", ""]]
			},
			"land's stride" : {
				name : "Land's Stride",
				source : [["SRD", 37], ["P", 92]],
				minlevel : 8,
				description : desc([
					"I can travel through nonmagical, difficult terrain without penalty",
					"I have advantage on saves vs. plants that impede movement by magical influence"
				]),
				savetxt : { adv_vs : ["magical plants that impede movement"] }
			},
			"hide in plain sight" : {
				name : "Hide in Plain Sight",
				source : [["SRD", 37], ["P", 92]],
				minlevel : 10,
				description : desc([
					"I can hide with +10 to Dex (Stealth) after spending 1 minute creating camouflage",
					"Once I move or take an action or a reaction, the benefit is lost"
				])
			},
			"vanish" : {
				name : "Vanish",
				source : [["SRD", 37], ["P", 92]],
				minlevel : 14,
				description : desc("I can't be nonmagically tracked if I don't want to be and can Hide as a bonus action"),
				action : [["bonus action", ""]]
			},
			"feral senses" : {
				name : "Feral Senses",
				source : [["SRD", 37], ["P", 92]],
				minlevel : 18,
				description : desc([
					"When not blinded or deafened, I'm aware of invisible, non-hidden creatures in 30 ft",
					"I don't have disadvantage when attacking creatures I am aware of but can't see"
				]),
				vision : [["Feral senses", 30]]
			},
			"foe slayer" : {
				name : "Foe Slayer",
				source : [["SRD", 37], ["P", 92]],
				minlevel : 20,
				description : desc("Once per turn, I can add my Wis mod to the attack or damage roll vs. a favored enemy")
			}
		}
	},
*/
	"rogue": {
		regExpSearch: /rogue|miscreant/i,
		name: "Rogue",
		source: [["SRD24", 61], ["P24", 129]],
		primaryAbility: "Dexterity",
		prereqs: "Dexterity 13",
		improvements: [0, 0, 0, 1, 1, 1, 1, 2, 2, 3, 3, 4, 4, 4, 4, 5, 5, 5, 6, 6],
		die: 8,
		saves: ["Int", "Dex"],
		skillstxt: {
			primary:   "Choose 4: Acrobatics, Athletics, Deception, Insight, Intimidation, Investigation, Perception, Persuasion, Sleight of Hand, or Stealth.",
			secondary: "Choose 1: Acrobatics, Athletics, Deception, Insight, Intimidation, Investigation, Perception, Persuasion, Sleight of Hand, or Stealth."
		},
		toolProfs: {
			primary:   [["Thieves' tools", "Dex"]],
			secondary: [["Thieves' tools", "Dex"]],
		},
		armorProfs: {
			primary:   [true, false, false, false],
			secondary: [true, false, false, false],
		},
		weaponProfs: {
			primary: [true, false, ["Finesse/Light Martial Weapons"]],
		},
		startingEquipment: [{
			gold: 8,
			pack: "burglar",
			equipleft: [
				["Thieves' tools", "", 1],
			],
			equipright: [
				["Leather armor", "", 10],
				["Shortsword", "", 2],
				["Dagger", 2, 1],
				["Shortbow", "", 2],
				["Quiver, with:", "", 2],
				["Arrows", 20, 0.05],
			],
			equip1stPage: {
				armor: "Leather",
				weapons: ["Shortbow", "Shortsword", "Dagger (off-hand)"],
				ammo: [["Daggers", 2]],
			},
		}, {
			gold: 100,
		}],
		subclasses: ["Rogue Subclass", []], // ["rogue-thief"]],
		features: {
			"expertise": function() {
				var a = {
					name: "Expertise",
					source: [["SRD24", 61], ["P24", 129]],
					minlevel: 1,
					description: "\nI gain Expertise with two skills I am proficient with, and two more at 6th level.",
					skillstxt: "Expertise with any two skill proficiencies, and two more at 6th level.",
					additional: levels.map(function (n) {
						return "with " + (n < 6 ? 2 : 4) + " skills";
					}),
					extraTimes: levels.map(function (n) { return n < 6 ? 2 : 4; }),
					extraname: "Expertise",
					extrachoices: ["Acrobatics", "Animal Handling", "Arcana", "Athletics", "Deception", "History", "Insight", "Intimidation", "Investigation", "Medicine", "Nature", "Perception", "Performance", "Persuasion", "Religion", "Sleight of Hand", "Stealth", "Survival"],
				}
				for (var i = 0; i < a.extrachoices.length; i++) {
					a[a.extrachoices[i].toLowerCase()] = {
						name: a.extrachoices[i],
						skills: [[a.extrachoices[i], "only"]],
						prereqeval: function(v) {
							return v.skillProfsLC.indexOf(v.choice) === -1 ? false : v.skillExpertiseLC.indexOf(v.choice) === -1 ? true : "markButDisable";
						},
					}
				}
				return a;
			}(),
			"sneak attack": {
				name: "Sneak Attack",
				source: [["SRD24", 61], ["P24", 129]],
				minlevel: 1,
				description: "\nOnce per turn, I can deal extra damage with a Finesse or Ranged weapon attack if I have Adv" + (typePF ? "antage" : ".") + " or if a non-Incapacitated ally is within 5 ft of the target and I don't have Disadv.",
				additional: levels.map(function (n) { return Math.ceil(n / 2) + "d6"; }),
				calcChanges: {
					atkAdd: [
						function (fields, v) {
							if (classes.known.rogue && classes.known.rogue.level && !v.isSpell && !v.isDC && (v.isRangedWeapon || /\bfinesse\b/i.test(fields.Description))) {
								v.sneakAtk = Math.ceil(classes.known.rogue.level / 2);
								fields.Description += (fields.Description ? '; ' : '') + 'Sneak Attack ' + v.sneakAtk + 'd6';
							};
						},
						"Once per turn, when I attack with a Ranged or Finesse weapon while I have Advantage or an ally that is not Incapacitated is within 5 ft of the target, I can add my Sneak Attack damage to the attack.",
						700,
					],
				},
			},
			"thieves cant": {
				name: "Thieves' Cant",
				source: [["SRD24", 62], ["P24", 129]],
				minlevel: 1,
				description: "\nI know Thieves' Cant so I can convey messages inconspicuously, and one other language.",
				languageProfs : ["Thieves' Cant", 1],
				calcChanges: {
					atkAdd: [ // Mark light and finesse martial weapons as proficient if Rogue is the primary class
						function (fields, v) {
							if (classes.primary === "rogue" && !fields.Proficiency && /martial/i.test(v.theWea.type) && /\b(finesse|light)\b/i.test(fields.Description)) {
								fields.Proficiency = true;
							};
						},
						"",
						10,
					],
				},
			},
			"weapon mastery": {
				name: "Weapon Mastery",
				source: [["SRD24", 62], ["P24", 130]],
				minlevel: 1,
				description: '\nI gain mastery with a 2 Simple or Martial weapons. Whenever I finish a Long Rest, I can change these choices. Use the "Choose Feature" button above to select them.',
				additional: "2 Weapon Masteries",
				extraTimes: 2,
				extraname: "Weapon Mastery",
				choicesWeaponMasteries: true,
			},
			"cunning action": {
				name: "Cunning Action",
				source: [["SRD24", 62], ["P24", 130]],
				minlevel: 2,
				description: "\nAs a Bonus Action on my turn, I can take the Dash, Disengage, or Hide action.",
				action : [["bonus action", "Dash / Disengage / Hide"]],
			},
			"steady aim": {
				name: "Steady Aim",
				source: [["SRD24", 62], ["P24", 130]],
				minlevel: 3,
				description: "\nAs a Bonus Action, ", // NOG DOEN
				action : [["bonus action", ""]],
			},
			"subclassfeature3": {
				name: "Rogue Subclass",
				source: [["SRD24", 62], ["P24", 130]],
				minlevel: 3,
				description: '\nChoose a Rogue Subclass using the "Class" button/bookmark or type its name into the "Class" field.',
			},
			// NOG VERDER AFMAKEN (Cunning Strike mist nog bijv.)
			"uncanny dodge": { // klaar
				name: "Uncanny Dodge",
				source: [["SRD24", 63], ["P24", 131]],
				minlevel: 5,
				description: "\nAs a Reaction, I can halve the damage of an attack from an attacker that I can see.",
				action: [["reaction", ""]],
			},
			"evasion": { // klaar
				name: "Evasion",
				source: [["SRD24", 63], ["P24", 131]],
				minlevel: 7,
				description: " [if not Incapacitated]\nWhen I make a Dex save to halve damage, I instead take none if I succeed and half if I fail.",
				savetxt: { text: ["**Dex Save for Half**. *Failure:* half dmg, *Success:* no dmg"] },
			},
			"reliable talent" : {
				name : "Reliable Talent",
				source : [["SRD", 40], ["P", 96]],
				minlevel : 11,
				description : desc("If I make an ability check where I add my Proficiency Bonus, rolls of 9 or lower are 10")
			},
			"blindsense" : {
				name : "Blindsense",
				source : [["SRD", 40], ["P", 96]],
				minlevel : 14,
				description : desc("With my hearing, I can locate hidden or invisible creatures that are within 10 ft of me"),
				vision : [["Blindsense", 10]]
			},
			"slippery mind" : {
				name : "Slippery Mind",
				source : [["SRD", 40], ["P", 96]],
				minlevel : 15,
				description : desc("I am proficient with Wisdom saving throws"),
				saves : ["Wis"]
			},
			"elusive" : {
				name : "Elusive",
				source : [["SRD", 40], ["P", 96]],
				minlevel : 18,
				description : desc("Attackers do not gain advantage on attacks vs. me, unless I am incapacitated")
			},
			"stroke of luck" : {
				name : "Stroke of Luck",
				source : [["SRD", 40], ["P", 97]],
				minlevel : 20,
				description : desc("I can turn a missed attack into a hit or a failed ability check into a natural 20"),
				recovery : "Short Rest",
				usages : 1
			}
		}
	},
/*
	"sorcerer" : {
		regExpSearch: /sorcerer/i,
		name: "Sorcerer",
		source: [["SRD24", 64], ["P24", 139]],
		primaryAbility: "Charisma",
		abilitySave: 6,
		prereqs: "Charisma 13",
		improvements: [0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 5, 5],
		die: 6,
		saves: ["Con", "Cha"],
		skillstxt: {
			primary: "Choose 2: Arcana, Deception, Insight, Intimidation, Persuasion, or Religion.",
		},
		weaponProfs: {
			primary: [true, false],
		},
		startingEquipment: [{
			gold: 28,
			pack: "dungeoneer",
			equipright: [
				["Spear", "", 3],
				["Daggers", 2, 1],
				["Crystal arcane focus", "", 1],
			],
			equip1stPage: {
				weapons: ["Spear", "Dagger"],
			},
		}, {
			gold: 50,
		}],
		subclasses: ["Sorcerer Subclass", ["sorcerer-draconic bloodline"]],
		spellcastingFactor: 1,
		spellcastingKnown: {
			cantrips: [4, 4, 4, 5, 5, 5, 5, 5, 5, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
			spells: [2, 4, 6, 7, 9, 10, 11, 12, 14, 15, 16, 16, 17, 17, 18, 18, 19, 20, 21, 22],
		},
		features: {
			"spellcasting": {
				name: "Spellcasting",
				source: [["SRD24", 64], ["P24", 139]],
				minlevel: 1,
				description: "\nI can cast Sorcerer cantrips/spells I know, using Cha as spellcasting ability. I can use Arcane Focus as Spellcasting Focus for them. I can swap 1 cantrip and 1 spell when I gain a level.",
				additional: levels.map(function (n, idx) {
					var cantrips = [4, 4, 4, 5, 5, 5, 5, 5, 5, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6][idx];
					var spells = [2, 4, 6, 7, 9, 10, 11, 12, 14, 15, 16, 16, 17, 17, 18, 18, 19, 20, 21, 22][idx];
					return cantrips + " cantrips \x26 " + spells + " spells known";
				}),
			},
			"subclassfeature1" : {
				name : "Sorcerous Origin",
				source : [["SRD", 43], ["P", 101]],
				minlevel : 1,
				description : desc('Choose the Sorcerous Origin for your innate powers and put it in the "Class" field ')
			},
			"font of magic" : {
				name : "Font of Magic",
				source : [["SRD", 43], ["P", 101]],
				minlevel : 2,
				description : desc([
					"As a bonus action, I can use sorcery points to create spell slots and vice versa",
					"I can convert spell slots to sorcery points at a rate of 1 point per spell slot level",
					"I can convert sorcery points to spell slots, which last until I finish a long rest, as follows:",
					"Level 1 for 2 sorcery points;   level 2 for 3 sorcery points;   level 3 for 5 sorcery points",
					"Level 4 for 6 sorcery points;   level 5 for 7 sorcery points"
				]),
				usages : [0, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20],
				recovery : "Long Rest",
				action : [["bonus action", "Font of Magic"]],
				additional : "Sorcery Points",
				limfeaname : "Sorcery Points"
			},
			"metamagic" : {
				name : "Metamagic",
				source : [["SRD", 44], ["P", 101]],
				minlevel : 3,
				description : desc([
					'Use the "Choose Feature" button above to add a Metamagic option to the third page',
					"I can use only 1 Metamagic option on a spell unless otherwise written"
				]),
				additional : levels.map(function (n) {
					return n < 3 ? "" : (n < 10 ? 2 : n < 17 ? 3 : 4) + " known";
				}),
				extraname : "Metamagic Option",
				extrachoices : ["Careful Spell", "Distant Spell", "Empowered Spell", "Extended Spell", "Heightened Spell", "Quickened Spell", "Subtle Spell", "Twinned Spell"],
				extraTimes : levels.map(function (n) {
					return n < 3 ? 0 : n < 10 ? 2 : n < 17 ? 3 : 4;
				}),
				"careful spell" : {
					name : "Careful Spell",
					source : [["SRD", 44], ["P", 102]],
					description : " [1 sorcery point]" + desc([
						"If the spell allows a saving throw, I can protect Cha modifier number of creatures",
						"The selected creatures automatically succeed on their saving throws vs. the spell"
					])
				},
				"distant spell" : {
					name : "Distant Spell",
					source : [["SRD", 44], ["P", 102]],
					description : " [1 sorcery point]" + desc("I double the range of the spell or make the range 30 ft if the range was touch")
				},
				"empowered spell" : {
					name : "Empowered Spell",
					source : [["SRD", 44], ["P", 102]],
					description : " [1 sorcery point]" + desc([
						"If the spell uses damage dice, I can reroll my Charisma modifier number of damage dice",
						"I can Empower a spell even if I use another Metamagic option on it"
					])
				},
				"extended spell" : {
					name : "Extended Spell",
					source : [["SRD", 44], ["P", 102]],
					description : " [1 sorcery point]" + desc("If the spell has a duration of at least 1 min, I can double it, up to 24 hours")
				},
				"heightened spell" : {
					name : "Heightened Spell",
					source : [["SRD", 44], ["P", 102]],
					description : " [3 sorcery points]" + desc("If the spell allows a saving throw, I can have one target get disadv. on their first save")
				},
				"quickened spell" : {
					name : "Quickened Spell",
					source : [["SRD", 44], ["P", 102]],
					description : " [2 sorcery points]" + desc("If the spell has a casting time of 1 action, I can cast it as a bonus action"),
					action : [["bonus action", ""]]
				},
				"subtle spell" : {
					name : "Subtle Spell",
					source : [["SRD", 44], ["P", 102]],
					description : " [1 sorcery point]" + desc("I can cast the spell without the need to use somatic or verbal components")
				},
				"twinned spell" : {
					name : "Twinned Spell",
					source : [["SRD", 44], ["P", 102]],
					description : " [1 sorcery point per spell level, minimum 1]" + desc("If spell/cantrip has a target of one and not self, I can aim it at second target within range")
				}
			},
			"sorcerous restoration" : {
				name : "Sorcerous Restoration",
				source : [["SRD", 44], ["P", 102]],
				minlevel : 20,
				description : desc("I regain 4 expended sorcery points whenever I finish a short rest")
			}
		}
	},
*/
	"warlock": {
		regExpSearch: /warlock/i,
		name: "Warlock",
		source: [["SRD24", 70], ["P24", 153]],
		primaryAbility: "Charisma",
		abilitySave: 6,
		prereqs: "Charisma 13",
		improvements: [0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 5, 5],
		die: 8,
		saves: ["Wis", "Cha"],
		skillstxt: {
			primary: "Choose 2: Arcana, Deception, History, Intimidation, Investigation, Nature, or Religion.",
		},
		armorProfs: {
			primary:   [true, false, false, false],
			secondary: [true, false, false, false],
		},
		weaponProfs: {
			primary: [true, false],
		},
		startingEquipment: [{
			gold: 15,
			pack: "scholar",
			equipleft: [
				["Book (occult lore)", "", 5],
			],
			equipright: [
				["Leather armor", "", 10],
				["Sickle", "", 2],
				["Dagger", 2, 1],
				["Orb arcane focus", "", 3],
			],
			equip1stPage: {
				armor: "Leather",
				weapons: ["Dagger", "Sickle"],
			},
		}, {
			gold: 100,
		}],
		subclasses: ["Warlock Subclass", ["warlock-fiend"]],
		spellcastingFactor: "warlock1",
		spellcastingKnown: {
			cantrips: [2, 2, 2, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
			spells: [2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 11, 11, 12, 12, 13, 13, 14, 14, 15, 15],
		},
		spellcastingList: {
			"class": "warlock",
			level: [0, 5],
		},
		features: {
			"eldritch invocations": {
				name: "Eldritch Invocations",
				source: [["SRD24", 70], ["P24", 153]],
				minlevel: 1,
				description: "\nSelect invocations using the \"Choose Feature\" button above. Whenever I gain a Warlock level, I can replace one invocation with another, if it isn't a prerequisite for any invocations I have.",
				additional: levels.map(function (n) {
					var nmbr = n < 2 ? 1 : n < 5 ? 3 : n < 7 ? 5 : n < 9 ? 6 : n < 12 ? 7 : n < 15 ? 8 : n < 18 ? 9 : 10;
					return nmbr + " invocation" + (nmbr > 1 ? "s" : "") + " known";
				}),
				extraname: "Eldritch Invocation",
				extrachoices: [
					// no prerequisites
					"Armor of Shadows", "Eldritch Mind", 
					// level 2+
					"Devil's Sight", "Fiendish Vigor", "Mask of Many Faces", "Misty Visions", "Otherworldly Leap", 
					// level 5+
					"Ascendant Step", "Gaze of Two Minds", "Gift of the Depths", "Master of Myriad Forms", "One with Shadows", 
					// level 7+
					"Whispers of the Grave",
					// level 9+
					"Visions of Distant Realms",
					// level 15+
					"Witch Sight",
					// Pact of the Blade tree
					"Pact of the Blade", "Devouring Blade (req: lvl 12+, Thirsting Blade)", "Eldritch Smite (req: lvl 5+, Pact of the Blade)", "Lifedrinker (req: lvl 12+, Pact of the Blade)", "Thirsting Blade (req: lvl 5+, Pact of the Blade)",
					// Pact of the Chain tree
					"Pact of the Chain", "Investment of the Chain Master (req: lvl 5+, Pact of the Chain)",
					// Pact of the Tome tree
					"Pact of the Tome", "Gift of the Protectors (req: lvl 9+, Pact of the Tome)",
				],
				extraTimes: levels.map(function (n) {
					return n < 2 ? 1 : n < 5 ? 3 : n < 7 ? 5 : n < 9 ? 6 : n < 12 ? 7 : n < 15 ? 8 : n < 18 ? 9 : 10;
				}),
				// no prerequisites
				"armor of shadows": {
					name: "Armor of Shadows",
					source: [["SRD24", 72], ["P24", 155]],
					description: "\nI can cast Mage Armor on myself without expending a spell slot.",
					spellcastingBonus: [{
						name: "Armor of Shadows",
						spells: ["mage armor"],
						selection: ["mage armor"],
						firstCol: "atwill",
					}],
					spellChanges: {
						"mage armor": {
							range: "Self",
							description: "If I'm not wearing armor, I gain AC 13 + Dex modifier for the duration; spell ends if I don armor",
							changes: "With the Armor of Shadows invocation I can cast Mage Armor without expending a spell slot, but only on myself.",
						},
					},
				},
				"eldritch mind" : {
					name: "Eldritch Mind",
					source: [["SRD24", 72], ["P24", 155]],
					description: "\nI have Advantage on Constitution saving throws to maintain Concentration.",
				},
				// level 2+
				"devil's sight": {
					name: "Devil's Sight",
					source: [["SRD24", 72], ["P24", 155]],
					minlevel: 2,
					submenu: "[Warlock level  2+]",
					description: "\nI can see normally in Dim Light and Darkness, both magical and nonmagical, out to 120 ft.",
					vision: [["Devil's Sight", 120]],
				},
				"fiendish vigor" : {
					name: "Fiendish Vigor",
					source: [["SRD24", 73], ["P24", 155]],
					minlevel: 2,
					submenu: "[Warlock level  2+]",
					description: "\nI can cast False Life on myself without expending a spell slot to gain its max (12) Temp HP.",
					spellcastingBonus: [{
						name: "Fiendish Vigor",
						spells: ["false life"],
						selection: ["false life"],
						firstCol: "atwill",
					}],
					spellChanges: {
						"false life": {
							description: "I gain 12 Temporary Hit Points",
							changes: "With the Fiendish Vigor invocation I can cast False Life without expending a spell slot and I don't roll the dice for the Temporary Hit Points; I automatically get the highest number.",
						},
					},
				},
				"mask of many faces" : {
					name: "Mask of Many Faces",
					source: [["SRD24", 73], ["P24", 156]],
					minlevel: 2,
					submenu: "[Warlock level  2+]",
					description: "\nI can cast Disguise Self without expending a spell slot.",
					spellcastingBonus: [{
						name: "Mask of Many Faces",
						spells: ["disguise self"],
						selection: ["disguise self"],
						firstCol: "atwill",
					}],
				},
				"misty visions" : {
					name: "Misty Visions",
					source: [["SRD24", 74], ["P24", 156]],
					minlevel: 2,
					submenu: "[Warlock level  2+]",
					description: "\nI can cast Silent Image without expending a spell slot.",
					spellcastingBonus: [{
						name: "Misty Visions",
						spells: ["silent image"],
						selection: ["silent image"],
						firstCol: "atwill",
					}],
				},
				"otherworldly leap" : {
					name: "Otherworldly Leap",
					source: [["SRD24", 74], ["P24", 156]],
					minlevel: 2,
					submenu: "[Warlock level  2+]",
					description: "\nI can cast Jump on myself without expending a spell slot.",
					spellcastingBonus: [{
						name: "Otherworldly Leap",
						spells: ["jump"],
						selection: ["jump"],
						firstCol: "atwill",
					}],
					spellChanges: {
						"jump" : {
							range: "Self",
							description: "Once per turn, I can spend 10 ft movement to jump 30 ft",
							changes: "With the Otherworldly Leap invocation I can cast Jump without expending a spell slot, but only on myself.",
						},
					},
				},
				// level 5+
				"ascendant step": {
					name: "Ascendant Step",
					source: [["SRD24", 72], ["P24", 155]],
					minlevel: 5,
					submenu: "[Warlock level  5+]",
					description: "\nI can cast Levitate on myself without expending a spell slot.",
					spellcastingBonus: [{
						name: "Ascendant Step",
						spells: ["levitate"],
						selection: ["levitate"],
						firstCol: "atwill",
					}],
					spellChanges: {
						"levitate" : {
							range: "Self",
							description: "I rise vertically, up to 20 ft; as part of my move, I can move up/down up to 20 ft; spell end: float down",
							changes: "With the Ascendant Step invocation I can cast Levitate without expending a spell slot, but only on myself.",
						},
					},
				},
				"gaze of two minds": {
					name: "Gaze of Two Minds",
					source: [["SRD24", 73], ["P24", 156]],
					minlevel: 5,
					submenu: "[Warlock level  5+]",
					description: desc([
						"As a Bonus Action, I can touch a willing creature and perceive through its senses until the end of my next turn. I can use a Bonus Action on subsequent turns to extend the duration.",
						"While perceiving through the other creature's senses, I benefit from any special senses it has, and I can cast spells as if I were in its space if we are within 60 ft of each other.",
					], "\n"),
					action: [["bonus action", ""]],
				},
				"gift of the depths": {
					name: "Gift of the Depths",
					source: [["SRD24", 73], ["P24", 156]],
					minlevel: 5,
					submenu: "[Warlock level  5+]",
					description: "\nI can breathe underwater and I have a Swim Speed equal to my Speed. Once per Long Rest, I can cast Water Breathing without expending a spell slot.",
					speed: { swim: { spd: "walk", enc: "walk" } },
					spellcastingBonus: [{
						name: "Gift of the Depths",
						spells: ["water breathing"],
						selection: ["water breathing"],
						firstCol: 'oncelr',
					}],
				},
				"master of myriad forms" : {
					name: "Master of Myriad Forms",
					source: [["SRD24", 73], ["P24", 156]],
					minlevel: 5,
					submenu: "[Warlock level  5+]",
					description: "\nI can cast Alter Self without expending a spell slot.",
					submenu: "[Warlock level 15+]",
					spellcastingBonus: [{
						name: "Mask of Myriad Forms",
						spells: ["alter self"],
						selection: ["alter self"],
						firstCol: "atwill",
					}],
				},
				"one with shadows" : {
					name: "One with Shadows",
					source: [["SRD24", 74], ["P24", 156]],
					minlevel: 5,
					submenu: "[Warlock level  5+]",
					description: "\nWhile I'm in Dim Light or Darkness, I can cast Invisibility on myself without using a spell slot.",
					spellcastingBonus: [{
						name: "One with Shadows",
						spells: ["invisibility"],
						selection: ["invisibility"],
						firstCol: "atwill",
					}],
					spellChanges: {
						"invisibility" : {
							range: "Self",
							description: "Can cast if in dim light or darkness; I become Invisible; attacking, casting, or dealing damage ends it",
							changes: "With the One with Shadows invocation I can cast Invisibility without expending a spell slot, but only on myself while I'm in an area of Dim Light or Darkness.",
						},
					},
				},
				// level 7+
				"whispers of the grave" : {
					name: "Whispers of the Grave",
					source: [["SRD24", 74], ["P24", 157]],
					minlevel: 7,
					submenu: "[Warlock level  7+]",
					description: "\nI can cast Speak with Dead without expending a spell slot.",
					spellcastingBonus: [{
						name: "Whispers of the Grave",
						spells: ["speak with dead"],
						selection: ["speak with dead"],
						firstCol: "atwill"
					}],
				},
				// level 9+
				"visions of distant realms" : {
					name: "Visions of Distant Realms",
					source: [["SRD24", 74], ["P24", 157]],
					minlevel: 9,
					submenu: "[Warlock level  9+]",
					description: "\nI can cast Arcane Eye without expending a spell slot.",
					spellcastingBonus: [{
						name: "Visions of Distant Realms",
						spells: ["arcane eye"],
						selection: ["arcane eye"],
						firstCol: "atwill",
					}],
				},
				// level 15+
				"witch sight" : {
					name: "Witch Sight",
					source: [["SRD24", 74], ["P24", 157]],
					minlevel: 15,
					submenu: "[Warlock level 15+]",
					description: " [Truesight 30 ft]",
					vision: [["Truesight", 30]],
				},
				// Pact of the Blade tree
				"pact of the blade": {
					name : "Pact of the Blade",
					source: [["SRD24", 74], ["P24", 156]],
					description: desc([
						"As a Bonus Action, I can bond with a magical weapon I touch, or conjure a pact weapon, a Melee weapon of my choice. I have proficiency with it and can use it as a Spellcasting Focus.",
						"Whenever I attack with it, I can use Charisma instead of Strength or Dexterity with it, and I can cause it to deal Necrotic, Psychic or Radiant damage instead of its normal damage type.",
						"The bond ends (conjured weapon vanishes) if I die or it's " + (typePF ? "over " : ">") + "5 ft away from me for 1 min.",
					], "\n"),
					action: [["bonus action", "Conjure/Bond Pact Weapon"]],
					calcChanges: {
						atkCalc: [
							function (fields, v, output) {
								if (v.theWea.pactWeapon || ((v.isMeleeWeapon || v.theWea.isMagicWeapon || v.thisWeapon[1]) && /\bpact\b/i.test(v.WeaponTextName))) {
									v.pactWeapon = true;
								}
							}, "",
							90,
						],
						atkAdd: [
							function (fields, v) {
								if (v.pactWeapon || v.theWea.pactWeapon || ((v.isMeleeWeapon || v.theWea.isMagicWeapon || v.thisWeapon[1]) && /\bpact\b/i.test(v.WeaponTextName))) {
									v.pactWeapon = true;
									fields.Proficiency = true;
									if ((fields.Mod === 1 || fields.Mod === 2) && What('Cha Mod') > What(AbilityScores.abbreviations[fields.Mod - 1] + ' Mod')) fields.Mod = 6;
								};
							},
							"If I include the word 'Pact' in a melee or magic weapon's name, it gets treated as my Pact Weapon. If the attack uses Strength or Dexterity but my Charisma modifier is higher, it will use Charisma instead.",
							90,
						],
					},
				},
				"devouring blade (req: lvl 12+, thirsting blade)": {
					name: "Devouring Blade",
					source: [["SRD24", 72], ["P24", 155]],
					minlevel: 12,
					submenu: ["[Warlock level 12+]", "[improves Pact of the Blade]"],
					prereqeval: function(v) {
						return v.choiceActive.indexOf("thirsting blade (req: lvl 5+, pact of the blade)") !== -1;
					},
					description: "\nWhen I take the Attack action on my turn, I can attack three times with my pact weapon.",
					action: [["action", "Pact Weapon (3 attacks per Action)", "Pact Weapon (2 attacks per Action)"]],
				},
				"eldritch smite (req: lvl 5+, pact of the blade)": {
					name: "Eldritch Smite",
					source: [["SRD24", 72], ["P24", 155]],
					minlevel: 5,
					submenu: ["[Warlock level  5+]", "[improves Pact of the Blade]"],
					prereqeval: function(v) { return v.choiceActive.indexOf('pact of the blade') !== -1; },
					description: "\nOnce per turn when I hit a creature with my pact weapon, I can expend a Pact Magic spell slot to deal it 1d8+1d8/slot level Force damage and knock it Prone if it is Huge or smaller.",
					additional: levels.map(function (n) {
						// No. of d8s = Pact Magic spell slot level + 1
						var nmbr = n < 3 ? 2 : n < 5 ? 3 : n < 7 ? 4 : n < 9 ? 5 : 6;
						return "+" + nmbr + "d8 Force damage";
					}),
				},
				"lifedrinker (req: lvl 12+, pact of the blade)" : {
					name: "Lifedrinker",
					source: [["SRD24", 73], ["P24", 156]],
					minlevel: 12,
					submenu: ["[Warlock level 12+]", "[improves Pact of the Blade]"],
					prereqeval: function(v) { return v.choiceActive.indexOf('pact of the blade') !== -1; },
					description: "\nOnce per turn when I hit a creature with my pact weapon, I can deal +1d6 Necrotic, Psychic, or Radiant damage, and I can use one HD to heal myself for its roll plus my Constitution mod.",
					calcChanges: {
						atkAdd: [
							function (fields, v) {
								if (v.pactWeapon) fields.Description += (fields.Description ? '; ' : '') + 'Lifedrinker';
							},
							"My pact weapons have the Lifedrinker feature: Once per turn when I hit a creature with my pact weapon, I can deal +1d6 Necrotic, Psychic, or Radiant damage, and I can expend and roll one Hit Point Dice to heal myself for the amount rolled plus my Constitution modifier.",
						],
					},
				},
				"thirsting blade (req: lvl 5+, pact of the blade)": {
					name: "Thirsting Blade",
					source: [["SRD24", 75], ["P24", 157]],
					minlevel: 5,
					submenu: ["[Warlock level  5+]", "[improves Pact of the Blade]"],
					prereqeval: function(v) { return v.choiceActive.indexOf('pact of the blade') !== -1; },
					description: "\nWhen I take the Attack action on my turn, I can attack twice with my pact weapon.",
					action: [["action", "Pact Weapon (2 attacks per Action)"]],
				},
				// Pact of the Chain tree
				"pact of the chain": {
					name: "Pact of the Chain",
					source: [["SRD24", 74], ["P24", 157]],
					description: desc([
						"As a Magic action, I can cast Find Familiar without expending a spell slot. When I do so, I can have the familiar take on a special form (see Companion page).",
						"Additionally, when I take the Attack action, I can forgo one of my attacks to allow my familiar to use its Reaction to make one attack of its own."
					], "\n"),
					spellcastingBonus: [{
						name: "Pact of the Chain",
						spells: ["find familiar"],
						selection: ["find familiar"],
						firstCol: 'atwill',
					}],
					spellChanges: {
						"find familiar": {
							time: "Act",
							ritual: false,
							changes: "With the Pact of the Chain invocation I can cast Find Familiar as an Action without expending a spell slot.",
						},
					},
				},
				"investment of the chain master (req: lvl 5+, pact of the chain)": {
					name: "Investment of the Chain Master",
					source: [["SRD24", 73], ["P24", 156]],
					minlevel: 5,
					submenu: ["[Warlock level  5+]", "[improves Pact of the Chain]"],
					prereqeval: function(v) { return v.choiceActive.indexOf('pact of the chain') !== -1; },
					description: desc([
						"When I cast Find Familiar, the summoned create has additional benefits:",
						" \u2022 **Aerial or Aquatic**. It gains a Fly or Swim speed of 40 ft (my choice at casting).",
						" \u2022 **Quick Attack**. As a Bonus Action, I can command it to take the Attack action.",
						" \u2022 **Damage**. I can have it deal Necrotic or Radiant damage instead of Bludg., Pierc., or Slash.",
						" \u2022 **My Save DC**. If it forces a creature to make a saving throw, it uses my spell save DC.",
						" \u2022 **Resistance**. As a Reaction when it takes damage, I can grant it resistance vs. that damage."
					], "\n"),
					action: [
						["bonus action", "Chain Master: Quick Attack"],
						["reaction", "Chain Master: Resistance"],
					],
					calcChanges: {
						companionCallback: [
							function(prefix, oCrea, bAdd, sCompType) {
								if (sCompType !== "pact_of_the_chain") return;
								// Amend the Traits
								var isMetric = What("Unit System") === "metric";
								var spd = isMetric ? ConvertToMetric("40 ft", 0.5) : "40 ft";
								var feaFld = prefix + "Comp.Use.Features";
								if (bAdd) {
									var strFea = "##\u25C6 Investment of the Chain Master##. The " + oCrea.nameThis + " gains a Fly or Swim speed of " + spd + " (master's choice), uses its master's spell save DC instead of its own DCs, and can deal Necrotic or Radiant damage instead of Bludgeoning, Piercing, or Slashing.";
									AddString(feaFld, strFea, true);
								} else {
									var strRx = '[\\n\\r]?.*Investment of the Chain Master.*';
									RemoveString(feaFld, strRx, false, true);
								}
								// Amend the speed
								var spdFld = prefix + "Comp.Use.Speed";
								var hasFlySpeed = oCrea.speed.match(/fly.?(\d+).?(ft|m)/i);
								var hasSwimSpeed = oCrea.speed.match(/swim.?(\d+).?(ft|m)/i);
								if (hasFlySpeed && hasSwimSpeed) {
									// If it has both speeds, but one 40+ ft, upgrade the other
									var baseFlySpeed = Number(hasFlySpeed[1]);
									var baseSwimSpeed = Number(hasSwimSpeed[1]);
									if (baseFlySpeed < 40 && baseSwimSpeed >= 40) {
										var replaceThis = 'fly.?\d+.?(ft|m)'
										var replaceWith = bAdd ? "fly " + spd : isMetric ? ConvertToMetric(hasFlySpeed[0], 0.5) : hasFlySpeed[0];
										ReplaceString(spdFld, replaceWith, undefined, replaceThis, true);
									} else if (baseFlySpeed >= 40 && baseSwimSpeed < 40) {
										var replaceThis = 'swim.?\d+.?(ft|m)'
										var replaceWith = bAdd ? "swim " + spd : isMetric ? ConvertToMetric(hasSwimSpeed[0], 0.5) : hasSwimSpeed[0];
										ReplaceString(spdFld, replaceWith, undefined, replaceThis, true);
									}
									// If it has both speeds, but either both already 40 ft or neither 40 ft, then let player decide which to upgrade manually (i.e. do nothing)
								} else {
									// Doesn't have both speeds, so add the missing
									var strSpd = bAdd ? "fly or swim " + spd : ",?\s?fly or swim \d+ ?(m|ft)";
									if (!hasFlySpeed && hasSwimSpeed) {
										strSpd = bAdd ? "fly " + spd : ",?\s?fly \d+ ?(m|ft)";
									} else if (hasFlySpeed && !hasSwimSpeed) {
										strSpd = bAdd ? "swim " + spd : ",?\s?swim \d+ ?(m|ft)";
									}
									if (bAdd) {
										AddString(spdFld, strSpd, typePF ? ",\n" : ", ");
									} else {
										RemoveString(spdFld, strSpd, false, true);
									}
								}
								// Amend the attacks
								for (var i = 0; i < 3; i++) {
									if (oCrea.attacks && oCrea.attacks[i] && oCrea.attacks[i].dc) {
										oCrea.attacks[i].useSpellMod = "warlock";
									}
									var baseFld = prefix + "Comp.Use.Attack." + (i+1);
									if (!What(baseFld + ".Weapon Selection")) continue;
									var weaDmgTypeFld = baseFld + ".Damage Type";
									var weaDmgTypeFldVal = What(weaDmgTypeFld);
									var weaDescrFld = baseFld + ".Description";
									var weaDescrFldVal = What(weaDescrFld);
									var dmgTypesRx = bAdd ? /((bludg(eon)?|pierc|slash)(ing|\.)?)/i : /((bludg(eon)?|pierc|slash)(ing|\.)?)\*/i;
									if (dmgTypesRx.test(weaDmgTypeFld.value)) {
										Value(weaDmgTypeFld, weaDmgTypeFldVal.replace(dmgTypesRx, "$1" + (bAdd ? "*" : "")));
										if (bAdd) AddString(weaDescrFld, "*or Necrotic or Radiant", "; ");
									}
									if (!bAdd) {
										Value(weaDescrFld, weaDescrFldVal.replace(/[,; ]*\* Necrotic or Radiant/i, ''));
									}
								}
							},
							"My Pact of the Chain familiars gain an extra feature listing the extra bonuses they gain.",
						],
					},
				},
				// Pact of the Tome tree
				"pact of the tome": {
					name: "Pact of the Tome",
					source: [["SRD24", 74], ["P24", 157]],
					description: "\nI have a Book of Shadows with three cantrips and two 1st-level Ritual spells. While the book is on my person, I have them prepared as Warlock spells. I can use the book as a Spellcasting Focus. I can conjure a replacement, and pick new spells, at the end of a Short or Long Rest.",
					eval: function() {
						// Create a separate spell list entry for this, so its not confusing which cantrips/spells can be selected for it.
						CurrentSpells['warlock-book of shadows'] = {
							name: 'Book of Shadows',
							ability: 'warlock',
							list: { level: [0, 1], ritual: true, },
							known: { cantrips: 3, spells: "list", prepared: [2] },
							refType: "feat",
							level: 1, // needed to show the prepared section
							typeList: 4, // enable the last radio button by default
						};
						SetStringifieds('spells'); CurrentUpdates.types.push('spells');
					},
					removeeval: function() {
						delete CurrentSpells['warlock-book of shadows'];
						SetStringifieds('spells'); CurrentUpdates.types.push('spells');
					},
				},
				"gift of the protectors (req: lvl 9+, pact of the tome)": {
					name: "Gift of the Protectors",
					source: [["SRD24", 73], ["P24", 156]],
					minlevel: 9,
					submenu: ["[Warlock level  9+]", "[improves Pact of the Tome]"],
					prereqeval: function(v) { return v.choiceActive.indexOf('pact of the tome') !== -1; },
					description: desc([
						"My Book of Shadows has a new page. As an Action, a creature can write their name on it if I permit them. The page can contain my Charisma modifier of names (minimum 1).",
						"Once per Long Rest when someone listed on the page is reduced to 0 HP but not killed, they drop to 1 HP instead. As a Magic action, I can erase a name by touching it.",
					], "\n"),
					usages: 1,
					recovery: "Long Rest",
					action: [["action", " (write/erase)"]]
				},
			},
			"pact magic": {
				name: "Pact Magic",
				source: [["SRD24", 71], ["P24", 153]],
				minlevel: 1,
				description: "\nI can cast Warlock cantrips/spells I know, using Cha as spellcasting ability. I can use Arcane Focus as Spellcasting Focus for them. I can swap 1 cantrip and 1 spell when I gain a level.",
				additional: levels.map(function (n, idx) {
					var cantr = [2, 2, 2, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4][idx];
					var splls = [2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 11, 11, 12, 12, 13, 13, 14, 14, 15, 15][idx];
					var slots = n < 2 ? 1 : n < 11 ? 2 : n < 17 ? 3 : 4;
					var slLvl = n < 3 ? 1 : n < 5 ? 2 : n < 7 ? 3 : n < 9 ? 4 : 5;
					var sltxt = typePF ? "level " + slLvl : Base_spellLevelList[slLvl];
					return cantr + " cantrips \x26 " + splls + " spells; " + slots + "\xD7 " + sltxt + " spell slot";
				}),
			},
			"magical cunning": {
				name: "Magical Cunning",
				source: [["SRD24", 72], ["P24", 154]],
				minlevel: 2,
				description: levels.map(function (n) {
					var amount = n < 20 ? "half my max number of" : "all my expended"
					return "\nI can perform a 1 min esoteric rite to regain " + amount + " Pact Magic spells slots."
				}),
				recovery: "Long Rest",
				usages: 1,
				additional: levels.map(function (n) {
					if (n < 2) return "";
					var nmbr = n < 11 ? 1 : n < 20 ? 2 : "all";
					return nmbr + " spell slot" + (nmbr > 1 ? "s" : "");
				}),
			},
			"subclassfeature3": {
				name: "Warlock Subclass",
				source: [["SRD24", 72], ["P24", 154]],
				minlevel: 3,
				description: '\nChoose a Warlock Subclass using the "Class" button/bookmark or type its name into the "Class" field.',
			},
			"contact patron": {
				name: "Contact Patron",
				source: [["SRD24", 72], ["P24", 155]],
				minlevel: 9,
				description: '\nI always have Contact Other Plane prepared. Once per Long Rest, I can cast it without expending a spell slot and then automatically succeed on its saving throw.',
				spellcastingBonus: [{
					name: "Contact Patron",
					spells: ["contact other plane"],
					selection: ["contact other plane"],
					firstCol: "oncelr+markedbox",
				}],
			},
			"mystic arcanum": {
				name: "Mystic Arcanum",
				source: [["SRD24", 72], ["P24", 155]],
				minlevel: 11,
				description: "\nI can choose one Warlock spell for each level above. I can cast each of these once per Long Rest without expending a spell slot. Whenever I gain a Warlock level, I can change one pick.",
				additional: ["", "", "", "", "", "", "", "", "", "", "6th level", "6th level", "6th and 7th level", "6th and 7th level", "6th, 7th, and 8th level", "6th, 7th, and 8th level", "6th, 7th, 8th, and 9th level", "6th, 7th, 8th, and 9th level", "6th, 7th, 8th, and 9th level", "6th, 7th, 8th, and 9th level"],
				spellcastingBonus: [{
					name: "Mystic Arcanum (6th-level)",
					"class": "warlock",
					level: [6, 6],
					firstCol: "oncelr",
				}, {
					name: "Mystic Arcanum (7th-level)",
					"class": "warlock",
					level: [7, 7],
					firstCol: "oncelr",
					times: levels.map(function (n) { return n < 13 ? 0 : 1; }),
				}, {
					name: "Mystic Arcanum (8th-level)",
					"class": "warlock",
					level: [8, 8],
					firstCol: "oncelr",
					times : levels.map(function (n) { return n < 15 ? 0 : 1; }),
				}, {
					name: "Mystic Arcanum (9th-level)",
					"class": "warlock",
					level: [9, 9],
					firstCol: "oncelr",
					times: levels.map(function (n) { return n < 17 ? 0 : 1; }),
				}],
				calcChanges: {
					spellAdd: [
						function (spellKey, spellObj, spName, isDuplicate) {
							// Can't upcast Mystic Arcanum spells
							if (spName === "warlock" && spellObj.level > 5 && !isDuplicate) {
								// Get all the Mystic Arcanum selections
								var mysticArcanumSelections = CurrentSpells.warlock.bonus['mystic arcanum'].map(function (n) { return n.selection[0]; });
								if (mysticArcanumSelections.indexOf(spellKey) !== -1) {
									spellObj.allowUpCasting = true;
								}
							}
						},
						"Mystic Arcanum spells can't be upcast.",
					],
				},
			},
			"eldritch master": {
				name: "Eldritch Master",
				source: [["SRD24", 72], ["P24", 155]],
				minlevel: 20,
				description: " [regain all slots with Magical Cunning]",
			},
		}
	},

	"wizard": {
		regExpSearch: /wizard/i,
		name: "Wizard",
		source: [["SRD24", 77], ["P24", 165]],
		primaryAbility: "Intelligence",
		abilitySave: 4,
		prereqs: "Intelligence 13",
		improvements: [0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 5, 5],
		die: 6,
		saves: ["Int", "Wis"],
		skillstxt: {
			primary: "Choose 2: Arcana, History, Insight, Investigation, Medicine, Nature, or Religion.",
		},
		weaponProfs: {
			primary: [true, false],
		},
		startingEquipment: [{
			gold: 5,
			pack: "scholar",
			equipright: [
				["Robe", "", 4],
				["Staff arcane focus", "", 4],
				["Daggers", 2, 1],
				["Spellbook", "", 3],
			],
			equip1stPage: {
				weapons: ["Quarterstaff", "Dagger"],
			},
		}, {
			gold: 55,
		}],
		subclasses: ["Wizard Subclass", ["wizard-evoker"]],
		spellcastingFactor: 1,
		spellcastingKnown: {
			cantrips: [3, 3, 3, 4, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
			spells: "book",
			prepared: [4, 5, 6, 7, 9, 10, 11, 12, 14, 15, 16, 16, 17, 18, 19, 21, 22, 23, 24, 25],
			cantripsPrepare: true,
		},
		features: {
			"spellcasting": {
				name: "Spellcasting",
				source: [["SRD24", 77], ["P24", 165]],
				minlevel: 1,
				description: "\nI can cast Wizard cantrips/spells, using Intelligence as my spellcasting ability. I can use an Arcane Focus as a Spellcasting Focus for them. Whenever I finish a Long Rest, I can change 1 cantrip to another Wizard cantrip and all my prepared spells to spells in my spellbook. Whenever I gain a Wizard level, I add two spells for which I have spell slots to my spellbook.",
				additional: levels.map(function (n, idx) {
					var cantrips = [3, 3, 3, 4, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5][idx];
					var spells = [4, 5, 6, 7, 9, 10, 11, 12, 14, 15, 16, 16, 17, 18, 19, 21, 22, 23, 24, 25][idx];
					return cantrips + " cantrips known \x26 " + spells + " spells to prepare";
				}),
				toNotesPage: [{
					name: "Expanding and Replacing a Spellbook",
					source: [["SRD24", 78], ["P24", 167]],
					note: [
						"The spells I add to my spellbook as I gain levels reflect my ongoing magical research, but I might find other spells during my adventures that I can add to the book. I could discover a Wizard spell on a Spell Scroll for example, and then copy it into my spellbook.",
						"##Copying a Spell into the Book##. When I find a level 1+ Wizard spell, I can copy it into my spellbook if it's of a level I can prepare and if I have time to copy it. For each level of the spell, the transcription takes 2 hours and costs 50 gp. Afterward I can prepare the spell like the other spells in my spellbook.",
						"##Copying the Book##. I can copy a spell from my spellbook into another book. This is like copying a new spell into my spellbook but faster, since I already know how to cast the spell. I need spend only 1 hour and 10 GP for each level of the copied spell.",
						"If I lose my spellbook, I can use the same procedure to transcribe the Wizard spells that I have prepared into a new spellbook. Filling out the remainder of the new book requires me to find new spells to do so. For this reason, many wizards keep a backup spellbook.",
					],
				}],
			},
			"ritual adept": {
				name: "Ritual Adept",
				source: [["SRD24", 78], ["P24", 166]],
				minlevel: 1,
				description: "\nI can cast any Ritual spell as a Ritual directly from my spellbook without having " + (typePF ? "them" : "it") + " prepared.",
			},
			"arcane recovery": {
				name: "Arcane Recovery",
				source: [["SRD24", 78], ["P24", 166]],
				minlevel: 1,
				description: "\nWhen I finish a short rest, I can recover half my level in spell slot levels (max level 5 slots).",
				additional: levels.map(function (n) {
					var lvls = Math.ceil(n / 2);
					return lvls + " level" + (lvls > 1 ? "s" : "") + " of spell slots";
				}),
				usages: 1,
				recovery: "Long Rest",
			},
			"scholar": function () {
				var a = {
					name: "Scholar",
					source: [["SRD24", 78], ["P24", 166]],
					minlevel: 2,
					description: '\nI gain Expertise in one of these skills in which I have proficiency: Arcana, History, Investigation, Medicine, Nature, or Religion. Use the "Choose Feature" button to select it.',
					skillstxt: "I gain Expertise in one skill: Arcana, History, Investigation, Medicine, Nature, or Religion.",
					choices: ["Arcana Expertise", "History Expertise", "Investigation Expertise", "Medicine Expertise", "Nature Expertise", "Religion Expertise"],
				};
				for (var i = 0; i < a.choices.length; i++) {
					var attr = a.choices[i].toLowerCase();
					var skill = a.choices[i].replace(" Expertise", "");
					a[attr] = {
						name: "Scholar: " + skill,
						description: " [Expertise in " + skill + "]",
						skills: [[skill, "only"]],
						prereqeval: function (v) {
							var skill = v.choice.replace(/ expertise/i, "");
							return v.skillProfsLC.indexOf(skill) === -1 ? false : v.skillExpertiseLC.indexOf(skill) === -1 ? true : "markButDisable";
						},
					};
				}
				return a;
			}(),
			"subclassfeature3": {
				name: "Wizard Subclass",
				source: [["SRD24", 78], ["P24", 167]],
				minlevel: 3,
				description: '\nChoose a Wizard Subclass using the "Class" button/bookmark or type its name into the "Class" field.',
			},
			"memorize spell": {
				name: "Memorize Spell",
				source: [["SRD24", 79], ["P24", 167]],
				minlevel: 5,
				description: "\nWhen I finish a Short Rest, I can change one prepared Wizard spell to another in my book.",
			},
			"spell mastery": {
				name: "Spell Mastery",
				source: [["SRD24", 79], ["P24", 167]],
				minlevel: 18,
				description: "\nI pick a level 1 and a level 2 spell in my spellbook with a casting time of an action. I always have them prepared and can cast them at their lowest level without using a spell slot. Whenever I finish a Long Rest, I can replace 1 pick with another eligible spell.",
				spellcastingBonus: [{
					name: "Spell Mastery level 1",
					"class": "wizard",
					level: [1, 1],
					firstCol: "atwill",
					spellMasteryLevel1: true,
				}, {
					name: "Spell Mastery level 2",
					"class": "wizard",
					level: [2, 2],
					firstCol: "atwill",
					spellMasteryLevel2: true,
				}],
				calcChanges: {
					spellList: [
						function(spList, spName, spType) {
							// Limit the selectable spells to those in the spellbook
							// This has the downside that newly added spells to the spellbook are only selectable the next time the dialog is opened
							if (spList.spellMasteryLevel1 || spList.spellMasteryLevel2) {
								var spellbook = CurrentSpells.wizard.selectSp.concat(CurrentSpells.wizard.selectBo);
								var spellByLvl = CreateSpellList({spells: spellbook}, false, false, true);
								var level = spList.spellMasteryLevel1 ? 1 : 2;
								var oneActionSpells = spellByLvl[level].filter(function (spell) {
									return SpellsList[spell] && /\b(Act|1 ?a)/i.test(SpellsList[spell].time);
								});
								if (oneActionSpells.length) {
									spList.class = undefined;
									spList.spells = oneActionSpells;
								}
							}
						},
						"The selectable spells for Spell Mastery are generated from the level 1 and 2 spells in the spellbook that have a casting time of one action. This means that when you add new level 1 or level 2 spells, they will only be selectable for Spell Mastery after closing and re-opening the Wizard's spell selection dialog.",
					],
					spellAdd: [
						function (spellKey, spellObj, spName, isDuplicate) {
							if (spName !== "wizard" || isDuplicate || spellObj.level < 1 || spellObj.level > 2 || !CurrentSpells.wizard) return;
							var masterySpells = CurrentSpells.wizard.bonus["spell mastery"].map(function (n) {
								return n.selection[0];
							});
							if (masterySpells.indexOf(spellKey) !== -1) {
								removeSpellUpcasting(spellObj);
								spellObj.changesObj["Changes by Wizard: Spell Mastery"] = "\n \u2022 I can cast the spells picked for my Spell Mastery only at their lowest level when cast without expending a spell slot.";
								return true;
							}
						},
						""
					],
				},
			},
			"signature spells" : {
				name : "Signature Spells",
				source: [["SRD24", 79], ["P24", 167]],
				minlevel : 20,
				description : "\nI pick two 3rd-level spells from my spellbook. I always have these spells prepared and I can cast each once per Short Rest without expending a spell slot.",
				extraLimitedFeatures: [{
					name: "Signature Spell (1st pick)",
					recovery: "Short Rest",
					usages: 1,
				}, {
					name: "Signature Spell (2nd pick)",
					recovery: "Short Rest",
					usages: 1,
				}],
				spellcastingBonus: [{
					name: "Signature Spells",
					"class": "wizard",
					level: [3, 3],
					firstCol: "oncesr",
					times: 2,
					signatureSpell: true,
				}],
				calcChanges: {
					spellList: [
						function(spList, spName, spType) {
							// Limit the selectable spells to those in the spellbook
							// This has the downside that newly added spells to the spellbook are only selectable the next time the dialog is opened
							if (spList.signatureSpell) {
								var spellbook = CurrentSpells.wizard.selectSp.concat(CurrentSpells.wizard.selectBo);
								var spellByLvl = CreateSpellList({spells: spellbook}, false, false, true);
								if (spellByLvl[3].length) {
									spList.class = undefined;
									spList.spells = spellByLvl[3];
								}
							}
						},
						"The selectable spells for Signature Spells are generated from the level 3 spells in the spellbook. This means that when you add a new level 3 spell, it will only be selectable as a Signature Spell after closing and re-opening the Wizard's spell selection dialog.",
					],
					spellAdd: [
						function (spellKey, spellObj, spName, isDuplicate) {
							if (spName !== "wizard" || isDuplicate || spellObj.level !== 3 || !CurrentSpells.wizard) return;
							var signatureSpells = CurrentSpells.wizard.bonus["signature spells"][0].selection;
							if (signatureSpells.indexOf(spellKey) !== -1) {
								removeSpellUpcasting(spellObj);
								spellObj.changesObj["Changes by Wizard: Signature Spells"] = "\n \u2022 I can cast the spells picked as my Signature Spells only at their lowest level when cast without expending a spell slot.";
								return true;
							}
						},
						""
					],
				},
			},
		},
	},
};

var Base_ClassSubList = {
	"barbarian-berserker": {
		regExpSearch: /^((?=.*\b(berserker|berserk|berserkr|ulfheoinn|ulfheonar)s?\b)|((?=.*(warrior|fighter))(?=.*(odin|thor)))).*$/i,
		subname: "Path of the Berserker",
		fullname: "Berserker",
		source: [["SRD24", 30], ["P24", 54]],
		abilitySave: 1,
		features: {
			"subclassfeature3": {
				name: "Frenzy",
				source: [["SRD24", 30], ["P24", 54]],
				minlevel: 3,
				description: "\nIf I use Reckless Attack " + (typePF ? "while Raging" : "in Rage") + ", my 1st Strength attack hit on my turn deals extra damage.",
				additional: levels.map(function (n) {
					return "+" + (n < 9 ? 2 : n < 16 ? 3 : 4) + "d6 damage";
				}),
				calcChanges: {
					atkAdd: [
						function (fields, v) {
							var lvl = classes.known.barbarian ? classes.known.barbarian.level : false;
							if (lvl && v.isWeapon && fields.Mod === 1 && /\bfrenzy\b/i.test(v.WeaponTextName)) {
								var multiplier = lvl < 9 ? 2 : lvl < 16 ? 3 : 4;
								fields.Description += (fields.Description ? '; ' : '') + '1/turn +' + multiplier + 'd6 damage';
							}
						},
						'Add the text "Frenzy" to the name of a weapon that uses Strength to have the Frenzy bonus damage added to its description.'
					],
				},
			},
			"subclassfeature6": {
				name: "Mindless Rage",
				source: [["SRD24", 30], ["P24", 54]],
				minlevel: 6,
				description: "\nWhile Raging, I'm immune to being Charmed or Frightened. These end when I enter Rage.",
				savetxt: { immune: ["Charmed (in rage)", "Frightened (in rage)"] },
			},
			"subclassfeature10": {
				name: "Retaliation",
				source: [["SRD24", 30], ["P24", 54]],
				minlevel: 10,
				description: "\nAs a Reaction when a creature within 5 ft damages me, I can make a melee attack vs. it.",
				action: [["reaction", " (after taking damage)"]],
			},
			"subclassfeature14" : {
				name: "Intimidating Presence",
				source: [["SRD24", 30], ["P24", 54]],
				minlevel: 14,
				description: "\nAs a Bonus Action, I can have any creature of my choice within 30 ft make a Wisdom save or be Frightened of me for 1 minute (DC 8 + Str mod + Prof B.). They can repeat this save at each of their turn's end. I can do this once per Long Rest or by expending a Rage use.",
				action : [["bonus action", ""]],
				usages: 1,
				recovery: "Long Rest",
				altResource: "Rage",
			},
		},
	},
/*
	"bard-lore" : {
		regExpSearch : /^(?=.*(college|bard|minstrel|troubadour|jongleur))(?=.*lore).*$/i,
		subname : "College of Lore",
		source : [["SRD", 13], ["P", 54]],
		features: {
			"subclassfeature3" : {
				name : "Bonus Proficiencies",
				source : [["SRD", 13], ["P", 54]],
				minlevel : 3,
				description : desc("I gain proficiency with three skills of my choice"),
				skillstxt : "Choose any three skills"
			},
			"subclassfeature3.1" : {
				name : "Cutting Words",
				source : [["SRD", 13], ["P", 54]],
				minlevel : 3,
				description : desc([
					"As a reaction, when a foe within earshot \x26 60 ft rolls ability check, attack or damage,",
					"I can subtract a Bardic Inspiration die from the result unless the foe can't be charmed"
				]),
				action : [["reaction", ""]]
			},
			"subclassfeature6" : {
				name : "Additional Magical Secrets",
				source : [["SRD", 13], ["P", 55]],
				minlevel : 6,
				description : desc("I can add two spells/cantrips from any class to my Spells Known"),
				spellcastingBonus : [{
					name : "Additional Magical Secret",
					"class" : "any",
					times : 2
				}]
			},
			"subclassfeature14" : {
				name : "Peerless Skill",
				source : [["SRD", 14], ["P", 55]],
				minlevel : 14,
				description : desc("When making an ability check, I can expend a use of Bardic Inspiration to add the die")
			}
		}
	},
*/
	"cleric-life" : {
		regExpSearch : /^(?=.*(cleric|priest|clergy|acolyte))(?=.*\b(life|living|healing)\b).*$/i,
		subname: "Life Domain",
		source: [["SRD24", 40], ["P24", 73]],
		features: {
			"subclassfeature3": {
				name: "Disciple of Life",
				source: [["SRD24", 40], ["P24", 73]],
				minlevel: 3,
				description: "\nWhen a spell I cast with a spell slot restores HP, it restores extra 2 + slot level HP that turn.",
				spellcastingExtra: ["bless", "cure wounds", "aid", "lesser restoration", "mass healing word", "revivify", "aura of life", "death ward", "greater restoration", "mass cure wounds"],
				calcChanges: {
					spellAdd: [
						/**
						 * Omitted because they only increase max HP, but don't restore any:
						 * 		Aid, Heroes' Feast
						 * Omitted because they don't restore HP on the turn they're cast:
						 * 		Alustriel's Mooncloak, Aura of Life, Goodberry, Simbul's Synostodweomer
						 * Included because they restore HP from 0 to 1:
						 * 		Revivify, Raise Dead
						*/
						function (spellKey, spellObj, spName) {
							if (spellObj.psionic || !spellObj.level || spellObj.firstCol === "atwill") return;
							var disallowUpCasting = CurrentSpells[spName].allowUpcasting === false || spellObj.allowUpCasting === false;
							var extraHP = (spellObj.level + 2) + (disallowUpCasting ? "": "+1/SL");
							var exemption = false;
							switch (spellKey) {
								// Legacy - from XGtE
								case "enervation":
									spellObj.description = getSpellShortDescription(spellKey, spellObj).replace("heal half; see B", "heal half (at cast +" + extraHP + ")");
									return true;
								case "life transference":
									spellObj.description = getSpellShortDescription(spellKey, spellObj).replace("heals twice that in HP", "heals twice that +" + extraHP + " HP");
									return true;
								// Only at cast
								case "vampiric touch":
									spellObj.description = spellObj.description.replace("half the", "half").replace("Act to", "Act");
								case "conjure celestial-1-healing light":
								case "aura of vitality":
									spellObj.description = getSpellShortDescription(spellKey, spellObj).replace(/\bHP\b|dmg dealt/i, "$& (at cast +" + extraHP + ")");
									return true;
								// Not generic, needs special attention
								case "arcane vigor":
									spellObj.description = spellObj.description.replace(/in HP/i, "+ " + extraHP + " HP");
									return true;
								case "mass heal":
									spellObj.description = spellObj.description.replace(/crea(tures)? in range; each.*?cure[sd]/i, "crea in range; each then +11 HP \x26 cured").replace(", and", ",");
									return true;
								// Exemptions, not instantaneous but work well with `genericSpellDmgEdit`
								case "regenerate":
									exemption = true;
								// Instantaneous heal spells (and exemptions) processed automatically
								default:
									if ((!exemption && !/instant/i.test(spellObj.duration)) || !genericSpellDmgEdit(spellKey, spellObj, "heal", 2 + spellObj.level, true)) return;
									if (spellObj.level < 9 && spellObj.allowUpCasting !== false) genericSpellDmgEdit(spellKey, spellObj, "heal", "1/SL", true);
									spellObj.discipleOfLife = true; // for Supreme Healing
									return true;
							}
						},
						"When a spell I cast with a spell slot restores Hit Points to a creature, that creature regains 2 plus the spell slot's level additional Hit Points on the turn I cast the spell.",
					],
				},
			},
			"subclassfeature3.1": {
				name: "Channel Divinity: Preserve Life",
				source: [["SRD24", 40], ["P24", 73]],
				minlevel: 3,
				description: "\nAs a Magic action, I can expend a use of Channel Divinity to heal Bloodied creatures within 30 ft (me included) up to half their HP maximum. I divide the HP among them as I see fit.",
				additional: levels.map(function (n) {
					return n < 3 ? "" : "divide " + (n * 5) + " Hit Points";
				}),
				action: [["action", "Preserve Life (Channel Divinity)"]]
			},
			"subclassfeature6": {
				name: "Blessed Healer",
				source: [["SRD24", 40], ["P24", 74]],
				minlevel: 6,
				description: "\nAfter I cast a spell with a spell slot that restores HP to another, I regain 2 + slot level HP.",
			},
			"subclassfeature17": {
				name: "Supreme Healing",
				source: [["SRD24", 40], ["P24", 74]],
				minlevel: 17,
				description: "\nWhen I restore HP with a spell or Channel Divinity, I don't roll dice but use their maximum.",
				calcChanges: {
					spellAdd: [
						function (spellKey, spellObj, spName) {
							var exemption = false;
							switch (spellKey) {
								// Not generic, needs special attention
								case "arcane vigor":
									spellObj.description = spellObj.description.replace(" and roll", "").replace(/(Heal) (roll)/i, "$1 max dice $2");
									return true;
								// Exemptions
								case "conjure celestial":
									exemption = !CurrentCasters.useDependencies;
									break;
								case "conjure celestial-1-healing light":
									exemption = true;
									break;
							}
							// Maximize dice for those set by Disciple of Life and exemptions
							if (exemption || spellObj.discipleOfLife) {
								return genericSpellDmgEdit(spellKey, spellObj, "heal", false, false, true, true);
							}
						},
						"When I use a spell that restores hit points by rolling one or more dice to restore hit points with a spell, I instead use the highest number possible for each die."
					]
				},
			},
		},
	},
/*
	"druid-land" : {
		regExpSearch : /^(?=.*(druid|shaman))(?=.*\b(land|arctic|coast|deserts?|forests?|grasslands?|savannah|steppes?|mountains?|swamps?|underdark)\b).*$/i,
		subname : "Circle of the Land",
		source : [["SRD", 21], ["P", 68]],
		features: {
			"subclassfeature2" : {
				name : "Bonus Cantrip",
				source : [["SRD", 21], ["P", 68]],
				minlevel : 2,
				description : desc("I know one additional druid cantrip of my choice"),
				spellcastingBonus : [{
					name : "Bonus Druid Cantrip",
					"class" : "druid",
					level : [0, 0]
				}]
			},
			"subclassfeature2.1" : {
				name : "Natural Recovery",
				source : [["SRD", 21], ["P", 68]],
				minlevel : 2,
				description : desc("After a short rest, I can recover a number of 5th-level or lower spell slots"),
				additional : ["1 level spell slots", "1 level spell slots", "2 levels spell slots", "2 levels spell slots", "3 levels spell slots", "3 levels spell slots", "4 levels spell slots", "4 levels spell slots", "5 levels spell slots", "5 levels spell slots", "6 levels spell slots", "6 levels spell slots", "7 levels spell slots", "7 levels spell slots", "8 levels spell slots", "8 levels spell slots", "9 levels spell slots", "9 levels spell slots", "10 levels spell slots", "10 levels spell slots"],
				usages : 1,
				recovery : "Long Rest"
			},
			"subclassfeature3" : {
				name : "Circle Spells",
				source : [["SRD", 21], ["P", 68]],
				minlevel : 3,
				description : desc('Choose a terrain that grants you spells using the "Choose Feature" button above'),
				choices : ["Arctic", "Coast", "Desert", "Forest", "Grassland", "Mountain", "Swamp", "Underdark"],
				"arctic" : {
					name : "Arctic Circle Spells",
					description : desc([
						"My mystical connection to the arctic infuses me with the ability to cast certain spells",
						"These are always prepared, but don't count against the number of spells I can prepare"
					]),
					spellcastingExtra : ["hold person", "spike growth", "sleet storm", "slow", "freedom of movement", "ice storm", "commune with nature", "cone of cold"]
				},
				"coast" : {
					name : "Coast Circle Spells",
					description : desc([
						"My mystical connection to the coast infuses me with the ability to cast certain spells",
						"These are always prepared, but don't count against the number of spells I can prepare"
					]),
					spellcastingExtra : ["mirror image", "misty step", "water breathing", "water walk", "control water", "freedom of movement", "conjure elemental", "scrying"]
				},
				"desert" : {
					name : "Desert Circle Spells",
					description : desc([
						"My mystical connection to the desert infuses me with the ability to cast certain spells",
						"These are always prepared, but don't count against the number of spells I can prepare"
					]),
					spellcastingExtra : ["blur", "silence", "create food and water", "protection from energy", "blight", "hallucinatory terrain", "insect plague", "wall of stone"]
				},
				"forest" : {
					name : "Forest Circle Spells",
					description : desc([
						"My mystical connection to the forest infuses me with the ability to cast certain spells",
						"These are always prepared, but don't count against the number of spells I can prepare"
					]),
					spellcastingExtra : ["barkskin", "spider climb", "call lightning", "plant growth", "divination", "freedom of movement", "commune with nature", "tree stride"]
				},
				"grassland" : {
					name : "Grassland Circle Spells",
					description : desc([
						"My connection to the grassland infuses me with the ability to cast certain spells",
						"These are always prepared, but don't count against the number of spells I can prepare"
					]),
					spellcastingExtra : ["invisibility", "pass without trace", "daylight", "haste", "divination", "freedom of movement", "dream", "insect plague"]
				},
				"mountain" : {
					name : "Mountain Circle Spells",
					description : desc([
						"My connection to the mountains infuses me with the ability to cast certain spells",
						"These are always prepared, but don't count against the number of spells I can prepare"
					]),
					spellcastingExtra : ["spider climb", "spike growth", "lightning bolt", "meld into stone", "stone shape", "stoneskin", "passwall", "wall of stone"]
				},
				"swamp" : {
					name : "Swamp Circle Spells",
					description : desc([
						"My mystical connection to the swamp infuses me with the ability to cast certain spells",
						"These are always prepared, but don't count against the number of spells I can prepare"
					]),
					spellcastingExtra : ["darkness", "melf's acid arrow", "water walk", "stinking cloud", "freedom of movement", "locate creature", "insect plague", "scrying"]
				},
				"underdark" : {
					name : "Underdark Circle Spells",
					description : desc([
						"My connection to the underdark infuses me with the ability to cast certain spells",
						"These are always prepared, but don't count against the number of spells I can prepare"
					]),
					spellcastingExtra : ["spider climb", "web", "gaseous form", "stinking cloud", "greater invisibility", "stone shape", "cloudkill", "insect plague"]
				}
			},
			"subclassfeature6" : {
				name : "Land's Stride",
				source : [["SRD", 22], ["P", 68]],
				minlevel : 6,
				description : desc([
					"I can travel through nonmagical, difficult terrain without penalty",
					"I have advantage on saves vs. plants that impede movement by magical influence"
				]),
				savetxt : { adv_vs : ["magical plants that impede movement"] }
			},
			"subclassfeature10" : {
				name : "Nature's Ward",
				source : [["SRD", 22], ["P", 68]],
				minlevel : 10,
				description : desc("I am immune to poison/disease and I can't be charmed/frightened by elementals or fey"),
				savetxt : { text : ["Immune to being charmed or frightened by elementals or fey"], immune : ["poison", "disease"] }
			},
			"subclassfeature14" : {
				name : "Nature's Sanctuary",
				source : [["SRD", 22], ["P", 68]],
				minlevel : 14,
				description : desc([
					"When a beast or plant attacks me, it must make a Wis save or pick a different target",
					"If it can't, it automatically misses; On a successful save, it is immune for 24 hours"
				])
			}
		}
	},
*/
	"fighter-champion" : {
		regExpSearch: /champion/i,
		subname: "Champion",
		fullname: "Champion",
		source: [["SRD24", 49], ["P24", 96]],
		features: {
			"subclassfeature3": {
				name: "Improved Critical",
				source: [["SRD24", 49], ["P24", 96]],
				minlevel: 3,
				description: "\nI score a Critical Hit with my weapon and unarmed strike attacks on a roll of 19 and 20.",
				calcChanges: {
					atkAdd: [
						function (fields, v) {
							if (!v.isSpell && !v.CritChance && !v.isDC && classes.known.fighter && classes.known.fighter.level < 15) {
								fields.Description += (fields.Description ? '; ' : '') + 'Crit on 19-20';
								v.CritChance = 19;
							};
						},
						"My weapon and unarmed strike attacks score a Critical Hit on a to hit roll of both 19 and 20.",
						19,
					],
				},
			},
			"subclassfeature3.1": {
				name : "Remarkable Athlete",
				source: [["SRD24", 49], ["P24", 96]],
				minlevel: 3,
				description: "\nAfter I score a Critical Hit, I can move half my Speed without provoking Opportunity Attacks. I have Advantage on Initiative rolls and Strength (Athletics) checks.",
				advantages: [
					["Initiative", true],
					["Athletics", true],
				],
			},
			"subclassfeature7": {
				name: "Additional Fighting Style",
				source: [["SRD24", 49], ["P24", 96]],
				minlevel: 7,
				description: '\nChoose another Fighting Style Feat using the "Choose Feature" button above.',
				choicesFightingStyles: {
					namePrefix: "Additional Fighting Style: ",
				},
			},
			"subclassfeature10": {
				name: "Heroic Warrior",
				source: [["SRD24", 49], ["P24", 96]],
				minlevel: 10,
				description: "\nI can give myself Heroic Inspiration whenever I start my turn in combat without it.",
			},
			"subclassfeature15": {
				name: "Superior Critical",
				source: [["SRD24", 49], ["P24", 96]],
				minlevel: 15,
				description: "\nI now score a Critical Hit with my weapons \x26 unarmed strikes on a roll of 18, 19, and 20.",
				calcChanges: {
					atkAdd: [
						function (fields, v) {
							if (v.isSpell || v.isDC) return;
							if (v.CritChance && v.CritChance > 18) {
								fields.Description = fields.Description.replace('Crit on ' + CritChance + '-20', 'Crit on 18-20');
								v.CritChance = 18;
							} else if (!v.CritChance) {
								fields.Description += (fields.Description ? '; ' : '') + 'Crit on 18-20';
								v.CritChance = 18;
							};
						},
						"My weapon and unarmed strike attacks noww also score a Critical Hit on a to hit roll of 18.",
						18,
					],
				},
			},
			"subclassfeature18": {
				name: "Survivor",
				source: [["SRD24", 49], ["P24", 96]],
				minlevel: 18,
				description: "\n**Defy Death**. I have Adv. on Death saves and 18-20 on those saves count as a natural 20.\n**Heroic Rally**. If I'm Blooded and at 1+ HP at the start of my turn, I heal 5 + Con mod HP.",
			}
		}
	},
/*
	"monk-open hand" : {
		regExpSearch : /^(?=.*\bopen\b)(?=.*\bhand\b)((?=.*(monk|monastic))|(((?=.*martial)(?=.*(artist|arts)))|((?=.*spiritual)(?=.*warrior)))).*$/i,
		subname : "Way of the Open Hand",
		source : [["SRD", 28], ["P", 79]],
		features: {
			"subclassfeature3" : {
				name : "Hand Technique",
				source : [["SRD", 28], ["P", 79]],
				minlevel : 3,
				description : desc([
					"Whenever I hit a creature with a Flurry of Blows attack I can do one of the following:",
					"\u2022 Have it make a Dexterity save or be knocked prone",
					"\u2022 Have it make a Strength save or be pushed up to 15 ft away from me",
					"\u2022 Stop it from taking reactions until the end of my next turn"
				])
			},
			"subclassfeature6" : {
				name : "Wholeness of Body",
				source : [["SRD", 28], ["P", 79]],
				minlevel : 6,
				description : desc("As an action, I regain hit points equal to three times my monk level"),
				additional : levels.map(function (n) { return n < 6 ? "" : (n*3) + " hit points" }),
				usages : 1,
				recovery : "Long Rest",
				action : [["action", ""]]
			},
			"subclassfeature11" : {
				name : "Tranquility",
				source : [["SRD", 29], ["P", 80]],
				minlevel : 11,
				description : desc("After a long rest, I gain the effect of a Sanctuary spell until a next long rest"),
				"quivering palm" : {
					name : "Quivering Palm",
					extraname : "Way of the Open Hand 17",
					source : [["SRD", 29], ["P", 80]],
					description : " [3 ki points]" + desc([
						"When I hit a creature with an unarmed strike, I can start imperceptible vibrations",
						"Within my monk level in days, I can use an action to have the creature make a Con save",
						"If it fails, it is reduced to 0 hit points; If it succeeds, it takes 10d10 necrotic damage"
					])
				},
				autoSelectExtrachoices : [{
					extrachoice : "quivering palm",
					minlevel : 17
				}]
			}
		}
	},
	"paladin-devotion" : {
		regExpSearch : /^(?=.*(devotion|obedience))((?=.*paladin)|((?=.*(exalted|sacred|holy|divine))(?=.*(knight|fighter|warrior|warlord|trooper)))).*$/i,
		subname : "Oath of Devotion",
		source : [["SRD", 32], ["P", 86]],
		features: {
			"subclassfeature3" : {
				name : "Channel Divinity: Sacred Weapon",
				source : [["SRD", 33], ["P", 86]],
				minlevel : 3,
				description : desc([
					"As an action, for 1 minute, I add my Cha modifier to hit for one weapon I'm holding",
					"It also counts as magical and emits bright light in a 20-ft radius and equal dim light"
				]),
				action : [["action", ""]],
				calcChanges : {
					atkCalc : [
						function (fields, v, output) {
							if (classes.known.paladin && classes.known.paladin.level > 2 && !v.isSpell && (/^(?=.*sacred)(?=.*weapon).*$/i).test(v.WeaponTextName)) {
								output.extraHit += What('Cha Mod');
							};
						},
						"If I include the words 'Sacred Weapon' in the name of a weapon, it gets my Charisma modifier added to its To Hit."
					]
				},
				spellcastingExtra : ["protection from evil and good", "sanctuary", "lesser restoration", "zone of truth", "beacon of hope", "dispel magic", "freedom of movement", "guardian of faith", "commune", "flame strike"]
			},
			"subclassfeature3.1" : {
				name : "Channel Divinity: Turn the Unholy",
				source : [["SRD", 33], ["P", 86]],
				minlevel : 3,
				description : desc([
					"As an action, all fiends/undead within 30 ft that can hear me must make a Wis save",
					"If one of them fails this save, it is turned for 1 minute or until it takes damage",
					"Turned: move away, never within 30 ft of me, no reactions or actions other than Dash",
					"Turned: may Dodge instead of Dash when nowhere to move and unable to escape bonds"
				]),
				action : [["action", ""]]
			},
			"subclassfeature7" : {
				name : "Aura of Devotion",
				source : [["SRD", 33], ["P", 86]],
				minlevel : 7,
				description : desc("While I'm conscious, allies within range and I can't be charmed"),
				additional : ["", "", "", "", "", "", "10-foot aura", "10-foot aura", "10-foot aura", "10-foot aura", "10-foot aura", "10-foot aura", "10-foot aura", "10-foot aura", "10-foot aura", "10-foot aura", "10-foot aura", "30-foot aura", "30-foot aura", "30-foot aura"],
				savetxt : { immune : ["charmed"] }
			},
			"subclassfeature15" : {
				name : "Purity of Spirit",
				source : [["SRD", 33], ["P", 86]],
				minlevel : 15,
				description : desc("I am always under the effect of a Protection from Evil and Good spell")
			},
			"subclassfeature20" : {
				name : "Holy Nimbus",
				source : [["SRD", 33], ["P", 86]],
				minlevel : 20,
				description : desc([
					"As an action, I shine with a 30-ft radius bright light and equal dim light for 1 minute",
					"If an enemy starts its turn in the bright light, it takes 10 radiant damage",
					"For the duration, I have advantage on saves vs. spells cast by fiends and undead"
				]),
				recovery : "Long Rest",
				usages : 1,
				action : [["action", ""]]
			}
		}
	},
	"ranger-hunter" : {
		regExpSearch : /^(?!.*(monster|barbarian|bard|cleric|druid|fighter|monk|paladin|rogue|sorcerer|warlock|wizard))(?=.*(hunter|huntress|hunts(wo)?m(e|a)n)).*$/i,
		subname : "Hunter",
		fullname : "Hunter",
		source : [["SRD", 37], ["P", 93]],
		features: {
			"subclassfeature3" : {
				name : "Hunter's Prey",
				source : [["SRD", 37], ["P", 93]],
				minlevel : 3,
				description : desc('Choose Colossus Slayer, Giant Killer, or Horde Breaker with the "Choose Feature" button'),
				choices : ["Colossus Slayer", "Giant killer", "Horde Breaker"],
				"colossus slayer" : {
					name : "Hunter's Prey: Colossus Slayer",
					description : desc("Once per turn, when hitting someone that is below max HP, I do an extra 1d8 damage")
				},
				"giant killer" : {
					name : "Hunter's Prey: Giant Killer",
					description : desc("As a reaction, when a Large or larger enemy in 5 ft attacks me, I can attack it once"),
					action : [["reaction", ""]]
				},
				"horde breaker" : {
					name : "Hunter's Prey: Horde Breaker",
					description : desc("Once per turn, when I hit a creature, I can make an attack vs. another within 5 ft of it")
				}
			},
			"subclassfeature7" : {
				name : "Defensive Tactics",
				source : [["SRD", 38], ["P", 93]],
				minlevel : 7,
				description : desc('"Choose Feature" button to choose Escape the Horde, Multiattack Defense, or Steel Will'),
				choices : ["Escape the Horde", "Multiattack Defense", "Steel Will"],
				"escape the horde" : {
					name : "Defensive Tactic: Escape the Horde",
					description : desc("Creatures attacking me with opportunity attacks have disadvantage on the attack rolls")
				},
				"multiattack defense" : {
					name : "Defensive Tactic: Multiattack Defense",
					description : desc("When a creature hits me, I gain +4 AC against that creature for the rest of the turn")
				},
				"steel will" : {
					name : "Defensive Tactic: Steel Will",
					description : desc("I have advantage on saves against being frightened"),
					savetxt : { adv_vs : ["frightened"] }
				}
			},
			"subclassfeature11" : {
				name : "Multiattack",
				source : [["SRD", 38], ["P", 93]],
				minlevel : 11,
				description : desc('Choose Volley or Whirlwind Attack using the "Choose Feature" button above'),
				choices : ["Volley", "Whirlwind Attack"],
				"volley" : {
					name : "Multiattack: Volley",
					description : desc("As an action, I can make ranged attacks vs. all within a 10-ft radius of a point in range"),
					action : [["action", ""]]
				},
				"whirlwind attack" : {
					name : "Multiattack: Whirlwind Attack",
					description : desc("As an action, I can make melee attacks vs. all creatures within 5 ft of me"),
					action : [["action", ""]]
				}
			},
			"subclassfeature15" : {
				name : "Superior Hunter's Defense",
				source : [["SRD", 38], ["P", 93]],
				minlevel : 15,
				description : desc('"Choose Feature" button to choose Evasion, Stand Against the Tide, or Uncanny Dodge'),
				choices : ["Evasion", "Stand Against the Tide", "Uncanny Dodge"],
				"evasion" : {
					name : "Evasion",
					description : desc("My Dexterity saves vs. areas of effect negate damage on success and halve it on failure"),
					savetxt : { text : ["Dex save vs. area effects: fail \u2015 half dmg, success \u2015 no dmg"] }
				},
				"stand against the tide" : {
					name : "Stand Against the Tide",
					description : desc([
						"When a creature misses me with a melee attack, I can use my reaction on the attack",
						"I force the attacker to repeat it vs. another (not attacker) of my choice within range"
					]),
					action : [["reaction", ""]]
				},
				"uncanny dodge" : {
					name : "Uncanny Dodge",
					description : desc("As a reaction, I halve the damage of an attack from an attacker that I can see"),
					action : [["reaction", ""]]
				}
			}
		}
	},
	"rogue-thief" : {
		regExpSearch : /^(?!.*(barbarian|bard|cleric|druid|fighter|monk|paladin|ranger|sorcerer|warlock|wizard))(?=.*(thief|burglar)).*$/i,
		subname : "Thief",
		fullname : "Thief",
		source : [["SRD", 41], ["P", 97]],
		features: {
			"subclassfeature3" : {
				name : "Fast Hands",
				source : [["SRD", 40], ["P", 97]],
				minlevel : 3,
				description : desc([
					"As a bonus action, I can do one of the following:",
					" \u2022 Make a Dexterity (Sleight of Hand) check",
					" \u2022 Use my thieves' tools to disarm a trap or open a lock",
					" \u2022 Take the Use an Object action"
				]),
				action : [["bonus action", ""]]
			},
			"subclassfeature3.1" : {
				name : "Second-Story Work",
				source : [["SRD", 41], ["P", 97]],
				minlevel : 3,
				description : desc("I climb at my normal speed; I add my Dex modifier to the distance of a running jump"),
				speed : { climb : { spd : "walk", enc : "walk" } }
			},
			"subclassfeature9" : {
				name : "Supreme Sneak",
				source : [["SRD", 41], ["P", 97]],
				minlevel : 9,
				description : desc("I have advantage on Dexterity (Stealth) checks when moving no more than half speed")
			},
			"subclassfeature13" : {
				name : "Use Magic Device",
				source : [["SRD", 41], ["P", 97]],
				minlevel : 13,
				description : desc("I can use magic items even if I don't meet the class, race, and/or level requirements")
			},
			"subclassfeature17" : {
				name : "Thief's Reflexes",
				source : [["SRD", 41], ["P", 97]],
				minlevel : 17,
				description : desc([
					"Unless surprised, I can take two turns on the first round of any combat",
					"The first turn is at my regular initiative, and the second is at my initiative - 10"
				])
			}
		}
	},
	"sorcerer-draconic bloodline" : {
		regExpSearch : /^(?=.*(sorcerer|witch))(?=.*(draconic|dragon)).*$/i,
		subname : "Draconic Bloodline",
		source : [["SRD", 44], ["P", 102]],
		features: {
			"subclassfeature1" : {
				name : "Dragon Ancestor",
				source : [["SRD", 44], ["P", 102]],
				minlevel : 1,
				description : desc([
					'Choose a Dragon Ancestor using the "Choose Feature" button above',
					"When interacting with dragons, if I can add my Proficiency Bonus, I can double it"
				]),
				choices : ["Black Dragon Ancestor", "Blue Dragon Ancestor", "Brass Dragon Ancestor", "Bronze Dragon Ancestor", "Copper Dragon Ancestor", "Gold Dragon Ancestor", "Green Dragon Ancestor", "Red Dragon Ancestor", "Silver Dragon Ancestor", "White Dragon Ancestor"],
				"black dragon ancestor" : {
					name : "Black Dragon Ancestor",
					description : desc([
						"I have draconic ancestry with black dragons, which are affiliated with acid damage",
						"When interacting with dragons, if I can add my Proficiency Bonus, I can double it"
					]),
					dependentChoices : "acid"
				},
				"blue dragon ancestor" : {
					name : "Blue Dragon Ancestor",
					description : desc([
						"I have draconic ancestry with blue dragons, which are affiliated with lightning damage",
						"When interacting with dragons, if I can add my Proficiency Bonus, I can double it"
					]),
					dependentChoices : "lightning"
				},
				"brass dragon ancestor" : {
					name : "Brass Dragon Ancestor",
					description : desc([
						"I have draconic ancestry with brass dragons, which are affiliated with fire damage",
						"When interacting with dragons, if I can add my Proficiency Bonus, I can double it"
					]),
					dependentChoices : "fire"
				},
				"bronze dragon ancestor" : {
					name : "Bronze Dragon Ancestor",
					description : desc([
						"I have draconic ancestry with bronze dragons, which are affiliated with lightning dmg",
						"When interacting with dragons, if I can add my Proficiency Bonus, I can double it"
					]),
					dependentChoices : "lightning"
				},
				"copper dragon ancestor" : {
					name : "Copper Dragon Ancestor",
					description : desc([
						"I have draconic ancestry with copper dragons, which are affiliated with acid damage",
						"When interacting with dragons, if I can add my Proficiency Bonus, I can double it"
					]),
					dependentChoices : "acid"
				},
				"gold dragon ancestor" : {
					name : "Gold Dragon Ancestor",
					description : desc([
						"I have draconic ancestry with gold dragons, which are affiliated with fire damage",
						"When interacting with dragons, if I can add my Proficiency Bonus, I can double it"
					]),
					dependentChoices : "fire"
				},
				"green dragon ancestor" : {
					name : "Green Dragon Ancestor",
					description : desc([
						"I have draconic ancestry with green dragons, which are affiliated with poison damage",
						"When interacting with dragons, if I can add my Proficiency Bonus, I can double it"
					]),
					dependentChoices : "poison"
				},
				"red dragon ancestor" : {
					name : "Red Dragon Ancestor",
					description : desc([
						"I have draconic ancestry with red dragons, which are affiliated with fire damage",
						"When interacting with dragons, if I can add my Proficiency Bonus, I can double it"
					]),
					dependentChoices : "fire"
				},
				"silver dragon ancestor" : {
					name : "Silver Dragon Ancestor",
					description : desc([
						"I have draconic ancestry with silver dragons, which are affiliated with cold damage",
						"When interacting with dragons, if I can add my Proficiency Bonus, I can double it"
					]),
					dependentChoices : "cold"
				},
				"white dragon ancestor" : {
					name : "White Dragon Ancestor",
					description : desc([
						"I have draconic ancestry with white dragons, which are affiliated with cold damage",
						"When interacting with dragons, if I can add my Proficiency Bonus, I can double it"
					]),
					dependentChoices : "cold"
				},
				languageProfs : ["Draconic"],
				choiceDependencies : [{
					feature : "subclassfeature6",
					choiceAttribute : true
				}]
			},
			"subclassfeature1.1" : {
				name : "Draconic Resilience",
				source : [["SRD", 45], ["P", 102]],
				minlevel : 1,
				description : desc([
					"When I am not wearing armor, my AC is 13 + Dexterity modifier",
					"My hit point maximum increases by an amount equal to my sorcerer level"
				]),
				calcChanges : {
					hp : function (totalHD) {
						if (classes.known.sorcerer) {
							return [classes.known.sorcerer.level, "Draconic Resilience (sorcerer level)"];
						}
					}
				},
				armorOptions : [{
					regExpSearch : /^(?=.*(dragon|draconic))(?=.*(hide|skin|scales|resilience)).*$/i,
					name : "Draconic Resilience",
					source : [["SRD", 45], ["P", 102]],
					ac : 13,
					affectsWildShape : true,
					selectNow : true
				}]
			},
			"subclassfeature6" : {
				name : "Elemental Affinity",
				source : [["SRD", 45], ["P", 102]],
				minlevel : 6,
				description : desc([
					'Choose a Dragon Ancestor using the "Choose Feature" button above',
					"I add Cha mod for spell damage if matching my dragon ancestor's affiliated type",
					"I can spend 1 sorcery point to gain resistance to my dragon ancestor's affiliated type"
				]),
				additional : "optional: 1 sorcery point",
				choices : ["acid", "cold", "fire", "lightning", "poison"],
				choicesNotInMenu : true,
				"acid" : {
					name : "Acid Elemental Affinity",
					description : desc([
						"I add my Charisma modifier to one damage roll of a spell if it does acid damage",
						"When I do this, I can spend 1 sorcery point to gain acid resistance for 1 hour"
					]),
					calcChanges : {
						atkCalc : [
							function (fields, v, output) {
								if (classes.known.sorcerer && classes.known.sorcerer.level > 5 && v.isSpell && (/acid/i).test(fields.Damage_Type)) {
									output.extraDmg += What('Cha Mod');
								};
							},
							"Cantrips and spells that deal acid damage get my Charisma modifier added to their damage."
						],
						spellAdd : [
							function (spellKey, spellObj, spName) {
								if (!spellObj.psionic) return genericSpellDmgEdit(spellKey, spellObj, "acid", "Cha", true);
							},
							"Cantrips and spells that deal acid damage get my Charisma modifier added to their damage."
						]
					}
				},
				"cold" : {
					name : "Cold Elemental Affinity",
					description : desc([
						"I add my Charisma modifier to one damage roll of a spell if it does cold damage",
						"When I do this, I can spend 1 sorcery point to gain cold resistance for 1 hour"
					]),
					calcChanges : {
						atkCalc : [
							function (fields, v, output) {
								if (classes.known.sorcerer && classes.known.sorcerer.level > 5 && v.isSpell && (/cold/i).test(fields.Damage_Type)) {
									output.extraDmg += What('Cha Mod');
								};
							},
							"Cantrips and spells that deal cold damage get my Charisma modifier added to their damage."
						],
						spellAdd : [
							function (spellKey, spellObj, spName) {
								if (!spellObj.psionic) return genericSpellDmgEdit(spellKey, spellObj, "cold", "Cha", true);
							},
							"Cantrips and spells that deal cold damage get my Charisma modifier added to their damage."
						]
					}
				},
				"fire" : {
					name : "Fire Elemental Affinity",
					description : desc([
						"I add my Charisma modifier to one damage roll of a spell if it does fire damage",
						"When I do this, I can spend 1 sorcery point to gain fire resistance for 1 hour"
					]),
					calcChanges : {
						atkCalc : [
							function (fields, v, output) {
								if (classes.known.sorcerer && classes.known.sorcerer.level > 5 && v.isSpell && (/fire/i).test(fields.Damage_Type)) {
									output.extraDmg += What('Cha Mod');
								};
							},
							"Cantrips and spells that deal fire damage get my Charisma modifier added to their damage."
						],
						spellAdd : [
							function (spellKey, spellObj, spName) {
								if (!spellObj.psionic) return genericSpellDmgEdit(spellKey, spellObj, "fire", "Cha", true);
							},
							"Cantrips and spells that deal fire damage get my Charisma modifier added to their damage."
						]
					}
				},
				"lightning" : {
					name : "Lightning Elemental Affinity",
					description : desc([
						"I add my Charisma modifier to one damage roll of a spell if it does lightning damage",
						"When I do this, I can spend 1 sorcery point to gain lightning resistance for 1 hour"
					]),
					calcChanges : {
						atkCalc : [
							function (fields, v, output) {
								if (classes.known.sorcerer && classes.known.sorcerer.level > 5 && v.isSpell && (/lightning/i).test(fields.Damage_Type)) {
									output.extraDmg += What('Cha Mod');
								};
							},
							"Cantrips and spells that deal lightning damage get my Charisma modifier added to their damage."
						],
						spellAdd : [
							function (spellKey, spellObj, spName) {
								if (!spellObj.psionic) return genericSpellDmgEdit(spellKey, spellObj, "lightn\\.?|lightning", "Cha", true);
							},
							"Cantrips and spells that deal lightning damage get my Charisma modifier added to their damage."
						]
					}
				},
				"poison" : {
					name : "Poison Elemental Affinity",
					description : desc([
						"I add my Charisma modifier to one damage roll of a spell if it does poison damage",
						"When I do this, I can spend 1 sorcery point to gain poison resistance for 1 hour"
					]),
					calcChanges : {
						atkCalc : [
							function (fields, v, output) {
								if (classes.known.sorcerer && classes.known.sorcerer.level > 5 && v.isSpell && (/poison/i).test(fields.Damage_Type)) {
									output.extraDmg += What('Cha Mod');
								};
							},
							"Cantrips and spells that deal poison damage get my Charisma modifier added to their damage."
						],
						spellAdd : [
							function (spellKey, spellObj, spName) {
								if (!spellObj.psionic) return genericSpellDmgEdit(spellKey, spellObj, "poison", "Cha", true);
							},
							"Cantrips and spells that deal poison damage get my Charisma modifier added to their damage."
						]
					}
				}
			},
			"subclassfeature14" : {
				name : "Dragon Wings",
				source : [["SRD", 45], ["P", 103]],
				minlevel : 14,
				description : desc([
					"As a bonus action, unless armor is in the way, I can sprout dragon wings from my back",
					"I gain a fly speed equal to my current speed until I dismiss the wings as a bonus action"
				]),
				action : [["bonus action", " (start/stop)"]],
				speed : { fly : { spd : "walk", enc : "walk" } }
			},
			"subclassfeature18" : {
				name : "Draconic Presence",
				source : [["SRD", 45], ["P", 103]],
				minlevel : 18,
				description : desc([
					"As an action, I create 60-ft radius aura of awe/fear for concentration up to 1 minute",
					"All hostiles in this aura must make a Wis save or be charmed (awe) or frightened (fear)",
					"They make their saves at the beginning of their turns",
					"A creature that succeeds on the save is immune to my aura for 24 hours"
				]),
				additional : "5 sorcery points",
				action : [["action", ""]]
			}
		}
	},
*/
	"warlock-fiend": {
		regExpSearch: /^(?=.*(fiend|devil|demon|daemon|hell|abyss))(?=.*warlock).*$/i,
		subname: "Fiend Patron",
		source: [["SRD24", 76], ["P24", 161]],
		features: {
			"subclassfeature3": {
				name: "Dark One's Blessing",
				source: [["SRD24", 76], ["P24", 161]],
				minlevel: 3,
				description: "\nWhen I reduce an enemy to 0 Hit Points or another reduces an enemy within 10 ft of me" + (typePF ? "\n" : " ") + "to 0 HP, I gain Temporary Hit Points equal to my Charisma modifier plus my Warlock level.",
				additional: levels.map(function (n) {
					return n + " + Cha mod Temp HP";
				}),
				spellcastingExtra: ["burning hands", "command", "scorching ray", "suggestion", "fireball", "stinking cloud", "fire shield", "wall of fire", "geas", "insect plague"],
				spellcastingExtraApplyNonconform: true,
			},
			"subclassfeature6" : {
				name : "Dark One's Own Luck",
				source: [["SRD24", 76], ["P24", 162]],
				minlevel: 6,
				description: "\nWhen I make an ability check or save, I can add +1d10 after the d20 roll, before its effects.",
				recovery: "Long Rest",
				usages: typePF ? "Charisma mod per " : "Charisma modifier per ",
				usagescalc: "event.value = Math.max(1, What('Cha Mod'));",
			},
			"subclassfeature10": {
				name: "Fiendish Resilience",
				source: [["SRD24", 76], ["P24", 162]],
				minlevel: 10,
				description: "\nAfter a Rest, I can gain Resistance to a chosen damage type (not Force) until I do this again.",
				additional: "After a Short or Long Rest",
			},
			"subclassfeature14": {
				name: "Hurl Through Hell",
				source: [["SRD24", 76], ["P24", 162]],
				minlevel: 14,
				description: "\nOnce per turn when I hit a creature with an attack roll, I can try to move it to the Lower Planes. It must make a Charisma save or disappear, take 8d10 Psychic damage if it isn't a Fiend, and be Incapacitated until my next turn ends, when it returns in the same or closest empty spot. I can do this once per Long Rest or by expending a Pact Magic spells slot (PSS).",
				recovery: "Long Rest",
				usages: 1,
				altResource: "PSS",
			},
		},
	},
	"wizard-evoker": {
		regExpSearch: /(evocation|evocer|evoker)/i,
		subname: "Evoker",
		fullname: "Evoker",
		source: [["SRD24", 82], ["P24", 174]],
		features: {
			"subclassfeature3": {
				name: "Evocation Savant",
				source: [["SRD24", 82], ["P24", 174]],
				minlevel: 3,
				description: "\nI add two Wizard Evocation spells, up to level 2, to my spellbook. Whenever I gain access to a new level of spell slots in this class, I can add one Wizard Evocation spell to my spellbook."
			},
			"subclassfeature3.1": {
				name: "Potent Cantrip",
				source: [["SRD24", 82], ["P24", 174]],
				minlevel: 3,
				description: "\nMy damaging cantrips still deal half damage when I miss or the target successfully saves.",
				calcChanges: {
					atkAdd: [
						function (fields, v) {
							if (v.isSpell && v.thisWeapon[3]) {
								if (v.isDC && SpellsList[v.thisWeapon[3]].save) {
									fields.Description = fields.Description.replace(/save to avoid/ , "save for half damage").replace(/ success - no( damage|thing)/ , "success - half damage");
								} else if (!v.isWeapon) {
									fields.Description += (fields.Description ? "; " : "") + "Half damage on miss";
								}
							};
						},
						"My cantrips still do half damage on a miss or a successful saving throw, but none of their other effects.",
					],
					spellAdd: [
						function (spellKey, spellObj, spName) {
							if (spellObj.psionic || spellObj.level || /self/i.test(spellObj.range) || !/[^-]\d+d\d+.*dmg/.test(spellObj.description)) return;
							var useSpellDescr = spellObj.genericSpellDmgEdit ? spellObj.description : getSpellShortDescription(spellKey, spellObj);
							var remSpellDescr = useSpellDescr;
							useSpellDescr = useSpellDescr.replace(/(at )?CL ?5(, |\/)11(, and |, \x26 |, |\/)17/i, "CL 5,11,17").replace(/\+1(d\d+) CL/i, "+$1 CL");
							if (spellObj.save) {
								useSpellDescr = useSpellDescr.replace("save or ", "").replace(/(; \+d\d+ CL.*$|$)/, "; save half$1");
							} else if (/atk|attack/i.test(spellObj.description)) {
								useSpellDescr = useSpellDescr.replace(/attacks?/ig, "atk").replace(/(; \+d\d+ CL.*$|$)/, "; miss half$1");
							} else {
								return; // neither save nor an attack cantrip
							}
							switch (spellKey) {
								// Legacy content
								case "lightning lure":
									useSpellDescr = useSpellDescr.replace("Lightning", "Lightn.").replace("pulled", "pull");
								// Extra effect, so make it "save/miss half only" and make space for addition
								case "starry wisp":
									useSpellDescr = useSpellDescr.replace("Rngd spell atk", "Spell atk").replace("EoT emits", "EoT").replace(/-(ft|m) dim light/i, "$1 dim");
									if (spellKey === "starry wisp" && useSpellDescr.indexOf("CL 5,11,17") !== -1) {
										useSpellDescr = useSpellDescr.replace("atk for", "atk");
									}
								case "chill touch":
									useSpellDescr = useSpellDescr.replace("regain HP", "heal HP");
								case "ray of frost":
									useSpellDescr = useSpellDescr.replace("speed", "spd");
								case "thorn whip":
									if (spellKey === "thorn whip" && /d6 CL 5/.test(useSpellDescr)) {
										useSpellDescr = useSpellDescr.replace("up to ", "\u2264");
									}
								case "shocking grasp":
									useSpellDescr = useSpellDescr.replace("it no opportunity", "no oppor. ");
								case "vicious mockery":
								case "mind sliver":
									useSpellDescr = useSpellDescr.replace(/(save|miss) half/, "$1 half only");
									break;
								// Too long string
								case "sorcerous burst":
									useSpellDescr = useSpellDescr.replace("Acid/Cold/Fire/Lightn./Pois./Psych/Thndr", "elemental/Poison/Psychic").replace("CL 5,11,17", "CL*");
									break;
							}
							if (remSpellDescr !== useSpellDescr) {
								spellObj.description = useSpellDescr;
								return true;
							}
						},
						"My cantrips still do half damage on a miss or a successful saving throw, but none of their other effects.",
					],
				},
			},
			"subclassfeature6": {
				name: "Sculpt Spells",
				source: [["SRD24", 82], ["P24", 174]],
				minlevel: 6,
				description: "\nIf I cast an evocation spell affecting others that I can see, I can choose a number of them to protect equal to 1 + the spell's level. They automatically succeed on their saves vs. the spell and take no damage if the spell would normally deal half damage on a successful save.",
			},
			"subclassfeature10": {
				name: "Empowered Evocation",
				source: [["SRD24", 82], ["P24", 174]],
				minlevel: 10,
				description: "\nI can add my Intelligence modifier to one damage roll of any Wizard Evocation spell I cast.",
				calcChanges : {
					atkCalc : [
						function (fields, v, output) {
							if (v.thisWeapon[4].indexOf("wizard") !== -1 && SpellsList[v.thisWeapon[3]] && SpellsList[v.thisWeapon[3]].school === "Evoc") {
								output.extraDmg += What('Int Mod');
							};
						},
						"I add my Intelligence modifier to a single damage roll of any wizard evocation spell I cast.",
					],
					spellAdd : [
						function (spellKey, spellObj, spName) {
							if (spName.indexOf("wizard") !== -1 && !spellObj.psionic && spellObj.school === "Evoc") return genericSpellDmgEdit(spellKey, spellObj, "\\w+\\.?", "Int", true);
						},
						"I add my Intelligence modifier to a single damage roll of any wizard evocation spell I cast.",
					],
				},
			},
			"subclassfeature14": {
				name: "Overchannel",
				source: [["SRD24", 82], ["P24", 174]],
				minlevel: 14,
				description: "\nWhen I cast a Wizard spell using a level 1-5 spell slot, I can have it deal maximum damage on the turn that I cast it. From the second time onwards that I do this after a Long Rest, I suffer 1d12 per attempt per spell slot level in Necrotic damage (e.g. 3rd attempt = 3d12 per spell slot level). This damage ignores Resistance and Immunity.",
				extraLimitedFeatures: [{
					name: "Overchannel",
					recovery: "Long Rest",
					usages: 1,
					usagescalc: "var FieldNmbr = parseFloat(event.target.name.slice(-2)); var usages = Number(What('Limited Feature Used ' + FieldNmbr)); event.value = !usages ? '' : (usages+1) + 'd12';",
				}],
			},
		},
	},
};
