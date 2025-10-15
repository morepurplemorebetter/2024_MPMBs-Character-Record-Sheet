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

	Subject:	Mastery option for weapons

	Effect:		This is the syntax for adding a new weapon mastery option to the sheet.
				This is used in the Attack section of the sheet, when a feature grants
				access to the mastery property of a weapon and picks a weapon that use
				this mastery.

	Remarks:	Entries in the `WeaponMasteriesList` object are referenced by the `mastery`
				attribute of a `WeaponsList` object.
				For the syntax of `WeaponsList` objects, see 'weapon (WeaponsList).js'.

	Sheet:		v24.0.0 and newer (PHB'24)
*/

var iFileName = "Homebrew Syntax - WeaponMasteriesList.js";
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

RequiredSheetVersion("24.0.0");
/*	RequiredSheetVersion // OPTIONAL //
	TYPE:	function call with one variable, a string or number
	USE:	the minimum version of the sheet required for the import script to work

	If this script is imported into a sheet with an earlier version than given here, the player will be given a warning.

	The variable you input can be a the full semantic version of the sheet as a string
	(e.g. "24.0.0" or "24.0.0-beta+251018").
	Alternatively, you can input a number, which the sheet will translate to a semantic version.
	For example:
		FUNCTION CALL						REQUIRED MINIMUM VERSION
		`RequiredSheetVersion(24);`			24.0.0
		`RequiredSheetVersion(24.2);`		24.2.0

	You can find the full semantic version of the sheet at the bottom of every page,
	or look at the "Get Latest Version" bookmark, which lists the version number,
	or go to File >> Properties >> Description, where the version is part of the document title.
*/

WeaponMasteriesList["purplefication"] = {
/* 	WeaponMasteriesList object name // REQUIRED //
	TYPE:	string
	USE:	object name of the mastery as it will be used by the sheet

	By adding a new object to the existing `WeaponMasteriesList` object, we create a new mastery.
	The object name here is 'purplefication'. You can use any object name as long as it is not already in use.
	If you do use an object name that is already in use, you will be overwriting that object.
	Note the use of only lower case! Also note the absence of the word "var" and the use of brackets [].

	It is this object name that the `mastery` property of the `WeaponsList` object references.
	
	Make sure to also add an entry to the `WeaponsList` that references this new mastery,
	otherwise there is no point in added the mastery.
*/
	name: "Purplefication",
/*	name // REQUIRED //
	TYPE:	string
	USE:	name of the mastery as it will be used by the sheet

	This name will be used as-is (no change in capitalization) before
	being added to the notes on the 3rd page.
	It will also be added as-is in the description of an attack,
	when that attack references this mastery and is set to include its mastery.
*/
	source: ["SRD24", 204],
	source: [["P24", 214], ["S", 115]],
/*	source // REQUIRED //
	TYPE:	array with two entries (or array of these arrays)
	USE:	define where the mastery is found

	This attribute is used by the sheet to determine if the mastery should be available depending on the sources included and excluded.

	This array has two entries, a string followed by a number
	1. string
		The first entry has to be the object name of a SourceList object.
	2. number
		The second entry is the page number to find the mastery at.
		This can be any number and is ignored if it is a 0.

	See the "source (SourceList).js" file for learning how to add a custom source.

	Alternatively, this can be an array of arrays to indicate it appears in multiple sources.
	The example above says something appears on both page 214 of the 2024 Player's Handbook
	and	on page 115 of the Sword Coast Adventure Guide.

	If a mastery is completely homebrew, or you don't want to make a custom source, just put the following:
		source: ["HB", 0],
	"HB" refers to the 'homebrew' source.
*/
	description: "If I hit a creature, I gain advantage on Dex (Stealth) checks to hide until my next turn ends.",
/*	description // REQUIRED //
	TYPE:	string
	USE:	the text to be filled in the 3rd page notes section

	This text is used to generate the description of the `extrachoices` options of any class
	feature that has the `choicesWeaponMasteries` attribute.

	Note that the sheet normally uses the first person for this.
	Make sure that this description is not too long and fits nicely on one or more lines
	in the notes section of the 3rd page, like other optional class features.
	The Colourful sheets have less space in the 3rd page notes section,
	so use the Colourful sheets to test if the description fits.
*/
	descriptionFull: "If you hit a creature with this weapon, I can temporarily syphon off its purple energy and make my skin and anything I'm wearing dark purple. Until the end of my next turn, I have advantage on Dexterity (Stealth) checks to hide.",
/*	descriptionFull // OPTIONAL //
	TYPE:	string
	USE:	description of the mastery as it will appear in a tooltip

	This text is used to populate the tooltip of the attack description field,
	when the attack is eligible to have this mastery.

	There is no limit to how big this description can be,
	but long descriptions will not always display correctly.
*/
}
