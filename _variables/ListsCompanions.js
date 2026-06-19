var Base_CompanionList = {
	"familiar": {
		name: "Find Familiar",
		nameTooltip: "the Find Familiar spell",
		nameMenu: "Familiar (Find Familiar spell)", // required
		source: [["SRD24", 130], ["P24", 272]], // required
		includeCheck : function(sCrea, objCrea, iCreaCR, bIsAL) {
			return objCrea.type.toLowerCase() === "beast" && iCreaCR === 0;
		},
		action: [
			["action", "Familiar (dismiss/reappear)"],
			["bonus action", "Use familiar's senses"],
		],
		attributesAdd: {
			header: "Familiar",
			features: [{
				name: "Find Familiar",
				description: "If dropped to 0 HP, the familiar disappears, leaving behind no physical form. The familiar must obey all commands of its master.",
			}],
			actions: [{
				name: "Deliver Touch Spells",
				description: "As a Reaction when the [THIS]'s master casts a spell with a range of touch, the [THIS] can deliver the touch if within 100 ft of its master.",
			}],
			notes: [{
				useSpellDescription: "find familiar",
			}],
		},
		attributesChange: function(sCrea, objCrea) {
			// can't do any attacks
			objCrea.attacks = [];
			if (objCrea.type.toLowerCase() === "beast") {
				var findFamiliarCasters = isSpellUsed("find familiar");
				var onlyDruid = findFamiliarCasters.length && findFamiliarCasters.every(function (cast) { return cast === "druid" });
				objCrea.type = onlyDruid ? "Fey" : ["Celestial", "Fey", "Fiend"];
				objCrea.subtype = "";
			};
		},
	},
	"pact_of_the_chain" : {
		name: "Pact of the Chain",
		nameTooltip: "Warlock (Pact of the Chain)",
		nameOrigin: "variant of the Find Familiar 1st-level conjuration [ritual] spell",
		nameMenu: "Pact of the Chain familiar (Warlock's Eldritch Invocation)",
		source: [["SRD24", 74], ["P24", 157]],
		includeCheck: function(sCrea, objCrea, iCreaCR, bIsAL) {
			if (objCrea.companion) {
				if (objCrea.companion.indexOf("familiar") !== -1) return true;
				if (bIsAL && objCrea.companion.indexOf("familiar_not_al") !== -1) return " (if DM approves)";
			}
			return objCrea.type.toLowerCase() === "beast" && iCreaCR === 0;
		},
		action: [
			["action", "Familiar (dismiss/reappear)"],
			["action", "Use familiar's senses"],
		],
		attributesAdd: {
			header: "Familiar",
			actions: [{
				name: "Deliver Touch Spells",
				description: "As a Reaction when the [THIS]'s master casts a spell with a range of touch, the [THIS] can deliver the touch if within 100 ft of its master.",
			}],
			notes: [{
				name: "Pact of the Chain: Find Familiar",
				source: [["SRD24", 74], ["P24", 157]],
				useSpellDescription: "find familiar",
				formatSpellDescription: function(str) {
					str = str.replace(
						"an animal form I choose: Bat, Cat, Frog, Hawk, Lizard, Octopus, Owl, Rat, Raven, Spider, Weasel, or another Beast that has a Challenge Rating of 0.",
						"the form of a CR 0 Beast, Imp, Pseudodragon, Quasit, Skeleton, Slaad Tadpole, Sphinx of Wonder, Sprite, or Venomous Snake."
					).replace(
						"but it can take other actions as normal.",
						"but it can take other actions as normal. When I take the Attack action, I can forgo one of my attacks to allow my familiar to use its Reaction to make one attack of its own."
					);
					if (typePF) {
						str = str.replace(
							"I can't have more than one familiar at a time. If I cast this spell while I have a familiar, I instead cause it to adopt a new eligible form.",
							"I can't have multiple familiars. I can cast the spell again to change its form."
						);
					};
					return str;
				},
			}],
		},
		attributesChange: function(sCrea, objCrea) {
			if (objCrea.type.toLowerCase() === "beast") {
				objCrea.type = ["Celestial", "Fey", "Fiend"];
				objCrea.subtype = "";
			};
			var activeInvocations = GetFeatureChoice('classes', 'warlock', 'eldritch invocations', true);
			if (activeInvocations.indexOf("investment of the chain master (req: lvl 5+, pact of the chain)") !== -1 && objCrea.attacks.length) {
				var dmgTypesRx = /((bludg(eon)?|pierc|slash)(ing|\.)?)/i;
				for (var i = 0; i < objCrea.attacks.length; i++) {
					if (objCrea.attacks[i].dc) {
						objCrea.attacks[i].useSpellMod = "warlock";
					}
					if (dmgTypesRx.test(objCrea.attacks[i].damage[2])) {
						objCrea.attacks[i].damage[2] = objCrea.attacks[i].damage[2].replace(dmgTypesRx, "$1*");
						objCrea.attacks[i].description = (objCrea.attacks[i].description ? objCrea.attacks[i].description + "; " : "") + "*or Necrotic or Radiant";
					}
				}
			}
		},
	},
};
