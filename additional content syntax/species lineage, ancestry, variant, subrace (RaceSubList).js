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

	Subject:	Species Variant (e.g. lineage, ancestry, variant, or subrace)

	Effect:		This is the syntax for adding a new variant to a species that exists in the sheet,
				either a species that is included in the sheet by default or one added by an add-on script.
				The sheet uses this for anything that is a version of a species, such as the
				lineages of the Elf, the draconic ancestries of the Dragonborn, the giant ancestries
				of the Goliath, or legacy 5e (2014) subraces.
				In the code of the sheet, species are still called races, hence the RaceSubList object.

	Remarks:  - You will also need the syntax for adding a species, as all attributes that a
				variant can change are explained there, see "species (RaceList).js".
			  - You will also need the syntax for common attributes if you want the variant
				to do anything besides what is explained in the species syntax file,
				see "_common attributes.js".
			  - You will also need the syntax for adding a source if you want the variant to
				have a source that doesn't yet exist in the sheet, see "source (SourceList).js".

	Sheet:		v24.1.3 and above (PHB'24)
*/

var iFileName = "Homebrew Syntax - RaceSubList.js";
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

RequiredSheetVersion("24.1.3");
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

AddSubRace("purple catfolk", "lavender", {
/*	AddSubRace // REQUIRED //
	TYPE:	function call with three variables
	USE:	add a variant to the RaceSubList object and link it to its parent species
	RETURNS: string, the object name of the variant in the RaceSubList object

	This function takes three variables, all of which are required:
	1. string
		The object name of the parent species, as it is used in the RaceList object.
		For the species in the sheet by default, these are:
			"dragonborn", "dwarf", "elf", "gnome", "goliath", "halfling", "human", "orc", and "tiefling"
		For a species added by an add-on script, look up the object name in that script.

		The parent species has to exist when this function is run,
		otherwise the function will do nothing.
		So if you add a species and its variants in the same file, add the species first.

	2. string
		The name to use for the object name of the variant.
		This is not displayed anywhere, it is only used by the sheet to refer to the variant.

		The object name of the variant in the RaceSubList object will be the object name
		of the parent species, followed by a hyphen and this string, all in lowercase.
		In this example, that is "purple catfolk-lavender".
		If the parent species already has a variant with that object name, the function will
		add a number to it (e.g. "purple catfolk-lavender-2") so that it doesn't overwrite
		another variant with the same object name.

		The object name of the variant is used by other things to test for the variant,
		for example `CurrentRace.known === "purple catfolk" && CurrentRace.variant === "lavender"`.
		Because of this, you shouldn't change this string after publishing your script.

	3. object
		The variant object, which is explained below.
		It starts with the opening bracket `{` at the end of the line above.

	ADDING THE VARIANT TO THE SPECIES
	The function will add this string (the part after the hyphen) to the `variants` attribute
	of the parent species, so you don't have to do that yourself.
	See the `variants` attribute in the "species (RaceList).js" file.

	THE "BASIC" VARIANT
	A species with more than one selectable variant can't be used without one of its variants,
	see "SELECTING THE VARIANT" below.
	So that a species without variants remains selectable as it was, the function does the
	following when it adds the first variant to a species that has no `variants` attribute:
	it adds a copy of the parent species as a variant with the object name "[species]-basic"
	(e.g. "purple catfolk-basic"), and adds "basic" to the `variants` attribute.
	This "basic" variant is identical to the parent species.

	OTHER NAMES FOR THIS FUNCTION
	This function used to be called `AddRacialVariant()`.
	For backwards-compatibility, `AddRacialVariant()` still works and does exactly the
	same as `AddSubRace()`.
	To avoid mistakes, `AddSubSpecies()` also exists and also does exactly the same as `AddSubRace()`.

	WITHOUT THE FUNCTION
	It is also possible to add a variant by adding it directly to the RaceSubList object,
	for example `RaceSubList["purple catfolk-lavender"] = { ... };`.
	In that case, you have to add "lavender" to the `variants` attribute of the parent species
	yourself and no "basic" variant is created.
	This is not recommended, use the `AddSubRace()` function instead.
*/
	name: "Lavender Catfolk",
/*	name // OPTIONAL //
	TYPE:	string
	USE:	name of the variant as it will be used by the sheet

	This name replaces the `name` of the parent species while the variant is selected,
	so it is used for everything that the `name` attribute of the species is used for,
	see the "species (RaceList).js" file.
	So make sure this name can stand on its own (e.g. "Lavender Catfolk" or "Purple Catfolk (Lavender)").

	SELECTING THE VARIANT
	Variants are not listed in the drop-down of the Species field, only their parent species is.
	Whether a variant is used depends on how many variants of the parent species are selectable,
	i.e. not excluded in the Source Selection dialog:
		- More than one: the player must select one of the variants.
		  If the text in the Species field doesn't match one of the variants, the player is
		  prompted to choose one, and the Species field is changed to the name of the chosen variant.
		- Exactly one: that variant is selected automatically.
		- None: the sheet uses the parent species itself, without a variant.
	This is a break with the 5e (2014) sheet, where variants were optional and a species with
	variants could always be used without selecting one.

	If more than one variant is selectable, the player can also change the variant with the
	"Racial Options" button in the Racial Traits section on the 2nd page.
	In both the prompt and that menu, the variant is listed with this name, unless the
	`sortname` attribute is present, see below.

	The length of this name is also used to determine which variant to use if multiple
	variants match the text in the Species field, see `regExpSearch` below.

	If this attribute is not present, the variant keeps the `name` of the parent species and
	is listed as the variant's object name followed by the name of the parent species
	(e.g. "Lavender Purple Catfolk").
*/
	sortname: "Catfolk, Lavender",
/*	sortname // OPTIONAL //
	TYPE:	string
	USE:	name of the variant as it will be shown in the variant selection prompt and the "Racial Options" menu

	This name will only be used to display the variant in those two places.
	This attribute is not used to recognize the variant or fill the Species field.
	If this attribute is not present, the `name` is used instead.
*/
	regExpSearch: /^(?=.*lavender)(?=.*(cat|feline)).*$/i,
/*	regExpSearch // REQUIRED //
	TYPE:	regular expression
	USE:	used to match the text in the Species field to see if this variant is present

	This has to be a match for the `name` given earlier, or the variant will never be recognized.
	Now it looks for any entry that has both the word "lavender" and the word "cat" or "feline" in it,
	disregarding capitalization or word order.
	If this looks too complicated, or you want to match only a single word, just write:
		regExpSearch: /lavender/i,

	Diacritics are removed from the text in the Species field before testing this regular
	expression, so don't use them in it (e.g. use a plain "e" instead of an accented "é").

	FINDING THE VARIANT
	The sheet first looks for a matching species. If the text in the Species field matches the
	`regExpSearch` of a species, the sheet only looks at the variants of that species.
	If no species matches, the sheet looks at the variants of all species instead.
	This is how a variant with a name that doesn't include the name of the species, like the
	"Drow" for the Elf, is still recognized.

	If multiple variants match the text in the Species field, the sheet will use the one with
	the longest `name`. If those are equal, it will use the one with the newest source.

	Be careful not to make the `regExpSearch` match the name of the parent species on its own,
	otherwise selecting the parent species will select this variant instead of prompting the
	player to choose a variant.
	In this example, "Purple Catfolk" doesn't match the variant, but "Lavender Catfolk" does.
*/
	source: ["HB", 0],
	source: [["SRD24", 85], ["PHB24", 190]],
/*	source // REQUIRED //
	TYPE:	array with two entries (or array of these arrays)
	USE:	define where the variant is found

	This attribute is used by the sheet to determine if the variant should be available depending on the sources included and excluded.

	This array has two entries, a string followed by a number
	1. string
		The first entry has to be the object name of a SourceList object.
	2. number
		The second entry is the page number to find the variant at.
		This can be any number and is ignored if it is a 0.

	See the "source (SourceList).js" file for learning how to add a custom source.

	Alternatively, this can be an array of arrays to indicate it appears in multiple sources.
	The example above says something appears on both page 85 of the System Reference Document v5.2
	and on page 190 of the 2024 Player's Handbook.

	If a variant is completely homebrew, or you don't want to make a custom source, just put the following:
		source: ["HB", 0],
	"HB" refers to the 'homebrew' source.

	Note that if the parent species is excluded, none of its variants are available either.

	If this attribute is not present, the variant is listed with the source of the parent species,
	but it can't be excluded by excluding a source, only by excluding the variant itself
	or its parent species.
*/
	defaultExcluded: true,
/*	defaultExcluded // OPTIONAL //
	TYPE:	boolean
	USE:	whether this variant should be excluded by default (true) or included by default (false)

	Include this attribute and set it to true if the variant should appear in the Excluded list of the
	Source Selection Dialog when the script is added for the first time.
	It will have to be manually set to be included before it is used by the sheet's automation.
	The user will be made aware of this exclusion.

	This only excludes the variant, not its parent species.
	The `defaultExcluded` attribute of the parent species is not used for the variant,
	so a variant of a species that is excluded by default is still included by default,
	unless the variant also has this attribute set to true.
	However, as long as the parent species is excluded, the variant is not available, see `source` above.

	This is useful for optional variants that you wouldn't normally want to use (e.g. playtest or campaign-specific).

	Setting this attribute to false is the same as not including this attribute.
*/

/*
	>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>
	>>> Replacing Species Attributes >>>
	>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

	A variant can change all attributes of its parent species, except for `variants`.
	These attributes work identical to the attributes of the same name in the RaceList
	object, see the "species (RaceList).js" file for an explanation of each of them.
	This also applies to common attributes, see "Common Attributes" below.

	If the variant has one of these attributes, that attribute is used instead of the
	attribute of the same name in the parent species, but only while the variant is selected.
	If the variant doesn't have the attribute, the one of the parent species is used.
	So only add these if the variant needs to be different than its parent species.
	The `features` attribute is the exception to this, see "Species Features" below.

	An attribute is always replaced as a whole.
	For example, if the parent species has `vision: [["Darkvision", 60]]` and the variant
	has `vision: [["Keen Smell", 0]]`, the variant doesn't have Darkvision, because the
	whole `vision` array is replaced.
	So if you only want to add to or change part of an attribute, you will have to include
	the complete attribute in the variant, like the `vision` in the example below.

	REMOVING ATTRIBUTES
	To remove an attribute of the parent species, set it to `null` in the variant.
	For example, `abilitySave: null,` will make it so the variant has no Ability Save DC,
	even though the parent species does.

	THE TRAIT DESCRIPTION
	As the `trait` attribute is replaced as a whole too, you will almost always want to
	include it in the variant, with the description of all the traits, both those of the
	variant and those of the parent species.
	To avoid writing the same text twice, the species in the sheet put the traits that every
	variant shares in the `trait` array of the parent species, and the variants reference
	those entries, like in the example below.
*/
	plural: "Lavender Catfolk",
	trait: [
		"**Lavender Catfolk**",
		RaceList["purple catfolk"].trait[1], // Cat's Claws
		"##\u25C6 Feline Agility##. When I move on my turn, I can double my Speed until the end of the turn. I can do this my Proficiency Bonus times per Long Rest.",
		"##\u25C6 Lavender Calm## (level 3). As a Magic action once per Long Rest, I can release a calming scent. Each creature of my choice within 10 ft of me has the Charmed condition ended on it.",
		"##\u25C6 Lavender Scent##. I have Advantage on saving throws to avoid or end being Charmed.",
	],
	vision: [["Darkvision", 60], ["Keen Smell", 0]],
	savetxt: { adv_vs: ["Charmed"] },
	abilitySave: null,

/*
	>>>>>>>>>>>>>>>>>>>>>>>>
	>>> Species Features >>>
	>>>>>>>>>>>>>>>>>>>>>>>>
*/
	features: {
		"feline agility": {
			name: "Feline Agility",
			minlevel: 1,
			usages: "Proficiency Bonus per ",
			usagescalc: "event.value = How('Proficiency Bonus');",
			recovery: "long rest",
		},
		"purple haze": null,
		"lavender calm": {
			name: "Lavender Calm",
			minlevel: 3,
			usages: 1,
			recovery: "long rest",
			action: [["action", ""]],
		},
	},
/*	features // OPTIONAL //
	TYPE:	object with objects
	USE:	the features of the variant, combined with those of the parent species

	The syntax for each feature is the same as for the `features` attribute in the
	"species (RaceList).js" file.

	Contrary to the other attributes, the `features` of the variant doesn't replace the
	`features` of the parent species as a whole. Instead, the sheet combines them as follows:
		- A feature with an object name that the parent species doesn't have is added in
		  addition to the features of the parent species (e.g. "lavender calm" above).
		- A feature with the same object name as a feature of the parent species replaces
		  that feature (e.g. "feline agility" above).
		- A feature set to `null` removes that feature of the parent species
		  (e.g. "purple haze" above).
		- All other features of the parent species are kept.

	REMOVING ALL FEATURES
	If you want the variant to have none of the features of the parent species,
	set this attribute to `null` (or ""):
		features: null,
	If you want to replace all the features of the parent species with your own, overwrite each
	of the features of the parent species with another object, or set them to `null` and
	add your own features.

	Note that an empty object (`features: {}`) doesn't remove anything, so it will keep all
	the features of the parent species.

	The sheet never changes the `features` objects of the RaceList and RaceSubList objects,
	it only combines them in a copy. So a variant can never affect its parent species or
	other variants of the same species.
*/

/*
	>>>>>>>>>>>>>>>>>>>>>>>>>
	>>> Common Attributes >>>
	>>>>>>>>>>>>>>>>>>>>>>>>>

	You can have the variant affect different parts of the sheet like adding proficiencies,
	adding spellcasting abilities, actions, limited features, etc. etc.

	See the "_common attributes.js" file for documentation on how to do those things and more.
	All attributes in there can directly be added in this object.

	REPLACING COMMON ATTRIBUTES OF THE PARENT SPECIES
	Common attributes are replaced just like the other attributes, see "Replacing Species
	Attributes" above. The variant doesn't get the common attributes of the parent species
	in addition to its own, but instead of them, one attribute at a time.
	For example, the parent species in the "species (RaceList).js" file has
	`weaponsAdd: ["Claws"]`. The variant below has `weaponsAdd: ["Lavender Claws"]`,
	so the variant adds "Lavender Claws" to the attacks section, but not "Claws".
	All other common attributes of the parent species, such as `speed`, still apply.

	If you want a common attribute to be added in addition to that of the parent species,
	add it to a feature of the variant instead, see "Species Features" above.

	ABILITY SCORES
	Just like for a species, the sheet ignores the `scores` and `scorestxt` common attributes
	when used directly in the variant object. See "Common Attributes" in the species syntax file.
*/
	weaponsAdd: ["Lavender Claws"],
});
