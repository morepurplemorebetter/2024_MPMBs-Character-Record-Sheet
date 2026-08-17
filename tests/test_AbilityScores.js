/*
Types of ability score increases:
// types 1-3 do apply to everything but `MagicItemsList` objects
1. One-time, up to maximum 20, not by a magic item (`MagicItemsList` are type 4)
	As no `scoresMaximum` is defined, the sheet will assume a maximum of 20.
	If another maximum is needed, use type 2.

		scores: [2, 0, 2, 0, 0, 0],
		scoresMaximum: undefined,
		scoresMaxLimited: undefined,

2. One-time and a change to the maximum, not by a magic item (`MagicItemsList` are type 5)
	5e (2014) does this, but 5.5e (2024) abandoned the practice of a separate maximum.
	In 5.5e (2024), everything is worded as "increases by X, up to a maximum of Y",
	which is type AA.
	Examples are the Primal Champion barbarian feature and the Manual/Tomes magic items.
	These should add their full amount and alter the maximum to their set value.
	The same as type 1, but with a `scoresMaximum` defined.

		scores: [2, 0, 2, 0, 0, 0],
		scoresMaximum: [24, 0, "+2", 0, 0, 0],
		scoresMaxLimited: undefined,

3. One-time, up to a maximum above 20, not by a magic item (`MagicItemsList` are type AA)
	`isSpecial === "limited"`
	For these, the max should only increase to the height of the new total,
	up to the given maximum.
	The increase has to be lowered if the max would otherwise be surpassed.
	Thus, the order in which this happens matters. At the time of the increase,	the total
	(without overrides or ongoing magic items) is used to determine the increase and max.

		scores: [2, 0, 2, 0, 0, 0],
		scoresMaximum: undefined,
		scoresMaxLimited: [22, 0, "+2", 0, 0, 0],

// types 4-6 apply only to `MagicItemsList`
4. Ongoing, up to maximum 20, only applicable to magic items (others are type 1)
	`isSpecial` will be set to `"ongoing"`
	Magic Items can do this exclusively. They don't apply their bonus when they are taken,
	but instead are calculated dynamically as if they are the last bonus to add.
	Thus, the effective bonus depends on other applicable bonuses.
	These go in a separate column that can't be manually altered, as its total is calculated
	after every change.

	As no `scoresMaximum` is defined, the sheet will assume a maximum of 20.
	If another maximum is needed, use type 5.

		scores: [2, 0, 2, 0, 0, 0],
		scoresMaximum: undefined,
		scoresMaxLimited: undefined,

5. Ongoing, up to maximum above 20, only applicable to magic items (others are type 2)
	`isSpecial` will be set to `"ongoing"`
	Their maximum isn't added to the normal list of maximums (type 2 & 6), 
	because it is only applicable to this one increase.
	This should only be done by automation, so these go into a column that users can't change
	and that is updated when the effective value changes.
	These go in a separate column that can't be manually altered, as its total is calculated
	after every change.

	The same as type 5, but with a `scoresMaximum` defined.

	MagicItemsList.x = {
		scores: [2, 0, 2, 0, 0, 0],
		scoresMaximum: [24, 0, "+2", 0, 0, 0],
		scoresMaxLimited: undefined,
	}

6. One-time, up to a maximum above 20, by a magic item (others are type 3)
	`isSpecial === "limited"`
	This works identical to type 3, but when the item is selected, the user will be
	prompted if the change should be applied or not, as the item might be a consumable.
	When the magic item is removed, the user will be prompted if the change should
	remain despite the item being removed.

		scores: [2, 0, 2, 0, 0, 0],
		scoresMaximum: undefined,
		scoresMaxLimited: [22, 0, "+2", 0, 0, 0],

	It can be made stackable, meaning that the ability score increase can stack with itself
	if the item is selected multiple times. Set the following attribute to do so.
		scoresStackable: true,

// types 7-8 are options without the `scores` attribute
7. Maximum (no `scores` defined)
	`isSpecial === "maximums"`
	Only adds a new maximum, which will be the new maximum if it is the highest.
	No official content does this.
	Note that defining 

		scores: undefined,
		scoresMaximum: [24, 0, "+2", 0, 0, 0],
		scoresMaxLimited: undefined,

8. Override (works independent from other scores attribute)
	`isSpecial === "overrides"`
	The stat will be either its calculated total, or the override, whichever is higher.
	Nothing stacks with the override (change in v14.0.12/v24.0.12).
	This attribute is processed separately from the other "scores" attributes.
	The presence or absence of the `scoresOverride` attribute doesn't conflict with others
	and they can be used together in one object.

		scoresOverride: [21, 0, 0, 0, 0, 0],

CALCULATION
1. Add all the increases together except those from type 4 & type 5.
2. Limit this total by the set maximum, except those from type 4 & type 5.
3. Add the increases from type 4 & type 5 while taking each's own maximum into account.
	These need to be processed in order from lowest to highest maximum.
	And they don't take any other maximum into account, thus they can improve the total
	above the displayed maximum.
4. Apply overrides.

See _functions/AbilityScores.js
*/
var iFileName = "test_AbilityScores.js";
FeatsList["ability score tester"] = {
	name: "Ability Score Tester",
	source: [["HB", 0]],
	descriptionFull: "The types of ability scores that can't be accomplished with a magic item.",
	allowDuplicates: true,
	choices: ["type 1", "type 2", "type 3"],
	"type 1": {
		description: "One-time ability score increase, up to max 20. If this would be done by a MagicItemsList object, it would be type 4.",
		scores: [-2, 0, 0, 2, 0, 0],
	},
	"type 2": {
		description: "One-time and a change to the max (legacy). 5e (2014) does this, but 5.5e (2024) abandoned this practice. If this would be done by a MagicItemsList object, it would be AA type 4.",
		scores: [2, -2, 2, 0, 2, 2],
		scoresMaximum: [22, 0, "+2", 0, 17, "-2"],
	},
	"type 3": {
		description: "One-time ability score increase, up to max above 20. If this would be done by a MagicItemsList object, it will cause a pop-up asking if they want to apply the stat change and another pop-up when removing the magic item asking if the stat change should remain despite the item not remaining.",
		scores: [2, -2, 2, 0, 2, 2],
		scoresMaxLimited: [22, 0, "+2", 0, 17, "-2"],
	},
};
MagicItemsList["ability score tester"] = {
	name: "Ability Score Tester",
	source: [["HB", 0]],
	descriptionFull: "The types of ability scores, except those that can't be accomplished with a MagicItemsList object.",
	allowDuplicates: true,
	choices: ["type 4", "type 5", "type 6", "type 6 (stackable)", "type 7", "type 8","legacy function"],
	"type 4": {
		description: "Ongoing ability score increase, up to max 20. If this would be done by something else than a MagicItemsList object, it would be type 1.",
		scores: [-2, 0, 0, 2, 0, 0],
	},
	"type 5": {
		description: "Ongoing ability score increase, up to max above 20. If this would be done by something else than a MagicItemsList object, it would be type 3.",
		scores: [2, -2, 2, 0, 2, 2],
		scoresMaximum: [22, 0, "+2", 0, 17, "-2"],
	},
	"type 6": {
		description: "One-time ability score increase. This causes a pop-up asking to apply these changes when the item is selected, unless it was applied before. When the item is removed, another pop-up will ask if the changes should remain despite the item being removed. If this wasn't a magic item, there would be no pop-up dialogs, the changes would just be applied/removed.",
		scores: [2, -2, 2, 0, 2, 2],
		scoresMaxLimited: [22, 0, "+2", 0, 17, "-2"],
	},
	"type 6 (stackable)": {
		description: "One-time ability score increase, stackable with itself. This causes a pop-up asking to apply these changes when the item is selected, even if it was applied before. When the item is removed, another pop-up will ask if the changes should remain despite the item being removed. If this wasn't a magic item, there would be no pop-up dialogs, the changes would just be applied/removed.",
		scores: [2, -2, 2, 0, 2, 2],
		scoresMaxLimited: [22, 0, "+2", 0, 17, "-2"],
		scoresStackable: true,
	},
	"type 7": {
		description: "Only add a new maximum, no ability score increases. This will be the new maximum if it is the highest.",
		scoresMaximum: [24, 0, "+2", 0, 17, "-2"],
	},
	"type 8": {
		description: "Override. The stat will be either its calculated total, or the override, whichever is higher.",
		scoresOverride: [21, 0, 0, 0, 0, 0],
	},
	"legacy function": {
		description: "For backwards compatibility, a document-level function was made of the `MagicItemsList['manual of bodily health'].applyStatBonus` function. It does what the old one did while using the new syntax.",
		eval: function () {
			recurringItemApplyLegacy("Manual of Gainful Exercise", "Strength", 2);
		},
	},
};