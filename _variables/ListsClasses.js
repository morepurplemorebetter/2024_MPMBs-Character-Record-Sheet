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
// No longer used, but kept for legacy sources that use it
var GenericClassFeatures = {
	"potent spellcasting" : {
		name : "Potent Spellcasting",
		description : desc("I add my Wisdom modifier to the damage I deal with my cleric cantrips"),
		calcChanges : {
			atkCalc : [
				function (fields, v, output) {
					if (v.thisWeapon[3] && /\bcleric\b/.test(v.thisWeapon[4]) && SpellsList[v.thisWeapon[3]].level === 0 && /\d/.test(fields.Damage_Die)) {
						output.extraDmg += What('Wis Mod');
					};
				},
				"My cleric cantrips get my Wisdom modifier added to their damage."
			],
			spellAdd : [
				function (spellKey, spellObj, spName) {
					if (spellObj.psionic || spellObj.level !== 0 || spName.indexOf("cleric") == -1 || !What("Wis Mod") || Number(What("Wis Mod")) <= 0) return;
					return genericSpellDmgEdit(spellKey, spellObj, "\\w+\\.?", "Wis");
				},
				"My cleric cantrips get my Wisdom modifier added to their damage."
			]
		}
	}
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
				recovery: "long rest",
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
				recovery: "short rest",
				usagescalc: "var FieldNmbr = parseFloat(event.target.name.slice(-2)); var usages = Number(What('Limited Feature Used ' + FieldNmbr)); var DCval = Number(usages * 5 + 10); event.value = isNaN(usages) || isNaN(DCval) ? 'DC\u2003\u2003' : 'DC ' + DCval;",
			},
			"persistent rage": {
				name: "Persistent Rage",
				source: [["SRD24", 30], ["P24", 53]],
				minlevel: 15,
				description: "\nOnce per long rest when I roll initiative, I can regain all my expended uses of Rage.\nMy Rage now only ends early if I choose to end it, fall Unconscious, or don Heavy armor.",
				additional: "regain Rage uses",
				usages: 1,
				recovery: "long rest",
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
				source : [["SRD", 12], ["P", 53]],
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
			"jack of all trades" : {
				name : "Jack of All Trades",
				source : [["SRD", 12], ["P", 54]],
				minlevel : 2,
				description : desc("I can add half my Proficiency Bonus to any ability check that doesn't already include it"),
				eval : function() { Checkbox('Jack of All Trades', true); },
				removeeval : function() { Checkbox('Jack of All Trades', false); }
			},
			"song of rest" : {
				name : "Song of Rest",
				source : [["SRD", 12], ["P", 54]],
				minlevel : 2,
				description : desc("Those that use HD and can hear my performance during a short rest get extra healing"),
				additional : ["", "d6", "d6", "d6", "d6", "d6", "d6", "d6", "d8", "d8", "d8", "d8", "d10", "d10", "d10", "d10", "d12", "d12", "d12", "d12"]
			},
			"subclassfeature3" : {
				name : "Bard College",
				source : [["SRD", 12], ["P", 54]],
				minlevel : 3,
				description : desc('Choose a College that reflects your personality and put it in the "Class" field ')
			},
			"expertise" : function() {
				var a = {
					name : "Expertise",
					source : [["SRD", 13], ["P", 54]],
					minlevel : 3,
					description : desc("I gain expertise with two skills I am proficient with; two more at 10th level"),
					skillstxt : "Expertise with any two skill proficiencies, and two more at 10th level",
					additional : levels.map(function (n) {
						return n < 3 ? "" : "with " + (n < 10 ? 2 : 4) + " skills";
					}),
					extraname : "Bard Expertise",
					extrachoices : ["Acrobatics", "Animal Handling", "Arcana", "Athletics", "Deception", "History", "Insight", "Intimidation", "Investigation", "Medicine", "Nature", "Perception", "Performance", "Persuasion", "Religion", "Sleight of Hand", "Stealth", "Survival"],
					extraTimes : levels.map(function (n) { return n < 3 ? 0 : n < 10 ? 2 : 4; })
				}
				for (var i = 0; i < a.extrachoices.length; i++) {
					var attr = a.extrachoices[i].toLowerCase();
					a[attr] = {
						name : a.extrachoices[i] + " Expertise",
						description : "",
						source : a.source,
						skills : [[a.extrachoices[i], "only"]],
						prereqeval : function(v) {
							return v.skillProfsLC.indexOf(v.choice) === -1 ? false : v.skillExpertiseLC.indexOf(v.choice) === -1 ? true : "markButDisable";
						}
					}
				}
				return a;
			}(),
			"font of inspiration" : {
				name : "Font of Inspiration",
				source : [["SRD", 13], ["P", 54]],
				minlevel : 5,
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
			"channel divinity" : {
				name : "Channel Divinity",
				source : [["SRD", 16], ["P", 58]],
				minlevel : 2,
				description : desc("I can channel divine energy to cause an effect; the save for this is my cleric spell DC"),
				usages : [0, 1, 1, 1, 1, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 3, 3, 3],
				recovery : "short rest"
			},
			"turn undead" : {
				name : "Channel Divinity: Turn Undead",
				source : [["SRD", 16], ["P", 59]],
				minlevel : 2,
				description : desc([
					"As an action, all undead within 30 ft that can see/hear me must make a Wisdom save",
					"If an undead fails this save, it is turned for 1 minute or until it takes any damage",
					"Turned: move away, never within 30 ft of me, no reactions or actions other than Dash",
					"Turned: may Dodge instead of Dash when nowhere to move and unable to escape bonds"
				]),
				action : [["action", ""]]
			},
			"subclassfeature3": {
				name: "Cleric Subclass",
				source: [["SRD24", 37], ["P24", 71]],
				minlevel: 3,
				description: '\nChoose a Cleric Subclass using the "Class" button/bookmark or type its name into the "Class" field.',
			},
			"destroy undead" : {
				name : "Destroy Undead",
				source : [["SRD", 17], ["P", 59]],
				minlevel : 5,
				additional : ["", "", "", "", "CR \u00BD or lower", "CR \u00BD or lower", "CR \u00BD or lower", "CR 1 or lower", "CR 1 or lower", "CR 1 or lower", "CR 2 or lower", "CR 2 or lower", "CR 2 or lower", "CR 3 or lower", "CR 3 or lower", "CR 3 or lower", "CR 4 or lower", "CR 4 or lower", "CR 4 or lower", "CR 4 or lower"],
				description : desc("An undead up to the CR above that fails its save when I use Turn Undead is destroyed")
			},
			"divine intervention" : {
				name : "Divine Intervention",
				source : [["SRD", 17], ["P", 59]],
				minlevel : 10,
				additional : ["", "", "", "", "", "", "", "", "", "10% chance", "11% chance", "12% chance", "13% chance", "14% chance", "15% chance", "16% chance", "17% chance", "18% chance", "19% chance", "100% chance"],
				usages : 1,
				recovery : "long rest",
				description : desc([
					"As an action, I can implore my deity for help; the DM determines the form of help",
					"Without intervention, I can retry after a long rest; otherwise, I have to wait a week"
				]),
				action : [["action", ""]]
			}
		}
	},

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
				recovery : "short rest",
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
		regExpSearch: /^(?!.*(feral|tribal|dark|green|fey|horned|totem|spiritual|exalted|sacred|holy|divine|nature|odin|thor|nature|natural|green|beast|animal))(?=.*(fighter|warrior|militant|warlord|phalanx|gladiator|trooper)).*$/i,
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
				recovery: "long rest",
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
					return "\nOn my turn I can take an additional action, except the Magic action." + (n < 17 ? '' : "Only once per turn.");
				}),
				usages: levels.map(function (n) { return n < 2 ? 0 : n < 17 ? 1 : 2; }),
				recovery: "short rest",
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
				recovery: "long rest",
			},
			"studied attacks": {
				name: "Studied Attacks",
				source: [["SRD24", 48], ["P24", 92]],
				minlevel: 13,
				description: "\nIf I miss an attack, I have Adv. on next attack vs. same creature before my next turn ends.",
			},
		},
	},
