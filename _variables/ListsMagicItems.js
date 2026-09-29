var TreasureCheckpointsTable = {
	A: { tier: 1, points: 8 },
	B: { tier: 1, points: 8 },
	C: { tier: 1, points: 8 },
	D: { tier: 2, points: 16 },
	E: { tier: 3, points: 16 },
	F: { tier: 1, points: 16 },
	G: { tier: 2, points: 20 },
	H: { tier: 3, points: 20 },
	I: { tier: 3, points: 24 },
};
var AddMagicItemsMenu;
var sentientItemConflictNote = {
	name: "Sentient Item Conflict",
	source: [["SRD24", 208], ["DMG24", 227]],
	origin: "",
	note: [
		"When the bearer of a sentient item acts in a manner opposed to the item's alignment or purpose, conflict can arise. When such a conflict occurs, the item's bearer makes a Charisma saving throw (DC 12 plus the item's Charisma modifier). On a failed save, the item makes one or more of the following demands:",
		"**Chase My Dreams**. The item demands that its bearer pursue the item's goals to the exclusion of all other goals.",
		"**Get Rid of It**. The item demands that its bearer dispose of anything the item finds repugnant.",
		"**It's Time for a Change**. The item demands to be given to someone else.",
		"**Keep Me Close**. The item insists on being carried or worn at all times.\nIf its bearer refuses to comply with the item's demands, the item can do any of the following:",
		"\u2022 Make it impossible for its bearer to attune to it.",
		"\u2022 Suppress one or more of its activated properties.",
		"\u2022 Attempt to take control of its bearer, whereupon the bearer makes a Charisma saving throw (DC 12 plus the item's Charisma modifier). On a failed save, the bearer has the Charmed condition for 1d12 hours. While Charmed in this way, the bearer must try to follow the item's commands. If the bearer takes damage, it repeats the save, ending the effect on a success. Whether or not the attempt to control its bearer succeeds, the item can't use this power again until the next dawn.",
	],
};
var sentientItemConflictTxt = sentientItemConflictNote.note; // For backwards compatibility

var Base_MagicItemsList = {
	"adamantine armor": {
		name: "Adamantine Armor",
		nameTest: /adamantine.+(armou?r|\u180C)/i,
		source: [["SRD24", 209], ["DMG24", 227]],
		type: "Armor (Any Medium or Heavy, Except Hide Armor)",
		rarity: "Uncommon",
		magicItemTable: "Armaments",
		description: "This armor is reinforced with adamantine, one of the hardest substances in existence. While I'm wearing it, any Critical Hit against me becomes a normal hit.",
		descriptionFull: "This suit of armor is reinforced with adamantine, one of the hardest substances in existence. While you're wearing it, any Critical Hit against you becomes a normal hit.",
		allowDuplicates: true,
		chooseGear: {
			type: "armor",
			prefixOrSuffix: ["between", "Adamantine", "\u180C"],
			itemName1stPage: ["suffix", "Adamantine"],
			descriptionChange: ["replace", "armor"],
			excludeCheck: function (inObjKey, inObj) {
				return !/medium|heavy/i.test(inObj.type) || /hide/i.test(inObj.name);
			},
		},
	},
	"ammunition": {
		name: "Ammunition, +1, +2, or +3",
		source: [["SRD24", 209], ["DMG24", 228]],
		type: "Weapon (Any Ammunition)",
		magicItemTable: ["Armaments", "Implements"],
		description: "Select one of the choices.",
		descriptionFull: [
			"You have a +1 bonus to attack and damage rolls made with this piece of magic ammunition. Once it hits a target, the ammunition is no longer magical.",
			"This ammunition is typically found or sold in quantities of ten or twenty pieces. Ten pieces of this ammunition are equivalent in value to a potion of the same rarity (uncommon: 200 gp, rare: 2,000 gp, very rare: 20,000 gp).",
		],
		allowDuplicates: true,
		choices: ["+1 Ammunition (Uncommon)", "+2 Ammunition (Rare)", "+3 Ammunition (Very Rare)"],
		"+1 ammunition (uncommon)": {
			name: "Ammunition +1",
			nameTest: /(ammo|ammunition) \+1|\+1.+(ammo|ammunition|\u180B)/i,
			rarity: "Uncommon",
			description: "I have a +1 bonus to attack and damage rolls made with these magic ammunitions. Once it hits a target, a piece of ammunition is no longer magical.",
			allowDuplicates: true,
			chooseGear: {
				type: "ammo",
				prefixOrSuffix: ["between", "+1", "\u180B"],
				itemName1stPage: ["suffix", "+1"],
				descriptionChange: ["replace", "ammunitions"],
				excludeCheck: function (inObjKey, inObj) {
					return /vials|flasks/i.test(inObj.icon);
				},
			},
		},
		"+2 ammunition (rare)": {
			name: "Ammunition +2",
			nameTest: /(ammo|ammunition) \+2|\+2.+(ammo|ammunition|\u180B)/i,
			rarity: "Rare",
			description: "I have a +2 bonus to attack and damage rolls made with these magic ammunitions. Once it hits a target, a piece of ammunition is no longer magical.",
			allowDuplicates: true,
			chooseGear: {
				type: "ammo",
				prefixOrSuffix: ["between", "+2", "\u180B"],
				itemName1stPage: ["suffix", "+2"],
				descriptionChange: ["replace", "ammunitions"],
				excludeCheck: function (inObjKey, inObj) {
					return /vials|flasks/i.test(inObj.icon);
				},
			},
		},
		"+3 ammunition (very rare)": {
			name: "Ammunition +3",
			nameTest: /(ammo|ammunition) \+3|\+3.+(ammo|ammunition|\u180B)/i,
			rarity: "Very Rare",
			description: "I have a +3 bonus to attack and damage rolls made with these magic ammunitions. Once it hits a target, a piece of ammunition is no longer magical.",
			allowDuplicates: true,
			chooseGear: {
				type: "ammo",
				prefixOrSuffix: ["between", "+3", "\u180B"],
				itemName1stPage: ["suffix", "+3"],
				descriptionChange: ["replace", "ammunitions"],
				excludeCheck: function (inObjKey, inObj) {
					return /vials|flasks/i.test(inObj.icon);
				},
			},
		},
	},
	"ammunition of slaying": function () {
		var obj = {
			name: "Ammunition of Slaying",
			nameTest: "of Slaying \u180B",
			source: [["SRD24", 209], ["DMG24", 228]],
			type: "Weapon (Any Ammunition)",
			rarity: "Very Rare",
			magicItemTable: "Armaments",
			description: "Select one of the choices.",
			descriptionFull: [
				"This magic ammunition is meant to slay creatures of a particular type, which the DM chooses or determines randomly by rolling on the table below. If a creature of that type takes damage from the ammunition, the creature makes a DC 17 Constitution saving throw, taking an extra 6d10 Force damage on a failed save or half as much extra damage on a successful one.",
				"After dealing its extra damage to a creature, the ammunition becomes nonmagical.",
				[
					["1d100", "Creature Type"],
					["01-10", "Aberrations"],
					["11-15", "Beasts"],
					["16-20", "Celestials"],
					["21-25", "Constructs"],
					["26-35", "Dragons"],
					["36-45", "Elementals"],
					["46-50", "Humanoids"],
					["51-60", "Fey"],
					["61-70", "Fiends"],
					["71-75", "Giants"],
					["76-80", "Monstrosities"],
					["81-85", "Oozes"],
					["86-90", "Plants"],
					["91-00", "Undead"],
				],
			],
			chooseGear: {
				type: "ammo",
				prefixOrSuffix: "prefix",
				descriptionChange: ["replace", "ammunition"],
				excludeCheck: function (inObjKey, inObj) {
					return /vials|flasks/i.test(inObj.icon);
				},
				removePluralS: true,
			},
			allowDuplicates: true,
			choicesNotInMenu: true,
			choices: [],
		};
		["Aberration", "Beast", "Celestial", "Construct", "Dragon", "Elemental", "Humanoid", "Fey", "Fiend", "Giant", "Monstrosity", "Ooze", "Plant", "Undead"].forEach(function (type) {
			obj.choices.push(type);
			obj[type.toLowerCase()] = {
				name: "Ammunition of " + type + " Slaying",
				nameTest: "of " + type + " Slaying \u180B",
				description: "If a creature with the " + type + " type takes damage from this magical ammunition, it takes an extra 6d10 Force damage. It can make a DC 17 Constitution saving throw to halve this extra damage. After dealing its extra damage to a creature, the ammunition becomes nonmagical.",
				allowDuplicates: true,
			};
		});
		return obj;
	}(),
	"amulet of health": {
		name: "Amulet of Health",
		source: [["SRD24", 209], ["DMG24", 228]],
		type: "Wondrous Item",
		rarity: "Rare",
		magicItemTable: "Relics",
		attunement: true,
		description: "My Constitution score is 19 while I'm wearing this amulet. It has no effect on me if my Constitution is already 19 or higher without it.",
		descriptionFull: "Your Constitution score is 19 while you wear this amulet. It has no effect on you if your Constitution is already 19 or higher without it.",
		weight: 1,
		scoresOverride: [0, 0, 19, 0, 0, 0],
	},
	"amulet of proof against detection and location": {
		name: "Amulet of Proof against Detection and Location",
		source: [["SRD24", 209], ["DMG24", 228]],
		type: "Wondrous Item",
		rarity: "Uncommon",
		magicItemTable: "Arcana",
		attunement: true,
		description: "While wearing this amulet, I can't be targeted by Divination spells or perceived through magical scrying sensors unless I allow it.",
		descriptionFull: "While wearing this amulet, you can't be targeted by Divination spells or perceived through magical scrying sensors unless you allow it.",
		weight: 1,
	},
	"amulet of the planes": {
		name: "Amulet of the Planes",
		source: [["SRD24", 209], ["DMG24", 229]],
		type: "Wondrous Item",
		rarity: "Very Rare",
		magicItemTable: "Arcana",
		attunement: true,
		description: "As a Magic action, I can name a location that I am familiar with on another plane and make a DC 15 Int (Arcana) check. On a success, I cast *Plane Shift*. On a failure, all creatures and objects within 15 ft of me and myself travel to: [60%] a random location on the named plane, or [40%] another plane (see Notes).",
		descriptionLong: "As a Magic action while wearing this amulet, I can name a location that I am familiar with on another plane and make a DC 15 Intelligence (Arcana) check. On a success, I cast *Plane Shift*. On a failure, all creatures and objects within 15 ft of me and myself travel to a random destination determined by rolling 1d100: [1-60] Random location on the named plane; [61-70] Random location on an Inner Plane (see Notes); [71-90] Random location on an Outer Plane (see Notes); [91-00] Random location on the Astral Plane.",
		descriptionFull: [
			"While wearing this amulet, you can take a Magic action to name a location that you are familiar with on another plane of existence. Then make a DC 15 Intelligence (Arcana) check. On a successful check, you cast *Plane Shift*. On a failed check, you and each creature and object within 15 feet of you travel to a random destination determined by rolling 1d100 and consulting the following table.",
			[
				["1d100", "Destination"],
				["01-60", "Random location on the plane you named"],
				["61-70", "Random location on an Inner Plane determined by rolling 1d6: on a 1, the Plane of Air; on a 2, the Plane of Earth; on a 3, the Plane of Fire; on a 4, the Plane of Water; on a 5, the Feywild; on a 6, the Shadowfell"],
				["71-80", "Random location on an Outer Plane determined by rolling 1d8: on a 1, Arborea; on a 2, Arcadia; on a 3, the Beastlands; on a 4, Bytopia; on a 5, Elysium; on a 6, Mechanus; on a 7, Mount Celestia; on an 8, Ysgard"],
				["81-90", "Random location on an Outer Plane determined by rolling 1d8: on a 1, the Abyss; on a 2, Acheron; on a 3, Carceri; on a 4, Gehenna; on a 5, Hades; on a 6, Limbo; on a 7, the Nine Hells; on an 8, Pandemonium"],
				["91-00", "Random location on the Astral Plane"],
			],
		],
		weight: 1,
		spellcastingAbility: "class",
		spellcastingBonus: [{
			name: "DC 15 Arcana check",
			spells: ["plane shift"],
			selection: ["plane shift"],
			firstCol: "atwill",
		}],
		spellChanges: {
			"plane shift": {
				description: "DC 15 Arcana to cast; Me \x26 8 willing teleport to another plane: generic location/teleport circle; see B",
				components: "V,M\u0192",
				changes: "The spell can be cast at will, but requires a DC 15 Intelligence (Arcana) check to do so, with negative consequences on a failure.",
			},
		},
		toNotesPage: [{
			name: "Amulet of the Planes",
			useDescriptionFull: function (str) {
				return str.replace(/I and (each .*? of me)/, "$1 and myself")
			},
		}],
	},
	"animated shield": {
		name: "Animated Shield",
		source: [["SRD24", 209], ["DMG24", 229]],
		type: "Shield",
		rarity: "Very Rare",
		magicItemTable: "Armaments",
		attunement: true,
		description: "As a Bonus Action while holding this Shield, I can cause it leap into the air and hover in my space to protect me as if I was wielding it, leaving my hands free. It stays animate for 1 minute, until I take a Bonus Action to end this, I die, or I'm Incapacitated. " + (typePF ? "It" : "The Shield") + " then falls to the ground or into my hand if I have one free.",
		descriptionFull: "While holding this Shield, you can take a Bonus Action to cause it to animate. The Shield leaps into the air and hovers in your space to protect you as if you were wielding it, leaving your hands free. The Shield remains animate for 1 minute, until you take a Bonus Action to end this effect, or until you die or have the Incapacitated condition, at which point the Shield falls to the ground or into your hand if you have one free.",
		weight: 6,
		action: [["bonus action", ""]],
		shieldAdd: "Animated Shield",
	},
	"apparatus of kwalish": {
		name: "Apparatus of Kwalish",
		nameAlt: "Apparatus of the Crab",
		source: [["SRD24", 210], ["DMG24", 229]],
		type: "Wondrous Item",
		rarity: "Legendary",
		magicItemTable: "Arcana",
		description: "A Large 500 lb iron barrel. DC 20 Intelligence (Investigation) check finds a hidden hatch at one end, allowing two \u2264Medium creatures inside. Transforms to resemble a giant lobster, which is air-tight (10 hours of breathable air), floats, and can submerge to 900 ft deep. See Notes page for its statistics and operation.",
		descriptionLong: "A Large sealed iron barrel weighing 500 lb. A successful DC 20 Intelligence (Investigation) check finds a hidden catch unlocking a hatch at one end of the barrel, allowing two Medium or smaller creatures to crawl inside. Ten levers are set in a row at the far end, each in a neutral position, able to move either up or down. Certain levers transform the barrel to resemble a giant lobster, which is air-tight (10 hours of breathable air), floats, and submerges to a depth of 900 ft. See Notes page for its statistics and operation.",
		descriptionFull: [
			"This item first appears to be a sealed iron barrel weighing 500 pounds. The barrel has a hidden catch, which can be found with a successful DC 20 Intelligence (Investigation) check. Releasing the catch unlocks a hatch at one end of the barrel, allowing two Medium or smaller creatures to crawl inside. Ten levers are set in a row at the far end, each in a neutral position, able to move up or down. When certain levers are used, the apparatus transforms to resemble a giant lobster.",
			"The *Apparatus of Kwalish* is a Large object with the following statistics: AC 20; HP 200; Speed 30 ft., Swim 30 ft. (or 0 ft. for both if the legs aren't extended); Immunity to Poison and Psychic damage.",
			"To be used as a vehicle, the apparatus requires one pilot. While the apparatus's hatch is closed, the compartment is airtight and watertight. The compartment holds enough air for 10 hours of breathing, divided by the number of breathing creatures inside.",
			"The apparatus floats on water. It can also go underwater to a depth of 900 feet. Below that, the vehicle takes 2d6 Bludgeoning damage each minute from pressure.",
			"A creature in the compartment can take a Utilize action to move as many as two of the apparatus's levers up or down. After each use, a lever goes back to its neutral position. Each lever, from left to right, functions as shown in the *Apparatus of Kwalish* Levers table.",
			[
				["Lever", "Result"],
				["  1 up", "Legs extend, allowing the apparatus to walk and swim."],
				["  1 down", "Legs extend, allowing the apparatus to walk and swim.", "Legs retract, reducing the apparatus's Speed and Swim Speed to 0 and making it unable to benefit from bonuses to speed."],
				["  2 up", "Forward window shutter opens."],
				["  2 down", "Forward window shutter closes."],
				["  3 up", "Side window shutters open (two per side)."],
				["  3 down", "Side window shutters close (two per side)."],
				["  4 up", "Two claws extend from the front side of the apparatus."],
				["  4 down", "The claws retract."],
				["  5 up", "Each extended claw makes the following melee attack: +8 to hit, reach 5 ft. Hit: 7 (2d6) Bludgeoning damage."],
				["  5 down", "Each extended claw makes the following melee attack: +8 to hit, reach 5 ft. Hit: The target has the Grappled condition (escape DC 15)."],
				["  6 up", "The apparatus walks or swims forward provided its legs are extended."],
				["  6 down", "The apparatus walks or swims backward provided its legs are extended."],
				["  7 up", "The apparatus turns 90 degrees counterclockwise provided its legs are extended."],
				["  7 down", "The apparatus turns 90 degrees clockwise provided its legs are extended."],
				["  8 up", "Eyelike fixtures emit Bright Light in a 30-foot radius and Dim Light for an additional 30 feet."],
				["  8 down", "The light turns off."],
				["  9 up", "The apparatus sinks up to 20 feet if it's in liquid."],
				["  9 down", "The apparatus rises up to 20 feet if it's in liquid."],
				["10 up", "The rear hatch unseals and opens."],
				["10 down", "The rear hatch closes and seals."],
			],
		],
		weight: 500,
		toNotesPage: [{
			name: "Statistics \x26 Lever Operation Details",
			note: [
				"This item first appears to be a sealed iron barrel weighing 500 pounds. The barrel has a hidden catch, which can be found with a successful DC 20 Intelligence (Investigation) check. Releasing the catch unlocks a hatch at one end of the barrel, allowing two Medium or smaller creatures to crawl inside. Ten levers are set in a row at the far end, each in a neutral position, able to move up or down. When certain levers are used, the apparatus transforms to resemble a giant lobster.",
				"The *Apparatus of Kwalish* is a Large object with the following statistics:",
				"\u2022 20 AC, 200 HP.",
				"\u2022 Speed 30 ft, Swim 30 ft (only with legs extended).",
				"\u2022 Immunity to Poison and Psychic damage.",
				"\rTo be used as a vehicle, the apparatus requires one pilot. While the apparatus's hatch is closed, the compartment is airtight and watertight. The compartment holds enough air for 10 hours of breathing, divided by the number of breathing creatures inside.",
				"The apparatus floats on water. It can also go underwater to a depth of 900 ft. Below that, the vehicle takes 2d6 Bludgeoning damage each minute from pressure.",
				"A creature in the compartment can take a Utilize action to move as many as two of the apparatus's levers up or down. After each use, a lever goes back to its neutral position. Each lever, from left to right, functions as shown below.",
				[
					["Lever", "Up", "", "", "Down"],
					["  1", "Legs extend (30 ft Speed)", "Legs retract (0 Speed)"],
					["  2", "Forward shutter opens", "", "Forward shutter closes"],
					["  3", "Side shutters open (two per side)", "Side shutters close"],
					["  4", "Claws extend from front sides", "Claws retract"],
					["  5", "Claws: +8, 5 ft, 2d6 bludgeoning", "Claws: +8, 5 ft, DC 15 grapple"],
					["  6", "Walk or swim forward", "", "Walk or swim backward"],
					["  7", "Turn 90 degrees left", "", "Turn 90 degrees right"],
					["  8", "Eyes emit 30 ft bright + dim light", "Eye lights turn off"],
					["  9", "Sink up to 20 ft in liquid", "Rise up to 20 ft in liquid"],
					["10", "Rear hatch unseals and opens", "Rear hatch closes and seals"],
				],
			],
		}],
	},
	"armor": {
		name: "Armor, +1, +2, or +3",
		source: [["SRD24", 210], ["DMG24", 230]],
		type: "Armor (Any Light, Medium, or Heavy)",
		magicItemTable: ["Armaments", "Relics"],
		description: "Select one of the choices.",
		descriptionFull: "You have a bonus to Armor Class while wearing this armor. The bonus is determined by its rarity: Rare (+1), Very Rare (+2), or Legendary (+3).",
		allowDuplicates: true,
		choices: ["+1 Armor (Rare)", "+2 Armor (Very Rare)", "+3 Armor (Legendary)"],
		"+1 armor (rare)": {
			name: "Armor +1",
			nameTest: /armou?r \+1|\+1.+(armou?r|\u180C)/i,
			rarity: "Rare",
			description: "I have a +1 bonus to AC while wearing this armor.",
			allowDuplicates: true,
			chooseGear: {
				type: "armor",
				prefixOrSuffix: ["between", "+1", "\u180C"],
				itemName1stPage: ["suffix", "+1"],
				descriptionChange: ["replace", "armor"],
			},
		},
		"+2 armor (very rare)": {
			name: "Armor +2",
			nameTest: /armou?r \+2|\+2.+(armou?r|\u180C)/i,
			rarity: "Very Rare",
			description: "I have a +2 bonus to AC while wearing this armor.",
			allowDuplicates: true,
			chooseGear: {
				type: "armor",
				prefixOrSuffix: ["between", "+2", "\u180C"],
				itemName1stPage: ["suffix", "+2"],
				descriptionChange: ["replace", "armor"],
			},
		},
		"+3 armor (legendary)": {
			name: "Armor +3",
			nameTest: /armou?r \+3|\+3.+(armou?r|\u180C)/i,
			rarity: "Legendary",
			description: "I have a +3 bonus to AC while wearing this armor.",
			allowDuplicates: true,
			chooseGear: {
				type: "armor",
				prefixOrSuffix: ["between", "+3", "\u180C"],
				itemName1stPage: ["suffix", "+3"],
				descriptionChange: ["replace", "armor"],
			},
		},
	},
	"armor of invulnerability": {
		name: "Armor of Invulnerability",
		source: [["SRD24", 210], ["DMG24", 230]],
		type: "Armor (Plate Armor)",
		rarity: "Legendary",
		magicItemTable: ["Armaments", "Relics"],
		attunement: true,
		description: [
			"I have Resistance to Bludgeoning, Piercing, and Slashing damage while wearing this plate armor.",
			"***Metal Shell***. As a Magic action once per dawn, I can give myself Immunity to Bludgeoning, Piercing, and Slashing damage for 10 minutes or until I'm no longer wearing the armor.",
		],
		descriptionFull: [
			"You have Resistance to Bludgeoning, Piercing, and Slashing damage while you wear this armor.",
			"***Metal Shell***. You can take a Magic action to give yourself Immunity to Bludgeoning, Piercing, and Slashing damage for 10 minutes or until you are no longer wearing the armor. Once this property is used, it can't be used again until the next dawn.",
		],
		weight: 65,
		usages: 1,
		recovery: "Dawn",
		action: [["action", " (Metal Shell)"]],
		dmgres: ["Bludgeoning", "Piercing", "Slashing"],
		armorOptions: [{
			regExpSearch: /^(?=.*armor)(?=.*invulnerability).*$/i,
			name: "Armor of Invulnerability",
			source: [["SRD24", 210], ["DMG24", 230]],
			type: "heavy",
			ac: 18,
			stealthdis: true,
			weight: 65,
			strReq: 15,
			selectNow: true,
		}],
	},
	"armor of resistance": function (){
		var obj = {
			name: "Armor of Resistance",
			source: [["SRD24", 210], ["DMG24", 231]],
			type: "Armor (Any Light, Medium, or Heavy)",
			rarity: "Rare",
			magicItemTable: "Armaments",
			attunement: true,
			description: "Select one of the choices.",
			descriptionFull: [
				"You have Resistance to one type of damage while you wear this armor. The DM chooses the type or determines it randomly by rolling on the following table.",
				[
					["1d10", "Damage Type"],
					[" 1", "Acid"],
					[" 2", "Cold"],
					[" 3", "Fire"],
					[" 4", "Force"],
					[" 5", "Lightning"],
					[" 6", "Necrotic"],
					[" 7", "Poison"],
					[" 8", "Psychic"],
					[" 9", "Radiant"],
					["10", "Thunder"],
				],
			],
			chooseGear: {
				type: "armor",
				prefixOrSuffix: "prefix",
				descriptionChange: ["replace", "armor"],
			},
			allowDuplicates: true,
			choicesNotInMenu: true,
			choices: [],
		};
		["Acid", "Cold", "Fire", "Force", "Lightning", "Necrotic", "Poison", "Psychic", "Radiant", "Thunder"].forEach(function (type) {
			obj.choices.push(type);
			obj[type.toLowerCase()] = {
				name: "Armor of " + type + " Resistance",
				nameTest: "of " + type + " Resistance \u180C",
				description: "I have Resistance to " + type + " damage while I'm wearing this armor.",
				dmgres: [type],
			};
		});
		return obj;
	}(),
	"armor of vulnerability": {
		name: "Armor of Vulnerability",
		source: [["SRD24", 211], ["DMG24", 231]],
		type: "Armor (Any Light, Medium, or Heavy)",
		rarity: "Rare",
		magicItemTable: "Armaments",
		attunement: true,
		cursed: true,
		description: "Select one of the choices.",
		descriptionFull: [
			"While wearing this armor, you have Resistance to one of the following damage types: Bludgeoning, Piercing, or Slashing. The GM chooses the type or determines it randomly.",
			"***Curse***. This armor is cursed, a fact that is revealed only when the *Identify* spell is cast on the armor or you attune to it. Attuning to the armor curses you until you are targeted by a *Remove Curse* spell or similar magic; removing the armor fails to end the curse. While cursed, you have Vulnerability to two of the three damage types associated with the armor (not the one to which to grants Resistance).",
		],
		allowDuplicates: true,
		choicesNotInMenu: true,
		chooseGear: {
			type: "armor",
			prefixOrSuffix: "prefix",
			descriptionChange: ["replace", "armor"],
			itemName1stPage: ["prefix", "of Vulnerability"],
		},
		choices: ["Bludgeoning", "Piercing", "Slashing"],
		"bludgeoning": {
			name: "Armor of Vulnerability (Bludgeoning)",
			nameTest: "of Vulnerability (Bludgeoning) \u180C",
			description: "While wearing this armor, I have Resistance to Bludgeoning damage. As a result of its curse, I have Vulnerability to Piercing and Slashing damage until the curse is removed by a *Remove Curse* spell or similar magic.",
			dmgres: ["Bludgeoning"],
			savetxt: { text: ["**Vulnerability**. Piercing \x26 Slashing damage"] },
		},
		"piercing": {
			name: "Armor of Vulnerability (Piercing)",
			nameTest: "of Vulnerability (Piercing) \u180C",
			description: "While wearing this armor, I have Resistance to Piercing damage. As a result of its curse, I have Vulnerability to Bludgeoning and Slashing damage until the curse is removed by a *Remove Curse* spell or similar magic.",
			dmgres: ["Piercing"],
			savetxt: { text: ["**Vulnerability**. Bludgeoning \x26 Slashing damage"] },
		},
		"slashing": {
			name: "Armor of Vulnerability (Slashing)",
			nameTest: "of Vulnerability (Slashing) \u180C",
			description: "While wearing this armor, I have Resistance to Slashing damage. As a result of its curse, I have Vulnerability to Bludgeoning and Piercing damage until the curse is removed by a *Remove Curse* spell or similar magic.",
			dmgres: ["Slashing"],
			savetxt: { text: ["**Vulnerability**. Bludgeoning \x26 Piercing damage"] },
		},
	},
	"arrow-catching shield": {
		name: "Arrow-Catching Shield",
		source: [["SRD24", 211], ["DMG24", 231]],
		type: "Shield",
		rarity: "Rare",
		magicItemTable: "Armaments",
		attunement: true,
		description: "I gain an additional +2 bonus to AC against ranged attacks while I wield this Shield. (Not included in AC on the first page). As a Reaction when an attacker makes a ranged attack against a target within 5 ft of me, I can become the target of the attack instead.",
		descriptionFull: [
			"You gain a +2 bonus to Armor Class against ranged attack rolls while you wield this Shield. This bonus is in addition to the Shield's normal bonus to AC.",
			"Whenever an attacker makes a ranged attack roll against a target within 5 feet of you, you can take a Reaction to become the target of the attack instead.",
		],
		weight: 6,
		action: [["reaction", ""]],
		shieldAdd: "Arrow-Catching Shield (+\uFEFF2 vs ranged)",
	},
	"bag of beans": {
		name: "Bag of Beans",
		source: [["SRD24", 211], ["DMG24", 233]],
		type: "Wondrous Item",
		rarity: "Rare",
		magicItemTable: ["Arcana", "Implements"],
		description: "This heavy cloth bag contains 3d4 dry beans. If I dump one or more out, they explode in a 10-ft Sphere that deals 5d4 Force damage to all in the area, DC 15 Dex save to half. I can plant and water a bean to get an effect 1 minute later, chosen or rolled by the DM. The bag turns nonmagical once empty. See Notes page.",
		descriptionFull: [
			"This heavy cloth bag contains 3d4 dry beans when found. The bag weighs half a pound regardless of how many beans it contains and becomes a nonmagical item when it no longer contains any beans.",
			"If you dump one or more beans out of the bag, they explode in a 10-foot-radius Sphere centered on them. All the dumped beans are destroyed in the explosion, and each creature in the Sphere, including you, makes a DC 15 Dexterity saving throw, taking 5d4 Force damage on a failed save or half as much damage on a successful one.",
			"If you remove a bean from the bag, plant it in dirt or sand, and then water it, the bean disappears as it produces an effect 1 minute later from the ground where it was planted. The DM can choose an effect from the following table or determine it randomly.",
			[
				["1d100", "Effect"],
				["   01", "5d4 toadstools sprout. If a creature eats a toadstool, roll any die. On an odd roll, the eater must succeed on a DC 15 Constitution saving throw or take 5d6 Poison damage and have the Poisoned condition for 1 hour. On an even roll, the eater gains 5d6 Temporary Hit Points for 1 hour."],
				["02\u201310", "A geyser erupts and spouts water, beer, mayonnaise, tea, vinegar, wine, or oil (DM's choice) 30 feet into the air for 1d4 minutes."],
				["11\u201320", "A **Treant** sprouts. Roll any die. On an odd roll, the treant is Chaotic Evil. On an even roll, the treant is Chaotic Good."],
				["21\u201330", "An animate but immobile stone statue in your likeness rises and makes verbal threats against you. If you leave it and others come near, it describes you as the most heinous of villains and directs the newcomers to find and attack you. If you are on the same plane of existence as the statue, it knows where you are. The statue becomes inanimate after 24 hours."],
				["31\u201340", "A campfire with green flames springs forth and burns for 24 hours or until it is extinguished."],
				["41\u201350", "Three **Shrieker Fungi** sprout."],
				["51\u201360", "1d4 + 4 bright-pink toads crawl forth. Whenever a toad is touched, it transforms into a Large or smaller monster of the DM's choice that acts in accordance with its alignment and nature. The monster remains for 1 minute, then disappears in a puff of bright-pink smoke."],
				["61\u201370", "A hungry **Bulette** burrows up and attacks."],
				["71\u201380", "A fruit tree grows. It has 1d10 + 20 fruit, 1d8 of which act as randomly determined potions. The tree vanishes after 1 hour. Picked fruit remains, retaining any magic for 30 days."],
				["81\u201390", "A nest of 1d4 + 3 rainbow-colored eggs springs up. Any creature that eats an egg makes a DC 20 Constitution saving throw. On a successful save, a creature permanently increases its lowest ability score by 1, randomly choosing among equally low scores. On a failed save, the creature takes 10d6 Force damage from an internal explosion."],
				["91\u201395", "A pyramid with a 60-foot-square base bursts upward. Inside is a burial chamber containing a **Mummy**, a **Mummy Lord**, or some other Undead of the DM's choice. Its sarcophagus contains treasure of the DM's choice."],
				["96\u201300", "A giant beanstalk sprouts, growing to a height of the DM's choice. The top leads where the DM chooses, such as to a great view, a cloud giant's castle, or another plane of existence."],
			],
		],
		weight: 0.5,
		usages: " ", // 3d4 - Intentionally left blank
		additional: "3d4 beans",
		recovery: "\u2013",
		toNotesPage: [{
			name: "Bag of Beans",
			useDescriptionFull: function (str) {
				return str.replace(/(including|describes|attack) I/g, "$1 me")
					.replace("half a pound", "0.5 lb");
			},
		}],
	},
	"bag of devouring": {
		name: "Bag of Devouring",
		source: [["SRD24", 212], ["DMG24", 234]],
		type: "Wondrous Item",
		rarity: "Very Rare",
		magicItemTable: ["Arcana", "Implements"],
		description: "This bag is a feeding orifice for a creature that devours all edible matter placed inside. When part of a creature enters the bag, it has a 50% chance of being pulled inside. As an action, it can try to escape (Athletics, DC 15) or another can free it (Athletics, DC 20). A creature that starts its turn inside the bag is destroyed.",
		descriptionLong: "This bag is a feeding orifice for an extradimensional creature that devours all animal and vegetable matter placed inside. Turning the bag inside out closes the orifice. When part of a living creature enters the bag, it has a 50% chance of being pulled inside. As an action, it can try to escape (Athletics, DC 15) or another creature can try to pull it out (Athletics, DC 20). A creature that starts its turn inside the bag is destroyed. Up to 1 cu ft of inanimate objects can be stored inside, but once each day they are swallowed by the bag and spat out into a random plane. If the bag is pierced or torn, it is destroyed and its content lost" + (!typePF ? " in a random location on the Astral Plane." : "."),
		descriptionFull: [
			"This bag resembles a *Bag of Holding* but is a feeding orifice for a gigantic extradimensional creature. Turning the bag inside out closes the orifice.",
			"The extradimensional creature attached to the bag can sense whatever is placed inside the bag. Animal or vegetable matter placed wholly in the bag is devoured and lost forever. When part of a living creature is placed in the bag, as happens when someone reaches inside it, there is a 50 percent chance that the creature is pulled inside the bag. A creature inside the bag can take an action to try to escape, doing so with a successful DC 15 Strength (Athletics) check. Another creature can take an action to reach into the bag to pull a creature out, doing so with a successful DC 20 Strength (Athletics) check, provided the puller isn't pulled inside the bag first. Any creature that starts its turn inside the bag is devoured, its body destroyed.",
			"Inanimate objects can be stored in the bag, which can hold a cubic foot of such material. However, once each day, the bag swallows any objects inside it and spits them out into another plane of existence. The DM determines the time and plane.",
			"If the bag is pierced or torn, it is destroyed, and anything contained within it is transported to a random location on the Astral Plane.",
		],
		weight: 5,
	},
	"bag of holding": {
		name: "Bag of Holding",
		source: [["SRD24", 212], ["DMG24", 234]],
		type: "Wondrous Item",
		rarity: "Uncommon",
		magicItemTable: ["Arcana", "Implements"],
		description: "This bag is bigger on the inside. It weighs 5 lb regardless of contents and can hold up to 500 lb, not exceeding a volume of 60 cu ft. Retrieving an item from it requires a Utilize action. If it's overloaded, pierced, or torn, it's destroyed and its contents lost. If turned inside out, all its contents spill forth.",
		descriptionLong: "This bag has an interior space larger than its outside dimensions, but weighs 5 lb regardless of its contents. It is roughly 2 ft square by 4 ft deep on the inside and can hold up to 500 lb, not exceeding a volume of 60 cu ft. Retrieving an item from it requires a Utilize action. If it is overloaded, pierced, or torn, it is destroyed, its contents scattered in the Astral Plane. If it is turned inside out, all its contents spill forth unharmed. The bag contains 10 minutes of air, divided by the creatures within. Placing the bag in another extradimensional space instantly destroys both and opens a gate to the Astral Plane.",
		descriptionFull: [
			"This bag has an interior space considerably larger than its outside dimensions\u2014roughly 2 feet square and 4 feet deep on the inside. The bag can hold up to 500 pounds, not exceeding a volume of 64 cubic feet. The bag weighs 5 pounds, regardless of its contents. Retrieving an item from the bag requires a Utilize action.",
			"If the bag is overloaded, pierced, or torn, it is destroyed, and its contents are scattered in the Astral Plane. If the bag is turned inside out, its contents spill forth unharmed, but the bag must be put right before it can be used again. The bag holds enough air for 10 minutes of breathing, divided by the number of breathing creatures inside.",
			"Placing a *Bag of Holding* inside an extradimensional space created by a *Heward's Handy Haversack*, *Portable Hole*, or similar item instantly destroys both items and opens a gate to the Astral Plane. The gate originates where the one item was placed inside the other. Any creature within a 10-foot-radius Sphere centered on the gate is sucked through it to a random location on the Astral Plane. The gate then closes. The gate is one-way and can't be reopened.",
		],
		weight: 5,
		action: [["action", " (retrieve item)"]],
	},
	"bag of tricks": {
		name: "Bag of Tricks",
		source: [["SRD24", 212], ["DMG24", 234]],
		type: "Wondrous Item",
		rarity: "Uncommon",
		magicItemTable: "Arcana",
		description: "Select one of the choices.",
		weight: 0.5,
		allowDuplicates: true,
		choices: ["Gray", "Rust", "Tan"],
		action: [
			["action", " (pull)"],
			["bonus action", " (command)"],
		],
		"gray": {
			name: "Gray Bag of Tricks",
			sortname: "Bag of Tricks, Gray",
			description: "As a Magic action 3 times per dawn, I can pull a thing from this bag and throw it 20 ft. When it lands, it transforms into a (d8): 1-Weasel, 2-Giant Rat, 3-Badger, 4-Boar, 5-Panther, 6-Giant Badger, 7-Dire Wolf, 8-Giant Elk. It acts on my turn. It vanishes at dawn \x26 if reduced to 0 HP. " + (typePF ? "I can command it as a Bonus Action." : "As a Bonus Action, I can command its next turn's move/action."),
			descriptionLong: "As a Magic action, I can pull a fuzzy object from this bag and throw it 20 ft. When it lands, it transforms into a (d8): 1-Weasel, 2-Giant Rat, 3-Badger, 4-Boar, 5-Panther, 6-Giant Badger, 7-Dire Wolf, 8-Giant Elk. The creature is Friendly to me and my allies, acts after me on my Initiative, and vanishes at the next dawn or when it is reduced to 0 HP. As a Bonus Action, I can command what the creature does on its next turn. In the absence of such orders, the creature acts in a fashion appropriate to its nature. Once three fuzzy objects have been pulled from the bag, the bag can't be used again until the next dawn.",
			descriptionFull: [
				"This bag made from gray cloth appears empty. Reaching inside the bag, however, reveals the presence of a small, fuzzy object.",
				"You can take a Magic action to pull the fuzzy object from the bag and throw it up to 20 feet. When the object lands, it transforms into a creature you determine by rolling on the table below. See the *Monster Manual* for the creature's stat block. The creature vanishes at the next dawn or when it is reduced to 0 Hit Points.",
				"The creature is Friendly to you and your allies, and it acts immediately after you on your Initiative count. You can take a Bonus Action to command how the creature moves and what action it takes on its next turn, such as attacking an enemy. In the absence of such orders, the creature acts in a fashion appropriate to its nature.",
				"Once three fuzzy objects have been pulled from the bag, the bag can't be used again until the next dawn.",
				[
					["1d8", "Creature"],
					["1", "Weasel"],
					["2", "Giant Rat"],
					["3", "Badger"],
					["4", "Boar"],
					["5", "Panther"],
					["6", "Giant Badger"],
					["7", "Dire Wolf"],
					["8", "Giant Elk"],
				],
			],
			usages: 3,
			recovery: "Dawn",
		},
		"rust": {
			name: "Rust Bag of Tricks",
			sortname: "Bag of Tricks, Rust",
			description: "As a Magic action 3 times per dawn, I can pull a thing from this bag and throw it 20 ft. When it lands, it transforms into a (d8): 1-Rat, 2-Owl, 3-Mastiff, 4-Goat, 5-Giant Goat, 6-Giant Boar, 7-Lion, 8-Brown Bear. It acts on my turn. It vanishes at dawn " + (typePF ? "\x26" : "and") + " if reduced to 0 HP. " + (typePF ? "I can command its next turn as a Bonus Action." : "As a Bonus Action, I can command what it does on its next turn."),
			descriptionLong: "As a Magic action, I can pull a fuzzy object from this bag and throw it 20 ft. When it lands, it transforms into a (d8): 1-Rat, 2-Owl, 3-Mastiff, 4-Goat, 5-Giant Goat, 6-Giant Boar, 7-Lion, 8-Brown Bear. The creature is Friendly to me and my allies, acts after me on my Initiative, and vanishes at the next dawn or when it is reduced to 0 HP. As a Bonus Action, I can command what the creature does on its next turn. In the absence of such orders, the creature acts in a fashion appropriate to its nature. Once three fuzzy objects have been pulled from the bag, the bag can't be used again until the next dawn.",
			descriptionFull: [
				"This bag made from rust cloth appears empty. Reaching inside the bag, however, reveals the presence of a small, fuzzy object.",
				"You can take a Magic action to pull the fuzzy object from the bag and throw it up to 20 feet. When the object lands, it transforms into a creature you determine by rolling on the table below. See the *Monster Manual* for the creature's stat block. The creature vanishes at the next dawn or when it is reduced to 0 Hit Points.",
				"The creature is Friendly to you and your allies, and it acts immediately after you on your Initiative count. You can take a Bonus Action to command how the creature moves and what action it takes on its next turn, such as attacking an enemy. In the absence of such orders, the creature acts in a fashion appropriate to its nature.",
				"Once three fuzzy objects have been pulled from the bag, the bag can't be used again until the next dawn.",
				[
					["1d8", "Creature"],
					["1", "Rat"],
					["2", "Owl"],
					["3", "Mastiff"],
					["4", "Goat"],
					["5", "Giant Goat"],
					["6", "Giant Boar"],
					["7", "Lion"],
					["8", "Brown Bear"],
				],
			],
			usages: 3,
			recovery: "Dawn",
		},
		"tan": {
			name: "Tan Bag of Tricks",
			sortname: "Bag of Tricks, Tan",
			description: "As a Magic action 3 times per dawn, I can pull a thing from this bag and throw it 20 ft. When it lands, it transforms into a (d8): 1-Jackal, 2-Ape, 3-Baboon, 4-Axe Beak, 5-Black Bear, 6-Giant Weasel, 7-Giant Hyena, 8-Tiger. It acts on my turn. It vanishes at dawn " + (typePF ? "\x26" : "and") + " if reduced to 0 HP. " + (typePF ? "I can command it as a Bonus Action." : "As a Bonus Action, I can command what it does on its next turn."),
			descriptionLong: "As a Magic action, I can pull a fuzzy object from this bag and throw it 20 ft. When it lands, it transforms into a (d8): 1-Jackal, 2-Ape, 3-Baboon, 4-Axe Beak, 5-Black Bear, 6-Giant Weasel, 7-Giant Hyena, 8-Tiger. The creature is Friendly to me and my allies, acts after me on my Initiative, and vanishes at the next dawn or when it is reduced to 0 HP. As a Bonus Action, I can command what the creature does on its next turn. In the absence of such orders, the creature acts in a fashion appropriate to its nature. Once three fuzzy objects have been pulled from the bag, the bag can't be used again until the next dawn.",
			descriptionFull: [
				"This bag made from tan cloth appears empty. Reaching inside the bag, however, reveals the presence of a small, fuzzy object.",
				"You can take a Magic action to pull the fuzzy object from the bag and throw it up to 20 feet. When the object lands, it transforms into a creature you determine by rolling on the table below. See the *Monster Manual* for the creature's stat block. The creature vanishes at the next dawn or when it is reduced to 0 Hit Points.",
				"The creature is Friendly to you and your allies, and it acts immediately after you on your Initiative count. You can take a Bonus Action to command how the creature moves and what action it takes on its next turn, such as attacking an enemy. In the absence of such orders, the creature acts in a fashion appropriate to its nature.",
				"Once three fuzzy objects have been pulled from the bag, the bag can't be used again until the next dawn.",
				[
					["1d8", "Creature"],
					["1", "Jackal"],
					["2", "Ape"],
					["3", "Baboon"],
					["4", "Axe Beak"],
					["5", "Black Bear"],
					["6", "Giant Weasel"],
					["7", "Giant Hyena"],
					["8", "Tiger"],
				],
			],
			usages: 3,
			recovery: "Dawn",
		},
	},
	"bead of force": {
		name: "Bead of Force",
		source: [["SRD24", 212], ["DMG24", 234]],
		type: "Wondrous Item",
		rarity: "Rare",
		magicItemTable: "Arcana",
		description: "As a Magic action, I can throw this bead 60 ft. It explodes in a 10-ft Sphere on impact and is destroyed. All creatures in the area must make a DC 15 Dex save or take 5d4 force damage and be trapped in a sphere of force that encloses the area for 1 min. The sphere can be moved from inside as a Utilize action.",
		descriptionLong: "As a Magic action, I can throw this 0.75 inch black sphere 60 ft. It explodes in a 10-ft Sphere on impact and is destroyed. All creatures in this area must make a DC 15 Dexterity save or take 5d4 force damage and become trapped in a sphere of transparent force that encloses the area for 1 minute. Only breathable air can pass through it. Those that succeed on their save or are only partially in the area are pushed outside of the sphere of force. Enclosed creatures can take a Utilize action to push against its wall, moving the sphere at half their Speed. The sphere of force weighs only 1 lb, regardless of contents.",
		descriptionFull: [
			"This small black sphere measures 3/4 of an inch in diameter and weighs an ounce. Typically, 1d4 + 4 Beads of Force are found together.",
			"You can take a Magic action to throw the bead up to 60 feet. The bead explodes in a 10-foot-radius Sphere on impact and is destroyed. Each creature in the Sphere must succeed on a DC 15 Dexterity saving throw or take 5d4 Force damage. A sphere of transparent force then encloses the area for 1 minute. Any creature that failed the save and is completely within the area is trapped inside this sphere. Creatures that succeeded on the save or are partially within the area are pushed away from the center of the sphere until they are no longer inside it. Only breathable air can pass through the sphere's wall. No attack or other effect can pass through.",
			"An enclosed creature can take a Utilize action to push against the sphere's wall, moving the sphere up to half the creature's Speed. The sphere can be picked up, and its magic causes it to weigh only 1 pound, regardless of the weight of creatures inside.",
		],
		weight: 0.0625,
		action: [["action", ""]],
	},
	"bead of nourishment": {
		name: "Bead of Nourishment",
		source: [["SRD24", 213], ["DMG24", 235]],
		type: "Wondrous Item",
		rarity: "Common",
		magicItemTable: ["Arcana", "Implements"],
		description: "I can dissolve this flavorless, gelatinous bead on my tongue. It provides as much nourishment as 1 day of Rations. This item can only be used once.",
		descriptionFull: "This flavorless, gelatinous bead dissolves on your tongue and provides as much nourishment as 1 day of Rations.",
	},
	"belt of dwarvenkind": {
		name: "Belt of Dwarvenkind",
		source: [["SRD24", 213], ["DMG24", 235]],
		type: "Wondrous Item",
		rarity: "Rare",
		magicItemTable: "Implements",
		attunement: true,
		description: "While wearing this belt, my Con increases by 2 (to a max of 20), I get Adv on Persuasion checks to interact with dwarves, Adv on saves vs Poisoned, Resistance to Poison damage, Darkvision with a range of 60 ft, and know Dwarvish. Each day at dawn, there is a 50% chance I grow a full beard or my beard grows thicker.",
		descriptionFull: [
			"While wearing this belt, you gain the following benefits:",
			" \u2022 **Dwarvish**. You know Dwarvish.",
			" \u2022 **Friend of Dwarvenkind**. You have Advantage on Charisma (Persuasion) checks made to interact with dwarves and duergar.",
			" \u2022 **Toughness**. Your Constitution increases by 2, to a maximum of 20.",
			"In addition, while attuned to the belt, you have a 50 percent chance each day at dawn of growing a full beard if you can grow one, or a thicker beard if you already have one.",
			"If you aren't a dwarf or duergar, you gain the following additional benefits while wearing the belt:",
			" \u2022 **Darkvision**. You have Darkvision with a range of 60 feet.",
			" \u2022 **Resilience**. You have Resistance to Poison damage. You also have Advantage on saving throws you make to avoid or end the Poisoned condition.",
		],
		languageProfs: ["Dwarvish"],
		vision: [["Darkvision", 60]],
		savetxt: { adv_vs: ["Poisoned"] },
		dmgres: ["Poison"],
		scores: [0, 0, 2, 0, 0, 0],
	},
	"belt of giant strength": {
		name: "Belt of Giant Strength",
		source: [["SRD24", 213], ["DMG24", 236]],
		type: "Wondrous Item",
		magicItemTable: "Armaments",
		attunement: true,
		description: "Select one of the choices.",
		descriptionFull: [
			"While wearing this belt, your Strength changes to a score granted by the belt. The type of giant determines the score (see the table below). The item has no effect on you if your Strength without the belt is equal to or greater than the belt's score.",
			[
				["Giant Type  ", "Str", "Rarity"],
				["Hill Giant  ", "21", "Rare"],
				["Frost/Stone Giant", "23", "Very Rare"],
				["Fire Giant  ", "25", "Very Rare"],
				["Cloud Giant ", "27", "Legendary"],
				["Storm Giant ", "29", "Legendary"],
			],
		],
		allowDuplicates: true,
		choices: ["Hill Giant (Str 21, Rare)", "Frost Giant (Str 23, Very Rare)", "Stone Giant (Str 23, Very Rare)", "Fire Giant (Str 25, Very Rare)", "Cloud Giant (Str 27, Legendary)", "Storm Giant (Str 29, Legendary)"],
		"hill giant (str 21, rare)": {
			name: "Belt of Hill Giant Strength",
			sortname: "Belt of Giant Strength, Hill (Str 21)",
			rarity: "Rare",
			description: "My Strength score is 21 while I'm wearing this belt, provided that my Strength is not already 21 or higher.",
			scoresOverride: [21, 0, 0, 0, 0, 0],
		},
		"frost giant (str 23, very rare)": {
			name: "Belt of Frost Giant Strength",
			sortname: "Belt of Giant Strength, Frost (Str 23)",
			rarity: "Very Rare",
			description: "My Strength score is 23 while I'm wearing this belt, provided that my Strength is not already 23 or higher.",
			scoresOverride: [23, 0, 0, 0, 0, 0],
		},
		"stone giant (str 23, very rare)": {
			name: "Belt of Stone Giant Strength",
			sortname: "Belt of Giant Strength, Stone (Str 23)",
			rarity: "Very Rare",
			description: "My Strength score is 23 while I'm wearing this belt, provided that my Strength is not already 23 or higher.",
			scoresOverride: [23, 0, 0, 0, 0, 0],
		},
		"fire giant (str 25, very rare)": {
			name: "Belt of Fire Giant Strength",
			sortname: "Belt of Giant Strength, Fire (Str 25)",
			rarity: "Very Rare",
			description: "My Strength score is 25 while I'm wearing this belt, provided that my Strength is not already 25 or higher.",
			scoresOverride: [25, 0, 0, 0, 0, 0],
		},
		"cloud giant (str 27, legendary)": {
			name: "Belt of Cloud Giant Strength",
			sortname: "Belt of Giant Strength, Cloud (Str 27)",
			rarity: "Legendary",
			description: "My Strength score is 27 while I'm wearing this belt, provided that my Strength is not already 27 or higher.",
			scoresOverride: [27, 0, 0, 0, 0, 0],
		},
		"storm giant (str 29, legendary)": {
			name: "Belt of Storm Giant Strength",
			sortname: "Belt of Giant Strength, Storm (Str 29)",
			rarity: "Legendary",
			description: "My Strength score is 29 while I'm wearing this belt, provided that my Strength is not already 29 or higher.",
			scoresOverride: [29, 0, 0, 0, 0, 0],
		},
	},
	"berserker axe": {
		name: "Berserker Axe",
		nameTest: /berserker.+(axe|\uFEFF)/i,
		source: [["SRD24", 213], ["DMG24", 236]],
		type: "Weapon (Battleaxe, Greataxe, or Halberd)",
		rarity: "Rare",
		magicItemTable: "Armaments",
		attunement: true,
		cursed: true,
		description: "This axe gives +1 to hit and damage, +1 HP per level, and is cursed. I can't part with it " + (typePF ? "\x26" : "and") + " have Disadv using other weapons. Whenever I'm damaged by a creature, I must make a DC 15 Wis save or go berserk, using my turn to move towards and attack the closest creature until I can't see or hear any within 60 ft.",
		descriptionFull: [
			"You gain a +1 bonus to attack rolls and damage rolls made with this magic weapon. In addition, while you are attuned to this weapon, your Hit Point maximum increases by 1 for each level you have attained.",
			"***Curse***. This weapon is cursed, and becoming attuned to it extends the curse to you. As long as you remain cursed, you are unwilling to part with the weapon, keeping it within reach at all times. You also have Disadvantage on attack rolls with weapons other than this one.",
			"Whenever another creature damages you while the weapon is in your possession, you must succeed on a DC 15 Wisdom saving throw or go berserk. This berserk state ends when you start your turn and there are no creatures within 60 feet of you that you can see or hear.",
			"While berserk, you regard the creature nearest to you that you can see or hear as your enemy. If there are multiple possible creatures, choose one at random. On each of your turns, you must move as close to the creature as possible and take the Attack action, targeting the creature. If you're unable to get close enough to the creature to attack it with the weapon, your turn ends after you've used up all your available movement. If the creature dies or can no longer be seen or heard by you, the next nearest creature that you can see or hear becomes your new target.",
		],
		chooseGear: {
			type: "weapon",
			prefixOrSuffix: ["between", "Berserker", "\uFEFF"],
			itemName1stPage: ["suffix", "Berserker"],
			descriptionChange: ["replace", "axe"],
			excludeCheck: function (inObjKey, inObj, v) {
				return !v.isMeleeWeapon || !/battleaxe|greataxe|halberd/i.test(v.baseWeaponName);
			},
		},
		calcChanges: {
			atkAdd: [
				function (fields, v) {
					if (!v.theWea.isMagicWeapon && v.isMeleeWeapon && /battleaxe|greataxe|halberd/i.test(v.baseWeaponName) && /berserker/i.test(v.WeaponTextName)) {
						v.theWea.isMagicWeapon = true;
						fields.Description += (fields.Description ? "; " : "") + "Cursed";
					}
				},
				'If I include the word "Berserker" in the name of a Battleaxe, Greataxe, or Halberd, it will be treated as the magic weapon Berserker Axe. It adds +1 to hit and damage, but also bears a curse.',
			],
			atkCalc: [
				function (fields, v, output) {
					if (v.isMeleeWeapon && /battleaxe|greataxe|halberd/i.test(v.baseWeaponName) && /berserker/i.test(v.WeaponTextName)) {
						output.magic = v.thisWeapon[1] + 1;
					}
				}, "",
			],
			hp: function (totalHD) { return [totalHD]; },
		},
	},
	"boots of elvenkind": {
		name: "Boots of Elvenkind",
		source: [["SRD24", 213], ["DMG24", 239]],
		type: "Wondrous Item",
		rarity: "Uncommon",
		magicItemTable: "Implements",
		description: "While I wear these boots, my steps make no sound, regardless of the surface I am moving across. I also have Advantage on Dexterity (Stealth) checks.",
		descriptionFull: "While you wear these boots, your steps make no sound, regardless of the surface you are moving across. You also have Advantage on Dexterity (Stealth) checks.",
		advantages: [["Stealth", true]],
	},
	"boots of levitation": {
		name: "Boots of Levitation",
		source: [["SRD24", 213], ["DMG24", 239]],
		type: "Wondrous Item",
		rarity: "Rare",
		magicItemTable: "Implements",
		attunement: true,
		description: "While I wear these boots, I can cast *Levitate* on myself.",
		descriptionFull: "While you wear these boots, you can cast *Levitate* on yourself.",
		spellcastingBonus: [{
			name: "Self Only",
			spells: ["levitate"],
			selection: ["levitate"],
			firstCol: "atwill",
		}],
		spellChanges: {
			"levitate": {
				range: "Self",
				save: "",
				description: "I rise vertically, up to 20 ft; I can move up or down 20 ft as part of my move during my turn",
				changes: "The spell can only affect the wearer.",
			},
		},
	},
	"boots of speed": {
		name: "Boots of Speed",
		source: [["SRD24", 214], ["DMG24", 240]],
		type: "Wondrous Item",
		rarity: "Rare",
		magicItemTable: "Implements",
		attunement: true,
		description: "As a Bonus Action while wearing these boots, I can click my heels together to double my Speed and cause Opportunity Attacks against me to have Disadvantage. If I click my heels " + (typePF ? "" : "together ") + "again, the effect ends. Once the boots have been used for a total of 10 minutes, they cease to function until I finish a Long Rest.",
		descriptionFull: [
			"While you wear these boots, you can take a Bonus Action to click the boots' heels together. If you do, the boots double your Speed, and any creature that makes an Opportunity Attack against you has Disadvantage on the attack roll. If you click your heels together again, you end the effect.",
			"When you've used the boots' property for a total of 10 minutes, the magic ceases to function for you until you finish a Long Rest.",
		],
		action: [["bonus action", " (start/stop)"]],
		usages: 10,
		recovery: "Long Rest",
		additional: "minutes",
	},
	"boots of striding and springing": {
		name: "Boots of Striding and Springing",
		source: [["SRD24", 214], ["DMG24", 240]],
		type: "Wondrous Item",
		rarity: "Uncommon",
		magicItemTable: "Implements",
		attunement: true,
		description: "While I wear these boots, my Speed becomes 30 ft unless my Speed is higher, and my Speed isn't reduced by me carrying weight in excess of my carrying capacity or wearing Heavy Armor. Once on each of my turns, I can jump up to 30 ft by spending only 10 ft of movement.",
		descriptionFull: [
			"While you wear these boots, your Speed becomes 30 feet unless your Speed is higher, and your Speed isn't reduced by you carrying weight in excess of your carrying capacity or wearing Heavy Armor.",
			"Once on each of your turns, you can jump up to 30 feet by spending only 10 feet of movement.",
		],
		speed: {
			walk: { spd: "fixed 30", enc: "fixed 30" },
		},
	},
	"boots of the winterlands": {
		name: "Boots of the Winterlands",
		source: [["SRD24", 214], ["DMG24", 240]],
		type: "Wondrous Item",
		rarity: "Uncommon",
		magicItemTable: "Implements",
		attunement: true,
		description: "These furred boots are snug and feel warm. While wearing them, I gain the following benefits. ***Cold Resistance***. I have Resistance to Cold damage and can tolerate temperatures of 0 \xB0F or lower without additional protection. ***Winter Strider***. I ignore Difficult Terrain created by ice or snow.",
		descriptionFull: [
			"These furred boots are snug and feel warm. While wearing them, you gain the following benefits.",
			"***Cold Resistance***. You have Resistance to Cold damage and can tolerate temperatures of 0 degrees Fahrenheit or lower without any additional protection.",
			"***Winter Strider***. You ignore Difficult Terrain created by ice or snow.",
		],
		dmgres: ["Cold"],
	},
	"bowl of commanding water elementals": {
		name: "Bowl of Commanding Water Elementals",
		source: [["SRD24", 214], ["DMG24", 240]],
		type: "Wondrous Item",
		rarity: "Rare",
		magicItemTable: ["Arcana", "Relics"],
		description: "As a Magic action once per dawn while this bowl is filled with 3 gallons of water and I am within 5 ft, I can summon a **Water Elemental** as close to it as possible. The elemental takes its turn after me on my Initiative and obeys my commands. It vanishes after 1 hour, when it dies, or when I dismiss it as a Bonus Action.",
		descriptionFull: [
			"While this bowl is filled with water and you are within 5 feet of it, you can take a Magic action to summon a Water Elemental. The elemental appears in an unoccupied space as close to the bowl as possible, understands your languages, obeys your commands, and takes its turn immediately after you on your Initiative count. The elemental disappears after 1 hour, when it dies, or when you dismiss it as a Bonus Action. The bowl can't be used this way again until the next dawn.",
			"The bowl is about 1 foot in diameter and half as deep. It holds about 3 gallons.",
		],
		weight: 3,
		usages: 1,
		recovery: "Dawn",
		creaturesAdd: [["Water Elemental", true, function (AddRemove, prefix) {
			if (!AddRemove) return;
			Value(prefix + "Comp.Type", "Summon");
			Value(prefix + "Comp.Desc.Name", "Bowl of Commanding Water Elementals");
			var featuresNew = What(prefix + "Comp.Use.Features")
				.replace(/(.*languages.*)\./i, "$1, understands the languages of its summoner.");
			Value(prefix + "Comp.Use.Features", featuresNew);

			var noteAddition = "##\u25C6 Summoned##. The elemental obeys the commands of its summoner and takes its turn immediately after them on their Initiative count. The elemental disappears after 1 hour, when it dies, or when its summoner dismisses it as a Bonus Action.";
			AddString(prefix + "Cnote.Left", noteAddition, true);
		}]],
	},
	"bracers of archery": {
		name: "Bracers of Archery",
		source: [["SRD24", 214], ["DMG24", 240]],
		type: "Wondrous Item",
		rarity: "Uncommon",
		magicItemTable: "Armaments",
		attunement: true,
		description: "While wearing these bracers, I have proficiency with the Longbow and Shortbow, and I gain a +2 bonus to damage rolls made with such weapons.",
		descriptionFull: "While wearing these bracers, you have proficiency with the Longbow and Shortbow, and you gain a +2 bonus to damage rolls made with such weapons.",
		weaponProfs: [false, false, ["longbow", "shortbow"]],
		calcChanges: {
			atkCalc: [
				function (fields, v, output) {
					if (v.baseWeaponName === "shortbow" || v.baseWeaponName === "longbow") {
						output.extraDmg += 2;
					};
				},
				"I add +2 to the damage of attacks I make with Shortbows and Longbows.",
			],
		},
	},
	"bracers of defense": {
		name: "Bracers of Defense",
		source: [["SRD24", 214], ["DMG24", 241]],
		type: "Wondrous Item",
		rarity: "Rare",
		magicItemTable: "Arcana",
		attunement: true,
		description: "While wearing these bracers, I gain a +2 bonus to Armor Class if I am wearing no armor and using no Shield.",
		descriptionFull: "While wearing these bracers, you gain a +2 bonus to Armor Class if you are wearing no armor and using no Shield.",
		extraAC: [{
			mod: 2,
			magic: true,
			text: "I gain a +2 bonus to Armor Class if I am wearing no armor and using no Shield.",
			stopeval: function (v) {
				return v.wearingArmor || v.usingShield;
			},
		}],
	},
	"brazier of commanding fire elementals": {
		name: "Brazier of Commanding Fire Elementals",
		source: [["SRD24", 214], ["DMG24", 241]],
		type: "Wondrous Item",
		rarity: "Rare",
		magicItemTable: ["Arcana", "Relics"],
		description: "As a Magic action once per dawn while within 5 ft of this brazier, I can summon a **Fire Elemental** as close to it as possible. The elemental understands my languages, obeys my commands, and takes its turn after me on my Initiative. It disappears after 1 hour, when it dies, or when I dismiss it as a Bonus Action.",
		descriptionFull: "While you are within 5 feet of this brazier, you can take a Magic action to summon a Fire Elemental. The elemental appears in an unoccupied space as close to the brazier as possible, understands your languages, obeys your commands, and takes its turn immediately after you on your Initiative count. The elemental disappears after 1 hour, when it dies, or when you dismiss it as a Bonus Action. The brazier can't be used this way again until the next dawn.",
		action: [
			["action", " (summon)"],
			["bonus action", " (dismiss)"],
		],
		weight: 5,
		usages: 1,
		recovery: "Dawn",
		creaturesAdd: [["Fire Elemental", true, function (AddRemove, prefix) {
			if (!AddRemove) return;
			Value(prefix + "Comp.Type", "Summon");
			Value(prefix + "Comp.Desc.Name", "Brazier of Commanding Fire Elementals");
			var featuresNew = What(prefix + "Comp.Use.Features")
				.replace(/(.*languages.*)\./i, "$1, understands the languages of its summoner.");
			Value(prefix + "Comp.Use.Features", featuresNew);

			var noteAddition = "##\u25C6 Summoned##. The elemental obeys the commands of its summoner and takes its turn immediately after them on their Initiative count. The elemental disappears after 1 hour, when it dies, or when its summoner dismisses it as a Bonus Action.";
			AddString(prefix + "Cnote.Left", noteAddition, true);
		}]],
	},
	"brooch of shielding": {
		name: "Brooch of Shielding",
		source: [["SRD24", 214], ["DMG24", 241]],
		type: "Wondrous Item",
		rarity: "Uncommon",
		magicItemTable: "Arcana",
		attunement: true,
		description: "While wearing this brooch, I have Resistance to Force damage, and have Immunity to damage from the *Magic Missile* spell.",
		descriptionFull: "While wearing this brooch, you have Resistance to Force damage, and you have Immunity to damage from the *Magic Missile* spell.",
		dmgres: ["Force"],
		savetxt: { immune: ["*Magic Missile* spell"] },
	},
	"broom of flying": {
		name: "Broom of Flying",
		source: [["SRD24", 214], ["DMG24", 241]],
		type: "Wondrous Item",
		rarity: "Uncommon",
		magicItemTable: ["Arcana", "Implements"],
		attunement: true,
		description: "As a Magic action, I can make this broom hover and ride it. It has a 50 ft Fly Speed and can carry 400 lb. Its Fly Speed is 30 ft while carrying > 200 lb. The broom stops hovering when I am not on it. As a Magic action, I can send the broom to a place I know in 1 mile and can recall it with a command word as a Magic action.",
		descriptionLong: [
			"As a Magic action while standing astride this broom, I can make it hover beneath me and ride it. It has a Fly Speed of 50 ft and can carry up to 400 lb, but its Fly Speed becomes 30 ft while carrying over 200 lb. The broom stops hovering when I land or am no longer riding it.",
			"As a Magic action, I can send the broom to travel alone to a destination within 1 mile if I name the location and am familiar with it. As a Magic action, I can speak a command word to have the broom come back to me if it is still within 1 mile of me.",
		],
		descriptionFull: [
			"This wooden broom functions like a mundane broom until you stand astride it and take a Magic action to make it hover beneath you, at which time it can be ridden in the air. It has a Fly Speed of 50 feet. It can carry up to 400 pounds, but its Fly Speed becomes 30 feet while carrying over 200 pounds. The broom stops hovering when you land or when you're no longer riding it.",
			"As a Magic action, you can send the broom to travel alone to a destination within 1 mile of you if you name the location and are familiar with it. The broom comes back to you when you take a Magic action and use a command word if the broom is still within 1 mile of you.",
		],
		weight: 3,
	},
	"candle of invocation": {
		name: "Candle of Invocation",
		source: [["SRD24", 214], ["DMG24", 241]],
		type: "Wondrous Item",
		rarity: "Very Rare",
		magicItemTable: "Relics",
		attunement: true,
		description: "As a Magic action, I can light this candle that burns for 4 hours. It sheds 30-ft radius Dim Light. While in the light, I have Adv on D20 Tests and Clerics/Druids in it can cast prepared level 1 spells without spell slots. The candle can be snuffed out for later use. The first time I light it, I can destroy it to cast *Gate*. See Notes.",
		descriptionLong: "As a Magic action, I can light this candle. While lit it sheds 30-ft radius Dim Light. While in the light, I have Advantage on D20 Tests. A Cleric or Druid in the light can cast level 1 spells that they have prepared without expending spell slots. The candle can be snuffed out for later use and burns for a total of 4 hours in 1 minute increments. Alternatively, the first time that I light the candle I can cast *Gate* with it, but doing so destroys the candle. The portal created by the spell links to a particular Outer Plane chosen by the DM or determined by rolling on the table on the Notes Page.",
		descriptionFull: [
			"This candle's magic is activated when the candle is lit, which requires a Magic action. After burning for 4 hours, the candle is destroyed. You can snuff it out early for use at a later time. Deduct the time it burned in increments of 1 minute from its total burn time.",
			"While lit, the candle sheds Dim Light in a 30-foot radius. While you are within that light, you have Advantage on D20 Tests. In addition, a Cleric or Druid in the light can cast level 1 spells they have prepared without expending spell slots.",
			"Alternatively, when you light the candle for the first time, you can cast *Gate* with it. Doing so destroys the candle. The portal created by the spell links to a particular Outer Plane chosen by the DM or determined by rolling on the following table.",
			[
				["1d100", "Outer Plane"],
				["01\u201305", "Abyss"],
				["06\u201310", "Acheron"],
				["11\u201317", "Arborea"],
				["18\u201325", "Arcadia"],
				["26\u201333", "Beastlands"],
				["34\u201341", "Bytopia"],
				["42\u201346", "Carceri"],
				["47\u201354", "Elysium"],
				["55\u201359", "Gehenna"],
				["60\u201364", "Hades"],
				["65\u201369", "Limbo"],
				["70\u201377", "Mechanus"],
				["78\u201385", "Mount Celestia"],
				["86\u201390", "Nine Hells"],
				["91\u201395", "Pandemonium"],
				["96\u201300", "Ysgard"],
			],
		],
		usages: "240 min",
		recovery: "\u2013",
		spellcastingBonus: [{
			name: "1\xD7. Candle is destroyed",
			spells: ["gate"],
			selection: ["gate"],
			firstCol: "1\xD7",
		}],
		action: [["action", ""]],
		toNotesPage: [{
			name: "Candle of Invocation",
			useDescriptionFull: true,
		}],
	},
	"cape of the mountebank": {
		name: "Cape of the Mountebank",
		source: [["SRD24", 215], ["DMG24", 242]],
		type: "Wondrous Item",
		rarity: "Rare",
		magicItemTable: "Arcana",
		description: "While wearing this cape that smells faintly of brimstone, I can use it to cast *Dimension Door*. This property can't be used again until the next dawn. When I teleport with that spell, I leave behind a cloud of smoke. The space I left is Lightly Obscured by that smoke until the end of my next turn.",
		descriptionFull: [
			"This cape smells faintly of brimstone. While wearing it, you can use it to cast *Dimension Door* as a Magic action. This property can't be used again until the next dawn.",
			"When you teleport with that spell, you leave behind a cloud of smoke. The space you left is Lightly Obscured by that smoke until the end of your next turn.",
		],
		usages: 1,
		recovery: "Dawn",
		spellcastingBonus: [{
			name: "Once per dawn",
			spells: ["dimension door"],
			selection: ["dimension door"],
			firstCol: "onceday",
		}],
	},
	"carpet of flying": (function () {
		var obj = {
			name: "Carpet of Flying",
			source: [["SRD24", 215], ["DMG24", 242]],
			type: "Wondrous Item",
			rarity: "Very Rare",
			magicItemTable: ["Arcana", "Implements"],
			description: "Select one of the sizes.",
			descriptionFull: [
				"You can make this carpet hover and fly by taking a Magic action and using the carpet's command word. It moves according to your directions if you are within 30 feet of it.",
				"Four sizes of *Carpet of Flying* exist. The DM chooses the size of a given carpet or determines it randomly by rolling on the following table. A carpet can carry up to twice the weight shown on the table, but its Fly Speed is halved if it carries more than its normal capacity.",
				[
					["1d100", "Size    ", "", "Capacity    ", "Fly Speed"],
					["01-20", "3 ft. \xD7 5 ft.", "200 lb.", "", "80 feet"],
					["21-55", "4 ft. \xD7 6 ft.", "400 lb.", "", "60 feet"],
					["56-80", "5 ft. \xD7 7 ft. ", "600 lb.", "", "40 feet"],
					["81-00", "6 ft. \xD7 9 ft.", "800 lb.", "", "30 feet"],
				],
			],
			action: [["action", ""]],
			allowDuplicates: true,
			choices: [],
		};

		[
			{ width: 3, length: 5, speed: 80, capacity: 200 },
			{ width: 4, length: 6, speed: 60, capacity: 400 },
			{ width: 5, length: 7, speed: 40, capacity: 600 },
			{ width: 6, length: 9, speed: 30, capacity: 800 },
		].forEach(function (details) {
			var width = details.width;
			var length = details.length;
			var speed = details.speed;
			var capacity = details.capacity;
			var maxCapacity = (capacity * 2).replace(/(\d)(\d{3})/, "$1,$2");

			var choiceName = width + " ft \xD7 " + length + " ft (Fly " + speed + " ft, " + capacity + " lb)";
			obj.choices.push(choiceName);

			obj[choiceName.toLowerCase()] = {
				name: "Carpet of Flying, " + width + " ft \xD7 " + length + " ft",
				description: "As a Magic action, I can speak the carpet's command word to make it hover and fly. It moves according to my directions if I am within 30 ft of it. The carpet has a Fly Speed of " + speed + " ft and can carry up to " + maxCapacity + " lb, but its Fly Speed is reduced to " + (speed / 2) + " ft if it's carrying more than " + capacity + " lb.",
			}
		})
		return obj;
	})(),
	"censer of controlling air elementals": {
		name: "Censer of Controlling Air Elementals",
		source: [["SRD24", 215], ["DMG24", 243]],
		type: "Wondrous Item",
		rarity: "Rare",
		magicItemTable: ["Arcana", "Relics"],
		description: "As a Magic action once per dawn, I can gently swing this censer to summon an **Air Elemental** as close to the censer as possible. The elemental obeys my commands, understands my languages, and takes its turn after me on my Initiative. It disappears after 1 hour, when it dies, or when I dismiss it as a Bonus Action.",
		descriptionFull: "While gently swinging this censer, you can take a Magic action to summon an Air Elemental. The elemental appears in an unoccupied space as close to the censer as possible, understands your languages, obeys your commands, and takes its turn immediately after you on your Initiative count. The elemental disappears after 1 hour, when it dies, or when you dismiss it as a Bonus Action. The censer can't be used this way again until the next dawn.",
		action: [
			["action", " (summon)"],
			["bonus action", " (dismiss)"],
		],
		weight: 1,
		usages: 1,
		recovery: "Dawn",
		creaturesAdd: [["Air Elemental", true, function (AddRemove, prefix) {
			if (!AddRemove) return;
			Value(prefix + "Comp.Type", "Summon");
			Value(prefix + "Comp.Desc.Name", "Censer of Controlling Air Elementals");
			var featuresNew = What(prefix + "Comp.Use.Features")
				.replace(/(.*languages.*)\./i, "$1, understands the languages of its summoner.");
			Value(prefix + "Comp.Use.Features", featuresNew);

			var noteAddition = "##\u25C6 Summoned##. The elemental obeys the commands of its summoner and takes its turn immediately after them on their Initiative count. The elemental disappears after 1 hour, when it dies, or when its summoner dismisses it as a Bonus Action.";
			AddString(prefix + "Cnote.Left", noteAddition, true);
		}]],
	},
	"chime of opening": {
		name: "Chime of Opening",
		source: [["SRD24", 215], ["DMG24", 244]],
		type: "Wondrous Item",
		rarity: "Rare",
		magicItemTable: ["Arcana", "Implements"],
		description: "As a Magic action, I can strike this 1-ft long hollow metal tube to cast *Knock*. The spell's normal sound is replace by the clear, ringing tone of the chime, which is audible out to 300 feet. The chime can be used ten times. After the tenth time it cracks and becomes useless.",
		descriptionFull: "This hollow metal tube measures about 1 foot long and weighs 1 pound. As a Magic action, you can strike the chime to cast *Knock*. The spell's customary knocking sound is replaced by the clear, ringing tone of the chime, which is audible out to 300 feet. The chime can be used 10 times. After the tenth time, it cracks and becomes useless.",
		weight: 1,
		usages: 10,
		recovery: "\u2013",
		spellFirstColTitle: "Ch",
		spellcastingBonus: [{
			name: "Chime of Opening",
			spells: ["knock"],
			selection: ["knock"],
			firstCol: 1,
		}],
	},
	"circlet of blasting": {
		name: "Circlet of Blasting",
		source: [["SRD24", 215], ["DMG24", 244]],
		type: "Wondrous Item",
		rarity: "Uncommon",
		magicItemTable: "Arcana",
		description: "While wearing this circlet, I can cast *Scorching Ray* with it (+5 to hit). The circlet can't cast this spell again until the next dawn.",
		descriptionFull: "While wearing this circlet, you can cast *Scorching Ray* with it (+5 to hit). The circlet can't cast this spell again until the next dawn.",
		fixedDC: 13,
		spellcastingBonus: [{
			name: "Once per dawn",
			spells: ["scorching ray"],
			selection: ["scorching ray"],
			firstCol: "onceday",
		}],
	},
	"cloak of arachnida": {
		name: "Cloak of Arachnida",
		source: [["SRD24", 215], ["DMG24", 244]],
		type: "Wondrous Item",
		rarity: "Very Rare",
		magicItemTable: "Arcana",
		attunement: true,
		description: "This cloak grants me Resistance to Poison damage and a Climb Speed equal to my Speed, even across vertical surfaces and along ceilings, while keeping my hands free. I cannot be caught in webs and can move through webs as if they were Difficult Terrain. I can cast *Web* (DC 13) with twice its area once per dawn.",
		descriptionFull: [
			"This fine garment is made of black silk interwoven with faint, silvery threads. While wearing it, you gain the following benefits.",
			"***Poison Resistance***. You have Resistance to Poison damage.",
			"***Spider Climb***. You have a Climb Speed equal to your Speed and can move up, down, and across vertical surfaces and along ceilings, while leaving your hands free.",
			"***Spider Walk***. You can't be caught in webs of any sort and can move through webs as if they were Difficult Terrain.",
			"***Web***. You can cast *Web* (save DC 13). The web created by the spell fills twice its normal area. Once used, this property can't be used again until the next dawn.",
		],
		dmgres: ["Poison"],
		fixedDC: 13,
		speed: {
			climb: { spd: "walk", enc: "walk" },
		},
		spellcastingBonus: [{
			name: "Once per dawn",
			spells: ["web"],
			selection: ["web"],
			firstCol: "onceday",
		}],
		spellChanges: {
			"web": {
				description: "2\xD7 20-ft cu flammable web; enter/start save or Restrained; dif. ter.; lightly obsc; Str(Ath.) vs DC to free",
				changes: "The web created by the *Cloak of Arachnida* fills twice its normal area. Once used, the cloak can't be used to cast *Web* again until the next dawn.",
			},
		},
		savetxt: { immune: ["webs"] },
	},
	"cloak of displacement": {
		name: "Cloak of Displacement",
		source: [["SRD24", 215], ["DMG24", 244]],
		type: "Wondrous Item",
		rarity: "Rare",
		magicItemTable: "Arcana",
		attunement: true,
		description: "While I wear this cloak, creatures have Disadvantage on attack rolls against me as I appear to be standing near my actual location. If I take damage, this property ceases to function until the start of my next turn. The property is suppressed while my Speed is 0.",
		descriptionFull: "While you wear this cloak, it magically projects an illusion that makes you appear to be standing in a place near your actual location, causing any creature to have Disadvantage on attack rolls against you. If you take damage, the property ceases to function until the start of your next turn. This property is suppressed while your Speed is 0.",
	},
	"cloak of elvenkind": {
		name: "Cloak of Elvenkind",
		source: [["SRD24", 215], ["DMG24", 244]],
		type: "Wondrous Item",
		rarity: "Uncommon",
		magicItemTable: "Implements",
		attunement: true,
		description: "While I wear this cloak, Wisdom (Perception) checks made to perceive me have Disadvantage, and I have Advantage on Dexterity (Stealth) checks.",
		descriptionFull: "While you wear this cloak, Wisdom (Perception) checks made to perceive you have Disadvantage, and you have Advantage on Dexterity (Stealth) checks.",
		advantages: [["Stealth", true]],
	},
	"cloak of invisibility": {
		name: "Cloak of Invisibility",
		source: [["SRD24", 215], ["DMG24", 244]],
		type: "Wondrous Item",
		rarity: "Legendary",
		magicItemTable: "Arcana",
		attunement: true,
		description: "This cloak has 3 charges and regains 1d3 expended charges daily at dawn. As a Magic action while wearing the cloak, I can pull the cloak's hood over my head and expend 1 charge to turn Invisible for 1 hour. This effect ends early if I pull the hood down (no action) or cease wearing the cloak.",
		descriptionFull: "This cloak has 3 charges and regains 1d3 expended charges daily at dawn. While wearing the cloak, you can take a Magic action to pull its hood over your head and expend 1 charge to give yourself the Invisible condition for 1 hour. The effect ends early if you pull the hood down (no action required) or cease wearing the cloak.",
		usages: 3,
		recovery: "Dawn",
		additional: "regains 1d3",
		action: [["action", ""]],
	},
	"cloak of protection": {
		name: "Cloak of Protection",
		source: [["SRD24", 216], ["DMG24", 245]],
		type: "Wondrous Item",
		rarity: "Uncommon",
		magicItemTable: ["Arcana", "Implements"],
		attunement: true,
		description: "I gain a +1 bonus to Armor Class and saving throws while I wear this cloak.",
		descriptionFull: "You gain a +1 bonus to Armor Class and saving throws while you wear this cloak.",
		extraAC: [{
			name: "Cloak of Protection",
			mod: 1,
			magic: true,
			text: "While I wear the Cloak of Protection, I gain a +1 bonus to AC.",
		}],
		addMod: [{
			type: "save",
			field: "all",
			mod: 1,
			text: "While I wear the Cloak of Protection, I gain a +1 bonus to all my saving throws.",
		}],
	},
	"cloak of the bat": {
		name: "Cloak of the Bat",
		source: [["SRD24", 216], ["DMG24", 245]],
		type: "Wondrous Item",
		rarity: "Rare",
		magicItemTable: "Arcana",
		attunement: true,
		description: "This cloak grants me Adv on Stealth checks. In Dim Light or Darkness, I can Fly at 40 ft speed by gripping the cloak's edges with both hands. Once per dawn, while in Dim Light or Darkness I can cast *Polymorph* to transform myself into a **Bat**. While in this form I retain my Intelligence, Wisdom, and Charisma scores.",
		descriptionLong: "This cloak grants me Advantage on Stealth checks. In Dim Light or Darkness, I can Fly at 40 ft speed by gripping the cloak's edges with both hands. If I fail to grip the cloak's edges while flying in this way, or I am no longer in Dim Light or Darkness, I lose this Fly Speed. Once per dawn, while in Dim Light or Darkness I can cast *Polymorph* to transform myself into a **Bat**. While in this form I retain my Intelligence, Wisdom, and Charisma scores.",
		descriptionFull: [
			"While wearing this cloak, you have Advantage on Dexterity (Stealth) checks. In an area of Dim Light or Darkness, you can grip the edges of the cloak and use it to gain a Fly Speed of 40 feet. If you ever fail to grip the cloak's edges while flying in this way, or if you are no longer in Dim Light or Darkness, you lose this Fly Speed.",
			"While wearing the cloak in an area of Dim Light or Darkness, you can cast *Polymorph* on yourself, shape-shifting into a **Bat**. While in that form, you retain your Intelligence, Wisdom, and Charisma scores. The cloak can't be used this way again until the next dawn.",
		],
		advantages: [["Stealth", true]],
		spellcastingBonus: [{
			name: "Only self into bat",
			spells: ["polymorph"],
			selection: ["polymorph"],
			firstCol: "onceday",
		}],
		spellChanges: {
			"polymorph": {
				range: "Self",
				description: "Only cast in Dim light or Darkness; I transform into a bat, gaining its stats, but I keep my Int, Wis, Cha",
				changes: "The spell can only turn the wearer into a bat, but the wearer keeps its Intelligence, Wisdom, and Charisma scores.",
			},
		},
	},
	"cloak of the manta ray": {
		name: "Cloak of the Manta Ray",
		source: [["SRD24", 216], ["DMG24", 245]],
		type: "Wondrous Item",
		rarity: "Uncommon",
		magicItemTable: ["Arcana", "Implements"],
		attunement: true,
		description: "While wearing this cloak, I can breathe underwater, and have a Swim Speed of 60 ft.",
		descriptionFull: "While wearing this cloak, you can breathe underwater, and you have a Swim Speed of 60 feet.",
		speed: {
			swim: { spd: "fixed 60", enc: "fixed 50" },
		},
	},
	"crystal ball": {
		name: "Crystal Ball",
		source: [["SRD24", 216], ["DMG24", 245]],
		type: "Wondrous Item",
		rarity: "Very Rare",
		magicItemTable: "Arcana",
		attunement: true,
		description: "While touching this crystal orb, I can cast *Scrying* (save DC 17) with it.",
		descriptionFull: "While touching this crystal orb, you can cast *Scrying* (save DC 17) with it.",
		weight: 3,
		fixedDC: 17,
		spellcastingBonus: [{
			name: "DC 17",
			spells: ["scrying"],
			selection: ["scrying"],
			firstCol: "atwill",
		}],
	},
	"crystal ball of mind reading": {
		name: "Crystal Ball of Mind Reading",
		source: [["SRD24", 216], ["DMG24", 246]],
		type: "Wondrous Item",
		rarity: "Legendary",
		magicItemTable: "Arcana",
		attunement: true,
		description: "I can cast *Scrying* (DC 17) while touching this crystal orb. While *Scrying*, I can cast *Detect Thoughts* (DC 17) targeting creatures that I can see within 30 ft of the *Scrying* sensor. I don't need to concentrate on this *Detect Thoughts* spell, but it ends when the *Scrying* spell ends.",
		descriptionFull: "While touching this crystal orb, you can cast *Scrying* (save DC 17) with it. In addition, you can cast *Detect Thoughts* (save DC 17) targeting creatures you can see within 30 feet of the spell's sensor. You don't need to concentrate on this *Detect Thoughts* spell to maintain it during its duration, but it ends if the *Scrying* spell ends.",
		weight: 3,
		fixedDC: 17,
		spellcastingBonus: [{
			name: "DC 17",
			spells: ["scrying", "detect thoughts"],
			selection: ["scrying", "detect thoughts"],
			firstCol: "atwill",
			times: 2,
		}],
		spellChanges: {
			"detect thoughts": {
				duration: "1 min",
				changes: "*Detect Thoughts* only works through the spell sensor of the *Scrying* spell and doesn't require concentration. It ends when *Scrying* ends.",
			},
		},
	},
	"crystal ball of telepathy": {
		name: "Crystal Ball of Telepathy",
		source: [["SRD24", 216], ["DMG24", 246]],
		type: "Wondrous Item",
		rarity: "Legendary",
		magicItemTable: "Arcana",
		attunement: true,
		description: "I can cast *Scrying* (DC 17) while touching this crystal orb. While scrying, I can communicate telepathically with creatures within 30 ft of the spell's sensor and can cast *Suggestion* (DC 17) once per dawn on one of them. I don't need to concentrate on this *Suggestion*, but it ends when the *Scrying* ends.",
		descriptionFull: "While touching this crystal orb, you can cast *Scrying* (save DC 17) with it. In addition, you can communicate telepathically with creatures you can see within 30 feet of the spell's sensor. You can also cast *Suggestion* (save DC 17) through the sensor on one of those creatures. You don't need to concentrate on this *Suggestion* to maintain it during its duration, but it ends if *Scrying* ends. You can't cast *Suggestion* in this way again until the next dawn.",
		weight: 3,
		fixedDC: 17,
		spellcastingBonus: [{
			name: "DC 17",
			spells: ["scrying"],
			selection: ["scrying"],
			firstCol: "atwill",
		}, {
			name: "Once per dawn, DC 17",
			spells: ["suggestion"],
			selection: ["suggestion"],
			firstCol: "checkbox",
		}],
		limfeaname: "Suggestion through Crystal Ball",
		usages: 1,
		recovery: "Dawn",
		spellChanges: {
			"suggestion": {
				duration: "8 h (Scrying)",
				changes: "*Suggestion* only works through the spell sensor of the *Scrying* spell and doesn't require concentration. It ends when *Scrying* ends.",
			},
			"scrying": {
				description: "1 crea save or followed by sensor, or create sensor in familiar location; Telepathy 30 ft of sensor; see B",
				changes: "I can communicate telepathically with creatures within 30 ft of the scrying sensor.",
			},
		},
	},
	"crystal ball of true seeing": {
		name: "Crystal Ball of True Seeing",
		source: [["SRD24", 216], ["DMG24", 246]],
		type: "Wondrous Item",
		rarity: "Legendary",
		magicItemTable: "Arcana",
		attunement: true,
		description: "I can cast *Scrying* (DC 17) while touching this crystal orb. I have Truesight with a range of 120 feet centered on the spell's sensor.",
		descriptionFull: "While touching this crystal orb, you can cast *Scrying* (save DC 17) with it. In addition, you have Truesight with a range of 120 feet centered on the spell's sensor.",
		weight: 3,
		fixedDC: 17,
		spellcastingBonus: [{
			name: "DC 17",
			spells: ["scrying"],
			selection: ["scrying"],
			firstCol: "atwill",
		}],
		spellChanges: {
			"scrying": {
				description: "1 crea save or followed by sensor, or create sensor in known location; Truesight 120 ft of sensor; see B",
				changes: "I have Truesight out to 120 ft from the scrying sensor.",
			},
		},
	},
	"cube of force": {
		name: "Cube of Force",
		source: [["SRD24", 216], ["DMG24", 246]],
		type: "Wondrous Item",
		rarity: "Rare",
		magicItemTable: "Arcana",
		attunement: true,
		description: "This 1-inch cube has 10 charges and regains 1d6 at dawn. As a Magic action, I can press one of its distinctly marked sides and use charges to cast certain spells (DC 17). **1 charge** for *Mage Armor* or *Shield*. **3" + (typePF ? "" : " charges") + "** for *Leomund's Tiny Hut*. **4" + (typePF ? "" : " charges") + "** for *Mordenkainen's Private Sanctum* or *Otiluke's Resilient Sphere*. **5" + (typePF ? "" : " charges") + "** for *Wall of Force*.",
		descriptionFull: [
			"This cube is about an inch across. Each face has a distinct marking on it. You can press one of those faces, expend the number of charges required for it, and thereby cast the spell associated with it (save DC 17), as shown in the following table.",
			"The cube starts with 10 charges, and it regains 1d6 expended charges daily at dawn.",
			[
				["Spell", "Charge Cost"],
				["*Mage Armor*", "1"],
				["*Shield*", "1"],
				["*Leomund's Tiny Hut*", "3"],
				["*Mordenkainen's Private Sanctum*", "4"],
				["*Otiluke's Resilient Sphere*", "4"],
				["*Wall of Force*", "5"],
			],
		],
		action: [["action", ""]],
		fixedDC: 17,
		usages: 10,
		recovery: "Dawn",
		additional: "regains 1d6",
		spellFirstColTitle: "Ch",
		spellcastingBonus: [{
			name: "Cube of Force",
			spells: ["mage armor", "shield"],
			selection: ["mage armor", "shield"],
			times: 2,
			firstCol: 1,
		}, {
			name: "Cube of Force",
			spells: ["leomund's tiny hut"],
			selection: ["leomund's tiny hut"],
			firstCol: 3,
		}, {
			name: "Cube of Force",
			spells: ["mordenkainen's private sanctum", "otiluke's resilient sphere"],
			selection: ["mordenkainen's private sanctum", "otiluke's resilient sphere"],
			times: 2,
			firstCol: 4,
		}, {
			name: "Cube of Force",
			spells: ["wall of force"],
			selection: ["wall of force"],
			firstCol: 5,
		}],
	},
	"cubic gate": {
		name: "Cubic Gate",
		source: [["SRD24", 216], ["DMG24", 247]],
		type: "Wondrous Item",
		rarity: "Legendary",
		magicItemTable: "Arcana",
		description: "This 3-inch cube has 3 charges and regains 1d3 at dawn. Each of its six sides are keyed to a different plane of existence (one is the Material Plane). As a Magic action, I can expend 1 charge and press a side of the cube once to cast *Gate* or twice to cast *Plane Shift*. Both spells only link to the plane on the pressed side.",
		descriptionFull: [
			"This cube is 3 inches across and radiates palpable magical energy. The six sides of the cube are each keyed to a different plane of existence, one of which is the Material Plane. The other sides are linked to planes determined by the DM.",
			"The cube has 3 charges and regains 1d3 expended charges daily at dawn. As a Magic action, you can expend 1 of the cube's charges to cast one of the following spells using the cube.",
			"***Gate***. Pressing one side of the cube, you cast *Gate*, opening a portal to the plane of existence keyed to that side.",
			"***Plane Shift***. Pressing one side of the cube twice, you cast *Plane Shift*, transporting the targets to the plane of existence keyed to that side.",
		],
		usages: 3,
		recovery: "Dawn",
		additional: "regains 1d3",
		spellFirstColTitle: "Ch",
		spellcastingBonus: [{
			name: "1 charge",
			spells: ["gate", "plane shift"],
			selection: ["gate", "plane shift"],
			times: 2,
			firstCol: 1,
		}],
		spellChanges: {
			"plane shift": {
				description: "Me \x26 8 willing crea teleport to plane keyed to side: general location or known teleport circle; see book",
				changes: "Using the *Cubic Gate*, the spell only links to the plane on the side of the cube that was pressed.",
			},
			"gate": {
				description: "Create a 5-20 ft portal to exact spot on plane keyed to side; can transport named crea to me; see book",
				changes: "Using the *Cubic Gate*, the spell only links to the plane on the side of the cube that was pressed.",
			},
		},
	},
	"daern's instant fortress": {
		name: "Daern's Instant Fortress",
		nameAlt: "Instant Fortress",
		source: [["SRD24", 227], ["DMG24", 247]],
		type: "Wondrous Item",
		rarity: "Rare",
		magicItemTable: ["Arcana", "Armaments"],
		attunement: true,
		description: "As a Magic action, I can place this 1-inch statue on the ground and speak its command word, making it grow into a 20 ft \xD7 20 ft \xD7 30 ft adamantine tower with a door facing me, arrow slits on all sides, battlement atop, two floors, and a ladder on one wall ending at a trapdoor to the roof. *See Notes page.*",
		descriptionFull: [
			"As a Magic action, you can place this 1-inch adamantine statuette on the ground and, using a command word, cause it to grow rapidly into a square adamantine tower. Repeating the command word causes the tower to revert to statuette form, which works only if the tower is empty. Each creature in the area where the tower appears is pushed to an unoccupied space outside but next to the tower. Objects in the area that aren't being worn or carried are also pushed clear of the tower.",
			"The tower is 20 feet on a side and 30 feet high, with arrow slits on all sides and a battlement atop it. Its interior is divided into two floors, with a ladder, staircase, or ramp (your choice) connecting them. This ladder, staircase, or ramp ends at a trapdoor leading to the roof. When created, the tower has a single door at ground level on the side facing you. The door opens only at your command, which you can issue as a Bonus Action. It is immune to the *Knock* spell and similar magic.",
			"Magic prevents the tower from being tipped over. The roof, the door, and the walls each have AC 20; HP 100; Immunity to Bludgeoning, Piercing, and Slashing damage except that which is dealt by siege equipment; and Resistance to all other damage. Shrinking the tower back down to statuette form doesn't repair damage to the tower. Only a *Wish* spell can repair the tower (this use of the spell counts as replicating a spell of level 8 or lower). Each casting of *Wish* causes the tower to regain all its Hit Points.",
		],
		action: [["action", ""]],
		toNotesPage: [{
			name: "Daern's Instant Fortress",
			useDescriptionFull: function (str) {
				return str.replace("facing I", "facing me");
			},
		}],
	},
	"dagger of venom": {
		name: "Dagger of Venom",
		source: [["SRD24", 216], ["DMG24", 248]],
		type: "Weapon (Dagger)",
		rarity: "Rare",
		magicItemTable: "Armaments",
		description: "This magic dagger adds +1 to attack and damage rolls with it. As a Bonus Action once per dawn, I can magically coat its blade with poison which remains for 1 " + (typePF ? "min" : "minute") + " or until an attack with it hits a creature. That creature must make a DC 15 " + (typePF ? "Con" : "Constitution") + " save or take 2d10 Poison damage and have the Poisoned condition for 1 " + (typePF ? "min." : "minute."),
		descriptionFull: [
			"You gain a +1 bonus to attack rolls and damage rolls made with this magic weapon.",
			"You can take a Bonus Action to magically coat the blade with poison. The poison remains for 1 minute or until an attack using this weapon hits a creature. That creature must succeed on a DC 15 Constitution saving throw or take 2d10 Poison damage and have the Poisoned condition for 1 minute. The weapon can't be used this way again until the next dawn.",
		],
		weight: 1,
		limfeaname: "Dagger of Venom (coat)",
		usages: 1,
		recovery: "Dawn",
		action: [["bonus action", ""]],
		weaponOptions: [{
			baseWeapon: "dagger",
			regExpSearch: /^(?=.*dagger)(?=.*venom).*$/i,
			name: "Dagger of Venom",
			source: [["SRD24", 216], ["DMG24", 248]],
			description: "Finesse, Light, Thrown; If coated: DC 15 Con save or +2d10 Poison damage \x26 Poisoned 1 min",
			modifiers: [1, 1],
			selectNow: true,
		}],
	},
	"dancing sword": {
		name: "Dancing Sword",
		nameTest: /dancing.+(sword|\uFEFF)/i,
		source: [["SRD24", 217], ["DMG24", 248]],
		type: "Weapon (Greatsword, Longsword, Rapier, Scimitar, or Shortsword)",
		rarity: "Very Rare",
		magicItemTable: ["Arcana", "Armaments"],
		attunement: true,
		description: "As a Bonus Action, I can toss this magic weapon into the air. It hovers, flies up to 30 ft, and attacks a target of my choice within 5 ft of it (using my stats). As a Bonus Action while it hovers, I can have it fly 30 ft to a creature within 30 ft of me and attack. After its 4th attack, it flies 30 ft to try to return to my hand.",
		descriptionLong: "As a Bonus Action, I can toss this magic weapon into the air. It then begins to hover, flies up to 30 ft, and attacks a creature of my choice within 5 ft of it, using my attack roll and my ability modifier added to its damage. As a Bonus Action while it hovers, I can cause it to fly 30 ft to another spot within 30 ft of me and attack a creature within 5 ft of it. After the hovering weapon attacks for the fourth time, it flies back to my free hand. If I have no hand free, or its path to me is obstructed, it moves as close to me as it can and then falls to the ground. It ceases to hover if I grasp it or are more than 30 ft away from it.",
		descriptionFull: [
			"You can take a Bonus Action to toss this magic weapon into the air. When you do so, the weapon begins to hover, flies up to 30 feet, and attacks one creature of your choice within 5 feet of itself. The weapon uses your attack roll and adds your ability modifier to damage rolls.",
			"While the weapon hovers, you can take a Bonus Action to cause it to fly up to 30 feet to another spot within 30 feet of you. As part of the same Bonus Action, you can cause the weapon to attack one creature within 5 feet of the weapon.",
			"After the hovering weapon attacks for the fourth time, it flies back to you and tries to return to your hand. If you have no hand free, the weapon falls to the ground in your space. If the weapon has no unobstructed path to you, it moves as close to you as it can and then falls to the ground. It also ceases to hover if you grasp it or are more than 30 feet away from it.",
		],
		action: [["bonus action", ""]],
		chooseGear: {
			type: "weapon",
			prefixOrSuffix: ["between", "Dancing", "\uFEFF"],
			itemName1stPage: ["suffix", "Dancing"],
			descriptionChange: false,
			excludeCheck: function (inObjKey, inObj, v) {
				return !v.isMeleeWeapon || !/rapier|scimitar|sword/i.test(v.baseWeaponName);
			},
		},
		calcChanges: {
			atkAdd: [
				function (fields, v) {
					if (v.theWea && !v.theWea.isMagicWeapon && v.isMeleeWeapon && /rapier|scimitar|sword/i.test(v.baseWeaponName) && /dancing/i.test(v.WeaponTextName)) {
						v.theWea.isMagicWeapon = true;
						fields.Description += (fields.Description ? "; " : "") + "Attacks on its own as a Bonus Action";
					};
				},
				'If I include the word "Dancing" in the name of a Greatsword, Longsword, Rapier, Scimitar, or Shortsword, it will be treated as the magic weapon Dancing Sword. The sword can be made to attack on its own as a bonus action.',
			],
		},
	},
	"decanter of endless water": {
		name: "Decanter of Endless Water",
		source: [["SRD24", 217], ["DMG24", 249]],
		type: "Wondrous Item",
		rarity: "Uncommon",
		magicItemTable: ["Arcana", "Implements"],
		description: "As a Magic action, I open the flask and speak a command word, pouring fresh/salt water out until my next turn starts. ***Stream*** for 1 gal. ***Fountain*** for 5 gal. ***Geyser*** for 30 gal in a 30 ft by 1 ft Line. I can aim the geyser at one creature, which has to make a DC 13 Strength save or take 1d4 Bludgeoning damage and fall Prone.",
		descriptionLong: [
			"As a Magic action, I can remove the stopper from this flask and speak a command word, causing fresh or salt water (my choice) to pour out until the start of my next turn.",
			"***Stream*** produces 1 gal. ***Fountain*** produces 5 gal. ***Geyser*** produces 30 gallons of water that gushes forth in a Line 30 ft long and 1 ft wide. If I am holding the decanter, I can aim the geyser in one direction (no action). One creature of my choice in the Line must make a DC 13 Strength save or take 1d4 Bludgeoning damage and fall Prone. Instead of targeting a creature, I can have it knock over an unattended object in the Line that weighs \u2264200 lb.",
		],
		descriptionFull: [
			"This stoppered flask sloshes when shaken, as if it contains water. The decanter weighs 2 pounds.",
			"You can take a Magic action to remove the stopper and issue one of three command words, whereupon an amount of fresh water or salt water (your choice) pours out of the flask. The water stops pouring out at the start of your next turn. Choose from the following command words:",
			" \u2022 **Splash**. The decanter produces 1 gallon of water.",
			" \u2022 **Fountain**. The decanter produces 5 gallons of water.",
			" \u2022 **Geyser**. The decanter produces 30 gallons of water that gushes forth in a Line 30 feet long and 1 foot wide. If you're holding the decanter, you can aim the geyser in one direction (no action required). One creature of your choice in the Line must succeed on a DC 13 Strength saving throw or take 1d4 Bludgeoning damage and have the Prone condition. Instead of a creature, you can target one object in the Line that isn't being worn or carried and that weighs no more than 200 pounds. The object is knocked over by the geyser.",
		],
		action: [["action", ""]],
		weight: 2,
	},
	"deck of illusions": {
		name: "Deck of Illusions",
		source: [["SRD24", 217], ["DMG24", 249]],
		type: "Wondrous Item",
		rarity: "Uncommon",
		magicItemTable: "Arcana",
		description: "As a Magic action, I can draw a card at random from this deck and throw it on the ground within 30 ft. An illusion, determined by the type of card, forms over the thrown card and remains until dispelled. As a Magic action while I'm within 120 ft of it, I can move it within 30 ft of the card. See Notes page for details.",
		descriptionFull: [
			"This box contains a set of cards. A full deck has 34 cards: 32 depicting specific creatures and two with a mirrored surface. A deck found as treasure is usually missing 1d20 - 1 cards.",
			"The magic of the deck functions only if its cards are drawn at random. You can take a Magic action to draw a card at random from the deck and throw it to the ground at a point within 30 feet of yourself. An illusion of a creature, determined by rolling on the following table, forms over the thrown card and remains until dispelled. The illusory creature created by the card looks and behaves like a real creature of its kind, except that it can do no harm. While you are within 120 feet of the illusory creature and can see it, you can take a Magic action to move it anywhere within 30 feet of its card.",
			"Any physical interaction with the illusory creature reveals it to be false, because objects pass through it. A creature that takes a Study action to visually inspect the illusory creature identifies it as an illusion with a successful DC 15 Intelligence (Investigation) check. The illusion lasts until its card is moved or the illusion is dispelled (using a *Dispel Magic* spell or a similar effect). When the illusion ends, the image on its card disappears, and that card can't be used again.",
			[
				["1d100", "Illusion"],
				["01-03", "Adult Red Dragon"],
				["04-06", "Archmage"],
				["07-09", "Assassin"],
				["10-12", "Bandit Captain"],
				["13-15", "Beholder"],
				["16-18", "Berserker"],
				["19-21", "Bugbear Warrior"],
				["22-24", "Cloud Giant"],
				["25-27", "Druid"],
				["28-30", "Erinyes"],
				["31-33", "Ettin"],
				["34-36", "Fire Giant"],
				["37-39", "Frost Giant"],
				["40-42", "Gnoll Warrior"],
				["43-45", "Goblin Warrior"],
				["46-48", "Guardian Naga"],
				["49-51", "Hill Giant"],
				["52-54", "Hobgoblin Warrior"],
				["55-57", "Incubus"],
				["58-60", "Iron Golem"],
				["61-63", "Knight"],
				["64-66", "Kobold Warrior"],
				["67-69", "Lich"],
				["70-72", "Medusa"],
				["73-75", "Night Hag"],
				["76-78", "Ogre"],
				["79-81", "Oni"],
				["82-84", "Priest"],
				["85-87", "Succubus"],
				["88-90", "Troll"],
				["91-93", "Warrior Veteran"],
				["94-96", "Wyvern"],
				["97-00", "The card drawer"],
			],
		],
		toNotesPage: [{
			name: "Deck of Illusions",
			useDescriptionFull: true,
		}],
		action: [["action", " (draw card/move illusion)"]],
	},
	"deck of many things": {
		name: "Deck of Many Things",
		nameAlt: "Mysterious Deck",
		source: [["SRD24", 231], ["DMG24", 250]],
		type: "Wondrous Item",
		rarity: "Legendary",
		magicItemTable: "Arcana",
		description: "Before drawing cards from this deck, I must declare how many I wish to draw and then draw that number randomly. Any cards drawn in excess have no effect. When a card is drawn, its magic takes effect, it fades from existence, and, unless the card is the Fool or the Jester, reappears in the deck. See Notes page.",
		descriptionFull: [
			"Usually found in a box or pouch, this deck contains a number of cards made of ivory or vellum. Most (75 percent) of these decks have thirteen cards, but some have twenty-two. Use the appropriate column of the table below when randomly determining cards drawn from the deck.",
			"Before you draw a card, you must declare how many cards you intend to draw and then draw them randomly. Any cards drawn in excess of this number have no effect. Otherwise, as soon as you draw a card from the deck, its magic takes effect. You must draw each card no more than 1 hour after the previous draw. If you fail to draw the chosen number, the remaining number of cards fly from the deck on their own and take effect all at once.",
			"Once a card is drawn, it disappears. Unless the card is the Fool or Jester, the card reappears in the deck, making it possible to draw the same card twice. (Once the Fool or Jester has left the deck, reroll on the table if that card comes up again.)",
			[
				["(13-Card Deck)", "(22-Card Deck)"],
				["**1d100**", "", "**1d100**", "", "**Card**"],
				["   \u2014", "", "01\u201305", "", "Balance"],
				["   \u2014", "", "06\u201310", "", "Comet"],
				["   \u2014", "", "11\u201314", "", "Donjon"],
				["01\u201308", "", "15\u201318", "", "Euryale"],
				["   \u2014", "", "19\u201323", "", "Fates"],
				["09\u201316", "", "24\u201327", "", "Flames"],
				["   \u2014", "", "28\u201331", "", "Fool"],
				["   \u2014", "", "32\u201336", "", "Gem"],
				["17\u201324", "", "37\u201341", "", "Jester"],
				["25\u201332", "", "42\u201346", "", "Key"],
				["33\u201340", "", "47\u201351", "", "Knight"],
				["41\u201348", "", "52\u201356", "", "Moon"],
				["   \u2014", "", "57\u201360", "", "Puzzle"],
				["49\u201356", "", "61\u201364", "", "Rogue"],
				["57\u201364", "", "65\u201368", "", "Ruin"],
				["   \u2014", "", "69\u201373", "", "Sage"],
				["65\u201372", "", "74\u201377", "", "Skull"],
				["73\u201380", "", "78\u201382", "", "Star"],
				["81\u201388", "", "83\u201387", "", "Sun"],
				["   \u2014", "", "88\u201391", "", "Talons"],
				["89\u201396", "", "92\u201396", "", "Throne"],
				["97\u201300", "", "97\u201300", "", "Void"],
			],
			"Each card's effect is described below.",
			"***Balance***. You can increase one of your ability scores by 2, to a maximum of 22, provided you also decrease another one of your ability scores by 2. You can't decrease an ability that has a score of 5 or lower. Alternatively, you can choose not to adjust your ability scores, in which case this card has no effect.",
			"***Comet***. The next time you enter combat against one or more Hostile creatures, you can select one of them as your foe when you roll Initiative. If you reduce your foe to 0 Hit Points during that combat, you have Advantage on Death Saving Throws for 1 year. If someone else reduces your chosen foe to 0 Hit Points or you don't choose a foe, this card has no effect.",
			"***Donjon***. You disappear and become entombed in a state of suspended animation in an extradimensional sphere. Everything you're wearing and carrying disappears with you except for Artifacts, which stay behind in the space you occupied when you disappeared. You remain imprisoned until you are found and removed from the sphere. You can't be located by any Divination magic, but a *Wish* spell can reveal the location of your prison. You draw no more cards.",
			"***Euryale***. The card's medusa-like visage curses you. You take a -2 penalty to saving throws while cursed in this way. Only a god or the magic of the Fates card can end this curse.",
			"***Fates***. Reality's fabric unravels and spins anew, allowing you to avoid or erase one event as if it never happened. You can use the card's magic as soon as you draw the card or at any other time before you die.",
			"***Flames***. A powerful devil becomes your enemy. The devil seeks your ruin and torments you, savoring your suffering before attempting to slay you. This enmity lasts until either you or the devil dies.",
			"***Fool***. You have Disadvantage on D20 Tests for the next 72 hours. Draw another card; this draw doesn't count as one of your declared draws.",
			"***Gem***. Twenty-five pieces of jewelry worth 2,000 GP each or fifty gems worth 1,000 GP each appear at your feet.",
			"***Jester***. You have Advantage on D20 Tests for the next 72 hours, or you can draw two additional cards beyond your declared draws.",
			"***Key***. A Rare or rarer magic weapon with which you are proficient appears on your person. The DM chooses the weapon.",
			"***Knight***. You gain the service of a **Knight**, who magically appears in an unoccupied space you choose within 30 feet of yourself. The knight has the same alignment as you and serves you loyally until death, believing the two of you have been drawn together by fate. Work with your DM to create a name and backstory for this NPC. The DM can use a different stat block to represent the knight, as desired.",
			"***Moon***. You gain the ability to cast *Wish* 1d3 times.",
			"***Puzzle***. Permanently reduce your Intelligence or Wisdom by 1d4 + 1 (to a minimum score of 1). You can draw one additional card beyond your declared draws.",
			"***Rogue***. An NPC of the DM's choice becomes Hostile toward you. You don't know the identity of this NPC until they or someone else reveals it. Nothing less than a *Wish* spell or divine intervention can end the NPC's hostility toward you.",
			"***Ruin***. All forms of wealth that you carry or own, other than magic items, are lost to you. Portable property vanishes. Businesses, buildings, and land you own are lost in a way that alters reality the least. If you have a Bastion (see the 7), it is destroyed by some calamity beyond your control. Any documentation that proves you should own something lost to this card also disappears.",
			"***Sage***. At any time you choose within one year of drawing this card, you can ask a question in meditation and mentally receive a truthful answer to that question.",
			"***Skull***. An **Avatar of Death** appears in an unoccupied space as close to you as possible. The avatar targets only you with its attacks, appearing as a ghostly skeleton clad in a tattered black robe and carrying a spectral scythe. The avatar disappears when it drops to 0 Hit Points or you die. If an ally of yours deals damage to the avatar, that ally summons another **Avatar of Death**. The new avatar appears in an unoccupied space as close to that ally as possible and targets only that ally with its attacks. You and your allies can each summon only one avatar as a consequence of this draw. A creature slain by an avatar can't be restored to life.",
			"***Star***. Increase one of your ability scores by 2, to a maximum of 24.",
			"***Sun***. A magic item (chosen by the DM) appears on your person. In addition, you gain 10 Temporary Hit Points daily at dawn until you die.",
			"***Talons***. Every magic item you wear or carry disintegrates. Artifacts in your possession vanish instead.",
			"***Throne***. You gain proficiency and Expertise in your choice of History, Insight, Intimidation, or Persuasion. In addition, you gain rightful ownership of a small keep somewhere in the world. However, the keep is currently home to one or more monsters, which must be cleared out before you can claim the keep as yours.",
			"***Void***. Your soul is drawn from your body and contained in an object in a place of the DM's choice. One or more powerful beings guard the place. While your soul is trapped in this way, your body is inert, ceases aging, and requires no food, air, or water. A *Wish* spell can't return your soul to your body, but the spell reveals the location of the object that holds your soul. You draw no more cards.",
			"\n**A Question of Enmity**. Two of the cards in the Deck of Many Things can earn a character the enmity of another being. With the Flames card, the enmity is overt. The character should experience the devil's malevolent efforts on multiple occasions. Seeking out the fiend shouldn't be a simple task, and the adventurer should clash with the devil's allies and followers a few times before being able to confront the devil.",
			"In the case of the Rogue card, the enmity is secret and should come from someone thought to be a friend or an ally. As Dungeon Master, you should wait for a dramatically appropriate moment to reveal this enmity, leaving the adventurer guessing who is likely to become a betrayer.",
		],
		toNotesPage: [{
			name: "Features and Table",
			note: [
				"Usually found in a box or pouch, this deck contains a number of cards made of ivory or vellum. Most (75%) of these decks have thirteen cards, but some have twenty-two. Use the appropriate column of the table below when randomly determining cards drawn from the deck.",
				"Before I draw a card, I must declare how many cards that I intend to draw and then draw them randomly. Any cards drawn in excess of this number have no effect. Otherwise, as soon as I draw a card from the deck, its magic takes effect. I must draw each card no more than 1 hour after the previous draw. If I fail to draw the chosen number, the remaining number of cards fly from the deck on their own and take effect all at once.",
				"Once a card is drawn, it disappears. Unless the card is the Fool or Jester, the card reappears in the deck, making it possible to draw the same card twice. (Once the Fool or Jester has left the deck, reroll on the table if that card comes up again.)",
				[
					["(13-Card Deck)", "(22-Card Deck)"],
					["**1d100**", "", "**1d100**", "", "**Card**"],
					["   \u2014", "", "01\u201305", "", "Balance"],
					["   \u2014", "", "06\u201310", "", "Comet"],
					["   \u2014", "", "11\u201314", "", "Donjon"],
					["01\u201308", "", "15\u201318", "", "Euryale"],
					["   \u2014", "", "19\u201323", "", "Fates"],
					["09\u201316", "", "24\u201327", "", "Flames"],
					["   \u2014", "", "28\u201331", "", "Fool"],
					["   \u2014", "", "32\u201336", "", "Gem"],
					["17\u201324", "", "37\u201341", "", "Jester"],
					["25\u201332", "", "42\u201346", "", "Key"],
					["33\u201340", "", "47\u201351", "", "Knight"],
					["41\u201348", "", "52\u201356", "", "Moon"],
					["   \u2014", "", "57\u201360", "", "Puzzle"],
					["49\u201356", "", "61\u201364", "", "Rogue"],
					["57\u201364", "", "65\u201368", "", "Ruin"],
					["   \u2014", "", "69\u201373", "", "Sage"],
					["65\u201372", "", "74\u201377", "", "Skull"],
					["73\u201380", "", "78\u201382", "", "Star"],
					["81\u201388", "", "83\u201387", "", "Sun"],
					["   \u2014", "", "88\u201391", "", "Talons"],
					["89\u201396", "", "92\u201396", "", "Throne"],
					["97\u201300", "", "97\u201300", "", "Void"],
				],
			],
		}, {
			name: "Cards and their effects",
			additional: "part 1",
			note: [
				"***Balance***. I can increase one of my ability scores by 2, to a maximum of 22, provided that I also decrease another one of my ability scores by 2. I can't decrease an ability that has a score of 5 or lower. Alternatively, I can choose not to adjust my ability scores, in which case this card has no effect.",
				"***Comet***. The next time that I enter combat against one or more Hostile creatures, I can select one of them as my foe when I roll Initiative. If I reduce my foe to 0 Hit Points during that combat, I have Advantage on Death Saving Throws for 1 year. If someone else reduces my chosen foe to 0 Hit Points or I don't choose a foe, this card has no effect.",
				"***Donjon***. I disappear and become entombed in a state of suspended animation in an extradimensional sphere. Everything I'm wearing and carrying disappears with me except for Artifacts, which stay behind in the space I occupied when I disappeared. I remain imprisoned until I am found and removed from the sphere. I can't be located by any Divination magic, but a *Wish* spell can reveal the location of my prison. I draw no more cards.",
				"***Euryale***. The card's medusa-like visage curses me. I take a -2 penalty to saving throws while cursed in this way. Only a god or the magic of the Fates card can end this curse.",
				"***Fates***. Reality's fabric unravels and spins anew, allowing me to avoid or erase one event as if it never happened. I can use the card's magic as soon as I draw the card or at any other time before I die.",
			],
			amendTo: "Unless the card is the Fool or Jester",
		}, {
			name: "Cards and their effects",
			additional: "part 2",
			note: [
				"   ***Flames***. A powerful devil becomes my enemy. The devil seeks my ruin and torments me, savoring my suffering before attempting to slay me. This enmity lasts until either the devil or I dies.",
				"***Fool***. I have Disadvantage on D20 Tests for the next 72 hours. I draw another card; this draw doesn't count as one of my declared draws.",
				"***Gem***. Twenty-five pieces of jewelry worth 2,000 GP each or fifty gems worth 1,000 GP each appear at my feet.",
				"***Jester***. I have Advantage on D20 Tests for the next 72 hours, or I can draw two additional cards beyond my declared draws.",
				"***Key***. A Rare or rarer magic weapon with which I am proficient appears on my person. The DM chooses the weapon.",
				"***Knight***. I gain the service of a **Knight**, who magically appears in an unoccupied space that I choose within 30 ft of me. The knight has the same alignment as me and serves me loyally until death, believing the two of us have been drawn together by fate.",
				"***Moon***. I gain the ability to cast *Wish* 1d3 times.",
				"***Puzzle***. I permanently reduce my Intelligence or Wisdom by 1d4 + 1 (to a minimum score of 1). I can draw one additional card beyond my declared draws.",
				"***Rogue***. An NPC of the DM's choice becomes Hostile toward me. I don't know the identity of this NPC until they or someone else reveals it. Nothing less than a *Wish* spell or divine intervention can end the NPC's hostility toward me.",
				"***Ruin***. All forms of wealth that I carry or own, other than magic items, are lost to me. Portable property vanishes. Businesses, buildings, and land I own are lost in a way that alters reality the least. If I have a Bastion, it is destroyed by some calamity beyond my control. Any documentation that proves I should own something lost to this card also disappears.",
				"***Sage***. At any time I choose within one year of drawing this card, I can ask a question in meditation and mentally receive a truthful answer to that question.",
				"***Skull***. An **Avatar of Death** appears in an unoccupied space as close to me as possible. The avatar targets only me with its attacks, appearing as a ghostly skeleton clad in a tattered black robe and carrying a spectral scythe. The avatar disappears when it drops to 0 Hit Points or I die. If an ally of mine deals damage to the avatar, that ally summons another **Avatar of Death**. The new avatar appears in an unoccupied space as close to that ally as possible and targets only that ally with its attacks. My allies and I can each summon only one avatar as a consequence of this draw. A creature slain by an avatar can't be restored to life.",
				"***Star***. Increase one of my ability scores by 2, to a maximum of 24.",
				"***Sun***. A magic item (chosen by the DM) appears on my person. In addition, I gain 10 Temporary Hit Points daily at dawn until I die.",
				"***Talons***. Every magic item I wear or carry disintegrates. Artifacts in my possession vanish instead.",
				"***Throne***. I gain proficiency and Expertise in my choice of History, Insight, Intimidation, or Persuasion. In addition, I gain rightful ownership of a small keep somewhere in the world. However, the keep is currently home to one or more monsters, which must be cleared out before I can claim the keep as mine.",
				"***Void***. My soul is drawn from my body and contained in an object in a place of the DM's choice. One or more powerful beings guard the place. While my soul is trapped in this way, my body is inert, ceases aging, and requires no food, air, or water. A *Wish* spell can't return my soul to my body, but the spell reveals the location of the object that holds my soul. I draw no more cards.",
			],
		}],
	},
	"defender": {
		name: "Defender",
		source: [["SRD24", 218], ["DMG24", 252]],
		type: "Weapon (Any Melee)",
		rarity: "Legendary",
		magicItemTable: "Armaments",
		attunement: true,
		description: "I have a +3 bonus to attack and damage rolls made with this magic weapon. The first time I attack with it on each of my turns, I can transfer some or all of the bonus to my AC instead. The change remains in effect until the start of my next turn. I must be holding the sword to gain its bonus to AC.",
		descriptionFull: [
			"You gain a +3 bonus to attack rolls and damage rolls made with this magic weapon.",
			"The first time you attack with the weapon on each of your turns, you can transfer some or all of the weapon's bonus to your Armor Class. For example, you could reduce the bonus to your attack rolls and damage rolls to +1 and gain a +2 bonus to Armor Class. The adjusted bonuses remain in effect until the start of your next turn, although you must hold the weapon to gain a bonus to AC from it.",
		],
		chooseGear: {
			type: "weapon",
			prefixOrSuffix: "suffix",
			descriptionChange: false,
			excludeCheck: function (inObjKey, inObj, v) {
				return !v.isMeleeWeapon;
			},
		},
		calcChanges: {
			atkAdd: [
				function (fields, v) {
					if (!v.theWea.isMagicWeapon && v.isMeleeWeapon && /defender/i.test(v.WeaponTextName)) {
						v.theWea.isMagicWeapon = true;
						fields.Description += (fields.Description ? "; " : "") + "+3 bonus can be used for AC instead";
					};
				},
				'If I include the word "Defender" in the name of a melee weapon, it will be treated as the magic weapon Defender. It adds +3 to hit and damage, but this bonus can be lowered and added to AC instead. Decide to do so with the first attack on your turn.',
			],
			atkCalc: [
				function (fields, v, output) {
					if (v.isMeleeWeapon && /defender/i.test(v.WeaponTextName)) {
						output.magic = v.thisWeapon[1] + 3;
					};
				}, "",
			],
		},
	},
	"demon armor": {
		name: "Demon Armor",
		nameTest: /demon.+(armou?r|\u180C)/i,
		source: [["SRD24", 218], ["DMG24", 252]],
		type: "Armor (Any Light, Medium, or Heavy)",
		rarity: "Very Rare",
		magicItemTable: "Armaments",
		attunement: true,
		cursed: true,
		description: "While wearing this armor, I gain +1 AC, know Abyssal, and can use its clawed gauntlets to make Unarmed Strikes that deal 1d8 Slashing damage with a +1 bonus to hit and damage. ***Curse.*** I can't doff the armor and have Disadvantage on attacks and saving throws against demons.",
		descriptionFull: [
			"While wearing this armor, you gain a +1 bonus to Armor Class, and you know Abyssal. In addition, the armor's clawed gauntlets allow your Unarmed Strikes to deal 1d8 Slashing damage instead of the usual Bludgeoning damage, and you gain a +1 bonus to the attack and damage rolls of your Unarmed Strikes.",
			"***Curse***. Once you don this cursed armor, you can't doff it unless you are targeted by a *Remove Curse* spell or similar magic. While wearing the armor, you have Disadvantage on attack rolls against demons and on saving throws against their spells and special abilities.",
		],
		languageProfs: ["Abyssal"],
		savetxt: { text: ["Disadv on saves vs demons"] },
		weaponOptions: [{
			baseWeapon: "unarmed strike",
			regExpSearch: /^(?=.*demon)(?=.*armor)(?=.*claws).*$/i,
			name: "Demon Armor Claws",
			source: [["SRD24", 218], ["DMG24", 252]],
			damage: [1, 8, "slashing"],
			selectNow: true,
		}],
		calcChanges: {
			atkCalc: [
				function (fields, v, output) {
					if (v.baseWeaponName === "unarmed strike") {
						output.magic += 1;
					};
				},
				"My Unarmed Strikes gain a +1 bonus to hit and damage.",
			],
		},
		allowDuplicates: true,
		chooseGear: {
			type: "armor",
			prefixOrSuffix: ["between", "Demon", "\u180C"],
			itemName1stPage: ["suffix", "+1 Demon"],
			descriptionChange: ["replace", "armor"],
		},
	},
	"dimensional shackles": {
		name: "Dimensional Shackles",
		source: [["SRD24", 218], ["DMG24", 254]],
		type: "Wondrous Item",
		rarity: "Rare",
		magicItemTable: "Implements",
		description: "As a Utilize action, I can shackle an Incapacitated" + (typePF ? " Small-Large" : "") + " creature" + (typePF ? "" : " of Small to Large size") + ", preventing them from using extradimensional travel, but not portals. Myself and those I choose can remove the binds as a Utilize action. Once every 30 days the bound creature can attempt to break the shackles with a DC 30 Athletics check.",
		descriptionFull: [
			"You can take a Utilize action to place these shackles on a creature that has the Incapacitated condition. The shackles adjust to fit a creature of Small to Large size. The shackles prevent a creature bound by them from using any method of extradimensional movement, including teleportation or travel to a different plane of existence. They don't prevent the creature from passing through an interdimensional portal.",
			"You and any creature you designate when you use the shackles can take a Utilize action to remove them. Once every 30 days, the bound creature can make a DC 30 Strength (Athletics) check. On a successful check, the creature breaks free and destroys the shackles.",
		],
		action: [["action", " (shackle/remove)"]],
	},
	"dragon scale mail": function (){
		var obj = {
			name: "Dragon Scale Mail",
			source: [["SRD24", 218], ["DMG24", 254]],
			type: "Armor (Scale Mail)",
			rarity: "Very Rare",
			magicItemTable: "Armaments",
			attunement: true,
			description: "Select one of the choices.",
			description: "While wearing this armor, I gain a resistance to a damage type, +1 AC and advantage on saving throws against the frightful presence and breath weapons of dragons. Once per dawn as an action, I can magically discern the distance and direction to the closest dragon of the armor's type within 30 miles of me.",
			descriptionFull: [
				"*Dragon Scale Mail* is made of the scales of one kind of dragon. Sometimes dragons collect their cast-off scales and gift them. Other times, hunters carefully preserve the hide of a dead dragon. In either case, **Dragon Scale Mail** is highly valued.",
				"While wearing this armor, you gain a +1 bonus to Armor Class, you have Advantage on saving throws against the breath weapons of Dragons, and you have Resistance to one damage type determined by the kind of dragon that provided the scales (see the accompanying table).",
				"Additionally, you can focus your senses as a Magic action to discern the distance and direction to the closest dragon within 30 miles of yourself that is of the same type as the armor. This action can't be used again until the next dawn.",
				[
					["Dragon", "Resistance"],
					["Black", "Acid"],
					["Blue", "Lightning"],
					["Brass", "Fire"],
					["Bronze", "Lightning"],
					["Copper", "Acid"],
					["Gold", "Fire"],
					["Green", "Poison"],
					["Red", "Fire"],
					["Silver", "Cold"],
					["White", "Cold"],
				],
			],
			weight: 45,
			usages: 1,
			recovery: "Dawn",
			savetxt: { adv_vs: ["Dragon Breath Weapons"] },
			allowDuplicates: true,
			choicesNotInMenu: true,
			choices: [],
		};
		[ ["Black", "Acid"], ["Blue", "Lightning"], ["Brass", "Fire"], ["Bronze", "Lightning"], ["Copper", "Acid"], ["Gold", "Fire"], ["Green", "Poison"], ["Red", "Fire"], ["Silver", "Cold"], ["White", "Cold"] ].forEach(function (n) {
			var choice = n[0] + " Dragon (" + n[1] + ")";
			obj.choices.push(choice);
			obj[choice.toLowerCase()] = {
				name: n[0] + " Dragon Scale Mail",
				description: "This scale mail gives +1 to AC, Advantage on saves against the breath weapons of dragons, and Resistance to " + n[1] + " damage. As a Magic action once per dawn, I can discern the distance and direction to the closest " + n[0].toLowerCase() + " dragon within 30 miles.",
				dmgres: [n[1]],
				limfeaname: "Detect " + n[0] + " Dragon",
				action: [["action", ""]],
				armorOptions: [{
					regExpSearch: /^(?=.*dragon)(?=.*scale)(?=.*mail).*$/i,
					name: n[0] + " Dragon Scale Mail",
					source: [["SRD24", 218], ["DMG24", 254]],
					type: "medium",
					ac: "14+1",
					stealthdis: true,
					weight: 45,
					selectNow: true,
				}],
			};
		});
		return obj;
	}(),
	"dragon slayer": {
		name: "Dragon Slayer",
		source: [["SRD24", 219], ["DMG24", 254]],
		type: "Weapon (Any Simple or Martial)",
		rarity: "Rare",
		magicItemTable: "Armaments",
		description: "I gain a +1 bonus to attack and damage rolls made with this magic weapon. The weapon deals an extra 3d6 damage of the weapon's type if the target is a Dragon.",
		descriptionFull: [
			"You gain a +1 bonus to attack rolls and damage rolls made with this magic weapon.",
			"The weapon deals an extra 3d6 damage of the weapon's type if the target is a Dragon.",
		],
		chooseGear: {
			type: "weapon",
			prefixOrSuffix: "suffix",
			descriptionChange: ["replace", "weapon"],
			excludeCheck: function (inObjKey, inObj, v) {
				return !v.isSimpleOrMartial;
			},
		},
		calcChanges: {
			atkAdd: [
				function (fields, v) {
					if (!v.theWea.isMagicWeapon && v.isSimpleOrMartial && /^(?=.*dragon)(?=.*slayer).*$/i.test(v.WeaponTextName)) {
						v.theWea.isMagicWeapon = true;
						fields.Description += (fields.Description ? "; " : "") + "+3d6 damage vs Dragons";
					}
				},
				'If I include the words "Dragon Slayer" in the name of a Simple or Martial weapon, it will be treated as the magic weapon Dragon Slayer. It adds +1 to hit and damage and deals +3d6 damage to Dragons.',
			],
			atkCalc: [
				function (fields, v, output) {
					if (v.isSimpleOrMartial && /^(?=.*dragon)(?=.*slayer).*$/i.test(v.WeaponTextName)) {
						output.magic = v.thisWeapon[1] + 1;
					}
				}, "",
			],
		},
	},
	"dust of disappearance": {
		name: "Dust of Disappearance",
		source: [["SRD24", 219], ["DMG24", 255]],
		type: "Wondrous Item",
		rarity: "Uncommon",
		magicItemTable: ["Arcana", "Implements"],
		description: "As a Utilize action, I can throw this dust into the air once. This causes me and all creatures within a 10-ft Emanation from me to become Invisible for 2d4 minutes. The duration is the same for all subjects. Immediately after an affected creature makes an attack roll, deals damage, or casts a spell, their Invisibility ends.",
		descriptionFull: "This powder resembles fine sand. There is enough of it for one use. When you take a Utilize action to throw the dust into the air, you and each creature and object within a 10-foot Emanation originating from you have the Invisible condition for 2d4 minutes. The duration is the same for all subjects, and the dust is consumed when its magic takes effect. Immediately after an affected creature makes an attack roll, deals damage, or casts a spell, the Invisible condition ends for that creature.",
		action: [["action", "Utilize Magical Dust"]],
	},
	"dust of dryness": {
		name: "Dust of Dryness",
		source: [["SRD24", 219], ["DMG24", 255]],
		type: "Wondrous Item",
		rarity: "Uncommon",
		magicItemTable: ["Arcana", "Implements"],
		description: "As a Utilize action, I can sprinkle 1 pinch of dust on a 15-ft Cube of water or an Elemental made of water within 5 ft. The water turns into a marble-sized, light pellet. The Elemental takes 10d6 Necrotic damage, DC 13 Con save for half. As a Utilize action, I can smash the pellet against a hard surface, releasing the water.",
		descriptionFull: [
			"This small packet contains 1d6 + 4 pinches of dust. As a Utilize action, you can sprinkle a pinch of the dust over water, turning up to a 15-foot Cube of water into one marble-sized pellet, which floats or rests near where the dust was sprinkled. The pellet's weight is negligible. A creature can take a Utilize action to smash the pellet against a hard surface, causing the pellet to shatter and release the water the dust absorbed. Doing so destroys the pellet and ends its magic.",
			"As a Utilize action, you can sprinkle a pinch of the dust on an Elemental within 5 feet of yourself that is composed mostly of water (such as a Water Elemental or a Water Weird). Such a creature exposed to a pinch of the dust makes a DC 13 Constitution saving throw, taking 10d6 Necrotic damage on a failed save or half as much damage on a successful one.",
		],
		action: [["action", "Utilize Magical Dust"]],
		usages: " ", // 1d6+4 - Intentionally left blank
		additional: "1d6+4 pinches",
		recovery: "\u2013",
	},
	"dust of sneezing and choking": {
		name: "Dust of Sneezing and Choking",
		source: [["SRD24", 219], ["DMG24", 255]],
		type: "Wondrous Item",
		rarity: "Uncommon",
		magicItemTable: ["Arcana", "Implements"],
		description: "As a Utilize action, I can throw this dust into the air once. Me and all creatures in a 30-ft Emanation must make a DC 15 Con save or start sneezing; becoming Incapacitated and suffocating. They can repeat the save at the end of each of their turns. Constructs, Elementals, Oozes, Plants, and Undead are immune.",
		descriptionLong: "This powder resembles *Dust of Disappearance*, and *Identify* reveals it to be such. There is enough of it for one use. As a Utilize action, I can throw the dust into the air, forcing me and every creature in a 30-ft Emanation originating from me to make a DC 15 Con save. Constructs, Elementals, Oozes, Plants, and Undead succeed automatically. On a fail, a creature begins sneezing uncontrollably; it is Incapacitated and suffocating. The creature repeats the save at the end of each of its turns, ending the effect on itself on a success. The effect also ends on any creature targeted by a *Lesser Restoration* spell.",
		descriptionFull: [
			"Found in a small container, this powder resembles *Dust of Disappearance*, and *Identify* reveals it to be such. There is enough of it for one use.",
			"As a Utilize action, you can throw the dust into the air, forcing yourself and every creature in a 30-foot Emanation originating from you to make a DC 15 Constitution saving throw. Constructs, Elementals, Oozes, Plants, and Undead succeed on the save automatically.",
			"On a failed save, a creature begins sneezing uncontrollably; it has the Incapacitated condition and is suffocating. The creature repeats the save at the end of each of its turns, ending the effect on itself on a success. The effect also ends on any creature targeted by a *Lesser Restoration* spell.",
		],
		action: [["action", "Utilize Magical Dust"]],
	},
	"dwarven plate": {
		name: "Dwarven Plate",
		nameTest: /dwarven.+plate/i,
		source: [["SRD24", 219], ["DMG24", 255]],
		type: "Armor (Half Plate Armor or Plate Armor)",
		rarity: "Very Rare",
		magicItemTable: "Armaments",
		description: "Select one of the choices.",
		descriptionFull: "While wearing this armor, you gain a +2 bonus to Armor Class. In addition, if an effect moves you against your will along the ground, you can take a Reaction to reduce the distance you are moved by up to 10 feet.",
		// can't use chooseGear becaue the name includes the name of an armor (Plate)
		choicesNotInMenu: true,
		allowDuplicates: true,
		action: [["reaction", " (reduce forced movement)"]],
		choices: ["Half Plate", "Plate"],
		"half plate": {
			name: "Dwarven Half Plate",
			description: "While wearing this half plate armor, I gain a +2 bonus to Armor Class. As a Reaction when an effect moves me against my will along the ground, I can reduce the distance I am moved by up to 10 ft.",
			weight: 40,
			armorOptions: [{
				regExpSearch: /^(?=.*dwar(f|ven))(?=.*half)(?=.*plate).*$/i,
				name: "Dwarven Half plate",
				invName: "Dwarven half plate armor",
				source: [["SRD24", 219], ["DMG24", 255]],
				type: "medium",
				ac: "15+2",
				stealthdis: true,
				weight: 40,
				selectNow: true,
			}],
		},
		"plate": {
			name: "Dwarven Plate \u180C", // needs to be different from the parent name
			description: "While wearing this plate armor, I gain a +2 bonus to Armor Class. As a Reaction when an effect moves me against my will along the ground, I can reduce the distance I am moved by up to 10 ft.",
			weight: 65,
			armorOptions: [{
				regExpSearch: /^(?=.*dwar(f|ven))(?!.*(half|breast))(?=.*plate).*$/i,
				name: "Dwarven Plate",
				invName: "Dwarven plate armor",
				source: [["SRD24", 219], ["DMG24", 255]],
				type: "heavy",
				ac: "18+2",
				stealthdis: true,
				weight: 65,
				strReq: 15,
				selectNow: true,
			}],
		},
	},
	"dwarven thrower": {
		name: "Dwarven Thrower",
		source: [["SRD24", 219], ["DMG24", 256]],
		type: "Weapon (Warhammer)",
		rarity: "Very Rare",
		magicItemTable: "Armaments",
		attunement: true,
		prerequisite: "Requires Attunement by a Dwarf or a Creature Attuned to a Belt of Dwarvenkind",
		prereqeval: function (v) {
			var knownIdx = CurrentMagicItems.known.indexOf("belt of dwarvenkind");
			return /dwarf/.test(CurrentRace.known) || isMagicItemAttuned(knownIdx);
		},
		description: "This magical Warhammer gives me a +3 bonus to attack and damage rolls made with it. It has the Thrown property with a normal range of 20 ft and a long range of 60 ft. When thrown, it deals an extra 1d8 damage, or 2d8 if the target is a Giant. Immediately after the attack, the weapon flies back to my hand.",
		descriptionFull: "You gain a +3 bonus to attack rolls and damage rolls made with this magic weapon. It has Thrown with a normal range of 20 feet and a long range of 60 feet. When you hit with a ranged attack using this weapon, it deals an extra 1d8 Force damage, or an extra 2d8 Force damage if the target is a Giant. Immediately after hitting or missing, the weapon flies back to your hand.",
		weight: 5,
		weaponOptions: [{
			baseWeapon: "warhammer",
			regExpSearch: /^(?=.*dwarven)(?=.*thrower).*$/i,
			name: "Dwarven Thrower",
			source: [["SRD24", 219], ["DMG24", 256]],
			range: "Melee, 20/60 ft",
			description: "Thrown, Versatile (1d10); When thrown: +1d8 damage (2d8 vs Giants), returns immediately",
			modifiers: [3, 3],
			selectNow: true,
		}],
	},
	"efreeti bottle": {
		name: "Efreeti Bottle",
		source: [["SRD24", 220], ["DMG24", 256]],
		type: "Wondrous Item",
		rarity: "Very Rare",
		magicItemTable: "Arcana",
		description: "As a Magic action, I can remove the stopper from this painted brass bottle. A cloud of thick smoke flows out of the bottle and at the end of my turn, the smoke disappears and an **Efreeti** appears in an unoccupied space within 30 ft of me. The first time the bottle is opened, the DM rolls to determine what happens.",
		descriptionLong: "As a Magic action, I can remove the stopper from this painted brass bottle. A cloud of thick smoke flows out of the bottle and at the end of my turn, the smoke disappears and an **Efreeti** appears in an unoccupied space within 30 ft of me. The first time the bottle is opened, the DM rolls a d10 to determine what happens. **1**. The efreeti attacks me for 5 rounds before disappearing. **2**\u2013**9**. The efreeti serves me for 1 hour, following my commands. It then returns to the bottle and I can resummon it twice, but only 24 hours after it returned to the bottle. **10**. The efreeti grants me a *Wish*, after which it disappears.",
		descriptionFull: [
			"When you take a Magic action to remove the stopper of this painted brass bottle, a cloud of thick smoke flows out of it. At the end of your turn, the smoke disappears with a flash of harmless fire, and an Efreeti appears in an unoccupied space within 30 feet of you.",
			"The first time the bottle is opened, the DM rolls on the following table to determine what happens.",
			[
				["1d10", "Effect"],
				["  1", "The efreeti attacks you. After fighting for 5 rounds, the efreeti disappears, and the bottle loses its magic."],
				["2\u20139", "The efreeti understands your languages and obeys your commands for 1 hour, after which it returns to the bottle, and a new stopper contains it. The stopper can't be removed for 24 hours. The next two times the bottle is opened, the same effect occurs. If the bottle is opened a fourth time, the efreeti escapes and disappears, and the bottle loses its magic."],
				[" 10", "The efreeti understands your languages and can cast *Wish* once for you. It disappears when it grants the wish or after 1 hour, and the bottle loses its magic."],
			],
		],
		weight: 1,
		action: [["action", ""]],
		creaturesAdd: [["Efreeti", true, function (AddRemove, prefix) {
			if (!AddRemove) return;
			Value(prefix + "Comp.Type", "Summon");
			Value(prefix + "Comp.Desc.Name", "Bottled Efreeti");
			var featuresNew = What(prefix + "Comp.Use.Features")
				.replace(/(.*languages.*)\./i, "$1, understands the languages of its summoner.");
			Value(prefix + "Comp.Use.Features", featuresNew);

			var noteAddition = "##\u25C6 Efreeti Bottle##. The efreeti understands the languages of its summoner and obeys their commands for 1 hour, after which it returns to the bottle, and a new stopper contains it. The stopper can't be removed for 24 hours. The next two times the bottle is opened, the same effect occurs. lf the bottle is opened a fourth time, the efreeti escapes and disappears, and the bottle loses its magic.";
			AddString(prefix + "Cnote.Left", noteAddition, true);
		}]],
		creatureOptions: [{
			name: "Efreeti",
			source: [["SRD24", 283], ["MM24", 109]],
			size: 2,
			type: "Elemental",
			subtype: "Genie",
			alignment: "Neutral",
			ac: 17,
			hp: 212,
			hd: [17, 10],
			speed: "40 ft, Fly 60 ft (hover)",
			scores: [22, 12, 24, 16, 15, 19],
			saves: ["", "", "", "", 6, 8],
			immunities: "Fire",
			senses: "Darkvision 120 ft",
			passivePerception: 12,
			languages: "Primordial (Ignan)",
			challengeRating: "11",
			proficiencyBonus: 4,
			attacksAction: 3,
			features: [{
				name: "Elemental Restoration",
				description: "If the [THIS] dies outside the Elemental Plane of Fire, its body dissolves into ash, and it gains a new body in 1d4 days, reviving with all its Hit Points somewhere on the Plane of Fire.",
			}, {
				name: "Magic Resistance",
				description: "The [THIS] has Advantage on save against spells and magical effects.",
			}],
			actions: [{
				name: "Multiattack",
				description: "As an Attack action, the [THIS] can make a combination of three Heated Blade or Hurl Flame attacks.",
			}],
			traits: [{
				name: "Wishes",
				description: "The [THIS] has a 30% chance of knowing *Wish* and be able to cast it only on behalf of a non-genie who communicates the wish to the [THIS]. The [THIS] suffers none of the spell's stress. Once the [THIS] has cast *Wish* three times, it can't do so again for 365 days.",
			}, {
				name: "Spellcasting",
				description: [
					"The [THIS] can cast the following spells, requiring no Material components and using Charisma as the spellcasting ability (spell save DC 16):",
					"**At Will**: *Detect Magic*, *Elementalism*",
					"**1/Day Each**: *Gaseous Form*, *Invisibility*, *Major Image*, *Plane Shift*, *Tongues*, *Wall of Fire* (level 7 version)",
				].join("\n   "),
				eval: function (prefix, lvl) {
					// Add spellcasting
					var spName = prefix + "efreeti";
					CurrentSpells[spName] = {
						name: "Efreeti (creature)",
						ability: 6,
						fixedDC: 16,
						typeSp: "creature",
						refType: "creature",
						allowUpCasting: false,
						firstCol: "Us",
						bonus: {},
					};
					processSpBonus(true, "efreeti", [{
						name: "At Will by Efreeti",
						spells: ["detect magic", "elementalism"],
						selection: ["detect magic", "elementalism"],
						firstCol: "atwill",
						times: 2,
					}, {
						name: "1/Day by Efreeti",
						spells: ["gaseous form", "invisibility", "major image", "plane shift", "tongues", "wall of fire"],
						selection: ["gaseous form", "invisibility", "major image", "plane shift", "tongues", "wall of fire"],
						firstCol: "onceday",
						times: 6,
					}], "magic", spName);
					var changesObj = {
						components: "V,S",
						compMaterial: "Spells cast by an Efreeti requires no Material components.",
						changes: "Spells cast by an Efreeti requires no Material components.",
					};
					processSpChanges(true, "Efreeti", {
						"detect magic": { ritual: false },
						"gaseous form": changesObj,
						"invisibility": changesObj,
						"major image": changesObj,
						"plane shift": Object.assign({}, changesObj, {
							description: "Me \x26 8 willing crea teleport to another plane: general location or known teleport circle; see book",
						}),
						"tongues": Object.assign({}, changesObj, { components: "V" }),
						"wall of fire": Object.assign({}, changesObj, {
							description: "60\xD71\xD720ft (l\xD7w\xD7h) or 10ft rad; all enter/end in 10ft 1 side 8d8 Fire dmg; cast: all in save half",
							descriptionMetric: "18\xD70,3\xD76m (l\xD7w\xD7h) or 3m rad; all enter/end in 3m 1 side 8d8 Fire dmg; cast: all in save half",
							descriptionShorter: false,
							descriptionShorterMetric: false,
							changes: "*Wall of Fire* cast by an Efreeti is cast at level 7 and requires no Material components.",
						}),
					}, spName);
				},
				removeeval: function (prefix, lvl) {
					// Remove spellcasting
					processSpBonus(false, "efreeti", false, "magic", prefix + "efreeti");
				},
			}],
			attacks: [{
				name: "Heated Blade",
				ability: 1,
				damage: [2, 6, "slashing"],
				range: "Melee (5 ft)",
				description: "+2d12 Fire damage; Three Heated Blade/Hurl Flame attacks as an Action",
			}, {
				name: "Hurl Flame",
				ability: 6,
				damage: [7, 6, "fire"],
				range: "120 ft",
				description: "Three Heated Blade/Hurl Flame attacks as an Action",
				abilitytodamage: false,
			}],
		}],
	},
	"elemental gem": (function () {
		var obj = {
			name: "Elemental Gem",
			source: [["SRD24", 220], ["DMG24", 257]],
			type: "Wondrous Item",
			rarity: "Uncommon",
			magicItemTable: "Arcana",
			description: "Select a gem type.",
			descriptionFull: [
				"This gem contains a mote of elemental energy.",
				"When you take a Utilize action to break the gem, an elemental is summoned (see the *Monster Manual* for its stat block), and the gem ceases to be magical. The elemental appears in an unoccupied space as close to the broken gem as possible, understands your languages, obeys your commands, and takes its turn immediately after you on your Initiative count.",
				"The elemental disappears after 1 hour, when it dies, or when you dismiss it as a Bonus Action. The type of gem determines the elemental, as shown in the following table.",
				[
					["Gem", "Summoned Elemental"],
					["Blue sapphire", "Air Elemental"],
					["Emerald", "Water Elemental"],
					["Red corundum", "Fire Elemental"],
					["Yellow diamond", "Earth Elemental"],
				],
			],
			action: [
				["action", " (summon)"],
				["bonus action", " (dismiss)"],
			],
			allowDuplicates: true,
			choices: [],
		};

		var gemTypes = [
			{ gem: "Blue Sapphire", element: "Air", article: "an" },
			{ gem: "Emerald", element: "Water", article: "a" },
			{ gem: "Red Corundum", element: "Fire", article: "a" },
			{ gem: "Yellow Diamond", element: "Earth", article: "an" },
		];
		gemTypes.forEach(function (gemType) {
			var gem = gemType.gem;
			var element = gemType.element;
			var article = gemType.article;

			var choiceName = gem + " (" + element + " Elemental)";
			obj.choices.push(choiceName);

			obj[choiceName.toLowerCase()] = {
				name: "Elemental Gem [" + gem + "]",
				description: "As a Utilize action, I can destroy the gem, which ceases being magical, to summon " + article + " **" + element + " Elemental** as close to the gem as possible. The elemental understands my languages, obeys my commands and takes its turn after me in Initiative. It disappears after 1 hour, when it dies, or when I dismiss it as a Bonus Action.",
				creaturesAdd: [[element + " Elemental", true, function (AddRemove, prefix) {
					if (!AddRemove) return;
					Value(prefix + "Comp.Type", "Summon");
					Value(prefix + "Comp.Desc.Name", "Gem Summoned Elemental");
					var featuresNew = What(prefix + "Comp.Use.Features")
						.replace(/(.*languages.*)\./i, "$1, understands the languages of its summoner.");
					Value(prefix + "Comp.Use.Features", featuresNew);

					var noteAddition = "##\u25C6 Summoned##. The elemental obeys the commands of its summoner and takes its turn immediately after them on their Initiative count. The elemental disappears after 1 hour, when it dies, or when its summoner dismisses it as a Bonus Action.";
					AddString(prefix + "Cnote.Left", noteAddition, true);
				}]],
			};
		});

		return obj;
	})(),
	"elixir of health": {
		name: "Elixir of Health",
		source: [["SRD24", 220], ["DMG24", 257]],
		type: "Potion",
		rarity: "Rare",
		magicItemTable: "Relics",
		description: "As a Bonus Action, I can drink this potion or administer it to another. The consumer of the potion is cured of all magical contagions and the following conditions end on them: Blinded, Deafened, Paralyzed, and Poisoned. This potion's clear, red liquid has tiny bubbles of light in it.",
		descriptionFull: [
			"When you drink this potion, you are cured of all magical contagions. In addition, the following conditions end on you: Blinded, Deafened, Paralyzed, and Poisoned.",
			"The clear, red liquid has tiny bubbles of light in it.",
		],
		weight: 0.5,
	},
	"elven chain": {
		name: "Elven Chain",
		source: [["SRD24", 220], ["DMG24", 257]],
		type: "Armor (Chain Mail or Chain Shirt)",
		rarity: "Rare",
		magicItemTable: "Armaments",
		description: "Select one of the choices.",
		descriptionFull: "You gain a +1 bonus to Armor Class while you wear this armor. You are considered trained with this armor even if you lack training with Medium or Heavy armor.",
		weight: 20,
		choices: ["Chain Shirt", "Chain Mail"],
		"chain shirt": {
			name: "Elven Chain Shirt",
			description: "I gain a +1 bonus to Armor Class while I wear this chain shirt. I am considered trained with this armor even if I lack training with Medium armor.",
			weight: 20,
			armorOptions: [{
				regExpSearch: /^(?=.*elven)(?=.*chain)(?=.*shirt).*$/i,
				name: "Elven Chain Shirt",
				source: [["SRD24", 220], ["DMG24", 257]],
				type: "medium",
				ac: "13+1",
				weight: 20,
				selectNow: true,
			}],
		},
		"chain mail": {
			name: "Elven Chain Mail",
			description: "I gain a +1 bonus to Armor Class while I wear this chain mail. I am considered trained with this armor even if I lack training with Heavy armor.",
			weight: 55,
			armorOptions: [{
				regExpSearch: /^(?!.*(scale|plate|ring|shirt))(?=.*elven)(?=.*chain)(?=.*mail).*$/i,
				name: "Elven Chain Mail",
				source: [["SRD24", 220], ["DMG24", 257]],
				type: "heavy",
				ac: "16+1",
				stealthdis: true,
				weight: 55,
				strReq: 13,
				selectNow: true,
			}],
		},
	},
	"energy bow": {
		name: "Energy Bow",
		nameTest: /energy.*bow/i,
		source: [["SRD24", 220], ["DMG24", 257]],
		type: "Weapon (Longbow or Shortbow)",
		rarity: "Very Rare",
		magicItemTable: "Armaments",
		attunement: true,
		description: "This +1 bow has no string, but an arrow of golden energy appears as I pull my arm back in a firing motion. These arrows deal Force damage, emit 20-ft radius Bright Light and 20-ft radius Dim Light, and disappear after the attack. I can fire special arrows from it, see Notes page.",
		descriptionLong: [
			"An arrow of golden energy appears when I attack with this +1 bow. The arrow deals Force damage, emits 20 ft Bright and 20 ft Dim Light, and disappears after the attack.",
			"***Arrow of Restraint***. As a ranged attack, instead of damage DC 15 Str save or Restrained for 1 min. Target can try to escape as an action with a DC 20 Str (Athletics) check.",
			"***Arrow of Transport***. As a Magic action, I can teleport a willing <Medium creature or unattended object up to 5-ft Cube that I can see in 60 ft to an empty space in 10 ft of me.",
			"***Energy Ladder***. As a Magic action, I create a ladder up to 60 ft high on a wall within 60 ft.",
		],
		descriptionFull: [
			"You gain a +1 bonus to attack rolls and damage rolls made with this magic weapon, which has no string. Each time you pull your arm back in a firing motion, a magical arrow made of golden energy appears nocked and ready to fire. An arrow produced by this weapon deals Force damage instead of Piercing damage on a hit, and it disappears after it hits or misses its target. Until it disappears, the arrow emits Bright Light in a 20-foot radius and Dim Light for an additional 20 feet.",
			"This weapon has the following additional properties.",
			"***Arrow of Restraint***. Whenever you use this weapon to make a ranged attack against a creature, you can try to restrain the target instead of dealing damage to it. If the arrow hits, the target must succeed on a DC 15 Strength saving throw or have the Restrained condition for 1 minute. As an action, a creature Restrained by an arrow can make a DC 20 Strength (Athletics) check to try to break the restraint, ending the effect on itself on a successful check.",
			"***Arrow of Transport***. As a Magic action, you can fire one energy arrow from this weapon at a target you can see within 60 feet of yourself. The target can be either a willing Medium or smaller creature or an object that isn't being worn or carried, provided the object is small enough to fit inside a 5-foot Cube. The arrow teleports the target to an unoccupied space you can see within 10 feet of you.",
			"***Energy Ladder***. As a Magic action, you can loose a flurry of energy arrows from this weapon at a wall up to 60 feet away from yourself. The arrows become glowing rungs that stick out of the wall, forming a magical ladder up to 60 feet long on the wall. This ladder lasts for 1 minute before disappearing.",
		],
		chooseGear: {
			type: "weapon",
			prefixOrSuffix: ["suffix", "Energy"],
			descriptionChange: ["replace", "bow"],
			excludeCheck: function (inObjKey, inObj, v) {
				return !v.isRangedWeapon || !/longbow|shortbow/i.test(v.baseWeaponName);
			},
		},
		calcChanges: {
			atkAdd: [
				function (fields, v) {
					if (!v.theWea.isMagicWeapon && v.isRangedWeapon && /longbow|shortbow/i.test(v.baseWeaponName) && /energy.*bow/i.test(v.WeaponTextName)) {
						v.theWea.isMagicWeapon = true;
						fields.Description += (fields.Description ? "; " : "") + "Instead of damage DC 15 Str save or Restrain 1 min (DC 20 Athletics escape)";
					};
				},
				'If I include the word "Energy" before the name of a Longbow or Shortbow, it will be treated as the magic weapon Energy Bow. It adds +1 to hit and damage and can fire an Arrow of Restraint instead of making a normal attack.',
			],
			atkCalc: [
				function (fields, v, output) {
					if (v.isRangedWeapon && /longbow|shortbow/i.test(v.baseWeaponName) && /energy.*bow/i.test(v.WeaponTextName)) {
						output.magic = v.thisWeapon[1] + 1;
					};
				}, "",
			],
		},
		toNotesPage: [{
			name: "Energy Bow",
			useDescriptionFull: true,
		}],
	},
	"eversmoking bottle": {
		name: "Eversmoking Bottle",
		source: [["SRD24", 220], ["DMG24", 259]],
		type: "Wondrous Item",
		rarity: "Uncommon",
		magicItemTable: "Arcana",
		description: "As a Magic action I can open or close this bottle. If opened, thick Heavily Obscuring smoke fills a 60-ft Emanation originating from the bottle. The smoke grows by 10 ft for each minute that the bottle is open, to a max of 120 ft. Closing the bottle fixes the smoke in place which disperses after 10 mins, or 1 min in " + (typePF ? "wind." : "a strong wind, such as a *Gust of Wind*."),
		descriptionFull: [
			"As a Magic action, you can open or close this bottle.",
			"Opening the bottle causes thick smoke to billow out, forming a cloud that fills a 60-foot Emanation originating from the bottle. The area within the smoke is Heavily Obscured.",
			"Each minute the bottle remains open, the size of the Emanation increases by 10 feet until it reaches its maximum size of 120 feet.",
			"Closing the bottle causes the cloud to become fixed in place until it disperses after 10 minutes. A strong wind (such as that created by the *Gust of Wind* spell) disperses the cloud after 1 minute.",
		],
		weight: 1,
		action: [["action", " (open/close)"]],
	},
	"eyes of charming": {
		name: "Eyes of Charming",
		source: [["SRD24", 221], ["DMG24", 261]],
		type: "Wondrous Item",
		rarity: "Uncommon",
		magicItemTable: "Arcana",
		attunement: true,
		description: "These crystal lenses fit over my eyes. They have 3 charges, and regain all expended charges at dawn. While wearing them, I can expend 1 or more charges to cast *Charm Person* (save DC 13). For 1 charge, I cast the level 1 version of the spell. I increase the spell's level by one for each additional charge that I expend.",
		descriptionFull: "These crystal lenses fit over the eyes. They have 3 charges. While wearing them, you can expend 1 or more charges to cast *Charm Person* (save DC 13). For 1 charge, you cast the level 1 version of the spell. You increase the spell's level by one for each additional charge you expend. The lenses regain all expended charges daily at dawn.",
		usages: 3,
		recovery: "Dawn",
		spellcastingBonus: [{
			name: "1 or more charges",
			spells: ["charm person"],
			selection: ["charm person"],
			firstCol: "1+",
		}],
		spellChanges: {
			"charm person": {
				description: "1+1/charge humanoid save or Charmed \x26 Friendly; Adv on save if fighting me/ally; ends if we dmg it",
				changes: "*Eyes of Charming* can upcast *Charm Person* by using additional charges",
			},
		},
		fixedDC: 13,
		spellFirstColTitle: "Ch",
	},
	"eyes of minute seeing": {
		name: "Eyes of Minute Seeing",
		source: [["SRD24", 221], ["DMG24", 261]],
		type: "Wondrous Item",
		rarity: "Uncommon",
		magicItemTable: ["Arcana", "Implements"],
		description: "These crystal lenses fit over my eyes. While wearing them, my vision improves significantly out to a range of 1 ft, granting me Darkvision within that range and Advantage on Intelligence (Investigation) checks made to examine something within that range.",
		descriptionFull: "These crystal lenses fit over the eyes. While wearing them, your vision improves significantly out to a range of 1 foot, granting you Darkvision within that range and Advantage on Intelligence (Investigation) checks made to examine something within that range.",
		vision: [
			["Darkvision", "fixed 1"],
			["Adv on Investigation checks based on sight", 1],
		],
	},
	"eyes of the eagle": {
		name: "Eyes of the Eagle",
		source: [["SRD24", 221], ["DMG24", 261]],
		type: "Wondrous Item",
		rarity: "Uncommon",
		magicItemTable: "Implements",
		description: "These crystal lenses fit over my eyes. While wearing them, I have Advantage on Wisdom (Perception) checks that rely on sight. In conditions of clear visibility, I can make out details of even extremely distant creatures and objects as small as 2 ft across.",
		descriptionFull: "These crystal lenses fit over the eyes. While wearing them, you have Advantage on Wisdom (Perception) checks that rely on sight. In conditions of clear visibility, you can make out details of even extremely distant creatures and objects as small as 2 feet across.",
		vision: [["Adv on Perception checks that rely on sight", 0]],
	},
	"figurine of wondrous power": function (){
		var descriptionFull = [
			"A *Figurine of Wondrous Power* is a statuette small enough to fit in a pocket. If you take a Magic action to throw the figurine to a point on the ground within 60 feet of yourself, the figurine becomes a living creature specified in the figurine's description below. If the space where the creature would appear is occupied by other creatures or objects, or if there isn't enough space for the creature, the figurine doesn't become a creature.",
			"The creature is Friendly to you and your allies. It understands your languages, obeys your commands, and takes its turn immediately after you on your Initiative count. If you issue no commands, the creature defends itself but takes no other actions.",
			"The creature exists for a duration specific to each figurine. At the end of the duration, the creature reverts to its figurine form. It reverts to a figurine early if its creature form drops to 0 Hit Points or if you take a Magic action while touching the creature to make it revert to figurine form. When the creature becomes a figurine again, its property can't be used again until a certain amount of time has passed, as specified below.",
		];
		var featureText = "The [THIS] obeys the commands of its owner and takes its turn immediately after them on their Initiative count. The [THIS] reverts back to a figurine after [X], when it drops to 0 HP, or when its owner touches it and uses a Magic action to revert it back.";
		var languagesText = "Understands the languages of its owner but can't speak";
		var noteTextIntro = " small enough to fit in a pocket. If I take a Magic action to throw the figurine to a point on the ground within 60 ft of me, the figurine becomes a ";
		var noteTextMain = desc([
			"If the space where the creature would appear is occupied by other creatures or objects, or if there isn't enough space for the creature, the figurine doesn't become a creature.",
			"The creature is Friendly to me and my allies. It understands my languages, obeys my commands, and takes its turn immediately after me on my Initiative count. If I issue no commands, the creature defends itself but takes no other actions.",
			"At the end of the duration, the creature reverts to its figurine form. It reverts to a figurine early if its creature form drops to 0 Hit Points or if I take a Magic action while touching the creature to make it revert to figurine form. When the creature becomes a figurine again, its property can't be used again until ",
		], "\n   ");
		var mergeCreature = function (creature, toMerge) {
			var oCrea = Object.assign({}, Base_CreatureList[creature]);
			delete oCrea.nameAlt;
			delete oCrea.companion;
			delete oCrea.companionApply;
			oCrea.eval = function (prefix) {
				Value(prefix + "Comp.Desc.Name", "Figurine of Wondrous Power");
			};
			for (var key in toMerge) {
				if (key === "attacks") {
					oCrea[key] = toMerge[key];
				} else if (oCrea[key] && isArray(oCrea[key]) && isArray(toMerge[key])) {
					oCrea[key] = oCrea[key].concat(toMerge[key]);
				} else {
					oCrea[key] = toMerge[key];
				}
			}
			return oCrea;
		};
		var obj = {
			name: "Figurine of Wondrous Power",
			source: [["SRD24", 221], ["DMG24", 261]],
			type: "Wondrous Item",
			magicItemTable: "Arcana",
			description: "Select one of the choices.",
			descriptionFull: descriptionFull,
			action: [["action", ""]],
			allowDuplicates: true,
			choices: ["Bronze Griffon (Rare)", "Ebony Fly (Rare)", "Golden Lions (Rare)", "Ivory Goats (Rare)", "Marble Elephant (Rare)", "Obsidian Steed (Very Rare)", "Onyx Dog (Rare)", "Serpentine Owl (Rare)", "Silver Raven (Uncommon)"],
			"bronze griffon (rare)": {
				name: "Figurine of Wondrous Power (Bronze Griffon)",
				rarity: "Rare",
				description: "As a Magic action, I can throw this statuette to an empty space within 60 ft, where it becomes a **Griffon** for 6 hours or until it drops to 0 HP or I touch it and use a Magic action to make it revert back. The griffon is Friendly, obeys my commands, and acts after me on my Initiative. See Companion page.",
				descriptionFull: descriptionFull.concat([
					"***Bronze Griffon (Rare)***. This bronze statuette is of a griffon rampant. It can become a **Griffon** for up to 6 hours. Once it has been used, it can't be used again until 5 days have passed.",
				]),
				extraLimitedFeatures: [{
					name: "Figurine of WP (Bronze Griffon)",
					usages: 1,
					recovery: "5 days",
				}],
				creaturesAdd: [["Bronze Griffon", true]],
				creatureOptions: [
					mergeCreature("griffon", {
						name: "Bronze Griffon",
						nameThis: "griffon",
						header: "Summon",
						languages: languagesText,
						features: [{
							name: "Figurine",
							description: featureText.replace("[X]", "6 hours"),
						}],
						notes: [{
							name: "Bronze Griffon Figurine of Wondrous Power (DMG'24 261)",
							joinString: "\n",
							description: "This bronze statuette of a griffon rampant is" +
								noteTextIntro + "**Griffon** for up to 6 hours." +
								noteTextMain + "5 days have passed.",
						}],
					}),
				],
			},
			"ebony fly (rare)": {
				name: "Figurine of Wondrous Power (Ebony Fly)",
				rarity: "Rare",
				description: "As a Magic action, I can throw this statuette to an empty space within 60 ft, where it becomes a **Giant Fly** for 12 hours or until it drops to 0 HP or I touch it and use a Magic action to revert it back. It is Friendly, obeys my commands, acts after me on my Initiative, and can be ridden as a mount. See Companion page.",
				descriptionFull: descriptionFull.concat([
					"***Ebony Fly (Rare)***. This ebony statuette, carved in the likeness of a horsefly, can become a **Giant Fly** for up to 12 hours and can be ridden as a mount. Once it has been used, it can't be used again until 2 days have passed.",
				]),
				extraLimitedFeatures: [{
					name: "Figurine of WP (Ebony Fly)",
					usages: 2,
					recovery: "2 days",
				}],
				creaturesAdd: [["Ebony Fly", true]],
				creatureOptions: [
					mergeCreature("giant fly", {
						name: "Ebony Fly",
						nameThis: "fly",
						header: "Summon",
						languages: languagesText,
						features: [{
							name: "Figurine",
							description: featureText.replace("[X]", "12 hours"),
						}, {
							name: "Mount",
							description: "The [THIS] can be ridden as a mount.",
						}],
						notes: [{
							name: "Ebony Fly Figurine of Wondrous Power (DMG'24 261)",
							joinString: "\n",
							description: "This ebony statuette, carved in the likeness of a horsefly, is" +
								noteTextIntro + "**Giant Fly** for up to 12 hours and can be ridden as a mount." +
								noteTextMain + "2 days have passed.",
						}],
					}),
				],
			},
			"golden lions (rare)": {
				name: "Figurine of Wondrous Power (Golden Lions)",
				rarity: "Rare",
				description: "As a Magic action, I can throw one or both of these statuettes to an empty space within 60 ft, where each becomes a **Lion** for 1 hour or until it drops to 0 HP or I touch it and use a Magic action to revert it back. Each lion is Friendly, obeys my commands, and acts after me on my Initiative. See Companion page.",
				descriptionFull: descriptionFull.concat([
					"***Golden Lions (Rare)***. These gold statuettes of lions are always created in pairs. You can use one figurine or both simultaneously. Each can become a **Lion** for up to 1 hour. Once a lion has been used, it can't be used again until 7 days have passed.",
				]),
				extraLimitedFeatures: [{
					name: "Figurine of WP (Golden Lions)",
					usages: 2,
					recovery: "7 days",
				}],
				creaturesAdd: [["Golden Lion", true]],
				creatureOptions: [
					mergeCreature("lion", {
						name: "Golden Lion",
						nameThis: "lion",
						header: "Summon",
						languages: languagesText,
						features: [{
							name: "Figurine",
							description: featureText.replace("[X]", "1 hour"),
						}],
						notes: [{
							name: "Golden Lion Figurines of Wondrous Power (DMG'24 261)",
							joinString: "\n",
							description: "These pair of gold statuettes of lions are" +
								noteTextIntro.replace("the figurine", "a figurine") +
								"**Lion** for up to 1 hour. I can use one figurine or both simultaneously." +
								noteTextMain + "7 days have passed.",
						}],
					}),
				],
			},
			"ivory goats (rare)": {
				name: "Figurine of Wondrous Power (Ivory Goats)",
				rarity: "Rare",
				description: "As a Magic action, I can throw 1 of these 3 statuettes to an empty space within 60 ft. Each figurine turns into a creature for a number of hours or until it drops to 0 HP or I touch it and use a Magic action to revert it. It is Friendly, obeys my commands, and acts after me on my Initiative. See Companion pages.",
				descriptionLong: "As a Magic action, I can throw one of these three statuettes to an empty space within 60 ft. Each figurine turns into a specific creature for a number of hours or until it drops to 0 HP or I touch it and use a Magic action to make it revert back. Each creature is Friendly, obeys my commands, understands my languages, and acts after me on my Initiative. The ***Goat of Terror*** can become a **Giant Goat** for 3 hours. The ***Goat of Traveling*** can become a large goat (**Riding Horse** stats) for 24 hours, which don't need to be consecutive. The ***Goat of Travail*** can become a **Giant Goat** for 3 hours. See Companion pages.",
				descriptionFull: descriptionFull.concat([
					"***Ivory Goats (Rare)***. These ivory statuettes of goats are always created in sets of three. Each goat looks unique and functions differently from the others. Their properties are as follows:",
					" \u2022 **Goat of Terror**. This figurine can become a **Giant Goat** for up to 3 hours. The goat can't attack, but you can (harmlessly) remove its horns and use them as weapons. One horn becomes a *+1 Lance*, and the other becomes a *+2 Longsword*. Removing a horn requires a Magic action, and the weapons disappear and the horns return when the goat reverts to figurine form. While you ride the goat, any Hostile creature that starts its turn within a 30-foot Emanation originating from the goat must succeed on a DC 15 Wisdom saving throw or have the Frightened condition for 1 minute, until you are no longer riding the goat, or until the goat reverts to figurine form. The Frightened creature repeats the save at the end of each of its turns, ending the effect on itself on a success. Once it succeeds on the save, a creature is immune to this effect for the next 24 hours. Once the figurine has been used, it can't be used again until 15 days have passed.",
					" \u2022 **Goat of Traveling**. This figurine can become a Large goat with the same statistics as a **Riding Horse**. It has 24 charges, and each hour or portion thereof it spends in goat form costs 1 charge. While it has charges, you can use it as often as you wish. When it runs out of charges, it reverts to a figurine and can't be used again until 7 days have passed, when it regains all expended charges.",
					" \u2022 **Goat of Travail**. This figurine can become a **Giant Goat** for up to 3 hours. Once it has been used, it can't be used again until 30 days have passed.",
				]),
				extraLimitedFeatures: [{
					name: "Figurine of WP [Ivory Goat of Terror]",
					usages: 1,
					recovery: "15 days",
				}, {
					name: "Figurine of WP [Ivory Goat of Traveling]",
					usages: 24,
					recovery: "7 days",
				}, {
					name: "Figurine of WP [Ivory Goat of Travail]",
					usages: 1,
					recovery: "30 days",
				}],
				creaturesAdd: [
					["Ivory Goat of Terror", true],
					["Ivory Goat of Travail", true],
					["Ivory Goat of Traveling", true],
				],
				creatureOptions: [
					mergeCreature("giant goat", {
						name: "Ivory Goat of Terror",
						nameThis: "goat",
						header: "Summon",
						languages: languagesText,
						features: [{
							name: "Figurine",
							description: featureText.replace("[X]", "3 hours"),
						}, {
							name: "Horns as Weapons",
							description: "The owner of the [THIS] can harmlessly remove its horns as a Magic action and use one of them as a *+1 Lance*, and the other as a *+2 Longsword*. The weapons disappear and the horns return when the [THIS] reverts to figurine form.",
						}],
						notes: [{
							name: "Ivory Goat of Terror Figurine of Wondrous Power (DMG'24 261)",
							joinString: "\n",
							description: [
								"This ivory statuette of a goat is" +
								noteTextIntro + "**Giant Goat** for up to 3 hours." +
								noteTextMain + "15 days have passed.",
								"The goat can't attack, but I can (harmlessly) remove its horns and use them as weapons. One horn becomes a *+1 Lance*, and the other becomes a *+2 Longsword*. Removing a horn requires a Magic action, and the weapons disappear and the horns return when the goat reverts to figurine form.",
								"While I ride the goat, any Hostile creature that starts its turn within a 30-ft Emanation originating from the goat must succeed on a DC 15 Wisdom saving throw or have the Frightened condition for 1 minute, until I am no longer riding the goat, or until the goat reverts to figurine form. The Frightened creature repeats the save at the end of each of its turns, ending the effect on itself on a success. Once it succeeds on the save, a creature is immune to this effect for the next 24 hours.",
							].join("\n   "),
						}],
						actions: false,
						attacks: [{
							name: "Frightful Presence",
							source: [["SRD24", 222], ["DMG24", 262]],
							ability: 0,
							damage: ["Wis save", "", "Frightened"],
							range: "30-ft Emanation",
							description: "Only if ridden; Any starting turn in range area or Frightened for 1 min, repeat save at end of turn",
							abilitytodamage: false,
							modifiers: [5, ""],
							dc: true,
						}],
						traits: [{
							name: "Frightful Presence",
							description: "While the [THIS] is being ridden by its owner, any Hostile creature that starts its turn within a 30-ft Emanation originating from the [THIS] must succeed on a DC 15 Wisdom saving throw or be Frightened for 1 minute, until the goat is no longer being riden by its owner, or until the [THIS] reverts to figurine form. The Frightened creature repeats the save at the end of each of its turns, ending the effect on itself on a success. Once it succeeds on the save, a creature is immune to this effect for the next 24 hours.",
						}],
					}),
					mergeCreature("riding horse", {
						name: "Ivory Goat of Traveling",
						nameThis: "goat",
						header: "Summon",
						languages: languagesText,
						features: [{
							name: "Figurine",
							description: featureText.replace("[X]", "it runs out of charges"),
						}],
						notes: [{
							name: "Ivory Goat of Traveling Figurine of Wondrous Power (DMG'24 262)",
							joinString: "\n",
							description: "This ivory statuette of a goat is" +
								noteTextIntro +
								"Large goat with the same statistics as a **Riding Horse**. It has 24 charges, and each hour or portion thereof it spends in goat form costs 1 charge. While it has charges, I can use it as often as I wish." +
								noteTextMain.replace(
									"At the end of the duration, the creature reverts to its figurine form.",
									"When it runs out of charges, it reverts to a figurine and can't be used again until 7 days have passed, when it regains all expended charges."
								).replace(
									" When the creature becomes a figurine again, its property can't be used again until ",
									""
								),
						}],
					}),
					mergeCreature("giant goat", {
						name: "Ivory Goat of Travail",
						nameThis: "goat",
						header: "Summon",
						languages: languagesText,
						features: [{
							name: "Figurine",
							description: featureText.replace("[X]", "3 hours"),
						}],
						notes: [{
							name: "Ivory Goat of Travail Figurine of Wondrous Power (DMG'24 262)",
							joinString: "\n",
							description: "This ivory statuette of a goat is" +
								noteTextIntro + "**Giant Goat** for up to 3 hours." +
								noteTextMain + "30 days have passed.",
						}],
					}),
				],
			},
			"marble elephant (rare)": {
				name: "Figurine of Wondrous Power (Marble Elephant)",
				rarity: "Rare",
				description: "As a Magic action, I can throw this statuette to an empty space within 60 ft, where it becomes a **Elephant** for 24 hours or until it drops to 0 HP or I touch it and use a Magic action to make it revert back. The elephant is Friendly, obeys my commands, and acts after me on my Initiative. See Companion page.",
				descriptionFull: descriptionFull.concat([
					"***Marble Elephant (Rare)***. This marble statuette resembles a trumpeting elephant. It can become an **Elephant** for up to 24 hours. Once it has been used, it can't be used again until 7 days have passed.",
				]),
				extraLimitedFeatures: [{
					name: "Figurine of WP (Marble Elephant)",
					usages: 1,
					recovery: "7 days",
				}],
				creaturesAdd: [["Marble Elephant", true]],
				creatureOptions: [
					mergeCreature("elephant", {
						name: "Marble Elephant",
						nameThis: "elephant",
						header: "Summon",
						languages: languagesText,
						features: [{
							name: "Figurine",
							description: featureText.replace("[X]", "24 hours"),
						}],
						notes: [{
							name: "Marble Elephant Figurine of Wondrous Power (DMG'24 262)",
							joinString: "\n",
							description: "This marble statuette of a trumpeting elephant is" +
								noteTextIntro + "**Elephant** for up to 24 hours." +
								noteTextMain + "7 days have passed.",
						}],
					}),
				],
			},
			"obsidian steed (very rare)": {
				name: "Figurine of Wondrous Power (Obsidian Steed)",
				rarity: "Very Rare",
				description: "As a Magic action, I can throw this statuette to an empty space within 60 ft. There it becomes a **Nightmare** for 24 hours or until it drops to 0 HP or I touch it and use a Magic action" + (typePF ? "" : " to command it to revert back") + ". It's Friendly, acts after me on my Initiative, obeys my commands 90% of the time, but only fights to defend itself. See Companion page.",
				descriptionFull: descriptionFull.concat([
					"***Obsidian Steed (Very Rare)***. This polished obsidian horse can become a **Nightmare** for up to 24 hours. The nightmare fights only to defend itself. Once it has been used, it can't be used again until 5 days have passed.",
					"The figurine has a 10 percent chance each time you use it to ignore your orders, including a command to revert to figurine form. If you mount the nightmare while it is ignoring your orders, you and the nightmare are instantly transported to a random location on the plane of Hades, where the nightmare reverts to figurine form.",
				]),
				extraLimitedFeatures: [{
					name: "Figurine of WP (Obsidian Steed)",
					usages: 1,
					recovery: "5 days",
				}],
				creaturesAdd: [["Obsidian Steed", true]],
				creatureOptions: [
					mergeCreature("nightmare", {
						name: "Obsidian Steed",
						nameThis: "nightmare",
						header: "Summon",
						languages: "Understands Abyssal, Common, Infernal, and any other languages of its owner but can't speak",
						features: [{
							name: "Figurine",
							description: featureText.replace("[X]", "24 hours"),
						}, {
							name: "Headstrong",
							description: "The [THIS] fights only to defend itself. Each time its owner gives it an order, including a command to revert to figurine form, there is a 10% chance the nightmare ignores it.",
						}],
						notes: [{
							name: "Obsidian Steed Figurine of Wondrous Power (DMG'24 262)",
							joinString: "\n",
							description: [
								"This polished obsidian statuette of a horse is" + noteTextIntro +
								"**Nightmare** for up to 24 hours. The nightmare fights only to defend itself." +
								noteTextMain + "5 days have passed.",
								"The figurine has a 10% chance each time I use it to ignore my orders, including a command to revert to figurine form. If I mount the nightmare while it is ignoring my orders, the nightmare and I are instantly transported to a random location on the plane of Hades, where the nightmare reverts to figurine form.",
							].join("\n   "),
						}],
					}),
				],
			},
			"onyx dog (rare)": {
				name: "Figurine of Wondrous Power (Onyx Dog)",
				rarity: "Rare",
				description: "As a Magic action, I can throw this statuette to an empty space within 60 ft, where it becomes a **Mastiff** for 6 hours or until it drops to 0 HP or I touch it and use a Magic action" + (typePF ? "" : " to make it revert back") + ". It is Friendly, obeys my commands, has Int" + (typePF ? "" : "elligence") + " 8, speaks Common, has Blindsight 60 ft, and acts after me on my Initiative. See Companion page.",
				descriptionFull: descriptionFull.concat([
					"***Onyx Dog (Rare)***. This onyx statuette of a dog can become a **Mastiff** for up to 6 hours. The mastiff has an Intelligence of 8 and can speak Common. It also has Blindsight with a range of 60 feet. Once it has been used, it can't be used again until 7 days have passed.",
				]),
				extraLimitedFeatures: [{
					name: "Figurine of WP (Onyx Dog)",
					usages: 1,
					recovery: "7 days",
				}],
				creaturesAdd: [["Onyx Dog", true]],
				creatureOptions: [
					mergeCreature("mastiff", {
						name: "Onyx Dog",
						nameThis: "mastiff",
						header: "Summon",
						scores: [13, 14, 12, 8, 12, 7],
						senses: "Darkvision 60 ft, Blindsight 60 ft",
						languages: "Common; understands any other languages of its owner but can't speak them",
						features: [{
							name: "Figurine",
							description: featureText.replace("[X]", "6 hours"),
						}],
						notes: [{
							name: "Onyx Dog Figurine of Wondrous Power (DMG'24 262)",
							joinString: "\n",
							description: "This onyx statuette of a dog is" +
								noteTextIntro +
								"**Mastiff** for up to 6 hours. The mastiff has an Intelligence of 8 and can speak Common. It also has Blindsight with a range of 60 ft." +
								noteTextMain + "7 days have passed.",
						}],
					}),
				],
			},
			"serpentine owl (rare)": {
				name: "Figurine of Wondrous Power (Serpentine Owl)",
				rarity: "Rare",
				description: "As a Magic action, I can throw this statuette to an empty space within 60 ft, where it becomes a **Giant Owl** for 8 hours or until it drops to 0 HP or I touch it and use a Magic action" + (typePF ? "" : " to make it revert back") + ". It is Friendly, obeys my commands, and acts after me on my Initiative. We can speak telepathically if on the same plane. See Companion page.",
				descriptionFull: descriptionFull.concat([
					"***Serpentine Owl (Rare)***. This serpentine statuette of an owl can become a **Giant Owl** for up to 8 hours. The owl can communicate telepathically with you at any range if you and it are on the same plane of existence. Once it has been used, it can't be used again until 2 days have passed.",
				]),
				extraLimitedFeatures: [{
					name: "Figurine of WP (Serpentine Owl)",
					usages: 1,
					recovery: "2 days",
				}],
				creaturesAdd: [["Serpentine Owl", true]],
				creatureOptions: [
					mergeCreature("giant owl", {
						name: "Serpentine Owl",
						nameThis: "owl",
						header: "Summon",
						languages: "Celestial; understands Common, Elvish, Sylvan, and any other languages of its owner but can't speak them",
						features: [{
							name: "Figurine",
							description: featureText.replace("[X]", "8 hours"),
						}, {
							name: "Telepathy",
							description: "The [THIS] and its owner can communicate telepathically at any range if both are on the same plane of existence.",
						}],
						notes: [{
							name: "Serpentine Owl Figurine of Wondrous Power (DMG'24 262)",
							joinString: "\n",
							description: "This serpentine statuette of an owl is" +
								noteTextIntro +
								"**Giant Owl** for up to 8 hours. The owl can communicate telepathically with me at any range if we are both on the same plane of existence." +
								noteTextMain + "2 days have passed.",
						}],
					}),
				],
			},
			"silver raven (uncommon)": {
				name: "Figurine of Wondrous Power (Silver Raven)",
				rarity: "Uncommon",
				description: "As a Magic action, I can throw this statuette to an empty space within 60 ft, where it becomes a **Raven** for 12 hours or until it drops to 0 HP or I touch it and use a Magic action" + (typePF ? "" : " to make it revert back") + ". The raven is Friendly, obeys my commands, acts after me on my Initiative, and I can cast *Animal Messenger* on it. See Companion page.",
				descriptionFull: descriptionFull.concat([
					"***Silver Raven (Uncommon)***. This silver statuette of a raven can become a **Raven** for up to 12 hours. Once it has been used, it can't be used again until 2 days have passed. While in raven form, the figurine grants you the ability to cast *Animal Messenger* on it.",
				]),
				extraLimitedFeatures: [{
					name: "Figurine of WP (Silver Raven)",
					usages: 1,
					recovery: "2 days",
				}],
				creaturesAdd: [["Silver Raven", true]],
				creatureOptions: [
					mergeCreature("rave", {
						name: "Silver Raven",
						nameThis: "raven",
						header: "Summon",
						languages: languagesText,
						features: [{
							name: "Figurine",
							description: featureText.replace("[X]", "12 hours"),
						}, {
							name: "Animal Messenger",
							description: "While in raven form, its owner can cast *Animal Messenger* on it.",
						}],
						notes: [{
							name: "Silver Raven Figurine of Wondrous Power (DMG'24 263)",
							joinString: "\n",
							description: "This silver statuette of a raven is" +
								noteTextIntro +
								"**Raven** for up to 12 hours. While in raven form, the figurine grants me the ability to cast *Animal Messenger* on it." +
								noteTextMain + "2 days have passed.",
						}],
					}),
				],
				magicItemComponents: false,
				spellcastingName: "Silver Raven (item)",
				spellcastingBonus: [{
					name: "At Will",
					spells: ["animal messenger"],
					selection: ["animal messenger"],
					firstCol: "atwill",
				}],
				spellChanges: {
					"animal messenger": {
						save: false,
						description: "Silver Raven delivers 25 word message up to 50 miles away to a location or described creature",
						changes: "Can only be cast on the *Silver Raven Figurine of Wondrous Power* while in Raven form, which doesn't get a saving throw.",
					},
				},
			},
		};
		return obj;
	}(),
	"flame tongue": {
		name: "Flame Tongue",
		source: [["SRD24", 223], ["DMG24", 263]],
		type: "Weapon (Any Melee)",
		rarity: "Rare",
		magicItemTable: "Armaments",
		attunement: true,
		description: "As a Bonus Action, I can speak the command word of this magic weapon, causing flames to engulf it. While ablaze it deals +2d6 Fire damage, sheds Bright Light in a 40-ft radius, and Dim Light for another 40 ft. The flames last until I issue the command again as a Bonus Action, drop, stow, or sheathe the weapon.",
		descriptionFull: [
			"While holding this magic weapon, you can take a Bonus Action and use a command word to cause flames to engulf the damage-dealing part of the weapon. These flames shed Bright Light in a 40-foot radius and Dim Light for an additional 40 feet. While the weapon is ablaze, it deals an extra 2d6 Fire damage on a hit. The flames last until you take a Bonus Action to issue the command again or until you drop, stow, or sheathe the weapon.",
		],
		action: [["bonus action", " (activate/end)"]],
		chooseGear: {
			type: "weapon",
			prefixOrSuffix: "suffix",
			descriptionChange: false,
			excludeCheck: function (inObjKey, inObj, v) {
				return !v.isMeleeWeapon;
			},
		},
		calcChanges: {
			atkAdd: [
				function (fields, v) {
					if (!v.theWea.isMagicWeapon && v.isMeleeWeapon && /^(?=.*flame)(?=.*tongue).*$/i.test(v.WeaponTextName)) {
						v.theWea.isMagicWeapon = true;
						fields.Description += (fields.Description ? "; " : "") + "+2d6 Fire damage while ablaze";
					};
				},
				'If I include the words "Flame Tongue" in the name of a melee weapon, it will be treated as the magic weapon Flame Tongue. When the command word is spoken, the blade erupts with flames, adding +2d6 Fire damage on a hit and shining light.',
			],
		},
	},
	"folding boat": {
		name: "Folding Boat",
		source: [["SRD24", 223], ["DMG24", 263]],
		type: "Wondrous Item",
		rarity: "Rare",
		magicItemTable: ["Arcana", "Implements"],
		description: "This floating box is 12 inch long, 6 inch wide and 6 inch deep. It can store items within. As a Magic action, I can " + (typePF ? "say" : "speak one of") + " its command words to: unfold into a Rowboat; unfold into a Keelboat; fold back into a box if no creatures are aboard. Objects in the boat remain if they can fit in the box, else they remain outside.",
		descriptionFull: [
			"This object appears as a wooden box that measures 12 inches long, 6 inches wide, and 6 inches deep. It weighs 4 pounds and floats. It can be opened to store items inside. This item also has three command words, each requiring a Magic action to use:",
			" \u2022 **First Command Word**. The box unfolds into a Rowboat.",
			" \u2022 **Second Command Word**. The box unfolds into a Keelboat.",
			" \u2022 **Third Command Word**. The Folding Boat folds back into a box if no creatures are aboard. Any objects in the vessel that can't fit inside the box remain outside the box as it folds. Any objects in the vessel that can fit inside the box do so.",
			"When the box becomes a vessel, its weight becomes that of a normal vessel its size, and anything that was stored in the box remains in the boat.",
			"Statistics for the Rowboat and Keelboat appear in the Player's Handbook. If either vessel is reduced to 0 Hit Points, the Folding Boat is destroyed.",
		],
		weight: 4,
		action: [["action", ""]],
	},
	"frost brand": {
		name: "Frost Brand",
		source: [["SRD24", 223], ["DMG24", 263]],
		type: "Weapon (Glaive, Greatsword, Longsword, Rapier, Scimitar, or Shortsword)",
		rarity: "Very Rare",
		magicItemTable: "Armaments",
		attunement: true,
		description: "This magic weapon deals an extra 1d6 Cold damage and grants me Resistance to Fire damage. In freezing temperatures, it sheds Bright Light in a 10-ft radius and Dim Light for an additional 10 ft. When I draw it, I can extinguish all nonmagical flames within 30 ft, but can't do so again for 1 hour.",
		descriptionFull: [
			"When you hit with an attack roll using this magic weapon, the target takes an extra 1d6 Cold damage. In addition, while you hold the weapon, you have Resistance to Fire damage.",
			"In freezing temperatures, the weapon sheds Bright Light in a 10-foot radius and Dim Light for an additional 10 feet.",
			"When you draw this weapon, you can extinguish all nonmagical flames within 30 feet of yourself. Once used, this property can't be used again for 1 hour.",
		],
		usages: 1,
		recovery: "Hour",
		additional: "extinguish flames",
		dmgres: ["Fire"],
		chooseGear: {
			type: "weapon",
			prefixOrSuffix: "suffix",
			descriptionChange: false,
			excludeCheck: function (inObjKey, inObj, v) {
				return !v.isMeleeWeapon || !/glaive|rapier|scimitar|sword/i.test(v.baseWeaponName);
			},
		},
		calcChanges: {
			atkAdd: [
				function (fields, v) {
					if (!v.theWea.isMagicWeapon && v.isMeleeWeapon && /glaive|rapier|scimitar|sword/i.test(v.baseWeaponName) && /^(?=.*frost)(?=.*brand).*$/i.test(v.WeaponTextName)) {
						v.theWea.isMagicWeapon = true;
						fields.Description += (fields.Description ? "; " : "") + "+1d6 Cold damage";
					};
				},
				'If I include the words "Frost Brand" in the name of a Glaive, Greatsword, Longsword, Rapier, Scimitar, or Shortsword, it will be treated as the magic weapon Frost Brand. It does +1d6 Cold damage.',
			],
		},
	},
	"gauntlets of ogre power": {
		name: "Gauntlets of Ogre Power",
		source: [["SRD24", 223], ["DMG24", 264]],
		type: "Wondrous Item",
		rarity: "Uncommon",
		magicItemTable: "Armaments",
		attunement: true,
		description: "My Strength score is 19 while I wear these gauntlets. They have no effect on me if my Strength is 19 or higher without them.",
		descriptionFull: "Your Strength score is 19 while you wear these gauntlets. They have no effect on you if your Strength is 19 or higher without them.",
		scoresOverride: [19, 0, 0, 0, 0, 0],
	},
	"gem of brightness": {
		name: "Gem of Brightness",
		source: [["SRD24", 223], ["DMG24", 264]],
		type: "Wondrous Item",
		rarity: "Uncommon",
		magicItemTable: "Arcana",
		description: "This gem has 50 charges. As a Magic action while holding it I can speak its command words to have it: shine 30-ft Bright \x26 30-ft Dim Light, fire a beam at 1 creature I can see in 60 ft (1 charge), or flare in 30-ft Cone (5 charges). Creatures hit by the beam or in the Cone must make a DC 15 Con save or be Blinded for 1 min" + (typePF ? "." : ", repeat save at each turn's end."),
		descriptionLong: [
			"This prism has 50 charges and becomes a nonmagical 50 GP jewel when depleted.",
			"As a Magic action while holding it, I can speak one of its three command words to have it:",
			" \u2022 Shed 30-ft Bright & 30-ft Dim Light till I end it as a Bonus Action or use the gem again;",
			" \u2022 Fire a brilliant beam of light at one creature that I can see within 60 ft (1 charge); or",
			" \u2022 Flare with intense light in a 30-ft Cone (5 charges).",
			"Creatures hit by the beam or in the Cone must succeed a DC 15 Con save or be Blinded for 1 minute. They repeat the save at the end of each of their turns to end the effect.",
		],
		descriptionFull: [
			"This prism has 50 charges. While you are holding it, you can take a Magic action and use one of three command words to cause one of the following effects:",
			" \u2022 **First Command Word**. The gem sheds Bright Light in a 30-foot radius and Dim Light for an additional 30 feet. This effect doesn't expend a charge. It lasts until you take a Bonus Action to repeat the command word or until you use another function of the gem.",
			" \u2022 **Second Command Word**. You expend 1 charge and cause the gem to fire a brilliant beam of light at one creature you can see within 60 feet of yourself. The creature must succeed on a DC 15 Constitution saving throw or have the Blinded condition for 1 minute. The creature repeats the save at the end of each of its turns, ending the effect on itself on a success.",
			" \u2022 **Third Command Word**. You expend 5 charges and cause the gem to flare with intense light in a 30-foot Cone. Each creature in the Cone makes a saving throw as if struck by the beam created with the second command word.",
			"When all of the gem's charges are expended, the gem becomes a nonmagical jewel worth 50 GP.",
		],
		usages: 50,
		recovery: "\u2013",
		weight: 1,
		action: [
			["action", " (activate)"],
			["bonus action", " (end light)"],
		],
	},
	"gem of seeing": {
		name: "Gem of Seeing",
		source: [["SRD24", 223], ["DMG24", 264]],
		type: "Wondrous Item",
		rarity: "Rare",
		magicItemTable: "Arcana",
		attunement: true,
		description: "This gem has 3 charges. As a Magic action, I can expend 1 charge. For the next 10 minutes, I have Truesight out to 120 ft when I peer through the gem. The gem regains 1d3 expended charges daily at dawn.",
		descriptionFull: [
			"This gem has 3 charges. As a Magic action, you can expend 1 charge. For the next 10 minutes, you have Truesight out to 120 feet when you peer through the gem.",
			"The gem regains 1d3 expended charges daily at dawn.",
		],
		usages: 3,
		recovery: "Dawn",
		additional: "regains 1d3",
		weight: 1,
		action: [["action", ""]],
	},
	"giant slayer": {
		name: "Giant Slayer",
		source: [["SRD24", 223], ["DMG24", 264]],
		type: "Weapon (Any Simple or Martial)",
		rarity: "Rare",
		magicItemTable: "Armaments",
		description: "I gain a +1 bonus to attack rolls and damage rolls made with this magic weapon. When I hit a Giant with this weapon, the Giant takes an extra 2d6 damage of the weapon's type and must succeed on a DC 15 Strength saving throw or have the Prone condition.",
		descriptionFull: [
			"You gain a +1 bonus to attack rolls and damage rolls made with this magic weapon.",
			"When you hit a Giant with this weapon, the Giant takes an extra 2d6 damage of the weapon's type and must succeed on a DC 15 Strength saving throw or have the Prone condition.",
		],
		chooseGear: {
			type: "weapon",
			prefixOrSuffix: "suffix",
			descriptionChange: ["replace", "weapon"],
			excludeCheck: function (inObjKey, inObj, v) {
				return !v.isSimpleOrMartial;
			},
		},
		calcChanges: {
			atkAdd: [
				function (fields, v) {
					if (!v.theWea.isMagicWeapon && v.isSimpleOrMartial && /^(?=.*giant)(?=.*slayer).*$/i.test(v.WeaponTextName)) {
						v.theWea.isMagicWeapon = true;
						fields.Description += (fields.Description ? "; " : "") + "Giants: +2d6 damage, DC 15 Str save or Prone";
					};
				},
				'If I include the words "Giant Slayer" in the name of a Simple or Martial weapon, it will be treated as the magic weapon Giant Slayer. It adds +1 to hit and damage and when hitting a creature with the Giant type, it does +2d6 damage and the target has to make a DC 15 Strength save or be knocked Prone.',
			],
			atkCalc: [
				function (fields, v, output) {
					if (v.isSimpleOrMartial && /^(?=.*giant)(?=.*slayer).*$/i.test(v.WeaponTextName)) {
						output.magic = v.thisWeapon[1] + 1;
					};
				}, "",
			],
		},
	},
	"glamoured studded leather": {
		name: "Glamoured Studded Leather",
		source: [["SRD24", 223], ["DMG24", 264]],
		type: "Armor (Studded Leather Armor)",
		rarity: "Rare",
		magicItemTable: "Implements",
		description: "While wearing this studded leather armor, I gain a +1 bonus to AC. As a Bonus Action, I can cause it look like a set of clothing or armor. I can decide its color, style, and accessories, but the armor retains its original bulk and weight. The illusion lasts until I use this property again or doff the armor.",
		descriptionFull: "While wearing this armor, you gain a +1 bonus to Armor Class. You can also take a Bonus Action to cause the armor to assume the appearance of a normal set of clothing or some other kind of armor. You decide what it looks like\u2014including color, style, and accessories\u2014but the armor retains its normal bulk and weight. The illusory appearance lasts until you use this property again or doff the armor.",
		weight: 13,
		armorOptions: [{
			regExpSearch: /^(?=.*glamou?r)(?=.*(studded|studs))(?=.*leather).*$/i,
			name: "Glamoured studded Leather",
			source: [["SRD24", 223], ["DMG24", 264]],
			type: "light",
			ac: "12+1",
			weight: 13,
			selectNow: true,
		}],
		action: [["bonus action", ""]],
	},
	"gloves of missile snaring": {
		name: "Gloves of Missile Snaring",
		source: [["SRD24", 224], ["DMG24", 265]],
		type: "Wondrous Item",
		rarity: "Uncommon",
		magicItemTable: "Implements",
		attunement: true,
		description: "As a Reaction when I'm hit by an attack roll made with a Ranged or Thrown weapon while I'm wearing these gloves and have a free hand, I can reduce the damage by 1d10 + my Dex modifier. If I reduce the damage to 0, I can catch the ammunition or weapon if it is small enough for me to hold in that hand.",
		descriptionFull: "If you're hit by an attack roll made with a Ranged or Thrown weapon while wearing these gloves, you can take a Reaction to reduce the damage by 1d10 plus your Dexterity modifier if you have a free hand. If you reduce the damage to 0, you can catch the ammunition or weapon if it is small enough for you to hold in that hand.",
		action: [["reaction", ""]],
	},
	"gloves of swimming and climbing": {
		name: "Gloves of Swimming and Climbing",
		source: [["SRD24", 224], ["DMG24", 265]],
		type: "Wondrous Item",
		rarity: "Uncommon",
		magicItemTable: "Implements",
		attunement: true,
		description: "While wearing these gloves, climbing and swimming don't cost me extra movement, and I gain a +5 bonus to Strength (Athletics) checks made to climb or swim.",
		descriptionFull: "While wearing these gloves, climbing and swimming don't cost you extra movement, and you gain a +5 bonus to Strength (Athletics) checks made to climb or swim.",
	},
	"gloves of thievery": {
		name: "Gloves of Thievery",
		source: [["SRD24", 224], ["DMG24", 265]],
		type: "Wondrous Item",
		rarity: "Uncommon",
		magicItemTable: "Implements",
		description: "These gloves are imperceptible while worn. While wearing them, I gain a +5 bonus to Dexterity (Sleight of Hand) checks.",
		descriptionFull: "These gloves are imperceptible while worn. While wearing them, you gain a +5 bonus to Dexterity (Sleight of Hand) checks.",
		addMod: [{
			type: "skill",
			field: "Sleight of Hand",
			mod: 5,
			text: "I gain a +5 bonus to Dexterity (Sleight of Hand) checks while wearing Gloves of Thievery.",
		}],
	},
	"goggles of night": {
		name: "Goggles of Night",
		source: [["SRD24", 224], ["DMG24", 265]],
		type: "Wondrous Item",
		rarity: "Uncommon",
		magicItemTable: "Implements",
		description: "While wearing these dark lenses, I have Darkvision out to 60 ft. If I already have Darkvision. wearing the goggles increases its range by 60 ft.",
		descriptionFull: "While wearing these dark lenses, you have Darkvision out to 60 feet. If you already have Darkvision, wearing the goggles increases its range by 60 feet.",
		vision: [
			["Darkvision", "fixed 60"],
			["Darkvision", "+60"],
		],
	},
	"hat of disguise": {
		name: "Hat of Disguise",
		source: [["SRD24", 224], ["DMG24", 266]],
		type: "Wondrous Item",
		rarity: "Uncommon",
		magicItemTable: "Arcana",
		attunement: true,
		description: "I can cast *Disguise Self* while wearing this hat. The spell ends if the hat is removed",
		descriptionFull: "While wearing this hat, you can cast the *Disguise Self* spell. The spell ends if the hat is removed.",
		spellcastingBonus: [{
			name: "At will",
			spells: ["disguise self"],
			selection: ["disguise self"],
			firstCol: "atwill",
		}],
		spellcastingAbility: "class",
	},
	"hat of many spells": {
		name: "Hat of Many Spells",
		source: [["SRD24", 224], ["DMG24", 266]],
		type: "Wondrous Item",
		rarity: "Very Rare",
		magicItemTable: "Arcana",
		attunement: true,
		prerequisite: "Requires Attunement by a Wizard",
		prereqeval: function (v) { return !!classes.known.wizard; },
		description: [
			'While holding this hat I can and use it as a Spellcasting Focus for my Wizard spells. Any spell cast using the hat gains a Somatic component: I must reach in and "pull" the spell out of it.',
			"Once per Short Rest, I can try to cast a level 1+ spell that I don't know. See the Notes page for details.",
		],
		descriptionFull: [
			"This pointed hat has the following properties.",
			'***Spellcasting Focus***. While holding the hat, you can use it as a Spellcasting Focus for your Wizard spells. Any spell you cast using the hat gains a special Somatic component: you must reach into the hat and "pull" the spell out of it.',
			"***Unknown Spell***. While holding the hat, you can try to cast a level 1+ spell you don't know. The spell must be on the Wizard spell list, it must be of a level you can cast, and it can't have Material components costing more than 1,000 GP. Once you decide on the spell, you must expend a spell slot of the spell's level. Then, to determine whether you cast the spell, make an Intelligence (Arcana) check (DC 10 plus the spell's level). On a successful check, you cast the spell using its normal casting time, and you can't use this property again until you finish a Short or Long Rest. On a failed check, you fail to cast the spell and a random effect occurs instead, determined by rolling on the following table.",
			"Any spell you cast from the hat uses your spell save DC and spell attack bonus.",
			[
				["1d100", "Effect"],
				["01-50", "You cast a random spell determined by rolling 1d10: on a **1**, *Enlarge/Reduce* (enlarge effect); on a **2**, *Enlarge/Reduce* (reduce effect); on a **3**, *Faerie Fire*; on a **4**, *Fireball*; on a **5**, *Gust of Wind*; on a **6**, *Invisibility* (cast on yourself); on a **7**, *Lightning Bolt*; on an **8**, *Phantasmal Force*; on a **9**, *Polymorph*; on a **10**, *Stinking Cloud*."],
				["51-55", "You have the Stunned condition until the end of your next turn, believing something awesome just happened."],
				["56-60", "A harmless swarm of butterflies fills a 10-foot Cube within 30 feet of yourself. The swarm disperses after 1 minute."],
				["61-65", "You pull a nonmagical object out of the hat. Roll 1d4 to determine the object: on a **1**, a vial of Acid; on a **2**, a flask of Alchemist's Fire; on a **3**, a Crowbar; on a **4**, a lit Torch."],
				["66-70", 'You suffer a bout of "magic sickness" and have the Poisoned condition for 1 hour.'],
				["71-75", "You have the Petrified condition until the end of your next turn."],
				["76-80", "You pull a nonmagical object out of the hat. Roll 1d4 to determine the object: on a **1**, a Dagger; on a **2**, a Rope with a Grappling Hook tied to one end; on a **3**, a bag of Caltrops; on a **4**, a gem worth 50 GP."],
				["81-85", "A creature appears in an unoccupied space as close to you as possible. The creature isn't under your control and acts as it normally would, and it disappears after 1 hour or when it drops to 0 Hit Points. Roll 1d4 to determine the creature: on a **1**, a **Camel**; on a **2**, a **Constrictor Snake**; on a **3**, an **Elephant**; on a **4**, a **Mule**."],
				["86-90", "A Hostile **Swarm of Bats** flies out of the hat, occupies your space, and attacks you."],
				["91-95", "A vertical, 10-foot-diameter, two-way portal to another plane of existence opens in an unoccupied space within 30 feet of you and remains open until the end of your next turn. The DM determines where it leads."],
				["96-00", "You pull a magic item out of the hat. Roll 1d6 to determine the item's rarity: on a **1-3**, Common; on a **4-5**, Uncommon; on a **6**, Rare. The DM chooses the item, which disappears after 1 hour if it's not consumed or destroyed before then."],
			],
		],
		usages: 1,
		recovery: "Short Rest",
		spellcastingBonus: [{
			name: "Random Spells 1-2",
			spells: ["enlarge/reduce"],
			selection: ["enlarge/reduce"],
		}, {
			name: "Random Spell 3",
			spells: ["faerie fire"],
			selection: ["faerie fire"],
			firstCol: 3,
		}, {
			name: "Random Spell 4",
			spells: ["fireball"],
			selection: ["fireball"],
			firstCol: 4,
		}, {
			name: "Random Spell 5",
			spells: ["gust of wind"],
			selection: ["gust of wind"],
			firstCol: 5,
		}, {
			name: "Random Spell 6",
			spells: ["invisibility"],
			selection: ["invisibility"],
			firstCol: 6,
		}, {
			name: "Random Spell 7",
			spells: ["lightning bolt"],
			selection: ["lightning bolt"],
			firstCol: 7,
		}, {
			name: "Random Spell 8",
			spells: ["phantasmal force"],
			selection: ["phantasmal force"],
			firstCol: 8,
		}, {
			name: "Random Spell 9",
			spells: ["polymorph"],
			selection: ["polymorph"],
			firstCol: 9,
		}, {
			name: "Random Spell 10",
			spells: ["stinking cloud"],
			selection: ["stinking cloud"],
			firstCol: 10,
		}],
		spellcastingAbility: "class",
		spellFirstColTitle: "d10",
		spellChanges: {
			"enlarge/reduce": {
				firstCol: 1,
				description: "1 crea/obj save or +1 size category, Adv on Str saves/checks, +1d4 weapon/unarmed dmg",
				changes: "This randomly cast *Enlarge/Reduce* only applies the Enlarge effect.",
			},
			"enlarge/reduce-1-reduced": {
				firstCol: 2,
				description: "1 crea/obj save or -1 size category, Disadv on Str saves/checks, -1d4 wea/unarmed dmg (min 1 dmg)",
				changes: "This randomly cast *Enlarge/Reduce* only applies the Reduce effect.",
			},
			"invisibility": {
				description: "I become Invisible; attacking, casting, or dealing damage ends the spell",
				changes: "This randomly cast *Invisibility* only applies to me.",
			},
		},
		toNotesPage: [{
			name: "Unknown Spell",
			note: [
				"While holding the *Hat of Many Spells*, I can try to cast a level 1+ spell that I don't know. The spell must be on the Wizard spell list, it must be of a level that I can cast, and it can't have Material components costing more than 1,000 GP. Any spell that I cast from the hat uses my spell save DC and spell attack bonus. Once I decide on the spell, I must expend a spell slot of the spell's level. Then, to determine whether I cast the spell, make an Intelligence (Arcana) check (DC 10 plus the spell's level). On a successful check, I cast the spell using its normal casting time, and can't use this property again until I finish a Short or Long Rest. On a failed check, I fail to cast the spell and a random effect occurs instead, determined by rolling on the following table.",
				[
					["1d100", "Effect"],
					["01\u201350", "I cast a random spell determined by rolling 1d10."],
					["", "**1d10** **Spell**"],
					["", "  1    *Enlarge/Reduce* (enlarge effect)"],
					["", "  2    *Enlarge/Reduce* (reduce effect)"],
					["", "  3    *Faerie Fire*"],
					["", "  4    *Fireball*"],
					["", "  5    *Gust of Wind*"],
					["", "  6    *Invisibility* (cast on me)"],
					["", "  7    *Lightning Bolt*"],
					["", "  8    *Phantasmal Force*"],
					["", "  9    *Polymorph*"],
					["", "10    *Stinking Cloud*"],
					["51\u201355", "I have the Stunned condition until the end of my next turn, believing something awesome just happened."],
					["56\u201360", "A harmless swarm of butterflies fills a 10-ft Cube within 30 ft of me. The swarm disperses after 1 minute."],
					["61\u201365", "I pull a nonmagical object out of the hat determined by rolling 1d4."],
					["", "**1d4**  **Object**"],
					["", " 1    Vial of Acid"],
					["", " 2    Flask of Alchemist's Fire"],
					["", " 3    Crowbar"],
					["", " 4    Lit Torch"],
					["66\u201370", 'I suffer a bout of "magic sickness" and have the Poisoned condition for 1 hour.'],
					["71\u201375", "I have the Petrified condition until the end of my next turn."],
					["76\u201380", "I pull a nonmagical object out of the hat determined by rolling 1d4."],
					["", "**1d4**  **Object**"],
					["", " 1    Dagger"],
					["", " 2    Rope with a Grappling Hook tied to one end"],
					["", " 3    Bag of Caltrops"],
					["", " 4    Gem worth 50 GP"],
					["81\u201385", "A creature appears in an unoccupied space as close to me as possible determined by rolling 1d4. The creature isn't under my control and acts as it normally would, and it disappears after 1 hour or when it drops to 0 Hit Points."],
					["", "**1d4**  **Creature**"],
					["", " 1    Camel"],
					["", " 2    Constrictor Snake"],
					["", " 3    Elephant"],
					["", " 4    Mule"],
					["86\u201390", "A Hostile Swarm of Bats flies out of the hat, occupies my space, and attacks me."],
					["91\u201395", "A vertical, 10-ft-diameter, two-way portal to another plane of existence opens in an unoccupied space within 30 ft of me and remains open until the end of my next turn. The DM determines where it leads."],
					["96\u201300", "I pull a magic item out of the hat, its rarity determined by rolling 1d6. The DM chooses the item, which disappears after 1 hour if it's not consumed or destroyed before then."],
					["", "**1d6**    **Rarity**"],
					["", "1\u20133    Common"],
					["", "4\u20135    Uncommon"],
					["", "  6      Rare"],
				],
			],
		}],
	},
	"headband of intellect": {
		name: "Headband of Intellect",
		source: [["SRD24", 225], ["DMG24", 268]],
		type: "Wondrous Item",
		rarity: "Uncommon",
		magicItemTable: "Arcana",
		attunement: true,
		description: "My Intelligence score is 19 while I wear this headband. It has no effect on me if my Intelligence is 19 or higher without it.",
		descriptionFull: "Your Intelligence score is 19 while you wear this headband. It has no effect on you if your Intelligence is 19 or higher without it.",
		scoresOverride: [0, 0, 0, 19, 0, 0],
	},
	"helm of brilliance": {
		name: "Helm of Brilliance",
		source: [["SRD24", 225], ["DMG24", 268]],
		type: "Wondrous Item",
		rarity: "Very Rare",
		magicItemTable: "Arcana",
		attunement: true,
		description: "This helm is set with diamonds, rubies, fire opals, and opals. Gems pried from the helm turn to dust. When all the gems are removed or destroyed, the helm loses its magic. Each gem has a special property and each lets me cast a different spell. See Notes page.",
		descriptionFull: [
			"This helm is set with 1d10 diamonds, 2d10 rubies, 3d10 fire opals, and 4d10 opals. Any gem pried from the helm crumbles to dust. When all the gems are removed or destroyed, the helm loses its magic.",
			"You gain the following benefits while wearing the helm.",
			"***Diamond Light***. As long as it has at least one diamond, the helm emits a 30-foot Emanation. When at least one Undead is within that area, the Emanation is filled with Dim Light. Any Undead that starts its turn in that area takes 1d6 Radiant damage.",
			"***Fire Opal Flames***. As long as the helm has at least one fire opal, you can take a Magic action to cause one weapon you are holding to burst into flames. The flames emit Bright Light in a 10-foot radius and Dim Light for an additional 10 feet. The flames are harmless to you and the weapon. When you hit with an attack using the blazing weapon, the target takes an extra 1d6 Fire damage. The flames last until you take a Bonus Action to extinguish them or until you drop or stow the weapon.",
			"***Ruby Resistance***. As long as the helm has at least one ruby, you have Resistance to Fire damage.",
			"***Spells***. You can cast one of the following spells (save DC 18), using one of the helm's gems of the specified type as a component: *Daylight* (opal), *Fireball* (fire opal), *Prismatic Spray* (diamond), or *Wall of Fire* (ruby). The gem is destroyed when the spell is cast and disappears from the helm.",
			"***Taking Fire Damage***. Roll 1d20 if you are wearing the helm and take Fire damage as a result of failing a saving throw against a spell. On a roll of 1, the helm emits beams of light from its remaining gems and is then destroyed. Each creature within a 60-foot Emanation originating from you must succeed on a DC 17 Dexterity saving throw or be struck by a beam, taking Radiant damage equal to the number of gems in the helm.",
		],
		dmgres: ["Fire (if ruby in helm)"],
		action: [
			["action", " (fire opal flames)"],
			["bonus action", " (end fire opal flames)"],
		],
		extraLimitedFeatures: [{
			name: "Helm of Brilliance - Diamonds (D)",
			usages: " ", // 1d10 - Intentionally left blank
			recovery: "\u2013",
		}, {
			name: "Helm of Brilliance - Rubies (R)",
			usages: " ", // 2d10 - Intentionally left blank
			recovery: "\u2013",
		}, {
			name: "Helm of Brilliance - Fire Opals (F)",
			usages: " ", // 3d10 - Intentionally left blank
			recovery: "\u2013",
		}, {
			name: "Helm of Brilliance - Opals (O)",
			usages: " ", // 4d10 - Intentionally left blank
			recovery: "\u2013",
		}],
		fixedDC: 18,
		spellFirstColTitle: "GE",
		spellcastingBonus: [{
			name: "Uses an opal (O)",
			spells: ["daylight"],
			selection: ["daylight"],
			firstCol: "(O)",
		}, {
			name: "Uses a fire opal (F)",
			spells: ["fireball"],
			selection: ["fireball"],
			firstCol: "(F)",
		}, {
			name: "Uses a diamond (D)",
			spells: ["prismatic spray"],
			selection: ["prismatic spray"],
			firstCol: "(D)",
		}, {
			name: "Uses a ruby (R)",
			spells: ["wall of fire"],
			selection: ["wall of fire"],
			firstCol: "(R)",
		}],
		spellChanges: {
			"daylight": {
				components: "M\u0192,M\u2020",
				compMaterial: "The only component for casting *Daylight* from the *Helm of Brilliance* is one of the opals in the helm which is destroyed and disappears when the spell is cast.",
				changes: "Using the *Helm of Brilliance* to cast *Daylight* causes one of the opals in the helm to to be destroyed and disappear when the spell is cast.",
			},
			"fireball": {
				components: "M\u0192,M\u2020",
				compMaterial: "The only component for casting *Fireball* from the *Helm of Brilliance* is one of the fire opals in the helm which is destroyed and disappears when the spell is cast.",
				changes: "Using the *Helm of Brilliance* to cast *Fireball* causes one of the fire opals in the helm to to be destroyed and disappear when the spell is cast.",
			},
			"prismatic spray": {
				components: "M\u0192,M\u2020",
				compMaterial: "The only component for casting *Prismatic Spray* from the *Helm of Brilliance* is one of the diamonds in the helm which is destroyed and disappears when the spell is cast.",
				changes: "Using the *Helm of Brilliance* to cast *Prismatic Spray* causes one of the diamonds in the helm to to be destroyed and disappear when the spell is cast.",
			},
			"wall of fire": {
				components: "M\u0192,M\u2020",
				compMaterial: "The only component for casting *Wall of Fire* from the *Helm of Brilliance* is one of the rubies in the helm which is destroyed and disappears when the spell is cast.",
				changes: "Using the *Helm of Brilliance* to cast *Wall of Fire* causes one of the rubies in the helm to to be destroyed and disappear when the spell is cast.",
			},
		},
		toNotesPage: [{
			name: "Helm of Brilliance",
			note: [
				"This helm is set with 1d10 diamonds, 2d10 rubies, 3d10 fire opals, and 4d10 opals. Any gem pried from the helm crumbles to dust. When all the gems are removed or destroyed, the helm loses its magic.",
				"While wearing the helm, if I take Fire damage as a result of failing a saving throw against a spell, I must Roll 1d20. On a roll of 1, the helm emits beams of light from its remaining gems and each creature within a 60-foot Emanation originating from me must succeed on a DC 17 Dexterity saving throw or be struck by a beam taking Radiant damage equal to the number of gems in the helm. The helm is then destroyed.",
				"Each gem conveys the following benefits while wearing the helm:",
				"***Diamond.*** As long as it has at least one diamond, the helm emits a 30-foot Emanation. When at least one Undead is within that area, the Emanation is filled with Dim Light. Any Undead that starts its turn in that area takes 1d6 Radiant damage.",
				"I can use a diamond to cast *Prismatic Spray* (save DC 18), using the gem as a component. The diamond is destroyed when the spell is cast and disappears from the helm.",
				"***Fire Opal.*** As a Magic action as long as the helm has at least one fire opal, I can cause one weapon I am holding to burst into flames. The flames emit Bright Light in a 10-ft radius and Dim Light for an additional 10 ft. The flames are harmless to me and the weapon. When I hit with an attack using the blazing weapon, the target takes an extra 1d6 Fire damage. The flames last until I take a Bonus Action to extinguish them or until I drop or stow the weapon.",
				"I can use a fire opal to cast *Fireball* (save DC 18), using the gem as a component. The fire opal is destroyed when the spell is cast and disappears from the helm.",
				"***Ruby.*** As long as the helm has at least one ruby, I have Resistance to Fire damage.",
				"I can use a ruby to cast *Wall of Fire* (save DC 18), using the gem as a component. The ruby is destroyed when the spell is cast and disappears from the helm.",
				"***Opal.*** I can use an opal to cast *Daylight*, using the gem as a component. The opal is destroyed when the spell is cast and disappears from the helm.",
			],
		}],
	},
	"helm of comprehending languages": {
		name: "Helm of Comprehending Languages",
		source: [["SRD24", 226], ["DMG24", 268]],
		type: "Wondrous Item",
		rarity: "Uncommon",
		magicItemTable: ["Arcana", "Implements"],
		description: "While wearing this helm, I can cast *Comprehend Languages* from it.",
		descriptionFull: "While wearing this helm, you can cast *Comprehend Languages* from it.",
		spellcastingBonus: [{
			name: "At will",
			spells: ["comprehend languages"],
			selection: ["comprehend languages"],
			firstCol: "atwill",
		}],
	},
	"helm of telepathy": {
		name: "Helm of Telepathy",
		source: [["SRD24", 226], ["DMG24", 268]],
		type: "Wondrous Item",
		rarity: "Uncommon",
		magicItemTable: "Arcana",
		attunement: true,
		description: "While wearing this helm, I have telepathy with a range of 30 ft, and can cast *Detect Thoughts* or *Suggestion* (save DC 13) from the helm. Once either spell is cast from the helm, that spell can't be cast from it again until the next dawn.",
		descriptionFull: "While wearing this helm, you have telepathy with a range of 30 feet, and you can cast *Detect Thoughts* or *Suggestion* (save DC 13) from the helm. Once either spell is cast from the helm, that spell can't be cast from it again until the next dawn.",
		fixedDC: 13,
		vision: [["Telepathy", "fixed 30"]],
		spellcastingBonus: [{
			name: "Once per dawn",
			spells: ["detect thoughts"],
			selection: ["detect thoughts"],
			firstCol: "onceday",
		}, {
			name: "Once per dawn",
			spells: ["suggestion"],
			selection: ["suggestion"],
			firstCol: "onceday",
		}],
	},
	"helm of teleportation": {
		name: "Helm of Teleportation",
		source: [["SRD24", 226], ["DMG24", 268]],
		type: "Wondrous Item",
		rarity: "Rare",
		magicItemTable: "Arcana",
		attunement: true,
		description: "This helm has 3 charges. While wearing it, I can expend 1 charge to cast *Teleport* from it. The helm regains 1d3 expended charges daily at dawn.",
		descriptionFull: "This helm has 3 charges. While wearing it, you can expend 1 charge to cast *Teleport* from it. The helm regains 1d3 expended charges daily at dawn.",
		usages: 3,
		recovery: "Dawn",
		additional: "regains 1d3",
		spellFirstColTitle: "Ch",
		spellcastingBonus: [{
			name: "1 charge",
			spells: ["teleport"],
			selection: ["teleport"],
			firstCol: "1",
		}],
	},
	"heward's handy haversack": {
		name: "Heward's Handy Haversack",
		nameAlt: "Handy Haversack",
		source: [["SRD24", 224], ["DMG24", 269]],
		type: "Wondrous Item",
		rarity: "Rare",
		magicItemTable: ["Arcana", "Implements"],
		description: "This backpack always weighs 5 lb. It has two side pouches that hold 200 lb (25 cu ft) each and a central pouch that holds 500 lb (64 cu ft). Retrieving an item from it requires a Utilize action or Bonus Action. If overloaded or damaged, the contents and bag are destroyed. If turned inside out, all its contents spill forth.",
		descriptionLong: "This backpack has a central pouch and two side pouches, each is an extradimensional space. Each side pouch can hold up to 200 lb (25 cu ft) each and the central pouch holds up to 500 lb (64 cu ft). The haversack always weighs 5 pounds, regardless of its contents. Retrieving an item from it requires a Utilize action or Bonus Action (my choice). If the haversack is turned inside out, all its contents spill forth. If any pouch is overloaded pierced or torn, the haversack is destroyed and its contents lost. Placing the haversack in another extradimensional space destroys both and opens a gate to the Astral Plane.",
		descriptionFull: [
			"This backpack has a central pouch and two side pouches, each of which is an extradimensional space. Each side pouch can hold up to 200 pounds of material, not exceeding a volume of 25 cubic feet. The central pouch can hold up to 500 pounds of material, not exceeding a volume of 64 cubic feet. The haversack always weighs 5 pounds, regardless of its contents.",
			"Retrieving an item from the haversack requires a Utilize action or a Bonus Action (your choice). When you reach into the haversack for a specific item, the item is always magically on top.",
			"If any of its pouches is overloaded, pierced, or torn, the haversack ruptures and is destroyed. If the haversack is destroyed, its contents are lost forever, although an Artifact always turns up again somewhere. If the haversack is turned inside out, its contents spill forth unharmed, and the haversack must be put right before it can be used again.",
			"Each pouch of the haversack holds enough air for 10 minutes of breathing, divided by the number of breathing creatures inside.",
			"Placing the haversack inside an extradimensional space created by a *Bag of Holding*, *Portable Hole*, or similar item instantly destroys both items and opens a gate to the Astral Plane. The gate originates where the one item was placed inside the other. Any creature within 10 feet of the gate and not behind Total Cover is sucked through it and deposited in a random location on the Astral Plane. The gate then closes. The gate is one-way only and can't be reopened.",
		],
		weight: 5,
		action: [["action", " (retrieve item)"], ["bonus action", " (retrieve item)"]],
	},
	"holy avenger": {
		name: "Holy Avenger",
		source: [["SRD24", 226], ["DMG24", 269]],
		type: "Weapon (Any Simple or Martial)",
		rarity: "Legendary",
		magicItemTable: ["Armaments", "Relics"],
		attunement: true,
		description: "Select one of the choices.",
		descriptionFull: [
			"You gain a +3 bonus to attack rolls and damage rolls made with this magic weapon. When you hit a Fiend or an Undead with it, that creature takes an extra 2d10 Radiant damage.",
			"While you hold the drawn weapon, it creates a 10-foot Emanation originating from you. You and all creatures Friendly to you in the Emanation have Advantage on saving throws against spells and other magical effects. If you have 17 or more levels in the Paladin class, the size of the Emanation increases to 30 feet.",
		],
		chooseGear: {
			type: "weapon",
			prefixOrSuffix: "suffix",
			itemName1stPage: ["suffix", "Holy Avenger"],
			descriptionChange: false,
			excludeCheck: function (inObjKey, inObj, v) {
				return !v.isSimpleOrMartial;
			},
		},
		calcChanges: {
			atkAdd: [
				function (fields, v) {
					if (!v.theWea.isMagicWeapon && v.isSimpleOrMartial && /^(?=.*holy)(?=.*avenger).*$/i.test(v.WeaponTextName)) {
						v.theWea.isMagicWeapon = true;
						fields.Description += (fields.Description ? "; " : "") + "+2d10 Radiant damage vs Fiends/Undead";
					};
				},
				'If I include the words "Holy Avenger" in the name of a Simple or Martial weapon, it will be treated as the magic weapon Holy Avenger. It adds +3 to hit and damage and deals +2d10 Radiant damage to Fiends and Undead.',
			],
			atkCalc: [
				function (fields, v, output) {
					if (v.isSimpleOrMartial && /^(?=.*holy)(?=.*avenger).*$/i.test(v.WeaponTextName)) {
						output.magic = v.thisWeapon[1] + 3;
					};
				}, "",
			],
		},
		savetxt: { adv_vs: ["spells", "magical effects"] },
		choices: ["Paladin level 1-16 (10-ft aura)", "Paladin level 17+ (30-ft aura)"],
		selfChoosing: function () {
			return !classes.known.paladin ? "" : classes.known.paladin.level < 17 ? "paladin level 1-16 (10-ft aura)" : "paladin level 17+ (30-ft aura)";
		},
		"paladin level 1-16 (10-ft aura)": {
			name: "Holy\uFEFF Avenger",
			description: "I have a +3 bonus to attack and damage rolls made with this magic weapon. It deals +2d10 Radiant damage against Fiends and Undead. While holding the drawn weapon, a 10-ft radius Emanation originates from me that grants my allies and I Advantage on saves against spells and magical effects.",
			prerequisite: "Requires Attunement by a Paladin",
			prereqeval: function (v) { return !!classes.known.paladin; },
		},
		"paladin level 17+ (30-ft aura)": {
			name: "Holy \uFEFFAvenger",
			description: "I have a +3 bonus to attack and damage rolls made with this magic weapon. It deals +2d10 Radiant damage against Fiends and Undead. While holding the drawn weapon, a 30-ft radius Emanation originates from me that grants my allies and I Advantage on saves against spells and magical effects.",
			prerequisite: "Requires Attunement by a level 17+ Paladin",
			prereqeval: function (v) {
				return !!(classes.known.paladin && classes.known.paladin.level >= 17);
			},
		},
	},
	"horn of blasting": {
		name: "Horn of Blasting",
		source: [["SRD24", 226], ["DMG24", 270]],
		type: "Wondrous Item",
		rarity: "Rare",
		magicItemTable: ["Armaments", "Relics"],
		description: "As a Magic action, all creatures in a 30-ft Cone must make a DC 15 Con save, taking 5d8 Thunder damage and be Deafened on a failure, or half as much and not Deafened on a success. Glass or crystal objects take 10d6 damage. Each use has a 20% chance to cause the horn to explode dealing 10d6 Force damage to me.",
		descriptionLong: "As a Magic action I can blow the horn, which emits a thunderous blast in a 30-ft Cone that is audible out to 600 ft. Each creature in the Cone makes a DC 15 Con save. On a failed save, a creature takes 5d8 Thunder damage and has the Deafened condition for 1 minute. On a successful save, a creature takes half as much damage only. Glass or crystal objects in the Cone that aren't being worn or carried take 10d8 Thunder damage. Each use of the horn's magic has a 20 percent chance of causing the horn to explode. The explosion deals 10d6 Force damage to me and destroys the horn.",
		descriptionFull: [
			"You can take a Magic action to blow the horn, which emits a thunderous blast in a 30-foot Cone that is audible out to 600 feet. Each creature in the Cone makes a DC 15 Constitution saving throw. On a failed save, a creature takes 5d8 Thunder damage and has the Deafened condition for 1 minute. On a successful save, a creature takes half as much damage only. Glass or crystal objects in the Cone that aren't being worn or carried take 10d8 Thunder damage.",
			"Each use of the horn's magic has a 20 percent chance of causing the horn to explode. The explosion deals 10d6 Force damage to the user and destroys the horn.",
		],
		weight: 2,
		action: [["action", ""]],
	},
	"horn of valhalla": (function () {
		var obj = {
			name: "Horn of Valhalla",
			source: [["SRD24", 226], ["DMG24", 270]],
			type: "Wondrous Item",
			magicItemTable: ["Armaments", "Relics"],
			description: "Select one of the choices.",
			descriptionFull: [
				"You can take a Magic action to blow this horn. In response, warrior spirits from the plane of Ysgard appear in unoccupied spaces within 60 feet of you. Each spirit uses the **Berserker** stat block and returns to Ysgard after 1 hour or when it drops to 0 Hit Points. The spirits look like living, breathing warriors, and they have Immunity to the Charmed and Frightened conditions. Once you use the horn, it can't be used again until 7 days have passed.",
				"Four types of *Horn of Valhalla* are known to exist, each made of a different metal. The horn's type determines how many spirits it summons, as well as the requirement for its use. The DM chooses the horn's type or determines it randomly by rolling on the following table.",
				"If you blow the horn without meeting its requirement, the summoned spirits attack you. If you meet the requirement, they are Friendly to you and your allies and follow your commands.",
				[
					["1d100", "Horn Type", "Spirits", "Requirement"],
					["01-40", "Silver", "2", "None"],
					["41-75", "Brass", "3", "Proficiency with all Simple weapons"],
					["76-90", "Bronze", "4", "Training with all Medium armor"],
					["91-00", "Iron", "5", "Proficiency with all Martial weapons"],
				],
			],
			weight: 2,
			usages: 1,
			recovery: "7 days",
			creaturesAdd: [["Warrior Spirit", true]],
			creatureOptions: [{
				name: "Berserker",
				nameThis: "spirit",
				source: [["SRD24", 263], ["MM24", 37]],
				eval: function (prefix) {
					Value(prefix + "Comp.Desc.Name", "Horn of Valhalla's Warrior Spirit");
					Value(prefix + "Comp.Type", "Summon");
					Value(prefix + "Comp.Use.Attack.1.Weapon Selection", "Greataxe");
				},
				size: [4, 3],
				type: "Humanoid",
				alignment: "Neutral",
				ac: 13,
				hp: 67,
				hd: [9, 8],
				speed: "30 ft",
				scores: [16, 12, 17, 9, 11, 9],
				passivePerception: 10,
				languages: "Common",
				immunities: "Charmed, Frightened",
				challengeRating: "2",
				proficiencyBonus: 2,
				attacksAction: 1,
				attacks: [],
				traits: [{
					name: "Bloodied Frenzy",
					description: "While Bloodied, the [THIS] has Advantage on attack rolls and saving throws.",
				}],
				features: [{
					name: "Summoned",
					description: "The [THIS] is Friendly to its summoner and their companions and follows the commands of its summoner. It returns to Ysgard after 1 hour or when it drops to 0 Hit Points.",
				}],
			}],
			allowDuplicates: true,
			choices: [],
		};

		var hornTypes = [
			{ metal: "Silver", spiritCount: 2, rarity: "Rare" },
			{ metal: "Brass", spiritCount: 3, rarity: "Rare", requirement: "Simple weapons" },
			{ metal: "Bronze", spiritCount: 4, rarity: "Very Rare", requirement: "Medium armor" },
			{ metal: "Iron", spiritCount: 5, rarity: "Legendary", requirement: "Martial weapons" },
		];
		hornTypes.forEach(function (hornType) {
			var metal = hornType.metal;
			var spiritCount = hornType.spiritCount;
			var rarity = hornType.rarity;
			var requirement = hornType.requirement;

			var hasArmorRequirement = requirement ? requirement.indexOf("armor") >= 0 : false;

			var choiceName = metal + " (" + rarity + "; " + spiritCount + " spirits" + (!requirement ? "" : "; req: " + requirement + " " + (hasArmorRequirement ? "training" : "proficiency")) + ")";
			obj.choices.push(choiceName);

			var friendlySection = "They are Friendly to me and my allies and follow my commands.";

			if (requirement) {
				friendlySection = "If I'm " + (hasArmorRequirement ? "trained" : "proficient") + " with all " + requirement + ", they are Friendly to me and my allies and follow my commands. Otherwise, they attack me.";
			}

			obj[choiceName.toLowerCase()] = {
				name: metal + " Horn of Valhalla",
				sortname: "Horn of Valhalla, " + metal,
				rarity: rarity,
				description: "As a Magic action once every 7 days, I can blow this horn to summon " + spiritCount + " warrior spirits within 60 ft. They are **Berserkers** and disappear after 1 hour, or when they drop to 0 HP. " + friendlySection,
				descriptionFull: [
					"You can take a Magic action to blow this " + metal.toLowerCase() + " horn. In response, warrior spirits from the plane of Ysgard appear in unoccupied spaces within 60 feet of you. Each spirit uses the **Berserker** stat block and returns to Ysgard after 1 hour or when it drops to 0 Hit Points. The spirits look like living, breathing warriors, and they have Immunity to the Charmed and Frightened conditions. Once you use the horn, it can't be used again until 7 days have passed.",
					"This horn requires that you be " + (hasArmorRequirement ? "trained" : "proficient") + " with all " + requirement + ".",
					"If you blow the horn without meeting its requirement, the summoned spirits attack you. If you meet the requirement, they are Friendly to you and your allies and follow your commands.",
				],
				action: [["action", " (blow)"]],
			};
		});

		return obj;
	})(),
	"horseshoes of a zephyr": {
		name: "Horseshoes of a Zephyr",
		source: [["SRD24", 226], ["DMG24", 270]],
		type: "Wondrous Item",
		rarity: "Very Rare",
		magicItemTable: ["Arcana", "Implements"],
		description: "As a Magic action, I can affix/remove one shoe to the hooves of a creature. With all four affixed, it floats 4 inches above the floor while moving, leaves no tracks, can cross/stand above liquid or unstable surfaces, ignores Difficult Terrain, and doesn't suffer Exhaustion from moving at normal speed for 12 hours a day.",
		descriptionLong: "These horseshoes come in a set of four. As a Magic action, I can touch one of the horseshoes to the hoof of a horse or similar creature, whereupon the horseshoe affixes itself. Removing it also takes a Magic action. While all four shoes are affixed to the hooves of a creature, they allow it to move normally while floating 4 inches above the floor. The creature leaves no tracks, can cross or stand above liquid or unstable surfaces, ignores Difficult Terrain, and doesn't suffer Exhaustion from moving at normal speed for 12 hours a day.",
		descriptionFull: [
			"These horseshoes come in a set of four. As a Magic action, you can touch one of the horseshoes to the hoof of a horse or similar creature, whereupon the horseshoe affixes itself to the hoof. Removing a horseshoe also takes a Magic action.",
			"While all four shoes are affixed to the hooves of a horse or similar creature, they allow the creature to move normally while floating 4 inches above a surface. This effect means the creature can cross or stand above nonsolid or unstable surfaces, such as water or lava. The creature leaves no tracks and ignores Difficult Terrain. In addition, the creature can travel for up to 12 hours a day without gaining Exhaustion levels from extended travel.",
		],
	},
	"horseshoes of speed": {
		name: "Horseshoes of Speed",
		source: [["SRD24", 227], ["DMG24", 270]],
		type: "Wondrous Item",
		rarity: "Rare",
		magicItemTable: ["Arcana", "Implements"],
		description: "These horseshoes come in a set of four. As a Magic action, I can touch one of the horseshoes to the hoof of a horse or similar creature, whereupon the horseshoe affixes itself. Removing it also takes a Magic action. While all four horseshoes are attached to the same creature, its Speed is increased by 30 ft.",
		descriptionFull: [
			"These horseshoes come in a set of four. As a Magic action, you can touch one of the horseshoes to the hoof of a horse or similar creature, whereupon the horseshoe affixes itself to the hoof. Removing a horseshoe also takes a Magic action.",
			"While all four horseshoes are attached to the same creature, its Speed is increased by 30 feet.",
		],
	},
	"immovable rod": {
		name: "Immovable Rod",
		source: [["SRD24", 227], ["DMG24", 270]],
		type: "Rod",
		rarity: "Uncommon",
		magicItemTable: ["Arcana", "Implements"],
		description: "This iron rod has a button on one end. As a Utilize action, I can press the button, magically fixing the rod in place, or unfixing it. Once fixed, it holds up to 8,000 lb. More weight causes it to deactivate and fall. As a Utilize action, someone can make a DC 30 Athletics check to move the rod up to 10 ft.",
		descriptionFull: "This iron rod has a button on one end. You can take a Utilize action to press the button, which causes the rod to become magically fixed in place. Until you or another creature takes a Utilize action to push the button again, the rod doesn't move, even if it defies gravity. The rod can hold up to 8,000 pounds of weight. More weight causes the rod to deactivate and fall. A creature can take a Utilize action to make a DC 30 Strength (Athletics) check, moving the fixed rod up to 10 feet on a successful check.",
		weight: 2,
		action: [["action", " (activate/deactivate)"]],
	},
	"ioun stone": function () {
		var defaultDescription = [
			"Roughly marble sized, *Ioun Stones* are named after Ioun, a god of knowledge and prophecy revered on some worlds. Many types of *Ioun Stones* exist, each type a distinct combination of shape and color.",
			"When you take a Magic action to toss an *Ioun Stone* into the air, the stone orbits your head at a distance of 1d3 feet, conferring its benefit to you while doing so. You can have up to three *Ioun Stones* orbiting your head at the same time.",
			"Each *Ioun Stone* orbiting your head is considered to be an object you are wearing. The orbiting stone avoids contact with other creatures and objects, adjusting its orbit to avoid collisions and thwarting all attempts by other creatures to attack or snatch it.",
			"As a Utilize action, you can seize and stow any number of *Ioun Stones* orbiting your head. If your Attunement to an *Ioun Stone* ends while it's orbiting your head, the stone falls as though you had dropped it.",
		];
		var fullTossStowText = " As a Magic action, I can toss the stone into the air where it orbits my head at distance of 1d3 ft. As a Utilize action, I can seize and stow any *Ioun Stones* orbiting my head.";
		var obj = {
			name: "Ioun Stone",
			source: [["SRD24", 227], ["DMG24", 273]],
			type: "Wondrous Item",
			attunement: true,
			description: "Select one of the choices.",
			descriptionFull: defaultDescription.concat([
				"The type of stone determines its rarity and effects.",
			]),
			action: [["action", " (activate/stow)"]],
			allowDuplicates: true,
			choices: ["Absorption (Very Rare)", "Agility (Very Rare)", "Awareness (Rare)", "Fortitude (Very Rare)", "Greater Absorption (Legendary)", "Insight (Very Rare)", "Intellect (Very Rare)", "Leadership (Very Rare)", "Mastery (Legendary)", "Protection (Rare)", "Regeneration (Legendary)", "Reserve (Rare)", "Strength (Very Rare)", "Sustenance (Rare)"],
			"absorption (very rare)": {
				name: "Ioun Stone of Absorption",
				nameTest: "Ioun Stone [Absorption]",
				rarity: "Very Rare",
				magicItemTable: "Arcana",
				description: "As a Reaction while this pale lavender ellipsoid orbits my head, I can cancel a spell of level 4 or lower cast by a creature I can see. The stone can cancel 20 levels of spells before it loses its magic. As a Magic action, I can make it orbit my head at a distance of 1d3 ft. As a Utilize action, I can stow any stones orbiting me.",
				descriptionFull: defaultDescription.concat([
					"While this pale lavender ellipsoid orbits your head, you can take a Reaction to cancel a spell of level 4 or lower cast by a creature you can see. A canceled spell has no effect, and any resources used to cast it are wasted. Once the stone has canceled 20 levels of spells, it burns out, turns dull gray, and loses its magic.",
				]),
				usages: 20,
				recovery: "\u2013",
				action: [["reaction", ""]],
			},
			"agility (very rare)": {
				name: "Ioun Stone of Agility",
				nameTest: "Ioun Stone [Agility]",
				rarity: "Very Rare",
				magicItemTable: "Implements",
				description: "While this deep-red sphere orbits my head, my Dexterity increases by 2, to a maximum of 20." + fullTossStowText,
				descriptionFull: defaultDescription.concat([
					"Your Dexterity increases by 2, to a maximum of 20, while this deep-red sphere orbits your head.",
				]),
				scores: [0, 2, 0, 0, 0, 0],
			},
			"awareness (rare)": {
				name: "Ioun Stone of Awareness",
				nameTest: "Ioun Stone [Awareness]",
				rarity: "Rare",
				magicItemTable: "Implements",
				description: "While this dark-blue rhomboid orbits my head, I have Advantage on Initiative rolls and Wisdom (Perception) checks." + fullTossStowText,
				descriptionFull: defaultDescription.concat([
					"While this dark-blue rhomboid orbits your head, you have Advantage on Initiative rolls and Wisdom (Perception) checks.",
				]),
				advantages: [["Initiative", true], ["Perception", true]],
			},
			"fortitude (very rare)": {
				name: "Ioun Stone of Fortitude",
				nameTest: "Ioun Stone [Fortitude]",
				rarity: "Very Rare",
				magicItemTable: "Arcana",
				description: "While this pink rhomboid orbits my head, my Constitution increases by 2, to a maximum of 20." + fullTossStowText,
				descriptionFull: defaultDescription.concat([
					"Your Constitution increases by 2, to a maximum of 20, while this pink rhomboid orbits your head.",
				]),
				scores: [0, 0, 2, 0, 0, 0],
			},
			"greater absorption (legendary)": {
				name: "Ioun Stone of Greater Absorption",
				nameTest: "Ioun Stone [Greater Absorption]",
				rarity: "Legendary",
				magicItemTable: "Arcana",
				description: "As a Reaction while this marbled lavender and green ellipsoid orbits my head, I can cancel a spell of level 8 or lower cast by a creature I can see. The stone can cancel 20 levels of spells before it loses its magic. As a Magic action, I can make it orbit my head at 1d3 ft. As a Utilize action, I can stow any stones orbiting me.",
				descriptionFull: defaultDescription.concat([
					"While this marbled lavender and green ellipsoid orbits your head, you can take a Reaction to cancel a spell of level 8 or lower cast by a creature you can see. A canceled spell has no effect, and any resources used to cast it are wasted. Once the stone has canceled 20 levels of spells, it burns out, turns dull gray, and loses its magic.",
				]),
				usages: 20,
				recovery: "\u2013",
				action: [["reaction", ""]],
			},
			"insight (very rare)": {
				name: "Ioun Stone of Insight",
				nameTest: "Ioun Stone [Insight]",
				rarity: "Very Rare",
				magicItemTable: "Relics",
				description: "While this incandescent blue sphere orbits my head, my Wisdom increases by 2, to a maximum of 20." + fullTossStowText,
				descriptionFull: defaultDescription.concat([
					"Your Wisdom increases by 2, to a maximum of 20, while this incandescent blue sphere orbits your head.",
				]),
				scores: [0, 0, 0, 0, 2, 0],
			},
			"intellect (very rare)": {
				name: "Ioun Stone of Intellect",
				nameTest: "Ioun Stone [Intellect]",
				rarity: "Very Rare",
				magicItemTable: "Arcana",
				description: "While this marbled scarlet and blue sphere orbits my head, my Intelligence increases by 2, to a maximum of 20." + fullTossStowText,
				descriptionFull: defaultDescription.concat([
					"Your Intelligence increases by 2, to a maximum of 20, while this marbled scarlet and blue sphere orbits your head.",
				]),
				scores: [0, 0, 0, 2, 0, 0],
			},
			"leadership (very rare)": {
				name: "Ioun Stone of Leadership",
				nameTest: "Ioun Stone [Leadership]",
				rarity: "Very Rare",
				magicItemTable: "Arcana",
				description: "While this marbled pink and green sphere orbits my head, my Charisma increases by 2, to a maximum of 20." + fullTossStowText,
				descriptionFull: defaultDescription.concat([
					"Your Charisma increases by 2, to a maximum of 20, while this marbled pink and green sphere orbits your head.",
				]),
				scores: [0, 0, 0, 0, 0, 2],
			},
			"mastery (legendary)": {
				name: "Ioun Stone of Mastery",
				nameTest: "Ioun Stone [Mastery]",
				source: [["SRD24", 228], ["DMG24", 273]],
				rarity: "Legendary",
				magicItemTable: "Arcana",
				description: "While this pale green prism orbits my head, my Proficiency Bonus increases by 1." + fullTossStowText,
				descriptionFull: defaultDescription.concat([
					"Your Proficiency Bonus increases by 1 while this pale green prism orbits your head.",
				]),
				addMod: [{
					type: "",
					field: "Proficiency Bonus Modifier",
					mod: 1,
					text: "My Proficiency Bonus increases by 1.",
				}],
			},
			"protection (rare)": {
				name: "Ioun Stone of Protection",
				nameTest: "Ioun Stone [Protection]",
				source: [["SRD24", 228], ["DMG24", 273]],
				rarity: "Rare",
				magicItemTable: "Armaments",
				description: "While this dusty-rose prism orbits my head, I gain a +1 bonus to Armor Class." + fullTossStowText,
				descriptionFull: defaultDescription.concat([
					"You gain a +1 bonus to Armor Class while this dusty-rose prism orbits your head.",
				]),
				extraAC: [{
					name: "Ioun Stone of Protection",
					mod: 1,
					magic: true,
					text: "I gain a +1 bonus to AC while attuned and it orbits my head.",
				}],
			},
			"regeneration (legendary)": {
				name: "Ioun Stone of Regeneration",
				nameTest: "Ioun Stone [Regeneration]",
				source: [["SRD24", 228], ["DMG24", 273]],
				rarity: "Legendary",
				magicItemTable: "Arcana",
				description: "I regain 15 Hit Points at the end of each hour this pearly white spindle orbits my head if I have at least 1 Hit Point." + fullTossStowText,
				descriptionFull: defaultDescription.concat([
					"You regain 15 Hit Points at the end of each hour this pearly white spindle orbits your head if you have at least 1 Hit Point.",
				]),
			},
			"reserve (rare)": {
				name: "Ioun Stone of Reserve",
				nameTest: "Ioun Stone [Reserve]",
				source: [["SRD24", 228], ["DMG24", 273]],
				rarity: "Rare",
				magicItemTable: ["Arcana", "Relics"],
				description: "This vibrant purple prism stores up to 4 levels of spells. One can touch it to cast a spell into it using a 1-4 level spell slot. While it orbits me, I can cast spells stored in it, using the initial slot level, attack bonus, and DC. As a Magic action, I can make it orbit my head at 1d3 ft. As a Utilize action, I can stow my orbiting stones.",
				descriptionFull: defaultDescription.concat([
					"This vibrant purple prism stores spells cast into it, holding them until you use them. The stone can store up to 4 levels of spells at a time. When found, it contains 1d4 levels of stored spells chosen by the DM.",
					"Any creature can cast a spell of level 1 through 4 into the stone by touching it as the spell is cast. The spell has no effect, other than to be stored in the stone. If the stone can't hold the spell, the spell is expended without effect. The level of the slot used to cast the spell determines how much space it uses.",
					"While this stone orbits your head, you can cast any spell stored in it. The spell uses the slot level, spell save DC, spell attack bonus, and spellcasting ability of the original caster but is otherwise treated as if you cast the spell. The spell cast from the stone is no longer stored in it, freeing up space.",
				]),
			},
			"strength (very rare)": {
				name: "Ioun Stone of Strength",
				nameTest: "Ioun Stone [Strength]",
				source: [["SRD24", 227], ["DMG24", 273]],
				rarity: "Very Rare",
				magicItemTable: "Armaments",
				description: "While this pale blue rhomboid orbits my head, my Strength increases by 2, to a maximum of 20." + fullTossStowText,
				descriptionFull: defaultDescription.concat([
					"Your Strength increases by 2, to a maximum of 20, while this pale blue rhomboid orbits your head.",
				]),
				scores: [2, 0, 0, 0, 0, 0],
			},
			"sustenance (rare)": {
				name: "Ioun Stone of Sustenance",
				nameTest: "Ioun Stone [Sustenance]",
				source: [["SRD24", 227], ["DMG24", 273]],
				rarity: "Rare",
				magicItemTable: "Relics",
				description: "While this clear spindle orbits my head, I don't need to eat or drink." + fullTossStowText,
				descriptionFull: defaultDescription.concat([
					"You don't need to eat or drink while this clear spindle orbits your head.",
				]),
			},
		};
		return obj;
	}(),
	"iron bands of bilarro": {
		name: "Iron Bands of Bilarro",
		nameAlt: "Iron Bands of Binding",
		source: [["SRD24", 228], ["DMG24", 274]],
		type: "Wondrous Item",
		rarity: "Rare",
		magicItemTable: "Arcana",
		description: "As a Magic action once per dawn, I can make a ranged attack (Dex + Prof B) vs a \u2264Huge creature in 60 ft. On a hit, the target is Restrained until I use a Bonus Action to release it. As an Action once every 24 hours, a creature can make a DC 20 Athletics check to try to free the trapped creature and destroy the bands.",
		descriptionLong: "As a Magic action once per dawn, I can make a ranged attack roll (Dexterity modifier plus Proficiency Bonus) against a Huge or smaller creature within 60 ft. On a hit, the target is Restrained until I take a Bonus Action to release it. Doing so, or missing with the attack, causes the bands to contract and become a sphere once more. As an Action, a creature that can touch the bands, including the one Restrained, can make a DC 20 Athletics check to free the Restrained creature and destroy the bands on a success. If the check fails, any further attempts made by that creature automatically fail until 24 hours have elapsed.",
		descriptionFull: [
			"This rusty iron sphere measures 3 inches in diameter and weighs 1 pound. You can take a Magic action to throw the sphere at a Huge or smaller creature you can see within 60 feet of yourself. As the sphere moves through the air, it opens into a tangle of metal bands.",
			"Make a ranged attack roll with an attack bonus equal to your Dexterity modifier plus your Proficiency Bonus. On a hit, the target has the Restrained condition until you take a Bonus Action to issue a command that releases it. Doing so or missing with the attack causes the bands to contract and become a sphere once more.",
			"A creature that can touch the bands, including the one Restrained, can take an action to make a DC 20 Strength (Athletics) check to break the iron bands. On a successful check, the item is destroyed, and the Restrained creature is freed. On a failed check, any further attempts made by that creature automatically fail until 24 hours have elapsed.",
			"Once the bands are used, they can't be used again until the next dawn.",
		],
		weight: 1,
		usages: 1,
		recovery: "Dawn",
		action: [
			["action", " (throw)"],
			["bonus action", " (release)"],
		],
		weaponOptions: [{
			regExpSearch: /^(?=.*iron)(?=.*band)(?=.*(bilarro|binding)).*$/i,
			name: "Iron Bands of Bilarro",
			source: [["SRD24", 228], ["DMG24", 274]],
			ability: 2,
			type: "Magic Item",
			damage: ["\u2013", "", "Restrained"],
			range: "60 ft",
			description: "Restrains Huge or smaller creature; DC 20 Atheltics check to free Restrained creature",
			abilitytodamage: false,
			isNotWeapon: true,
			isAlwaysProf: true,
			weight: 1,
			selectNow: true,
		}],
	},
	"iron flask": {
		name: "Iron Flask",
		source: [["SRD24", 228], ["DMG24", 274]],
		type: "Wondrous Item",
		rarity: "Legendary",
		magicItemTable: "Arcana",
		description: "As a Magic action I can target a creature from another plane that I can see within 60 ft. It must make a DC 17 Wis save (Adv if trapped before) or be trapped in the flask. It holds only 1 creature. As a Magic action, I can open it to release the creature, which then obeys my commands for 1 hour.",
		descriptionLong: "As a Magic action I can target a creature from another plane that I can see within 60 ft. It must make a DC 17 Wis save or be trapped inside the flask. It has Advantage on this save if it was trapped in the flask before. The flask holds only 1 creature, which remains inside until released and doesn't need to breathe, eat, or drink and doesn't age. As a Magic action, I can remove the flask's stopper and release the creature inside, which then obeys my commands for 1 hour, even if we don't share a language, as long as those commands aren't likely to cause its death or imprisonment. After this time, it acts normally.",
		descriptionFull: [
			"While holding this brass-stoppered iron flask, you can take a Magic action to target a creature that you can see within 60 feet of yourself. If the flask is empty and the target is native to a plane of existence other than the one you're on, the target must succeed on a DC 17 Wisdom saving throw or be trapped in the flask. If the target has been trapped by the flask before, it has Advantage on the save. Once trapped, a creature remains in the flask until released. The flask can hold only one creature at a time. A creature trapped in the flask doesn't age and doesn't need to breathe, eat, or drink.",
			"You can take a Magic action to remove the flask's stopper and release the creature in the flask. The creature then obeys your commands for 1 hour, understanding those commands even if it doesn't know the language in which the commands are given. If you issue no commands or give the creature a command that is likely to result in its death or imprisonment, it defends itself but otherwise takes no actions. At the end of the duration, the creature acts in accordance with its normal disposition and alignment.",
			"An *Identify* spell reveals if the flask contains a creature, but the only way to determine the type of creature is to open the flask. A newly discovered Iron Flask might already contain a creature chosen by the DM or determined randomly by rolling on the following table (see the Monster Manual for the creature's stat block).",
			[
				["1d100", "Contents"],
				["01-50", "No creature"],
				["51", "**Arcanaloth**"],
				["52-54", "**Bone Devil**"],
				["55-56", "**Cambion**"],
				["57-58", "**Dao**"],
				["59", "**Deva**"],
				["60-61", "**Djinni**"],
				["62-63", "**Efreeti**"],
				["64-65", "**Erinyes**"],
				["66-67", "**Fomorian**"],
				["68", "**Githyanki Knight**"],
				["69", "**Githzerai Zerth**"],
				["70-71", "**Glabrezu**"],
				["72-74", "**Hezrou**"],
				["75", "**Incubus**"],
				["76-77", "**Invisible Stalker**"],
				["78-79", "**Marid**"],
				["80", "**Marilith**"],
				["81-82", "**Mezzoloth**"],
				["83-84", "**Nalfeshnee**"],
				["85-86", "**Night Hag**"],
				["87-88", "**Nycaloth**"],
				["89", "**Planetar**"],
				["90-91", "**Red Slaad**"],
				["92-93", "**Salamander**"],
				["94", "**Solar**"],
				["95", "**Succubus**"],
				["96", "**Ultroloth**"],
				["97-99", "**Vrock**"],
				["00", "**Xorn**"],
			],
		],
		action: [["action", " (imprison/release)"]],
		weight: 1,
		toNotesPage: [{
			name: "Iron Flask",
			useDescriptionFull: true,
		}],
	},
	"javelin of lightning": {
		name: "Javelin of Lightning",
		source: [["SRD24", 228], ["DMG24", 275]],
		type: "Weapon (Javelin)",
		rarity: "Uncommon",
		magicItemTable: "Armaments",
		description: "I can have this Javelin deal Lightning damage. Once per dawn, I can throw it to a target within 120 ft and have it turn into a bolt of lightning. The target and all creature between me and it in a 5-ft wide line take 4d6 Lightning damage, DC 13 Dexterity save for half. After dealing this damage, it reappears in my hand.",
		descriptionFull: [
			"Each time you make an attack roll with this magic weapon and hit, you can have it deal Lightning damage instead of Piercing damage.",
			"***Lightning Bolt***. When you throw this weapon at a target no farther than 120 feet from you, you can forgo making a ranged attack roll and instead turn the weapon into a bolt of lightning. This bolt forms a 5-foot-wide Line between you and the target. The target and each other creature in the Line (excluding you) makes a DC 13 Dexterity saving throw, taking 4d6 Lightning damage on a failed save or half as much damage on a successful one. Immediately after dealing this damage, the weapon reappears in your hand. This property can't be used again until the next dawn.",
		],
		weight: 2,
		usages: 1,
		recovery: "Dawn",
		weaponOptions: [{
			baseWeapon: "javelin",
			regExpSearch: /^(?=.*javelin)(?=.*lightning).*$/i,
			name: "Javelin of Lightning",
			source: [["SRD24", 228], ["DMG24", 275]],
			damage: [1, 6, "Pierc/Lightn"],
			description: "Thrown; 1/dawn special attack, see item",
			selectNow: true,
		}],
	},
	"lantern of revealing": {
		name: "Lantern of Revealing",
		source: [["SRD24", 228], ["DMG24", 275]],
		type: "Wondrous Item",
		rarity: "Uncommon",
		magicItemTable: ["Arcana", "Implements"],
		description: "While lit, this hooded lantern burns for 6 hours on 1 pint of oil, shedding Bright Light in a 30-ft radius and Dim Light for an additional 30 ft. Invisible creatures and objects are visible while in the lantern's Bright Light. As a Utilize action, I can lower the hood, reducing the light to Dim Light in a 5-ft radius.",
		descriptionFull: "While lit, this hooded lantern burns for 6 hours on 1 pint of oil, shedding Bright Light in a 30-foot radius and Dim Light for an additional 30 feet. Invisible creatures and objects are visible as long as they are in the lantern's Bright Light. You can take a Utilize action to lower the hood, reducing the lantern's light to Dim Light in a 5-foot radius.",
		weight: 2,
		action: [["action", " (lower/lift hood)"]],
	},
	"luck blade": {
		name: "Luck Blade",
		source: [["SRD24", 229], ["DMG24", 275]],
		type: "Weapon (Glaive, Greatsword, Longsword, Rapier, Scimitar, Sickle, or Shortsword)",
		rarity: "Legendary",
		magicItemTable: "Armaments",
		attunement: true,
		description: "This weapon gives me a +1 bonus to attack rolls, damage rolls. and all saving throws. ***Luck***. Once per dawn as long as I am not Incapacitated, I can" + (typePF ? "" : " call on its luck to") + " reroll a failed D20 Test. I must use the second roll. ***Wish***. Once per dawn while holding the blade, I can expend 1 of its 1d3 charges to cast Wish. It can't regain charges.",
		descriptionFull: [
			"You gain a +1 bonus to attack rolls and damage rolls made with this magic weapon. While the weapon is on your person, you also gain a +1 bonus to saving throws.",
			"***Luck***. If the weapon is on your person, you can call on its luck (no action required) to reroll one failed D20 Test if you don't have the Incapacitated condition. You must use the second roll. Once used, this property can't be used again until the next dawn.",
			"***Wish***. The weapon has 1d3 charges. While holding it, you can expend 1 charge and cast Wish from it. Once used, this property can't be used again until the next dawn. The weapon loses this property if it has no charges.",
		],
		extraLimitedFeatures: [{
			name: "Luck Blade (Luck)",
			usages: 1,
			recovery: "Dawn",
		}, {
			name: "Luck Blade (Wish 1/dawn)",
			usages: " ", // 1d3 - Intentionally left blank
			recovery: "\u2013",
		}],
		chooseGear: {
			type: "weapon",
			prefixOrSuffix: "brackets",
			descriptionChange: false,
			excludeCheck: function (inObjKey, inObj, v) {
				return !v.isMeleeWeapon || !/glaive|sickle|rapier|scimitar|sword/i.test(v.baseWeaponName);
			},
		},
		addMod: [{
			type: "save",
			field: "all",
			mod: 1,
			text: "While the Luck Blade is on my person, I gain a +1 bonus to all my saving throws.",
		}],
		calcChanges: {
			atkCalc: [
				function (fields, v, output) {
					if (v.isMeleeWeapon && /glaive|sickle|rapier|scimitar|sword/i.test(v.baseWeaponName) && /^(?=.*luck)(?=.*blade).*$/i.test(v.WeaponTextName)) {
						output.magic = v.thisWeapon[1] + 1;
					}
				},
				'If I include the words "Luck Blade" in the name of a Glaive, Greatsword, Longsword, Rapier, Scimitar, Sickle, or Shortsword, it will be treated as the magic weapon Luck Blade. It adds +1 to hit and damage.',
			],
		},
	},
	"mace of disruption": {
		name: "Mace of Disruption",
		source: [["SRD24", 229], ["DMG24", 276]],
		type: "Weapon (Mace)",
		rarity: "Rare",
		magicItemTable: ["Armaments", "Relics"],
		attunement: true,
		description: "While held, this magical Mace sheds Bright Light in a 20-ft radius and Dim Light for another 20 ft. The mace deals +2d6 Radiant damage against Fiends and Undead. If this damage drops the target's HP below 26, it must make a DC 15 Wisdom save. *Fail*: destroyed. *Success*: Frightened until the end of my next turn.",
		descriptionFull: [
			"When you hit a Fiend or an Undead with this magic weapon, that creature takes an extra 2d6 Radiant damage. If the target has 25 Hit Points or fewer after taking this damage, it must succeed on a DC 15 Wisdom saving throw or be destroyed. On a successful save, the creature has the Frightened condition until the end of your next turn.",
			"***Light***. While you hold this weapon, it sheds Bright Light in a 20-foot radius and Dim Light for an additional 20 feet.",
		],
		weight: 4,
		weaponOptions: [{
			baseWeapon: "mace",
			regExpSearch: /^(?=.*mace)(?=.*disruption).*$/i,
			name: "Mace of Disruption",
			source: [["SRD24", 229], ["DMG24", 276]],
			description: "Fiends/Undead: +2d6 Radiant damage \x26 DC 15 Wis save if HP<26, fail: die, success: Frightened till my next turn ends",
			selectNow: true,
		}],
	},
	"mace of smiting": {
		name: "Mace of Smiting",
		source: [["SRD24", 229], ["DMG24", 276]],
		type: "Weapon (Mace)",
		rarity: "Rare",
		magicItemTable: ["Armaments", "Relics"],
		description: "This magical Mace gives me a +1 bonus (or +3 vs Constructs) to attack and damage rolls made with it. When I roll a 20 on an attack roll with it, the target takes an extra 7 Bludgeoning damage (or 14 if it's a Construct). If a Construct has less than 26 HP after taking this damage, it is destroyed.",
		descriptionFull: [
			"You gain a +1 bonus to attack rolls and damage rolls made with this magic weapon. The bonus increases to +3 when you use the weapon to attack a Construct.",
			"When you roll a 20 on an attack roll made with this weapon, the target takes an extra 7 Bludgeoning damage, or 14 Bludgeoning damage if it's a Construct. If a Construct has 25 Hit Points or fewer after taking this damage, it is destroyed.",
		],
		weight: 4,
		weaponOptions: [{
			baseWeapon: "mace",
			regExpSearch: /^(?=.*mace)(?=.*smiting).*$/i,
			name: "Mace of Smiting",
			source: [["SRD24", 229], ["DMG24", 276]],
			description: "+2 to hit/damage vs Constructs; On 20 to hit: +7 damage (+14 vs Constructs and destroyed if HP<26)",
			modifiers: [1, 1],
			selectNow: true,
		}],
	},
	"mace of terror": {
		name: "Mace of Terror",
		source: [["SRD24", 229], ["DMG24", 276]],
		type: "Weapon (Mace)",
		rarity: "Rare",
		magicItemTable: ["Armaments", "Relics"],
		attunement: true,
		description: "This Mace has 3 charges " + (typePF ? "(+1d3 at dawn)" : "and regains 1d3 charges at dawn") + ". As a Magic action, I can use 1 charge to have each chosen creature in 30 ft make a DC 15 Wis save or be Frightened for 1 min" + (typePF ? ", saving again at the end" : "ute, repeating the save at the end of each") + " of its turns. An affected target can't make Opportunity Attacks and moves as far away from me as it can, Dodging if it cannot move.",
		descriptionLong: [
			"This magic Mace has 3 charges and regains 1d3 at dawn. As a Magic action, I can expend 1 charge to have each creature of my choice within 30 ft make a DC 15 Wisdom save or become Frightened for 1 minute, repeating the save at the end of each of its turns.",
			"While Frightened in this way, a creature can't make Opportunity Attacks and must spend its turns trying to move as far away from me as it can, using its action to Dash or try to escape from an effect that prevents it from moving. If it has nowhere it can move, the creature can take the Dodge action.",
		],
		descriptionFull: "This magic weapon has 3 charges and regains 1d3 expended charges daily at dawn. While holding the weapon, you can take a Magic action and expend 1 charge to release a wave of terror from it. Each creature of your choice within 30 feet of you must succeed on a DC 15 Wisdom saving throw or have the Frightened condition for 1 minute. While Frightened in this way, a creature must spend its turns trying to move as far away from you as it can, and it can't make Opportunity Attacks. For its action, it can use only the Dash action or try to escape from an effect that prevents it from moving. If it has nowhere it can move, the creature can take the Dodge action. At the end of each of its turns, a creature repeats the save, ending the effect on itself on a success.",
		weight: 4,
		usages: 3,
		recovery: "Dawn",
		additional: "regains 1d3",
		weaponsAdd: {
			select: ["Mace of Terror"],
			options: ["Mace of Terror"],
		},
	},
	"mantle of spell resistance": {
		name: "Mantle of Spell Resistance",
		source: [["SRD24", 229], ["DMG24", 276]],
		type: "Wondrous Item",
		rarity: "Rare",
		magicItemTable: "Arcana",
		attunement: true,
		description: "I have Advantage on saving throws against spells while I wear this cloak.",
		descriptionFull: "You have Advantage on saving throws against spells while you wear this cloak.",
		savetxt: { adv_vs: ["spells"] },
	},
	"manual of bodily health": {
		name: "Manual of Bodily Health",
		source: [["SRD24", 229], ["DMG24", 277]],
		type: "Wondrous Item",
		rarity: "Very Rare",
		magicItemTable: "Relics",
		description: "This book contains health and diet tips, and its words are charged with magic. If I spend 48 hours over a period of 6 days or fewer to study its contents and practicing its guidelines, my Constitution score increases by 2, to a maximum of 30. The manual then loses its magic, but regains it in a century.",
		descriptionFull: "This book contains health and diet tips, and its words are charged with magic. If you spend 48 hours over a period of 6 days or fewer studying the book's contents and practicing its guidelines, your Constitution increases by 2, to a maximum of 30. The manual then loses its magic, but regains it in a century.",
		weight: 5,
		scores: [0, 0, 2, 0, 0, 0],
		scoresMaxLimited: [0, 0, 30, 0, 0, 0],
		scoresStackable: true,
		applyStatBonus: recurringItemApplyLegacy, // for backwards compatibility with add-on scripts
	},
	"manual of gainful exercise": {
		name: "Manual of Gainful Exercise",
		source: [["SRD24", 229], ["DMG24", 277]],
		type: "Wondrous Item",
		rarity: "Very Rare",
		magicItemTable: "Armaments",
		description: "This book describes fitness exercises, and its words are charged with magic. If I spend 48 hours over a period of 6 days or fewer studying its contents and practicing its guidelines, my Strength score increases by 2, to a maximum of 30. The manual then loses its magic, but regains it in a century.",
		descriptionFull: "This book describes fitness exercises, and its words are charged with magic. If you spend 48 hours over a period of 6 days or fewer studying the book's contents and practicing its guidelines, your Strength increases by 2, to a maximum of 30. The manual then loses its magic, but regains it in a century.",
		weight: 5,
		scores: [2, 0, 0, 0, 0, 0],
		scoresMaxLimited: [30, 0, 0, 0, 0, 0],
		scoresStackable: true,
	},
	"manual of golems": (function () {
		var obj = {
			name: "Manual of Golems",
			source: [["SRD24", 229], ["DMG24", 277]],
			type: "Wondrous Item",
			rarity: "Very Rare",
			magicItemTable: "Arcana",
			description: "Select a golem type.",
			descriptionFull: [
				"This tome contains information and incantations necessary to make a particular type of golem. The DM chooses the type or determines it randomly by rolling on the accompanying table. To decipher and use the manual, you must be a spellcaster with at least two level 5 spell slots. A creature that can't use a *Manual of Golems* and attempts to read it takes 6d6 Psychic damage.",
				"To create a golem, you must spend the time shown on the table, working without interruption with the manual at hand and resting no more than 8 hours per day. You must also pay the specified cost to purchase supplies.",
				"Once you finish creating the golem, the book is consumed in eldritch flames. The golem becomes animate when the ashes of the manual are sprinkled on it. See the *Monsters Manual* for the golem's stat block. The golem is under your control, and it understands and obeys your commands.",
				[
					["1d20", "Golem", "Time        ", "Cost"],
					["1-5", "Clay", "30 days   ", "65,000 GP"],
					["6-17", "Flesh", "60 days   ", "50,000 GP"],
					["18", "Iron", "120 days ", "100,000 GP"],
					["19-20", "Stone", "90 days   ", "80,000 GP"],
				],
			],
			weight: 5,
			prerequisite: "Requires a spellcaster with at least two 5th-level spell slots to decipher and use the manual",
			prereqeval: function () {
				return What("SpellSlots.CheckboxesSet.lvl5") >= 2;
			},
			allowDuplicates: true,
			choices: [],
		};

		var manualTypes = [
			{ golemName: "Clay", days: 30, cost: "65,000" },
			{ golemName: "Flesh", days: 60, cost: "50,000" },
			{ golemName: "Iron", days: 120, cost: "100,000", article: "an" },
			{ golemName: "Stone", days: 90, cost: "80,000" },
		];

		manualTypes.forEach(function (manualType) {
			var golemName = manualType.golemName;
			var days = manualType.days;
			var cost = manualType.cost;
			var article = manualTypes.article ? manualTypes.article : "a";

			var choiceName = golemName;
			obj.choices.push(choiceName);

			var description = "I can use this manual to create " + article + " **" + golemName + " Golem**. To do so I must spend " + days + " days working uninterrupted with the manual at hand, resting no more than 8 hours per day. I must also pay " + cost + " GP to purchase supplies. The manual is consumed to animate the golem, which understands and obeys my spoken commands.";

			var choiceObject = {
				name: "Manual of " + golemName + " Golems",
				sortname: "Manual of Golems, " + golemName,
				description: description,
				descriptionLong: "I can only read this manual if I am a spellcaster with at least two 5th-level spell slots. If I am not, I take 6d6 Psychic damage. " + description,
				descriptionFull: [
					"This tome contains information and incantations necessary to make " + article + " **" + golemName + " Golem**. To decipher and use the manual, you must be a spellcaster with at least two level 5 spell slots. A creature that can't use a *Manual of Golems* and attempts to read it takes 6d6 Psychic damage.",
					"To create " + article + " **" + golemName + " Golem**, you must spend " + days + " days, working without interruption with the manual at hand and resting no more than 8 hours per day. You must also pay " + cost + " GP to purchase supplies.",
					"Once you finish creating the golem, the book is consumed in eldritch flames. The golem becomes animate when the ashes of the manual are sprinkled on it. It is under your control, and it understands and obeys your spoken commands.",
				],
				creaturesAdd: [[golemName + " Golem", "stop"]],
			};
			obj[choiceName.toLowerCase()] = choiceObject;
		})
		return obj;
	})(),
	"manual of quickness of action": {
		name: "Manual of Quickness of Action",
		source: [["SRD24", 230], ["DMG24", 278]],
		type: "Wondrous Item",
		rarity: "Very Rare",
		magicItemTable: "Implements",
		description: "This book contains coordination and balance exercises, and its words are charged with magic. If I spend 48 hours over a period of 6 days or fewer to study its contents and practicing its guidelines, my Dexterity score increases by 2, to a maximum of 30. The manual then loses its magic, but regains it in a century.",
		descriptionFull: "This book contains coordination and balance exercises, and its words are charged with magic. If you spend 48 hours over a period of 6 days or fewer studying the book's contents and practicing its guidelines, your Dexterity increases by 2, to a maximum of 30. The manual then loses its magic, but regains it in a century.",
		weight: 5,
		scores: [0, 2, 0, 0, 0, 0],
		scoresMaxLimited: [0, 30, 0, 0, 0, 0],
		scoresStackable: true,
	},
	"medallion of thoughts": {
		name: "Medallion of Thoughts",
		source: [["SRD24", 230], ["DMG24", 278]],
		type: "Wondrous Item",
		rarity: "Uncommon",
		magicItemTable: "Arcana",
		attunement: true,
		description: "This medallion has 5 charges and regains 1d4 expended charges daily at dawn. While wearing it, I can expend 1 charge to cast *Detect Thoughts* (save DC 13) from it.",
		descriptionFull: "The medallion has 5 charges. While wearing it, you can expend 1 charge to cast *Detect Thoughts* (save DC 13) from it. The medallion regains 1d4 expended charges daily at dawn.",
		weight: 1,
		usages: 5,
		recovery: "Dawn",
		additional: "regains 1d4",
		spellcastingBonus: [{
			name: "1 charge",
			spells: ["detect thoughts"],
			selection: ["detect thoughts"],
			firstCol: 1,
		}],
		fixedDC: 13,
		spellFirstColTitle: "Ch",
	},
	"mirror of life trapping": {
		name: "Mirror of Life Trapping",
		source: [["SRD24", 230], ["DMG24", 278]],
		type: "Wondrous Item",
		rarity: "Very Rare",
		magicItemTable: "Arcana",
		description: "As a Magic action while I'm in 5 ft of this mirror, I can speak its command word and activate it. It remains activated until I do so again. Creatures other than me who see their reflection in the mirror must make a DC 15 Charisma save or become trapped in one of its twelve extradimensional cells. See Notes page for info.",
		descriptionFull: [
			"When this 4-foot-tall, 2-foot-wide mirror is viewed indirectly, its surface shows faint images of creatures. The mirror weighs 50 pounds, and it has AC 11, HP 10, Immunity to Poison and Psychic damage, and Vulnerability to Bludgeoning damage. It shatters and is destroyed when reduced to 0 Hit Points.",
			"If the mirror is hanging on a vertical surface and you are within 5 feet of it, you can take a Magic action and use a command word to activate it. It remains activated until you take a Magic action and repeat the command word to deactivate it.",
			"Any creature other than you that sees its reflection in the activated mirror while within 30 feet of the mirror must succeed on a DC 15 Charisma saving throw or be trapped, along with anything it is wearing or carrying, in one of the mirror's twelve extradimensional cells. A creature that knows the mirror's nature makes the save with Advantage, and Constructs succeed on the save automatically.",
			"An extradimensional cell is an infinite expanse filled with thick fog that reduces visibility to 10 feet. Creatures trapped in the mirror's cells don't age, and they don't need to eat, drink, or sleep. A creature trapped within a cell can escape using magic that permits planar travel. Otherwise, the creature is confined to the cell until freed.",
			"If the mirror traps a creature but its twelve extradimensional cells are already occupied, the mirror frees one trapped creature at random to accommodate the new prisoner. A freed creature appears in an unoccupied space within sight of the mirror but facing away from it. If the mirror is shattered, all creatures it contains are freed and appear in unoccupied spaces near it.",
			"While within 5 feet of the mirror, you can take a Magic action to name one creature trapped in it or call out a particular cell by number. The creature named or contained in the named cell appears as an image on the mirror's surface. You and the creature can then communicate.",
			"In a similar way, you can take a Magic action and use a second command word to free one creature trapped in the mirror. The freed creature appears, along with its possessions, in the unoccupied space nearest to the mirror and facing away from it.",
			"Placing the mirror inside an extradimensional space created by a *Bag of Holding*, *Portable Hole*, or similar item instantly destroys both items and opens a gate to the Astral Plane. The gate originates where the one item was placed inside the other. Any creature within 10 feet of the gate and not behind Total Cover is sucked through it to a random location on the Astral Plane. The gate then closes. The gate is one-way only and can't be reopened.",
		],
		weight: 50,
		action: [["action", ""]],
		toNotesPage: [{
			name: "Mirror of Life Trapping",
			useDescriptionFull: function (str) {
				return str.replace("I and the creature", "the creature and me");
			},
		}],
	},
	"mithral armor": {
		name: "Mithral Armor",
		nameTest: /mithral.+(armou?r|\u180C)/i,
		source: [["SRD24", 231], ["DMG24", 279]],
		type: "Armor (Any Medium or Heavy, Except Hide Armor)",
		rarity: "Uncommon",
		magicItemTable: "Armaments",
		description: "This armor is made of mithral, a light, flexible metal. It can be worn under normal clothes. If it normally imposes Disadvantage on Dexterity (Stealth) checks or has a Strength requirement, the mithral version of the armor doesn't.",
		descriptionFull: "Mithral is a light, flexible metal. Armor made of this substance can be worn under normal clothes. If the armor normally imposes Disadvantage on Dexterity (Stealth) checks or has a Strength requirement, the mithral version of the armor doesn't.",
		allowDuplicates: true,
		chooseGear: {
			type: "armor",
			prefixOrSuffix: ["between", "Mithral", "\u180C"],
			itemName1stPage: ["suffix", "Mithral"],
			descriptionChange: ["replace", "armor"],
			excludeCheck: function (inObjKey, inObj) {
				return !/medium|heavy/i.test(inObj.type) || /hide/i.test(inObj.name);
			},
			noStealthDis: /mithral/i,
		},
	},
	"necklace of adaptation": {
		name: "Necklace of Adaptation",
		source: [["SRD24", 232], ["DMG24", 280]],
		type: "Wondrous Item",
		rarity: "Uncommon",
		magicItemTable: "Arcana",
		attunement: true,
		description: "While wearing this necklace, I can breathe normally in any environment, and have Advantage on saving throws made to avoid or end the Poisoned condition.",
		descriptionFull: "While wearing this necklace, you can breathe normally in any environment, and you have Advantage on saving throws made to avoid or end the Poisoned condition.",
		weight: 1,
		savetxt: { adv_vs: ["Poisoned"] },
	},
	"necklace of fireballs": {
		name: "Necklace of Fireballs",
		source: [["SRD24", 233], ["DMG24", 280]],
		type: "Wondrous Item",
		rarity: "Rare",
		magicItemTable: "Arcana",
		description: "This necklace has 1d6+3 beads hanging from it. As a Magic action, I can throw a bead up to 60 ft away where it detonates as a 3rd-level *Fireball* (save DC 15). I can hurl multiple beads as part of the same action, increasing the damage of the *Fireball* by 1d6 for each bead beyond the first (maximum 12d6).",
		descriptionFull: [
			"This necklace has 1d6 + 3 beads hanging from it. You can take a Magic action to detach a bead and throw it up to 60 feet away. When it reaches the end of its trajectory, the bead detonates as a level 3 *Fireball* (save DC 15).",
			"You can hurl multiple beads, or even the whole necklace, at one time. When you do so, increase the damage of the *Fireball* by 1d6 for each bead after the first (maximum 12d6).",
		],
		action: [["action", ""]],
		weight: 1,
		usages: " ", // 1d6+3 - Intentionally left blank
		recovery: "\u2013",
		spellcastingBonus: [{
			name: "Fireball",
			spells: ["fireball"],
			selection: ["fireball"],
		}],
		fixedDC: 15,
		spellChanges: {
			"fireball": {
				description: "20-ft rad all crea 8d6+1d6/extra bead Fire dmg (max 12d6); save halves; unattended objects ignite",
				components: "M\u2020",
				compMaterial: "Using the *Necklace of Fireballs* to cast *Fireball* requires removing and throwing one or more of the beads from it.",
				changes: "Using the *Necklace of Fireballs* to cast *Fireball* requires removing and throwing one or more of the beads from it. The damage is that of a *Fireball* cast at 3rd-level, +1d6 damage per bead thrown as part of the same action beyond the first (maximum 12d6).",
			},
		},
	},
	"necklace of prayer beads": {
		name: "Necklace of Prayer Beads",
		source: [["SRD24", 233], ["DMG24", 281]],
		type: "Wondrous Item",
		rarity: "Rare",
		magicItemTable: "Relics",
		attunement: true,
		prerequisite: "Requires Attunement by a Cleric, Druid, or Paladin",
		prereqeval: function (v) {
			return !!classes.known.cleric || !!classes.known.druid || !!classes.known.paladin;
		},
		description: "This necklace has many beads, 1d4+2 are magical and each can be used to cast a spell once per dawn as a Bonus Action. My DM chooses spells from: *Bless*, *Cure Wounds*, *Greater Restoration*, *Shining Smite*, *Guardian of Faith*, and *Wind Walk*. Multiple beads of the same type can be on one necklace.",
		descriptionLong: "This necklace has many beads, 1d4+2 are magical aquamarine, black pearl, or topaz beads and can each be used to cast a spell once per dawn as a Bonus Action. My DM chooses beads from: Bead of Blessing (*Bless*), Bead of Curing (*Cure Wounds*, level 2), Bead of Favor (*Greater Restoration*), Bead of Smiting (*Shining Smite*), Bead of Summons (*Guardian of Faith*), and Bead of Wind Walking (*Wind Walk*). Multiple beads of the same type can be on one necklace.",
		descriptionFull: [
			"This necklace has 1d4 + 2 magic beads made from aquamarine, black pearl, or topaz. It also has many nonmagical beads made from stones such as amber, bloodstone, citrine, coral, jade, pearl, or quartz. If a magic bead is removed from the necklace, that bead loses its magic.",
			"Six types of magic beads exist. The DM decides the type of each bead on the necklace or determines it randomly by rolling on the table below. A necklace can have more than one bead of the same type. To use one, you must be wearing the necklace. Each bead contains a spell that you can cast from it as a Bonus Action (using your spell save DC if a save is necessary). Once a magic bead's spell is cast, that bead can't be used again until the next dawn.",
			[
				["1d20  ", "Bead of", "", "Spell"],
				["  1-6  ", "Blessing", "", "*Bless*"],
				[" 7-12 ", "Curing", "", "*Cure Wounds* (level 2 version)"],
				["13-16", "Favor", "", "*Greater Restoration*"],
				["17-18", "Smiting", "", "*Shining Smite*"],
				["  19   ", "Summons", "", "*Guardian of Faith*"],
				["  20   ", "Wind Walking", "*Wind Walk*"],
			],
		],
		weight: 1,
		spellcastingAbility: "class",
		spellFirstColTitle: "Us",
		spellcastingBonus: [{
			name: "Bead Spell",
			spells: ["bless", "cure wounds", "greater restoration", "shining smite", "guardian of faith", "wind walk"],
			selection: ["bless", "cure wounds", "greater restoration", "shining smite", "guardian of faith", "wind walk"],
			times: 6,
		}],
		calcChanges: {
			spellAdd: [
				function (spellKey, spellObj, spName) {
					if (/necklace of prayer beads/i.test(spName)) {
						var toReturn = spellObj.time !== "Bns";
						spellObj.time = "Bns";
						spellObj.firstCol = "checkbox";
						if (spellKey === "cure wounds") {
							spellObj.name += " (2nd level)";
							spellObj.description = "1 creature heals 4d8+spellcasting ability modifier HP";
						};
						return toReturn;
					};
				},
				"Using the Necklace of Prayer Beads, casting time of spells is a Bonus Action. Also, Cure Wounds is cast as a 2nd-level spell.",
			],
		},
	},
	"nine lives stealer": {
		name: "Nine Lives Stealer",
		nameTest: /^(?=.*(9|nine))(?=.*(lives|life))(?=.*stealer).*$/i,
		source: [["SRD24", 233], ["DMG24", 281]],
		type: "Weapon (Any Simple or Martial)",
		rarity: "Very Rare",
		magicItemTable: "Armaments",
		attunement: true,
		description: "I gain a +2 bonus to attack and damage rolls with this magic weapon. It has 1d8+1 charges. When I roll a 20 to hit a creature (other than a Construct or Undead) with fewer than 100 HP, if the weapon has charges remaining, the target must make a DC 15 Con save or die. If it dies, the weapon loses a charge.",
		descriptionFull: [
			"You gain a +2 bonus to attack rolls and damage rolls made with this magic weapon.",
			"***Life Stealing***. The weapon has 1d8 + 1 charges. When you attack a creature that has fewer than 100 Hit Points with this weapon and roll a 20 on the d20 for the attack roll, the creature must succeed on a DC 15 Constitution saving throw or be slain instantly as the sword tears its life force from its body. Constructs and Undead succeed on the save automatically. The weapon loses 1 charge if the creature is slain. When the weapon has no charges remaining, it loses this property.",
		],
		usages: " ", // 1d8+1 - Intentionally left blank
		recovery: "\u2013",
		chooseGear: {
			type: "weapon",
			prefixOrSuffix: "suffix",
			descriptionChange: false,
			excludeCheck: function (inObjKey, inObj, v) {
				return !v.isSimpleOrMartial;
			},
		},
		calcChanges: {
			atkAdd: [
				function (fields, v) {
					if (!v.theWea.isMagicWeapon && v.isSimpleOrMartial && /^(?=.*(9|nine))(?=.*(lives|life))(?=.*stealer).*$/i.test(v.WeaponTextName)) {
						v.theWea.isMagicWeapon = true;
						fields.Description += (fields.Description ? "; " : "") + "On 20 to hit target <100 HP: DC 15 Con save or die";
					}
				},
				'If I include the words "Nine Lives Stealer" in the name of a Simple or Martial weapon, it will be treated as the magic weapon Nine Lives Stealer. It adds +2 to hit and damage. Also, as long as it has charges left, when I roll a 20 to hit against a creature with fewer than 100 HP, that creature must make a DC 15 Constitution saving throw or die. Constructs and Undead succeed on the save automatically.',
			],
			atkCalc: [
				function (fields, v, output) {
					if (v.isSimpleOrMartial && /^(?=.*(9|nine))(?=.*(lives|life))(?=.*stealer).*$/i.test(v.WeaponTextName)) {
						output.magic = v.thisWeapon[1] + 2;
					}
				}, "",
			],
		},
	},
	"nolzur's marvelous pigments": {
		name: "Nolzur's Marvelous Pigments",
		nameAlt: "Marvelous Pigments",
		source: [["SRD24", 230], ["DMG24", 281]],
		type: "Wondrous Item",
		rarity: "Very Rare",
		magicItemTable: ["Arcana", "Implements"],
		description: "This wooden box contains a brush and 1d4 pots of pigment. I can use 1 pot and spend 10 minutes while Concentrating to paint any number of 3D objects confined to a 20-ft Cube, which become real upon completion. No object can have a value over 25 GP and the total value of all objects cannot exceed 500 GP.",
		descriptionLong: "This fine wooden box contains a brush and 1d4 pots of pigment. I can use 1 pot and spend 10 minutes to paint any number of three-dimensional objects confined in a 20-ft Cube. I must remain in the Cube and maintain Concentration for the duration. If I leave the Cube or my Concentration is broken before the work is done, the objects vanish and the pot is wasted. When the work is done all objects in the Cube become real. No object can have a value over 25 GP and the total value of all objects cannot exceed 500 GP. Energy painted dissipates when the work is done, dealing no damage.",
		descriptionFull: [
			"This fine wooden box contains 1d4 pots of pigment and a brush (weighing 1 pound in total). Using the brush and expending 1 pot of pigment, you can paint any number of three-dimensional objects and terrain features (such as walls, doors, trees, flowers, weapons, webs, and pits), provided these elements are all confined to a 20-foot Cube. The effort takes 10 minutes (regardless of the number of elements you create), during which time you must remain in the Cube, and requires Concentration. If your Concentration is broken or you leave the Cube before the work is done, all the painted elements vanish, and the pot of pigment is wasted.",
			"When the work is done, all the painted objects and terrain features become real. Thus, painting a door on a wall creates an actual door, which can be opened to whatever is beyond. Painting a pit creates a real pit, the entire depth of which must lie within the 20-foot Cube.",
			"No object created by a pot of pigment can have a value greater than 25 GP, and the total value of all objects created by a pot of pigment can't exceed 500 GP. If you paint objects of greater value (such as a large pile of gold), they look authentic, but close inspection reveals they're made from paste, cookies, or some other worthless material.",
			"If you paint a form of energy such as fire or lightning, the energy dissipates as soon as you complete the painting, doing no harm.",
		],
		usages: " ", // Intentionally left blank
		additional: "1d4 pots",
		recovery: "\u2013",
		weight: 1,
	},
	"oathbow": {
		name: "Oathbow",
		source: [["SRD24", 233], ["DMG24", 282]],
		type: "Weapon (Longbow or Shortbow)",
		rarity: "Very Rare",
		magicItemTable: "Armaments",
		attunement: true,
		description: "Once per dawn when I say the command words and attack with this bow, I make the target my only sworn enemy for 7 days or until it dies. " + (typePF ? "Attacks" : "Ranged attacks") + " with this bow " + (typePF ? "against them" : "against my sworn enemy") + " have Adv, deal +3d6 damage, ignore 1/2 and 3/4 Cover, and suffer no Disadv from long range. " + (typePF ? "I have Disadv with other weapons while it lives." : "While it lives, I have Disadv when I use other weapons."),
		descriptionLong: "When I nock an arrow on this bow, it whispers in Elvish, \"Swift defeat to my enemies.\" Once per dawn when I attack with it and say or sign its command phrase \"Swift death to me who have wronged me\", I make the target my sworn enemy, if I don't have one already, until it dies or dawn 7 days later. If it dies, I can choose a new one after the next dawn. Ranged attacks with this bow against my sworn enemy have Advantage, deal +3d6 Piercing damage, ignore Half and Three-Quarters Cover, and suffer no Disadvantage due to long range. While my sworn enemy lives, I have Disadvantage" + (typePF ? "" : " on attack rolls") + " with all other weapons.",
		descriptionFull: [
			'When you nock an arrow on this bow, it whispers in Elvish, "Swift defeat to my enemies." When you use this weapon to make a ranged attack, you can utter or sign the following command words: "Swift death to you who have wronged me." The target of your attack becomes your sworn enemy until it dies or until dawn 7 days later. You can have only one such sworn enemy at a time. When your sworn enemy dies, you can choose a new one after the next dawn.',
			"When you make a ranged attack roll with this weapon against your sworn enemy, you have Advantage on the roll. In addition, your target gains no benefit from Half Cover or Three-Quarters Cover, and you suffer no Disadvantage due to long range. If the attack hits, your sworn enemy takes an extra 3d6 Piercing damage.",
			"While your sworn enemy lives, you have Disadvantage on attack rolls with all other weapons.",
		],
		extraLimitedFeatures: [{
			name: "Oathbow (Sworn Enemy)",
			usages: 1,
			recovery: "Dawn",
		}],
		chooseGear: {
			type: "weapon",
			prefixOrSuffix: "brackets",
			descriptionChange: false,
			excludeCheck: function (inObjKey, inObj, v) {
				return !v.isRangedWeapon || !/longbow|shortbow/i.test(v.baseWeaponName);
			},
		},
		calcChanges: {
			atkAdd: [
				function (fields, v) {
					if (!v.theWea.isMagicWeapon && v.isRangedWeapon && /longbow|shortbow/i.test(v.baseWeaponName) && /oath.*bow/i.test(v.WeaponTextName)) {
						v.theWea.isMagicWeapon = true;
						fields.Description += (fields.Description ? "; " : "") + "Vs sworn enemy: Adv, +3d6 dmg, ignore cover, no Disadv long range";
					}
				},
				'If I include the word "Oath" before the name of a Longbow or Shortbow, it will be treated as the magic weapon Oathbow. It can be used to mark a creature as a sworn enemy, against which the bow has Advantage, deals +3d6 Piercing damage, ignores Half and Three-Quarters Cover, and suffers no Disadvantage due to long range.',
			],
		},
	},
	"oil of etherealness": {
		name: "Oil of Etherealness",
		source: [["SRD24", 233], ["DMG24", 282]],
		type: "Potion",
		rarity: "Rare",
		magicItemTable: "Arcana",
		description: "This cloudy, gray oil can be used once to cover a Medium or smaller creature, along with equipment it's wearing and carrying (one additional vial is required for each size category above Medium). Applying the oil takes 10 minutes. The target then gains the effects of *Etherealness* for 1 hour.",
		descriptionLong: [
			"One vial of this oil can cover one Medium or smaller creature, along with equipment it's wearing and carrying (another vial is required per size category above Medium). Applying the oil takes 10 minutes. The affected creature then gains the effects of *Etherealness* for 1 hour: It steps into the border regions of the Ethereal Plane, where it can only affect or be affected by objects and creatures on that plane, but still see 60 ft in the plane it came from. It can move in any direction, but up and down at half speed.",
			"Beads of this cloudy, gray oil form on the outside of its container and quickly evaporate.",
		],
		descriptionFull: [
			"One vial of this oil can cover one Medium or smaller creature, along with the equipment it's wearing and carrying (one additional vial is required for each size category above Medium). Applying the oil takes 10 minutes. The affected creature then gains the effect of the *Etherealness* spell for 1 hour.",
			"Beads of this cloudy, gray oil form on the outside of its container and quickly evaporate.",
		],
		weight: 0.5,
		action: false, // To keep the default potion action from being added
	},
	"oil of sharpness": {
		name: "Oil of Sharpness",
		source: [["SRD24", 233], ["DMG24", 282]],
		type: "Potion",
		rarity: "Very Rare",
		magicItemTable: ["Arcana", "Armaments"],
		description: "This clear, gelatinous oil sparkles with tiny, ultrathin silver shards. I can use it once to coat 20 pieces of ammunition or 1 Melee weapon, if they are nonmagical and deal Slashing or Piercing damage. Applying takes 1 minute, after which the oil seeps into whatever it coats, turning it into a +3 Weapon/Ammunition.",
		descriptionFull: [
			"One vial of this oil can coat one Melee weapon or twenty pieces of ammunition, but only ammunition and Melee weapons that are nonmagical and deal Slashing or Piercing damage are affected. Applying the oil takes 1 minute, after which the oil magically seeps into whatever it coats, turning the coated weapon into a +3 Weapon or the coated ammunition into +3 Ammunition.",
			"This clear, gelatinous oil sparkles with tiny, ultrathin silver shards.",
		],
		weight: 0.5,
		action: false, // To keep the default potion action from being added
	},
	"oil of slipperiness": {
		name: "Oil of Slipperiness",
		source: [["SRD24", 233], ["DMG24", 283]],
		type: "Potion",
		rarity: "Uncommon",
		magicItemTable: ["Arcana", "Implements"],
		description: "This sticky black unguent can be used once to cover a Medium or smaller creature and its equipment, granting it the effects of *Freedom of Movement* for 8 hours. Applying it takes 10 minutes. Alternatively, it can be poured out as a Magic action, duplicating the effects of *Grease* in a 10-ft square for 8 hours.",
		descriptionLong: [
			"One vial of this oil can cover one Medium or smaller creature, along with the equipment it's wearing and carrying (one additional vial is required for each size category above Medium). Applying the oil takes 10 minutes. The affected creature then gains the effects of *Freedom of Movement* for 8 hours.",
			"Alternatively, the oil can be poured on the ground as a Magic action, where it covers a 10-ft square, duplicating the effects of *Grease* in that area for 8 hours.",
			"This sticky, black unguent is thick and heavy, but it flows quickly when poured.",
		],
		descriptionFull: [
			"One vial of this oil can cover one Medium or smaller creature, along with the equipment it's wearing and carrying (one additional vial is required for each size category above Medium). Applying the oil takes 10 minutes. The affected creature then gains the effect of the *Freedom of Movement* spell for 8 hours.",
			"Alternatively, the oil can be poured on the ground as a Magic action, where it covers a 10-foot square, duplicating the effect of the *Grease* spell in that area for 8 hours.",
			"This sticky, black unguent is thick and heavy, but it flows quickly when poured.",
		],
		weight: 0.5,
		action: false, // To keep the default potion action from being added
	},
	"pearl of power": {
		name: "Pearl of Power",
		source: [["SRD24", 234], ["DMG24", 284]],
		type: "Wondrous Item",
		rarity: "Uncommon",
		magicItemTable: ["Arcana", "Relics"],
		attunement: true,
		prerequisite: "Requires Attunement by a Spellcaster",
		prereqeval: function (v) { return v.isSpellcaster; },
		description: "As a Magic action while this pearl is on my person, I can regain one expended spell slot of level 3 or lower. Once I use the pearl, it can't be used again until the next dawn.",
		descriptionFull: "While this pearl is on your person, you can take a Magic action to regain one expended spell slot of level 3 or lower. Once you use the pearl, it can't be used again until the next dawn.",
		usages: 1,
		recovery: "Dawn",
		action: [["action", ""]],
	},
	"periapt of health": {
		name: "Periapt of Health",
		source: [["SRD24", 234], ["DMG24", 284]],
		type: "Wondrous Item",
		rarity: "Uncommon",
		magicItemTable: ["Arcana", "Relics"],
		attunement: true,
		description: "As a Magic action while wearing this pendant, I can regain 2d4+2 Hit Points. Once used, this property can't be used again until the next dawn. In addition while wearing the pendant, I have Advantage on saving throws to avoid or end the Poisoned condition.",
		descriptionFull: [
			"While wearing this pendant, you can take a Magic action to regain 2d4 + 2 Hit Points. Once used, this property can't be used again until the next dawn.",
			"In addition, you have Advantage on saving throws to avoid or end the Poisoned condition while you wear this pendant.",
		],
		weight: 1,
		action: [["action", ""]],
		usages: 1,
		recovery: "Dawn",
		savetxt: { adv_vs: ["Poisoned"] },
	},
	"periapt of proof against poison": {
		name: "Periapt of Proof against Poison",
		source: [["SRD24", 234], ["DMG24", 284]],
		type: "Wondrous Item",
		rarity: "Rare",
		magicItemTable: "Relics",
		attunement: true,
		description: "This delicate silver chain has a brilliant-cut black gem pendant. While I wear it, I have Immunity to the Poisoned condition and Poison damage.",
		descriptionFull: "This delicate silver chain has a brilliant-cut black gem pendant. While you wear it, you have Immunity to the Poisoned condition and Poison damage.",
		weight: 1,
		savetxt: { immune: ["Poison", "Poisoned"] },
	},
	"periapt of wound closure": {
		name: "Periapt of Wound Closure",
		source: [["SRD24", 234], ["DMG24", 284]],
		type: "Wondrous Item",
		rarity: "Uncommon",
		magicItemTable: "Relics",
		attunement: true,
		description: [
			"While wearing this pendant, I gain the following benefits.",
			"***Life Preservation***. Whenever I make a Death Saving Throw, I can change a roll of 9 or less to a 10, turning a failure into a success. ***Natural Healing Boost***. Whenever I roll a Hit Point Die to regain Hit Points, I double the number of Hit Points it restores.",
		],
		descriptionFull: [
			"While wearing this pendant, you gain the following benefits.",
			"***Life Preservation***. Whenever you make a Death Saving Throw, you can change a roll of 9 or lower to a 10, turning a failed save into a successful one.",
			"***Natural Healing Boost***. Whenever you roll a Hit Point Die to regain Hit Points, double the number of Hit Points it restores.",
		],
		weight: 1,
	},
	"philter of love": {
		name: "Philter of Love",
		source: [["SRD24", 234], ["DMG24", 285]],
		type: "Potion",
		rarity: "Uncommon",
		magicItemTable: "Arcana",
		description: "The next time the consumer of this potion sees a creature within 10 minutes after drinking it, they are charmed by that creature and have the Charmed condition for 1 hour. This potion's rose-hued, effervescent liquid contains one easy-to-miss bubble shaped like a heart.",
		descriptionFull: [
			"The next time you see a creature within 10 minutes after drinking this philter, you are charmed by that creature and have the Charmed condition for 1 hour.",
			"This rose-hued, effervescent liquid contains one easy-to-miss bubble shaped like a heart.",
		],
		weight: 0.5,
		action: false, // To keep the default potion action from being added
	},
	"pipes of haunting": {
		name: "Pipes of Haunting",
		source: [["SRD24", 234], ["DMG24", 285]],
		type: "Wondrous Item",
		rarity: "Uncommon",
		magicItemTable: "Implements",
		description: "These pipes have 3 charges and regain 1d3 daily at dawn. As a Magic action, I can use 1 charge to play them and have each creature of my choice within 30 ft make a DC 15 Wis save or be Frightened for 1 minute. A target can repeat the save at the end of their turns. A creature that saves is immune for 24 hours.",
		descriptionLong: "These pipes have 3 charges and regain 1d3 expended charges daily at dawn. As a Magic action, I can play them and expend 1 charge to create an eerie, spellbinding tune. Each creature of my choice within 30 ft of me must make a DC 15 Wisdom saving throw or become Frightened for 1 minute. An affected creature can repeat the save at the end of each of its turns, ending the effect on itself on a success. A creature that succeeds on its save is immune to the effect of these pipes for 24 hours.",
		descriptionFull: "These pipes have 3 charges and regain 1d3 expended charges daily at dawn. You can take a Magic action to play them and expend 1 charge to create an eerie, spellbinding tune. Each creature of your choice within 30 feet of you must succeed on a DC 15 Wisdom saving throw or have the Frightened condition for 1 minute. A creature that fails the save repeats it at the end of each of its turns, ending the effect on itself on a success. A creature that succeeds on its save is immune to the effect of these pipes for 24 hours.",
		usages: 3,
		recovery: "Dawn",
		additional: "regains 1d3",
		weight: 2,
		action: [["action", ""]],
	},
	"pipes of the sewers": {
		name: "Pipes of the Sewers",
		source: [["SRD24", 234], ["DMG24", 285]],
		type: "Wondrous Item",
		rarity: "Uncommon",
		magicItemTable: "Implements",
		attunement: true,
		description: "These pipes have 3 charges, regain 1d3 at dawn, and cause rats to be Indifferent to me unless threatened. As a Magic action, I can play them, then use a Bonus Action to call rats in 0.5 miles to form 1 swarm per charge spent. While playing, rat swarms in 30 ft make a DC 15 Wis save or obey my commands.",
		descriptionLong: "These pipes have 3 charges and regain 1d3 at dawn. They cause rats to be Indifferent to me unless threatened. As a Magic action, I can play them, then use a Bonus Action to call rats within 0.5 miles to come towards me and form 1 **Swarm of Rats** per charge spent. When a **Swarm of Rats** that isn't under another's control comes within 30 ft of me while I play the pipes, the swarm must make a DC 15 Wisdom save. If the swarm fails, it obeys my commands for as long as I continue to play at the pipes as a Magic action. If the swarm succeeds or starts its turn >30 ft from me, it can't be affected again for 24 hours.",
		descriptionFull: [
			"While these pipes are on your person, ordinary rats and giant rats are Indifferent toward you and won't attack you unless you threaten or harm them.",
			"The pipes have 3 charges and regain 1d3 expended charges daily at dawn. If you play the pipes as a Magic action, you can take a Bonus Action to expend 1 to 3 charges, calling forth one **Swarm of Rats** with each expended charge if enough rats are within half a mile of you to be called in this fashion (as determined by the DM). If there aren't enough rats to form a swarm, the charge is wasted. Called swarms move toward the music by the shortest available route but aren't under your control otherwise.",
			"Whenever a **Swarm of Rats** that isn't under another creature's control comes within 30 feet of you while you are playing the pipes, the swarm makes a DC 15 Wisdom saving throw. On a successful save, the swarm behaves as it normally would and can't be swayed by the pipes' music for the next 24 hours. On a failed save, the swarm is swayed by the pipes' music and becomes Friendly to you and your allies for as long as you continue to play the pipes each round as a Magic action. A Friendly swarm obeys your commands. If you issue no commands to a Friendly swarm, it defends itself but otherwise takes no actions. If a Friendly swarm starts its turn more than 30 feet away from you, your control over that swarm ends, and the swarm behaves as it normally would and can't be swayed by the pipes' music for the next 24 hours.",
		],
		usages: 3,
		recovery: "Dawn",
		additional: "regains 1d3",
		weight: 2,
		action: [
			["action", " (play)"],
			["bonus action", " (call swarm)"],
		],
		creaturesAdd: [["Swarm of Rats", true]],
		creatureOptions: [{
			name: "Swarm of Rats",
			nameThis: "swarm",
			source: [["SRD24", 362], ["MM24", 370]],
			size: 3,
			type: "Beast",
			alignment: "Unaligned",
			ac: 10,
			hp: 14,
			hd: [4, 8],
			speed: "30 ft, Climb 30 ft",
			scores: [9, 11, 9, 2, 10, 3],
			saves: ["", 2, "", "", "", ""],
			resistances: "Bludgeoning, Piercing, Slashing",
			immunities: "Charmed, Frightened, Grappled, Paralyzed, Petrified, Prone, Restrained, Stunned",
			senses: "Darkvision 30 ft",
			passivePerception: 10,
			challengeRating: "1/4",
			proficiencyBonus: 2,
			attacksAction: 1,
			attacks: [{
				name: "Bites",
				ability: 2,
				damage: [2, 4, "piercing"],
				range: "Melee (5 ft)",
				description: "Only 1d4 damage if the swarm is Bloodied",
			}],
			traits: [{
				name: "Swarm",
				description: "The [THIS] can occupy another creature's space and vice versa, and the swarm can move through any opening large enough for a Tiny rat. The swarm can't regain Hit Points or gain Temporary Hit Points.",
			}],
		}],
	},
	"plate armor of etherealness": {
		name: "Plate Armor of Etherealness",
		source: [["SRD24", 234], ["DMG24", 286]],
		type: "Armor (Half Plate Armor or Plate Armor)",
		rarity: "Legendary",
		magicItemTable: "Armaments",
		attunement: true,
		description: "Select one of the choices.",
		descriptionFull: "While you're wearing this armor, you can take a Magic action and use a command word to gain the effect of the *Etherealness* spell. The spell ends immediately if you remove the armor or take a Magic action to repeat the command word. This property of the armor can't be used again until the next dawn.",
		spellcastingBonus: [{
			name: "Once per dawn",
			spells: ["etherealness"],
			selection: ["etherealness"],
			firstCol: "onceday",
		}],
		spellChanges: {
			"etherealness": {
				components: "V,M\u0192",
				description: "I step into Ethereal Plane if on adjacent plane; can move there freely \x26 perceive 60 ft into source plane",
				changes: "Using the *Plate Armor of Etherealness*, I can cast *Etherealness* once per dawn, but only on myself and it requires a command word.",
			},
		},
		choicesNotInMenu: true,
		allowDuplicates: true,
		choices: ["Half Plate", "Plate"],
		"half plate": {
			name: "Half Plate Armor of Etherealness",
			description: "As a Magic action while wearing this half plate armor, I can use a command word to gain the effect of the *Etherealness* spell. The spell ends immediately if I remove the armor or take a Magic action to repeat the command word. This property of the armor can't be used again until the next dawn.",
			weight: 40,
			armorAdd: {
				select: "Half Plate of Etherealness",
				options: ["Half Plate of Etherealness"],
			},
		},
		"plate": {
			name: "Plate Armor of Etherealness \u180C", // needs to be different from the parent name
			description: "As a Magic action while wearing this plate armor, I can use a command word to gain the effect of the *Etherealness* spell. The spell ends immediately if I remove the armor or take a Magic action to repeat the command word. This property of the armor can't be used again until the next dawn.",
			weight: 65,
			armorAdd: {
				select: "Plate of Etherealness",
				options: ["Plate of Etherealness"],
			},
		},
	},
	"portable hole": {
		name: "Portable Hole",
		source: [["SRD24", 234], ["DMG24", 286]],
		type: "Wondrous Item",
		rarity: "Rare",
		magicItemTable: ["Arcana", "Implements"],
		description: "As a Magic action, I can unfold this handkerchief sized black cloth into a 6 ft diameter sheet and place it on a solid surface. The sheet becomes a 10 ft deep extradimensional hole which can store objects and creatures. As a Magic action, I can fold the cloth, which closes the hole. The hole always weighs very little.",
		descriptionLong: "As a Magic action, I can unfold this handkerchief sized black cloth into a 6 ft diameter sheet and place it on a solid surface. The sheet becomes a 10 ft deep extradimensional hole which can store objects and creatures. As a Magic action, I can fold the cloth, which closes the hole. The hole always weighs very little. A creature inside the closed hole can make a DC 10 Athletics check, appearing within 5 ft of the hole on a success. The closed hole contains 1 hour of air, divided by the creatures within. Placing the hole in another extradimensional space destroys both and opens a gate to the Astral Plane.",
		descriptionFull: [
			"This fine black cloth, soft as silk, is folded up to the dimensions of a handkerchief. It unfolds into a circular sheet 6 feet in diameter.",
			"You can take a Magic action to unfold a *Portable Hole* and place it on or against a solid surface, whereupon the *Portable Hole* creates an extradimensional hole 10 feet deep. The cylindrical space within the hole exists on a different plane of existence, so it can't be used to create open passages. Any creature inside an open *Portable Hole* can exit the hole by climbing out of it.",
			"You can take a Magic action to close a *Portable Hole* by taking hold of the edges of the cloth and folding it up. Folding the cloth closes the hole, and any creatures or objects within remain in the extradimensional space. No matter what's in it, the hole weighs next to nothing.",
			"If the hole is folded up, a creature within the hole's extradimensional space can take an action to make a DC 10 Strength (Athletics) check. On a successful check, the creature forces its way out and appears within 5 feet of the *Portable Hole*. A closed *Portable Hole* holds enough air for 1 hour of breathing, divided by the number of breathing creatures inside.",
			"Placing a *Portable Hole* inside an extradimensional space created by a *Bag of Holding*, *Portable Hole*, or similar item instantly destroys both items and opens a gate to the Astral Plane. The gate originates where the one item was placed inside the other. Any creature within 10 feet of the gate and not behind Total Cover is sucked through it and deposited in a random location on the Astral Plane. The gate then closes. The gate is one-way only and can't be reopened.",
		],
		action: [["action", " (place/close)"]],
	},
	"potion of animal friendship": {
		name: "Potion of Animal Friendship",
		source: [["SRD24", 235], ["DMG24", 287]],
		type: "Potion",
		rarity: "Uncommon",
		magicItemTable: ["Arcana", "Relics"],
		description: "As a Bonus Action, I can drink this potion or administer it to another to cast *Animal Friendship* at level 3, thus 3 Beasts within 30 ft must make a DC 13 Wis save or be Charmed for 24 hours or until damaged. Agitating " + (typePF ? "its" : "this potion's") + " muddy liquid brings little bits into view: a fish scale, " + (typePF ? "" : "hummingbird ") + "feather, cat claw, or squirrel hair.",
		descriptionFull: [
			"When you drink this potion, you can cast the level 3 version of the *Animal Friendship* spell (save DC 13).",
			"Agitating this potion's muddy liquid brings little bits into view: a fish scale, a hummingbird feather, a cat claw, or a squirrel hair.",
		],
		weight: 0.5,
	},
	"potion of clairvoyance": {
		name: "Potion of Clairvoyance",
		source: [["SRD24", 235], ["DMG24", 287]],
		type: "Potion",
		rarity: "Rare",
		magicItemTable: "Arcana",
		description: "As a Bonus Action, I can drink this potion or administer it to another to gain the effects of *Clairvoyance*. This creates an invisible sensor within 1 mile, in a familiar or obvious location, that the consumer can see or hear through. An eyeball bobs in this yellowish liquid but vanishes when the potion is opened.",
		descriptionFull: [
			"When you drink this potion, you gain the effect of the *Clairvoyance* spell (no Concentration required).",
			"An eyeball bobs in this potion's yellowish liquid but vanishes when the potion is opened.",
		],
		weight: 0.5,
	},
	"potion of climbing": {
		name: "Potion of Climbing",
		source: [["SRD24", 235], ["DMG24", 287]],
		type: "Potion",
		rarity: "Common",
		magicItemTable: ["Arcana", "Implements"],
		description: "As a Bonus Action, I can drink this potion or administer it to another. The consumer gains both a Climb Speed equal to their Speed and Advantage on Str" + (typePF ? "" : "ength") + " (Athletics) checks to climb for 1 hour. The potion is separated into brown, silver, and gray layers resembling bands of stone. Shaking it fails to mix the colors.",
		descriptionFull: [
			"When you drink this potion, you gain a Climb Speed equal to your Speed for 1 hour. During this time, you have Advantage on Strength (Athletics) checks to climb.",
			"This potion is separated into brown, silver, and gray layers resembling bands of stone. Shaking the bottle fails to mix the colors.",
		],
		weight: 0.5,
	},
	"potion of diminution": {
		name: "Potion of Diminution",
		source: [["SRD24", 235], ["DMG24", 287]],
		type: "Potion",
		rarity: "Rare",
		magicItemTable: ["Arcana", "Implements"],
		description: "As a Bonus Action, I can drink this potion or administer it to another. The consumer is reduced as per *Enlarge/Reduce* for 1d4 hours (no Concentration): -1 size category, Disadvantage on Strength checks and saves, -1d4 weapon damage. The red part of this potion's liquid continuously contracts and expands.",
		descriptionLong: "As a Bonus Action, I can drink this potion or administer it to another to gain the \"reduce\" effect of the *Enlarge/Reduce* spell for 1d4 hours (no Concentration required). This causes the consumer and everything that it is wearing or carrying to decrease one size category. Its weapon and Unarmed Strike attacks deal -1d4 damage (min 1) and it has Disadvantage on Strength checks and saving throws. The red in the potion's liquid continuously contracts to a tiny bead and then expands to color the clear liquid around it. Shaking the bottle fails to interrupt this process.",
		descriptionFull: [
			'When you drink this potion, you gain the "reduce" effect of the *Enlarge/Reduce* spell for 1d4 hours (no Concentration required).',
			"The red in the potion's liquid continuously contracts to a tiny bead and then expands to color the clear liquid around it. Shaking the bottle fails to interrupt this process.",
		],
		weight: 0.5,
	},
	"potion of flying": {
		name: "Potion of Flying",
		source: [["SRD24", 235], ["DMG24", 287]],
		type: "Potion",
		rarity: "Very Rare",
		magicItemTable: ["Arcana", "Implements"],
		description: "As a Bonus Action, I can drink this potion or administer it to another. The consumer gains a Fly Speed equal to their Speed for 1 hour and can hover. If aloft when the potion wears off, they fall. This potion's clear liquid floats at the top of its container and has cloudy white impurities drifting in it.",
		descriptionFull: [
			"When you drink this potion, you gain a Fly Speed equal to your Speed for 1 hour and can hover. If you're in the air when the potion wears off, you fall unless you have some other means of staying aloft.",
			"This potion's clear liquid floats at the top of its container and has cloudy white impurities drifting in it.",
		],
		weight: 0.5,
	},
	"potion of gaseous form": {
		name: "Potion of Gaseous Form",
		source: [["SRD24", 235], ["DMG24", 287]],
		type: "Potion",
		rarity: "Rare",
		magicItemTable: ["Arcana", "Implements"],
		description: "As a Bonus Action, I can drink this potion or administer it to another. The consumer gains the effect of *Gaseous Form* for 1 hour (no Concentration required), until the consumer drops to 0 HP, or ends the effect as a Bonus Action. This potion's container seems to hold fog that moves and pours like water.",
		descriptionLong: "As a Bonus Action, I can drink this potion or administer it to another. The consumer gains the effect of *Gaseous Form* for 1 hour (no Concentration required). It ends if they drop to 0 HP or end it as a Bonus Action. The consumer shape-shifts, along with all its equipment, into a misty cloud. In this form they can only move with a 10 ft Fly Speed, can hover, have Resistance to Bludgeoning, Piercing, and Slashing damage, have Adv on Str, Dex, and Con saves, and can pass through mere cracks, but can't talk, manipulate items, cast spells, or attack. This container seems to hold fog that moves and pours like water.",
		descriptionFull: [
			"When you drink this potion, you gain the effect of the *Gaseous Form* spell for 1 hour (no Concentration required) or until you end the effect as a Bonus Action.",
			"This potion's container seems to hold fog that moves and pours like water.",
		],
		weight: 0.5,
	},
	"potion of giant strength": {
		name: "Potion of Giant Strength",
		source: [["SRD24", 235], ["DMG24", 288]],
		type: "Potion",
		magicItemTable: ["Arcana", "Armaments"],
		description: "Select one of the choices.",
		descriptionFull: [
			"When you drink this potion, your Strength score changes for 1 hour. The type of giant determines the score (see the table below). The potion has no effect on you if your Strength is equal to or greater than that score.",
			"This potion's transparent liquid has floating in it a sliver of light resembling a giant's fingernail.",
			[
				["Giant Type  ", "Str", "Rarity"],
				["Hill Giant  ", "21", "Uncommon"],
				["Frost/Stone Giant", "23", "Rare"],
				["Fire Giant  ", "25", "Rare"],
				["Cloud Giant ", "27", "Very Rare"],
				["Storm Giant ", "29", "Legendary"],
			],
		],
		weight: 0.5,
		allowDuplicates: true,
		choices: ["Hill Giant (Str 21, Uncommon)", "Frost Giant (Str 23, Rare)", "Stone Giant (Str 23, Rare)", "Fire Giant (Str 25, Rare)", "Cloud Giant (Str 27, Very Rare)", "Storm Giant (Str 29, Legendary)"],
		"hill giant (str 21, uncommon)": {
			name: "Potion of Hill Giant Strength",
			sortname: "Potion of Giant Strength, Hill (Str 21)",
			rarity: "Uncommon",
			description: "As a Bonus Action, I can drink this potion or administer it to another. The consumer's Strength score becomes 21 for 1 hour. This potion has no effect if their Strength score is already equal or higher. This potion's transparent liquid has floating in it a sliver of fingernail from a hill giant.",
		},
		"frost giant (str 23, rare)": {
			name: "Potion of Frost Giant Strength",
			sortname: "Potion of Giant Strength, Frost (Str 23)",
			rarity: "Rare",
			description: "As a Bonus Action, I can drink this potion or administer it to another. The consumer's Strength score becomes 23 for 1 hour. This potion has no effect if their Strength score is already equal or higher. This potion's transparent liquid has floating in it a sliver of fingernail from a frost giant.",
		},
		"stone giant (str 23, rare)": {
			name: "Potion of Stone Giant Strength",
			sortname: "Potion of Giant Strength, Stone (Str 23)",
			rarity: "Rare",
			description: "As a Bonus Action, I can drink this potion or administer it to another. The consumer's Strength score becomes 23 for 1 hour. This potion has no effect if their Strength score is already equal or higher. This potion's transparent liquid has floating in it a sliver of fingernail from a stone giant.",
		},
		"fire giant (str 25, rare)": {
			name: "Potion of Fire Giant Strength",
			sortname: "Potion of Giant Strength, Fire (Str 25)",
			rarity: "Rare",
			description: "As a Bonus Action, I can drink this potion or administer it to another. The consumer's Strength score becomes 25 for 1 hour. This potion has no effect if their Strength score is already equal or higher. This potion's transparent liquid has floating in it a sliver of fingernail from a fire giant.",
		},
		"cloud giant (str 27, very rare)": {
			name: "Potion of Cloud Giant Strength",
			sortname: "Potion of Giant Strength, Cloud (Str 27)",
			rarity: "Very Rare",
			description: "As a Bonus Action, I can drink this potion or administer it to another. The consumer's Strength score becomes 27 for 1 hour. This potion has no effect if their Strength score is already equal or higher. This potion's transparent liquid has floating in it a sliver of fingernail from a cloud giant.",
		},
		"storm giant (str 29, legendary)": {
			name: "Potion of Storm Giant Strength",
			sortname: "Potion of Giant Strength, Storm (Str 29)",
			rarity: "Legendary",
			description: "As a Bonus Action, I can drink this potion or administer it to another. The consumer's Strength score becomes 29 for 1 hour. This potion has no effect if their Strength score is already equal or higher. This potion's transparent liquid has floating in it a sliver of fingernail from a storm giant.",
		},
	},
	"potion of growth": {
		name: "Potion of Growth",
		source: [["SRD24", 235], ["DMG24", 288]],
		type: "Potion",
		rarity: "Uncommon",
		magicItemTable: ["Arcana", "Implements"],
		description: "As a Bonus Action, I can drink this potion or administer it to another. The consumer is enlarged as per *Enlarge/Reduce* for 10 min (no Concentration): +1 size category, Advantage on Strength checks/saves, +1d4 weapon damage. The red part of this potion's liquid continuously contracts and expands.",
		descriptionLong: "As a Bonus Action, I can drink this potion or administer it to another to gain the \"enlarge\" effect of the *Enlarge/Reduce* spell for 10 minutes (no Concentration required). This causes the consumer and everything that it is wearing or carrying to increase one size category. Any item it drops returns to normal size at once. Its weapon and Unarmed Strike attacks deal +1d4 damage and it has Advantage on Strength checks and saving throws. The red in the potion's liquid continuously expands from a tiny bead to color the clear liquid around it and then contracts. Shaking the bottle fails to interrupt this process.",
		descriptionFull: [
			'When you drink this potion, you gain the "enlarge" effect of the *Enlarge/Reduce* spell for 10 minutes (no Concentration required).',
			"The red in the potion's liquid continuously expands from a tiny bead to color the clear liquid around it and then contracts. Shaking the bottle fails to interrupt this process.",
		],
		weight: 0.5,
	},
	"potion of healing": {
		name: "Potion of Healing",
		source: [["SRD24", 236], ["DMG24", 288]],
		type: "Potion",
		magicItemTable: ["Implements", "Relics"],
		description: "Select one of the choices.",
		descriptionFull: [
			"You regain Hit Points when you drink this potion. The number of Hit Points depends on the potion's rarity, as shown in the table below.",
			"Whatever its potency, the potion's red liquid glim-mers when agitated.",
			[
				["Potion", "HP Regained", "Rarity"],
				["Healing", "2d4+2", "Common"],
				["Greater Healing", "4d4+4", "Uncommon"],
				["Superior Healing", "8d4+8", "Rare"],
				["Supreme Healing", "10d4+20", "Very Rare"],
			],
		],
		weight: 0.5,
		allowDuplicates: true,
		choices: ["Healing (Common; 2d4+2)", "Greater Healing (Uncommon; 4d4+4)", "Superior Healing (Rare; 8d4+8)", "Supreme Healing (Very Rare; 10d4+20)"],
		"healing (common; 2d4+2)": {
			name: "Potion of Healing  ",
			rarity: "Common",
			description: "As a Bonus Action, I can drink this potion or administer it to another. The consumer regains 2d4+2 Hit Points. This potion's red liquid glimmers when agitated.",
			descriptionFull: "You regain 2d4 + 2 Hit Points when you drink this potion. The potion's red liquid glimmers when agitated. ",
			extraTooltip: "Can be bought for 50 gp",
		},
		"greater healing (uncommon; 4d4+4)": {
			name: "Potion of Greater Healing",
			sortname: "Potion of Healing, Greater",
			rarity: "Uncommon",
			description: "As a Bonus Action, I can drink this potion or administer it to another. The consumer regains 4d4+4 Hit Points. This potion's red liquid glimmers when agitated.",
			descriptionFull: "You regain 4d4 + 4 Hit Points when you drink this potion. The potion's red liquid glimmers when agitated.",
		},
		"superior healing (rare; 8d4+8)": {
			name: "Potion of Superior Healing",
			sortname: "Potion of Healing, Superior",
			rarity: "Rare",
			description: "As a Bonus Action, I can drink this potion or administer it to another. The consumer regains 8d4+8 Hit Points. This potion's red liquid glimmers when agitated.",
			descriptionFull: "You regain 8d4 + 8 Hit Points when you drink this potion. The potion's red liquid glimmers when agitated.",
		},
		"supreme healing (very rare; 10d4+20)": {
			name: "Potion of Supreme Healing",
			sortname: "Potion of Healing, Supreme",
			rarity: "Very Rare",
			description: "As a Bonus Action, I can drink this potion or administer it to another. The consumer regains 10d4+20 Hit Points. This potion's red liquid glimmers when agitated.",
			descriptionFull: "You regain 10d4 + 20 Hit Points when you drink this potion. The potion's red liquid glimmers when agitated.",
		},
	},
	"potion of heroism": {
		name: "Potion of Heroism",
		source: [["SRD24", 236], ["DMG24", 288]],
		type: "Potion",
		rarity: "Rare",
		magicItemTable: ["Arcana", "Armaments"],
		description: "As a Bonus Action, I can drink this potion or administer it to another. The consumer gains both 10 Temporary Hit Points and the effects of the *Bless* spell (no Concentration required) for 1 hour. *Bless* adds +1d4 on all attack rolls and saving throws. This potion's blue liquid bubbles and steams as if boiling.",
		descriptionFull: [
			"When you drink this potion, you gain 10 Temporary Hit Points that last for 1 hour. For the same duration, you are under the effect of the *Bless* spell (no Concentration required).",
			"This potion's blue liquid bubbles and steams as if boiling.",
		],
		weight: 0.5,
	},
	"potion of invisibility": {
		name: "Potion of Invisibility",
		source: [["SRD24", 236], ["DMG24", 288]],
		type: "Potion",
		rarity: "Rare",
		magicItemTable: "Arcana",
		description: "As a Bonus Action, I can drink this potion or administer it to another. The consumer gains the Invisible condition for 1 hour. The effect ends early if the consumer makes an attack roll, deals damage, or casts a spell. This potion's container looks empty but feels as though it holds liquid.",
		descriptionFull: "This potion's container looks empty but feels as though it holds liquid. When you drink the potion, you have the Invisible condition for 1 hour. The effect ends early if you make an attack roll, deal damage, or cast a spell.",
		weight: 0.5,
	},
	"potion of invulnerability": {
		name: "Potion of Invulnerability",
		source: [["SRD24", 236], ["DMG24", 288]],
		type: "Potion",
		rarity: "Rare",
		magicItemTable: ["Arcana", "Armaments"],
		description: "As a Bonus Action, I can drink this potion or administer it to another. The consumer gains Resistance to all damage for 1 minute. This potion's syrupy liquid looks like liquefied iron.",
		descriptionFull: [
			"For 1 minute after you drink this potion, you have Resistance to all damage.",
			"This potion's syrupy liquid looks like liquefied iron.",
		],
		weight: 0.5,
	},
	"potion of longevity": {
		name: "Potion of Longevity",
		source: [["SRD24", 236], ["DMG24", 288]],
		type: "Potion",
		rarity: "Very Rare",
		magicItemTable: "Arcana",
		description: "As a Bonus Action, I can drink this potion or administer it to another. The consumer's physical age is reduced by 1d6+6 years, to a minimum of 13 years. Subsequent consumptions of this type of potion have a 10% cumulative chance to instead age the consumer by 1d6+6 years. It contains a tiny beating heart.",
		descriptionLong: [
			"As a Bonus Action, I can drink this potion or administer it to another. The consumer's physical age is reduced by 1d6+6 years, to a minimum of 13 years. Subsequent consumptions of this type of potion have a 10% cumulative chance to instead age the consumer by 1d6+6 years.",
			"Suspended in this amber liquid is a tiny heart that, against all reason, is still beating. These ingredients vanish when the potion is opened.",
		],
		descriptionFull: [
			"When you drink this potion, your physical age is reduced by 1d6 + 6 years, to a minimum of 13 years. Each time you subsequently drink a *Potion of Longevity*, there is 10 percent cumulative chance that you instead age by 1d6 + 6 years.",
			"Suspended in this amber liquid is a tiny heart that, against all reason, is still beating. These ingredients vanish when the potion is opened.",
		],
		weight: 0.5,
	},
	"potion of mind reading": {
		name: "Potion of Mind Reading",
		source: [["SRD24", 236], ["DMG24", 288]],
		type: "Potion",
		rarity: "Rare",
		magicItemTable: "Arcana",
		description: "As a Bonus Action, I can drink this potion or administer it to another to gain the effect of *Detect Thoughts* for 10 min (save DC 13, no Concentration required). It lets me, within 30 ft, sense the presence of thoughts or read/probe one creature's thoughts." + (typePF ? "The potion is purple with a pink ovoid cloud in it." : "This potion's dense, purple liquid has an ovoid cloud of pink floating in it."),
		descriptionFull: [
			"When you drink this potion, you gain the effect of the *Detect Thoughts* spell (save DC 13) for 10 minutes (no Concentration required).",
			"This potion's dense, purple liquid has an ovoid cloud of pink floating in it.",
		],
		weight: 0.5,
	},
	"potion of poison": {
		name: "Potion of Poison",
		source: [["SRD24", 236], ["DMG24", 288]],
		type: "Potion",
		rarity: "Uncommon",
		magicItemTable: "Arcana",
		description: "The consumer of this potion takes 4d6 Poison damage and must succeed on a DC 13 Constitution saving throw or have the Poisoned condition for 1 hour. This concoction looks, smells, and tastes like a beneficial potion. However, it is actually poison masked by illusion magic. *Identify* reveals its true nature.",
		descriptionFull: [
			"This concoction looks, smells, and tastes like a *Potion of Healing* or another beneficial potion. However, it is actually poison masked by illusion magic. *Identify* reveals its true nature.",
			"If you drink this potion, you take 4d6 Poison damage and must succeed on a DC 13 Constitution saving throw or have the Poisoned condition for 1 hour.",
		],
		weight: 0.5,
		action: false, // To keep the default potion action from being added
	},
	"potion of resistance": function (){
		var obj = {
			name: "Potion of Resistance",
			source: [["SRD24", 236], ["DMG24", 289]],
			type: "Potion",
			rarity: "Uncommon",
			magicItemTable: ["Arcana", "Relics"],
			description: "Select one of the choices.",
			descriptionFull: [
				"When you drink this potion, you have Resistance to one type of damage for 1 hour. The DM chooses the type or determines it randomly by rolling on the following table.",
				[
					["1d10", "Damage Type"],
					[" 1", "Acid"],
					[" 2", "Cold"],
					[" 3", "Fire"],
					[" 4", "Force"],
					[" 5", "Lightning"],
					[" 6", "Necrotic"],
					[" 7", "Poison"],
					[" 8", "Psychic"],
					[" 9", "Radiant"],
					["10", "Thunder"],
				],
			],
			weight: 0.5,
			allowDuplicates: true,
			choicesNotInMenu: true,
			choices: [],
		};
		["Acid", "Cold", "Fire", "Force", "Lightning", "Necrotic", "Poison", "Psychic", "Radiant", "Thunder"].forEach(function (type) {
			obj.choices.push(type);
			obj[type.toLowerCase()] = {
				name: "Potion of " + type + " Resistance",
				description: "As a Bonus Action, I can drink this potion or administer it to another. The consumer gains Resistance to " + type + " damage for 1 hour.",
			};
		});
		return obj;
	}(),
	"potion of speed": {
		name: "Potion of Speed",
		source: [["SRD24", 236], ["DMG24", 289]],
		type: "Potion",
		rarity: "Very Rare",
		magicItemTable: ["Arcana", "Implements"],
		description: "As a Bonus Action, I can drink this potion or administer it to another. The consumer gains the effects of *Haste* for 1 minute (no Concentration) without feeling lethargy afterwards: Speed \xD72, +2 AC, Adv on Dex saves, +1 Attack, Dash, Disengage, Hide, or Utilize action each turn. " + (typePF ? "Its" : "This potion's") + " yellow fluid is streaked with black" + (typePF ? "." : " and swirls on its own."),
		descriptionLong: [
			"As a Bonus Action, I can drink this potion or administer it to another. The consumer gains the effects of the *Haste* spell for 1 minute (no Concentration required) without suffering the wave of lethargy that typically occurs when the effect ends. The consumer's Speed is doubled, it gains a +2 bonus to Armor Class, it has Advantage on Dexterity saving throws, and it gains an additional action on each of its turns. That action can be used to take only the Attack (one attack only), Dash, Disengage, Hide, or Utilize action.",
			"This potion's yellow fluid is streaked with black and swirls on its own.",
		],
		descriptionFull: [
			"When you drink this potion, you gain the effect of the *Haste* spell for 1 minute (no Concentration required) without suffering the wave of lethargy that typically occurs when the effect ends.",
			"This potion's yellow fluid is streaked with black and swirls on its own.",
		],
		weight: 0.5,
	},
	"potion of vitality": {
		name: "Potion of Vitality",
		source: [["SRD24", 236], ["DMG24", 289]],
		type: "Potion",
		rarity: "Very Rare",
		magicItemTable: ["Arcana", "Relics"],
		description: "As a Bonus Action, I can drink this potion or administer it to another. Remove any Exhaustion levels and the Poisoned condition from the consumer. For the next 24 hours, they regain the maximum amount of HP for any Hit Dice used. This potion's crimson liquid pulses with dull light, calling to mind a heartbeat.",
		descriptionFull: [
			"When you drink this potion, it removes any Exhaustion levels you have and ends the Poisoned condition on you. For the next 24 hours, you regain the maximum number of Hit Points for any Hit Point Die you spend.",
			"This potion's crimson liquid regularly pulses with dull light, calling to mind a heartbeat.",
		],
		weight: 0.5,
	},
	"potion of water breathing": {
		name: "Potion of Water Breathing",
		source: [["SRD24", 236], ["DMG24", 289]],
		type: "Potion",
		rarity: "Uncommon",
		magicItemTable: ["Arcana", "Implements"],
		description: "As a Bonus Action, I can drink this potion or administer it to another. The consumer is able to breathe underwater for 24 hours. This potion's cloudy green fluid smells of the sea and has a jellyfish-like bubble floating in it.",
		descriptionFull: [
			"You can breathe underwater for 24 hours after drinking this potion.",
			"This potion's cloudy green fluid smells of the sea and has a jellyfish-like bubble floating in it.",
		],
		weight: 0.5,
	},
	"quaal's feather token": {
		name: "Quaal's Feather Token",
		nameAlt: "Feather Token",
		source: [["SRD24", 221], ["DMG24", 290]],
		type: "Wondrous Item",
		magicItemTable: ["Arcana", "Implements"],
		description: "Select one of the choices.",
		descriptionFull: [
			"This object looks like a feather. Different types of feather tokens exist, each with a different single-use effect. The DM chooses the kind of token or determines it randomly by rolling on the table below. The type of token determines its rarity.",
			[
				["1d100", "Token", "", "Rarity"],
				["01-20", "Anchor", "", "Uncommon"],
				["21-35", "Bird", "", "Rare"],
				["36-50", "Fan", "", "Uncommon"],
				["51-65", "Swan Boat  ", "Rare"],
				["66-90", "Tree", "", "Uncommon"],
				["91-00", "Whip", "", "Rare"],
			],
		],
		allowDuplicates: true,
		choices: ["Anchor (Uncommon)", "Bird (Rare)", "Fan (Uncommon)", "Swan Boat (Rare)", "Tree (Uncommon)", "Whip (Rare)"],
		"anchor (uncommon)": {
			name: "Quaal's Feather Token, Anchor",
			nameAlt: "Feather Token, Anchor",
			nameTest: "Quaal's Feather Token [Anchor]",
			rarity: "Uncommon",
			description: "As a Magic action, I can touch this feather token to a boat or ship. For the next 24 hours, the vessel can't be moved by any means. I can touch the token to the vessel again, ending the effect. When the effect ends, the token disappears.",
			action: [["action", "Anchor Token (use/end)"]],
			descriptionFull: [
				"This object looks like a feather.",
				"You can take a Magic action to touch the token to a boat or ship. For the next 24 hours, the vessel can't be moved by any means. Touching the token to the vessel again ends the effect. When the effect ends, the token disappears.",
			],
		},
		"bird (rare)": {
			name: "Quaal's Feather Token, Bird",
			nameAlt: "Feather Token, Bird",
			nameTest: "Quaal's Feather Token [Bird]",
			rarity: "Rare",
			description: "As a Magic action, I can toss this token into the air, turning into a **Roc**. It obeys my commands, can't attack, can fly, carrying 500 lb (16 miles/hour or 144 miles/day), or 1,000 lb at half speed. It rests 1 hour per 3 flown. It disappears if it drops to 0 HP, after flying its max distance for a day, or I dismiss it as a Magic action.",
			action: [["action", "Bird Feather Token (create/dismiss)"]],
			descriptionFull: [
				"This object looks like a feather.",
				"You can take a Magic action to toss the token 5 feet into the air. The token disappears and an enormous, multicolored bird takes its place. The bird has the statistics of a **Roc**, but it can't attack. It obeys your simple commands and can carry up to 500 pounds while flying at its maximum speed (16 miles per hour for a maximum of 144 miles per day, with a 1-hour rest for every 3 hours of flying) or 1,000 pounds at half that speed. The bird disappears after flying its maximum distance for a day or if it drops to 0 Hit Points. You can dismiss the bird as a Magic action.",
			],
		},
		"fan (uncommon)": {
			name: "Quaal's Feather Token, Fan",
			nameAlt: "Feather Token, Fan",
			nameTest: "Quaal's Feather Token [Fan]",
			rarity: "Uncommon",
			description: "As a Magic action when I'm on a boat or ship, I can toss this token 10 ft in the air. The token disappears, and a giant flapping fan takes its place. The fan floats and creates a strong wind which fills the sails of one ship, increasing its speed by 5 miles per hour for 8 hours. I can dismiss the fan as a Magic action.",
			action: [["action", "Fan Feather Token (create/dismiss)"]],
			descriptionFull: [
				"This object looks like a feather.",
				"If you are on a boat or ship, you can take a Magic action to toss the token up to 10 feet in the air. The token disappears, and a giant flapping fan takes its place. The fan floats and creates a strong wind. This wind can fill the sails of one ship, increasing its speed by 5 miles per hour for 8 hours. You can dismiss the fan as a Magic action.",
			],
		},
		"swan boat (rare)": {
			name: "Quaal's Feather Token, Swan Boat",
			nameAlt: "Feather Token, Swan Boat",
			nameTest: "Quaal's Feather Token [Swan Boat]",
			rarity: "Rare",
			description: "As a Magic action, I can touch the token to a body of water at least 60 ft in diameter, causing it to turn into a 50 ft by 20 ft boat shaped like a swan that remains for 24 hours. It is self-propelled, moving at 6 miles per hour. As a Magic action, I can command it to move or turn up to 90\xB0.",
			action: [["action", "Swan Boat Token (create/command/dismiss)"]],
			descriptionFull: [
				"This object looks like a feather.",
				"You can take a Magic action to touch the token to a body of water at least 60 feet in diameter. The token disappears, and a 50-foot-long, 20-foot-wide boat shaped like a swan takes its place. The boat is self-propelled and moves across water at a speed of 6 miles per hour. You can take a Magic action while on the boat to command it to move or to turn up to 90 degrees. The boat remains for 24 hours and then disappears. You can dismiss the boat as a Magic action.",
			],
		},
		"tree (uncommon)": {
			name: "Quaal's Feather Token, Tree",
			nameAlt: "Feather Token, Tree",
			nameTest: "Quaal's Feather Token [Tree]",
			rarity: "Uncommon",
			description: "As a Magic action, I can touch this feather token to an empty space on the ground. If this is done outdoors, the token disappears, and in its place a nonmagical oak tree springs into existence. The tree is 60 ft tall, has a 5-ft diameter trunk, and its branches at the top spread out in a 20-ft radius.",
			action: [["action", "Tree Feather Token (create)"]],
			descriptionFull: [
				"This object looks like a feather.",
				"You must be outdoors to use this token. You can take a Magic action to touch it to an unoccupied space on the ground. The token disappears, and in its place a nonmagical oak tree springs into existence. The tree is 60 feet tall and has a 5-foot-diameter trunk, and its branches at the top spread out in a 20-foot radius.",
			],
		},
		"whip (rare)": {
			name: "Quaal's Feather Token, Whip",
			nameAlt: "Feather Token, Whip",
			nameTest: "Quaal's Feather Token [Whip]",
			source: [["SRD24", 221], ["DMG24", 291]],
			rarity: "Rare",
			description: "As a Magic action, can throw the token 10 ft, where it turns into a floating whip for 1 hour, until I use a Magic action to dismiss it, I die, or I become Incapacitated. As a Bonus Action, I can have it fly 20 ft and make a melee spell attack against a creature within 10 ft of it, with a +9 to hit and dealing 1d6+5 Force damage.",
			action: [
				["action", "Whip Feather Token (create)"],
				["bonus action", "Whip Feather Token (attack)"],
			],
			descriptionFull: [
				"This object looks like a feather.",
				"You can take a Magic action to throw the token to a point within 10 feet of yourself. The token disappears, and a floating whip takes its place. You can then take a Bonus Action to make a melee spell attack against a creature within 10 feet of the whip, with an attack bonus of +9. On a hit, the target takes 1d6 + 5 Force damage.",
				"As a Bonus Action, you can direct the whip to fly up to 20 feet and repeat the attack against a creature within 10 feet of the whip. The whip disappears after 1 hour, when you take a Magic action to dismiss it, or when you die or have the Incapacitated condition.",
			],
		},
	},
	"quarterstaff of the acrobat": {
		name: "Quarterstaff of the Acrobat",
		source: [["SRD24", 237], ["DMG24", 291]],
		type: "Weapon (Quarterstaff)",
		rarity: "Very Rare",
		magicItemTable: "Armaments",
		attunement: true,
		description: "As a Bonus Action while holding this item, I can alter its form (+2 Quarterstaff, 6-inch rod, 10-ft pole). While holding it as a pole or staff, I have Adv on Acrobatics. The staff has Thrown (30/120 ft), returning to me after an attack. As a Reaction once per SR when hit while holding it as a staff, I can gain +5 AC vs the attack.",
		descriptionLong: "As a Bonus Action while holding this item, I can alter its form into a 6-inch rod, 10-ft pole, or a +2 Quarterstaff. It elongates only as far as the space allows. As a Bonus Action or when rolling Initiative, I can have emit a green 10-ft radius Dim Light, which I can extinguish as a Bonus Action. While holding it as a pole or staff, I have Advantage on Dex (Acrobatics) checks. As a Reaction once per Short Rest when hit by an attack while holding it as a staff, I can gain +5 AC against the attack, potentially causing it to miss. As a staff, it has Thrown (30/120 ft) and flies back to my hand after I make a ranged attack with it.",
		descriptionFull: [
			"You have a +2 bonus to attack rolls and damage rolls made with this magic weapon.",
			"While holding this weapon, you can cause it to emit green Dim Light out to 10 feet, either as a Bonus Action or after you roll Initiative, or you can extinguish the light as a Bonus Action.",
			"While holding this weapon, you can take a Bonus Action to alter its form, turning it into a 6-inch rod (for ease of storage) or a 10-foot pole, or reverting it to a Quarterstaff; the weapon will elongate only as far as the surrounding space allows.",
			"In certain forms, the weapon has the following additional properties.",
			"***Acrobatic Assist (Quarterstaff and 10-Foot Pole Forms Only)***. While holding this weapon, you have Advantage on Dexterity (Acrobatics) checks.",
			"***Attack Deflection (Quarterstaff Form Only)***. When you are hit by an attack while holding the weapon, you can take a Reaction to twirl the weapon around you, gaining a +5 bonus to your Armor Class against the triggering attack, potentially causing the attack to miss you. You can't use this property again until you finish a Short or Long Rest.",
			"***Ranged Weapon (Quarterstaff Form Only)***. This weapon has the Thrown property with a normal range of 30 feet and a long range of 120 feet. Immediately after you make a ranged attack with the weapon, it flies back to your hand.",
		],
		extraLimitedFeatures: [{
			name: "Quarterstaff of the Acrobat (deflect)",
			usages: 1,
			recovery: "Short Rest",
		}],
		weight: 4,
		action: [
			["bonus action", " (light on/off)"],
			["bonus action", " (transform)"],
			["reaction", " (deflect)"],
		],
		advantages: [["Acrobatics", true]],
		weaponOptions: [{
			baseWeapon: "quarterstaff",
			regExpSearch: /^(?=.*quarterstaff)(?=.*acrobat).*$/i,
			name: "Quarterstaff of the Acrobat",
			source: [["SRD24", 237], ["DMG24", 291]],
			range: "Melee, 30/120 ft",
			description: "Returning, Thrown, Versatile (1d8)",
			modifiers: [2, 2],
			selectNow: true,
		}],
		toNotesPage: [{
			name: "Quarterstaff of the Acrobat",
			useDescriptionFull: function (str) {
				return str.replace("to miss I", "to miss me");
			},
		}],
	},
	"quiver of ehlonna": {
		name: "Quiver of Ehlonna",
		nameAlt: "Efficient Quiver",
		source: [["SRD24", 219], ["DMG24", 291]],
		type: "Wondrous Item",
		rarity: "Uncommon",
		magicItemTable: "Armaments",
		description: "This quiver has three compartments and weighs 2 lb, regardless of its contents. Its shortest compartment can hold 60 Arrows, Bolts, or similar objects. Its midsize compartment holds up to 18 Javelins or similar objects. Its longest compartment holds up to 6 long objects, such as bows, Quarterstaffs, or Spears.",
		descriptionFull: [
			"Each of the quiver's three compartments connects to an extradimensional space that allows the quiver to hold numerous items while never weighing more than 2 pounds. The shortest compartment can hold up to 60 Arrows, Bolts, or similar objects. The midsize compartment holds up to 18 Javelins or similar objects. The longest compartment holds up to 6 long objects, such as bows, Quarterstaffs, or Spears.",
			"You can draw any item the quiver contains as if doing so from a regular quiver or scabbard.",
		],
		weight: 2,
	},
	"ring of animal influence": {
		name: "Ring of Animal Influence",
		source: [["SRD24", 237], ["DMG24", 292]],
		type: "Ring",
		rarity: "Rare",
		magicItemTable: "Relics",
		description: "This ring has 3 charges, and it regains 1d3 expended charges daily at dawn. While wearing the ring, I can expend 1 charge to cast one of the following spells (save DC 13) from it: *Animal Friendship*, *Speak with Animals*, or *Fear*. *Fear* cast from this ring only affects Beasts.",
		descriptionFull: [
			"This ring has 3 charges, and it regains 1d3 expended charges daily at dawn. While wearing the ring, you can expend 1 charge to cast one of the following spells (save DC 13) from it:",
			" \u2022 *Animal Friendship*",
			" \u2022 *Fear* (affects Beasts only)",
			" \u2022 *Speak with Animals*",
		],
		usages: 3,
		recovery: "Dawn",
		additional: "regains 1d3",
		fixedDC: 13,
		spellFirstColTitle: "Ch",
		spellcastingBonus: [{
			name: "1 charge",
			spells: ["animal friendship", "speak with animals", "fear"],
			selection: ["animal friendship", "speak with animals", "fear"],
			firstCol: 1,
			times: 3,
		}],
		spellChanges: {
			"fear": {
				name: "Feat (Beast only)",
				description: "All Beast save or drop held items, Frightened, and Dash away; extra save at its EoT if not in line of sight",
				changes: "Only affects Beasts.",
			},
		},
	},
	"ring of djinni summoning": {
		name: "Ring of Djinni Summoning",
		source: [["SRD24", 237], ["DMG24", 292]],
		type: "Ring",
		rarity: "Legendary",
		magicItemTable: "Arcana",
		attunement: true,
		description: "As a Magic action, I can use this ring to summon a specifc **Djinni** within 120 ft, who remains for up to 1 hour while I Concentrate, or until it drops to 0 HP. It is Friendly to me and my allies and obeys my commands. After it departs, it can't be summoned again for 24 hours. The ring loses its magic if the djinni dies.",
		descriptionFull: [
			"While wearing this ring, you can take a Magic action to summon a particular **Djinni** from the Elemental Plane of Air. The djinni appears in an unoccupied space you choose within 120 feet of yourself. It remains as long as you maintain Concentration, to a maximum of 1 hour, or until it drops to 0 Hit Points.",
			"While summoned, the djinni is Friendly to you and your allies, and it obeys your commands. If you fail to command it, the djinni defends itself against attackers but takes no other actions.",
			"After the djinni departs, it can't be summoned again for 24 hours, and the ring becomes nonmagical if the djinni dies.",
			"*Rings of Djinni Summoning* are often created by the djinn they summon and given to mortals as gifts of friendship or tokens of esteem.",
		],
		usages: 1,
		recovery: "24 hours",
		creaturesAdd: [["Djinni", true, function (AddRemove, prefix) {
			if (!AddRemove) return;
			var noteAddition = "##\u25C6 Summoned##. The djinni is Friendly to its summoner and their allies and follows the commands of its summoner. If its summoner fails to command it, the djinni defends itself against attackers but takes no other actions.";
			AddString(prefix + "Cnote.Left", noteAddition, true);
		}]],
		creatureOptions: [{
			name: "Djinni",
			source: [["SRD24", 280], ["MM24", 99]],
			size: 2,
			eval: function (prefix) {
				Value(prefix + "Comp.Desc.Name", "Ring of Djinni Summoning");
				Value(prefix + "Comp.Type", "Summon");
			},
			type: "Elemental",
			subtype: "Genie",
			alignment: "Neutral",
			ac: 17,
			hp: 218,
			hd: [19, 10],
			speed: "30 ft, Fly 90 ft (hover)",
			scores: [21, 15, 22, 15, 16, 20],
			saves: ["", 6, "", "", 7, ""],
			immunities: "Lightning, Thunder",
			senses: "Darkvision 120 ft",
			passivePerception: 13,
			languages: "Primordial (Auran)",
			challengeRating: "11",
			proficiencyBonus: 4,
			attacksAction: 3,
			features: [{
				name: "Elemental Restoration",
				description: "If the [THIS] dies outside the Plane of Air, its body dissolves. It revives in 1d4 days somewhere on the Plane of Air with a new body and all its HP.",
			}, {
				name: "Magic Resistance",
				description: "Advantage on saves against spells and magical effects.",
			}, {
				name: "Wishes",
				description: "The [THIS] has a 30% chance of knowing *Wish* and be able to cast it only on behalf of a non-genie who communicates the wish to the [THIS]. The [THIS] suffers none of the spell's stress. Once the [THIS] has cast it three times, the [THIS] can't do so again for 365 days.",
			}],
			actions: [{
				name: "Multiattack",
				description: "As an Attack action, the [THIS] can make a combination of 3 Storm Blade or Storm Bolt attacks.",
			}, {
				name: "Create Whirlwind",
				description: [
					"The [THIS] conjures a whirlwind at a point it can see within 120 ft, filling a 20-ft-radius, 60-ft-high Cylinder centered there until the [THIS]'s Concentration on it ends. The [THIS] can move the whirlwind up to 20 ft at the start of each of its turns.",
					"Whenever the whirlwind enters a creature's space or a creature enters the whirlwind, it must make a DC 17 Strength save or be Restrained and move with the whirlwind. A creature makes this save only once per turn, and the [THIS] is unaffected. At the start of each of its turns, a Restrained target takes 6d6 Thunder damage. At the end of each of its turns, the target repeats the save, ending the effect on itself on a success.",
				].join("\n"),
			}],
			notes: [{
				name: "Spellcasting",
				description: [
					"The [THIS] can cast the following spells, requiring no Material components and using Charisma as the spellcasting ability (spell save DC 17):",
					"**At Will**: *Detect Evil and Good*, *Detect Magic*",
					"**2/Day Each**: *Create Food and Water* (can create wine instead of water), *Tongues*, *Wind Walk*",
					"**1/Day Each**: *Creation*, *Gaseous Form*, *Invisibility*, *Major Image*, *Plane Shift*",
				].join("\n   "),
				eval: function (prefix, lvl) {
					// Add spellcasting
					var spName = prefix + "djinni";
					CurrentSpells[spName] = {
						name: "Djinni (creature)",
						ability: 6,
						fixedDC: 17,
						typeSp: "creature",
						refType: "creature",
						allowUpCasting: false,
						firstCol: "Us",
						bonus: {},
					};
					processSpBonus(true, "djinni", [{
						name: "At Will by Djinni",
						spells: ["detect evil and good", "detect magic"],
						selection: ["detect evil and good", "detect magic"],
						firstCol: "atwill",
						times: 2,
					}, {
						name: "2/Day by Djinni",
						spells: ["create food and water", "tongues", "wind walk"],
						selection: ["create food and water", "tongues", "wind walk"],
						firstCol: "2\xD7",
						times: 3,
					}, {
						name: "1/Day by Djinni",
						spells: ["creation", "gaseous form", "invisibility", "major image", "plane shift"],
						selection: ["creation", "gaseous form", "invisibility", "major image", "plane shift"],
						firstCol: "onceday",
						times: 5,
					}], "magic", spName);
					var changesObj = {
						components: "V,S",
						compMaterial: "Spells cast by a Djinni requires no Material components.",
						changes: "Spells cast by a Djinni requires no Material components.",
					};
					processSpChanges(true, "Djinni", {
						"create food and water": {
							description: "Create 45 lb food and 30 gallons fresh water/wine on ground/in containers; food spoils after 24 hrs",
						},
						"creation": changesObj,
						"detect magic": { ritual: false },
						"gaseous form": changesObj,
						"invisibility": changesObj,
						"major image": changesObj,
						"plane shift": Object.assign({}, changesObj, {
							description: "Me \x26 8 willing crea teleport to another plane: general location or known teleport circle; see book",
						}),
						"tongues": Object.assign({}, changesObj, { components: "V" }),
						"wind walk": changesObj,
					}, spName);
				},
				removeeval: function (prefix, lvl) {
					// Remove spellcasting
					processSpBonus(false, "djinni", false, "magic", prefix + "djinni");
				},
			}],
			attacks: [{
				name: "Storm Blade",
				ability: 1,
				damage: [2, 6, "slashing"],
				range: "Melee (5 ft)",
				description: "+2d6 Lightning damage; 3 Storm Blade/Storm Bolt attacks as an Action",
			}, {
				name: "Storm Bolt",
				ability: 1,
				damage: [3, 8, "thunder"],
				range: "120 ft",
				description: "\u2264Large creature hit is knocked Prone; 3 Storm Blade/Storm Bolt attacks as an Action",
				abilitytodamage: false,
			}, {
				name: "Create Whirlwind",
				ability: 6,
				damage: ["Str save", "", "Restrained"],
				range: "120 ft",
				description: "20-ft radius, 60-ft high; If Restrained: move with whirlwind, 6d6 Thunder damage SoT, EoT save to end",
				dc: true,
				abilitytodamage: false,
				tooltip: "*Strength Saving Throw*: DC 17, a creature that enters the whirlwind's space or that the whirlwind enters (once per turn only, and the djinni is unaffected). *Failure*: While in the whirlwind, the target has the Restrained condition and moves with the whirlwind. At the start of each of its turns, the Restrained target takes 6d6 Thunder damage. At the end of each of its turns, the target repeats the save, ending the effect on itself on a success.",
			}],
		}],
	},
	"ring of elemental command": {
		name: "Ring of Elemental Command",
		source: [["SRD24", 237], ["DMG24", 292]],
		type: "Ring",
		rarity: "Legendary",
		magicItemTable: "Arcana",
		attunement: true,
		description: "Select one of the choices.",
		descriptionFull: [
			"Each *Ring of Elemental Command* is linked to one of the four Elemental Planes. The DM chooses or ran-domly determines the linked plane. For example, a *Ring of Elemental Command* (air) is linked to the Elemental Plane of Air.",
			"Every Ring of Elemental Command has the following two properties:",
			" \u2022 **Elemental Bane**. While wearing the ring, you have Advantage on attack rolls against Elementals and they have Disadvantage on attack rolls against you.",
			" \u2022 **Elemental Compulsion**. While wearing the ring, you can take a Magic action to try to compel an Elemental you see within 60 feet of yourself. The Elemental makes a DC 18 Wisdom saving throw. On a failed save, the Elemental has the Charmed condition until the start your next turn, and you determine what it does with its move and action on its next turn.",
			"***Elemental Focus***. While wearing the ring, you benefit from additional properties corresponding to the ringâ€™s linked Elemental Plane:",
			" \u2022 **Air**. You know Auran, you have Resistance to Lightning damage, and you have a Fly Speed equal to your Speed and can hover.",
			" \u2022 **Earth**. You know Terran, and you have Resistance to Acid damage. Terrain composed of rubble, rocks, or dirt isn't Difficult Terrain for you. In addition, you can move through solid earth or rock as if those areas were Difficult Terrain without disturbing the matter through which you pass. If you end your turn in solid earth or rock, you are shunted out to the nearest unoccupied space you last occupied.",
			" \u2022 **Fire**. You know Ignan, and you have Immunity to Fire damage.",
			" \u2022 **Water**. You know Aquan, you gain a Swim Speed of 60 feet, and you can breathe underwater.",
			"***Spellcasting***. The ring has 5 charges and re-gains 1d4 + 1 expended charges daily at dawn. While wearing the ring, you can cast a spell from it. Choose the spell from the list of available spells based on the Elemental Plane the ring is linked to, as shown in the following table. The table indicates how many charges you must expend to cast the spell, which has a save DC of 18.",
			[
				["Plane", "Spells (Charges)"],
				["Air", "*Chain Lightning* (3 charges), *Feather Fall* (0 charges), *Gust of Wind* (2 charges), *Wind Wall* (1 charge)"],
				["Earth", "*Earthquake* (5 charges), *Stone Shape* (2 charges), *Stoneskin* (3 charges), *Wall of Stone* (3 charges)"],
				["Fire", "*Burning Hands* (1 charge), *Fireball* (2 charges), *Fire Storm* (4 charges), *Wall of Fire* (3 charges)"],
				["Water", "*Create or Destroy Water* (1 charge), *Ice Storm* (2 charges), *Tsunami* (5 charges), *Wall of Ice* (3 charges), *Water Walk* (2 charges)"],
			],
		],
		usages: 5,
		recovery: "Dawn",
		additional: "regains 1d4+1",
		action: [["action", "Elemental Compulsion"]],
		allowDuplicates: true,
		choices: ["Air", "Earth", "Fire", "Water"],
		"air": {
			name: "Ring of Air Elemental Command",
			sortname: "Ring of Elemental Command, Air",
			description: "This ring has 5 charges, regaining 1d4+1 at dawn. While wearing it, Elementals have Disadv to attack me while I have Adv vs them, I know Auran, have Lightning Resistance, Fly Speed \x26 can hover. As a Magic action, an Elemental in 60 ft makes a DC 18 Wis save or is Charmed and obeys my commands till my next turn starts.",
			descriptionLong: [
				"While wearing this Elemental Plane of Air linked ring, I have the following benefits. The ring has 5 charges and regains 1d4+1 at dawn, which I can use to cast spells (save DC 18).",
				"***Elemental Bane***. I have Adv on attacks vs Elementals and they have Disadv to attack me.",
				"***Elemental Compulsion***. As a Magic action, I can have an Elemental I " + (typePF ? "see " : "can see with") + "in 60 ft make a DC 18 Wis save or be Charmed and I decide its move and action until my next turn starts.",
				"***Air Elemental Focus***. I know Auran, have Resistance to Lightning damage, have a Fly Speed equal to my Speed, and can hover.",
			],
			descriptionFull: [
				"This ring is linked to the Elemental Plane of Air. The ring has the following properties.",
				"***Elemental Bane***. While wearing the ring, you have Advantage on attack rolls against Elementals and they have Disadvantage on attack rolls against you.",
				"***Elemental Compulsion***. While wearing the ring, you can take a Magic action to try to compel an Elemental you see within 60 feet of yourself. The Elemental makes a DC 18 Wisdom saving throw. On a failed save, the Elemental has the Charmed condition until the start your next turn, and you determine what it does with its move and action on its next turn.",
				"***Air Elemental Focus***. While wearing the ring, you know Auran, you have Resistance to Lightning damage, and you have a Fly Speed equal to your Speed and can hover.",
				"***Spellcasting***. The ring has 5 charges and regains 1d4 + 1 expended charges daily at dawn. While wearing the ring, you can cast a spell from it. A spell cast from the ring has a save DC of 18. Choose the spell from the following list: *Chain Lightning* (3 charges), *Feather Fall* (0 charges), *Gust of Wind* (2 charges), *Wind Wall* (1 charge).",
			],
			languageProfs: ["Auran"],
			dmgres: ["Lightning"],
			speed: {
				fly: { spd: "walk", enc: "walk" },
			},
			fixedDC: 18,
			spellFirstColTitle: "Ch",
			spellcastingBonus: [{
				name: "0 charges",
				spells: ["feather fall"],
				selection: ["feather fall"],
				firstCol: "atwill",
			}, {
				name: "2 charges",
				spells: ["gust of wind"],
				selection: ["gust of wind"],
				firstCol: 2,
			}, {
				name: "1 charge",
				spells: ["wind wall"],
				selection: ["wind wall"],
				firstCol: 1,
			}, {
				name: "3 charges",
				spells: ["chain lightning"],
				selection: ["chain lightning"],
				firstCol: 3,
			}],
			limfeaname: "Ring of Air Elem. Com.",
		},
		"earth": {
			name: "Ring of Earth Elemental Command",
			sortname: "Ring of Elemental Command, Earth",
			description: "This ring has 5 charges, regaining 1d4+1 at dawn. While wearing it, I have Adv to attack Elementals and they Disadv vs me, I know Terran, have Acid Resistance, and can move through earth or rock as Difficult Terrain. As a Magic action, Elemental in 60 ft DC 18 Wis save or Charmed and obeys my commands for 1 round.",
			descriptionLong: [
				"While wearing this Elemental Plane of Earth linked ring, I have the following benefits. The ring has 5 charges and regains 1d4+1 at dawn, which I can use to cast spells (save DC 18).",
				"***Elemental Bane***. I have Adv on attacks vs Elementals and they have Disadv to attack me.",
				"***Elemental Compulsion***. As a Magic action, I can have an Elemental I " + (typePF ? "see " : "can see with") + "in 60 ft make a DC 18 Wis save or be Charmed and I decide its move and action until my next turn starts.",
				"***Earth Elemental Focus***. I know Terran, have Acid Resistance, rubble/rocks aren't Difficult Terrain for me and I can move through solid earth/rock at half speed, but can't stop.",
			],
			descriptionFull: [
				"This ring is linked to the Elemental Plane of Earth. The ring has the following properties.",
				"***Elemental Bane***. While wearing the ring, you have Advantage on attack rolls against Elementals and they have Disadvantage on attack rolls against you.",
				"***Elemental Compulsion***. While wearing the ring, you can take a Magic action to try to compel an Elemental you see within 60 feet of yourself. The Elemental makes a DC 18 Wisdom saving throw. On a failed save, the Elemental has the Charmed condition until the start your next turn, and you determine what it does with its move and action on its next turn.",
				"***Earth Elemental Focus***. While wearing the ring, you know Terran, and you have Resistance to Acid damage. Terrain composed of rubble, rocks, or dirt isn't Difficult Terrain for you. In addition, you can move through solid earth or rock as if those areas were Difficult Terrain without disturbing the matter through which you pass. If you end your turn in solid earth or rock, you are shunted out to the nearest unoccupied space you last occupied.",
				"***Spellcasting***. The ring has 5 charges and regains 1d4 + 1 expended charges daily at dawn. While wearing the ring, you can cast a spell from it. A spell cast from the ring has a save DC of 18. Choose the spell from the following list: *Earthquake* (5 charges), *Stone Shape* (2 charges), *Stoneskin* (3 charges), *Wall of Stone* (3 charges).",
			],
			languageProfs: ["Terran"],
			dmgres: ["Acid"],
			fixedDC: 18,
			spellFirstColTitle: "Ch",
			spellcastingBonus: [{
				name: "2 charges",
				spells: ["stone shape"],
				selection: ["stone shape"],
				firstCol: 2,
			}, {
				name: "3 charges",
				spells: ["stoneskin", "wall of stone"],
				selection: ["stoneskin", "wall of stone"],
				firstCol: 3,
				times: 2,
			}, {
				name: "5 charges",
				spells: ["earthquake"],
				selection: ["earthquake"],
				firstCol: 5,
			}],
			limfeaname: "Ring of Earth Elem. Com.",
		},
		"fire": {
			name: "Ring of Fire Elemental Command",
			sortname: "Ring of Elemental Command, Fire",
			description: "This ring has 5 charges, regaining 1d4+1 at dawn. While wearing it, Elementals have Disadv to attack me while I have Adv vs them, I know Ignan, and I have Fire Resistance. As a Magic action, I can have an Elemental within 60 ft make a DC 18 Wis save or be Charmed and obey my commands until the start of my next turn.",
			descriptionLong: [
				"While wearing this Elemental Plane of Fire linked ring, I have the following benefits. The ring has 5 charges and regains 1d4+1 at dawn, which I can use to cast spells (save DC 18).",
				"***Elemental Bane***. I have Adv on attacks vs Elementals and they have Disadv to attack me.",
				"***Elemental Compulsion***. As a Magic action, I can have an Elemental I " + (typePF ? "see " : "can see with") + "in 60 ft make a DC 18 Wis save or be Charmed and I decide its move and action until my next turn starts.",
				"***Fire Elemental Focus***. I know Ignan and have Immunity to Fire damage.",
			],
			descriptionFull: [
				"This ring is linked to the Elemental Plane of Fire. The ring has the following properties.",
				"***Elemental Bane***. While wearing the ring, you have Advantage on attack rolls against Elementals and they have Disadvantage on attack rolls against you.",
				"***Elemental Compulsion***. While wearing the ring, you can take a Magic action to try to compel an Elemental you see within 60 feet of yourself. The Elemental makes a DC 18 Wisdom saving throw. On a failed save, the Elemental has the Charmed condition until the start your next turn, and you determine what it does with its move and action on its next turn.",
				"***Fire Elemental Focus***. While wearing the ring, you know Ignan, and you have Immunity to Fire damage.",
				"***Spellcasting***. The ring has 5 charges and regains 1d4 + 1 expended charges daily at dawn. While wearing the ring, you can cast a spell from it. A spell cast from the ring has a save DC of 18. Choose the spell from the following list: *Burning Hands* (1 charge), *Fireball* (2 charges), *Fire Storm* (4 charges), *Wall of Fire* (3 charges).",
			],
			languageProfs: ["Ignan"],
			savetxt: { immune: ["fire"] },
			fixedDC: 18,
			spellFirstColTitle: "Ch",
			spellcastingBonus: [{
				name: "1 charge",
				spells: ["burning hands"],
				selection: ["burning hands"],
				firstCol: 1,
			}, {
				name: "2 charges",
				spells: ["fireball"],
				selection: ["fireball"],
				firstCol: 2,
			}, {
				name: "3 charges",
				spells: ["wall of fire"],
				selection: ["wall of fire"],
				firstCol: 3,
			}, {
				name: "4 charges",
				spells: ["fire storm"],
				selection: ["fire storm"],
				firstCol: 4,
			}],
			limfeaname: "Ring of Fire Elem. Com.",
		},
		"water": {
			name: "Ring of Water Elemental Command",
			sortname: "Ring of Elemental Command, Water",
			description: "This ring has 5 charges, regaining 1d4+1 at dawn. While wearing it, Elementals have Disadv to attack me while I have Adv vs them, I know Aquan, have a Swim Speed, and can breath underwater. As a Magic action, an Elemental in 60 ft makes a DC 18 Wis save or is Charmed and obeys my commands till my next turn starts.",
			descriptionLong: [
				"While wearing this Elemental Plane of Water linked ring, I have the following benefits. The ring has 5 charges and regains 1d4+1 at dawn, which I can use to cast spells (save DC 18).",
				"***Elemental Bane***. I have Adv on attacks vs Elementals and they have Disadv to attack me.",
				"***Elemental Compulsion***. As a Magic action, I can have an Elemental I " + (typePF ? "see " : "can see with") + "in 60 ft make a DC 18 Wis save or be Charmed and I decide its move and action until my next turn starts.",
				"***Water Elemental Focus***. I know Aquan, gain a 60 ft Swim Speed, and can breathe underwater.",
			],
			descriptionFull: [
				"This ring is linked to the Elemental Plane of Water. The ring has the following properties.",
				"***Elemental Bane***. While wearing the ring, you have Advantage on attack rolls against Elementals and they have Disadvantage on attack rolls against you.",
				"***Elemental Compulsion***. While wearing the ring, you can take a Magic action to try to compel an Elemental you see within 60 feet of yourself. The Elemental makes a DC 18 Wisdom saving throw. On a failed save, the Elemental has the Charmed condition until the start your next turn, and you determine what it does with its move and action on its next turn.",
				"***Water Elemental Focus***. While wearing the ring, you know Aquan, you gain a Swim Speed of 60 feet, and you can breathe underwater.",
				"***Spellcasting***. The ring has 5 charges and regains 1d4 + 1 expended charges daily at dawn. While wearing the ring, you can cast a spell from it. A spell cast from the ring has a save DC of 18. Choose the spell from the following list: *Create or Destroy Water* (1 charge), *Ice Storm* (2 charges), *Tsunami* (5 charges), *Wall of Ice* (3 charges), *Water Walk* (2 charges).",
			],
			languageProfs: ["Aquan"],
			speed: {
				swim: { spd: "fixed 60", enc: "fixed 50" },
			},
			fixedDC: 18,
			spellFirstColTitle: "Ch",
			spellcastingBonus: [{
				name: "1 charge",
				spells: ["create or destroy water"],
				selection: ["create or destroy water"],
				firstCol: 1,
			}, {
				name: "2 charges",
				spells: ["ice storm", "water walk"],
				selection: ["ice storm", "water walk"],
				firstCol: 2,
				times: 2,
			}, {
				name: "3 charges",
				spells: ["wall of ice"],
				selection: ["wall of ice"],
				firstCol: 3,
			}, {
				name: "5 charges",
				spells: ["tsunami"],
				selection: ["tsunami"],
				firstCol: 5,
			}],
			limfeaname: "Ring of Water Elem. Com.",
		},
	},
	"ring of evasion": {
		name: "Ring of Evasion",
		source: [["SRD24", 238], ["DMG24", 293]],
		type: "Ring",
		rarity: "Rare",
		magicItemTable: "Implements",
		attunement: true,
		description: "This ring has 3 charges, and it regains 1d3 expended charges daily at dawn. As a Reaction when I fail a Dexterity saving throw while wearing the ring, I can expend 1 charge to succeed on that save instead.",
		descriptionFull: "This ring has 3 charges, and it regains 1d3 expended charges daily at dawn. When you fail a Dexterity saving throw while wearing the ring, you can take a Reaction to expend 1 charge to succeed on that save instead.",
		usages: 3,
		recovery: "Dawn",
		additional: "regains 1d3",
		action: [["reaction", ""]],
	},
	"ring of feather falling": {
		name: "Ring of Feather Falling",
		source: [["SRD24", 238], ["DMG24", 293]],
		type: "Ring",
		rarity: "Rare",
		magicItemTable: "Arcana",
		attunement: true,
		description: "When I fall while wearing this ring, I descend 60 ft per round and take no damage from falling.",
		descriptionFull: "When you fall while wearing this ring, you descend 60 feet per round and take no damage from falling.",
	},
	"ring of free action": {
		name: "Ring of Free Action",
		source: [["SRD24", 238], ["DMG24", 293]],
		type: "Ring",
		rarity: "Rare",
		magicItemTable: "Implements",
		attunement: true,
		description: "While I wear this ring, Difficult Terrain doesn't cost me extra movement. In addition, magic can neither reduce any of my Speeds nor cause me to have the Paralyzed or Restrained condition.",
		descriptionFull: "While you wear this ring, Difficult Terrain doesn't cost you extra movement. In addition, magic can neither reduce any of your Speeds nor cause you to have the Paralyzed or Restrained condition.",
		savetxt: { immune: ["Paralyzed (by magic)", "Restrained (by magic)"] },
	},
	"ring of invisibility": {
		name: "Ring of Invisibility",
		source: [["SRD24", 238], ["DMG24", 293]],
		type: "Ring",
		rarity: "Legendary",
		magicItemTable: "Arcana",
		attunement: true,
		description: "As a Magic action while wearing this ring, I can give myself the Invisible condition. I remain Invisible until the ring is removed or until I take a Bonus Action to become visible again.",
		descriptionFull: "While wearing this ring, you can take a Magic action to give yourself the Invisible condition. You remain Invisible until the ring is removed or until you take a Bonus Action to become visible again.",
		action: [
			["action", " (start)"],
			["bonus action", " (stop)"],
		],
	},
	"ring of jumping": {
		name: "Ring of Jumping",
		source: [["SRD24", 238], ["DMG24", 293]],
		type: "Ring",
		rarity: "Uncommon",
		magicItemTable: "Implements",
		attunement: true,
		description: "While wearing this ring, I can cast *Jump* from it, but can target only myself when I do so. The *Jump* spell lasts for 1 minute and gives me the ability to jump up to 30 ft by spending 10 ft of movement once on each of my turns.",
		descriptionFull: "While wearing this ring, you can cast *Jump* from it, but can target only yourself when you do so.",
		spellcastingBonus: [{
			name: "Self Only",
			spells: ["jump"],
			selection: ["jump"],
			firstCol: "atwill",
		}],
		spellChanges: {
			"jump": {
				range: "Self",
				description: "I can spend 10 ft movement to jump 30 ft once per turn",
				changes: "This spell can only affect the wearer.",
			},
		},
	},
	"ring of mind shielding": {
		name: "Ring of Mind Shielding",
		source: [["SRD24", 238], ["DMG24", 293]],
		type: "Ring",
		rarity: "Uncommon",
		magicItemTable: "Arcana",
		attunement: true,
		description: "This ring makes me immune to magic that allows others to read my thoughts, determine if I'm lying, or know my creature type or alignment. Telepathy only works if I allow it. As a Magic action, I can cause the ring to become (im)perceptible until I remove it or die. If I die while wearing the ring, my soul enters it.",
		descriptionLong: "While wearing this ring, I am immune to magic that allows others to read my thoughts, determine whether I am lying, know my alignment, or know my creature type. Creatures can telepathically communicate with me only if I allow it. As a Magic action, I can cause the ring to become imperceptible until I take another Magic action to make it perceptible, I remove the ring, or I die. If I die while wearing the ring, my soul enters it, unless it already houses a soul. I can remain in the ring or depart for the afterlife. As long as my soul is in the ring, I can telepathically communicate with the wearer, which can't block it.",
		descriptionFull: [
			"While wearing this ring, you are immune to magic that allows other creatures to read your thoughts, determine whether you are lying, know your alignment, or know your creature type. Creatures can telepathically communicate with you only if you allow it.",
			"You can take a Magic action to cause the ring to become imperceptible until you take another Magic action to make it perceptible, until you remove the ring, or until you die.",
			"If you die while wearing the ring, your soul enters it, unless it already houses a soul. You can remain in the ring or depart for the afterlife. As long as your soul is in the ring, you can telepathically communicate with any creature wearing it. A wearer can't prevent this telepathic communication.",
		],
		action: [["action", "Ring of Mind Shielding: (im)perceptible"]],
		savetxt: { text: ["Magic can't detect my thoughts, truthfullness, alignment, or type"] },
	},
	"ring of protection": {
		name: "Ring of Protection",
		source: [["SRD24", 238], ["DMG24", 294]],
		type: "Ring",
		rarity: "Rare",
		magicItemTable: "Armaments",
		attunement: true,
		description: "I gain a +1 bonus to Armor Class and saving throws while wearing this ring.",
		descriptionFull: "You gain a +1 bonus to Armor Class and saving throws while wearing this ring.",
		extraAC: [{
			name: "Ring of Protection",
			mod: 1,
			magic: true,
			text: "I gain a +1 bonus to Armor Class while wearing this ring.",
		}],
		addMod: [{
			type: "save",
			field: "all",
			mod: 1,
			text: "I gain a +1 bonus to saving throws while wearing this ring.",
		}],
	},
	"ring of regeneration": {
		name: "Ring of Regeneration",
		source: [["SRD24", 238], ["DMG24", 294]],
		type: "Ring",
		rarity: "Very Rare",
		magicItemTable: "Arcana",
		attunement: true,
		description: "While wearing this ring, I regain 1d6 Hit Points every 10 minutes if I have at least 1 Hit Point. If I lose a body part, the ring causes the missing part to regrow and return to full functionality after 1d6+1 days if I have at least 1 Hit Point the whole time.",
		descriptionFull: "While wearing this ring, you regain 1d6 Hit Points every 10 minutes if you have at least 1 Hit Point. If you lose a body part, the ring causes the missing part to regrow and return to full functionality after 1d6 + 1 days if you have at least 1 Hit Point the whole time.",
	},
	"ring of resistance": function (){
		var obj = {
			name: "Ring of Resistance",
			source: [["SRD24", 238], ["DMG24", 294]],
			type: "Ring",
			rarity: "Rare",
			magicItemTable: "Relics",
			description: "Select one of the choices.",
			descriptionFull: [
				"You have Resistance to one damage type while wearing this ring. The gemstone in the ring indicates the type, which the DM chooses or determines randomly by rolling on the following table.",
				[
					["1d10", "Damage Type", "Gemstone"],
					[" 1", "Acid", "", "Pearl"],
					[" 2", "Cold", "", "Tourmaline"],
					[" 3", "Fire", "", "Garnet"],
					[" 4", "Force", "", "Sapphire"],
					[" 5", "Lightning    ", "Citrine"],
					[" 6", "Necrotic", "", "Jet"],
					[" 7", "Poison", "", "Amethyst"],
					[" 8", "Psychic", "", "Jade"],
					[" 9", "Radiant", "", "Topaz"],
					["10", "Thunder", "", "Spinel"],
				],
			],
			weight: 0.5,
			allowDuplicates: true,
			choicesNotInMenu: true,
			choices: [],
		};
		[
			{ type: "Acid", gem: "Pearl" },
			{ type: "Cold", gem: "Tourmaline" },
			{ type: "Fire", gem: "Garnet" },
			{ type: "Force", gem: "Sapphire" },
			{ type: "Lightning", gem: "Citrine" },
			{ type: "Necrotic", gem: "Jet" },
			{ type: "Poison", gem: "Amethyst" },
			{ type: "Psychic", gem: "Jade" },
			{ type: "Radiant", gem: "Topaz" },
			{ type: "Thunder", gem: "Spinel" },
		].forEach(function (entry) {
			var type = entry.type;
			var gem = entry.gem;
			var choice = type + " (" + gem + ")";
			obj.choices.push(choice);
			obj[choice.toLowerCase()] = {
				name: "Ring of " + type + " Resistance",
				description: "I have Resistance to " + type + " damage while wearing this ring set with a " + gem.toLowerCase() + ".",
				dmgres: [type],
			};
		});
		return obj;
	}(),
	"ring of shooting stars": {
		name: "Ring of Shooting Stars",
		source: [["SRD24", 238], ["DMG24", 294]],
		type: "Ring",
		rarity: "Very Rare",
		magicItemTable: "Arcana",
		attunement: true,
		description: "This ring has 6 charges and regains 1d6 at dawn. While wearing it, I can cast *Dancing Lights* (0 charges), *Light* (0 charges), and *Faerie Fire* (1 charge). As a Magic action, I can use it to create ***Lightning Spheres*** (2 charges), or ***Shooting Stars*** (1-3 charges). All have save DC 15. See Spell Sheet and third page Notes.",
		descriptionFull: [
			"You can cast *Dancing Lights* or *Light* from the ring.",
			"The ring has 6 charges and regains 1d6 expended charges daily at dawn. You can expend its charges to use the properties below.",
			"***Faerie Fire***. You can expend 1 charge to cast *Faerie Fire* from the ring.",
			"***Lightning Spheres***. You can expend 2 charges as a Magic action to create up to four 3-foot-diameter spheres of lightning.",
			"Each sphere appears in an unoccupied space you can see within 120 feet of yourself. The spheres last as long as you maintain Concentration, up to 1 minute. Each sphere sheds Dim Light in a 30-foot radius.",
			"As a Bonus Action, you can move each sphere up to 30 feet, but no farther than 120 feet away from yourself. The first time the sphere comes within 5 feet of a creature other than you that isn't behind Total Cover, the sphere discharges lightning at that creature and disappears. That creature makes a DC 15 Dexterity saving throw. On a failed save, the creature takes Lightning damage based on the number of spheres you created, as shown in the following table. On a successful save, the creature takes half as much damage.",
			[
				["Number of Spheres", "Lightning Damage"],
				["", "1", "", "", "4d12"],
				["", "2", "", "", "5d4"],
				["", "3", "", "", "2d6"],
				["", "4", "", "", "2d4"],
			],
			"***Shooting Stars***. You can expend 1 to 3 charges as a Magic action. For every charge you expend, you launch a glowing mote of light from the ring at a point you can see within 60 feet of yourself. Each creature in a 15-foot Cube originating from that point is showered in sparks and makes a DC 15 Dexterity saving throw, taking 5d4 Radiant damage on a failed save or half as much damage on a successful one.",
		],
		usages: 6,
		recovery: "Dawn",
		additional: "regains 1d6",
		toNotesPage: [{
			name: "Lightning Spheres",
			page3notes: true,
			additional: "2 Charges",
			note: desc([
				"As a Magic action, I can use 2 charges to create 1-4 spheres of lightning of 3-ft diameter within 120 ft. They require Concentration, up to 1 " + (typePF ? "minute" : "min") + ". Each sphere sheds 30 ft Dim Light.",
				"As a Bonus Action, I can move each sphere up to 30 ft, but not beyond 120 ft of me. When a creature (not me) that's not behind Total Cover comes within 5 ft of a sphere, the sphere discharges lightning at it and disappears. The target takes Lightning damage and can make a DC 15 Dex save for half damage. The damage depends on the number of spheres created:",
				[
					"\u2003\u2003\u2022 1 sphere: **4d12**",
					"2 spheres: **5d4**",
					"3 spheres: **2d6**",
					"4 spheres: **2d4**",
				].join("\u2003\u2003\u2003\u2022 "),
			]),
		}, {
			name: "Shooting Stars",
			page3notes: true,
			additional: "1-3 Charges",
			note: desc("As a Magic action, I can expend 1-3 charges to launch a mote of light per expended charge at a point I can see within 60 ft. All creatures in a 15-ft Cube originating from each point take 5d4 Radiant damage. Targets can make a DC 15 Dexterity save to halve the damage."),
		}],
		fixedDC: 15,
		spellFirstColTitle: "Ch",
		spellcastingBonus: [{
			name: "0 charges",
			spells: ["dancing lights", "light"],
			selection: ["dancing lights", "light"],
			firstCol: "atwill",
			times: 2,
		}, {
			name: "1 charge",
			spells: ["faerie fire"],
			selection: ["faerie fire"],
			firstCol: 1,
		}, {
			name: "Lightning Spheres (2 charges)",
			spells: ["flaming sphere"],
			selection: ["flaming sphere"],
			firstCol: 2,
		}, {
			name: "Shooting Stars (1-3 charges)",
			spells: ["magic missile"],
			selection: ["magic missile"],
			firstCol: "1-3",
		}],
		spellChanges: {
			"flaming sphere": {
				name: "Lightning Spheres",
				source: [["SRD24", 238], ["DMG24", 294]],
				reqLoS: true,
				level: "",
				school: "Evoc",
				time: "Act",
				range: "120 ft",
				duration: "Conc, 1 min",
				save: "Dex",
				description: "1-4 spheres; Bns move all 30 ft; 1st crea in 5 ft Lightning dmg (1:4d12, 2:5d4, 3:2d6, 4:2d4); save half",
				descriptionMetric: "1-4 spheres; Bns move all 9 m; 1st crea in 1,5 m Lightn. dmg (1:4d12, 2:5d4, 3:2d6, 4:2d4); save half",
				descriptionShorter: undefined,
				descriptionFull: [
					"You can expend 2 charges from the *Ring of Shooting Stars* as a Magic action to create up to four 3-foot-diameter spheres of lightning.",
					"Each sphere appears in an unoccupied space you can see within 120 feet of yourself. The spheres last as long as you maintain Concentration, up to 1 minute. Each sphere sheds Dim Light in a 30-foot radius.",
					"As a Bonus Action, you can move each sphere up to 30 feet, but no farther than 120 feet away from yourself. The first time the sphere comes within 5 feet of a creature other than you that isn't behind Total Cover, the sphere discharges lightning at that creature and disappears. That creature makes a DC 15 Dexterity saving throw. On a failed save, the creature takes Lightning damage based on the number of spheres you created, as shown in the following table. On a successful save, the creature takes half as much damage.",
					[
						["Number of Spheres", "Lightning Damage"],
						["", "1", "", "", "4d12"],
						["", "2", "", "", "5d4"],
						["", "3", "", "", "2d6"],
						["", "4", "", "", "2d4"],
					],
				],
				completeRewrite: true, // i.e. even overwrite the tooltip with these changes
				changes: "The listing of *Flaming Sphere* has been completely changed to reflect the ***Lightning Spheres*** property of the *Ring of Shooting Stars*. Even the information above has been changed.",
			},
			"magic missile": {
				name: "Shooting Stars",
				source: [["SRD24", 238], ["DMG24", 294]],
				reqLoS: true,
				level: "",
				school: "Evoc",
				time: "Act",
				range: "60 ft",
				duration: "Instantaneous",
				save: "Dex",
				description: "15-ft Cube in range per expended charge; all crea within take 5d4 Radiant damage, save halves",
				descriptionFull: "You can expend 1 to 3 charges from the *Ring of Shooting Stars* as a Magic action. For every charge you expend, you launch a glowing mote of light from the ring at a point you can see within 60 feet of yourself. Each creature in a 15-foot Cube originating from that point is showered in sparks and makes a DC 15 Dexterity saving throw, taking 5d4 Radiant damage on a failed save or half as much damage on a successful one.",
				dynamicDamageBonus: undefined,
				completeRewrite: true, // i.e. even overwrite the tooltip with these changes
				changes: "The listing of *Magic Missile* has been completely changed to reflect the ***Shooting Stars*** property of the *Ring of Shooting Stars*. Even the information above has been changed.",
			},
		},
	},
	"ring of spell storing": {
		name: "Ring of Spell Storing",
		source: [["SRD24", 239], ["DMG24", 295]],
		type: "Ring",
		rarity: "Rare",
		magicItemTable: ["Arcana", "Relics"],
		attunement: true,
		description: "This ring can store up to 5 levels of spells. Anyone can store a spell in the ring by touching it as the spell is cast, given it has space for the spell slot level used. I can cast spells stored in the ring using the slot level, save DC, attack bonus, and ability of the original caster. A spell cast from the ring is no longer stored in it" + (typePF ? "." : ", freeing up space."),
		descriptionLong: "This ring stores spells cast into it, holding them until the attuned wearer uses them. The ring can store up to 5 levels worth of spells at a time. Any creature can cast a spell of level 1-5 into the ring by touching it as the spell is cast. The spell has no effect other than to be stored in the ring. If the ring can't hold the spell, the spell is expended without effect. The level of the slot used determines how much space is used. While wearing this ring, I can cast any spell stored in it. The spell uses the slot level, save DC, attack bonus, and ability of the original caster. Spells cast from the ring are no longer stored in it, freeing up space.",
		descriptionFull: [
			"This ring stores spells cast into it, holding them until the attuned wearer uses them. The ring can store up to 5 levels worth of spells at a time. When found, it contains 1d6 - 1 levels of stored spells chosen by the DM.",
			"Any creature can cast a spell of level 1 through 5 into the ring by touching the ring as the spell is cast. The spell has no effect other than to be stored in the ring. If the ring can't hold the spell, the spell is expended without effect. The level of the slot used to cast the spell determines how much space it uses.",
			"While wearing this ring, you can cast any spell stored in it. The spell uses the slot level, spell save DC, spell attack bonus, and spellcasting ability of the original caster but is otherwise treated as if you cast the spell. The spell cast from the ring is no longer stored in it, freeing up space.",
		],
		usages: "5 lvls",
		recovery: "Cast",
	},
	"ring of spell turning": {
		name: "Ring of Spell Turning",
		source: [["SRD24", 239], ["DMG24", 295]],
		type: "Ring",
		rarity: "Legendary",
		magicItemTable: "Arcana",
		attunement: true,
		description: "While wearing this ring, I have Advantage on saves against spells. If I succeed on the save for a spell of level 7 or lower, the spell has no effect on me. If that spell targeted only me and didn't create an area of effect, I can take a Reaction to deflect the spell back at its caster, which must save vs their own DC.",
		descriptionFull: "While wearing this ring, you have Advantage on saving throws against spells. If you succeed on the save for a spell of level 7 or lower, the spell has no effect on you. If that spell targeted only you and didn't create an area of effect, you can take a Reaction to deflect the spell back at the spell's caster; the caster must make a saving throw against the spell using their own spell save DC.",
		savetxt: { adv_vs: ["spells"] },
		action: [["reaction", ""]],
	},
	"ring of swimming": {
		name: "Ring of Swimming",
		source: [["SRD24", 239], ["DMG24", 295]],
		type: "Ring",
		rarity: "Uncommon",
		magicItemTable: "Implements",
		description: "I have a Swim speed of 40 ft while wearing this ring.",
		descriptionFull: "You have a Swim Speed of 40 feet while wearing this ring.",
		speed: {
			swim: { spd: "fixed 40", enc: "fixed 30" },
		},
	},
	"ring of telekinesis": {
		name: "Ring of Telekinesis",
		source: [["SRD24", 239], ["DMG24", 295]],
		type: "Ring",
		rarity: "Very Rare",
		magicItemTable: "Arcana",
		attunement: true,
		description: "While wearing this ring, I can cast *Telekinesis* from it",
		descriptionFull: "While wearing this ring, you can cast *Telekinesis* from it.",
		spellcastingBonus: [{
			name: "At will",
			spells: ["telekinesis"],
			selection: ["telekinesis"],
			firstCol: "atwill",
		}],
	},
	"ring of the ram": {
		name: "Ring of the Ram",
		source: [["SRD24", 239], ["DMG24", 296]],
		type: "Ring",
		rarity: "Rare",
		magicItemTable: "Armaments",
		attunement: true,
		description: "This ring has 3 charges and regains 1d3 charges at dawn. As a Magic action, I can use charges on a target " + (typePF ? "" : "with") + "in 60 ft. If I target a creature: ranged spell attack with +7 to hit, 2d10" + (typePF ? "/" : " per ") + "charge Force damage, and push it 5 ft" + (typePF ? "/" : " per ") + "charge. If I target an unattended object: the ring tries to break it with a +5" + (typePF ? "/" : " per ") + "charge Strength check.",
		descriptionLong: "This ring has 3 charges and regains 1d3 charges daily at dawn. As a Magic action, I can expend 1 to 3 charges to make a ranged spell attack against one creature I can see within 60 ft. The ring produces a spectral ram's head and makes its attack roll with a +7 bonus. On a hit, for each charge I spend, the target takes 2d10 Force damage and is pushed 5 ft away from me. As a Magic action, I can expend 1 to 3 of the ring's charges to try to break a nonmagical object I can see within 60 ft that isn't being worn or carried. The ring makes a Strength check with a +5 bonus for each charge I spend.",
		descriptionFull: [
			"This ring has 3 charges and regains 1d3 expended charges daily at dawn. While wearing the ring, you can take a Magic action to expend 1 to 3 charges to make a ranged spell attack against one creature you can see within 60 feet of yourself. The ring produces a spectral ram's head and makes its attack roll with a +7 bonus. On a hit, for each charge you spend, the target takes 2d10 Force damage and is pushed 5 feet away from you.",
			"Alternatively, you can expend 1 to 3 of the ring's charges as a Magic action to try to break a nonmagical object you can see within 60 feet of yourself that isn't being worn or carried. The ring makes a Strength check with a +5 bonus for each charge you spend.",
		],
		usages: 3,
		recovery: "Dawn",
		additional: "regains 1d3",
		action: [["action", ""]],
		weaponOptions: [{
			regExpSearch: /^(?=.*ring)(?=.*ram).*$/i,
			name: "Ring of the Ram",
			source: [["SRD24", 239], ["DMG24", 296]],
			ability: 0,
			type: "Magic Item",
			damage: [typePF ? "2d10/charge" : "2d10/ch", "", "force"],
			range: "60 ft",
			description: "2d10 damage per charge; Pushes 5 ft away per charge",
			abilitytodamage: false,
			modifiers: [7, ""],
			isNotWeapon: true,
			isAlwaysProf: false,
			selectNow: true,
		}],
	},
	"ring of three wishes": {
		name: "Ring of Three Wishes",
		source: [["SRD24", 239], ["DMG24", 296]],
		type: "Ring",
		rarity: "Legendary",
		magicItemTable: "Arcana",
		description: "While wearing this ring, I can expend 1 of its 3 charges to cast *Wish* from it. The ring becomes nonmagical when I use the last charge.",
		descriptionFull: "While wearing this ring, you can expend 1 of its 3 charges to cast *Wish* from it. The ring becomes nonmagical when you use the last charge.",
		usages: 3,
		recovery: "\u2013",
		spellFirstColTitle: "Ch",
		spellcastingBonus: [{
			name: "1 charge",
			spells: ["wish"],
			selection: ["wish"],
			firstCol: 1,
		}],
	},
	"ring of warmth": {
		name: "Ring of Warmth",
		source: [["SRD24", 239], ["DMG24", 296]],
		type: "Ring",
		rarity: "Uncommon",
		magicItemTable: "Implements",
		attunement: true,
		description: "If I take Cold damage while wearing this ring, the ring reduces the damage that I take by 2d8. In addition, while wearing this ring, I am unharmed by temperatures of 0 degrees Fahrenheit or lower, the same is true for everything that I wear and carry.",
		descriptionFull: [
			"If you take Cold damage while wearing this ring, the ring reduces the damage you take by 2d8.",
			"In addition, while wearing this ring, you and everything you wear and carry are unharmed by temperatures of 0 degrees Fahrenheit or lower.",
		],
	},
	"ring of water walking": {
		name: "Ring of Water Walking",
		source: [["SRD24", 239], ["DMG24", 296]],
		type: "Ring",
		rarity: "Uncommon",
		magicItemTable: "Relics",
		description: "While wearing this ring, I cast *Water Walk* from it, targeting only myself.",
		descriptionFull: "While wearing this ring, you cast *Water Walk* from it, targeting only yourself.",
		spellcastingBonus: [{
			name: "At will",
			spells: ["water walk"],
			selection: ["water walk"],
			firstCol: "atwill",
		}],
		spellChanges: {
			"water walk": {
				description: "I can move across any liquid surface; Bns to go between liquid/surface; will still fall into liquid",
				changes: "I can only target myelf.",
			},
		},
	},
	"ring of x-ray vision": {
		name: "Ring of X-ray Vision",
		source: [["SRD24", 239], ["DMG24", 296]],
		type: "Ring",
		rarity: "Rare",
		magicItemTable: "Arcana",
		attunement: true,
		description: "As a Magic action, I can gain X-ray vision with a range of 30 ft for 1 minute. To me, solid matter looks transparent and light passes through it. This penetrates up to 1 ft stone, 1 inch metal, 3 ft wood/dirt, but not lead. When I use this again before a Long Rest, I must make a DC 15 Con save or gain 1 Exhaustion level.",
		descriptionFull: [
			"While wearing this ring, you can take a Magic action to gain X-ray vision with a range of 30 feet for 1 minute. To you, solid objects within that radius appear transparent and don't prevent light from passing through them. The vision can penetrate 1 foot of stone, 1 inch of common metal, or up to 3 feet of wood or dirt. Thicker substances or a thin sheet of lead block the vision.",
			"Whenever you use the ring again before taking a Long Rest, you must succeed on a DC 15 Constitution saving throw or gain 1 Exhaustion level.",
		],
		action: [["action", ""]],
		usages: 1,
		recovery: "Long Rest",
		additional: "more uses: DC 15 Con save",
	},
	"robe of eyes": {
		name: "Robe of Eyes",
		source: [["SRD24", 240], ["DMG24", 297]],
		type: "Wondrous Item",
		rarity: "Rare",
		magicItemTable: "Arcana",
		attunement: true,
		description: "This robe gives me Advantage on sight-based Perception checks, 120 ft Darkvision and 120 ft Truesight. However, if *Light* is cast on the robe or *Daylight* within 5 ft, I am Blinded for 1 min. I can make a Con save (DC 11 for Light, DC 15 for Daylight) at the end of each of my turns to end the condition.",
		descriptionFull: [
			"This robe is adorned with eyelike patterns. While you wear the robe, you gain the following benefits:",
			" \u2022 **All-Around Vision**. The robe gives you Advantage on Wisdom (Perception) checks that rely on sight.",
			" \u2022 **Special Senses**. You have Darkvision and Truesight, both with a range of 120 feet.",
			"***Drawbacks***. A *Light* spell cast on the robe or a *Daylight* spell cast within 5 feet of the robe gives you the Blinded condition for 1 minute. At the end of each of your turns, you make a Constitution saving throw (DC 11 for *Light* or DC 15 for *Daylight*), ending the condition on yourself on a success.",
		],
		weight: 4,
		vision: [
			["Adv on sight-based Perception checks", 0],
			["Darkvision", "fixed 120"],
			["Truesight", "fixed 120"],
		],
	},
	"robe of scintillating colors": {
		name: "Robe of Scintillating Colors",
		source: [["SRD24", 240], ["DMG24", 297]],
		type: "Wondrous Item",
		rarity: "Very Rare",
		magicItemTable: "Arcana",
		attunement: true,
		description: "As a Magic action, I can use 1 of 3 charges to shed light until the end of my next turn, 30 ft Bright, 30 ft Dim, and creatures that can see me have Disadv on attacks against me. Creatures within 30 ft that can see me upon activation make a DC 15 Wis save or Stunned until effect ends. The robe regains 1d3 charges at dawn.",
		descriptionFull: "This robe has 3 charges, and it regains 1d3 expended charges daily at dawn. While you wear it, you can take a Magic action and expend 1 charge to cause the garment to display a shifting pattern of dazzling hues until the end of your next turn. During this time, the robe sheds Bright Light in a 30-foot radius and Dim Light for an additional 30 feet, and creatures that can see you have Disadvantage on attack rolls against you. Any creature in the Bright Light that can see you when the robe's power is activated must succeed on a DC 15 Wisdom saving throw or have the Stunned condition until the effect ends.",
		usages: 3,
		recovery: "Dawn",
		additional: "regains 1d3",
		weight: 4,
		action: [["action", ""]],
	},
	"robe of stars": {
		name: "Robe of Stars",
		source: [["SRD24", 240], ["DMG24", 297]],
		type: "Wondrous Item",
		rarity: "Very Rare",
		magicItemTable: "Arcana",
		attunement: true,
		description: "While wearing this robe I gain a +1 bonus to saving throws. As a Magic action, I can use 1 of 6 large stars embroidered on it, to cast *Magic Missile* at 5th-level. 1d6 used stars reappear at dusk. As a Magic action, I can enter or exit the Astral Plane along with all I'm wearing and carrying. I reappear in the spot that I left.",
		descriptionFull: [
			"This black or dark-blue robe is embroidered with small white or silver stars. You gain a +1 bonus to saving throws while you wear it.",
			"Six stars, located on the robe's upper-front portion, are particularly large. While wearing this robe, you can take a Magic action to remove one of the stars and expend it to cast the level 5 version of *Magic Missile*. Daily at dusk, 1d6 removed stars reappear on the robe.",
			"While you wear the robe, you can take a Magic action to enter the Astral Plane along with everything you are wearing and carrying. You remain there until you take a Magic action to return to the plane you were on. You reappear in the last space you occupied or, if that space is occupied, the nearest unoccupied space.",
		],
		usages: 6,
		recovery: "Dusk",
		additional: "regains 1d6",
		weight: 4,
		action: [["action", " (enter/exit Astral Plane)"]],
		addMod: [{
			type: "save",
			field: "all",
			mod: 1,
			text: "While wearing the Robe of Stars, I gain a +1 bonus to all saving throws.",
		}],
		spellFirstColTitle: "\u2605",
		spellcastingBonus: {
			name: "as 5th-level",
			spells: ["magic missile"],
			selection: ["magic missile"],
			firstCol: 1,
		},
		spellChanges: {
			"magic missile": {
				name: "Magic Missile (level 5)",
				description: "7 darts hit same or different creatures for 1d4+1 Force dmg per dart",
				changes: "*Magic Missile* cast from the *Robe of Stars* is always at 5th-level.",
			},
		},
	},
	"robe of the archmagi": {
		name: "Robe of the Archmagi",
		source: [["SRD24", 240], ["DMG24", 298]],
		type: "Wondrous Item",
		rarity: "Legendary",
		magicItemTable: "Arcana",
		attunement: true,
		prerequisite: "Requires Attunement by a Sorcerer, Warlock, or Wizard",
		prereqeval: function (v) {
			return !!classes.known.sorcerer || !!classes.known.warlock || !!classes.known.wizard;
		},
		description: "I gain the following benefits while wearing this elegant garment made from exquisite cloth and adorned with runes. If I am not wearing armor, my AC is 15 + my Dex mod. I have Advantage on saves against spells and other magical effects. My spell save DC and spell attack bonus each increase by 2.",
		descriptionFull: [
			"This elegant garment is made from exquisite cloth and adorned with runes.",
			"You gain these benefits while wearing the robe.",
			"***Armor***. If you aren't wearing armor, your base Armor Class is 15 plus your Dexterity modifier.",
			"***Magic Resistance***. You have Advantage on saving throws against spells and other magical effects.",
			"***War Mage***. Your spell save DC and spell attack bonus each increase by 2.",
		],
		weight: 4,
		savetxt: { adv_vs: ["spells", "magical effects"] },
		calcChanges: {
			spellCalc: [
				function (type, spellcasters, ability) {
					if (type != "prepare") return 2;
				},
				"While wearing the Robe of the Archmagi, my spell save DC and spell attack bonus each increase by 2.",
			],
		},
		armorOptions: [{
			regExpSearch: /^(?=.*robe)(?=.*(archmage|archmagi)).*$/i,
			name: "Robe of the Archmagi",
			source: [["SRD24", 240], ["DMG24", 298]],
			ac: 15,
			weight: 4,
			selectNow: true,
		}],
	},
	"robe of useful items": {
		name: "Robe of Useful Items",
		source: [["SRD24", 240], ["DMG24", 298]],
		type: "Wondrous Item",
		rarity: "Uncommon",
		magicItemTable: ["Arcana", "Implements"],
		description: "As a Magic action while donned, I can detach one patch, causing it to become the thing it represents. The robe becomes ordinary if it runs out of patches. It has two each of: Bullseye Lantern (filled and lit), Dagger, Mirror, Pole, Rope (coiled), Sack.\nIn addition, it has 4d4 patches that are determined by the DM.",
		descriptionFull: [
			"This robe has cloth patches of various shapes and colors covering it. While wearing the robe, you can take a Magic action to detach one of the patches, causing it to become the object or creature it represents. Once the last patch is removed, the robe becomes an ordinary garment.",
			"The robe has two of each of the following patches:",
			" \u2022 Bullseye Lantern (filled and lit)",
			" \u2022 Dagger",
			" \u2022 Mirror",
			" \u2022 Pole",
			" \u2022 Rope (coiled)",
			" \u2022 Sack",
			"In addition, the robe has 4d4 other patches. The DM chooses the patches or determines them randomly by rolling on the following table.",
			[
				["1d100", "Patch"],
				["01-08", "Bag of 100 GP"],
				["09-15", "Silver coffer (1 foot long, 6 inches wide and deep) worth 500 GP"],
				["16-22", "Iron door (up to 10 feet wide and 10 feet high, barred on one side of your choice), which you can place in an opening you can reach; it conforms to fit the opening, attaching and hinging itself"],
				["23-30", "10 gems worth 100 GP each"],
				["31-44", "Wooden ladder (24 feet long)"],
				["45-51", "Riding Horse with a Riding Saddle"],
				["52-59", "Open pit (a 10-foot Cube), which you can place on the ground within 10 feet of yourself"],
				["60-68", "4 *Potions of Healing*"],
				["69-75", "Rowboat (12 feet long)"],
				["76-83", "*Spell Scroll* containing one spell of level 1, 2, or 3 (your choice)"],
				["84-90", "2 Mastiffs"],
				["91-96", "Window (2 feet by 4 feet, up to 2 feet deep), which you can place on a vertical surface you can reach"],
				["97-00", "Portable Ram"],
			],
		],
		weight: 4,
		action: [["action", ""]],
	},
	"rod of absorption": {
		name: "Rod of Absorption",
		source: [["SRD24", 241], ["DMG24", 299]],
		type: "Rod",
		rarity: "Very Rare",
		magicItemTable: "Arcana",
		attunement: true,
		description: "As a Reaction while holding this rod, I can have it absorb a spell without an area of effect, that targets only me. The spell has no effect and its spell slot level is stored in the rod. I can expend these as spell slots to power my own spells up to level 5. Once the rod has absorbed 50 levels total, it becomes nonmagical.",
		descriptionLong: "As a Reaction while holding this rod, I can use it to absorb a spell targeting only me and without an area of effect. The spell has no effect and its energy is stored in the rod. This energy has the same level as the spell when it was cast. Once the rod has absorbed 50 levels, it can absorb no more. I can expend these levels as if they are spell slots to power my own spells up to level 5 and only for spell slot levels I have access to otherwise. For example, I can expend 3 levels to cast one of my spells using a 3rd-level spell slot. When the rod can't absorb any more levels and has no energy left, it becomes nonmagical.",
		descriptionFull: [
			"While holding this rod, you can take a Reaction to absorb a spell that is targeting only you and doesn't create an area of effect. The absorbed spell's effect is canceled, and the spell's energy\u2014not the spell itself\u2014is stored in the rod. The energy has the same level as the spell when it was cast. A canceled spell dissipates with no effect, and any resources used to cast it are wasted. The rod can absorb and store up to 50 levels of energy over the course of its existence. Once the rod absorbs 50 levels of energy, it can't absorb more. If you are targeted by a spell that the rod can't store, the rod has no effect on that spell.",
			"When you become attuned to the rod, you know how many levels of energy the rod has absorbed over the course of its existence and how many levels of spell energy it currently has stored.",
			"If you are a spellcaster holding the rod, you can convert energy stored in it into spell slots to cast spells you have prepared or know. You can create spell slots only of a level equal to or lower than your own spell slots, up to a maximum of level 5. You use the stored levels in place of your slots but otherwise cast the spell as normal. For example, you can use 3 levels stored in the rod as a level 3 spell slot.",
			"A newly found rod typically has 1d10 levels of spell energy stored in it. A rod that can no longer absorb spell energy and has no energy remaining becomes nonmagical.",
		],
		weight: 2,
		action: [["reaction", ""]],
		extraLimitedFeatures: [{
			name: "Rod of Absorption (absorbed levels)",
			usages: 50,
			recovery: "\u2013",
		}, {
			name: "Rod of Absorption (stored levels)",
			usages: " ", // 1d10 - Intentionally left blank
			recovery: "\u2013",
		}],
	},
	"rod of alertness": {
		name: "Rod of Alertness",
		source: [["SRD24", 241], ["DMG24", 299]],
		type: "Rod",
		rarity: "Very Rare",
		magicItemTable: "Relics",
		attunement: true,
		description: "While holding this rod, I have Adv" + (typePF ? "" : "antage") + " on Initiative \x26 Perception, and can cast certain spells. As a Magic action once per dawn, I can plant the rod" + (typePF ? "" : " in the ground") + " and have it shed 60 ft Bright" + (typePF ? "" : " Light") + " and 60 ft Dim Light for 10 min. In the Bright Light, my allies and I gain a +1 bonus to AC and saves, and can sense Invisible creatures in the area.",
		descriptionLong: "While holding this rod, I have Advantage on my Initiative and Wisdom (Perception) checks and I can use it to cast either *Detect Evil and Good*, *Detect Magic*, *Detect Poison and Disease*, or *See Invisibility*. ***Protective Aura***. As a Magic action once per dawn, I can plant the rod's haft in the ground, making its head shed Bright Light in a 60-ft radius and Dim Light for another 60 ft. This lasts 10 minutes or until a creature pulls the rod from the ground as a Magic action. While in the Bright Light, my allies and I gain a +1 bonus to AC and saves and can sense the location of invisible creatures that are also in the Bright Light.",
		descriptionFull: [
			"This rod has the following properties.",
			"***Alertness***. While holding the rod, you have Advantage on Wisdom (Perception) checks and on Initiative rolls.",
			"***Spells***. While holding the rod, you can cast the following spells from it:",
			" \u2022 *Detect Evil and Good*",
			" \u2022 *Detect Magic*",
			" \u2022 *Detect Poison and Disease*",
			" \u2022 *See Invisibility*",
			"***Protective Aura***. As a Magic action, you can plant the haft end of the rod in the ground, whereupon the rod's head sheds Bright Light in a 60-foot radius and Dim Light for an additional 60 feet. While in that Bright Light, you and your allies gain a +1 bonus to Armor Class and saving throws and can sense the location of any Invisible creature that is also in the Bright Light.",
			"The rod's head stops glowing and the effect ends after 10 minutes or when a creature takes a Magic action to pull the rod from the ground. Once used, this property can't be used again until the next dawn.",
		],
		weight: 2,
		extraLimitedFeatures: [{
			name: "Rod of Alertness (Protective Aura)",
			usages: 1,
			recovery: "Dawn",
		}],
		action: [["action", " (plant/remove)"]],
		advantages: [
			["Initiative", true],
			["Perception", true],
		],
		vision: [["Adv on Perception checks", 0]],
		spellcastingBonus: [{
			name: "At Will",
			spells: ["detect evil and good", "detect magic", "detect poison and disease", "see invisibility"],
			selection: ["detect evil and good", "detect magic", "detect poison and disease", "see invisibility"],
			times: 4,
			firstCol: "atwill",
		}],
	},
	"rod of lordly might": {
		name: "Rod of Lordly Might",
		source: [["SRD24", 241], ["DMG24", 300]],
		type: "Rod",
		rarity: "Legendary",
		magicItemTable: "Armaments",
		attunement: true,
		description: "This rod functions as a +3 Mace. As a Bonus Action, I can press one of the six buttons on the rod, changing it to a 50 ft climbing pole, flaming sword, +3 Battleaxe, +3 Spear, +10 battering ram, compass, or back to normal. The rod can also ***Drain Life***, ***Paralyze***, and ***Terrify***, each once per dawn. See Notes page.",
		descriptionFull: [
			"This rod has a flanged head, and it functions as a magic Mace that grants a +3 bonus to attack rolls and damage rolls made with it. The rod has properties associated with six different buttons that are set in a row along the haft. It has three other properties as well, detailed below.",
			"***Buttons***. You can press one of the following buttons as a Bonus Action; a button's effect lasts until you push a different button or until you push the same button again, which causes the rod to revert to its normal form:",
			" \u2022 **Button 1**. A fiery blade sprouts from the end opposite the rod's flanged head. The flames shed Bright Light in a 40-foot radius and Dim Light for an additional 40 feet, and the blade functions as a magic Longsword or Shortsword (your choice) that deals an extra 2d6 Fire damage on a hit.",
			" \u2022 **Button 2**. The rod's flanged head folds down and two crescent-shaped blades spring out, transforming the rod into a magic Battleaxe that grants a +3 bonus to attack rolls and damage rolls made with it.",
			" \u2022 **Button 3**. The rod's flanged head folds down, a spear point springs from the rod's tip, and the rod's handle lengthens into a 6-foot haft, transforming the rod into a magic Spear that grants a +3 bonus to attack rolls and damage rolls made with it.",
			" \u2022 **Button 4**. The rod transforms into a climbing pole up to 50 feet long (you specify the length), though the rod's buttons remain within your reach. In surfaces as hard as granite, a spike at the bottom and three hooks at the top anchor the pole. Horizontal bars 3 inches long fold out from the sides, 1 foot apart, forming a ladder. The pole can bear up to 4,000 pounds. More weight or lack of solid anchoring causes the rod to revert to its normal form.",
			" \u2022 **Button 5**. The rod transforms into a handheld battering ram and grants its user a +10 bonus to Strength (Athletics) checks made to break through doors, barricades, and other barriers.",
			" \u2022 **Button 6**. The rod assumes or remains in its normal form and indicates magnetic north. (Nothing happens if this function of the rod is used in a location that has no magnetic north.) The rod also gives you knowledge of your approximate depth beneath the ground or your height above it.",
			"***Drain Life***. When you hit a creature with a melee attack using the rod, you can force the target to make a DC 17 Constitution saving throw. On a failed save, the target takes an extra 4d6 Necrotic damage, and you regain a number of Hit Points equal to half that Necrotic damage. Once used, this property can't be used again until the next dawn.",
			"***Paralyze***. When you hit a creature with a melee attack using the rod, you can force the target to make a DC 17 Constitution saving throw. On a failed save, the target has the Paralyzed condition for 1 minute. The target repeats the save at the end of each of its turns, ending the effect on a success. Once used, this property can't be used again until the next dawn.",
			"***Terrify***. While holding the rod, you can take a Magic action to force each creature you can see within 30 feet of yourself to make a DC 17 Wisdom saving throw. On a failed save, a target has the Frightened condition for 1 minute. A Frightened target repeats the save at the end of each of its turns, ending the effect on itself on a success. Once used, this property can't be used again until the next dawn.",
		],
		weight: 2,
		action: [
			["bonus action", " (press button)"],
			["action", " (Terrify)"],
		],
		extraLimitedFeatures: [{
			name: "Rod of Lordly Might (Drain Life)",
			usages: 1,
			recovery: "Dawn",
		}, {
			name: "Rod of Lordly Might (Paralyze)",
			usages: 1,
			recovery: "Dawn",
		}, {
			name: "Rod of Lordly Might (Terrify)",
			usages: 1,
			recovery: "Dawn",
		}],
		weaponsAdd: {
			select: ["Rod of Lordly Might (Mace)"],
			options: [
				"Rod of Lordly Might (Mace)",
				"Rod of Lordly Might (Longsword)",
				"Rod of Lordly Might (Shortsword)",
				"Rod of Lordly Might (Battleaxe)",
				"Rod of Lordly Might (Spear)",
				"Mace of Lordly Might",
				"Sword of Lordly Might",
				"Shortsword of Lordly Might",
				"Axe of Lordly Might",
				"Spear of Lordly Might",
			],
		},
		toNotesPage: [{
			name: "Rod of Lordly Might",
			useDescriptionFull: function (str) {
				return str.replace("000 pounds", "000 lb").replace("gives I", "gives me");
			},
		}],
		calcChanges: {
			atkAdd: [
				function (fields, v) {
					if (v.theWea && !v.theWea.isMagicWeapon && v.isMeleeWeapon && /^(long|short)sword$/i.test(v.baseWeaponName) && /(?=.*lordly)(?=.*might)/i.test(v.WeaponTextName)) {
						fields.Description += (fields.Description ? "; " : "") + "+2d6 Fire damage";
					}
				},
				'If I include the words "Lordly Might" in the name of a Battleaxe, Mace, Longsword, Shortsword, or Spear, it will be treated as the magic item Rod of Lordly Might. The swords deal +2d6 Fire damage, while the others are +3 weapons.',
			],
			atkCalc: [
				function (fields, v, output) {
					if (v.isMeleeWeapon && /^(battleaxe|mace|spear)$/i.test(v.baseWeaponName) && /(?=.*lordly)(?=.*might)/i.test(v.WeaponTextName)) {
						output.magic = v.thisWeapon[1] + 3;
					}
				},
				"",
			],
		},
	},
	"rod of resurrection": {
		name: "Rod of Resurrection",
		source: [["SRD24", 242], ["DMG24", 301]],
		type: "Rod",
		rarity: "Legendary",
		magicItemTable: "Relics",
		attunement: true,
		description: "This rod has 5 charges and regains 1 expended charge daily at dawn. While holding it, I can cast one of the following spells from it: *Heal* (expends 1 charge) or *Resurrection* (expends 5 charges). If I expend the last charge, I must roll 1d20. On a 1, the rod disappears in a harmless burst of radiance.",
		descriptionFull: [
			"The rod has 5 charges. While you hold it, you can cast one of the following spells from it: *Heal* (expends 1 charge) or *Resurrection* (expends 5 charges).",
			"The rod regains 1 expended charge daily at dawn. If you expend the last charge, roll 1d20. On a 1, the rod disappears in a harmless burst of radiance.",
		],
		weight: 2,
		usages: 5,
		recovery: "Dawn",
		additional: "regains 1",
		spellFirstColTitle: "Ch",
		spellcastingBonus: [{
			name: "1 charge",
			spells: ["heal"],
			selection: ["heal"],
			firstCol: 1,
		}, {
			name: "5 charges",
			spells: ["resurrection"],
			selection: ["resurrection"],
			firstCol: 5,
		}],
	},
	"rod of rulership": {
		name: "Rod of Rulership",
		source: [["SRD24", 242], ["DMG24", 301]],
		type: "Rod",
		rarity: "Rare",
		magicItemTable: "Arcana",
		attunement: true,
		description: "As a Magic action once per dawn, I can use this rod to have each creature of my choice that I can see within 120 ft make a DC 15 Wis save or be Charmed for 8 hours. A charmed creature regards me as its trusted leader, but it ceases being Charmed if my allies or I harm it or command it to do something against its nature.",
		descriptionFull: "You can take a Magic action to present the rod and command obedience from each creature of your choice that you can see within 120 feet of yourself. Each target must succeed on a DC 15 Wisdom saving throw or have the Charmed condition for 8 hours. While Charmed in this way, the creature regards you as its trusted leader. If harmed by you or your allies or commanded to do something contrary to its nature, a target ceases to be Charmed in this way. Once used, this property can't be used again until the next dawn.",
		weight: 2,
		action: [["action", ""]],
		usages: 1,
		recovery: "Dawn",
	},
	"rod of security": {
		name: "Rod of Security",
		source: [["SRD24", 242], ["DMG24", 301]],
		type: "Rod",
		rarity: "Very Rare",
		magicItemTable: "Arcana",
		description: "As a Magic action once per 10 days, I can transport myself and up to 199 willing others I can see to an extraplanar paradise for 200 days divided by the number of creatures or until I end it as a Magic action. Creatures in the paradise don't age, have enough to eat and drink, and regain HP every hour as if using 1 HD.",
		descriptionFull: [
			"While holding this rod, you can take a Magic action to activate it. The rod then instantly transports you and up to 199 other willing creatures you can see to a demiplane. You choose the form the demiplane takes. It could be a tranquil garden, a cheery tavern, an immense palace, a tropical island, a fantastic carnival, or whatever else you can imagine. Regardless of its nature, the demiplane contains enough water and food to sustain its visitors, and the demiplane's environment can't harm its occupants. Everything else that can be interacted with there can exist only there. For example, a flower picked from a garden there disappears if it is taken outside the demiplane.",
			"For each hour spent in the demiplane, a visitor regains Hit Points as if it had spent 1 Hit Point Die. Also, creatures don't age while there, although time passes normally. Visitors can remain there for up to 200 days divided by the number of creatures present (round down).",
			"When the time runs out or you take a Magic action to end the effect, all visitors reappear in the location they occupied when you activated the rod or an unoccupied space nearest that location. Once used, this property can't be used again until 10 days have passed.",
		],
		weight: 2,
		usages: 1,
		recovery: "10 days",
		action: [["action", ""]],
	},
	"rope of climbing": {
		name: "Rope of Climbing",
		source: [["SRD24", 242], ["DMG24", 301]],
		type: "Wondrous Item",
		rarity: "Uncommon",
		magicItemTable: ["Arcana", "Implements"],
		description: "This 60-ft rope can hold 3,000 lb; AC 20, 20 HP, heals 1 HP/5 min. As a Magic action while I hold one end of it, I can animate it and command its other end to start moving to a location (10 ft per turn). I can tell it to stop moving, (un)fasten itself, coil itself, or (un)knot itself (50-ft length, Advantage to climb it).",
		descriptionLong: "This 60-ft rope can hold 3,000 lb. It has AC 20, 20 HP, Immunity to Poison and Psychic damage, heals 1 HP/5 min, and is destroyed at 0 HP. As a Magic action while I hold one end of it, I can animate it and command its other end to start moving to a location (10 ft immediately and at the start of each of my turns). I can tell it to stop moving, fasten itself securely to an object or unfasten, coil itself, or knot or unknot itself (knots appear at 1-ft intervals and the rope shortens to 50-ft length, granting Advantage to climb it).",
		descriptionFull: [
			"This 60-foot length of rope can hold up to 3,000 pounds. While holding one end of the rope, you can take a Magic action to command the other end of the rope to animate and move toward a destination you choose, up to the rope's length away from you. That end moves 10 feet on your turn when you first command it and 10 feet at the start of each of your subsequent turns until reaching its destination or until you tell it to stop. You can also tell the rope to fasten itself securely to an object or to unfasten itself, to knot or unknot itself, or to coil itself for carrying.",
			"If you tell the rope to knot, large knots appear at 1-foot intervals along the rope. While knotted, the rope shortens to a 50-foot length and grants Advantage on ability checks made to climb using the rope.",
			"The rope has AC 20, HP 20, and Immunity to Poison and Psychic damage. It regains 1 Hit Point every 5 minutes as long as it has at least 1 Hit Point. If the rope drops to 0 Hit Points, it is destroyed.",
		],
		weight: 5,
		action: [["action", " (animate)"]],
	},
	"rope of entanglement": {
		name: "Rope of Entanglement",
		source: [["SRD24", 242], ["DMG24", 301]],
		type: "Wondrous Item",
		rarity: "Rare",
		magicItemTable: "Implements",
		description: "As an Magic action while holding one end of this 30 ft rope, I can have a creature I can see in 20 ft make a DC 15 Dex save or be Restrained by the rope. I can release it as a Bonus Action. The creature can, as an action, escape with a DC 15 Athletics or Acrobatics check. The rope has AC 20, 20 HP, heals 1 HP/5 min.",
		descriptionLong: "As an Magic action while holding one end of this 30 ft rope, I can have a creature I can see in 20 ft make a DC 15 Dex save or be Restrained by the rope. I can release it for free, but the rope coils in the creature's space, or as a Bonus Action and have the rope coil in my hand. The creature can, as an action, escape with a DC 15 Athletics or Acrobatics check. If I am holding the rope when the creature escapes, I can use a Reaction to coil the rope in my hand, otherwise it coils in the creature's space. The rope has AC 20, 20 HP, Immunity to Poison or Psychic damage and heals 1 HP every 5 min if it has at least 1 HP.",
		descriptionFull: [
			"This rope is 30 feet long. While holding one end of the rope, you can take a Magic action to command the other end to dart forward and entangle one creature you can see within 20 feet of yourself. The target must succeed on a DC 15 Dexterity saving throw or have the Restrained condition. You can release the target by letting go of your end of the rope (causing the rope to coil up in the target's space) or by using a Bonus Action to repeat the command (causing the rope to coil up in your hand).",
			"A target Restrained by the rope can take an action to make its choice of a DC 15 Strength (Athletics) or Dexterity (Acrobatics) check. On a successful check, the target is no longer Restrained by the rope. If you're still holding onto the rope when a target escapes from it, you can take a Reaction to command the rope to coil up in your hand; otherwise, the rope coils up in the target's space.",
			"The rope has AC 20, HP 20, and Immunity to Poison and Psychic damage. It regains 1 Hit Point every 5 minutes as long as it has at least 1 Hit Point. If the rope drops to 0 Hit Points, it is destroyed.",
		],
		weight: 3,
		action: [
			["action", " (entangle)"],
			["bonus action", " (release)"],
			["reaction", " (command, after escape)"],
		],
		weaponOptions: [{
			regExpSearch: /^(?=.*rope)(?=.*entanglement).*$/i,
			name: "Rope of Entanglement",
			source: [["SRD24", 242], ["DMG24", 304]],
			ability: 0,
			type: "Magic Item",
			damage: ["Dex save", "", "Restrained"],
			range: "20 ft",
			description: "DC 15 Athletics or Acrobatics check to escape",
			abilitytodamage: false,
			weight: 3,
			modifiers: [7, 0],
			dc: true,
			isNotWeapon: true,
			isAlwaysProf: false,
		}],
	},
	"scarab of protection": {
		name: "Scarab of Protection",
		source: [["SRD24", 243], ["DMG24", 302]],
		type: "Wondrous Item",
		rarity: "Legendary",
		magicItemTable: "Relics",
		attunement: true,
		description: "This beetle-shaped medallion gives me advantage on saves against spells and +1 to AC. ***Preservation***. As a Reaction when I fail a save against a Necromancy spell or harmful effect from an Undead, I can expend 1 charge and succeed on the save instead. It has 12 charges and is destroyed when the last charge is used.",
		descriptionFull: [
			"This beetle-shaped medallion provides three benefits while it is on your person.",
			"***Defense***. You gain a +1 bonus to Armor Class.",
			"***Preservation***. The scarab has 12 charges. If you fail a saving throw against a Necromancy spell or a harmful effect originating from an Undead, you can take a Reaction to expend 1 charge and turn the failed save into a successful one. The scarab crumbles into powder and is destroyed when its last charge is expended.",
			"***Spell Resistance***. You have Advantage on saving throws against spells.",
		],
		weight: 1,
		usages: 12,
		recovery: "\u2013",
		savetxt: { adv_vs: ["spells"] },
		action: [["reaction", " (Preservation)"]],
		extraAC: [{ mod: 1, magic: true }],
	},
	"scimitar of speed": {
		name: "Scimitar of Speed",
		source: [["SRD24", 243], ["DMG24", 302]],
		type: "Weapon (Scimitar)",
		rarity: "Very Rare",
		magicItemTable: "Armaments",
		attunement: true,
		description: "I gain a +2 bonus to attack rolls and damage rolls made with this magic weapon. In addition, I can make one attack with it as a Bonus Action on each of my turns.",
		descriptionFull: "You gain a +2 bonus to attack rolls and damage rolls made with this magic weapon. In addition, you can make one attack with it as a Bonus Action on each of your turns.",
		weight: 3,
		action: [["bonus action", ""]],
		weaponOptions: [{
			baseWeapon: "scimitar",
			regExpSearch: /^(?=.*scimitar)(?=.*speed).*$/i,
			name: "Scimitar of Speed",
			source: [["SRD24", 243], ["DMG24", 302]],
			description: "Finesse, Light; Extra attack as Bonus Action",
			modifiers: [2, 2],
			selectNow: true,
		}],
	},
	"sending stones": {
		name: "Sending Stones",
		nameAlt: "Sending Stone",
		source: [["SRD24", 243], ["DMG24", 303]],
		type: "Wondrous Item",
		rarity: "Uncommon",
		magicItemTable: ["Arcana", "Relics"],
		description: "While I touch one stone from this pair I can cast *Sending* from it, targeting the bearer of the other stone. If no creature bears the other stone, I know and the spell won't be cast. Once the spell is cast from either stone, neither stone can be used again until the next dawn. If one is destroyed, the other becomes",
		descriptionFull: [
			"*Sending Stones* come in pairs, with each stone carved to match the other so the pairing is easily recognized. While you touch one stone, you can cast *Sending* from it. The target is the bearer of the other stone. If no creature bears the other stone, you know that fact as soon as you use the stone, and you don't cast the spell.",
			"Once *Sending* is cast using either stone, the stones can't be used again until the next dawn. If one of the stones in a pair is destroyed, the other one becomes nonmagical.",
		],
		spellcastingBonus: [{
			name: "To other stone bearer only",
			spells: ["sending"],
			selection: ["sending"],
			firstCol: "onceday",
		}],
		usages: 1,
		recovery: "Dawn",
		spellChanges: {
			"sending": {
				description: "Send a 25 word message to the bearer of the other Sending Stone, who can respond with 25 words",
				changes: "Using one stone of a pair of *Sending Stones*, the spell can only target the bearer of the other stone of the pair.",
			},
		},
	},
	"sentinel shield": {
		name: "Sentinel Shield",
		source: [["SRD24", 243], ["DMG24", 303]],
		type: "Shield",
		rarity: "Uncommon",
		magicItemTable: "Armaments",
		description: "While holding this Shield emblazoned with a symbol of an eye, I have Advantage on Initiative rolls and Wisdom (Perception) checks.",
		descriptionFull: "While holding this Shield, you have Advantage on Initiative rolls and Wisdom (Perception) checks. The Shield is emblazoned with a symbol of an eye.",
		weight: 6,
		shieldAdd: "Sentinel Shield",
		advantages: [["Initiative", true], ["Perception", true]],
		vision: [["Adv on Perception checks", 0]],
	},
	"shield": {
		name: "Shield, +1, +2, or +3",
		source: [["SRD24", 243], ["DMG24", 303]],
		type: "Shield",
		magicItemTable: "Armaments",
		description: "Select one of the choices.",
		descriptionFull: "While holding this Shield, you have a bonus to Armor Class determined by the Shield's rarity, in addition to the Shield's normal bonus to AC: Uncommon (+1), Rare (+2), or Very Rare (+3).",
		allowDuplicates: true,
		weight: 6,
		choices: ["+1 Shield (Uncommon)", "+2 Shield (Rare)", "+3 Shield (Very Rare)"],
		"+1 shield (uncommon)": {
			name: "Shield +1",
			nameTest: "+1 Shield",
			rarity: "Uncommon",
			description: "While holding this Shield, I have a +1 bonus to AC. This bonus is in addition to the Shield's normal bonus to AC.",
			allowDuplicates: true,
			shieldAdd: "+1 Shield",
		},
		"+2 shield (rare)": {
			name: "Shield +2",
			nameTest: "+2 Shield",
			rarity: "Rare",
			description: "While holding this Shield, I have a +2 bonus to AC. This bonus is in addition to the Shield's normal bonus to AC.",
			allowDuplicates: true,
			shieldAdd: "+2 Shield",
		},
		"+3 shield (very rare)": {
			name: "Shield +3",
			nameTest: "+3 Shield",
			rarity: "Very Rare",
			description: "While holding this Shield, I have a +3 bonus to AC. This bonus is in addition to the Shield's normal bonus to AC.",
			allowDuplicates: true,
			shieldAdd: "+3 Shield",
		},
	},
	"shield of missile attraction": {
		name: "Shield of Missile Attraction",
		source: [["SRD24", 243], ["DMG24", 304]],
		type: "Shield",
		rarity: "Rare",
		magicItemTable: "Armaments",
		attunement: true,
		cursed: true,
		description: "While holding this Shield, I have Resistance to damage from Ranged weapons. Once attuned to it, I am cursed until I am the target of *Remove Curse* or similar magic. Whenever a Ranged weapon targets a creature within 10 ft of me, the curse causes me to become the target instead.",
		descriptionFull: [
			"While holding this Shield, you have Resistance to damage from attacks made with Ranged weapons.",
			"***Curse***. This Shield is cursed. Attuning to it curses you until you are targeted by a *Remove Curse* spell or similar magic. Removing the Shield fails to end the curse on you. Whenever an attack with a Ranged weapon targets a creature within 10 feet of you, the curse causes you to become the target instead.",
		],
		weight: 6,
		shieldAdd: "Shield of Missile Attraction",
		dmgres: ["Ranged Weapons"],
	},
	"shield of the cavalier": {
		name: "Shield of the Cavalier",
		source: [["SRD24", 243], ["DMG24", 304]],
		type: "Shield",
		rarity: "Very Rare",
		magicItemTable: "Armaments",
		attunement: true,
		description: "This Shield adds +2 AC. ***Forceful Bash***. When I take the Attack action, I can make one melee attack with it. ***Protective Field***. As a Reaction once per dawn when an ally that I can see within 5 ft or I am the target of an attack or make a save against an area of effect, I can create an immobile, impassible ward. See Notes.",
		descriptionLong: "This Shield adds +2 AC. ***Forceful Bash***. As part of an Attack action, I can use it to make one proficient attack using Str" + (typePF ? "" : "ength") + " which deals 2d6+2" + (typePF ? "" : "+Strength modifier") + " Force damage, pushes the target 10 ft away, and knocks them Prone if my size or smaller. ***Protective Field***. As a Reaction once per dawn when an ally that I can see within 5 ft or I am the target of an attack or make a save against an area of effect, I can create an immobile 5-ft Emanation originating from me. Nothing can pass into or out of it. Creatures cannot affect those inside and vice versa. The effect lasts while I maintain Concentration, up to 1 minute. See Notes page",
		descriptionFull: [
			"While holding this Shield, you have a +2 bonus to Armor Class. This bonus is in addition to the Shield's normal bonus to AC.",
			"The Shield has the following additional properties that you can use while holding it.",
			"***Forceful Bash***. When you take the Attack action, you can make one of the attack rolls using the Shield against a target within 5 feet of yourself. Apply your Proficiency Bonus and Strength modifier to the attack roll. On a hit, the Shield deals Force damage to the target equal to 2d6 + 2 plus your Strength modifier, and if the target is a creature, you can push it up to 10 feet directly away from yourself. If the creature is your size or smaller, you can also knock it down, giving it the Prone condition.",
			"***Protective Field***. As a Reaction, when you or an ally you can see within 5 feet of you is targeted by an attack or makes a saving throw against an area of effect, you can use the Shield to create an immobile 5-foot Emanation originating from you. When the Emanation appears, any creatures or objects not fully contained within it are pushed into the nearest unoccupied spaces outside it. The attack or area of effect that triggered the Reaction has no effect on creatures and objects inside the Emanation, which lasts as long as you maintain Concentration, up to 1 minute. Nothing can pass into or out of the Emanation. A creature or object inside the Emanation can't be damaged by attacks or effects originating from outside, nor can a creature inside the Emanation damage anything outside it. Once this property is used, it can't be used again until the next dawn.",
		],
		weight: 6,
		shieldAdd: ["Shield of the Cavalier", 4, 6],
		action: [["reaction", " (Protective Field)"]],
		usages: 1,
		recovery: "Dawn",
		additional: "Protective Field",
		weaponOptions: [{
			regExpSearch: /^(?=.*shield)(?=.*cavalier).*$/i,
			name: "Shield of the Cavalier: Forceful Bash",
			source: [["SRD24", 243], ["DMG24", 304]],
			ability: 1,
			type: "Magic Item",
			damage: [2, 6, "force"],
			range: "Melee",
			description: "Creature pushed 10 ft, also Prone if \u2264my Size",
			modifiers: ["", 2],
			isNotWeapon: true,
			isAlwaysProf: true,
			selectNow: true,
		}],
		toNotesPage: [{
			name: "Shield of the Cavalier",
			useDescriptionFull: function (str) {
				return str.replace("as me maintain", "as I maintain");
			},
		}],
	},
	"slippers of spider climbing": {
		name: "Slippers of Spider Climbing",
		source: [["SRD24", 244], ["DMG24", 304]],
		type: "Wondrous Item",
		rarity: "Uncommon",
		magicItemTable: "Arcana",
		attunement: true,
		description: "While I wear these light shoes, I can move up, down, and across vertical surfaces and along ceilings, while leaving my hands free. I have a Climb Speed equal to my Speed. However, the slippers don't allow me to move this way on a slippery surface, such as one covered by ice or oil.",
		descriptionFull: "While you wear these light shoes, you can move up, down, and across vertical surfaces and along ceilings, while leaving your hands free. You have a Climb Speed equal to your Speed. However, the slippers don't allow you to move this way on a slippery surface, such as one covered by ice or oil.",
		speed: {
			climb: { spd: "walk", enc: "walk" },
		},
	},
	"sovereign glue": {
		name: "Sovereign Glue",
		source: [["SRD24", 244], ["DMG24", 305]],
		type: "Wondrous Item",
		rarity: "Legendary",
		magicItemTable: ["Arcana", "Implements"],
		description: "This substance can form a permanent bond between any two objects. A jar or flask contains 1d6+1 ounces. As a Utilize action, I can apply an ounce of glue to cover a 1-ft square surface. The glue takes 1 minute to set and the bond it creates can be broken only by *Universal Solvent*, *Oil of Etherealness*, or a *Wish*.",
		descriptionFull: [
			"This viscous, milky-white substance can form a permanent adhesive bond between any two objects. It must be stored in a jar or flask that has been coated inside with *Oil of Slipperiness*. When found, a container contains 1d6 + 1 ounces.",
			"One ounce of the glue can cover a 1-foot square surface. Applying an ounce of *Sovereign Glue* takes a Utilize action, and the applied glue takes 1 minute to set. Once it has done so, the bond it creates can be broken only by the application of *Universal Solvent* or *Oil of Etherealness*, or with a *Wish* spell.",
		],
		usages: " ", // Intentionally left blank
		additional: "1d6+1 oz",
		recovery: "\u2013",
		action: [["action", " (apply 1 oz)"]],
	},
	"spellguard shield": {
		name: "Spellguard Shield",
		source: [["SRD24", 244], ["DMG24", 305]],
		type: "Shield",
		rarity: "Very Rare",
		magicItemTable: "Armaments",
		attunement: true,
		description: "While holding this Shield, I have Advantage on saving throws against spells and other magical effects, and spell attack rolls have Disadvantage against me.",
		descriptionFull: "While holding this Shield, you have Advantage on saving throws against spells and other magical effects, and spell attack rolls have Disadvantage against you.",
		weight: 6,
		shieldAdd: "Spellguard Shield",
		savetxt: { adv_vs: ["spells", "magical effects"] },
	},
	"spell scroll": function (){
		var obj = {
			name: "Spell Scroll",
			source: [["SRD24", 244], ["DMG24", 305]],
			type: "Scroll",
			magicItemTable: ["Arcana", "Relics"],
			description: "Select one of the choices.",
			descriptionFull: [
				"A *Spell Scroll* bears the words of a single spell, written in a mystical cipher. If the spell is on your spell list, you can read the scroll and cast its spell without Material components. Otherwise, the scroll is unintelligible. Casting the spell by reading the scroll requires the spell's normal casting time. Once the spell is cast, the scroll crumbles to dust. If the casting is interrupted, the scroll isn't lost.",
				"If the spell is on your spell list but of a higher level than you can normally cast, you make an ability check using your spellcasting ability to determine whether you cast the spell. The DC equals 10 plus the spell's level. On a failed check, the spell disappears from the scroll with no other effect.",
				"The level of the spell on the scroll determines the spell's saving throw DC and attack bonus, as well as the scroll's rarity, as shown in the following table.",
				[
					["Spell",     "",           "", "Save",   "Attack"],
					["**Level**", "**Rarity**", "", "**DC**", "**Bonus**"],
					["Cantrip",   "Common",     "", "13",      " +5"],
					["   1   ",   "Common",     "", "13",      " +5"],
					["   2   ",   "Uncommon  ",     "13",      " +5"],
					["   3   ",   "Uncommon  ",     "15",      " +7"],
					["   4   ",   "Rare",       "", "15",      " +7"],
					["   5   ",   "Rare",       "", "17",      " +9"],
					["   6   ",   "Very rare     ", "17",      " +9"],
					["   7   ",   "Very rare     ", "18",      "+10"],
					["   8   ",   "Very rare     ", "18",      "+10"],
					["   9   ",   "Legendary     ", "19",      "+11"],
				],
				"***Copying a Scroll into a Spellbook***. A Wizard spell on a *Spell Scroll* can be copied into a spellbook. When a spell is copied in this way, the copier must succeed on an Intelligence (Arcana) check with a DC equal to 10 plus the spell's level. On a successful check, the spell is copied. Whether the check succeeds or fails, the *Spell Scroll* is destroyed.",
			],
			calcChanges: {
				spellAdd: [
					function (spellKey, spellObj, spName) {
						if (/^spell scroll/i.test(spName) && !spellObj.spellScrollProcessed) {
							var originalComponents = SpellsList[spellKey].components;
							if (originalComponents) {
								spellObj.components = (originalComponents.replace(/,?[RM][\u0192\u2020]?/ig, "") + ",M\u0192").replace(/^,+/, "");
							}
							spellObj.compMaterial = "Spells cast from a Spell Scroll do not require any Material components other than the spell scroll itself, but do require other components as normal.";
							if (spellObj.changesObj["Magic Item"]) delete spellObj.changesObj["Magic Item"];
							spellObj.ritual = false;
							spellObj.spellScrollProcessed = true; // Because this will be added multiple times if multiple spell scrolls are selected
							return true;
						};
					},
					"When casting a spell using a Spell Scroll, no Material components are needed other than the scroll itself, but it does require other components as normal. Scrolls also can be used to cast a spell as a Ritual.",
				],
			},
			allowDuplicates: true,
			choices: ["Mixed Levels"],
			"mixed levels": {
				description: "If a spell on this scroll is on my spell list, I can cast it with the scroll as its only Material component. If its level is above what I can cast, I need to make a spellcasting ability check DC 10+level. If I fail the check or cast the spell, the scroll is destroyed. The DC is listed in the spell page's first column (attack bonus = DC - 8).",
				spellFirstColTitle: "DC",
				spellcastingBonus: [{
					name: "any spell level",
					level: [0, 9],
					psionic: false,
					times: 20,
				}],
				calcChanges: {
					spellAdd: [
						function (spellKey, spellObj, spName) {
							if (/mixed levels/.test(spName) && spellObj.level !== undefined) {
								spellObj.firstCol = spellObj.level < 3 ? 13 : spellObj.level < 5 ? 15 : spellObj.level < 7 ? 17 : spellObj.level < 9 ? 18 : 19;
								if (spellObj.level === 0) spellObj.allowUpCasting = true;
								return true;
							};
						},
						"The save DC of spells on a mixed level Spell Scroll are displayed in the first column. To get the attack bonus, do DC-8. For example, if the DC is 15, the attack bonus is +7.",
					],
				},
			},
		};
		[
			{ level: 0, saveDC: 13, attackBonus: 5, rarity: "Common", name: "Cantrip" },
			{ level: 1, saveDC: 13, attackBonus: 5, rarity: "Common" },
			{ level: 2, saveDC: 13, attackBonus: 5, rarity: "Uncommon" },
			{ level: 3, saveDC: 15, attackBonus: 7, rarity: "Uncommon" },
			{ level: 4, saveDC: 15, attackBonus: 7, rarity: "Rare" },
			{ level: 5, saveDC: 17, attackBonus: 9, rarity: "Rare" },
			{ level: 6, saveDC: 17, attackBonus: 9, rarity: "Very Rare" },
			{ level: 7, saveDC: 18, attackBonus: 10, rarity: "Very Rare" },
			{ level: 8, saveDC: 18, attackBonus: 10, rarity: "Very Rare" },
			{ level: 9, saveDC: 19, attackBonus: 11, rarity: "Legendary" },
		].forEach(function (scroll) {
			var level = scroll.level;
			var basename = scroll.name ? scroll.name : "Level " + level;
			var nameKey = basename + " (" + scroll.rarity + ")";
			var nameFull = "Spell Scroll (" + basename + ")";
			// Regular expression for the nameTest
			var nameTestPart = level + ".{1,3}level|level " + level;
			if (scroll.name) nameTestPart += "|" + scroll.name;
			var nameTest = RegExp("^(?=.*spell)(?=.*scroll)(?=.*(" + nameTestPart + ")).*$", "i");
			var levelDC = 10 + level;
			var spellLevel = basename.toLowerCase();
			var spellString = spellLevel + (scroll.name ? "" : " spell");
			// Create the description and descriptionFull
			var description = [
				"If the " + spellString + " on this scroll is on my spell list, I can cast it with the scroll as its only Material component with save DC " + scroll.saveDC + " and +" + scroll.attackBonus + " attack bonus.",
				"If " + spellLevel + " is beyond what I can cast, I need to first succeed on a DC " + levelDC + " spellcasting ability check.",
				"After casting the spell or failing the check, the scroll crumbles to dust.",
			];
			if (level === 0) {
				// For a cantrip, some parts of the description don't apply
				description = [
					description[0],
					"If the casting is interrupted, the scroll isn't lost.",
					"After casting the cantrip, the scroll crumbles to dust.",
				];
			}
			obj.choices.push(nameKey);
			obj[nameKey.toLowerCase()] = {
				name: nameFull,
				nameTest: nameTest,
				rarity: scroll.rarity,
				description: description.join(" "),
				fixedDC: scroll.saveDC,
				spellFirstColTitle: "Us", // Used
				allowUpCasting: level === 0 ? true : undefined,
				spellcastingBonus: [{
					name: spellString,
					level: [level, level],
					psionic: false,
					times: 20,
					firstCol: "checkbox",
				}],
			};
		});
		obj.choices.sort();
		return obj;
	}(),
	"sphere of annihilation": {
		name: "Sphere of Annihilation",
		source: [["SRD24", 244], ["DMG24", 306]],
		type: "Wondrous Item",
		rarity: "Legendary",
		magicItemTable: ["Arcana", "Implements"],
		description: "This " + (typePF ? "1-ft-radius" : "2-ft-diameter") + " black sphere obliterates all matter it touches, except artifacts. Anything not wholly engulfed takes 8d10 Force damage. As a Magic action, I can make a DC 25 Arcana check to try to control it. If I fail, it moves 10 ft towards me. On a success, as a Bonus Action, I can move it 5 ft " + (typePF ? "\xD7 my Int mod" : "times my Intelligence modifier") + ". See Notes.",
		descriptionFull: [
			"This 2-foot-diameter black sphere is a hole in the multiverse, hovering in space and stabilized by a magical field surrounding it.",
			"The sphere obliterates all matter it passes through and all matter that passes through it. Artifacts are the exception. Unless an Artifact is susceptible to damage from a *Sphere of Annihilation*, it passes through the sphere unscathed. Anything else that touches the sphere but isn't wholly engulfed and obliterated by it takes 8d10 Force damage.",
			"***Controlling the Sphere***. A *Sphere of Annihilation* is stationary until someone takes control of it. If you are within 60 feet of a sphere, you can take a Magic action to make a DC 25 Intelligence (Arcana) check. On a successful check, you control the sphere until the start of your next turn, and if it was under another creature's control, that creature loses control of the sphere. On a failed check, the sphere moves 10 feet toward you in a straight line.",
			"While in control of the sphere, you can take a Bonus Action to cause it to move in one direction of your choice, up to a number of feet equal to 5 times your Intelligence modifier (minimum 5 feet). Any creature whose space the sphere enters must succeed on a DC 19 Dexterity saving throw or be touched by it, taking 8d10 Force damage. A creature reduced to 0 Hit Points by this damage is obliterated, leaving its possessions behind but no other physical remains.",
			"***Sphere Interactions***. If the sphere comes into contact with a planar portal (such as that created by the *Gate* spell) or an extradimensional space (such as that within a *Portable Hole*), the DM determines randomly what happens using the following table.",
			[
				["1d100", "Result"],
				["01\u201350", "The sphere is destroyed."],
				["51\u201385", "The sphere moves through the portal or into the extradimensional space."],
				["86\u201300", "A spatial rift sends the sphere and each creature and object within 180 feet of the sphere to a random plane of existence."],
			],
		],
		action: [
			["action", " (take control)"],
			["bonus action", " (move)"],
		],
		toNotesPage: [{
			name: "Sphere of Annihilation",
			useDescriptionFull: true,
		}],
	},
	"staff of charming": {
		name: "Staff of Charming",
		source: [["SRD24", 245], ["DMG24", 307]],
		type: "Staff",
		rarity: "Rare",
		magicItemTable: ["Arcana", "Relics"],
		attunement: true,
		prerequisite: "Requires Attunement by a Bard, Cleric, Druid, Sorcerer, Warlock, or Wizard",
		prereqeval: function (v) {
			return !!classes.known.bard || !!classes.known.cleric || !!classes.known.druid || !!classes.known.sorcerer || !!classes.known.warlock || !!classes.known.wizard;
		},
		description: "This staff has 10 charges usable to cast spells and regains 1d8+2 at dawn. It has a 5% chance of being destroyed if the last charge is used. If I need to save vs an Enchantment spell targetting only me: *Failure*: Once per dawn, I can succeed instead, *Success*: As a Reaction, I can use 1 charge to cast the same spell on the caster.",
		descriptionLong: [
			"This staff has 10 charges and regains 1d8+2 charges at dawn. If I use the last charge, I roll 1d20. On a 1, the staff crumbles to dust. While holding the staff, I can expend 1 charge to cast *Charm Person*, *Command*, or *Comprehend Languages* using my spell save DC.",
			(typePF ? "If" : "When") + " an Enchantment spell targets only me while I'm holding the staff, I can do the following.",
			"***Reflect Enchantment***. As a Reaction when I succeed on the save, I can expend 1 charge to turn the spell back on its caster as if I had cast the spell.",
			"***Resist Enchantment***. Once per dawn when I fail the save, I can turn it into a success.",
		],
		descriptionFull: [
			"This staff has 10 charges. While holding the staff, you can use any of its properties:",
			" \u2022 **Cast Spell**. You can expend 1 of the staff's charges to cast *Charm Person*, *Command*, or *Comprehend Languages* from it using your spell save DC.",
			" \u2022 **Reflect Enchantment**. If you succeed on a saving throw against an Enchantment spell that targets only you, you can take a Reaction to expend 1 charge from the staff and turn the spell back on its caster as if you had cast the spell.",
			" \u2022 **Resist Enchantment**. If you fail a saving throw against an Enchantment spell that targets only you, you can turn your failed save into a successful one. You can't use this property of the staff again until the next dawn.",
			"***Regaining Charges***. The staff regains 1d8 + 2 expended charges daily at dawn. If you expend the last charge, roll 1d20. On a 1, the staff crumbles to dust and is destroyed.",
		],
		weight: 4,
		usages: 10,
		recovery: "Dawn",
		additional: "regains 1d8+2",
		extraLimitedFeatures: [{
			name: "Staff of Charming (Resist)",
			usages: 1,
			recovery: "Dawn",
		}],
		spellcastingAbility: "class",
		spellFirstColTitle: "Ch",
		spellcastingBonus: [{
			name: "1 charge",
			spells: ["charm person", "command", "comprehend languages"],
			selection: ["charm person", "command", "comprehend languages"],
			firstCol: 1,
			times: 3,
		}],
		action: [["reaction", " (Reflect, 1 ch)"]],
	},
	"staff of fire": {
		name: "Staff of Fire",
		source: [["SRD24", 245], ["DMG24", 307]],
		type: "Staff",
		rarity: "Very Rare",
		magicItemTable: ["Arcana", "Relics"],
		attunement: true,
		prerequisite: "Requires Attunement by a Druid, Sorcerer, Warlock, or Wizard",
		prereqeval: function (v) {
			return !!classes.known.druid || !!classes.known.sorcerer || !!classes.known.warlock || !!classes.known.wizard;
		},
		description: "This staff has 10 charges and regains 1d6+4 daily at dawn. While holding the staff, I have Resistance to Fire damage and I can use its charges to cast *Burning Hands* (1 charge), *Fireball* (3 charges), or *Wall of Fire* (4 charges), using my spell save DC. If I expend the last charge, I roll 1d20. On a 1, the staff " + (typePF ? "" : "crumbles into cinders and ") + "is destroyed.",
		descriptionFull: [
			"You have Resistance to Fire damage while you hold this staff.",
			"***Spells***. The staff has 10 charges. While holding the staff, you can cast one of the spells on the following table from it, using your spell save DC. The table indicates how many charges you must expend to cast the spell.",
			[
				["Spell", "", "Charge Cost"],
				["*Burning Hands*", "1"],
				["*Fireball*", "", "3"],
				["*Wall of Fire* ", "4"],
			],
			"***Regaining Charges***. The staff regains 1d6 + 4 expended charges daily at dawn. If you expend the last charge, roll 1d20. On a 1, the staff crumbles into cinders and is destroyed.",
		],
		weight: 4,
		usages: 10,
		recovery: "Dawn",
		additional: "regains 1d6+4",
		dmgres: ["Fire"],
		spellcastingAbility: "class",
		spellFirstColTitle: "Ch",
		spellcastingBonus: [{
			name: "1 charge",
			spells: ["burning hands"],
			selection: ["burning hands"],
			firstCol: 1,
		}, {
			name: "3 charges",
			spells: ["fireball"],
			selection: ["fireball"],
			firstCol: 3,
		}, {
			name: "4 charges",
			spells: ["wall of fire"],
			selection: ["wall of fire"],
			firstCol: 4,
		}],
	},
	"staff of frost": {
		name: "Staff of Frost",
		source: [["SRD24", 245], ["DMG24", 308]],
		type: "Staff",
		rarity: "Very Rare",
		magicItemTable: ["Arcana", "Relics"],
		attunement: true,
		prerequisite: "Requires Attunement by a Druid, Sorcerer, Warlock, or Wizard",
		prereqeval: function (v) {
			return !!classes.known.druid || !!classes.known.sorcerer || !!classes.known.warlock || !!classes.known.wizard;
		},
		description: "This staff has 10 charges and regains 1d6+4 daily at dawn. While holding the staff, I have Resistance to Cold damage and can use it to cast *Fog Cloud* (1 charge), *Ice Storm* (4 charges), *Wall of Ice* (4 charges), or *Cone of Cold* (5 charges) using my spell save DC. If I use the last charge, I roll 1d20. On a 1, the staff " + (typePF ? "" : "turns to water and ") + "is destroyed.",
		descriptionFull: [
			"You have Resistance to Cold damage while you hold this staff.",
			"***Spells***. The staff has 10 charges. While holding the staff, you can cast one of the spells on the following table from it, using your spell save DC. The table indicates how many charges you must expend to cast the spell.",
			[
				["Spell", "", "Charge Cost"],
				["*Cone of Cold*  ", "5"],
				["*Fog Cloud*     ", "1"],
				["*Ice Storm*     ", "4"],
				["*Wall of Ice*   ", "4"],
			],
			"***Regaining Charges***. The staff regains 1d6 + 4 expended charges daily at dawn. If you expend the last charge, roll 1d20. On a 1, the staff turns to water and is destroyed.",
		],
		weight: 4,
		usages: 10,
		recovery: "Dawn",
		additional: "regains 1d6+4",
		dmgres: ["Cold"],
		spellcastingAbility: "class",
		spellFirstColTitle: "Ch",
		spellcastingBonus: [{
			name: "1 charge",
			spells: ["fog cloud"],
			selection: ["fog cloud"],
			firstCol: 1,
		}, {
			name: "4 charges",
			spells: ["ice storm", "wall of ice"],
			selection: ["ice storm", "wall of ice"],
			firstCol: 4,
			times: 2,
		}, {
			name: "5 charges",
			spells: ["cone of cold"],
			selection: ["cone of cold"],
			firstCol: 5,
		}],
	},
	"staff of healing": {
		name: "Staff of Healing",
		source: [["SRD24", 245], ["DMG24", 308]],
		type: "Staff",
		rarity: "Rare",
		magicItemTable: ["Implements", "Relics"],
		attunement: true,
		prerequisite: "Requires Attunement by a Bard, Cleric, or Druid",
		prereqeval: function (v) {
			return classes.known.bard || classes.known.cleric || classes.known.druid ? true : false;
		},
		description: "This staff has 10 charges and regains 1d6+4 daily at dawn. While holding the staff, I can cast *Cure Wounds* (1 charge per spell level, up to level 4), *Lesser Restoration* (2 charges), or *Mass Cure Wounds* (5 charges) using my spellcasting ability. If I use the last charge, I roll 1d20. On a 1, the staff vanishes in a flash of light" + (typePF ? "." : ", lost forever."),
		descriptionFull: [
			"This staff has 10 charges. While holding the staff, you can cast one of the spells on the following table from it, using your spellcasting ability modifier. The table indicates how many charges you must expend to cast the spell.",
			[
				["Spell", "", "Charge Cost"],
				["*Cure Wounds*       ", "1 charge per spell level (maximum 4 for a level 4 spell)"],
				["*Lesser Restoration*", "2"],
				["*Mass Cure Wounds*  ", "5"],
			],
			"***Regaining Charges***. The staff regains 1d6 + 4 expended charges daily at dawn. If you expend the last charge, roll 1d20. On a 1, the staff vanishes in a flash of light, lost forever.",
		],
		weight: 4,
		usages: 10,
		recovery: "Dawn",
		additional: "regains 1d6+4",
		spellcastingAbility: "class",
		spellFirstColTitle: "Ch",
		spellcastingBonus: [{
			name: "1-4 charges",
			spells: ["cure wounds"],
			selection: ["cure wounds"],
			firstCol: "1-4",
		}, {
			name: "2 charges",
			spells: ["lesser restoration"],
			selection: ["lesser restoration"],
			firstCol: 2,
		}, {
			name: "5 charges",
			spells: ["mass cure wounds"],
			selection: ["mass cure wounds"],
			firstCol: 5,
		}],
		spellChanges: {
			"cure wounds": {
				allowUpCasting: true,
				description: "1 creature heals 0+2d8/charge + spellcasting ability modifier HP", // Needs the "0+" prefix to function with the Life Domain lvl 17
				changes: "The spell level that *Cure Wounds* is cast at depends on the amount of charges spend, 1 charge per spell slot level up to maximum level 4.",
			},
		},
		calcChanges: {
			spellAdd: [
				// Remove the "0+" prefix if not done so already by Life Domain lvl 17
				function (spellKey, spellObj, spName) {
					if (spName.indexOf("staff of healing") !== -1 && spellKey === "cure wounds") {
						spellObj.description = spellObj.description.replace("0+", "");
						return true;
					}
				},
				"",
				900,
			],
		},
	},
	"staff of power": {
		name: "Staff of Power",
		source: [["SRD24", 245], ["DMG24", 308]],
		type: "Staff",
		rarity: "Very Rare",
		magicItemTable: "Arcana",
		attunement: true,
		prerequisite: "Requires Attunement by a Sorcerer, Warlock, or Wizard",
		prereqeval: function (v) {
			return !!classes.known.sorcerer || !!classes.known.warlock || !!classes.known.wizard;
		},
		description: "This +2 Quarterstaff has 20 charges and regains 2d8+4 at dawn. While holding the staff, I can use charges to cast spells with my spell save DC. I gain a +2 bonus to saves, AC, and spell attacks. As a Magic action, I can break it to cause a 30-ft radius explosion and potentially teleport me to another plane. See Notes page.",
		descriptionLong: "This +2 Quarterstaff has 20 charges and regains 2d8+4 at dawn. While holding the staff, I can use its charges to cast spells and I gain a +2 bonus to my saves, AC, and spell attacks. If I use the last charge, I roll 1d20. On a 1, it becomes a +2 Quarterstaff with no abilities. On a 20, it regains 1d8+2 charges. As a Magic action, I can break the staff, causing it to explode, dealing Force damage equal to 4\xD7 the charges left to each creature in 30 ft, or half as much on a DC 17 Dex saving throw. When it explodes, there is a 50% chance that I teleport to a random plane. If I don't, I take Force damage equal to 16\xD7 the charges left.",
		descriptionFull: [
			"This staff has 20 charges and can be wielded as a magic Quarterstaff that grants a +2 bonus to attack rolls and damage rolls made with it. While holding it, you gain a +2 bonus to Armor Class, saving throws, and spell attack rolls.",
			"***Spells***. While holding the staff, you can cast one of the spells on the following table from it, using your spell save DC. The table indicates how many charges you must expend to cast the spell.",
			[
				["Charge"],
				["**Cost**", "**Spell**"],
				["  5", "*Cone of Cold*"],
				["  5", "*Fireball* (level 5 version)"],
				["  6", "*Globe of Invulnerability*"],
				["  5", "*Hold Monster*"],
				["  2", "*Levitate*"],
				["  5", "*Lightning Bolt* (level 5 version)"],
				["  1", "*Magic Missile*"],
				["  1", "*Ray of Enfeeblement*"],
				["  5", "*Wall of Force*"],
			],
			"***Regaining Charges***. The staff regains 2d8 + 4 expended charges daily at dawn. If you expend the last charge, roll 1d20. On a 1, the staff retains its +2 bonus to attack rolls and damage rolls but loses all other properties. On a 20, the staff regains 1d8 + 2 charges.",
			"***Retributive Strike***. You can take a Magic action to break the staff over your knee or against a solid surface. The staff is destroyed and releases its magic in an explosion that fills a 30-foot Emanation originating from itself. You have a 50 percent chance to instantly travel to a random plane of existence, avoiding the explosion. If you fail to avoid the effect, you take Force damage equal to 16 times the number of charges in the staff. Each other creature in the area makes a DC 17 Dexterity saving throw. On a failed save, a creature takes Force damage equal to 4 times the number of charges in the staff. On a successful save, a creature takes half as much damage.",
		],
		weight: 4,
		usages: 20,
		recovery: "Dawn",
		additional: "regains 2d8+4",
		weaponOptions: [{
			baseWeapon: "quarterstaff",
			regExpSearch: /^(?=.*staff)(?=.*power).*$/i,
			name: "Staff of Power",
			source: [["SRD24", 245], ["DMG24", 308]],
			modifiers: [2, 2],
			selectNow: true,
		}],
		calcChanges: {
			spellCalc: [
				function (type, spellcasters, ability) {
					if (type == "attack") return 2;
				},
				"While holding the Staff of Power, I have a +2 bonus to spell attack rolls.",
			],
		},
		addMod: [{
			type: "save",
			field: "all",
			mod: 2,
			text: "While holding the Staff of Power, I gain a +2 bonus to all my saving throws.",
		}],
		extraAC: [{
			name: "Staff of Power",
			mod: 2,
			magic: true,
			text: "While holding the Staff of Power, I gain a +2 bonus to AC.",
		}],
		action: [["action", " (Retributive Strike)"]],
		spellcastingAbility: "class",
		spellFirstColTitle: "Ch",
		spellcastingBonus: [{
			name: "1 charge",
			spells: ["magic missile", "ray of enfeeblement"],
			selection: ["magic missile", "ray of enfeeblement"],
			firstCol: 1,
			times: 2,
		}, {
			name: "2 charges",
			spells: ["levitate"],
			selection: ["levitate"],
			firstCol: 2,
		}, {
			name: "5 charges (level 5)",
			spells: ["fireball", "lightning bolt"],
			selection: ["fireball", "lightning bolt"],
			firstCol: 5,
			times: 2,
		}, {
			name: "5 charges",
			spells: ["cone of cold", "hold monster", "wall of force"],
			selection: ["cone of cold", "hold monster", "wall of force"],
			firstCol: 5,
			times: 3,
		}, {
			name: "6 charges",
			spells: ["globe of invulnerability"],
			selection: ["globe of invulnerability"],
			firstCol: 6,
		}],
		spellChanges: {
			"fireball": {
				nameShort: "Fireball (level 5)",
				description: "20-ft rad all crea 10d6 Fire dmg; save halves; unattended flammable objects ignite",
				changes: "Cast as if using a level 5 spell slot.",
			},
			"lightning bolt": {
				nameShort: "Lightning Bolt (level 5)",
				description: "100-ft long, 5-ft wide line all creatures 10d6 Lightning damage; save halves",
				changes: "Cast as if using a level 5 spell slot.",
			},
		},
		toNotesPage: [{
			name: "Staff of Power",
			useDescriptionFull: true,
		}],
	},
	"staff of striking": {
		name: "Staff of Striking",
		source: [["SRD24", 246], ["DMG24", 309]],
		type: "Staff",
		rarity: "Very Rare",
		magicItemTable: "Relics",
		attunement: true,
		description: "This +3 Quarterstaff has 10 charges, and regains 1d6+4 charges daily at dawn. When I hit with a melee attack using it, I can expend up to 3 charges. For each charge I expend, the target takes an extra 1d6 Force damage. If I expend the last charge, I roll 1d20. On a 1, the staff becomes a nonmagical Quarterstaff.",
		descriptionFull: [
			"This staff can be wielded as a magic Quarterstaff that grants a +3 bonus to attack rolls and damage rolls made with it.",
			"The staff has 10 charges. When you hit with a melee attack using it, you can expend up to 3 charges. For each charge you expend, the target takes an extra 1d6 Force damage.",
			"***Regaining Charges***. The staff regains 1d6 + 4 expended charges daily at dawn. If you expend the last charge, roll 1d20. On a 1, the staff becomes a nonmagical Quarterstaff.",
		],
		weight: 4,
		usages: 10,
		recovery: "Dawn",
		additional: "regains 1d6+4",
		weaponOptions: [{
			baseWeapon: "quarterstaff",
			regExpSearch: /^(?=.*staff)(?=.*striking).*$/i,
			name: "Staff of Striking",
			source: [["SRD24", 246], ["DMG24", 309]],
			modifiers: [3, 3],
			description: "Versatile (1d8); On hit: +1d6 Force damage per charge used (max 3)",
			selectNow: true,
		}],
	},
	"staff of swarming insects": {
		name: "Staff of Swarming Insects",
		source: [["SRD24", 246], ["DMG24", 309]],
		type: "Staff",
		rarity: "Rare",
		magicItemTable: ["Arcana", "Relics"],
		attunement: true,
		prerequisite: "Requires Attunement by a Bard, Cleric, Druid, Sorcerer, Warlock, or Wizard",
		prereqeval: function (v) {
			return !!classes.known.bard || !!classes.known.cleric || !!classes.known.druid || !!classes.known.sorcerer || !!classes.known.warlock || !!classes.known.wizard;
		},
		description: "This staff has 10 charges usable to cast spells and regains 1d6+4 at dawn. As a Magic action while holding it, I can use 1 charge to create a swarm of insects lasting for 10 min, in a 30-ft Emanation from me, Heavily Obscuring the area for all but me, ended by a strong wind. If I use the last charge, 5% chance the staff breaks.",
		descriptionLong: "This staff has 10 charges and regains 1d6+4 expended charges daily at dawn. While holding it, I can cast *Giant Insect* (4 charges) or *Insect Plague* (5 charges) from the staff using my spell save DC. As a Magic action while holding the staff, I can expend 1 charge to cause a swarm of harmless flying insects to fill a 30-ft Emanation originating from me for 10 minutes. The insects make the area Heavily Obscured for creatures other than me. A strong wind disperses the swarm and ends the effect. If I expend the last charge, I must roll 1d20. On a 1, a swarm of insects consumes and destroys the staff, then disperses.",
		descriptionFull: [
			"This staff has 10 charges.",
			"***Insect Cloud***. While holding the staff, you can take a Magic action and expend 1 charge to cause a swarm of harmless flying insects to fill a 30-foot Emanation originating from you. The insects remain for 10 minutes, making the area Heavily Obscured for creatures other than you. A strong wind (like that created by *Gust of Wind*) disperses the swarm and ends the effect.",
			"***Spells***. While holding the staff, you can cast one of the spells on the following table from it, using your spell save DC and spell attack modifier. The table indicates how many charges you must expend to cast the spell.",
			[
				["Spell", "", "Charge Cost"],
				["*Giant Insect*  ", "4"],
				["*Insect Plague* ", "5"],
			],
			"***Regaining Charges***. The staff regains 1d6 + 4 expended charges daily at dawn. If you expend the last charge, roll 1d20. On a 1, a swarm of insects consumes and destroys the staff, then disperses.",
		],
		weight: 4,
		usages: 10,
		recovery: "Dawn",
		additional: "regains 1d6+4",
		action: [["action", " (Insect Cloud)"]],
		spellcastingAbility: "class",
		spellFirstColTitle: "Ch",
		spellcastingBonus: [{
			name: "4 charges",
			spells: ["giant insect"],
			selection: ["giant insect"],
			firstCol: 4,
		}, {
			name: "5 charges",
			spells: ["insect plague"],
			selection: ["insect plague"],
			firstCol: 5,
		}],
	},
	"staff of the magi": {
		name: "Staff of the Magi",
		source: [["SRD24", 246], ["DMG24", 310]],
		type: "Staff",
		rarity: "Legendary",
		magicItemTable: "Arcana",
		attunement: true,
		prerequisite: "Requires Attunement by a Sorcerer, Warlock, or Wizard",
		prereqeval: function (v) {
			return !!classes.known.sorcerer || !!classes.known.warlock || !!classes.known.wizard;
		},
		description: "This +2 Quarterstaff has 50 charges usable to cast spells and regains 4d6+2 at dawn. While holding it, I have Adv on saves vs spells and +2 on spell attacks. As a Reaction, I can absorb a spell that targets only me, canceling it and gaining charges equal to its spell level. If the staff exceeds 50, it explodes. See Notes.",
		descriptionLong: "This +2 Quarterstaff has 50 charges usable to cast spells and regains 4d6+2 at dawn. While holding it, I have Adv on saves vs spells and +2 on spell attacks. As a Reaction, I can absorb a spell " + (typePF ? "targeting" : "that targets") + " only me, canceling it and gaining charges equal to its spell level. If it exceeds 50 or I break it is as a Magic action, the staff explodes, dealing Force damage equal to 6\xD7 the charges left to all within 30 ft, DC 17 Dex save for half. If it explodes, there is a 50% chance that I teleport to a random plane. If I don't, I take Force damage equal to 16\xD7 the charges left. If I use the last charge, I roll 1d20, On a 20, it gains 1d12+1 charges.",
		descriptionFull: [
			"This staff has 50 charges and can be wielded as a magic Quarterstaff that grants a +2 bonus to attack rolls and damage rolls made with it. While you hold it, you gain a +2 bonus to spell attack rolls.",
			"***Spell Absorption***. While holding the staff, you have Advantage on saving throws against spells. In addition, you can take a Reaction when another creature casts a spell that targets only you. If you do, the staff absorbs the magic of the spell, canceling its effect and gaining a number of charges equal to the absorbed spell's level. However, if doing so brings the staff's total number of charges above 50, the staff explodes as if you activated its Retributive Strike (see below).",
			"***Spells***. While holding the staff, you can cast one of the spells on the following table from it, using your spell save DC. The table indicates how many charges you must expend to cast the spell.",
			[
				["Charge"],
				["**Cost**", "**Spell**"],
				["  0", "*Arcane Lock*"],
				["  7", "*Conjure Elemental*"],
				["  0", "*Detect Magic*"],
				["  3", "*Dispel Magic*"],
				["  0", "*Enlarge/Reduce*"],
				["  7", "*Fireball* (level 7 version)"],
				["  2", "*Flaming Sphere*"],
				["  4", "*Ice Storm*"],
				["  2", "*Invisibility*"],
				["  2", "*Knock*"],
				["  0", "*Light*"],
				["  7", "*Lightning Bolt* (level 7 version)"],
				["  0", "*Mage Hand*"],
				["  5", "*Passwall*"],
				["  7", "*Plane Shift*"],
				["  0", "*Protection from Evil and Good*"],
				["  5", "*Telekinesis*"],
				["  4", "*Wall of Fire*"],
				["  2", "*Web*"],
			],
			"***Regaining Charges***. The staff regains 4d6 + 2 expended charges daily at dawn. If you expend the last charge, roll 1d20. On a 20, the staff regains 1d12 + 1 charges.",
			"***Retributive Strike***. You can take a Magic action to break the staff over your knee or against a solid surface. The staff is destroyed and releases its magic in an explosion that fills a 30-foot Emanation originating from itself. You have a 50 percent chance to instantly travel to a random plane of existence, avoiding the explosion. If you fail to avoid the effect, you take Force damage equal to 16 times the number of charges in the staff. Each other creature in the area makes a DC 17 Dexterity saving throw. On a failed save, a creature takes Force damage equal to 6 times the number of charges in the staff. On a successful save, a creature takes half as much damage.",
		],
		weight: 4,
		usages: 50,
		recovery: "Dawn",
		additional: "regains 4d6+2",
		weaponOptions: [{
			baseWeapon: "quarterstaff",
			regExpSearch: /^(?=.*staff)(?=.*magi).*$/i,
			name: "Staff of the Magi",
			source: [["SRD24", 246], ["DMG24", 310]],
			modifiers: [2, 2],
			selectNow: true,
		}],
		calcChanges: {
			spellCalc: [
				function (type, spellcasters, ability) {
					if (type == "attack") return 2;
				},
				"While holding the Staff of the Magi, I have a +2 bonus to spell attack rolls.",
			],
		},
		savetxt: { adv_vs: ["spells"] },
		action: [
			["reaction", " (Spell Absorption)"],
			["action", " (Retributive Strike)"],
		],
		spellcastingAbility: "class",
		spellFirstColTitle: "Ch",
		spellcastingBonus: [{
			name: "7 charges",
			spells: ["conjure elemental", "plane shift"],
			selection: ["conjure elemental", "plane shift"],
			firstCol: 7,
			times: 2,
		}, {
			name: "7 charges (level 7)",
			spells: ["fireball", "lightning bolt"],
			selection: ["fireball", "lightning bolt"],
			firstCol: 7,
			times: 2,
		}, {
			name: "5 charges",
			spells: ["passwall", "telekinesis"],
			selection: ["passwall", "telekinesis"],
			firstCol: 5,
			times: 2,
		}, {
			name: "4 charges",
			spells: ["ice storm", "wall of fire"],
			selection: ["ice storm", "wall of fire"],
			firstCol: 4,
			times: 2,
		}, {
			name: "3 charges",
			spells: ["dispel magic"],
			selection: ["dispel magic"],
			firstCol: 3,
		}, {
			name: "2 charges",
			spells: ["flaming sphere", "invisibility", "knock", "web"],
			selection: ["flaming sphere", "invisibility", "knock", "web"],
			firstCol: 2,
			times: 4,
		}, {
			name: "0 charges",
			spells: ["light", "mage hand", "arcane lock", "detect magic", "enlarge/reduce", "protection from evil and good"],
			selection: ["light", "mage hand", "arcane lock", "detect magic", "enlarge/reduce", "protection from evil and good"],
			firstCol: "atwill",
			times: 6,
		}],
		spellChanges: {
			"fireball": {
				nameShort: "Fireball (7th level)",
				description: "20-ft rad all crea 12d6 Fire dmg; save halves; unattended flammable objects ignite",
				changes: "Cast as if using a level 7 spell slot.",
			},
			"lightning bolt": {
				nameShort: "Lightning Bolt (level 7)",
				description: "100-ft long, 5-ft wide line all creatures 12d6 Lightning damage; save halves",
				changes: "Cast as if using a level 7 spell slot.",
			},
		},
		toNotesPage: [{
			name: "Staff of the Magi",
			useDescriptionFull: function (str) {
				return str.replace("targets only I", "targets only me");
			},
		}],
	},
	"staff of the python": {
		name: "Staff of the Python",
		source: [["SRD24", 247], ["DMG24", 311]],
		type: "Staff",
		rarity: "Uncommon",
		magicItemTable: ["Arcana", "Relics"],
		attunement: true,
		description: "As a Magic action, I can turn this staff into a **Giant Constrictor Snake** in an empty space in 10 ft. It shares my Initiative. While in 60 ft, I can mentally command it on my turn. As a Bonus Action, I can revert it back, causing it to regain all HP, and can transform it again after 1 hour. If it drops to 0 HP, the staff is destroyed.",
		descriptionLong: "As a Magic action, I can throw this staff so it lands in an unoccupied space within 10 ft, causing it to become a **Giant Constrictor Snake** that shares my Initiative, taking its turn right after mine. On my turn, I can mentally command the snake (no action) if within 60 ft and I'm not Incapacitated, deciding its actions or giving it a general command. Without orders, it defends itself. As a Bonus Action, I can command it to revert to staff form, causing it to regain all its lost HP. Once reverted, I can't have it become a snake again for 1 hour. If the snake is reduced to 0 HP, it dies and the staff shatters and is destroyed.",
		descriptionFull: [
			"As a Magic action, you can throw this staff so that it lands in an unoccupied space within 10 feet of you, causing the staff to become a **Giant Constrictor Snake** in that space. The snake is under your control and shares your Initiative count, taking its turn immediately after yours.",
			"On your turn, you can mentally command the snake (no action required) if it is within 60 feet of you and you don't have the Incapacitated condition. You decide what action the snake takes and where it moves during its turn, or you can issue it a general command, such as to attack your enemies or guard a location. Absent commands from you, the snake defends itself.",
			"As a Bonus Action, you can command the snake to revert to staff form in its current space, and you can't use the staff's property again for 1 hour. If the snake is reduced to 0 Hit Points, it dies and reverts to its staff form; the staff then shatters and is destroyed. If the snake reverts to staff form before losing all its Hit Points, it regains all of them.",
		],
		weight: 4,
		action: [
			["action", " (animate)"],
			["bonus action", " (end)"],
		],
		creaturesAdd: [["Giant Constrictor Snake", true, function (AddRemove, prefix) {
			var obj = MagicItemsList["staff of the python"];
			if (!AddRemove || !obj) return;
			// Set type
			Value(prefix + "Comp.Type", "Magic Item");
			// Set name
			var name = obj.name;
			Value(prefix + "Comp.Desc.Name", name);
			// Feature text
			var featureAddition = "##\u25C6 Owner##. The snake obeys the mental commands of its owner, which they can give while within 60 ft and not Incapacitated. The snake takes its turn immediately after its owner's on their Initiative count. If the snake is reduced to 0 HP, the *Staff of the Python* is destroyed. Absent commands from its owner, the snake defends itself. Its owner can use a Bonus Action to command the snake to revert back to an inanimate staff and it regains all its HP once the snake does so.";
			// Note text - full magic item description
			var source = stringSource(obj, "first,abbr");
			var description = formatDescriptionFull(obj.descriptionFull, true);
			description = ConvertToFirstPerson(description);
			var noteAddition = "#\u25C6 " + name + "# (" + source + ")\n" + description;
			// Metric conversion if necessary
			if (What("Unit System") === "metric") {
				featureAddition = ConvertToMetric(featureAddition, 0.5);
				noteAddition = ConvertToMetric(noteAddition, 0.5);
			}
			// Add feature and note to the sheet
			AddString(prefix + "Comp.Use.Features", featureAddition, true);
			AddString(prefix + "Cnote.Left", noteAddition, true);
		}]],
	},
	"staff of the woodlands": {
		name: "Staff of the Woodlands",
		source: [["SRD24", 247], ["DMG24", 311]],
		type: "Staff",
		rarity: "Rare",
		magicItemTable: "Relics",
		attunement: true,
		prerequisite: "Requires Attunement by a Druid",
		prereqeval: function (v) {
			return !!classes.known.druid;
		},
		description: "This +2 Quarterstaff has 6 charges usable to cast spells and regains 1d6 at dawn. While holding it, I have +2 on spell attacks. As a Magic action, I can plant the staff in the ground and use 1 charge to transform it into a 60-ft tree, or touch it to revert it" + (typePF ? ". If I use the last charge, it has a 5% chance to become nonmagical." : " back to a staff. If I expend the last charge, I roll 1d20. On a 1, the staff becomes a nonmagical Quarterstaff."),
		descriptionLong: "This +2 Quarterstaff has 6 charges and regains 1d6 at dawn. While holding it, I have a +2 bonus on spell attacks and can expend charges to cast spells using my spell save DC. As a Magic action, I can plant the staff in the earth in an empty space and expend 1 charge to transform it into a 60-ft tree with a 5-ft-diameter trunk and 20-ft-radius branches at its top. This healthy, ordinary tree radiates a faint aura of Transmutation magic. As a Magic action while touching it, I can revert the tree back into a staff, causing any creature in the tree to fall. If I expend the last charge, I roll 1d20. On a 1, the staff becomes nonmagical.",
		descriptionFull: [
			"This staff has 6 charges and can be wielded as a magic Quarterstaff that grants a +2 bonus to attack rolls and damage rolls made with it. While holding it, you have a +2 bonus to spell attack rolls.",
			"***Spells***. While holding the staff, you can cast one of the spells on the following table from it, using your spell save DC. The table indicates how many charges you must expend to cast the spell.",
			[
				["Spell", "", "", "Charge Cost"],
				["*Animal Friendship*       ", "1"],
				["*Awaken*", "", "", "5"],
				["*Barkskin*  ", "", "2"],
				["*Locate Animals or Plants*", "2"],
				["*Pass without Trace*      ", "2"],
				["*Speak with Animals*      ", "1"],
				["*Speak with Plants*       ", "3"],
				["*Wall of Thorns*          ", "6"],
			],
			"***Tree Form***. You can take a Magic action to plant one end of the staff in earth in an unoccupied space and expend 1 charge to transform the staff into a healthy tree. The tree is 60 feet tall and has a 5-foot-diameter trunk, and its branches at the top spread out in a 20-foot radius. The tree appears ordinary but radiates a faint aura of Transmutation magic that can be discerned with the *Detect Magic* spell. While touching the tree and using a Magic action, you return the staff to its normal form. Any creature in the tree falls when the tree reverts to a staff.",
			"***Regaining Charges***. The staff regains 1d6 expended charges daily at dawn. If you expend the last charge, roll 1d20. On a 1, the staff loses its properties and becomes a nonmagical Quarterstaff.",
		],
		weight: 4,
		usages: 6,
		recovery: "Dawn",
		additional: "regains 1d6",
		action: [["action", ""]],
		weaponOptions: [{
			baseWeapon: "quarterstaff",
			regExpSearch: /^(?=.*staff)(?=.*woodlands).*$/i,
			name: "Staff of the Woodlands",
			source: [["SRD24", 247], ["DMG24", 311]],
			modifiers: [2, 2],
			selectNow: true,
		}],
		calcChanges: {
			spellCalc: [
				function (type, spellcasters, ability) {
					if (type == "attack") return 2;
				},
				"While holding the Staff of the Woodlands, I have a +2 bonus to spell attack rolls.",
			],
		},
		spellcastingAbility: "class",
		spellFirstColTitle: "Ch",
		spellcastingBonus: [{
			name: "1 charge",
			spells: ["animal friendship", "speak with animals"],
			selection: ["animal friendship", "speak with animals"],
			firstCol: 1,
			times: 2,
		}, {
			name: "2 charges",
			spells: ["barkskin", "locate animals or plants", "pass without trace"],
			selection: ["barkskin", "locate animals or plants", "pass without trace"],
			firstCol: 2,
			times: 3,
		}, {
			name: "3 charges",
			spells: ["speak with plants"],
			selection: ["speak with plants"],
			firstCol: 3,
		}, {
			name: "5 charges",
			spells: ["awaken"],
			selection: ["awaken"],
			firstCol: 5,
		}, {
			name: "6 charges",
			spells: ["wall of thorns"],
			selection: ["wall of thorns"],
			firstCol: 6,
		}],
	},
	"staff of thunder and lightning": {
		name: "Staff of Thunder and Lightning",
		source: [["SRD24", 247], ["DMG24", 311]],
		type: "Staff",
		rarity: "Very Rare",
		magicItemTable: ["Arcana", "Relics"],
		attunement: true,
		description: "This +2 Quarterstaff has five properties that, once used, can't be used again until the next dawn. As a Magic action while holding the staff, I can use ***Lightning Strike*** or ***Thunderclap***. When I hit a melee attack with the staff, I can use ***Thunder***, ***Lightning***, or, as a Bonus Action, ***Thunder and Lightning***. See Notes page.",
		descriptionLong: "This +2 Quarterstaff has five properties that, once used, can't be used again until the next dawn. On a melee hit with it, I can use ***Lightning*** (no action) for +2d6 Lightning damage, or ***Thunder*** (no action) to have the target make a DC 17 Con save or be Stunned until my next turn ends, or ***Thunder and Lightning*** (Bonus Action) to apply both Lightning and Thunder. ***Lightning Strike***. As a Magic action, 5 ft by 120 ft Line deals 9d6 Lightning damage, DC 17 Dex save for half. ***Thunderclap***. As a Magic action, 60-ft Emanation deals 2d6 Thunder damage and Deafened for 1 min, DC 17 Con save for half damage only.",
		descriptionFull: [
			"This staff can be wielded as a magic Quarterstaff that grants a +2 bonus to attack rolls and damage rolls made with it. It also has the following additional properties. Once one of these properties is used, it can't be used again until the next dawn.",
			"***Lightning***. When you hit with a melee attack using the staff, you can cause the target to take an extra 2d6 Lightning damage (no action required).",
			"***Thunder***. When you hit with a melee attack using the staff, you can cause the staff to emit a crack of thunder audible out to 300 feet (no action required). The target you hit must succeed on a DC 17 Constitution saving throw or have the Stunned condition until the end of your next turn.",
			"***Thunder and Lightning***. Immediately after you hit with a melee attack using the staff, you can take a Bonus Action to use the Lightning and Thunder properties (see above) at the same time. Doing so doesn't expend the daily use of those properties, only the use of this one.",
			"***Lightning Strike***. You can take a Magic action to cause a bolt of lightning to leap from the staff's tip in a Line that is 5 feet wide and 120 feet long. Each creature in that Line makes a DC 17 Dexterity saving throw, taking 9d6 Lightning damage on a failed save or half as much damage on a successful one.",
			"***Thunderclap***. You can take a Magic action to cause the staff to produce a thunderclap audible out to 600 feet. Every creature within a 60-foot Emanation originating from you makes a DC 17 Constitution saving throw. On a failed save, a creature takes 2d6 Thunder damage and has the Deafened condition for 1 minute. On a successful save, a creature takes half as much damage only.",
		],
		weight: 4,
		action: [
			["action", "Staff of T\x26L (Lightning Strike, Thunderclap)"],
			["bonus action", "Staff of T\x26L (Thunder and Lightning)"],
		],
		weaponOptions: [{
			baseWeapon: "quarterstaff",
			regExpSearch: /^(?=.*staff)(?=.*thunder)(?=.*lightning).*$/i,
			name: "Staff of Thunder and Lightning",
			source: [["SRD24", 247], ["DMG24", 311]],
			description: "Versatile (1d8); Lightning: +2d6 Lightning damage; Thunder: DC 17 Con save or Stunned until my next EoT",
			modifiers: [2, 2],
			selectNow: true,
		}],
		extraLimitedFeatures: [{
			name: "Staff of T\x26L [Lightning]",
			usages: 1,
			recovery: "Dawn",
		}, {
			name: "Staff of T\x26L [Thunder]",
			usages: 1,
			recovery: "Dawn",
		}, {
			name: "Staff of T\x26L [Thunder and Lightning]",
			usages: 1,
			recovery: "Dawn",
		}, {
			name: "Staff of T\x26L [Lightning Strike]",
			usages: 1,
			recovery: "Dawn",
		}, {
			name: "Staff of T\x26L [Thunderclap]",
			usages: 1,
			recovery: "Dawn",
		}],
		toNotesPage: [{
			name: "Staff of Thunder and Lightning",
			useDescriptionFull: true,
		}],
	},
	"staff of withering": {
		name: "Staff of Withering",
		source: [["SRD24", 248], ["DMG24", 312]],
		type: "Staff",
		rarity: "Rare",
		magicItemTable: ["Arcana", "Relics"],
		attunement: true,
		description: "This magic quarterstaff has 3 charges and regains 1d3 at dawn. On a hit with it, I can expend 1 charge to deal an extra 2d10 Necrotic damage to the target, which must then make a DC 15 " + (typePF ? "Con save" : "Constitution saving throw") + ". If failed, the target has Disadvantage for 1 hour on any ability check or saving throw that uses Strength or Constitution.",
		descriptionFull: [
			"This staff has 3 charges and regains 1d3 expended charges daily at dawn.",
			"The staff can be wielded as a magic Quarterstaff. On a hit, it deals damage as a normal Quarterstaff, and you can expend 1 charge to deal an extra 2d10 Necrotic damage to the target and force it to make a DC 15 Constitution saving throw. On a failed save, the target has Disadvantage for 1 hour on any ability check or saving throw that uses Strength or Constitution.",
		],
		weight: 4,
		usages: 3,
		recovery: "Dawn",
		additional: "regains 1d3",
		weaponOptions: [{
			baseWeapon: "quarterstaff",
			regExpSearch: /^(?=.*staff)(?=.*withering).*$/i,
			name: "Staff of Withering",
			source: [["SRD24", 248], ["DMG24", 312]],
			description: "Versatile (1d8); On hit: 1 charge for +2d10 Necrotic dmg and DC 15 Con save, see magic item",
			selectNow: true,
		}],
	},
	"stone of controlling earth elementals": {
		name: "Stone of Controlling Earth Elementals",
		source: [["SRD24", 248], ["DMG24", 312]],
		type: "Wondrous Item",
		rarity: "Rare",
		magicItemTable: ["Arcana", "Relics"],
		description: "As a Magic action once per dawn, I can touch this 5-lb stone to the ground to summon an **Earth Elemental** in an empty space within 30 ft. The elemental obeys my commands and takes its turn after me on my Initiative. It disappears after 1 hour, when it dies, or when I dismiss it as a Bonus Action.",
		descriptionFull: "While touching this 5-pound stone to the ground, you can take a Magic action to summon an **Earth Elemental**. The elemental appears in an unoccupied space you choose within 30 feet of yourself, obeys your commands, and takes its turn immediately after you on your Initiative count. The elemental disappears after 1 hour, when it dies, or when you dismiss it as a Bonus Action. The stone can't be used this way again until the next dawn.",
		action: [
			["action", " (summon)"],
			["bonus action", " (dismiss)"],
		],
		weight: 5,
		usages: 1,
		recovery: "Dawn",
		creaturesAdd: [["Earth Elemental", true, function (AddRemove, prefix) {
			if (!AddRemove) return;
			Value(prefix + "Comp.Type", "Summon");
			Value(prefix + "Comp.Desc.Name", "Stone of Controlling Earth Elementals");
			var featuresNew = What(prefix + "Comp.Use.Features")
				.replace(/(.*languages.*)\./i, "$1, understands the languages of its summoner.");
			Value(prefix + "Comp.Use.Features", featuresNew);

			var noteAddition = "##\u25C6 Summoned##. The elemental obeys the commands of its summoner and takes its turn immediately after them on their Initiative count. The elemental disappears after 1 hour, when it dies, or when its summoner dismisses it as a Bonus Action.";
			AddString(prefix + "Cnote.Left", noteAddition, true);
		}]],
	},
	"stone of good luck": {
		name: "Stone of Good Luck",
		source: [["SRD24", 248], ["DMG24", 312]],
		type: "Wondrous Item",
		rarity: "Uncommon",
		magicItemTable: "Implements",
		attunement: true,
		description: "While this polished agate is on my person, I gain a +1 bonus to ability checks and saving throws.",
		descriptionFull: "While this polished agate is on your person, you gain a +1 bonus to ability checks and saving throws.",
		addMod: [{
			type: "save",
			field: "all",
			mod: 1,
			text: "I gain a +1 bonus on all my saving throws.",
		}, {
			type: "skill",
			field: "all",
			mod: 1,
			text: "I gain a +1 bonus on all my ability checks.",
		}, {
			type: "skill",
			field: "Init",
			mod: 1,
			text: "I gain a +1 bonus on all my ability checks.",
		}],
	},
	"sun blade": {
		name: "Sun Blade",
		source: [["SRD24", 248], ["DMG24", 312]],
		type: "Weapon (Longsword)",
		rarity: "Rare",
		magicItemTable: "Armaments",
		attunement: true,
		description: "As a Bonus Action, I can have this hilt emit a blade of radiance. With the blade, it acts like a +2 Longsword with Finesse that deals Radiant damage (+1d8 to Undead) and emits sunlight, 15 ft radius Bright Light plus 15 ft Dim. As a Magic Action, I can alter the radius of both lights by 5 ft, between 10 ft and 30 ft.",
		descriptionLong: "As a Bonus Action, I can have this sword hilt create or dismiss a blade of pure radiance. While the blade exists, it acts like a Longsword with Finesse that grants a +2 bonus to attack and damage rolls, deals Radiant damage and deals +1d8 Radiant damage to Undead. The blade emits sunlight, Bright Light in a 15-ft radius and Dim Light for an additional 15 ft. As a Magic action, I can expand or reduce both the Bright and Dim Light's radius by 5 ft each, to a maximum of 30 ft each or a minimum of 10 ft each. I am proficient with this weapon if I'm proficient with either Longswords or Shortswords.",
		descriptionFull: [
			"This item appears to be a sword hilt.",
			"***Blade of Radiance***. While grasping the hilt, you can take a Bonus Action to cause a blade of pure radiance to spring into existence or make the blade disappear. While the blade exists, this magic weapon functions as a Longsword with Finesse. If you are proficient with Longswords or Shortswords, you are proficient with the Sun Blade.",
			"You gain a +2 bonus to attack rolls and damage rolls made with this weapon, which deals Radiant damage instead of Slashing damage. When you hit an Undead with it, that target takes an extra 1d8 Radiant damage.",
			"***Sunlight***. The sword's luminous blade emits Bright Light in a 15-foot radius and Dim Light for an additional 15 feet. The light is sunlight. While the blade persists, you can take a Magic action to expand or reduce its radius of Bright Light and Dim Light by 5 feet each, to a maximum of 30 feet each or a minimum of 10 feet each.",
		],
		weight: 3,
		action: [
			["bonus action", " (start/stop)"],
			["action", " (change light)"],
		],
		weaponOptions: [{
			baseWeapon: "longsword",
			regExpSearch: /^(?=.*sun)(?=.*blade).*$/i,
			name: "Sun Blade",
			source: [["SRD24", 248], ["DMG24", 312]],
			damage: [1, 8, "radiant"],
			description: "Finesse, Versatile (1d10); +1d8 damage to Undead",
			modifiers: [2, 2],
			selectNow: true,
		}],
		calcChanges: {
			atkAdd: [
				function (fields, v) {
					if (v.theWea.name === "Sun Blade" && !fields.Proficiency) {
						fields.Proficiency = CurrentProfs.weapon.otherWea && CurrentProfs.weapon.otherWea.finalProfs.indexOf("shortsword") !== -1;
					};
				}, "",
			],
		},
	},
	"sword of life stealing": {
		name: "Sword of Life Stealing",
		nameTest: /^(?=.*(sword|\uFEFF))(?=.*life)(?=.*stealing).*$/i,
		source: [["SRD24", 248], ["DMG24", 314]],
		type: "Weapon (Glaive, Greatsword, Longsword, Rapier, Scimitar, or Shortsword)",
		rarity: "Rare",
		magicItemTable: "Armaments",
		attunement: true,
		description: "When I attack a creature with this magic weapon and roll a 20 on the d20 for the attack roll, that target takes an extra 15 Necrotic damage if it isn't a Construct or an Undead, and I gain Temporary Hit Points equal to the amount of Necrotic damage taken.",
		descriptionFull: "When you attack a creature with this magic weapon and roll a 20 on the d20 for the attack roll, that target takes an extra 15 Necrotic damage if it isn't a Construct or an Undead, and you gain Temporary Hit Points equal to the amount of Necrotic damage taken.",
		chooseGear: {
			type: "weapon",
			prefixOrSuffix: ["prefix", "of Life Stealing \uFEFF"],
			itemName1stPage: ["prefix", "of Life Stealing"],
			descriptionChange: ["replace", "weapon"],
			excludeCheck: function (inObjKey, inObj, v) {
				return !v.isMeleeWeapon || !/glaive|rapier|scimitar|sword/i.test(v.baseWeaponName);
			},
		},
		calcChanges: {
			atkAdd: [
				function (fields, v) {
					if (!v.theWea.isMagicWeapon && v.isMeleeWeapon && /glaive|rapier|scimitar|sword/i.test(v.baseWeaponName) && /^(?=.*life)(?=.*stealing).*$/i.test(v.WeaponTextName)) {
						v.theWea.isMagicWeapon = true;
						fields.Description += (fields.Description ? "; " : "") + "On 20 to hit: +15 Necrotic dmg, I gain equal Temp HP";
					};
				},
				'If I include the words "Life Stealing" in the name of a Glaive, Greatsword, Longsword, Rapier, Scimitar, or Shortsword, it will be treated as the magic weapon Sword of Life Stealing. It does +15 Necrotic damage when I roll a 20 to hit a creature that isn\'t a Construct or an Undead, and then gives me Temporary Hit Points equal to the Necrotic damage dealt.',
			],
		},
	},
	"sword of sharpness": {
		name: "Sword of Sharpness",
		nameTest: /^(?=.*(sword|\uFEFF))(?=.*sharpness).*$/i,
		source: [["SRD24", 248], ["DMG24", 314]],
		type: "Weapon (Glaive, Greatsword, Longsword, or Scimitar)",
		rarity: "Rare",
		magicItemTable: "Armaments",
		attunement: true,
		description: "When I attack an object with this magic weapon and hit, I maximize the weapon's damage dice against the target. When I attack a creature with it and roll a 20 on the d20 for the attack roll, that target takes an extra 14 Slashing damage and gains 1 Exhaustion level.",
		descriptionFull: [
			"When you attack an object with this magic weapon and hit, maximize your weapon damage dice against the target.",
			"When you attack a creature with this weapon and roll a 20 on the d20 for the attack roll, that target takes an extra 14 Slashing damage and gains 1 Exhaustion level.",
		],
		chooseGear: {
			type: "weapon",
			prefixOrSuffix: ["prefix", "of Sharpness \uFEFF"],
			itemName1stPage: ["prefix", "of Sharpness"],
			descriptionChange: ["replace", "weapon"],
			excludeCheck: function (inObjKey, inObj, v) {
				return !v.isMeleeWeapon || !/^(?!.*shortsword)(?=.*(glaive|scimitar|sword)).*$/i.test(v.baseWeaponName);
			},
		},
		calcChanges: {
			atkAdd: [
				function (fields, v) {
					if (!v.theWea.isMagicWeapon && v.isMeleeWeapon && /^(?!.*shortsword)(?=.*(glaive|scimitar|sword)).*$/i.test(v.baseWeaponName) && /sharpness/i.test(v.WeaponTextName)) {
						v.theWea.isMagicWeapon = true;
						fields.Description += (fields.Description ? "; " : "") + "On 20 to hit: +14 Slashing dmg, 1 Exhaustion lvl; Max dmg vs objects";
					};
				},
				'If I include the word "Sharpness" in the name of a Glaive, Greatsword, Longsword, or Scimitar, it will be treated as the magic weapon Sword of Sharpness. It deals maximum damage against objects. On a roll of 20 to hit against creatures, it deals +14 Slashing damage and the target gains 1 Exhaustion level.',
			],
		},
	},
	"sword of wounding": {
		name: "Sword of Wounding",
		nameTest: /^(?=.*(sword|\uFEFF))(?=.*wounding).*$/i,
		source: [["SRD24", 248], ["DMG24", 314]],
		type: "Weapon (Glaive, Greatsword, Longsword, Rapier, Scimitar, or Shortsword)",
		rarity: "Rare",
		magicItemTable: "Armaments",
		attunement: true,
		description: "When I hit a creature with this magic weapon, the target takes +2d6 Necrotic damage and must make a DC 15 Constitution saving throw or be unable to regain Hit Points for 1 hour. The target repeats the save at the end of each of its turns, ending the effect on itself on a success.",
		descriptionFull: "When you hit a creature with an attack using this magic weapon, the target takes an extra 2d6 Necrotic damage and must succeed on a DC 15 Constitution saving throw or be unable to regain Hit Points for 1 hour. The target repeats the save at the end of each of its turns, ending the effect on itself on a success.",
		chooseGear: {
			type: "weapon",
			prefixOrSuffix: ["prefix", "of Wounding \uFEFF"],
			itemName1stPage: ["prefix", "of Wounding"],
			descriptionChange: ["replace", "weapon"],
			excludeCheck: function (inObjKey, inObj, v) {
				return !v.isMeleeWeapon || !/glaive|rapier|scimitar|sword/i.test(v.baseWeaponName);
			},
		},
		calcChanges: {
			atkAdd: [
				function (fields, v) {
					if (!v.theWea.isMagicWeapon && v.isMeleeWeapon && /glaive|rapier|scimitar|sword/i.test(v.baseWeaponName) && /wounding/i.test(v.WeaponTextName)) {
						v.theWea.isMagicWeapon = true;
						fields.Description += (fields.Description ? "; " : "") + "+2d6 Necrotic dmg; DC 15 Con save or 1 hour no HP regain (repeat at its EoT)";
					};
				},
				'If I include the word "Wounding" in the name of a Glaive, Greatsword, Longsword, Rapier, Scimitar, or Shortsword, it will be treated as the magic weapon Sword of Wounding. It deals +2d6 Necrotic damage and the target must make a DC 15 Constitution saving throw or be unable to regain Hit Points for 1 hour.',
			],
		},
	},
	"talisman of pure good": {
		name: "Talisman of Pure Good",
		source: [["SRD24", 248], ["DMG24", 314]],
		type: "Wondrous Item",
		rarity: "Legendary",
		magicItemTable: "Relics",
		attunement: true,
		prerequisite: "Requires Attunement by a Cleric or Paladin",
		prereqeval: function (v) {
			return !!classes.known.cleric || !!classes.known.paladin;
		},
		description: "This talisman is a Holy Symbol and gives +2 to spell attack rolls. As a Magic action, I can use 1 of its 7 charges to have a creature in 120 ft make a DC 20 Dex save, Fiend and Undead have Disadv. *Fail*: Destroyed. *Success*: 4d6 Psychic damage. Fiend and Undead take 8d6 Radiant damage if they touch or end their turn with it.",
		descriptionLong: "A Fiend or an Undead that touches this talisman takes 8d6 Radiant damage and takes the damage again each time it ends its turn carrying the talisman. I can use the talisman as a Holy Symbol and gain a +2 bonus to spell attack rolls. As a Magic action, I can expend 1 of its 7 charges and target one creature I can see on the ground within 120 ft of me. The target makes a DC 20 Dex save. If the target is a Fiend or an Undead, it has Disadvantage. *Failure*: the target is destroyed, leaving no remains. *Success*: 4d6 Psychic damage. When I expend the last charge, the talisman turns into motes of golden light and is destroyed.",
		descriptionFull: [
			"This talisman is a mighty symbol of goodness. A Fiend or an Undead that touches the talisman takes 8d6 Radiant damage and takes the damage again each time it ends its turn holding or carrying the talisman.",
			"***Holy Symbol***. You can use the talisman as a Holy Symbol. You gain a +2 bonus to spell attack rolls while you wear or hold it.",
			"***Pure Rebuke***. The talisman has 7 charges. While wearing or holding the talisman, you can take a Magic action to expend 1 charge and target one creature you can see on the ground within 120 feet of yourself. A flaming fissure opens under the target, and the target makes a DC 20 Dexterity saving throw. If the target is a Fiend or an Undead, it has Disadvantage on the save. On a failed save, the target falls into the fissure and is destroyed, leaving no remains. On a successful save, the target isn't cast into the fissure but takes 4d6 Psychic damage from the ordeal. In either case, the fissure then closes, leaving no trace of its existence. When you expend the last charge, the talisman disperses into motes of golden light and is destroyed.",
		],
		weight: 1,
		usages: 7,
		recovery: "\u2013",
		action: [["action", ""]],
		calcChanges: {
			spellCalc: [
				function (type) {
					if (type == "attack") return 2;
				},
				"I gain a +2 bonus to spell attack rolls.",
			],
		},
	},
	"talisman of the sphere": {
		name: "Talisman of the Sphere",
		source: [["SRD24", 249], ["DMG24", 315]],
		type: "Wondrous Item",
		rarity: "Legendary",
		magicItemTable: ["Arcana", "Implements"],
		attunement: true,
		description: "While holding or wearing this talisman, I have Advantage on any Intelligence (Arcana) check to control a *Sphere of Annihilation*. In addition, when I start my turn in control of one, I can take a Magic action to move it 10 ft plus 10 ft times my Intelligence modifier. This movement doesn't have to be in a straight line.",
		descriptionFull: "While holding or wearing this talisman, you have Advantage on any Intelligence (Arcana) check you make to control a *Sphere of Annihilation*. In addition, when you start your turn in control of a *Sphere of Annihilation*, you can take a Magic action to move it 10 feet plus a number of additional feet equal to 10 times your Intelligence modifier. This movement doesn't have to be in a straight line.",
		weight: 1,
		action: [["action", ""]],
	},
	"talisman of ultimate evil": {
		name: "Talisman of Ultimate Evil",
		source: [["SRD24", 249], ["DMG24", 315]],
		type: "Wondrous Item",
		rarity: "Legendary",
		magicItemTable: "Relics",
		attunement: true,
		description: "This talisman is a Holy Symbol and gives me +2 to spell attack rolls. Non-Fiends or non-Undead take 8d6 Necrotic damage if they touch it or end their turn holding it. As a Magic action, I can expend 1 of its 6 charges to have a creature in 120 ft make a DC 20 Dex save" + (typePF ? "" : ", Celestials have Disadvantage") + ". *Failure*: Destroyed. *Success*: 4d6 Psychic damage.",
		descriptionLong: "A creature that isn't a Fiend or an Undead that touches this talisman takes 8d6 Necrotic damage and takes the damage again each time it ends its turn carrying the talisman. I can use the talisman as a Holy Symbol and gain a +2 bonus to spell attack rolls. As a Magic action, I can expend 1 of its 6 charges and target one creature I can see on the ground within 120 ft of me. The target makes a DC 20 Dex save. If the target is a Celestial, it has Disadvantage. *Failure*: the target is destroyed, leaving no remains. *Success*: 4d6 Psychic damage. When I expend the last charge, the talisman turns to slime and is destroyed.",
		descriptionFull: [
			"This item symbolizes unrepentant evil. A creature that isn't a Fiend or an Undead that touches the talisman takes 8d6 Necrotic damage and takes the damage again each time it ends its turn holding or carrying the talisman.",
			"***Holy Symbol***. You can use the talisman as a Holy Symbol. You gain a +2 bonus to spell attack rolls while you wear or hold it.",
			"***Ultimate End***. The talisman has 6 charges. While wearing or holding the talisman, you can take a Magic action to expend 1 charge and target one creature you can see on the ground within 120 feet of yourself. A flaming fissure opens under the target, and the target makes a DC 20 Dexterity saving throw. If the target is a Celestial, it has Disadvantage on the save. On a failed save, the target falls into the fissure and is destroyed, leaving no remains. On a successful save, the target isn't cast into the fissure but takes 4d6 Psychic damage from the ordeal. In either case, the fissure then closes, leaving no trace of its existence. When you expend the last charge, the talisman dissolves into foul-smelling slime and is destroyed.",
		],
		weight: 1,
		usages: 6,
		recovery: "\u2013",
		action: [["action", ""]],
		calcChanges: {
			spellCalc: [
				function (type) {
					if (type == "attack") return 2;
				},
				"I gain a +2 bonus to spell attack rolls.",
			],
		},
	},
	"thunderous greatclub": {
		name: "Thunderous Greatclub",
		source: [["SRD24", 249], ["DMG24", 316]],
		type: "Weapon (Greatclub)",
		rarity: "Very Rare",
		magicItemTable: "Armaments",
		attunement: true,
		description: "This Greatclub deals +1d8 Thunder damage (or +3d8 vs objects). It sets my Strength to 20. ***Clap of Thunder***. As a Magic action, I can have all in a 30-ft Cone make a DC 15 Str save or be Prone. ***Earthquake***. As a Magic action once per dawn, I can strike the ground to create seismic activity in 50 ft, see Notes page.",
		descriptionLong: [
			"This Greatclub does +1d8 Thunder damage (or +3d8 vs objects). It sets my Strength to 20.",
			"***Clap of Thunder***. As a Magic action, I can strike a surface to create a 30-ft Cone. Objects in it take 3d8 Thunder damage. Creatures in it make a DC 15 Str save or are Prone.",
			"***Earthquake***. As a Magic action once per dawn, I can strike the ground to create a 50-ft radius circle. Creatures in it make a DC 20 Dex save or are Prone and a DC 20 Con save or lose Concentration. Buildings partly in it take 50 Bludgeoning damage. I can have a 30-ft deep, 10-ft wide fissure open in the area and creatures make a DC 20 Dex save or fall in.",
		],
		descriptionFull: [
			"While you are attuned to this magic weapon, your Strength is 20 unless your Strength is already equal to or greater than that score. The weapon deals an extra 1d8 Thunder damage to any creature it hits and an extra 3d8 Thunder damage to objects it hits that aren't being worn or carried.",
			"The weapon has the following additional properties.",
			"***Clap of Thunder***. As a Magic action, you can strike the weapon against a hard surface to create a loud clap of thunder audible out to 300 feet. You also create a 30-foot Cone of thunderous energy. Each creature in the Cone must succeed on a DC 15 Strength saving throw or have the Prone condition. Nonmagical objects in the Cone that aren't being worn or carried take 3d8 Thunder damage.",
			"***Earthquake***. As a Magic action, you can strike the weapon against the ground to create an intense seismic disturbance in a 50-foot-radius circle centered on the point of impact. Structures in contact with the ground in that area take 50 Bludgeoning damage, and each creature on the ground in that area must succeed on a DC 20 Dexterity saving throw or have the Prone condition. If that creature is also Concentrating, it must succeed on a DC 20 Constitution saving throw or its Concentration is broken. In addition, you can cause a 30-foot-deep, 10-foot-wide fissure to open up on the ground anywhere in the area. Any creature on a spot where the fissure opens must make a DC 20 Dexterity saving throw, falling into the fissure on a failed save or moving with the fissure's edge on a successful one. Any structure on a spot where the fissure opens collapses into the fissure. Once you use this property, it can't be used again until the next dawn.",
		],
		weight: 10,
		scoresOverride: [20, 0, 0, 0, 0, 0],
		action: [
			["action", " (Clap of Thunder)"],
			["action", " (Earthquake)"],
		],
		weaponOptions: [{
			baseWeapon: "greatclub",
			regExpSearch: /^(?=.*thunderous)(?=.*greatclub).*$/i,
			name: "Thunderous Greatclub",
			source: [["SRD24", 249], ["DMG24", 316]],
			description: "Two-handed; +1d8 Thunder damage (or +3d8 vs Objects)",
			selectNow: true,
		}],
		extraLimitedFeatures: [{
			name: "Thunderous Greatclub (Earthquake)",
			usages: 1,
			recovery: "Dawn",
		}],
		toNotesPage: [{
			name: "Thunderous Greatclub",
			useDescriptionFull: true,
		}],
	},
	"tome of clear thought": {
		name: "Tome of Clear Thought",
		source: [["SRD24", 249], ["DMG24", 317]],
		type: "Wondrous Item",
		rarity: "Very Rare",
		magicItemTable: "Arcana",
		description: "This book contains memory and logic exercises, and its words are charged with magic. If I spend 48 hours over a period of 6 days or fewer studying its contents and practicing its guidelines, my Intelligence score increases by 2, to a maximum of 30. The tome then loses its magic, but regains it in a century.",
		descriptionFull: "This book contains memory and logic exercises, and its words are charged with magic. If you spend 48 hours over a period of 6 days or fewer studying the book's contents and practicing its guidelines, your Intelligence increases by 2, to a maximum of 30. The manual then loses its magic, but regains it in a century.",
		weight: 5,
		scores: [0, 0, 0, 2, 0, 0],
		scoresMaxLimited: [0, 0, 0, 30, 0, 0],
		scoresStackable: true,
	},
	"tome of leadership and influence": {
		name: "Tome of Leadership and Influence",
		source: [["SRD24", 249], ["DMG24", 317]],
		type: "Wondrous Item",
		rarity: "Very Rare",
		magicItemTable: "Implements",
		description: "This book contains tips for influencing and charming others, and its words are charged with magic. If I spend 48 hours over a period of 6 days or fewer studying its contents and practicing its guidelines, my Charisma score increases by 2, to a maximum of 30. The tome then loses its magic, but regains it in a century.",
		descriptionFull: "This book contains guidelines for influencing and charming others, and its words are charged with magic. If you spend 48 hours over a period of 6 days or fewer studying the book's contents and practicing its guidelines, your Charisma increases by 2, to a maximum of 30. The manual then loses its magic, but regains it in a century.",
		weight: 5,
		scores: [0, 0, 0, 0, 0, 2],
		scoresMaxLimited: [0, 0, 0, 0, 0, 30],
		scoresStackable: true,
	},
	"tome of understanding": {
		name: "Tome of Understanding",
		source: [["SRD24", 250], ["DMG24", 317]],
		type: "Wondrous Item",
		rarity: "Very Rare",
		magicItemTable: "Relics",
		description: "This book contains intuition and insight exercises, and its words are charged with magic. If I spend 48 hours over a period of 6 days or fewer studying its contents and practicing its guidelines, my Wisdom score increases by 2, to a maximum of 30. The tome then loses its magic, but regains it in a century.",
		descriptionFull: "This book contains intuition and insight exercises, and its words are charged with magic. If you spend 48 hours over a period of 6 days or fewer studying the book's contents and practicing its guidelines, your Wisdom increases by 2, to a maximum of 30. The manual then loses its magic, but regains it in a century.",
		weight: 5,
		scores: [0, 0, 0, 0, 2, 0],
		scoresMaxLimited: [0, 0, 0, 0, 30, 0],
		scoresStackable: true,
	},
	"trident of fish command": {
		name: "Trident of Fish Command",
		source: [["SRD24", 250], ["DMG24", 317]],
		type: "Weapon (Trident)",
		rarity: "Uncommon",
		magicItemTable: "Armaments",
		attunement: true,
		description: "This magic trident has 3 charges, and it regains 1d3 expended charges daily at dawn. While I carry it, I can expend 1 charge to cast *Dominate Beast* (save DC 15) from it on a Beast that has a Swim Speed.",
		descriptionFull: "This magic weapon has 3 charges, and it regains 1d3 expended charges daily at dawn. While you carry it, you can expend 1 charge to cast *Dominate Beast* (save DC 15) from it on a Beast that has a Swim Speed.",
		weight: 4,
		usages: 3,
		recovery: "Dawn",
		additional: "regains 1d3",
		fixedDC: 15,
		spellFirstColTitle: "Ch",
		spellcastingBonus: [{
			name: "1 charge",
			spells: ["dominate beast"],
			selection: ["dominate beast"],
			firstCol: 1,
		}],
		spellChanges: {
			"dominate beast": {
				description: "1 Beast with Swim spd save or Charmed; redo on dmg; follows telepathic commands; Rea to use its Rea",
				changes: "Can only affect Beasts with a Swim speed.",
			},
		},
		weaponsAdd: {
			select: ["Trident of Fish Command"],
			options: ["Trident of Fish Command"],
		},
	},
	"universal solvent": {
		name: "Universal Solvent",
		source: [["SRD24", 250], ["DMG24", 318]],
		type: "Wondrous Item",
		rarity: "Legendary",
		magicItemTable: ["Arcana", "Implements"],
		description: "This tube holds 1d6+1 ounces of milky liquid with a strong alcohol smell. As a Utilize action, I can pour 1 or more ounces from the tube onto a surface within reach. Each ounce instantly dissolves up to 1-ft square of adhesive it touches, including *Sovereign Glue*.",
		descriptionFull: [
			"This tube holds milky liquid with a strong alcohol smell. When found, a tube contains 1d6 + 1 ounces.",
			"You can take a Utilize action to pour 1 or more ounces of solvent from the tube onto a surface within reach. Each ounce instantly dissolves up to 1 square foot of adhesive it touches, including *Sovereign Glue*.",
		],
		usages: " ", // Intentionally left blank
		additional: "1d6+1 oz",
		recovery: "\u2013",
		action: [["action", " (pour 1+ oz)"]],
	},
	"vicious weapon": {
		name: "Vicious Weapon",
		nameTest: /vicious.+(weapon|\uFEFF)/i,
		source: [["SRD24", 250], ["DMG24", 318]],
		type: "Weapon (Any Simple or Martial)",
		rarity: "Rare",
		magicItemTable: "Armaments",
		description: "This magic weapon deals an extra 2d6 damage to any creature it hits. This extra damage is of the same type as the weapon's normal damage.",
		descriptionFull: "This magic weapon deals an extra 2d6 damage to any creature it hits. This extra damage is of the same type as the weapon's normal damage.",
		chooseGear: {
			type: "weapon",
			prefixOrSuffix: ["between", "Vicious", "\uFEFF"],
			itemName1stPage: ["suffix", "Vicious"],
			descriptionChange: ["replace", "weapon"],
			excludeCheck: function (inObjKey, inObj, v) {
				return !v.isSimpleOrMartial;
			},
		},
		calcChanges: {
			atkAdd: [
				function (fields, v) {
					if (!v.theWea.isMagicWeapon && v.isSimpleOrMartial && /vicious/i.test(v.WeaponTextName)) {
						v.theWea.isMagicWeapon = true;
						fields.Description += (fields.Description ? "; " : "") + "+2d6 damage";
					};
				},
				'If I include the word "Vicious" in the name of a Simple or Martial weapon, it will be treated as the magic weapon Vicious Weapon. it deals +2d6 damage to any creature it hits.',
			],
		},
	},
	"vorpal sword": {
		name: "Vorpal Sword",
		nameTest: /vorpal.+(sword|\uFEFF)/i,
		source: [["SRD24", 250], ["DMG24", 318]],
		type: "Weapon (Glaive, Greatsword, Longsword, or Scimitar)",
		rarity: "Legendary",
		magicItemTable: "Armaments",
		attunement: true,
		description: "This +3 magic weapon ignores Slashing damage Resistance. On a roll of 20 to hit, it cuts off one head, killing the creature if it cannot survive without the lost head. If the target doesn't need a head, its neck is too wide, it uses a Legendary Resistance, or has Slashing damage Immunity, it takes 30 Slashing damage instead.",
		descriptionFull: [
			"You gain a +3 bonus to attack rolls and damage rolls made with this magic weapon. In addition, the weapon ignores Resistance to Slashing damage.",
			"When you use this weapon to attack a creature that has at least one head and roll a 20 on the d20 for the attack roll, you cut off one of the creature's heads. The creature dies if it can't survive without the lost head. A creature is immune to this effect if it has Immunity to Slashing damage, if it doesn't have or need a head, or if the GM decides that the creature is too big for its head to be cut off with this weapon. Such a creature instead takes an extra 30 Slashing damage from the hit. If the creature has Legendary Resistance, it can expend one daily use of that trait to avoid losing its head, taking the extra damage instead",
		],
		chooseGear: {
			type: "weapon",
			prefixOrSuffix: ["between", "Vorpal", "\uFEFF"],
			itemName1stPage: ["suffix", "Vorpal"],
			descriptionChange: false,
			excludeCheck: function (inObjKey, inObj, v) {
				return !v.isMeleeWeapon || !/^(?!.*shortsword)(?=.*(glaive|scimitar|sword)).*$/i.test(v.baseWeaponName);
			},
		},
		calcChanges: {
			atkAdd: [
				function (fields, v) {
					if (!v.theWea.isMagicWeapon && v.isMeleeWeapon && /^(?!.*shortsword)(?=.*(glaive|scimitar|sword)).*$/i.test(v.baseWeaponName) && /vorpal/i.test(v.WeaponTextName)) {
						v.theWea.isMagicWeapon = true;
						fields.Description += (fields.Description ? "; " : "") + "Ignores Slashing Resistance; On 20 to hit: cut off head or +30 Slashing damage";
					};
				},
				'If I include the word "Vorpal" in the name of a Glaive, Greatsword, Longsword, or Scimitar, it will be treated as the magic weapon Vorpal Sword. It adds +3 to hit and damage and on a roll of 20 on the attack roll, it cuts off a head of the target.',
			],
			atkCalc: [
				function (fields, v, output) {
					if (v.isMeleeWeapon && /glaive|scimitar|sword/i.test(v.baseWeaponName) && /vorpal/i.test(v.WeaponTextName)) {
						output.magic = v.thisWeapon[1] + 3;
					};
				}, "",
			],
		},
	},
	"wand of binding": {
		name: "Wand of Binding",
		source: [["SRD24", 250], ["DMG24", 318]],
		type: "Wand",
		rarity: "Rare",
		magicItemTable: "Arcana",
		attunement: true,
		description: "This wand has 7 charges and regains 1d6+1 expended charges daily at dawn. While holding the wand, I can expend charges to cast (save DC 17) *Hold Monster* (5 charges) or *Hold Person* (2 charges). If I expend the last charge, I must roll 1d20. On a 1, the wand crumbles into ashes and is destroyed.",
		descriptionFull: [
			"This wand has 7 charges.",
			"***Spells***. While holding the wand, you can cast one of the spells (save DC 17) on the following table from it. The table indicates how many charges you must expend to cast the spell.",
			[
				["Spell", "", "Charge Cost"],
				["*Hold Monster*", "5"],
				["*Hold Person*", "2"],
			],
			"***Regaining Charges***. The wand regains 1d6 + 1 expended charges daily at dawn. If you expend the wand's last charge, roll 1d20. On a 1, the wand crumbles into ashes and is destroyed.",
		],
		weight: 1,
		usages: 7,
		recovery: "Dawn",
		additional: "regains 1d6+1",
		spellFirstColTitle: "Ch",
		fixedDC: 17,
		spellcastingBonus: [{
			name: "2 charges",
			spells: ["hold person"],
			selection: ["hold person"],
			firstCol: 2,
		}, {
			name: "5 charges",
			spells: ["hold monster"],
			selection: ["hold monster"],
			firstCol: 5,
		}],
	},
	"wand of enemy detection": {
		name: "Wand of Enemy Detection",
		source: [["SRD24", 250], ["DMG24", 319]],
		type: "Wand",
		rarity: "Rare",
		magicItemTable: ["Implements", "Implements"],
		attunement: true,
		description: "This wand has 7 charges and regains 1d6+1 at dawn. As a Magic action, I can expend 1 charge to, for 1 minute while holding it, know the direction of the nearest creature Hostile to me within 60 ft even if it is Invisible, ethereal, disguised, or hidden. If I use the last charge, I roll 1d20. On a 1, the wand is destroyed.",
		descriptionFull: [
			"This wand has 7 charges. While holding it, you can take a Magic action to expend 1 charge. For 1 minute, you know the direction of the nearest creature Hostile to you within 60 feet, but not its distance from you. The wand can sense the presence of Hostile creatures that are Invisible, ethereal, disguised, or hidden, as well as those in plain sight. The effect ends if you stop holding the wand.",
			"***Regaining Charges***. The wand regains 1d6 + 1 expended charges daily at dawn. If you expend the wand's last charge, roll 1d20. On a 1, the wand crumbles into ashes and is destroyed.",
		],
		weight: 1,
		usages: 7,
		recovery: "Dawn",
		additional: "regains 1d6+1",
		action: [["action", ""]],
	},
	"wand of fear": {
		name: "Wand of Fear",
		source: [["SRD24", 250], ["DMG24", 319]],
		type: "Wand",
		rarity: "Rare",
		magicItemTable: "Arcana",
		attunement: true,
		description: 'This wand has 7 charges and regains 1d6+1 expended charges daily at dawn. While holding the wand, I can expend charges to cast (save DC 15) *Command* (1 charge, "flee" or "grovel" only) or *Fear* (3 charges, 60-ft Cone). If I expend the last charge, I must roll 1d20. On a 1, it crumbles into ashes and is destroyed.',
		descriptionFull: [
			"This wand has 7 charges.",
			"***Spells***. While holding the wand, you can cast one of the spells (save DC 15) on the following table from it. The table indicates how many charges you must expend to cast the spell.",
			[
				["Spell", "", "", "", "Charge Cost"],
				['*Command* ("flee" or "grovel" only)', "1"],
				["*Fear* (60-foot Cone)", "", "", "3"],
			],
			"***Regaining Charges***. The wand regains 1d6 + 1 expended charges daily at dawn. If you expend the wand's last charge, roll 1d20. On a 1, the wand crumbles into ashes and is destroyed.",
		],
		weight: 1,
		usages: 7,
		recovery: "Dawn",
		additional: "regains 1d6+1",
		spellFirstColTitle: "Ch",
		fixedDC: 15,
		spellcastingBonus: [{
			name: "1 charge",
			spells: ["command"],
			selection: ["command"],
			firstCol: 1,
		}, {
			name: "3 charges",
			spells: ["fear"],
			selection: ["fear"],
			firstCol: 3,
		}],
		spellChanges: {
			"command": {
				description: "1 crea save or use next turn only doing command: Flee (move away) or Grovel (go Prone); see book",
				changes: 'When casting form the *Wand of Fear*, I can only use the "Flee" or "Grovel" commands.',
			},
			"fear": {
				range: "S:60-ft cone",
				changes: "When casting form the *Wand of Fear*, the *Fear* spell creates a 60-ft Cone instead of a 30-ft Cone.",
			},
		},
	},
	"wand of fireballs": {
		name: "Wand of Fireballs",
		source: [["SRD24", 250], ["DMG24", 319]],
		type: "Wand",
		rarity: "Rare",
		magicItemTable: "Arcana",
		attunement: true,
		prerequisite: "Requires Attunement by a Spellcaster",
		prereqeval: function (v) { return v.isSpellcaster; },
		description: "This wand has 7 charges and regains 1d6+1 at dawn. While holding it, I can expend 1-3 charges to cast *Fireball* (save DC 15) from it. The spell's level is 3 when expending 1 charge and increases with each additional charge expended. If I expend the last charge, I roll 1d20. On a 1, the wand crumbles into ashes.",
		descriptionFull: [
			"This wand has 7 charges. While holding it, you can expend no more than 3 charges to cast *Fireball* (save DC 15) from it. For 1 charge, you cast the level 3 version of the spell. You can increase the spell's level by 1 for each additional charge you expend.",
			"***Regaining Charges***. The wand regains 1d6 + 1 expended charges daily at dawn. If you expend the wand's last charge, roll 1d20. On a 1, the wand crumbles into ashes and is destroyed.",
		],
		weight: 1,
		usages: 7,
		recovery: "Dawn",
		additional: "regains 1d6+1",
		spellFirstColTitle: "Ch",
		fixedDC: 15,
		spellcastingBonus: [{
			name: "1-3 charges",
			spells: ["fireball"],
			selection: ["fireball"],
			firstCol: "1-3",
		}],
		spellChanges: {
			"fireball": {
				description: "20-ft rad all crea 8d6+1d6/extra charge Fire dmg; save halves; unattended flammable objects ignite",
				changes: "For 1 charge, it is cast as the level 3 version of the spell, but I can increase the spell slot level by one for each additional charge expended, up to level 5 (3 charges).",
			},
		},
	},
	"wand of lightning bolts": {
		name: "Wand of Lightning Bolts",
		source: [["SRD24", 251], ["DMG24", 320]],
		type: "Wand",
		rarity: "Rare",
		magicItemTable: "Arcana",
		attunement: true,
		prerequisite: "Requires Attunement by a Spellcaster",
		prereqeval: function (v) { return v.isSpellcaster; },
		description: "This wand has 7 charges and regains 1d6+1 at dawn. While holding it, I can expend 1-3 charges to cast *Lightning Bolt* (save DC 15) from it. The spell's level is 3 when expending 1 charge and increases with each additional charge expended. If I expend the last charge, I roll 1d20. On a 1, the wand is destroyed.",
		descriptionFull: [
			"This wand has 7 charges. While holding it, you can expend no more than 3 charges to cast *Lightning Bolt* (save DC 15) from it. For 1 charge, you cast the level 3 version of the spell. You can increase the spell's level by 1 for each additional charge you expend.",
			"***Regaining Charges***. The wand regains 1d6 + 1 expended charges daily at dawn. If you expend the wand's last charge, roll 1d20. On a 1, the wand crumbles into ashes and is destroyed.",
		],
		weight: 1,
		usages: 7,
		recovery: "Dawn",
		additional: "regains 1d6+1",
		spellFirstColTitle: "Ch",
		fixedDC: 15,
		spellcastingBonus: [{
			name: "1-3 charges",
			spells: ["lightning bolt"],
			selection: ["lightning bolt"],
			firstCol: "1-3",
		}],
		spellChanges: {
			"lightning bolt": {
				description: "100-ft long, 5-ft wide line all creatures 8d6+1d6/extra charge Lightning damage; save halves",
				changes: "For 1 charge, it is cast as the level 3 version of the spell, but I can increase the spell slot level by one for each additional charge expended, up to level 5 (3 charges).",
			},
		},
	},
	"wand of magic detection": {
		name: "Wand of Magic Detection",
		source: [["SRD24", 251], ["DMG24", 320]],
		type: "Wand",
		rarity: "Uncommon",
		magicItemTable: ["Arcana", "Relics"],
		description: "This wand has 3 charges and regains 1d3 expended charges daily at dawn. While holding the wand, I can expend 1 charge to cast *Detect Magic* from it.",
		descriptionFull: "This wand has 3 charges. While holding it, you can expend 1 charge to cast *Detect Magic* from it. The wand regains 1d3 expended charges daily at dawn.",
		weight: 1,
		usages: 3,
		recovery: "Dawn",
		additional: "regains 1d3",
		spellFirstColTitle: "Ch",
		spellcastingBonus: [{
			name: "1 charge",
			spells: ["detect magic"],
			selection: ["detect magic"],
			firstCol: 1,
		}],
	},
	"wand of magic missiles": {
		name: "Wand of Magic Missiles",
		source: [["SRD24", 251], ["DMG24", 320]],
		type: "Wand",
		rarity: "Uncommon",
		magicItemTable: "Arcana",
		description: "This wand has 7 charges and regains 1d6+1 at dawn. While holding it, I can expend no more than 3 charges to cast *Magic Missile* from it. The spell's level is the same as the number of charges expended. If I expend the last charge, I must roll 1d20. On a 1, the wand crumbles into ashes and is destroyed.",
		descriptionFull: [
			"This wand has 7 charges. While holding it, you can expend no more than 3 charges to cast *Magic Missile* from it. For 1 charge, you cast the level 1 version of the spell. You can increase the spell's level by 1 for each additional charge you expend.",
			"***Regaining Charges***. The wand regains 1d6 + 1 expended charges daily at dawn. If you expend the wand's last charge, roll 1d20. On a 1, the wand crumbles into ashes and is destroyed.",
		],
		weight: 1,
		usages: 7,
		recovery: "Dawn",
		additional: "regains 1d6+1",
		spellFirstColTitle: "Ch",
		spellcastingBonus: [{
			name: "1-3 charges",
			spells: ["magic missile"],
			selection: ["magic missile"],
			firstCol: "1-3",
		}],
		spellChanges: {
			"magic missile": {
				description: "3+1/extra charge darts hit same or different creatures for 1d4+1 Force dmg per dart",
				changes: "For 1 charge, it is cast as the level 1 version of the spell, but I can increase the spell slot level by one for each additional charge expended, up to level 3 (3 charges).",
			},
		},
	},
	"wand of paralysis": {
		name: "Wand of Paralysis",
		source: [["SRD24", 251], ["DMG24", 321]],
		type: "Wand",
		rarity: "Rare",
		magicItemTable: "Relics",
		attunement: true,
		prerequisite: "Requires Attunement by a Spellcaster",
		prereqeval: function (v) { return v.isSpellcaster; },
		description: "This wand has 7 charges and regains 1d6+1 at dawn. As a Magic action, I can expend 1 charge to have a creature I can see within 60 ft make a DC 15 Con save or be Paralyzed for 1 minute. The target repeats this save at the end of each of its turns. If I use the last charge, I roll 1d20. On a 1, the wand crumbles into ashes.",
		descriptionFull: [
			"This wand has 7 charges. While holding it, you can take a Magic action to expend 1 charge to cause a thin blue ray to streak from the tip toward a creature you can see within 60 feet of yourself. The target must succeed on a DC 15 Constitution saving throw or have the Paralyzed condition for 1 minute. At the end of each of the target's turns, it repeats the save, ending the effect on itself on a success.",
			"***Regaining Charges***. The wand regains 1d6 + 1 expended charges daily at dawn. If you expend the wand's last charge, roll 1d20. On a 1, the wand crumbles into ashes and is destroyed.",
		],
		weight: 1,
		usages: 7,
		recovery: "Dawn",
		additional: "regains 1d6+1",
		action: [["action", ""]],
	},
	"wand of polymorph": {
		name: "Wand of Polymorph",
		source: [["SRD24", 251], ["DMG24", 321]],
		type: "Wand",
		rarity: "Very Rare",
		magicItemTable: "Arcana",
		attunement: true,
		prerequisite: "Requires Attunement by a Spellcaster",
		prereqeval: function (v) { return v.isSpellcaster; },
		description: "This wand has 7 charges and regains 1d6+1 expended charges daily at dawn. While holding it, I can expend 1 charge to cast *Polymorph* (save DC 15) from it. If I expend the last charge, I must roll 1d20. On a 1, the wand crumbles into ashes and is destroyed.",
		descriptionFull: [
			"This wand has 7 charges. While holding it, you can expend 1 charge to cast *Polymorph* (save DC 15) from it.",
			"***Regaining Charges***. The wand regains 1d6 + 1 expended charges daily at dawn. If you expend the wand's last charge, roll 1d20. On a 1, the wand crumbles into ashes and is destroyed.",
		],
		weight: 1,
		usages: 7,
		recovery: "Dawn",
		additional: "regains 1d6+1",
		spellFirstColTitle: "Ch",
		fixedDC: 15,
		spellcastingBonus: [{
			name: "1 charge",
			spells: ["polymorph"],
			selection: ["polymorph"],
			firstCol: 1,
		}],
	},
	"wand of secrets": {
		name: "Wand of Secrets",
		source: [["SRD24", 251], ["DMG24", 322]],
		type: "Wand",
		rarity: "Uncommon",
		magicItemTable: ["Arcana", "Implements"],
		description: "This wand has 3 charges and regains 1d3 expended charges daily at dawn. As a Magic action while holding it, I can expend 1 charge, and if a secret door or trap is within 60 ft of me, the wand pulses and points at the one nearest to me.",
		descriptionFull: "This wand has 3 charges and regains 1d3 expended charges daily at dawn. While holding it, you can take a Magic action to expend 1 charge, and if a secret door or trap is within 60 feet of you, the wand pulses and points at the one nearest to you.",
		weight: 1,
		usages: 3,
		recovery: "Dawn",
		additional: "regains 1d3",
		action: [["action", ""]],
	},
	"wand of the war mage": {
		name: "Wand of the War Mage",
		nameTest: /^(?=.*war.mage)(?=.*(arcane focus|crystal|orb|rod|staff|wand)).*$/i,
		source: [["SRD24", 251], ["DMG24", 322]],
		type: "Wand",
		magicItemTable: ["Arcana", "Relics"],
		attunement: true,
		prerequisite: "Requires Attunement by a Spellcaster",
		prereqeval: function (v) { return v.isSpellcaster; },
		description: "Select one of the choices.",
		descriptionFull: "While holding this wand, you gain a bonus to spell attack rolls determined by the wand's rarity: Uncommon (+1), Rare (+2), or Very Rare (+3). In addition, you ignore Half Cover when making a spell attack roll.",
		weight: 1,
		allowDuplicates: true,
		choices: ["+1 Wand of the War Mage (Uncommon)", "+2 Wand of the War Mage (Rare)", "+3 Wand of the War Mage (Very Rare)"],
		"+1 wand of the war mage (uncommon)": {
			name: "Wand of the War Mage +1",
			nameTest: /^(?=.*war.mage)(?=.*(arcane focus|crystal|orb|rod|staff|wand))(?=.*\+1)(?!.*\+[23]).*$/i,
			rarity: "Uncommon",
			description: "While I am holding this arcane focus, I gain a +1 bonus to spell attack rolls and I ignore Half Cover when making a spell attack roll.",
			calcChanges: {
				spellCalc: [
					function (type, spellcasters, ability) {
						if (type == "attack") return 1;
					},
					"I gain a +1 bonus to spell attack rolls.",
				],
			},
		},
		"+2 wand of the war mage (rare)": {
			name: "Wand of the War Mage +2",
			nameTest: /^(?=.*war.mage)(?=.*(arcane focus|crystal|orb|rod|staff|wand))(?=.*\+2)(?!.*\+[13]).*$/i,
			rarity: "Rare",
			description: "While I am holding this arcane focus, I gain a +2 bonus to spell attack rolls and I ignore Half Cover when making a spell attack roll.",
			calcChanges: {
				spellCalc: [
					function (type, spellcasters, ability) {
						if (type == "attack") return 2;
					},
					"I gain a +2 bonus to spell attack rolls.",
				],
			},
		},
		"+3 wand of the war mage (very rare)": {
			name: "+3 Wand of the War Mage",
			nameTest: /^(?=.*war.mage)(?=.*(arcane focus|crystal|orb|rod|staff|wand))(?=.*\+3)(?!.*\+[12]).*$/i,
			rarity: "Very Rare",
			magicItemTable: ["Arcana", "Relics"],
			description: "While I am holding this arcane focus, I gain a +3 bonus to spell attack rolls and I ignore Half Cover when making a spell attack roll.",
			calcChanges: {
				spellCalc: [
					function (type, spellcasters, ability) {
						if (type == "attack") return 3;
					},
					"I gain a +3 bonus to spell attack rolls.",
				],
			},
		},
	},
	"wand of web": {
		name: "Wand of Web",
		source: [["SRD24", 251], ["DMG24", 322]],
		type: "Wand",
		rarity: "Uncommon",
		magicItemTable: "Arcana",
		attunement: true,
		prerequisite: "Requires Attunement by a Spellcaster",
		prereqeval: function (v) { return v.isSpellcaster; },
		description: "This wand has 7 charges and regains 1d6+1 expended charges daily at dawn. While holding it, I can expend 1 charge to cast *Web* (save DC 13) from it. If I expend the last charge, I must roll 1d20. On a 1, the wand crumbles into ashes and is destroyed.",
		descriptionFull: [
			"This wand has 7 charges. While holding it, you can expend 1 charge to cast *Web* (save DC 13) from it.",
			"***Regaining Charges***. The wand regains 1d6 + 1 expended charges daily at dawn. If you expend the wand's last charge, roll 1d20. On a 1, the wand crumbles into ashes and is destroyed.",
		],
		weight: 1,
		usages: 7,
		recovery: "Dawn",
		additional: "regains 1d6+1",
		spellFirstColTitle: "Ch",
		fixedDC: 13,
		spellcastingBonus: [{
			name: "1 charge",
			spells: ["web"],
			selection: ["web"],
			firstCol: 1,
		}],
	},
	"wand of wonder": {
		name: "Wand of Wonder",
		source: [["SRD24", 251], ["DMG24", 322]],
		type: "Wand",
		rarity: "Rare",
		magicItemTable: "Arcana",
		attunement: true,
		description: "This wand has 7 charges and regains 1d6+1 expended charges daily at dawn. As a Magic action while holding it, I can expend 1 charge and choose a point within 120 ft. I then roll a 1d100 to see what happens. See Notes page. If I expend the last charge, roll I must 1d20. On a 1, the wand is destroyed.",
		descriptionFull: [
			"This wand has 7 charges. While holding it, you can take a Magic action to expend 1 charge while choosing a point within 120 feet of yourself. That location becomes the point of origin of a spell or other magical effect determined by rolling on the table below. Spells cast from the wand have a save DC of 15. If a spell's maximum range is normally less than 120 feet, it becomes 120 feet when cast from the wand. If an effect has multiple possible subjects, the DM determines randomly which among them are affected.",
			"***Regaining Charges***. The wand regains 1d6 + 1 expended charges daily at dawn. If you expend the wand's last charge, roll 1d20. On a 1, the wand crumbles into dust and is destroyed.",
			[
				["1d100", "Effect"],
				["01\u201320", "You cast a spell originating from the chosen point. Roll 1d10 to determine the spell: on a **1\u20132**, *Darkness*; on a **3\u20134**, *Faerie Fire*; on a **5\u20136**, *Fireball*; on a **7\u20138**, *Slow*; on a **9\u201310**, *Stinking Cloud*."],
				["21\u201325", "Nothing happens at the chosen point of origin. Instead, you have the Stunned condition until the start of your next turn, believing something awesome just happened."],
				["26\u201330", "You cast *Gust of Wind*. The Line created by the spell extends from you to the chosen point of origin."],
				["31\u201335", "Nothing happens at the chosen point of origin. Instead, you take 1d6 Psychic damage."],
				["36\u201340", "Heavy rain falls for 1 minute in a 120-foot-high, 60-foot-radius Cylinder centered on the chosen point of origin. During that time, the area of effect is Lightly Obscured."],
				["41\u201345", "A cloud of 600 oversized butterflies fills a 60-foot-high, 30-foot-radius Cylinder centered on the chosen point of origin. The butterflies remain for 10 minutes, during which time the area of effect is Heavily Obscured."],
				["46\u201350", "You cast *Lightning Bolt*. The Line created by the spell extends from you to the chosen point of origin."],
				["51\u201355", "The creature closest to the chosen point of origin is enlarged as if you had cast *Enlarge/Reduce* on it. If the target isn't you and can't be affected by that spell, you become the target instead."],
				["56\u201360", "A magically formed creature appears in an unoccupied space as close to the chosen point of origin as possible. The creature isn't under your control, acts as it normally would, and disappears after 1 hour or when it drops to 0 Hit Points. Roll 1d4 to determine which creature appears. On a **1**, a **Rhinoceros** appears; on a **2**, an **Elephant** appears; and on a **3\u20134**, a **Rat** appears."],
				["61\u201364", "Grass covers a 60-foot-radius circle of ground, with the center of that circle as close to the chosen point of origin as possible. Grass that's already there grows to ten times its normal size and remains overgrown for 1 minute."],
				["65\u201368", "An object of the DM's choice disappears into the Ethereal Plane. The object must be neither worn nor carried, within 120 feet of the chosen point of origin, and no larger than 10 feet in any dimension. If there are no such objects in range, nothing happens."],
				["69\u201372", "Nothing happens at the chosen point of origin. Instead, you shrink as if you had cast *Enlarge/Reduce* on yourself and remain in that state for 1 minute."],
				["73\u201377", "Leaves grow from the creature nearest to the chosen point of origin. Unless they are picked off, the leaves turn brown and fall off after 24 hours."],
				["78\u201382", "Nothing happens at the chosen point of origin. Instead, a burst of colorful, shimmering light extends from you in a 30-foot Emanation. Each creature in the area must succeed on a DC 15 Constitution saving throw or have the Blinded condition for 1 minute. A creature repeats the save at the end of each of its turns, ending the effect on itself on a success."],
				["83\u201387", "Nothing happens at the chosen point of origin. Instead, you cast *Invisibility* on yourself."],
				["88\u201392", "Nothing happens at the chosen point of origin. Instead, a stream of 1d4 \xD7 10 gems, each worth 1 GP, shoots from the wand's tip in a Line 30 feet long and 5 feet wide toward the chosen point of origin. Each gem deals 1 Bludgeoning damage, and the total damage of the gems is divided equally among all creatures in the Line."],
				["93\u201397", "You cast *Polymorph*, targeting the creature closest to the chosen point of origin. Roll 1d4 to determine the target's new form. On a **1**, the new form is a **Black Bear**; on a **2**, the new form is a **Giant Wasp**; on a **3\u20134**, the new form is a **Frog**."],
				["98\u201300", "The creature closest to the chosen point of origin makes a DC 15 Constitution saving throw. On a failed save, the creature has the Restrained condition and begins to turn to stone. While Restrained in this way, the creature repeats the save at the end of its next turn. On a successful save, the effect ends. On a failed save, the creature has the Petrified condition instead of the Restrained condition. The petrification lasts until the creature is freed by the *Greater Restoration* spell or similar magic."],
			],
		],
		weight: 1,
		usages: 7,
		recovery: "Dawn",
		additional: "regains 1d6+1",
		toNotesPage: [{
			name: "Wand of Wonder",
			useDescriptionFull: function (str) {
				if (typePF) {
					str = str.replace("the *Greater Restoration* spell or ", "")
						.replace(
							/Nothing happens at the chosen point of origin. Instead, (\w)/ig,
							function (match, p1) { return p1.toUpperCase(); }
						)
						.replace(/the new form is a/ig, "a")
						.replace("a **Frog**.", "a **Frog** is the target's new form.");
				}
				return str.replace("isn't I", "isn't me");
			},
		}],
		fixedDC: 15,
		spellcastingBonus: [{
			name: "Random option",
			spells: ["darkness", "faerie fire", "fireball", "slow", "stinking cloud", "gust of wind", "lightning bolt", "enlarge/reduce", "invisibility", "polymorph"],
			selection: ["darkness", "faerie fire", "fireball", "slow", "stinking cloud", "gust of wind", "lightning bolt", "enlarge/reduce", "invisibility", "polymorph"],
			times: 10,
		}],
		spellChanges: {
			"darkness": {
				range: "120 ft",
				changes: "All *Wand of Wonder* spells have their range increased to 120 ft.",
			},
			"faerie fire": {
				range: "120 ft",
				changes: "All *Wand of Wonder* spells have their range increased to 120 ft.",
			},
			"stinking cloud": {
				range: "120 ft",
				changes: "All *Wand of Wonder* spells have their range increased to 120 ft.",
			},
			"gust of wind": {
				range: "S:120-ft line",
				description: "120 ft long, 10 ft wide line of wind; all in cast/end save or pushed 15 ft; Bns change direction; see B",
				changes: "All *Wand of Wonder* spells have their range increased to 120 ft.",
			},
			"lightning bolt": {
				range: "S:120-ft line",
				description: "120-ft long, 5-ft wide line all creatures 8d6+1d6/SL Lightning damage; save halves",
				changes: "All *Wand of Wonder* spells have their range increased to 120 ft.",
			},
			"enlarge/reduce": {
				range: "120 ft",
				description: "1 crea save or Enlarged: +1 size category, Adv on Str saves/checks, +1d4 weapon/unarmed dmg",
				changes: "The *Wand of Wonder* applies only the Enlarge effect from *Enlarge/Reduce* to a creature. All *Wand of Wonder* spells have their range increased to 120 ft.",
			},
			"enlarge/reduce-1-reduced": {
				range: "Self",
				save: false,
				firstCol: false,
				duration: "1 min",
				description: "I'm Reduced: -1 size category, Disadv on Str saves/checks, -1d4 weapon/unarmed dmg (min 1 dmg)",
				changes: "The *Wand of Wonder* applies the Reduce effect from *Enlarge/Reduce* to me and it lasts for 1 minute without requiring Concentration.",
			},
			"invisibility": {
				range: "Self",
				description: "I become Invisible; attacking, casting, or dealing damage ends the spell",
				changes: "The *Wand of Wonder* applies the *Invisibility* spell only to myself.",
			},
			"polymorph": {
				range: "120 ft",
				changes: "All *Wand of Wonder* spells have their range increased to 120 ft.",
			},
		},
	},
	"weapon": {
		name: "Weapon, +1, +2, or +3",
		source: [["SRD24", 253], ["DMG24", 324]],
		type: "Weapon (Any Simple or Martial)",
		magicItemTable: "Armaments",
		description: "Select one of the choices.",
		descriptionFull: "You have a bonus to attack and damage rolls made with this magic weapon. The bonus is determined by the weapon's rarity: Uncommon (+1), Rare (+2), or Very Rare (+3).",
		allowDuplicates: true,
		choices: ["+1 Weapon (Uncommon)", "+2 Weapon (Rare)", "+3 Weapon (Very Rare)"],
		"+1 weapon (uncommon)": {
			name: "Weapon +1",
			nameTest: /weapon \+1|\+1.+(weapon|\uFEFF)/i,
			rarity: "Uncommon",
			description: "I have a +1 bonus to attack and damage rolls made with this magic weapon.",
			allowDuplicates: true,
			chooseGear: {
				type: "weapon",
				prefixOrSuffix: ["between", "+1", "\uFEFF"],
				itemName1stPage: ["suffix", "+1"],
				descriptionChange: ["replace", "weapon"],
			},
		},
		"+2 weapon (rare)": {
			name: "Weapon +2",
			nameTest: /weapon \+2|\+2.+(weapon|\uFEFF)/i,
			rarity: "Rare",
			description: "I have a +2 bonus to attack and damage rolls made with this magic weapon.",
			allowDuplicates: true,
			chooseGear: {
				type: "weapon",
				prefixOrSuffix: ["between", "+2", "\uFEFF"],
				itemName1stPage: ["suffix", "+2"],
				descriptionChange: ["replace", "weapon"],
			},
		},
		"+3 weapon (very rare)": {
			name: "Weapon +3",
			nameTest: /weapon \+3|\+3.+(weapon|\uFEFF)/i,
			rarity: "Very Rare",
			description: "I have a +3 bonus to attack and damage rolls made with this magic weapon.",
			allowDuplicates: true,
			chooseGear: {
				type: "weapon",
				prefixOrSuffix: ["between", "+3", "\uFEFF"],
				itemName1stPage: ["suffix", "+3"],
				descriptionChange: ["replace", "weapon"],
			},
		},
	},
	"weapon of warning": {
		name: "Weapon of Warning",
		nameTest: /^(?=.*(weapon|\uFEFF))(?=.*warning).*$/i,
		source: [["SRD24", 253], ["DMG24", 324]],
		type: "Weapon (Any Simple or Martial)",
		rarity: "Uncommon",
		magicItemTable: "Armaments",
		attunement: true,
		description: [
			"While this magic weapon is within my reach, it grants the following benefits to me and my allies within 30 ft.",
			"***Alarm***. The weapon magically awakens us from nonmagical sleep when combat begins.",
			"***Supernatural Readiness***. We have Advantage on Initiative rolls.",
		],
		descriptionFull: [
			"As long as this weapon is within your reach and you are attuned to it, you and allies within 30 feet of you gain the following benefits.",
			"***Alarm***. The weapon magically awakens each subject who is sleeping naturally when combat begins. This benefit doesn't wake a subject from magically induced sleep.",
			"***Supernatural Readiness***. Each subject has Advantage on its Initiative rolls.",
		],
		chooseGear: {
			type: "weapon",
			prefixOrSuffix: ["prefix", "of Warning \uFEFF"],
			itemName1stPage: ["prefix", "of Warning"],
			descriptionChange: false,
			excludeCheck: function (inObjKey, inObj, v) {
				return !v.isSimpleOrMartial;
			},
		},
		advantages: [["Initiative", true]],
	},
	"well of many worlds": {
		name: "Well of Many Worlds",
		source: [["SRD24", 253], ["DMG24", 324]],
		type: "Wondrous Item",
		rarity: "Legendary",
		magicItemTable: "Arcana",
		description: "As a Magic action, I can unfold this black cloth and place it on a solid surface, whereupon it creates a two-way 6 ft diameter circular portal to another world or plane of the DM's choice. As a Magic action, a creature in 5 ft can fold it, closing the portal. Once used in this way, it can't do so again for 1d8 hours.",
		descriptionFull: [
			"This fine black cloth, soft as silk, is folded up to the dimensions of a handkerchief. It unfolds into a circular sheet 6 feet in diameter.",
			"You can take a Magic action to unfold the *Well of Many Worlds* and place it on a solid surface, whereupon it forms a two-way, 6-foot-diameter, circular portal to another world or plane of existence. Each time the item opens a portal, the DM decides where it leads. The portal remains open until a creature within 5 feet of it takes a Magic action to close it by taking hold of the edges of the cloth and folding it up.",
			"Once the *Well of Many Worlds* has opened a portal, it can't do so again for 1d8 hours.",
		],
		action: [["action", " (place/fold)"]],
		usages: 1,
		recovery: "1d8 h",
	},
	"wind fan": {
		name: "Wind Fan",
		source: [["SRD24", 253], ["DMG24", 325]],
		type: "Wondrous Item",
		rarity: "Uncommon",
		magicItemTable: "Arcana",
		description: "While holding this fan, I can cast *Gust of Wind* (save DC 13) from it. Each subsequent time the fan is used before the next dawn, it has a cumulative 20% chance of not working; if the fan fails to work, it tears into useless, nonmagical tatters.",
		descriptionFull: "While holding this fan, you can cast *Gust of Wind* (save DC 13) from it. Each subsequent time the fan is used before the next dawn, it has a cumulative 20 percent chance of not working; if the fan fails to work, it tears into useless, nonmagical tatters.",
		usages: 1,
		recovery: "Dawn",
		additional: "+20% to destroy for each use after first",
		fixedDC: 13,
		spellcastingBonus: [{
			name: "+20% to destroy per use",
			spells: ["gust of wind"],
			selection: ["gust of wind"],
		}],
	},
	"winged boots": {
		name: "Winged Boots",
		source: [["SRD24", 253], ["DMG24", 325]],
		type: "Wondrous Item",
		rarity: "Uncommon",
		magicItemTable: "Arcana",
		attunement: true,
		description: "These boots have 4 charges and regain 1d4 expended charges daily at dawn. As a Magic action while wearing the boots, I can expend 1 charge to gain a Fly Speed of 30 ft for 1 hour. If I am flying when the duration expires, I descend at a rate of 30 ft per round until I land.",
		descriptionFull: "These boots have 4 charges and regain 1d4 expended charges daily at dawn. While wearing the boots, you can take a Magic action to expend 1 charge, gaining a Fly Speed of 30 feet for 1 hour. If you are flying when the duration expires, you descend at a rate of 30 feet per round until you land.",
		usages: 4,
		recovery: "Dawn",
		additional: "regains 1d4",
		action: [["action", " (start)"]],
	},
	"wings of flying": {
		name: "Wings of Flying",
		source: [["SRD24", 253], ["DMG24", 324]],
		type: "Wondrous Item",
		rarity: "Rare",
		magicItemTable: "Arcana",
		attunement: true,
		description: "As a Magic action while wearing this cloak, I can turn it into a pair of wings on my back for 1 hour or until I end the effect as a Magic action. The wings give me a Fly Speed of 60 ft. If I am aloft when the wings disappear, I fall. When they disappear, I can't use them again for 1d12 hours.",
		descriptionFull: "While wearing this cloak, you can take a Magic action to turn the cloak into a pair of wings on your back. The wings lasts for 1 hour or until you end the effect early as a Magic action. The wings give you a Fly Speed of 60 feet. If you are aloft when the wings disappear, you fall. When the wings disappear, you can't use them again for 1d12 hours.",
		action: [["action", " (start/stop)"]],
		usages: 1,
		recovery: "1d12 h",
	},
};

Base_MagicItemsList["hammer of thunderbolts"] = function () {
	var obj = {
		name: "Hammer of Thunderbolts",
		source: [["SRD24", 224], ["DMG24", 265]],
		type: "Weapon (Maul or Warhammer)",
		rarity: "Legendary",
		magicItemTable: "Armaments",
		attunement: true,
		description: "Select one of the choices.",
		descriptionFull: [
			"You gain a +1 bonus to attack rolls and damage rolls made with this magic weapon.",
			"The weapon has 5 charges. You can expend 1 charge and make a ranged attack with the weapon, hurling it as if it had the Thrown property with a normal range of 20 feet and a long range of 60 feet. If the attack hits, the weapon unleashes a thunderclap audible out to 300 feet. The target and every creature within 30 feet of it other than you must succeed on a DC 17 Constitution saving throw or have the Stunned condition until the end of your next turn. Immediately after hitting or missing, the weapon flies back to your hand. The weapon regains 1d4 + 1 expended charges daily at dawn.",
			"***Giant's Bane***. While you are attuned to the weapon and wearing either a *Belt of Giant Strength* or *Gauntlets of Ogre Power* to which you are also attuned, you gain the following benefits:",
			" \u2022 **Giants' Bane**. When you roll a 20 on the d20 for an attack roll made with this weapon against a Giant, the creature must succeed on a DC 17 Constitution saving throw or die.",
			" \u2022 **Might of Giants**. The Strength score bestowed by your *Belt of Giant Strength* or *Gauntlets of Ogre Power* increases by 4, to a maximum of 30.",
		],
		usages: 5,
		recovery: "Dawn",
		additional: "regains 1d4+1",
		chooseGear: {
			type: "weapon",
			prefixOrSuffix: "prefix",
			itemName1stPage: ["prefix", "of Thunderbolts"],
			descriptionChange: false,
			excludeCheck: function (inObjKey, inObj, v) {
				return !v.isMeleeWeapon || !/maul|warhammer/i.test(v.baseWeaponName);
			},
		},
		calcChanges: {
			atkAdd: [
				function (fields, v) {
					if (!v.theWea.isMagicWeapon && v.isMeleeWeapon && /maul|warhammer/i.test(v.baseWeaponName) && /thunderbolts/i.test(v.WeaponTextName)) {
						v.theWea.isMagicWeapon = true;
						fields.Description += (fields.Description ? "; " : "") + "1 charge to throw (20/60 ft)";
						var knownIndex = CurrentMagicItems.known.indexOf("hammer of thunderbolts");
						if (knownIndex === -1) return;
						var activeChoice = CurrentMagicItems.choices[knownIndex];
						if (activeChoice && MagicItemsList["hammer of thunderbolts"][activeChoice].scoresOverride) {
							fields.Description += "; On 20 to hit Giant: DC 17 Con save or die";
						};
					};
				},
				'If I include the word "Thunderbolts" in the name of a Maul or Warhammer, it will be treated as the magic weapon Hammer of Thunderbolts. It adds +1 to hit and damage, but also bears a curse.',
			],
			atkCalc: [
				function (fields, v, output) {
					if (v.isMeleeWeapon && /maul|warhammer/i.test(v.baseWeaponName) && /thunderbolts/i.test(v.WeaponTextName)) {
						output.magic = v.thisWeapon[1] + 1;
					};
				}, "",
			],
		},
		selfChoosing: function () {
			var returnValue = "Not attuned to Gauntlets of Ogre Power or Belt of Giant Strength";
			var strOverride = 0;
			for (var i = 0; i < CurrentMagicItems.known.length; i++) {
				if (CurrentMagicItems.known[i] !== "belt of giant strength" && CurrentMagicItems.known[i] !== "gauntlets of ogre power") continue;
				if (!isMagicItemAttuned(i)) continue; // not attuned
				var oItem = MagicItemsList[CurrentMagicItems.known[i]];
				if (oItem && oItem.choices) {
					oItem = oItem[CurrentMagicItems.choices[i]];
				};
				if (oItem && oItem.scoresOverride[0] > strOverride) {
					strOverride = oItem.scoresOverride[0];
					returnValue = "Attuned to " + oItem.name;
				};
			};
			return returnValue.toLowerCase();
		},
		choices: [
			"Not attuned to Gauntlets of Ogre Power or Belt of Giant Strength",
			"Attuned to Gauntlets of Ogre Power",
		],
		"not attuned to gauntlets of ogre power or belt of giant strength": {
			name: "Hammer of Thunderbolts\uFEFF",
			nameTest: "of Thunderbolts\uFEFF",
			description: "This +1 weapon has 5 charges and regains 1d4+1 at dawn. I can expend 1 charge to make it Thrown (20/60 ft) and Returning for 1 attack. If that attack hits, it unleashes a thunderclap audible out to 300 ft and all within 30 ft of the target need to make a DC 17 Con save or be Stunned until the end of my next turn.",
		},
		"attuned to gauntlets of ogre power": {
			name: "Hammer of Thunderbolts (Ogre)",
			nameTest: "of Thunderbolts (Ogre)",
			description: "This +1 weapon has 5 charges and regains 1d4+1 at dawn. I can expend 1 charge to make it Thrown (20/60 ft) and Returning for 1 attack. If that hits, it's audible out to 300 ft and all within 30 ft " + (typePF ? "" : "must make a ") + "DC 17 Con save or be Stunned until the end of my next turn. On a 20 to hit vs Giant: " + (typePF ? "" : "must make a ") + "DC 17 Con save or die. My Strength is 23.",
			scoresOverride: [23, 0, 0, 0, 0, 0],
			prerequisite: "Requires Attunement with Gauntlets of Ogre Power",
			prereqeval: function (v) {
				var knownIdx = CurrentMagicItems.known.indexOf("gauntlets of ogre power");
				return isMagicItemAttuned(knownIdx);
			},
		},
	};
	var oBelt = Base_MagicItemsList["belt of giant strength"];
	if (oBelt) {
		var sBaseDescription = obj["attuned to gauntlets of ogre power"].description.replace("My Strength is 23.", "My Strength is ");
		oBelt.choices.forEach(function (beltChoice) {
			var beltChoiceLC = beltChoice.toLowerCase();
			var oChoice = oBelt[beltChoiceLC];
			var sGiant = beltChoice.replace(/ giant.*/i, "");
			var sChoice = "Attuned to " + oChoice.name;
			var sChoiceLS = sChoice.toLowerCase();
			var iOverride = Math.min(oChoice.scoresOverride[0] + 4, 30);
			obj.choices.push(sChoice);
			obj[sChoiceLS] = {
				name: "Hammer of Thunderbolts (" + sGiant + ")",
				nameTest: "of Thunderbolts (" + sGiant + ")",
				description: sBaseDescription + iOverride + ".",
				scoresOverride: [iOverride, 0, 0, 0, 0, 0],
				prerequisite: "Requires Attunement with " + oChoice.name,
			};
			// The prerequisite function requires a dynamic reference, so use eval
			eval([
				"obj[sChoiceLS].prereqeval = function () {",
				'var knownIdx = CurrentMagicItems.choices.indexOf("' + beltChoiceLC + '");',
				"return knownIdx !== -1 && CurrentMagicItems.known[knownIdx] === 'belt of giant strength' && isMagicItemAttuned(knownIdx);",
				"}",
			].join("\n"));
		});
	}
	return obj;
}();
