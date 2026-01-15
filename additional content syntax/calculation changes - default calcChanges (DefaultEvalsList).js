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

	Subject:	`calcChanges` objects that are always processed by the sheet

	Effect:		This is the syntax for adding automation to the sheet that the sheet uses
				regardless of what is selected.
				These `calcChanges` objects are functions that can effect Hit Points,
				Attack calculations, Spell availability, Spell attack/DC calculations,
				and alter everything on the Companion page.
				Normally, this is done by adding the `calcChanges` attribute to a feature,
				but by adding an entry as explained below, these alteration will happen
				regardless of a specific feature being present.

	Remarks:	You will also need the syntax for common attributes, as that is where the
				`calcChanges` object is explained.

	Sheet:		v24.0.0 and above (PHB'24)
*/

var iFileName = "Homebrew Syntax - DefaultEvalsList.js";
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

RequiredSheetVersion("14.0.5", "24.0.0");
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

DefaultEvalsList["CalcuPurplation"] = {
/* 	DefaultEvalsList object name // REQUIRED //
	TYPE:	string
	USE:	object name of the calculation as it will be used by the sheet

	By adding a new object to the existing `DefaultEvalsList` object, we create a new
	`calcChanges` object that is processed regardless of other selections on the sheet.
	The object name here is 'CalcuPurplation'. You can use any object name as long as it is not already in use.
	If you do use an object name that is already in use, you will be overwriting that object.
	Note the use of both UPPER and lower case!
	Also note the absence of the word "var" and the use of brackets [].

	This object name is used to populate tooltips and pop-ups, so make it descriptive of the
	things that are being changed.
	For examples, see the "/_variables/ListsEvals.js" file.
*/

/* "attributes" // OPTIONAL //
	The object created is processed in an identical manner as the `calcChanges`
	attribute for features.

	See the `calcChanges` entry in the "_common attributes.js" file for the syntax of
	attributes of this object.
*/
}
