/*	-WHAT IS THIS?-
	The script featured here is an explanation of how to make your own custom addition to MPMB's D&D 5e Character Tools.
	To add your own content to the Character Sheet, use the syntax below and save it in a file.
	You can then import this file directly to the sheet using the "Import" button and "Import/Export" bookmark.
	There you can either import the file as a whole or just copy the text into a dialogue.

	-KEEP IN MIND-
	Note that you can add as many custom codes as you want, either by importing consecutive files or pasting the scripts into the dialogue.
	It is recommended to enter the code in a freshly downloaded sheet or to first reset sheet.
	Thus you don't run the risk of things that have already been filled out causing conflicts.

	-HOW TO READ-
	Every line comes with a comment immediately after it to show whether it is // Optional // or // Required //,
	followed by a more explanatory comment

	-THIS IS JAVASCRIPT-
	The imports scripts work by creating a new entry inside an existing object or by calling functions.
	You can create new or overwrite existing global variables by omitting 'var'.
	You will need to understand the basics of JavaScript variables: strings, arrays, and JSON objects.
	Note that every opening symbol must have its closing counterpart: (), {}, [], "", ''.
	If these are not present, the code will give an error when imported.
	Use proper editing software for code (like Notepad++). Text processors like Microsoft Word will screw up your code.
	To help finding syntax errors, use (online) code checking software like https://jshint.com

	-COMMENTS IN THE EXAMPLE-
	Anything on a line after two forward slashes is a comment and will be ignored when running the code.
	Multiline comments are possible. Open them using the forward slash followed by an asterisk and close them with the opposite.
	The below contains a lot of these comments. The comments are not necessary for the script to work, so feel free to remove them.
*/

/*	-INFORMATION-

	Subject:	Species (race)

	Effect:		This is the syntax for adding a new species to the sheet.
				In the code of the sheet, species are still called races, hence the RaceList object.

	Remarks:  - You will also need the syntax for common attributes if you want the species to do
				anything besides populating the Racial Traits section, see "_common attributes.js".
			  - You will also need the syntax for adding a lineage, ancestry, variant, or subrace
				if you want the species to offer a choice between different versions of itself,
				such as the lineages of the Elf or the draconic ancestries of the Dragonborn,
				see "species lineage, ancestry, variant, subrace (RaceSubList).js".
			  - You will also need the syntax for adding a source if you want the species to
				have a source that doesn't yet exist in the sheet, see "source (SourceList).js".

	Sheet:		v24.2.0 and above (PHB'24)
*/

var iFileName = "Homebrew Syntax - RaceList.js";
/* 	iFileName // OPTIONAL //
	TYPE:	string
	USE:	how the file will be named in the sheet if you import it as a file

	Note that this is a variable called 'iFileName'.
	Variables invoked inside an import script will not be available after importing.
	However, if you invoke the variable without the 'var', it will be available after importing.

	This doesn't have to be the same as the actual name of the file.
	This doesn't need to have the .js file extension.
	Only the first occurrence of this variable will be used.
*/

RequiredSheetVersion("24.2.0");
/*	RequiredSheetVersion // OPTIONAL //
	TYPE:	function call with one variable, a string or number
	USE:	the minimum and maximum versions of the sheet required for the add-on script to work
	CHANGE: v14.0.5 (added second parameter: upper version limit)

	If this script is imported into a sheet with an lower or higher version than given here,
	the player will be given a warning.

	This function takes two variables, but only the first is required:
	1. The minimum required version number.
	   The sheet's version needs to be the same number or higher.
	   This first parameter is required.

	2. The upper version number limit.
	   The sheet's version needs to be a lower number.
	   This second parameter is optional.

	Each variable can be input as a string with the full semantic version (e.g. "14.0.5"
	or "24.0.4-beta+25011209"), or a number that the sheet will translate to a semantic
	version. See the examples below for how the sheet does this.

	INPUT NUMBER	SEMANTIC VERSION
		14  			14.0.0
		24.1			24.1.0

	You can find the full semantic version of the sheet at the bottom of every page,
	or look at the "Get Latest Version" bookmark, which lists the version number,
	or go to File >> Properties >> Description, where the version is part of the document title.
*/

