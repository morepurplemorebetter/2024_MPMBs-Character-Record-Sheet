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

	Sheet:		v24.0.0 and above (PHB'24)
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

	FORMATTING CHARACTERS
	This can be formatted using the Rich Text formatting characters.
	Text between the formatting characters will be displayed differently on the sheet.
	The formatting characters are as follows:
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

	You can combine the formatting characters to apply multiple formatting options to one
	string, but there are some limitations to consider.
		1. Formatting characters don't work across line breaks (`\r` and `\n`).
			This won't work:
				"**text before and" + "\n" + "text after line break**"
			Instead do this:
				"**text before and**" + "\n" + "**text after line break**"
		2. Combining formatting characters requires them to be in the same or reversed order.
			This won't work:
				"_**~underlined, strikethrough, and bold**_~"
			Instead do this:
				"_**~underlined, strikethrough, and bold~**_"
			or this:
				"_**~underlined, strikethrough, and bold_**~"
		3. Tabs (`\t`) and multiple spaces will break the formatting if the field is edited manually.
			This should be avoided:
				"**text before and" + "\t" + "text after tab**"
			Instead do this:
				"**text before and**" + "\t" + "**text after tab**"

	Be aware that the default font on the Colourful sheets is already italic,
	so making something only italic won't be visible on the Colourful sheets.
*/
	descriptionFull: "If you hit a creature with this weapon, I can temporarily syphon off its purple energy and make my skin and anything I'm wearing dark purple. Until the end of my next turn, I have advantage on Dexterity (Stealth) checks to hide.",
	descriptionFull: [
		"Introduction text of the weapon mastery. This will not be preceded by a line break or three spaces as this is the first paragraph.",
		"Second entry, which will be preceded by a line break and three spaces.",
		" \u2022 Bullet point entry. This will be preceded by a line break, but not with three spaces, as this entry starts with a space.",
		" \u2022 Another bullet point entry.",
		[ // This will render as a table (i.e. a tab between each column)
			["Column 1 header", "Column 2 header", "Column 3 header"], // The first row, which will be made bold and italic
			["Column 1 entry", "Column 2 entry", "Column 3 entry"], // The rest of the rows won't be changed
			["Column 1 entry II", "Column 2 entry II", "Column 3 entry II"], // Table row 2
		],
		">>Header Paragraph<<. This paragraph will be preceded by a line break and three spaces. The text 'Header Paragraph' will be rendered with unicode as being bold and italic.",
	],
/*	descriptionFull // OPTIONAL //
	TYPE:	array or string
	USE:	description of the mastery as it will appear in a tooltip

	This text is used to populate the tooltip of the attack description field,
	when the attack is eligible to have this mastery.

	There is no limit to how big this description can be,
	but long descriptions will not always display correctly.

	ARRAY
	This attribute can be an array. Each entry in the array will be put
	on a new line. Each entry can be one of the following:
		1. String
		   If the entry is a string that doesn't start with a space character and
		   it is not the first entry, it will be added on a new line proceeded by
		   three spaces (i.e. `\n   `).
		   If the entry is a string that starts with a space character,
		   it will be added on a new line without any preceding spaces.
		   For example, to make a bullet point list, you would use ` \u2022 list entry`
		   (N.B. `\u2022` is unicode for a bullet point).
		2. Array of arrays, which contain only strings
		   If the entry is in itself an array, it is treated as a table.
		   Each entry in that array is a row in the table, with the first row being the headers.
		   The headers will be made bold with the `**` formatting character, see below.
		   Each subarray is rendered with a tab between each column (i.e. `Array.join("\t")`).
		   If instead of a subarray there is a string, it will be added as is.
		   The table will be preceded by two line breaks and followed by one line break

	FORMATTING CHARACTERS
	Regardless if you use a string or an array, the `descriptionFull` can be formatted
	using the Rich Text formatting characters, see the `description` attribute above.

	The `descriptionFull` of weapon masteries is only used to populate the tooltip and pop-up
	dialogs, which don't support formatting except through unicode.
	This means that only the bold and italic formatting will have any effect.
	Other formatting characters will be ignored (e.g. no underlining or strikethrough).
	If unicode is disabled, the sheet will instead capitalize everything between formatting characters.
*/
}
