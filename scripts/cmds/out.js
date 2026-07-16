"use strict";

const axios = require("axios");
const fs = require("fs-extra");
const request = require("request");

module.exports = {
	config: {
		name: "out",
		aliases: ["vag", "urjaa", "quitter"],
		version: "1.0.0",
		author: "Chris",
		countDown: 5,
		role: 2,
		description: { en: "ꜰᴀɪʀᴇ ǫᴜɪᴛᴛᴇʀ ʟᴇ ʙᴏᴛ ᴅ'ᴜɴ ɢʀᴏᴜᴘᴇ" },
		category: "admin",
		guide: {
			en: "   {pn}        — ǫᴜɪᴛᴛᴇʀ ʟᴇ ɢʀᴏᴜᴘᴇ ᴀᴄᴛᴜᴇʟ\n" +
			    "   {pn} <ᴛɪᴅ>  — ǫᴜɪᴛᴛᴇʀ ᴜɴ ɢʀᴏᴜᴘᴇ ꜱᴘᴇ́ᴄɪꜰɪǫᴜᴇ ᴠɪᴀ ꜱᴏɴ ɪᴅ"
		}
	},

	onStart: async function ({ api, event, args }) {
		const { threadID, messageID } = event;
		let id;

		if (!args.join(" ")) {
			id = threadID;
		} else {
			id = args.join(" ").trim();
		}

		return api.sendMessage(
			[
				"✦━━━━━━━━━━━━━━━━━━━✦",
				"🌿 ǫᴜᴇ ʟᴇ ᴠᴇɴᴛ ᴠᴏᴜꜱ ᴘʀᴏᴛᴇ̀ɢᴇ, ꜱʜɪɴᴏʙɪꜱ…",
				"   ɪʟ ᴇꜱᴛ ᴛᴇᴍᴘꜱ ᴘᴏᴜʀ ᴍᴏɪ ᴅᴇ ᴘᴀʀᴛɪʀ.",
				"✦━━━━━━━━━━━━━━━━━━━✦"
			].join("\n"),
			id,
			() => api.removeUserFromGroup(api.getCurrentUserID(), id)
		);
	}
};