/*
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
		subclasses : ["Monastic Tradition", ["monk-open hand"]],
		attacks: [1, 1, 1, 1, 2],
		features: {
			"unarmored defense": {
				name: "Unarmored Defense",
				source: [["SRD24", 50], ["P24", 101]],
				minlevel: 1,
				description: "\nWithout armor and no shield, my AC is 10 + Dexterity modifier + Wisdom modifier",
				armorOptions : [{
					regExpSearch: /justToAddToDropDownAndEffectWildShape/,
					name: "Unarmored Defense (Wis)",
					source: [["SRD24", 50], ["P24", 101]],
					ac: "10+Wis",
					affectsWildShape: true,
					selectNow: true,
				}],
				calcChanges: {
					atkAdd: [ // Mark light martial weapons as proficient if Monk is the primary class
						function (fields, v) {
							if (classes.primary === "monk" && !fields.Proficiency && /martial/i.test(v.theWea.type) && /\blight\b/i.test(fields.Description)) {
								fields.Proficiency = true;
							};
						},
						"",
						10,
					],
				},
			},
			"martial arts" : {
				name : "Martial Arts",
				source : [["SRD", 26], ["P", 78]],
				minlevel : 1,
				description : desc([
					"Monk weapons: unarmed strike, simple melee, martial light melee",
					"With monk weapons, I can use Dex instead of Str and use the Martial Arts damage die",
					"When taking an Attack action with these, I get one unarmed strike as a bonus action"
				]),
				additional : levels.map(function (n) {
					return "1d" + (n < 5 ? 6 : n < 11 ? 8 : n < 17 ? 10 : 12);
				}),
				action : [["bonus action", "Unarmed Strike"]],
				eval : function() {
					AddString('Extra.Notes', 'Monk features:\n\u25C6 If I wear armor/shield, I lose Unarmored Defense, Martial Arts, and Unarmored Movement');
					show3rdPageNotes();
				},
				removeeval : function() {
					RemoveString('Extra.Notes', 'Monk features:\n\u25C6 If I wear armor/shield, I lose Unarmored Defense, Martial Arts, and Unarmored Movement');
				},
				calcChanges : {
					atkAdd : [
						function (fields, v) {
							if (!classes.known.monk || !classes.known.monk.level || v.theWea.monkweapon === false) return;
							if (  v.theWea.monkweapon ||
								( v.isMeleeWeapon && /simple/i.test(v.theWea.type) ) ||
								( v.isMeleeWeapon && /martial/i.test(v.theWea.type) && /\blight\b/i.test(fields.Description) )
							) {
								v.theWea.monkweapon = true;
								var aMonkDie = function (n) { return n < 5 ? 6 : n < 11 ? 8 : n < 17 ? 10 : 12; }(classes.known.monk.level);
								try {
									var curDie = eval_ish(fields.Damage_Die.replace('d', '*'));
								} catch (e) {
									var curDie = 'x';
								};
								if ( !v.isDC && (isNaN(curDie) || curDie < aMonkDie) ) {
									fields.Damage_Die = '1d' + aMonkDie;
								};
								if (fields.Mod === 1 || fields.Mod === 2 || What(AbilityScores.abbreviations[fields.Mod - 1] + " Mod") < What(AbilityScores.abbreviations[v.StrDex - 1] + " Mod")) {
									fields.Mod = v.StrDex;
								}
							};
						},
						"I can use either Strength or Dexterity and my Martial Arts damage die in place of the normal damage die for any 'Monk Weapons', which include unarmed strike, shortsword, and any simple melee weapon that is not two-handed or heavy.",
						5
					]
				}
			},
			"ki" : {
				name : "Ki",
				source : [["SRD", 27], ["P", 78]],
				minlevel : 2,
				description : desc([
					"I can spend ki points to fuel special actions (see third page)",
					"I need to meditate for at least 30 min of a short rest for that short rest to restore ki"
				]),
				limfeaname : "Ki Points",
				usages : levels.map(function (n) { return n < 2 ? "" : n }),
				recovery : "short rest",
				"flurry of blows" : {
					name : "Flurry of Blows",
					extraname : "Ki Feature",
					source : [["SRD", 27], ["P", 78]],
					description : " [1 ki point]" + desc("After taking the Attack action, I can make 2 unarmed attacks as a bonus action"),
					action : [["bonus action", " (after Attack action)"]]
				},
				"patient defense" : {
					name : "Patient Defense",
					extraname : "Ki Feature",
					source : [["SRD", 27], ["P", 78]],
					description : " [1 ki point]" + desc("As a bonus action, I can take the Dodge action"),
					action : [["bonus action", ""]]
				},
				"step of the wind" : {
					name : "Step of the Wind",
					extraname : "Ki Feature",
					source : [["SRD", 27], ["P", 78]],
					description : " [1 ki point]" + desc("As a bonus action, I can either Dash or Disengage; My jump distance doubles when I do so"),
					action : [["bonus action", ""]]
				},
				autoSelectExtrachoices : [{
					extrachoice : "flurry of blows"
				}, {
					extrachoice : "patient defense"
				}, {
					extrachoice : "step of the wind"
				}]
			},
			"unarmored movement" : {
				name : "Unarmored Movement",
				source : [["SRD", 27], ["P", 78]],
				minlevel : 2,
				description : desc("Speed increases and eventually lets me traverse some surfaces without falling as I move"),
				additional : levels.map(function (n) {
					if (n < 2) return "";
					var spd = "+" + (n < 6 ? 10 : n < 10 ? 15 : n < 14 ? 20 : n < 18 ? 25 : 30) + " ft";
					var xtr = n < 9 ? "" : "; Vertical surfaces and liquids";
					return spd + xtr;
				}),
				changeeval : function (v) {
					var monkSpd = '+' + (v[1] < 2 ? 0 : v[1] < 6 ? 10 : v[1] < 10 ? 15 : v[1] < 14 ? 20 : v[1] < 18 ? 25 : 30);
					SetProf('speed', monkSpd !== '+0', {allModes : monkSpd}, "Monk: Unarmored Movement");
				}
			},
			"subclassfeature3" : {
				name : "Monastic Tradition",
				source : [["SRD", 27], ["P", 78]],
				minlevel : 3,
				description : desc('Choose a Monastic Tradition to commit to and put it in the "Class" field ')
			},
			"deflect missiles" : {
				name : "Deflect Missiles",
				source : [["SRD", 27], ["P", 78]],
				minlevel : 3,
				description : desc([
					"As a reaction, I can reduce ranged weapon attack damage done to me",
					"If the damage is negated, I catch and may throw it back (20/60 ft) as a monk weapon"
				]),
				action : [["reaction", ""]],
				additional : levels.map(function (n) {
					return n < 3 ? "" : "1d10 + " + n + " + Dexterity modifier; 1 ki to throw";
				})
			},
			"slow fall" : {
				name : "Slow Fall",
				source : [["SRD", 27], ["P", 78]],
				minlevel : 4,
				description : desc("As a reaction, I can reduce any falling damage I take by five times my monk level"),
				additional : levels.map(function (n) { return n < 4 ? "" : (n*5) + " less falling damage" }),
				action : [["reaction", ""]],
				"stunning strike" : {
					name : "Stunning Strike",
					extraname : "Monk 5",
					source : [["SRD", 27], ["P", 79]],
					description : " [1 ki point]" + desc([
						"After I hit a creature with a melee weapon attack, I can spend a ki point to try to stun it",
						"It has to succeed on a Constitution save or be stunned until the end of my next turn"
					])
				},
				autoSelectExtrachoices : [{
					extrachoice : "stunning strike",
					minlevel : 5
				}]
			},
			"ki-empowered strikes" : {
				name : "Ki-Empowered Strikes",
				source : [["SRD", 28], ["P", 79]],
				minlevel : 6,
				description : desc("My unarmed strikes count as magical for overcoming resistances and immunities"),
				calcChanges : {
					atkAdd : [
						function (fields, v) {
							if (v.baseWeaponName == "unarmed strike" && !v.thisWeapon[1] && !v.theWea.isMagicWeapon && !(/counts as( a)? magical/i).test(fields.Description)) {
								fields.Description += (fields.Description ? '; ' : '') + 'Counts as magical';
							};
						},
						"My unarmed strikes count as magical for overcoming resistances and immunities."
					]
				}
			},
			"evasion" : {
				name : "Evasion",
				source : [["SRD", 28], ["P", 79]],
				minlevel : 7,
				description : desc("My Dexterity saves vs. areas of effect negate damage on success and halve it on failure"),
				savetxt : { text : ["Dex save vs. area effects: fail \u2015 half dmg, success \u2015 no dmg"] }
			},
			"stillness of mind" : {
				name : "Stillness of Mind",
				source : [["SRD", 28], ["P", 79]],
				minlevel : 7,
				description : desc("As an action, I can end one effect on me that causes me to be charmed or frightened"),
				action : [["action", ""]]
			},
			"purity of body" : {
				name : "Purity of Body",
				source : [["SRD", 28], ["P", 79]],
				minlevel : 10,
				description : typeA4 ? desc("My mastery of the ki flowing through me makes me immune to poison and disease") : " [" + "I am immune to poison and disease" + "]",
				savetxt : { immune : ["poison", "disease"] } //both immune to poison damage and the poisoned condition (see sage advice)
			},
			"tongue of the sun and moon" : {
				name : "Tongue of the Sun and Moon",
				source : [["SRD", 28], ["P", 79]],
				minlevel : 13,
				description : desc("I can understand all spoken languages and all creatures with a language understand me")
			},
			"diamond soul" : {
				name : "Diamond Soul",
				source : [["SRD", 28], ["P", 79]],
				minlevel : 14,
				description : desc("I am proficient with all saves; I can reroll a failed save once by spending 1 ki point"),
				additional : "1 ki point to reroll failed saving throw",
				saves : ["Str", "Dex", "Con", "Int", "Wis", "Cha"]
			},
			"timeless body" : {
				name : "Timeless Body",
				source : [["SRD", 28], ["P", 79]],
				minlevel : 15,
				description : desc("I don't require food or water; I don't suffer age penalties and can't be aged magically")
			},
			"empty body" : {
				name : "Empty Body",
				source : [["SRD", 28], ["P", 79]],
				minlevel : 18,
				description : desc("Be invisible and resist non-force damage for 1 min or cast Astral Projection on self"),
				additional : "Invisible: 4 ki points; Astral Projection: 8 ki points",
				action : [["action", ""]],
				spellcastingBonus : [{
					name : "Empty Body",
					spells : ["astral projection"],
					selection : ["astral projection"],
					firstCol : 8
				}],
				spellFirstColTitle : "Ki",
				spellChanges : {
					"astral projection" : {
						components : "V,S",
						compMaterial : "",
						description : "I project myself to the Astral Plane with identical statistics, see book",
						changes : "I can spend 8 ki points to cast Astral Projection without requiring material components, although I can't bring other creatures with me."
					}
				}
			},
			"perfect self" : {
				name : "Perfect Self",
				source : [["SRD", 28], ["P", 79]],
				minlevel : 20,
				description : desc("I regain 4 ki points if I have no more remaining when I roll initiative")
			}
		}
	},

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
				recovery : "long rest",
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
				recovery : "long rest",
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
				recovery : "short rest"
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
				recovery : "long rest",
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
		subclasses: ["Rogue Subclass", ["rogue-thief"]],
		features: {
			"expertise" : function() {
				var a = {
					name : "Expertise",
					source : [["SRD", 39], ["P", 96]],
					minlevel : 1,
					description : desc("I gain expertise with two skills/thieves' tools I am proficient with; two more at 6th level"),
					skillstxt : "Expertise with any two skill proficiencies and/or thieves' tools, and two more at 6th level",
					additional : levels.map(function (n) {
						return "with " + (n < 6 ? 2 : 4) + " skills";
					}),
					extraname : "Expertise",
					extrachoices : ["Acrobatics", "Animal Handling", "Arcana", "Athletics", "Deception", "History", "Insight", "Intimidation", "Investigation", "Medicine", "Nature", "Perception", "Performance", "Persuasion", "Religion", "Sleight of Hand", "Stealth", "Survival", "Thieves' Tools"],
					extraTimes : levels.map(function (n) { return n < 6 ? 2 : 4; }),
					"thieves' tools" : {
						name : "Thieves' Tools Expertise", description : "",
						source : [["SRD", 39], ["P", 96]],
						prereqeval : function(v) {
							if ((/thieve.?s.*tools/i).test(What('Too Text')) && tDoc.getField("Too Prof").isBoxChecked(0)) {
								return tDoc.getField("Too Exp").isBoxChecked(0) ? "markButDisable" : true;
							} else {
								return CurrentProfs.tool["thieves' tools"] || (/thieve.?s.{1,3}tools/i).test(v.toolProfs.toString());
							}
						},
						eval : function () {
							if ((/thieve.?s.*tools/i).test(What('Too Text'))) {
								Checkbox('Too Exp', true);
							};
						},
						removeeval : function () {
							if ((/thieve.?s.*tools/i).test(What('Too Text'))) {
								Checkbox('Too Exp', false);
							};
						}
					}
				}
				for (var i = 0; i < a.extrachoices.length; i++) {
					var attr = a.extrachoices[i].toLowerCase();
					if (a[attr]) continue;
					a[attr] = {
						name : a.extrachoices[i] + " Expertise",
						description : "",
						source : a.source,
						skills : [[a.extrachoices[i], "only"]],
						prereqeval : function(v) {
							return v.skillProfsLC.indexOf(v.choice) === -1 ? false : v.skillExpertiseLC.indexOf(v.choice) === -1 ? true : "markButDisable";
						}
					}
				}
				return a;
			}(),
			"sneak attack" : {
				name : "Sneak Attack",
				source : [["SRD", 39], ["P", 96]],
				minlevel : 1,
				description : desc([
					"Once per turn, I can add damage to a finesse/ranged weapon attack if I have advantage",
					"I don't need adv. if the target has a conscious enemy within 5 ft and I don't have disadv."
				]),
				additional : levels.map(function (n) {
					return Math.ceil(n / 2) + "d6";
				}),
				calcChanges : {
					atkAdd : [
						function (fields, v) {
							if (classes.known.rogue && classes.known.rogue.level && !v.isSpell && !v.isDC && (v.isRangedWeapon || (/\bfinesse\b/i).test(fields.Description))) {
								v.sneakAtk = Math.ceil(classes.known.rogue.level / 2);
								fields.Description += (fields.Description ? '; ' : '') + 'Sneak attack ' + v.sneakAtk + 'd6';
							};
						},
						"Once per turn, when I attack with a ranged or finesse weapon while I have advantage or an conscious ally is within 5 ft of the target, I can add my sneak attack damage to the attack.",
						700
					]
				}
			},
			"thieves cant" : {
				name : "Thieves' Cant",
				source : [["SRD", 39], ["P", 96]],
				minlevel : 1,
				description : desc("I know the secret rogue language that I can use to convey messages inconspicuously"),
				languageProfs : ["Thieves' Cant"],
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
			"cunning action" : {
				name : "Cunning Action",
				source : [["SRD", 40], ["P", 96]],
				minlevel : 2,
				description : desc("I can use a bonus action to take the Dash, Disengage, or Hide action"),
				action : [["bonus action", ""]]
			},
			"subclassfeature3" : {
				name : "Roguish Archetype",
				source : [["SRD", 40], ["P", 96]],
				minlevel : 3,
				description : desc('Choose a Roguish Archetype you strive to emulate and put it in the "Class" field ')
			},
			"uncanny dodge" : {
				name : "Uncanny Dodge",
				source : [["SRD", 40], ["P", 96]],
				minlevel : 5,
				description : desc("As a reaction, I can halve the damage of an attack from an attacker that I can see"),
				action : [["reaction", ""]]
			},
			"evasion" : {
				name : "Evasion",
				source : [["SRD", 40], ["P", 96]],
				minlevel : 7,
				description : desc("My Dexterity saves vs. areas of effect negate damage on success and halve it on failure"),
				savetxt : { text : ["Dex save vs. area effects: fail \u2015 half dmg, success \u2015 no dmg"] }
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
				recovery : "short rest",
				usages : 1
			}
		}
	},

	"sorcerer" : {
		regExpSearch: /sorcerer|witch/i,
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
				recovery : "long rest",
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
		spellcastingList : {
			"class" : "warlock",
			level : [0, 5] //lower and higher limit
		},
		features: {
			"pact magic": {
				name: "Pact Magic",
				source: [["SRD24", 71], ["P24", 153]],
				minlevel: 1,
				description: "\nI can cast Warlock cantrips/spells I know, using Cha as spellcasting ability. I can use Arcane Focus as Spellcasting Focus for them. I can swap 1 cantrip and 1 spell when I gain a level.",
				additional: levels.map(function (n, idx) {
					var cantr = [2, 2, 2, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4][idx];
					var splls = [2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 11, 11, 12, 12, 13, 13, 14, 14, 15, 15][idx];
					var slots = n < 2 ? 1 : n < 11 ? 2 : n < 17 ? 3 : 4;
					var sllvl = n < 3 ? 1 : n < 5 ? 2 : n < 7 ? 3 : n < 9 ? 4 : 5;
					return cantr + " cantrips \x26 " + splls + " spells known; " + slots + "\xD7 " + Base_spellLevelList[sllvl] + " spell slot";
				}),
			},
			"subclassfeature1" : {
				name : "Otherworldly Patron",
				source : [["SRD", 46], ["P", 107]],
				minlevel : 1,
				description : desc('Choose the Otherworldly Patron you have a bargain with and put it in the "Class" field ')
			},
			"eldritch invocations" : {
				name : "Eldritch Invocations",
				source : [["SRD", 47], ["P", 107]],
				minlevel : 2,
				description : desc([
					'Use the "Choose Feature" button above to add Eldritch Invocations to the third page',
					"Whenever I gain a warlock level, I can replace an invocation I know with another"
				]),
				additional : levels.map(function (n) {
					return n < 2 ? "" : (n < 5 ? 2 : n < 7 ? 3 : n < 9 ? 4 : n < 12 ? 5 : n < 15 ? 6 : n < 18 ? 7 : 8) + " invocations known";
				}),
				extraname : "Eldritch Invocation",
				extrachoices : ["Agonizing Blast (prereq: Eldritch Blast cantrip)", "Armor of Shadows", "Ascendant Step (prereq: level 9 warlock)", "Beast Speech", "Beguiling Influence", "Bewitching Whispers (prereq: level 7 warlock)", "Book of Ancient Secrets (prereq: Pact of the Tome)", "Chains of Carceri (prereq: level 15 warlock, Pact of the Chain)", "Devil's Sight", "Dreadful Word (prereq: level 7 warlock)", "Eldritch Sight", "Eldritch Spear (prereq: Eldritch Blast cantrip)", "Eyes of the Rune Keeper", "Fiendish Vigor", "Gaze of Two Minds", "Lifedrinker (prereq: level 12 warlock, Pact of the Blade)", "Mask of Many Faces", "Master of Myriad Forms (prereq: level 15 warlock)", "Minions of Chaos (prereq: level 9 warlock)", "Mire the Mind (prereq: level 5 warlock)", "Misty Visions", "One with Shadows (prereq: level 5 warlock)", "Otherworldly Leap (prereq: level 9 warlock)", "Repelling Blast (prereq: Eldritch Blast cantrip)", "Sculptor of Flesh (prereq: level 7 warlock)", "Sign of Ill Omen (prereq: level 5 warlock)", "Thief of Five Fates", "Thirsting Blade (prereq: level 5 warlock, Pact of the Blade)", "Visions of Distant Realms (prereq: level 15 warlock)", "Voice of the Chain Master (prereq: Pact of the Chain)", "Whispers of the Grave (prereq: level 9 warlock)", "Witch Sight (prereq: level 15 warlock)"],
				extraTimes : levels.map(function (n) {
					return n < 2 ? 0 : n < 5 ? 2 : n < 7 ? 3 : n < 9 ? 4 : n < 12 ? 5 : n < 15 ? 6 : n < 18 ? 7 : 8;
				}),
				"agonizing blast (prereq: eldritch blast cantrip)" : {
					name : "Agonizing Blast",
					description : desc("I can add my Charisma modifier to every hit with my Eldritch Blast cantrip"),
					source : [["SRD", 48], ["P", 110]],
					submenu : "[improves Eldritch Blast]",
					prereqeval : function(v) { return v.hasEldritchBlast; },
					calcChanges : {
						atkCalc : [
							function (fields, v, output) {
								if (v.baseWeaponName == 'eldritch blast') output.extraDmg += What('Cha Mod');
							},
							"I add my Charisma modifier to the damage of every beam of my Eldritch Blast cantrip."
						],
						spellAdd : [
							function (spellKey, spellObj, spName) {
								if (spellKey == "eldritch blast") {
									spellObj.description = spellObj.description.replace("1d10 Force damage", "1d10+" + What("Cha Mod") + " Force dmg");
									return true;
								};
							},
							"I add my Charisma modifier to the damage of every beam of my Eldritch Blast cantrip."
						]
					}
				},
				"armor of shadows" : {
					name : "Armor of Shadows",
					description : desc("I can cast Mage Armor on myself at will, without using a spell slot or material components"),
					source : [["SRD", 48], ["P", 110]],
					spellcastingBonus : [{
						name : "Armor of Shadows",
						spells : ["mage armor"],
						selection : ["mage armor"],
						firstCol : "atwill"
					}],
					spellChanges : {
						"mage armor" : {
							range : "Self",
							components : "V,S",
							compMaterial : "",
							description : "If I'm not wearing armor, I gain AC 13 + Dex modifier for the duration; spell ends if I don armor",
							changes : "With the Armor of Shadows invocation I can cast Mage Armor without a material component, but only on myself."
						}
					}
				},
				"ascendant step (prereq: level 9 warlock)" : {
					name : "Ascendant Step",
					description : desc("I can cast Levitate on myself at will, without using a spell slot or material components"),
					source : [["SRD", 48], ["P", 110]],
					submenu : "[warlock level  9+]",
					spellcastingBonus : [{
						name : "Ascendant Step",
						spells : ["levitate"],
						selection : ["levitate"],
						firstCol : "atwill"
					}],
					prereqeval : function(v) { return classes.known.warlock.level >= 9; },
					spellChanges : {
						"levitate" : {
							range : "Self",
							components : "V,S",
							compMaterial : "",
							description : "I rise vertically, up to 20 ft; during my move, I can move up/down up to 20 ft",
							changes : "With the Ascendant Step invocation I can cast Levitate without a material component, but only on myself."
						}
					}
				},
				"beast speech" : {
					name : "Beast Speech",
					description : desc("I can cast Speak with Animals at will, without using a spell slots"),
					source : [["SRD", 48], ["P", 110]],
					spellcastingBonus : [{
						name : "Beast Speech",
						spells : ["speak with animals"],
						selection : ["speak with animals"],
						firstCol : "atwill"
					}]
				},
				"beguiling influence" : {
					name : "Beguiling Influence",
					description : desc("I gain proficiencies with the Deception and Persuasion skills"),
					source : [["SRD", 48], ["P", 110]],
					skills : ["Deception", "Persuasion"]
				},
				"bewitching whispers (prereq: level 7 warlock)" : {
					name : "Bewitching Whispers",
					description : desc("Once per long rest, I can cast Compulsion using a warlock spell slot"),
					source : [["SRD", 48], ["P", 110]],
					submenu : "[warlock level  7+]",
					usages : 1,
					recovery : "long rest",
					spellcastingBonus : [{
						name : "Bewitching Whispers",
						spells : ["compulsion"],
						selection : ["compulsion"],
						firstCol : "oncelr"
					}],
					prereqeval : function(v) { return classes.known.warlock.level >= 7; }
				},
				"book of ancient secrets (prereq: pact of the tome)" : {
					name : "Book of Ancient Secrets",
					description : desc([
						"I can add any two 1st-level spells that have the ritual tag to my Book of Shadows",
						"If I come across spells with the ritual tag, I can transcribe them into my book, as well",
						"I can cast any of these spells in my Book of Shadows as rituals, but not as normal spells",
						"I can cast my known warlock spells as rituals if they have the ritual tag"
					]),
					source : [["SRD", 48], ["P", 110]],
					submenu : "[improves Pact of the Tome]",
					eval : function() {
						CurrentSpells['warlock-book of ancient secrets'] = {
							name : 'Book of Ancient Secrets',
							ability : 'warlock',
							list : {class : 'any', ritual : true},
							known : {spells : 'book'},
							refType : "feat"
						};
						if (CurrentSpells['book of ancient secrets'] && CurrentSpells['book of ancient secrets'].selectSp) {
							// v12.999 style is present, so transfer chosen spells over and remove it
							CurrentSpells['warlock-book of ancient secrets'].offsetBo = CurrentSpells['book of ancient secrets'].offsetBo;
							CurrentSpells['warlock-book of ancient secrets'].selectBo = CurrentSpells['book of ancient secrets'].selectBo;
							CurrentSpells['warlock-book of ancient secrets'].selectSp = CurrentSpells['book of ancient secrets'].selectSp;
							delete CurrentSpells['book of ancient secrets'];
						}
						SetStringifieds('spells'); CurrentUpdates.types.push('spells');
					},
					removeeval : function() {
						delete CurrentSpells['warlock-book of ancient secrets'];
						SetStringifieds('spells'); CurrentUpdates.types.push('spells');
					},
					prereqeval : function(v) { return classes.known.warlock.level >= 3 && GetFeatureChoice('class', 'warlock', 'pact boon') == 'pact of the tome'; },
					calcChanges : {
						spellAdd : [
							function (spellKey, spellObj, spName) {
								if (spName == "book of ancient secrets") {
									spellObj.firstCol = '\xAE';
									if (!/\d+ ?h\b|special|see b/i).test(spellObj.time)) {
										var numMinutes = Number(spellObj.time.replace(/(\d+) ?min.*$/, "$1"));
										if (isNaN(numMinutes)) numMinutes = 0;
										spellObj.time = (numMinutes + 10) + " min";
									}
									return true;
								};
							},
							"By the Book of Ancient Secrets invocation, I can cast ritual spells from my Book of Shadows. Ritual spell always have a casting time of 10 minutes or more."
						]
					}
				},
				"chains of carceri (prereq: level 15 warlock, pact of the chain)" : {
					name : "Chains of Carceri",
					description : desc([
						"I can cast Hold Monster at will if the target is a celestial, fiend, or elemental",
						"This uses no spell slots/material comp.; I can only target an individual once per long rest"
					]),
					source : [["SRD", 49], ["P", 110]],
					submenu : "[improves Pact of the Chain]",
					spellcastingBonus : [{
						name : "Chains of Carceri",
						spells : ["hold monster"],
						selection : ["hold monster"],
						firstCol : "atwill"
					}],
					prereqeval : function(v) { return classes.known.warlock.level >= 15 && GetFeatureChoice('class', 'warlock', 'pact boon') == 'pact of the chain'; },
					spellChanges : {
						"speak with animals" : {
							components : "V,S",
							compMaterial : "",
							description : "1 celestial, fiend, or elemental, save or paralyzed; extra save at end of each turn",
							changes : "With the Chains of Carceri invocation I can cast Hold Monster without a material component, but only on a celestial, fiend, or elemental."
						}
					}
				},
				"devil's sight" : {
					name : "Devil's Sight",
					description : desc("I can see in magical and nonmagical darkness out to 120 ft"),
					source : [["SRD", 49], ["P", 110]],
					vision : [["Devil's sight", 120]]
				},
				"dreadful word (prereq: level 7 warlock)" : {
					name : "Dreadful Word",
					description : desc("Once per long rest, I can cast Confusion using a warlock spell slot"),
					source : [["SRD", 49], ["P", 110]],
					submenu : "[warlock level  7+]",
					usages : 1,
					recovery : "long rest",
					spellcastingBonus : [{
						name : "Dreadful Word",
						spells : ["confusion"],
						selection : ["confusion"],
						firstCol : "oncelr"
					}],
					prereqeval : function(v) { return classes.known.warlock.level >= 7; }
				},
				"eldritch sight" : {
					name : "Eldritch Sight",
					description : desc("I can cast Detect Magic at will, without using a spell slot"),
					source : [["SRD", 49], ["P", 110]],
					spellcastingBonus : [{
						name : "Eldritch Sight",
						spells : ["detect magic"],
						selection : ["detect magic"],
						firstCol : "atwill"
					}]
				},
				"eldritch spear (prereq: eldritch blast cantrip)" : {
					name : "Eldritch Spear",
					description : desc("My Eldritch Blast cantrip has a range of 300 ft"),
					source : [["SRD", 49], ["P", 111]],
					submenu : "[improves Eldritch Blast]",
					prereqeval : function(v) { return v.hasEldritchBlast; },
					calcChanges : {
						atkAdd : [
							function (fields, v) {
								if (v.baseWeaponName == 'eldritch blast') fields.Range = 300 * (v.rangeM ? v.rangeM : 1) + ' ft';
							},
							"My Eldritch Blast cantrip has a range of 300 ft.",
							50
						],
						spellAdd : [
							function (spellKey, spellObj, spName) {
								if (spellKey == 'eldritch blast') {
									spellObj.range = '300 ft';
									if (What("Unit System") === "metric") spellObj.range = ConvertToMetric(spellObj.range, 0.5);
								}
							},
							"My Eldritch Blast cantrip has a range of 300 ft.",
							50
						]
					}
				},
				"eyes of the rune keeper" : {
					name : "Eyes of the Rune Keeper",
					description : desc("I can read all writing"),
					source : [["SRD", 49], ["P", 111]]
				},
				"fiendish vigor" : {
					name : "Fiendish Vigor",
					description : desc("I can cast False Life on myself at will, without using a spell slot or material components"),
					source : [["SRD", 49], ["P", 111]],
					spellcastingBonus : [{
						name : "Fiendish Vigor",
						spells : ["false life"],
						selection : ["false life"],
						firstCol : "atwill"
					}],
					spellChanges : {
						"false life" : {
							components : "V,S",
							compMaterial : "",
							description : "I gain 1d4+4 temporary hit points for the duration",
							changes : "With the Fiendish Vigor invocation I can cast False Life without a material component."
						}
					}
				},
				"gaze of two minds" : {
					name : "Gaze of Two Minds",
					description : desc([
						"As an action, I can touch a willing creature and perceive through its senses (not my own)",
						"This lasts until the end of my next turn, but I can use an action to extend the duration"
					]),
					source : [["SRD", 49], ["P", 111]]
				},
				"lifedrinker (prereq: level 12 warlock, pact of the blade)" : {
					name : "Lifedrinker",
					description : desc("My pact weapon does extra necrotic damage equal to my Charisma modifier"),
					source : [["SRD", 49], ["P", 111]],
					submenu : "[improves Pact of the Blade]",
					calcChanges : {
						atkAdd : [
							function (fields, v) {
								if (v.pactWeapon) fields.Description += (fields.Description ? '; ' : '') + '+Cha mod necrotic damage (included above)';
							},
							"My Charisma modifier will be added to the damage of my Pact Weapons. However, it won't say in the damage box that this added damage is of the necrotic type, as it can only display a single damage type."
						],
						atkCalc : [
							function (fields, v, output) {
								if (v.pactWeapon) output.extraDmg += What('Cha Mod');
							}, ""
						]
					},
					prereqeval : function(v) { return classes.known.warlock.level >= 12 && GetFeatureChoice('class', 'warlock', 'pact boon') == 'pact of the blade'; }
				},
				"mask of many faces" : {
					name : "Mask of Many Faces",
					description : desc("I can cast Disguise Self on myself at will, without using a spell slot"),
					source : [["SRD", 49], ["P", 111]],
					spellcastingBonus : [{
						name : "Mask of Many Faces",
						spells : ["disguise self"],
						selection : ["disguise self"],
						firstCol : "atwill"
					}]
				},
				"master of myriad forms (prereq: level 15 warlock)" : {
					name : "Master of Myriad Forms",
					description : desc("I can cast Alter Self at will, without using a spell slot"),
					source : [["SRD", 49], ["P", 111]],
					submenu : "[warlock level 15+]",
					spellcastingBonus : [{
						name : "Mask of Myriad Forms",
						spells : ["alter self"],
						selection : ["alter self"],
						firstCol : "atwill"
					}],
					prereqeval : function(v) { return classes.known.warlock.level >= 15; }
				},
				"minions of chaos (prereq: level 9 warlock)" : {
					name : "Minions of Chaos",
					description : desc("Once per long rest, I can cast Conjure Elemental using a warlock spell slot"),
					source : [["SRD", 49], ["P", 111]],
					submenu : "[warlock level  9+]",
					usages : 1,
					recovery : "long rest",
					spellcastingBonus : [{
						name : "Minions of Chaos",
						spells : ["conjure elemental"],
						selection : ["conjure elemental"],
						firstCol : "oncelr"
					}],
					prereqeval : function(v) { return classes.known.warlock.level >= 9; }
				},
				"mire the mind (prereq: level 5 warlock)" : {
					name : "Mire the Mind",
					description : desc("Once per long rest, I can cast Slow using a warlock spell slot"),
					source : [["SRD", 49], ["P", 111]],
					submenu : "[warlock level  5+]",
					usages : 1,
					recovery : "long rest",
					spellcastingBonus : [{
						name : "Mire the Mind",
						spells : ["slow"],
						selection : ["slow"],
						firstCol : "oncelr"
					}],
					prereqeval : function(v) { return classes.known.warlock.level >= 5; }
				},
				"misty visions" : {
					name : "Misty Visions",
					description : desc("I can cast Silent Image at will, without using a spell slot or material components"),
					source : [["SRD", 49], ["P", 111]],
					spellcastingBonus : [{
						name : "Misty Visions",
						spells : ["silent image"],
						selection : ["silent image"],
						firstCol : "atwill"
					}],
					spellChanges : {
						"silent image" : {
							components : "V,S",
							compMaterial : "",
							changes : "With the Misty Visions invocation I can cast Silent Image without a material component."
						}
					}
				},
				"one with shadows (prereq: level 5 warlock)" : {
					name : "One with Shadows",
					description : desc([
						"As an action, when I'm in an area of dim light or darkness, I can become invisible",
						"I become visible again when I move or take an action or reaction"
					]),
					source : [["SRD", 49], ["P", 111]],
					submenu : "[warlock level  5+]",
					action : [["action", ""]],
					prereqeval : function(v) { return classes.known.warlock.level >= 5; }
				},
				"otherworldly leap (prereq: level 9 warlock)" : {
					name : "Otherworldly Leap",
					description : desc("I can cast Jump on myself at will, without using a spell slot or material components"),
					source : [["SRD", 49], ["P", 111]],
					submenu : "[warlock level  9+]",
					spellcastingBonus : [{
						name : "Otherworldly Leap",
						spells : ["jump"],
						selection : ["jump"],
						firstCol : "atwill"
					}],
					prereqeval : function(v) { return classes.known.warlock.level >= 9; },
					spellChanges : {
						"jump" : {
							range : "Self",
							components : "V,S",
							compMaterial : "",
							description : "My jump distance is tripled for the duration",
							changes : "With the Otherworldly Leap invocation I can cast Jump without a material component, but only on myself."
						}
					}
				},
				"repelling blast (prereq: eldritch blast cantrip)" : {
					name : "Repelling Blast",
					description : desc("I can have creatures hit by my Eldritch Blast cantrip be pushed 10 ft away from me"),
					source : [["SRD", 49], ["P", 111]],
					submenu : "[improves Eldritch Blast]",
					prereqeval : function(v) { return v.hasEldritchBlast; },
					calcChanges : {
						atkAdd : [
							function (fields, v) {
								if (v.baseWeaponName == 'eldritch blast') fields.Description += '; Target pushed back 10 ft';
							},
							"When I hit a creature with my Eldritch Blast cantrip, it is pushed 10 ft away from me.",
							51
						],
						spellAdd : [
							function (spellKey, spellObj, spName) {
								if (spellKey == 'eldritch blast') {
									spellObj.description = "Spell attack beam 1d10 Force damage \x26 push 10 ft; beams can be combined; +1 beam at CL5,11,17";
									spellObj.descriptionShorter = "Spell atk beam 1d10 Force damage \x26 push 10 ft; can combine beams; +1 beam at CL5,11,17";
									spellObj.descriptionCantripDie = "Spell atk for `CD` beam(s), each 1d10 Force damage \x26 push 10 ft; can combine/split beams";
								}
							},
							"When I hit a creature with my Eldritch Blast cantrip, it is pushed 10 ft away from me.",
							51
						]
					}
				},
				"sculptor of flesh (prereq: level 7 warlock)" : {
					name : "Sculptor of Flesh",
					description : desc("Once per long rest, I can cast Polymorph using a warlock spell slot"),
					source : [["SRD", 50], ["P", 111]],
					submenu : "[warlock level  7+]",
					usages : 1,
					recovery : "long rest",
					spellcastingBonus : [{
						name : "Sculptor of Flesh",
						spells : ["polymorph"],
						selection : ["polymorph"],
						firstCol : "oncelr"
					}],
					prereqeval : function(v) { return classes.known.warlock.level >= 7; }
				},
				"sign of ill omen (prereq: level 5 warlock)" : {
					name : "Sign of Ill Omen",
					description : desc("Once per long rest, I can cast Bestow Curse using a warlock spell slot"),
					source : [["SRD", 50], ["P", 111]],
					submenu : "[warlock level  5+]",
					usages : 1,
					recovery : "long rest",
					spellcastingBonus : [{
						name : "Sign of Ill Omen",
						spells : ["bestow curse"],
						selection : ["bestow curse"],
						firstCol : "oncelr"
					}],
					prereqeval : function(v) { return classes.known.warlock.level >= 5; }
				},
				"thief of five fates" : {
					name : "Thief of Five Fates",
					description : desc("Once per long rest, I can cast Bane using a warlock spell slot"),
					source : [["SRD", 50], ["P", 111]],
					usages : 1,
					recovery : "long rest",
					spellcastingBonus : [{
						name : "Thief of Five Fates",
						spells : ["bane"],
						selection : ["bane"],
						firstCol : "oncelr"
					}]
				},
				"thirsting blade (prereq: level 5 warlock, pact of the blade)" : {
					name : "Thirsting Blade",
					description : desc("When taking the attack action, I can attack twice with my pact weapon"),
					source : [["SRD", 50], ["P", 111]],
					submenu : "[improves Pact of the Blade]",
					action : ['action', 'Pact Weapon (2 attacks per action)'],
					prereqeval : function(v) { return classes.known.warlock.level >= 5 && GetFeatureChoice('class', 'warlock', 'pact boon') == 'pact of the blade'; }
				},
				"visions of distant realms (prereq: level 15 warlock)" : {
					name : "Visions of Distant Realms",
					description : desc("I can cast Arcane Eye at will, without using a spell slot"),
					source : [["SRD", 50], ["P", 111]],
					submenu : "[warlock level 15+]",
					spellcastingBonus : [{
						name : "Visions of Distant Realms",
						spells : ["arcane eye"],
						selection : ["arcane eye"],
						firstCol : "atwill"
					}],
					prereqeval : function(v) { return classes.known.warlock.level >= 15; }
				},
				"voice of the chain master (prereq: pact of the chain)" : {
					name : "Voice of the Chain Master",
					description : desc([
						"While on the same plane as my familiar, I can communicate telepathically with it",
						"Also, I can perceive through its senses and have it speak with my voice while doing so"
					]),
					source : [["SRD", 50], ["P", 111]],
					submenu : "[improves Pact of the Chain]",
					prereqeval : function(v) { return classes.known.warlock.level >= 3 && GetFeatureChoice('class', 'warlock', 'pact boon') == 'pact of the chain'; }
				},
				"whispers of the grave (prereq: level 9 warlock)" : {
					name : "Whispers of the Grave",
					description : desc("I can cast Speak with Dead at will, without using a spell slot"),
					source : [["SRD", 50], ["P", 111]],
					submenu : "[warlock level  9+]",
					spellcastingBonus : [{
						name : "Whispers of the Grave",
						spells : ["speak with dead"],
						selection : ["speak with dead"],
						firstCol : "atwill"
					}],
					prereqeval : function(v) { return classes.known.warlock.level >= 9; }
				},
				"witch sight (prereq: level 15 warlock)" : {
					name : "Witch Sight",
					description : desc("I can see the true form of creatures (shapechangers/illusions/transmutations) within 30 ft"),
					source : [["SRD", 50], ["P", 111]],
					submenu : "[warlock level 15+]",
					vision : [["Witch sight", 30]],
					prereqeval : function(v) { return classes.known.warlock.level >= 15; }
				}
			},
			"pact boon" : {
				name : "Pact Boon",
				source : [["SRD", 47], ["P", 107]],
				minlevel : 3,
				description : desc('Choose a Pact Boon (Blade, Chain, or Tome) using the "Choose Feature" button above'),
				choices : ["Pact of the Blade", "Pact of the Chain", "Pact of the Tome"],
				"pact of the blade" : {
					name : "Pact of the Blade",
					description : desc([
						"As an action, I can create a pact weapon in my empty hand; I'm proficient in its use",
						"I can choose the type of melee weapon every time I create it, and it has those statistics",
						"The weapon disappears if it is more than 5 ft away from me for 1 minute",
						"The weapon counts as magical; I can transform a magic weapon into my pact weapon",
						"This occurs over an hour-long ritual that I can perform during a short rest",
						"I can use an action to re-summon it in any form and can dismiss it as no action"
					]),
					action : [["action", ""]],
					calcChanges : {
						atkCalc : [
							function (fields, v, output) {
								if (v.theWea.pactWeapon || ((v.isMeleeWeapon || v.theWea.isMagicWeapon || v.thisWeapon[1]) && (/\bpact\b/i).test(v.WeaponTextName))) {
									v.pactWeapon = true;
								}
							}, "",
							90
						],
						atkAdd : [
							function (fields, v) {
								if (v.pactWeapon || v.theWea.pactWeapon || ((v.isMeleeWeapon || v.theWea.isMagicWeapon || v.thisWeapon[1]) && (/\bpact\b/i).test(v.WeaponTextName))) {
									v.pactWeapon = true;
									fields.Proficiency = true;
									if (!v.theWea.isMagicWeapon && !v.thisWeapon[1] && !(/counts as( a)? magical/i).test(fields.Description)) fields.Description += (fields.Description ? '; ' : '') + 'Counts as magical';
								};
							},
							"If I include the word 'Pact' in a melee or magic weapon's name, it gets treated as my Pact Weapon.",
							290
						]
					}
				},
				"pact of the chain" : {
					name : "Pact of the Chain",
					description : desc([
						"I can cast Find Familiar as a ritual and it can be a Pseudodragon, Imp, Quasit, or Sprite",
						"When taking the attack action, I can forgo 1 attack to have my familiar attack instead",
						"It makes this 1 attack by using its reaction"
					]),
					spellcastingBonus : [{
						name : "Pact of the Chain",
						spells : ["find familiar"],
						selection : ["find familiar"],
						firstCol : '\xAE'
					}]
				},
				"pact of the tome" : {
					name : "Pact of the Tome",
					source : [["SRD", 48], ["P", 108]],
					description : desc([
						"I have a Book of Shadows with any three cantrips of my choosing",
						"I can cast these cantrips as long as I have the book on my person",
						"Regardless of the lists they come from, these count as warlock cantrips to me",
						"I can get a replacement book with a 1-hour ceremony during a short or long rest"
					]),
					spellcastingBonus : [{
						name : "Pact of the Tome",
						"class" : "any",
						level : [0, 0],
						times : 3
					}]
				}
			},
			"mystic arcanum" : {
				name : "Mystic Arcanum",
				source : [["SRD", 48], ["P", 108]],
				minlevel : 11,
				description : desc([
					"I can choose one spell from the warlock spell list of each level mentioned above",
					"I can cast these spells each once per long rest without needing to use a spell slot"
				]),
				additional : ["", "", "", "", "", "", "", "", "", "", "6th level", "6th level", "6th and 7th level", "6th and 7th level", "6th, 7th, and 8th level", "6th, 7th, and 8th level", "6th, 7th, 8th, and 9th level", "6th, 7th, 8th, and 9th level", "6th, 7th, 8th, and 9th level", "6th, 7th, 8th, and 9th level"],
				spellcastingBonus : [{
					name : "Mystic Arcanum (6th-level)",
					"class" : "warlock",
					level : [6, 6],
					firstCol : "oncelr"
				}, {
					name : "Mystic Arcanum (7th-level)",
					"class" : "warlock",
					level : [7, 7],
					firstCol : "oncelr",
					times : levels.map(function (n) { return n < 13 ? 0 : 1; })
				}, {
					name : "Mystic Arcanum (8th-level)",
					"class" : "warlock",
					level : [8, 8],
					firstCol : "oncelr",
					times : levels.map(function (n) { return n < 15 ? 0 : 1; })
				}, {
					name : "Mystic Arcanum (9th-level)",
					"class" : "warlock",
					level : [9, 9],
					firstCol : "oncelr",
					times : levels.map(function (n) { return n < 17 ? 0 : 1; })
				}]
			},
			"eldritch master" : {
				name : "Eldritch Master",
				source : [["SRD", 48], ["P", 108]],
				minlevel : 20,
				description : desc("I can regain all used pact magic spells slots by spending 1 minute entreating my patron"),
				recovery : "long rest",
				usages : 1
			}
		}
	},
*/
	"wizard": {
		regExpSearch: /^(?=.*(wizard|mage|magus))(?!.*wild mage).*$/i,
		name: "Wizard",
		source: [["SRD24", 77], ["P24", 165]],
		primaryAbility: "Intelligence",
		abilitySave: 4,
		prereqs: "Intelligence 13",
		improvements: [0, 0, 0, 1, 1, 1, 1, 2, 2, 2, 2, 3, 3, 3, 3, 4, 4, 4, 5, 5],
		die: 6,
		saves: ["Int", "Wis"],
		skillstxt: {
			primary: "Choose 2: Arcana, History, Insight, Investigation, Medicine, or Religion.",
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
				recovery: "long rest",
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
					recovery: "short rest",
					usages: 1,
				}, {
					name: "Signature Spell (2nd pick)",
					recovery: "short rest",
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
				recovery: "long rest",
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
	"cleric-life" : {
		regExpSearch : /^(?=.*(cleric|priest|clergy|acolyte))(?=.*\b(life|living|healing)\b).*$/i,
		subname : "Life Domain",
		source : [["SRD", 17], ["P", 60]],
		spellcastingExtra : ["bless", "cure wounds", "lesser restoration", "spiritual weapon", "beacon of hope", "revivify", "death ward", "guardian of faith", "mass cure wounds", "raise dead"],
		features: {
			"subclassfeature1" : {
				name : "Bonus Proficiency",
				source : [["SRD", 17], ["P", 60]],
				minlevel : 1,
				description : desc("I gain proficiency with heavy armor"),
				armorProfs : [false, false, true, false]
			},
			"subclassfeature1.1" : {
				name : "Disciple of Life",
				source : [["SRD", 17], ["P", 60]],
				minlevel : 1,
				description : desc([
					"Whenever a 1st-level or higher spell I cast restores HP to a creature, it heals more",
					"The creature regains an additional 2 + spell level (SL) worth of hit points",
					'Note that "X/SL" on the spell page means per spell slot level above the spell\'s normal level'
				]),
				calcChanges : {
					spellAdd : [
						// Includes Revivify and Raise Dead as they restore HP from 0 to 1, but omits Aid and Heroes' Feast as they increase max HP, not restore
						function (spellKey, spellObj, spName) {
							if (spellObj.psionic || !spellObj.level) return;
							switch (spellKey) {
								case "arcane vigor" :
									spellObj.description = spellObj.descriptionShorter.replace(/in HP/i, "+ " + (spellObj.level + 2) + "+1/SL HP");
									return true;
								case "enervation" :
								case "life transference" :
								case "vampiric touch" :
									var useSpellDescr = getSpellShortDescription(spellKey, spellObj);
									var strAdd = " +" + (spellObj.level + 2) + "+1/SL";
									spellObj.description = useSpellDescr.replace(/(heals? (half|twice)( the damage dealt| that)?)( in HP)?/, "$1" + strAdd);
									return true;
								case "mass heal" :
									spellObj.description = spellObj.descriptionShorter.replace(/crea(tures)? in range.*cure[sd]/i, "crea in range, each then +11 HP, cured");
									return true;
								default :
									if (!genericSpellDmgEdit(spellKey, spellObj, "heal", (2 + spellObj.level))) return;
									if (spellObj.level < 9) genericSpellDmgEdit(spellKey, spellObj, "heal", "1/SL");
									spellObj.discipleOfLife = true; // for Blessed Healer and Supreme Healing
									return true;
							}
						},
						"When I use a spell that restores hit points, it restores an additional 2 + the level of the spell slot (or spell slot equivalent) used to cast the spell."
					]
				}
			},
			"subclassfeature2" : {
				name : "Channel Divinity: Preserve Life",
				source : [["SRD", 17], ["P", 60]],
				minlevel : 2,
				description : desc([
					"As an action, I can heal any creature within 30 ft of me up to half their maximum HP",
					"I divide the number of hit points among the creatures as I see fit"
				]),
				additional : ["", "10 hit points", "15 hit points", "20 hit points", "25 hit points", "30 hit points", "35 hit points", "40 hit points", "45 hit points", "50 hit points", "55 hit points", "60 hit points", "65 hit points", "70 hit points", "75 hit points", "80 hit points", "85 hit points", "90 hit points", "95 hit points", "100 hit points"],
				action : [["action", ""]]
			},
			"subclassfeature6" : {
				name : "Blessed Healer",
				source : [["SRD", 17], ["P", 60]],
				minlevel : 6,
				description : desc("When I restore HP to another with a spell, I regain 2 + the spell (slot) level in HP"),
				calcChanges : {
					spellAdd : [
						// note that several healing spells are skipped because they don't restore hp at casting (only later)
						function (spellKey, spellObj, spName) {
							var otherHealSpells = ["mass heal", "life transference", "power word heal", "resurrection", "true resurrection"];
							var noHealAtCast = ["aura of life", "goodberry", "healing elixir-uass", "healing spirit"];
							if (noHealAtCast.indexOf(spellKey) !== -1) return;
							if (spellObj.discipleOfLife || otherHealSpells.indexOf(spellKey) !== -1) {
								var useSpellDescr = getSpellShortDescription(spellKey, spellObj).replace(/spell(casting)? (ability )?mod(ifier)?/i, "spell mod");
								var strPart = "";
								switch (spellKey) {
									case "aura of vitality":
										useSpellDescr = useSpellDescr.replace("at the start of each of my turns", "at my turn's start");
										strPart = "; if other at cast, I heal ";
										break;
									case "heal" :
									case "life transference" :
									case "mass heal" :
										useSpellDescr = useSpellDescr.replace(" in range", "").replace(" I can see", "").replace("blindness, deafness", "blind, deaf");
										break;
									case "regenerate" :
										useSpellDescr = useSpellDescr.replace(" for the duration; restores lost body", "; regrow");
										break;
									case "resurrection" :
									case "true resurrection" :
										useSpellDescr = useSpellDescr.replace(" with", ", ").replace("century", "100y").replace("1000gp", "1k gp");
									case "raise dead" :
									case "revivify" :
										useSpellDescr = useSpellDescr.replace(/(Resurrects?|Restores?) (a )?crea(ture)?('s)? (body )?that (has )?died in( the)?/i, "Restore crea that died in");
										break;
								};
								var alwaysOthers = ["life transference", "raise dead", "revivify", "resurrection", "true resurrection"];
								if (!strPart) strPart = alwaysOthers.indexOf(spellKey) === -1 ? "; if other, I heal " : "; I heal ";
								var strAdd = spellObj.level < 9 ? strPart + (spellObj.level + 2) + (spellObj.noSpellUpcasting ? "" : "+1/SL") + " HP" : strPart + "11 HP";
								spellObj.description = useSpellDescr + strAdd;
								return true;
							}
						},
						"When I cast a spell that restores hit points to another creature than myself at the moment of casting, I also heal 2 + the level of the spell slot (or spell slot equivalent) hit points."
					]
				}
			},
			"subclassfeature8" : {
				name : "Divine Strike",
				source : [["SRD", 17], ["P", 60]],
				minlevel : 8,
				description : desc("Once per turn, when I hit a creature with a weapon attack, I can do extra damage"),
				additional : levels.map(function (n) {
					if (n < 8) return "";
					return "+" + (n < 14 ? 1 : 2) + "d8 radiant damage";
				}),
				calcChanges : {
					atkAdd : [
						function (fields, v) {
							if (classes.known.cleric && v.isWeapon) {
								fields.Description += (fields.Description ? '; ' : '') + 'Once per turn +' + (classes.known.cleric.level < 14 ? 1 : 2) + 'd8 radiant damage';
							}
						},
						"Once per turn, I can have one of my weapon attacks that hit do extra radiant damage."
					]
				}
			},
			"subclassfeature17" : {
				name : "Supreme Healing",
				source : [["SRD", 17], ["P", 60]],
				minlevel : 17,
				description : desc("When I restore HP with a spell, I heal the maximum amount instead of rolling the dice"),
				calcChanges : {
					spellAdd : [
						function (spellKey, spellObj, spName) {
							if (!spellObj.discipleOfLife) return;
							return genericSpellDmgEdit(spellKey, spellObj, "heal", false, false, true, true);
						},
						"When I use a spell that restores hit points by rolling one or more dice to restore hit points with a spell, I instead use the highest number possible for each die."
					]
				}
			}
		}
	},
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
				recovery : "long rest"
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
				recovery : "long rest",
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
				recovery : "long rest",
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
	"warlock-fiend" : {
		regExpSearch : /^(?=.*(fiend|devil|demon|daemon|hell|abyss))(?=.*warlock).*$/i,
		subname : "the Fiend",
		source : [["SRD", 50], ["P", 109]],
		spellcastingExtra : ["burning hands", "command", "blindness/deafness", "scorching ray", "fireball", "stinking cloud", "fire shield", "wall of fire", "flame strike", "hallow"],
		features: {
			"subclassfeature1" : {
				name : "Dark One's Blessing",
				source : [["SRD", 50], ["P", 109]],
				minlevel : 1,
				description : desc("When I reduce a hostile to 0 HP, I gain Cha mod + warlock level temporary HP (min 1)")
			},
			"subclassfeature6" : {
				name : "Dark One's Own Luck",
				source : [["SRD", 50], ["P", 109]],
				minlevel : 6,
				description : desc("When I make an ability check or saving throw, I can add 1d10 after rolling the d20"),
				recovery : "short rest",
				usages : 1
			},
			"subclassfeature10" : {
				name : "Fiendish Resilience",
				source : [["SRD", 51], ["P", 109]],
				minlevel : 10,
				description : desc([
					"After a short or long rest, I can choose one damage type to become resistant to",
					"This lasts until I choose another type; Magical and silver weapons ignore this resistance"
				])
			},
			"subclassfeature14" : {
				name : "Hurl Through Hell",
				source : [["SRD", 51], ["P", 109]],
				minlevel : 14,
				description : desc([
					"When I hit a creature with an attack, I can instantly transport it through lower planes",
					"It returns at the end of my next turn and takes 10d10 psychic damage if not a fiend"
				]),
				recovery : "long rest",
				usages : 1
			}
		}
	},
*/
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
					recovery: "long rest",
					usages: 1,
					usagescalc: "var FieldNmbr = parseFloat(event.target.name.slice(-2)); var usages = Number(What('Limited Feature Used ' + FieldNmbr)); event.value = !usages ? '' : (usages+1) + 'd12';",
				}],
			},
		},
	},
};