RaceList["purple catfolk"] = {
/* 	RaceList object name // REQUIRED //
	TYPE:	string (lowercase)
	USE:	object name of the species as it will be used by the sheet

	By adding a new object to the existing RaceList object, we create a new species.
	The object name here is 'purple catfolk'. You can use any object name as long as it is not already in use.
	If you do use an object name that is already in use, you will be overwriting that object.
	Note the use of only lower case! Also note the absence of the word "var" and the use of brackets [].

	The object name of the species is used by other things to refer to the species,
	for example `CurrentRace.known === "purple catfolk"` or the `AddSubRace()` function
	(see "species lineage, ancestry, variant, subrace (RaceSubList).js").
	Because of this, you shouldn't change the object name after publishing your script.
*/
	name: "Purple Catfolk",
/*	name // REQUIRED //
	TYPE:	string
	USE:	name of the species as it will be used by the sheet

	This name is used in tooltips, pop-up dialogs, and the Source Selection dialog,
	and to refer to the species from other parts of the sheet (e.g. limited features or bonus spells).
	It is also used in the drop-down of the Species field, unless the `sortname` attribute is
	present, see below.

	The length of this name is also used to determine which species to use if multiple
	species match the text in the Species field, see `regExpSearch` below.
*/
	sortname: "Catfolk, Purple",
/*	sortname // OPTIONAL //
	TYPE:	string
	USE:	name of the species as it will be shown in the drop-down of the Species field

	This name will only be used to display the species in the drop-down of the Species field.
	This attribute is not used to recognize the species.
	If this attribute is not present, the `name` is used instead, converted to title case.

	Make sure that the `regExpSearch` matches this name as well, otherwise selecting the
	species from the drop-down will not result in the species being recognized.
*/
	regExpSearch: /^(?=.*purple)(?=.*(cat|feline)).*$/i,
/*	regExpSearch // REQUIRED //
	TYPE:	regular expression
	USE:	used to match the text in the Species field to see if this species is present

	This has to be a match for the `name` (and `sortname`, if present) given earlier,
	or the species will never be recognized.
	Now it looks for any entry that has both the word "purple" and the word "cat" or "feline" in it,
	disregarding capitalization or word order.
	If this looks too complicated, or you want to match only a single word, just write:
		regExpSearch: /catfolk/i,

	Diacritics are removed from the text in the Species field before testing this regular
	expression, so don't use them in it (e.g. use a plain "e" instead of an "e" with an accent).

	If multiple species match the text in the Species field, the sheet will use the one
	with the longest `name`. If those are equal, it will use the one with the newest source.

	Be careful not to make the `regExpSearch` match too broadly.
	For example, the Elf uses the following, so that it matches "Elf", "Elves", and "Elven",
	but not words that only contain those letters, like "Shelf":
		regExpSearch: /elf\b|elves\b|elv(ish|en)\b/i,

	If the species has variants (see `variants` below), the text in the Species field is also
	tested against the `regExpSearch` of those variants.
	See the "species lineage, ancestry, variant, subrace (RaceSubList).js" file for how that works.
*/
	source: ["HB", 0],
	source: [["SRD24", 84], ["PHB24", 187]],
/*	source // REQUIRED //
	TYPE:	array with two entries (or array of these arrays)
	USE:	define where the species is found

	This attribute is used by the sheet to determine if the species should be available depending on the sources included and excluded.

	This array has two entries, a string followed by a number
	1. string
		The first entry has to be the object name of a SourceList object.
	2. number
		The second entry is the page number to find the species at.
		This can be any number and is ignored if it is a 0.

	See the "source (SourceList).js" file for learning how to add a custom source.

	Alternatively, this can be an array of arrays to indicate it appears in multiple sources.
	The example above says something appears on both page 84 of the System Reference Document v5.2 and
	on page 187 of the 2024 Player's Handbook.

	If a species is completely homebrew, or you don't want to make a custom source, just put the following:
		source: ["HB", 0],
	"HB" refers to the 'homebrew' source.

	The source is also displayed in the tooltip of the Racial Traits field.
*/
	defaultExcluded: true,
/*	defaultExcluded // OPTIONAL //
	TYPE:	boolean
	USE:	whether this species should be excluded by default (true) or included by default (false)

	Include this attribute and set it to true if the species should appear in the Excluded list of the
	Source Selection Dialog when the script is added for the first time.
	It will have to be manually set to be included before it is used by the sheet's automation.
	The user will be made aware of this exclusion.

	Note that if a species is excluded, none of its variants will be accessible either.

	This is useful for optional species that you wouldn't normally want to use (e.g. playtest or campaign-specific).

	Setting this attribute to false is the same as not including this attribute.
*/
	plural: "Purple catfolk",
/*	plural // REQUIRED //
	TYPE:	string
	USE:	name of the species when used in the plural form

	This is used in the tooltips of the Size, Age, Height, and Weight fields,
	see the attributes by the same names below.
	For example, "Purple catfolk stand about 5 ft tall" or "Purple catfolk reach adulthood ...".
	Make sure it starts with a capital letter, as it is the start of a sentence.
*/
	size: 3,
	size: [3, 4],
/*	size // REQUIRED //
	TYPE:	number or array of numbers
	USE:	set the Size Category drop-down box on the 1st page

	This can be either a:
	1) Number
		The number corresponding to the size category of the species (see table below).
	2) Array
		If the species can be several different size categories, using an array will allow the
		player to choose which one to use.
		Add the numbers corresponding to the size categories of the species (see table below) to the array.
		The second example above will prompt the player to select either Medium or Small
		when the species is selected.

	The numbers correspond to the following size categories:
		0	Gargantuan
		1	Huge
		2	Large
		3	Medium
		4	Small
		5	Tiny

	The size category affects the carrying capacity on the 2nd page.
*/
	trait: "Purple Catfolk\n\u25C6 Cat's Claws. My claws are natural weapons that deal 1d6 + Str mod Slashing damage.",
	trait: [
		"**Purple Catfolk**",
		"##\u25C6 Cat's Claws##. My claws are natural weapons that deal 1d6 + Str mod Slashing damage. I have a Climb Speed equal to my Speed.",
		"##\u25C6 Feline Agility## (level 3). When I move on my turn, I can double my Speed until the end of the turn. I can do this once per Short Rest.",
		"##\u25C6 Purple Haze##. I know the *Minor Illusion* cantrip. Int, Wis, or Cha is my spellcasting ability for it (choose when selecting the species).",
	],
/*	trait // REQUIRED //
	TYPE:	string or array of strings
	USE:	the text to be filled in the Racial Traits field on the 2nd page
	CHANGE:	v14.2.0 (array input joined by carriage return "\r")

	This is the description of all the traits of the species.
	Note that the sheet normally uses the first person for this.
	Make sure that this description is not too long and fits in the Racial Traits field.
	The Printer Friendly sheets have less space for this than the Colourful versions,
	so use the Printer Friendly sheets to test if the description fits.

	If this is a string, you can use "\n" for a line break, as in the first example above.
	If this attribute is an array, the sheet will join it with a carriage return "\r",
	as in the second example above.

	If the sheet is set to use the metric system, the sheet will convert the units in
	this description to metric when it is added.

	FORMATTING CHARACTERS (since v14.0.0)
	Regardless if you use a string or an array, the `trait` can be formatted using the
	Rich Text formatting characters. Text between these formatting characters will be
	displayed differently. The formatting characters are as follows:
		*text*   = italic
		**text** = bold
		_text_   = underlined [doesn't work in tooltips/pop-ups]
		~text~   = strikethrough [doesn't work in tooltips/pop-ups]
		#text#   = Header 1:
		           - bold and theme color (Colourful)
		           - bold and 15% size increase (Printer Friendly)
		##text## = Header 2:
		           - italic, bold, and theme color (Colourful)
		           - italic and bold (Printer Friendly)

	The species' traits in the sheet start with the name of the species in bold, followed by
	each trait on its own line, starting with a diamond (\u25C6 = ◆) and the name of the
	trait as Header 2, as in the second example above.
*/

/*
	>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
	>>> Age, Height, and Weight >>>
	>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

	The next five attributes are only used for the tooltips of the Age, Height, and Weight fields.
	Each is a string that is added directly after the `plural` attribute, so it has to start with a space.

	For example, the `age` below results in the tooltip:
		"Purple Catfolk reach adulthood around age 15 and live about 80 years"

	These are not part of the 5.5e (2024) rules. The built-in SRD species in the
	sheet use the age, height, and weight from the 5e (2014) rules, if available.
*/
	age: " reach adulthood around age 15 and live about 80 years",
/*	age // OPTIONAL //
	TYPE:	string
	USE:	the text to use for the tooltip of the Age field, preceded by the `plural`
*/
	height: " are about 4-6 ft tall (4'4\" + 2d10\")",
/*	height // OPTIONAL //
	TYPE:	string
	USE:	the text to use for the tooltip of the Height field, preceded by the `plural`

	This is used if the sheet is set to the imperial system, or if the `heightMetric`
	attribute is not present, see below.
*/
	weight: " weigh around 120 lb (90 + 2d10 \xD7 2d4 lb)",
/*	weight // OPTIONAL //
	TYPE:	string
	USE:	the text to use for the tooltip of the Weight field, preceded by the `plural`

	This is used if the sheet is set to the imperial system, or if the `weightMetric`
	attribute is not present, see below.
*/
	heightMetric: " are about 130-180 cm tall (132 + 5d10 cm)",
/*	heightMetric // OPTIONAL //
	TYPE:	string
	USE:	the text to use for the tooltip of the Height field when using the metric system, preceded by the `plural`

	This is used if the sheet is set to the metric system, or if the `height` attribute
	is not present, see above.
	Note that the sheet does not convert the `height` attribute to metric, so you need
	this attribute if you want the tooltip to use metric units.
*/
	weightMetric: " weigh around 55 kg (40 + 5d10 \xD7 4d4 / 10 kg)",
/*	weightMetric // OPTIONAL //
	TYPE:	string
	USE:	the text to use for the tooltip of the Weight field when using the metric system, preceded by the `plural`

	This works identical to `heightMetric`, but for the Weight field.
*/

/*
	>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
	>>> Speed, Senses, and Languages >>>
	>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

	The attributes in this section are all common attributes.
	They work identical to the attributes of the same name in the "_common attributes.js" file.
	Please look there for a complete explanation of what you can enter.

	They are listed here because almost every species uses them.
	All other common attributes can also be used in this object, see "Common Attributes" below.
*/
	speed: {
		walk: { spd: 30, enc: 20 },
		climb: { spd: "walk", enc: "walk" },
	},
/*	speed // RECOMMENDED // but OPTIONAL
	TYPE:	object (optional attributes)
	USE:	add or edit speed mode(s) on the 1st page

	This works identical to the `speed` attribute found in the "_common attributes.js" file.

	Although this attribute is optional, almost every species has it, as the Speed field on the
	1st page will otherwise be empty unless something else (e.g. a class feature) sets a speed.
*/
	vision: [["Darkvision", 60]],
/*	vision // OPTIONAL //
	TYPE:	array (variable length)
	USE:	add string to the "Senses" field on the 1st page

	This works identical to the `vision` attribute found in the "_common attributes.js" file.
*/
	languageProfs: ["Common", 2],
/*	languageProfs // OPTIONAL //
	TYPE:	array (variable length)
	USE:	add language proficiencies

	This works identical to the `languageProfs` attribute found in the "_common attributes.js" file.

	DEFAULT LANGUAGES
	In the 5.5e (2024) rules, a character knows Common and two other languages of their choice,
	regardless of their species. As the sheet has no other place to add these languages,
	it adds them with the species.
	If this attribute is not present, the sheet will set it to the following:
		languageProfs: ["Common", 2],
	So you only need this attribute if the species should grant different languages.
	Note that this attribute replaces the default, so include "Common" and the free choices
	if the character should still get those.
*/

/*
	>>>>>>>>>>>>>>>>>>>>>>>
	>>> Ability Save DC >>>
	>>>>>>>>>>>>>>>>>>>>>>>
*/
	abilitySave: 6,
	abilitySave: [4, 5, 6],
/*	abilitySave // OPTIONAL //
	TYPE:	number or array of numbers corresponding to the ability score (1 = Str, 2 = Dex, 3 = Con, 4 = Int, 5 = Wis, 6 = Cha)
	USE:	the ability score to use for the Ability Save DC on the 1st page and for the species' spells

	This attribute does two things:
	1. It tells the sheet which ability score to use to calculate the Ability Save DC that
	   is displayed on the 1st page.
	   The sheet can display two Ability Save DCs on the 1st page.
	   If the character has more than two (multiclassing, species), the sheet will prioritise
	   the ability scores that are not used for spellcasting, as the save DC of
	   spellcasting is already displayed on the spell sheet pages.
	2. If the species is a spellcaster, this ability score is used as its spellcasting ability,
	   unless the species also has the `spellcastingAbility` attribute.
	   See the `spellcastingAbility` attribute in the "_common attributes.js" file.

	Leave this attribute out if the species has no traits that require a saving throw besides spells.
	If a species has spellcasting, but no other traits that require saving throws, use only the
	`spellcastingAbility` attribute, see "_common attributes.js".
*/
	abilitySaveAlt: 2,
/*	abilitySaveAlt // OPTIONAL //
	TYPE:	number corresponding to the ability score (1 = Str, 2 = Dex, 3 = Con, 4 = Int, 5 = Wis, 6 = Cha)
	USE:	an alternative ability score to use for the Ability Save DC on the 1st page

	Use this if the species offers a choice between two ability scores to determine the save DC.
	The sheet will use whichever is highest, the ability score set with `abilitySave`
	or the one set with this attribute.

	This attribute does nothing if the `abilitySave` attribute is not present.
	This attribute doesn't affect the spellcasting ability of the species.
*/

/*
	>>>>>>>>>>>>>>>>>>>>>>>
	>>> Species Features >>>
	>>>>>>>>>>>>>>>>>>>>>>>
*/
	features: {
/*	features // OPTIONAL //
	TYPE:	object with objects
	USE:	the traits of the species that are level-dependent or need to do something separately

	Each attribute of this object is a species feature, which is in itself an object.
	You can add as many species features as you want.

	A species feature doesn't add any text to the sheet, as the description of all the
	traits is already in the `trait` attribute, see above.
	Use a species feature for a trait that:
		- is gained at a higher level (e.g. the Dragonborn's Draconic Flight at level 5),
		- has limited uses (e.g. the Orc's Relentless Endurance), or
		- should show its name in the tooltip of the things it adds to the sheet.
		- are likely to be changed by a lineage, ancestry, variant, or subrace.
	Things that the species grants from level 1 and that don't have limited uses can also be
	added directly to the species object as common attributes, see "Common Attributes" below.
	However, it is recommended to add things gained at level 1 in a feature with `minlevel: 1,`
	so that it can be easily removed by a subrace if necessary.

	The sheet applies the species features whenever the character level changes,
	adding those with a `minlevel` equal to or lower than the character level
	and removing those with a higher `minlevel`.
*/
		"feline agility": {
	/* 	species feature object name // REQUIRED //
		TYPE:	string (lowercase)
		USE:	object name of the feature as it will be used by the sheet

		The object name of each feature is not displayed anywhere by default,
		it is used by the sheet to refer to the feature.

		Note the use of only lower case!

		Variants of the species can replace or remove features by using the same object name,
		see "species lineage, ancestry, variant, subrace (RaceSubList).js".
	*/
			name: "Feline Agility",
		/*	name // REQUIRED //
			TYPE:	string
			USE:	name of the species feature as it will be used by the sheet

			This name is used for the entry in the Actions and Limited Features section
			(unless the `limfeaname` common attribute is present) and in the tooltips of
			the things that the feature adds to the sheet.
		*/
			source: [["HB", 0]],
		/*	source // OPTIONAL //
			TYPE:	array with two entries (or array of these arrays)
			USE:	define where the species feature is found

			This works identical to the `source` attribute of the species, see above.
			Add this if the feature is found in a different source or on a different page
			than the species.
		*/
			minlevel: 1,
		/*	minlevel // OPTIONAL //
			TYPE:	number
			USE:	the character level at which the feature is gained

			Note that this is the character level, not a class level.
			If this attribute is not present, the feature is gained at level 1.
		*/
			usages: 1,
			recovery: "short rest",
		/*	COMMON ATTRIBUTES (inside species feature)
			A species feature can have any of the attributes from the "_common attributes.js" file.
			The `usages` and `recovery` attributes above are examples of those, which add an entry
			to the Limited Features section on the 1st page.

			Level-dependent common attributes, like a `usages` with an array of 20 entries,
			use the character level, not a class level.
		*/
		},
		"purple haze": {
			name: "Purple Haze",
			minlevel: 3,
			spellcastingBonus: [{
				name: "Purple Haze",
				spells: ["silent image"],
				selection: ["silent image"],
				firstCol: "oncelr",
			}],
		},
	},

/*
	>>>>>>>>>>>>>>>>>>>>>>>>>
	>>> Common Attributes >>>
	>>>>>>>>>>>>>>>>>>>>>>>>>

	You can have the species affect different parts of the sheet like adding proficiencies,
	adding spellcasting abilities, actions, limited features, etc. etc.

	See the "_common attributes.js" file for documentation on how to do those things and more.
	All attributes in there can directly be added in this object.
	These are applied from level 1, as if the species object is a species feature with `minlevel: 1`.

	ABILITY SCORES
	In the 5.5e (2024) rules, a species doesn't grant ability score improvements, as those come from
	the background instead. Because of this, the sheet ignores the `scores` and `scorestxt`
	common attributes when used directly in the species object.
	If you want the species to grant an ability score improvement regardless, add the
	`scores` common attribute to a species feature instead.
*/
	weaponsAdd: ["Claws"],
	spellcastingAbility: [4, 5, 6],

/*
	>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
	>>> Variants of a Species >>>
	>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
*/
	variants: ["lavender", "violet"],
	variants: [],
/*	variants // OPTIONAL //
	TYPE:	array of strings (variable length)
	USE:	the RaceSubList entries that are variants of this species (e.g. lineages, ancestries, or subraces)

	Each entry is the part of the object name of the RaceSubList entry that comes after the
	object name of this species and a hyphen, in lowercase.
	For example, the first example above refers to the RaceSubList entries
	"purple catfolk-lavender" and "purple catfolk-violet".
	See the "species lineage, ancestry, variant, subrace (RaceSubList).js" file for how to add a variant.

	IMPORTANT
	Do not list variants here that are added using the `AddSubRace()` function!
	The `AddSubRace()` function will add the variant to this array by itself,
	and will even create this attribute if it doesn't exist.
	As using the `AddSubRace()` function is the recommended way to add a variant,
	you will normally want to leave this attribute out.

	If an entry in the array doesn't exist in the RaceSubList object, the sheet will
	display an error and remove that entry from this array.

	SELECTING A VARIANT
	Whether a variant is used depends on how many variants of the species are selectable,
	i.e. not excluded in the Source Selection dialog:
		- More than one: the player must select one of the variants.
		  If the text in the Species field doesn't match one of the variants, the player is
		  prompted to choose one, and the Species field is changed to the name of the chosen variant.
		- Exactly one: that variant is selected automatically.
		- None: the sheet uses the species itself, without a variant.

	DIFFERS FROM 5E (2014)
	How variants work is a break with the 5e (2014) sheet, where variants were
	optional and a species with variants could be used without selecting one.
	Variants no longer being optional when available is also why the
	`forceVariantSelection` attribute is no longer used in the 5.5e (2024) sheet.

	If more than one variant is selectable, the species also gets the "Racial Options" button
	in the Racial Traits section on the 2nd page, which can be used to change the variant.

	If you want the species to also be selectable without choosing a variant, add a variant
	that is identical to the species. The `AddSubRace()` function does this automatically
	with a "basic" variant. See the RaceSubList syntax file for a more detailed explanation.
*/

/*
	>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
	>>> Traits From Base Species >>>
	>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
*/
	useFromPreviousRace: {
		message: "The Purple Catfolk gains the Darkvision and Speed of the base species, if it has those.",
		gainTraits: ["vision", "speed.walk"],
		updateName: "suffix",
		defaultTraits: {
			speed: { walk: { spd: 30, enc: 20 } },
		},
		evalAfterMerge: function (oBaseRace, rxNeverOverwrite, aGainTraits) {
			if (oBaseRace.size === 4) CurrentRace.size = 4;
		},
	},
/*	useFromPreviousRace // OPTIONAL //
	TYPE:	object
	USE:	let the species take some of its traits from another species, its base species

	Use this for a species that is built on top of another species, like the Dhampir, Hexblood,
	or Reborn from Van Richten's Guide to Ravenloft. These can take some traits from the species
	that the character was before becoming this species.

	HOW IT WORKS FOR THE PLAYER
	The player first selects a species as normal, the base species, and then changes it to the
	species with this attribute. The sheet then asks the player whether they want to use the
	traits of the base species. The answer is remembered for when the sheet is opened again.
	If the player selects this species without first selecting another species, they will
	be shown a message explaining how this works.
	The base species can't be a species that also has this attribute.

	The base species includes its variant, if one was selected.

	This object can have the following attributes, all of which are optional:

	ATTRIBUTE		EXPLANATION
	message			TYPE:	string
					USE:	extra text to add to the pop-up dialogs explaining how this works
					Use this to explain to the player which traits are taken from the base species.

	gainTraits		TYPE:	array of strings
					USE:	the attributes of the base species to add to this species
					Only used if the player chose to use the traits of the base species.
					Each entry is the name of an attribute of the base species (e.g. "vision").
					You can also point to an attribute inside an attribute, by separating them
					with a period (e.g. "speed.walk" or "savetxt.immune").
					An attribute that is an array is combined with the array of this species, if
					it has the same attribute. Otherwise, it replaces the attribute of this species.
					The following attributes are never taken from the base species this way:
						`name`, `plural`, `source`, `features`, `variants`, and `useFromPreviousRace`
					The source of the base species is always added to the source of this species.
					The features of the base species are handled separately, see below.

					SPECIES FEATURES
					Features of the base species that have an attribute listed in this array
					are added as features to this species, with only those attributes (and their
					`name`, `minlevel`, `limfeaname`, `usages`, `recovery`, and `action`).
					Add "features" to the array to add all features of the base species instead.

					EVERYTHING
					If the array contains "all", "everything", "complete", or "full", all attributes
					and features of the base species are added to this species, except for those
					listed above as never taken from the base species.

	updateName		TYPE:	string
					USE:	how to combine the name of the base species with the name of this species
					CHANGE:	v13.1.13 (replaced the `replaceNameInTrait` attribute)
					Only used if the player chose to use the traits of the base species.
					This can be one of the following:
						"replace"	Use the name (and plural) of the base species instead.
						"prefix"	Put the name of the base species in front of this name,
									e.g. "Elf Purple Catfolk".
						"suffix"	Put the name of the base species after this name,
									e.g. "Purple Catfolk Elf".
					The name is also changed in the `trait` text, if it contains the name.
					If this attribute is not present, the name is not changed.

	evalAfterMerge	TYPE:	function
					USE:	a function to run after the attributes of the base species were added
					Only used if the player chose to use the traits of the base species.
					Use this to change the `CurrentRace` object (which is this species) in ways that
					can't be done with the other attributes.
					The function is passed three variables:
						1. object, the base species (with its variant applied)
						2. regular expression, matching the attributes that shouldn't be changed
						   (see the list for `gainTraits` above)
						3. array, the `gainTraits` attribute

	defaultTraits	TYPE:	object
					USE:	attributes to use if the traits of the base species are not used
					Only used if the player chose not to use the traits of the base species,
					or if there was no base species.
					This object can contain any of the attributes of the species object, which
					replace those of this species.
					The `features` attribute is combined with that of this species instead.
					A feature set to `null` in this object removes that feature from this species.
*/
}
