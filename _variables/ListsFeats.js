var AddFeatsMenu;

var Base_FeatsList = {
	// Origin feats
	"alert": {
		name: "Alert",
		type: "origin",
		source: [["SRD24", 87], ["P24", 200]],
		addMod: [{
			type: "skill", field: "Init", mod: "prof",
			text: "I can add my Proficiency Bonus to Initiative rolls."
		}],
		description: "I can add my Proficiency Bonus to my Initiative rolls. Immediately after you I roll Initiative, I can swap Initiative with one willing ally as long as neither of us has the Incapacitated condition.",
		descriptionFull: [
			"You gain the following benefits.",
		 	">>Initiative Proficiency<<. When you roll Initiative, you can add your Proficiency Bonus to the roll.",
		 	">>Initiative Swap<<. Immediately after you roll Initiative, you can swap your Initiative with the Initiative of one willing ally in the same combat. You can't make this swap if you or the ally has the Incapacitated condition."
		],
	},
	"magic initiate": {
		name: "Magic Initiate",
		type: "origin",
		source: [["SRD24", 87], ["P24", 201]],
		description: "Pick Cleric, Druid, or Wizard",
		descriptionFull: [
			"You gain the following benefits.",
			">>Two Cantrips<<. You learn two cantrips of your choice from the Cleric, Druid, or Wizard spell list. Intelligence, Wisdom, or Charisma is your spellcasting ability for this feat's spells (choose when you select this feat).",
			">>Level 1 Spell<<. Choose a level 1 spell from the same list you selected for this feat's cantrips. You always have that spell prepared. You can cast it once without a spell slot, and you regain the ability to cast it in that way when you finish a Long Rest. You can also cast the spell using any spell slots you have.",
			">>Spell Change<<. Whenever you gain a new level, you can replace one of the spells you chose for this feat with a different spell of the same level from the chosen spell list.",
			">>Repeatable<<. You can take this feat more than once, but you must choose a different spell list each time."
		],
		allowDuplicates: true,
		choices: ['Cleric', 'Druid', 'Wizard'],
		'cleric': {
			description: "I learn two cantrips and one 1st-level spell of my choice from the Cleric spell list. I can swap one of these whenever I gain a level. I can cast the 1st-level spell with a spell slot, and once per long rest without expending a spell slot. " + (typePF ? "I choose my spellcasting ability for these when picking this feat: Int, Wis, or Cha." : "My spellcasting ability is Int, Wis, or Cha."),
			extraLimitedFeatures: [{
				name: "Magic Initiate (1st-level Cleric spell)",
				usages: 1,
				recovery: "long rest",
			}],
			spellcastingAbility: [4, 5, 6],
			spellFirstColTitle: "LR", // check off when the spell has been used that long rest
			spellcastingBonus: [{
				name: "Cantrip",
				"class": "cleric",
				level: [0, 0],
				times: 2,
				firstCol: "atwill",
			}, {
				name: "1st-Level",
				"class": "cleric",
				level: [1, 1],
				firstCol: "checkbox",
			}],
		},
		'druid': {
			description: "I learn two cantrips and one 1st-level spell of my choice from the Druid spell list. I can swap one of these whenever I gain a level. I can cast the 1st-level spell with a spell slot, and once per long rest without expending a spell slot. " + (typePF ? "I choose my spellcasting ability for these when picking this feat: Int, Wis, or Cha." : "My spellcasting ability is Int, Wis, or Cha."),
			extraLimitedFeatures: [{
				name: "Magic Initiate (1st-level Druid spell)",
				usages: 1,
				recovery: "long rest",
			}],
			spellcastingAbility: [4, 5, 6],
			spellFirstColTitle: "LR",
			spellcastingBonus: [{
				name: "Cantrip",
				"class": "druid",
				level: [0, 0],
				times: 2,
				firstCol: "atwill",
			}, {
				name: "1st-Level",
				"class": "druid",
				level: [1, 1],
				firstCol: "checkbox",
			}],
		},
		'wizard': {
			description: "I learn two cantrips and one 1st-level spell of my choice from the Wizard spell list. I can swap one of these whenever I gain a level. I can cast the 1st-level spell with a spell slot, and once per long rest without expending a spell slot. " + (typePF ? "I choose my spellcasting ability for these when picking this feat: Int, Wis, or Cha." : "My spellcasting ability is Int, Wis, or Cha."),
			extraLimitedFeatures: [{
				name: "Magic Initiate (1st-level Wizard spell)",
				usages: 1,
				recovery: "long rest",
			}],
			spellcastingAbility: [4, 5, 6],
			spellFirstColTitle: "LR",
			spellcastingBonus: [{
				name: "Cantrip",
				"class": "wizard",
				level: [0, 0],
				times: 2,
				firstCol: "atwill",
			}, {
				name: "1st-Level",
				"class": "wizard",
				level: [1, 1],
				firstCol: "checkbox",
			}],
		},
	},
	"savage attacker": {
		name: "Savage Attacker",
		type: "origin",
		source: [["SRD24", 87], ["P24", 201]],
		description: "I've trained to deal particularly damaging strikes. Once per turn when I hit a target with a weapon, I can roll the weapon's damage dice twice and use either roll against the target.",
		descriptionFull: "You've trained to deal particularly damaging strikes. Once per turn when you hit a target with a weapon, you can roll the weapon's damage dice twice and use either roll against the target.",
	},
	"skilled": {
		name: "Skilled",
		type: "origin",
		source: [["SRD24", 87], ["P24", 201]],
		skillstxt: "Choose three skills or tools",
		description: "I gain proficiency in any combination of three skills or tools of my choice.",
		descriptionFull: [
			"You gain proficiency in any combination of three skills or tools of your choice.",
			">>Repeatable<<. You can take this feat more than once."
		],
		allowDuplicates : true,
	},
	// General feats
	"grappler": {
		name: "Grappler",
		source: [["SRD24", 87], ["P24", 204]],
		type: "general",
		prerequisite: "Level 4+, Strength or Dexterity 13+",
		prereqeval: function (v) {
			return v.characterLevel >= 4 && (What("Str") >= 13 || What("Dex") >= 13);
		},
		description: "Once per turn when I make an Unarmed Strike as part of the Attack action, I can do both the Damage and Grapple option. I have advantage on attacks against targets I'm Grappling. I can move my normal speed with a Grappled target if they are my size or smaller. [+1 Strength or Dexterity]",
		descriptionFull: [
			"You gain the following benefits.",
			">>Ability Score Increase<<. Increase your Strength or Dexterity score by 1, to a maximum of 20.",
			">>Punch and Grab<<. When you hit a creature with an Unarmed Strike as part of the Attack action on your turn, you can use both the Damage and the Grapple option. You can use this benefit only once per turn.",
			">>Attack Advantage<<. You have Advantage on attack rolls against a creature Grappled by you.",
			">>Fast Wrestler<<. You don't have to spend extra movement to move a creature Grappled by you if the creature is your size or smaller.",
		],
		calcChanges: {
			atkAdd: [
				function(fields, v) {
					if (v.baseWeaponName == "unarmed strike" ) {
						fields.Description += (fields.Description ? '; ' : '') + '1/turn also Grapple; Adv. vs. Grappled';
					}
				},
				'I have Advantage on attack rolls against a creature Grappled by me. Once per turn I can use both the Damage and Grapple option when I make an Unarmed Strike as part of the Attack action on my turn.'
			]
		},
		choices: ["Strength", "Dexterity"],
		strength: {
			description: "Once per turn when I make an Unarmed Strike as part of the Attack action" + (typePF ? " on my turn" : "") + ", I can do both the Damage and Grapple option. I have adv" + (typePF ? "antage" : ".") + " on attacks against targets I'm Grappling. I can move my normal speed with a Grappled target as long as they are my size or smaller. [+1 Str" + (typePF ? "ength" : "") + "]",
			scores: [1, 0, 0, 0, 0, 0],
		},
		dexterity: {
			description: "Once per turn when I make an Unarmed Strike as part of the Attack action" + (typePF ? " on my turn" : "") + ", I can do both the Damage and Grapple option. I have adv" + (typePF ? "antage" : ".") + " on attacks against targets I'm Grappling. I can move my normal speed with a Grappled target as long as they are my size or smaller. [+1 Dex" + (typePF ? "terity" : "") + "]",
			scores: [0, 1, 0, 0, 0, 0],
		},
	},
	// Fighting Style feats
	"archery": {
		name: "Archery",
		source: [["SRD24", 87], ["P24", 209]],
		type: "fighting style",
		description: "I gain a +2 bonus to attack rolls I make with Ranged weapons.",
		descriptionFull: [
			"You gain a +2 bonus to attack rolls you make with Ranged weapons.",
		],
		calcChanges: {
			atkCalc: [
				function (fields, v, output) {
					if (v.isRangedWeapon && !v.isNaturalWeapon && !v.isDC) output.extraHit += 2;
				},
				"My ranged weapons get a +2 bonus on the To Hit.",
			],
		},
	},
	"defense": {
		name: "Defense",
		source: [["SRD24", 88], ["P24", 209]],
		type: "fighting style",
		description: "While I'm wearing Light, Medium, or Heavy armor, I gain a +1 bonus to Armor Class.",
		descriptionFull: [
			"While you're wearing Light, Medium, or Heavy armor, you gain a +1 bonus to Armor Class.",
		],
		extraAC: {
			name: "Defense Fighting Style",
			mod: 1,
			text: "I gain a +1 bonus to AC while wearing Light, Medium, or Heavy armor.",
			stopeval: function (v) { return !v.wearingArmor; },
		},
	},
	"great weapon fighting": {
		name: "Great Weapon Fighting",
		source: [["SRD24", 88], ["P24", 209]],
		type: "fighting style",
		description: "When I roll damage for an attack I make with a Melee weapon that I'm holding with two hands, I can treat any 1 or 2 on a damage die as a 3. The weapon must have the Two-Handed or Versatile property to gain this benefit.",
		descriptionClassFeature: "\nI treat 1 or 2 on damage as 3 for Two-Handed/Versatile Melee weapons held with 2 hands.",
		descriptionFull: [
			"When you roll damage for an attack you make with a Melee weapon that you are holding with two hands, you can treat any 1 or 2 on a damage die as a 3. The weapon must have the Two-Handed or Versatile property to gain this benefit.",
		],
		calcChanges: {
			atkAdd: [
				function (fields, v) {
					if (v.isMeleeWeapon && /\bversatile\b|((^|[^+-]\b)2|\btwo).?hand(ed)?s?\b/i.test(fields.Description)) {
						fields.Description += (fields.Description ? '; ' : '') + '1 or 2 on damage die are 3' + (/versatile/i.test(fields.Description) ? ' when two-handed' : '');
					}
				},
				"While wielding a two-handed or versatile melee weapon in two hands, I can treat any roll of 1 or 2 on damage dice as a 3."
			],
		},
	},
	"two-weapon fighting": {
		name: "Two-Weapon Fighting",
		source: [["SRD24", 88], ["P24", 210]],
		type: "fighting style",
		description: "When I make the off-hand extra attack as a result of using a weapon that has the Light property, I can add my ability modifier to the damage of that attack if I'm not already adding it to the damage.",
		descriptionClassFeature: "\nI add my ability modifier to the damage of the off-hand attack after using a Light weapon.",
		descriptionFull: [
			"When you make an extra attack as a result of using a weapon that has the Light property, you can add your ability modifier to the damage of that attack if you aren't already adding it to the damage.",
		],
		calcChanges: {
			atkCalc: [
				function (fields, v, output) {
					if (v.isOffHand) output.modToDmg = true;
				},
				'When I make an off-hand attack as a result of using a weapon that has the Light property, I can add my ability modifier to the damage of that attack. If a melee weapon includes "off-hand" or "secondary" in its name or description, it is considered an off-hand attack.'
			],
		},
	},
	// Epic Boons feats
	"boon of combat prowess": {
		name: "Boon of Combat Prowess",
		source: [["SRD24", 88], ["P24", 210]],
		type: "epic boon",
		prerequisite: "Level 19+",
		prereqeval: function (v) { return v.characterLevel >= 19; },
		description: "When I miss with an attack roll, I can hit instead. Once I use this benefit, I can't use it again until the start of my next turn. [+1 to one ability score of my choice]",
		descriptionFull: [
			"You gain the following benefits.",
			">>Ability Score Increase<<. Increase one ability score of your choice by 1, to a maximum of 30.",
			">>Peerless Aim<<. When you miss with an attack roll, you can hit instead. Once you use this benefit, you can't use it again until the start of your next turn.",
		],
		choices: ["Strength", "Dexterity", "Constitution", "Intelligence", "Wisdom", "Charisma"],
		strength: {
			name: "Boon of Combat Prowess [Str]",
			description: "When I miss with an attack roll, I can hit instead. Once I use this benefit, I can't use it again until the start of my next turn. [+1 Strength]",
			scores: [1, 0, 0, 0, 0, 0],
			scoresMaximum: [30, 0, 0, 0, 0, 0],
		},
		dexterity: {
			name: "Boon of Combat Prowess [Dex]",
			description: "When I miss with an attack roll, I can hit instead. Once I use this benefit, I can't use it again until the start of my next turn. [+1 Dexterity]",
			scores: [0, 1, 0, 0, 0, 0],
			scoresMaximum: [0, 30, 0, 0, 0, 0],
		},
		constitution: {
			name: "Boon of Combat Prowess [Con]",
			description: "When I miss with an attack roll, I can hit instead. Once I use this benefit, I can't use it again until the start of my next turn. [+1 constitution]",
			scores: [0, 0, 1, 0, 0, 0],
			scoresMaximum: [0, 0, 30, 0, 0, 0],
		},
		intelligence: {
			name: "Boon of Combat Prowess [Int]",
			description: "When I miss with an attack roll, I can hit instead. Once I use this benefit, I can't use it again until the start of my next turn. [+1 Intelligence]",
			scores: [0, 0, 0, 1, 0, 0],
			scoresMaximum: [0, 0, 0, 30, 0, 0],
		},
		wisdom: {
			name: "Boon of Combat Prowess [Wis]",
			description: "When I miss with an attack roll, I can hit instead. Once I use this benefit, I can't use it again until the start of my next turn. [+1 Wisdom]",
			scores: [0, 0, 0, 0, 1, 0],
			scoresMaximum: [0, 0, 0, 0, 30, 0],
		},
		charisma: {
			name: "Boon of Combat Prowess [Cha]",
			description: "When I miss with an attack roll, I can hit instead. Once I use this benefit, I can't use it again until the start of my next turn. [+1 Charisma]",
			scores: [0, 0, 0, 0, 0, 1],
			scoresMaximum: [0, 0, 0, 0, 0, 30],
		},
	},
	"boon of dimensional travel": {
		name: "Boon of Dimensional Travel",
		source: [["SRD24", 88], ["P24", 210]],
		type: "epic boon",
		prerequisite: "Level 19+",
		prereqeval: function (v) { return v.characterLevel >= 19; },
		description: "Immediately after I take the Attack action or the Magic action, I can teleport up to 30 ft to an unoccupied space I can see. [+1 to one ability score of my choice]",
		descriptionFull: [
			"You gain the following benefits.",
			">>Ability Score Increase<<. Increase one ability score of your choice by 1, to a maximum of 30.",
			">>Blink Steps<<. Immediately after you take the Attack action or the Magic action, you can teleport up to 30 feet to an unoccupied space you can see.",
		],
		choices: ["Strength", "Dexterity", "Constitution", "Intelligence", "Wisdom", "Charisma"],
		strength: {
			name: "Boon of Dimensional Travel [Str]",
			description: "Immediately after I take the Attack action or the Magic action, I can teleport up to 30 ft to an unoccupied space I can see. [+1 Strength]",
			scores: [1, 0, 0, 0, 0, 0],
			scoresMaximum: [30, 0, 0, 0, 0, 0],
		},
		dexterity: {
			name: "Boon of Dimensional Travel [Dex]",
			description: "Immediately after I take the Attack action or the Magic action, I can teleport up to 30 ft to an unoccupied space I can see. [+1 Dexterity]",
			scores: [0, 1, 0, 0, 0, 0],
			scoresMaximum: [0, 30, 0, 0, 0, 0],
		},
		constitution: {
			name: "Boon of Dimensional Travel [Con]",
			description: "Immediately after I take the Attack action or the Magic action, I can teleport up to 30 ft to an unoccupied space I can see. [+1 Constitution]",
			scores: [0, 0, 1, 0, 0, 0],
			scoresMaximum: [0, 0, 30, 0, 0, 0],
		},
		intelligence: {
			name: "Boon of Dimensional Travel [Int]",
			description: "Immediately after I take the Attack action or the Magic action, I can teleport up to 30 ft to an unoccupied space I can see. [+1 Intelligence]",
			scores: [0, 0, 0, 1, 0, 0],
			scoresMaximum: [0, 0, 0, 30, 0, 0],
		},
		wisdom: {
			name: "Boon of Dimensional Travel [Wis]",
			description: "Immediately after I take the Attack action or the Magic action, I can teleport up to 30 ft to an unoccupied space I can see. [+1 Wisdom]",
			scores: [0, 0, 0, 0, 1, 0],
			scoresMaximum: [0, 0, 0, 0, 30, 0],
		},
		charisma: {
			name: "Boon of Dimensional Travel [Cha]",
			description: "Immediately after I take the Attack action or the Magic action, I can teleport up to 30 ft to an unoccupied space I can see. [+1 Charisma]",
			scores: [0, 0, 0, 0, 0, 1],
			scoresMaximum: [0, 0, 0, 0, 0, 30],
		},
	},
	"boon of fate": {
		name: "Boon of Fate",
		source: [["SRD24", 88], ["P24", 210]],
		type: "epic boon",
		prerequisite: "Level 19+",
		prereqeval: function (v) { return v.characterLevel >= 19; },
		description: "When I or another creature within 60 ft of me succeeds or fails a D20 Test, I can roll 2d4 and apply the total rolled as a bonus or penalty to the d20 roll. Once I do this, I can't do so again until I roll Initiative or finish a Short or Long Rest. [+1 to one ability score of my choice]",
		descriptionFull: [
			"You gain the following benefits.",
			">>Ability Score Increase<<. Increase one ability score of your choice by 1, to a maximum of 30.",
			">>Improve Fate<<. When you or another creature within 60 feet of you succeeds on or fails a D20 Test, you can roll 2d4 and apply the total rolled as a bonus or penalty to the d20 roll. Once you use this benefit, you can't use it again until you roll Initiative or finish a Short or Long Rest.",
		],
		usages: 1,
		recovery: "Combat",
		choices: ["Strength", "Dexterity", "Constitution", "Intelligence", "Wisdom", "Charisma"],
		strength: {
			description: "When I or another creature within 60 ft of me succeeds or fails a D20 Test, I can roll 2d4 and apply the total rolled as a bonus or penalty to the d20 roll. Once I do this, I can't do so again until I roll Initiative or finish a Short or Long Rest. [+1 Strength]",
			scores: [1, 0, 0, 0, 0, 0],
			scoresMaximum: [30, 0, 0, 0, 0, 0],
		},
		dexterity: {
			description: "When I or another creature within 60 ft of me succeeds or fails a D20 Test, I can roll 2d4 and apply the total rolled as a bonus or penalty to the d20 roll. Once I do this, I can't do so again until I roll Initiative or finish a Short or Long Rest. [+1 Dexterity]",
			scores: [0, 1, 0, 0, 0, 0],
			scoresMaximum: [0, 30, 0, 0, 0, 0],
		},
		constitution: {
			description: "When I or another creature within 60 ft of me succeeds or fails a D20 Test, I can roll 2d4 and apply the total rolled as a bonus or penalty to the d20 roll. Once I do this, I can't do so again until I roll Initiative or finish a Short or Long Rest. [+1 Constitution]",
			scores: [0, 0, 1, 0, 0, 0],
			scoresMaximum: [0, 0, 30, 0, 0, 0],
		},
		intelligence: {
			description: "When I or another creature within 60 ft of me succeeds or fails a D20 Test, I can roll 2d4 and apply the total rolled as a bonus or penalty to the d20 roll. Once I do this, I can't do so again until I roll Initiative or finish a Short or Long Rest. [+1 Intelligence]",
			scores: [0, 0, 0, 1, 0, 0],
			scoresMaximum: [0, 0, 0, 30, 0, 0],
		},
		wisdom: {
			description: "When I or another creature within 60 ft of me succeeds or fails a D20 Test, I can roll 2d4 and apply the total rolled as a bonus or penalty to the d20 roll. Once I do this, I can't do so again until I roll Initiative or finish a Short or Long Rest. [+1 Wisdom]",
			scores: [0, 0, 0, 0, 1, 0],
			scoresMaximum: [0, 0, 0, 0, 30, 0],
		},
		charisma: {
			description: "When I or another creature within 60 ft of me succeeds or fails a D20 Test, I can roll 2d4 and apply the total rolled as a bonus or penalty to the d20 roll. Once I do this, I can't do so again until I roll Initiative or finish a Short or Long Rest. [+1 Charisma]",
			scores: [0, 0, 0, 0, 0, 1],
			scoresMaximum: [0, 0, 0, 0, 0, 30],
		},
	},
	"boon of irresistible offense": {
		name: "Boon of Irresistible Offense",
		source: [["SRD24", 88], ["P24", 211]],
		type: "epic boon",
		prerequisite: "Level 19+",
		prereqeval: function (v) { return v.characterLevel >= 19; },
		description: "The Bludgeoning, Piercing, and Slashing damage I deal always ignores Resistance. When I roll a 20 on the d20 for an attack roll, I can deal extra damage to the target equal to the ability score increased by this feat. [+1 Strength or Dexterity]",
		descriptionFull: [
			"You gain the following benefits.",
			">>Ability Score Increase<<. Increase your Strength or Dexterity score by 1, to a maximum of 30.",
			">>Overcome Defenses<<. The Bludgeoning, Piercing, and Slashing damage you deal always ignores Resistance.",
			">>Overwhelming Strike<<. When you roll a 20 on the d20 for an attack roll, you can deal extra damage to the target equal to the ability score increased by this feat. The extra damage's type is the same as the attack's type.",
		],
		choices: ["Strength", "Dexterity"],
		strength: {
			name: "Boon of Irresistible Offense [Str]",
			description: "Bludgeoning, Piercing, and Slashing damage I deal ignores Resistance. When I roll a 20 on the d20 for an attack roll, I can deal extra damage to the target equal to my Strength score. This damage is of the same type as the attack's type. [+1 Strength]",
			scores: [1, 0, 0, 0, 0, 0],
			scoresMaximum: [30, 0, 0, 0, 0, 0],
		},
		dexterity: {
			name: "Boon of Irresistible Offense [Dex]",
			description: "Bludgeoning, Piercing, and Slashing damage I deal ignores Resistance. When I roll a 20 on the d20 for an attack roll, I can deal extra damage to the target equal to my Dexterity score. This damage is of the same type as the attack's type. [+1 Dexterity]",
			scores: [0, 1, 0, 0, 0, 0],
			scoresMaximum: [0, 30, 0, 0, 0, 0],
		},
	},
	"boon of spell recall": {
		name: "Boon of Spell Recall",
		source: [["SRD24", 88], ["P24", 211]],
		type: "epic boon",
		prerequisite: "Level 19+, Spellcasting Feature",
		prereqeval: function (v) {
			return v.characterLevel >= 19 && v.isSpellcasterClass;
		},
		description: "Whenever I cast a spell with a level 1-4 spell slot, I roll a 1d4. If the number I roll is the same as the slot's level, the slot isn't expended. [+1 Intelligence, Wisdom, or Charisma]",
		descriptionFull: [
			"You gain the following benefits.",
			">>Ability Score Increase<<. Increase your Intelligence, Wisdom, or Charisma score by 1, to a maximum of 30.",
			">>Free Casting<<. Whenever you cast a spell with a level 1-4 spell slot, roll 1d4. If the number you roll is the same as the slot's level, the slot isn't expended.",
		],
		choices: ["Intelligence", "Wisdom", "Charisma"],
		intelligence: {
			name: "Boon of Spell Recall [Int]",
			description: "Whenever I cast a spell with a level 1-4 spell slot, I roll a 1d4. If the number I roll is the same as the slot's level, the slot isn't expended. [+1 Intelligence]",
			scores: [0, 0, 0, 1, 0, 0],
			scoresMaximum: [0, 0, 0, 30, 0, 0],
		},
		wisdom: {
			name: "Boon of Spell Recall [Wis]",
			description: "Whenever I cast a spell with a level 1-4 spell slot, I roll a 1d4. If the number I roll is the same as the slot's level, the slot isn't expended. [+1 Wisdom]",
			scores: [0, 0, 0, 0, 1, 0],
			scoresMaximum: [0, 0, 0, 0, 30, 0],
		},
		charisma: {
			name: "Boon of Spell Recall [Cha]",
			description: "Whenever I cast a spell with a level 1-4 spell slot, I roll a 1d4. If the number I roll is the same as the slot's level, the slot isn't expended. [+1 Charisma]",
			scores: [0, 0, 0, 0, 0, 1],
			scoresMaximum: [0, 0, 0, 0, 0, 30],
		},
	},
	"boon of the night spirit": {
		name: "Boon of the Night Spirit",
		source: [["SRD24", 88], ["P24", 211]],
		type: "epic boon",
		prerequisite: "Level 19+",
		prereqeval: function (v) { return v.characterLevel >= 19; },
		description: "While in Dim Light or Darkness, I have Resistance to all damage except Psychic and Radiant, and as a bonus action, I can give myself the Invisible condition. This condition ends on me immediately after I take an Action, Bonus Action, or Reaction. [+1 to one ability score of my choice]",
		descriptionFull: [
			"You gain the following benefits.",
			">>Ability Score Increase<<. Increase one ability score of your choice by 1, to a maximum of 30.",
			">>Merge with Shadows<<. While within Dim Light or Darkness, you can give yourself the Invisible condition as a Bonus Action. The condition ends on you immediately after you take an action, a Bonus Action, or a Reaction.",
			">>Shadowy Form<<. While within Dim Light or Darkness, you have Resistance to all damage except Psychic and Radiant.",
		],
		choices: ["Strength", "Dexterity", "Constitution", "Intelligence", "Wisdom", "Charisma"],
		action: [["bonus action", "Merge with Shadows"]],
		strength: {
			name: "Boon of the Night Spirit [Str]",
			description: "While in Dim Light or Darkness, I have Resistance to all damage except Psychic and Radiant, and as a bonus action, I can give myself the Invisible condition. This condition ends on me immediately after I take an Action, Bonus Action, or Reaction. [+1 Strength]",
			scores: [1, 0, 0, 0, 0, 0],
			scoresMaximum: [30, 0, 0, 0, 0, 0],
		},
		dexterity: {
			name: "Boon of the Night Spirit [Dex]",
			description: "While in Dim Light or Darkness, I have Resistance to all damage except Psychic and Radiant, and as a bonus action, I can give myself the Invisible condition. This condition ends on me immediately after I take an Action, Bonus Action, or Reaction. [+1 Dexterity]",
			scores: [0, 1, 0, 0, 0, 0],
			scoresMaximum: [0, 30, 0, 0, 0, 0],
		},
		constitution: {
			name: "Boon of the Night Spirit [Con]",
			description: "While in Dim Light or Darkness, I have Resistance to all damage except Psychic and Radiant, and as a bonus action, I can give myself the Invisible condition. This condition ends on me immediately after I take an Action, Bonus Action, or Reaction. [+1 Constitution]",
			scores: [0, 0, 1, 0, 0, 0],
			scoresMaximum: [0, 0, 30, 0, 0, 0],
		},
		intelligence: {
			name: "Boon of the Night Spirit [Int]",
			description: "While in Dim Light or Darkness, I have Resistance to all damage except Psychic and Radiant, and as a bonus action, I can give myself the Invisible condition. This condition ends on me immediately after I take an Action, Bonus Action, or Reaction. [+1 Intelligence]",
			scores: [0, 0, 0, 1, 0, 0],
			scoresMaximum: [0, 0, 0, 30, 0, 0],
		},
		wisdom: {
			name: "Boon of the Night Spirit [Wis]",
			description: "While in Dim Light or Darkness, I have Resistance to all damage except Psychic and Radiant, and as a bonus action, I can give myself the Invisible condition. This condition ends on me immediately after I take an Action, Bonus Action, or Reaction. [+1 Wisdom]",
			scores: [0, 0, 0, 0, 1, 0],
			scoresMaximum: [0, 0, 0, 0, 30, 0],
		},
		charisma: {
			name: "Boon of the Night Spirit [Cha]",
			description: "While in Dim Light or Darkness, I have Resistance to all damage except Psychic and Radiant, and as a bonus action, I can give myself the Invisible condition. This condition ends on me immediately after I take an Action, Bonus Action, or Reaction. [+1 Charisma]",
			scores: [0, 0, 0, 0, 0, 1],
			scoresMaximum: [0, 0, 0, 0, 0, 30],
		},
	},
	"boon of truesight": {
		name: "Boon of Truesight",
		source: [["SRD24", 88], ["P24", 211]],
		type: "epic boon",
		prerequisite: "Level 19+",
		prereqeval: function (v) { return v.characterLevel >= 19; },
		description: "I have Truesight with a range of 60 ft. [+1 to one ability score of my choice]",
		descriptionFull: [
			"You gain the following benefits.",
			">>Ability Score Increase<<. Increase one ability score of your choice by 1, to a maximum of 30.",
			">>Truesight<<. You have Truesight with a range of 60 feet.",
		],
		vision: [["Truesight", 60]],
		choices: ["Strength", "Dexterity", "Constitution", "Intelligence", "Wisdom", "Charisma"],
		strength: {
			description: "I have Truesight with a range of 60 ft. [+1 Strength]",
			scores: [1, 0, 0, 0, 0, 0],
			scoresMaximum: [30, 0, 0, 0, 0, 0],
		},
		dexterity: {
			description: "I have Truesight with a range of 60 ft. [+1 Dexterity]",
			scores: [0, 1, 0, 0, 0, 0],
			scoresMaximum: [0, 30, 0, 0, 0, 0],
		},
		constitution: {
			description: "I have Truesight with a range of 60 ft. [+1 Constitution]",
			scores: [0, 0, 1, 0, 0, 0],
			scoresMaximum: [0, 0, 30, 0, 0, 0],
		},
		intelligence: {
			description: "I have Truesight with a range of 60 ft. [+1 Intelligence]",
			scores: [0, 0, 0, 1, 0, 0],
			scoresMaximum: [0, 0, 0, 30, 0, 0],
		},
		wisdom: {
			description: "I have Truesight with a range of 60 ft. [+1 Wisdom]",
			scores: [0, 0, 0, 0, 1, 0],
			scoresMaximum: [0, 0, 0, 0, 30, 0],
		},
		charisma: {
			description: "I have Truesight with a range of 60 ft. [+1 Charisma]",
			scores: [0, 0, 0, 0, 0, 1],
			scoresMaximum: [0, 0, 0, 0, 0, 30],
		},
	},
};

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
		if (oFeat.choices.indexOf(abi) !== -1) oFeat.choices.push(abi);
		// Create an object for it if it doesn't exist
		if (!oFeat[abiLC]) {
			oFeat[abiLC] = {
				description: oFeat.description + " [" + (bAddDescriptionAbbreviations ? abiAbbr : abi) + "]",
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
};
