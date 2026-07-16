"use strict";

const fs = require("fs-extra");
const path = require("path");

const CONFIG_FILE = path.join(process.cwd(), "config.json");

function getMode() {
	const v = global.GoatBot?.config?.noPrefix;
	if (v === true) return "on";
	if (v === "adminOnly") return "adminOnly";
	return "off";
}

function setMode(mode) {
	const val = mode === "on" ? true : mode === "adminOnly" ? "adminOnly" : false;
	if (global.GoatBot?.config) global.GoatBot.config.noPrefix = val;
	try {
		const cfg = fs.readJsonSync(CONFIG_FILE);
		cfg.noPrefix = val;
		fs.writeJsonSync(CONFIG_FILE, cfg, { spaces: 2 });
	} catch {}
	return val;
}

function uptime() {
	const t = process.uptime();
	const d = Math.floor(t / 86400), h = Math.floor((t % 86400) / 3600), m = Math.floor((t % 3600) / 60), s = Math.floor(t % 60);
	return `${d > 0 ? `${d}ᴅ ` : ""}${h}ʜ ${m}ᴍ ${s}ꜱ`;
}

module.exports = {
	config: {
		name: "noprefix",
		aliases: ["np", "nopfx"],
		version: "2.0.0",
		author: "Chris",
		countDown: 3,
		role: 2,
		description: { en: "ᴀᴄᴛɪᴠᴇʀ/ᴅᴇ́ꜱᴀᴄᴛɪᴠᴇʀ ʟᴇ ᴍᴏᴅᴇ ꜱᴀɴꜱ ᴘʀᴇ́ꜰɪxᴇ ᴇᴛ ɢᴇ́ʀᴇʀ ʟᴇꜱ ᴜᴛɪʟɪꜱᴀᴛᴇᴜʀꜱ ᴀᴜᴛᴏʀɪꜱᴇ́ꜱ" },
		category: "owner",
		guide: { en: "{pn} on | off | admin | status\n{pn} user list" }
	},

	langs: {
		en: {
			status:   "✦ ᴇ́ᴛᴀᴛ ᴅᴜ ɴᴏ-ᴘʀᴇ́ꜰɪxᴇ\n◈ ᴍᴏᴅᴇ   : %1\n◈ ᴜᴘᴛɪᴍᴇ : %2\n◈ ᴘʀᴇ́ꜰɪxᴇ : %3",
			setOn:    "✦ ɴᴏ-ᴘʀᴇ́ꜰɪxᴇ ─ ᴀᴄᴛɪᴠᴇ́\n◈ ᴄʜᴀǫᴜᴇ ꜱʜɪɴᴏʙɪ ᴘᴇᴜᴛ ᴏᴍᴇᴛᴛʀᴇ ʟᴇ ᴘʀᴇ́ꜰɪxᴇ",
			setOff:   "✦ ɴᴏ-ᴘʀᴇ́ꜰɪxᴇ ─ ᴅᴇ́ꜱᴀᴄᴛɪᴠᴇ́\n◈ ʟᴇ ᴘʀᴇ́ꜰɪxᴇ \"%1\" ᴇꜱᴛ ʀᴇǫᴜɪꜱ ᴘᴏᴜʀ ᴛᴏᴜꜱ",
			setAdmin: "✦ ɴᴏ-ᴘʀᴇ́ꜰɪxᴇ ─ ᴀᴅᴍɪɴ\n◈ ꜱᴇᴜʟꜱ ʟᴇꜱ ᴀᴅᴍɪɴɪꜱᴛʀᴀᴛᴇᴜʀꜱ ᴘᴇᴜᴠᴇɴᴛ ᴏᴍᴇᴛᴛʀᴇ ʟᴇ ᴘʀᴇ́ꜰɪxᴇ"
		}
	},

	onStart: async function ({ args, message, getLang, usersData }) {
		const sub = (args[0] || "").toLowerCase();
		const cfg = global.GoatBot.config;
		const mode = getMode();
		const modeLabel = mode === "on" ? "✅ ᴀᴄᴛɪᴠᴇ́ (ᴛᴏᴜꜱ)" : mode === "adminOnly" ? "🛡️ ᴀᴅᴍɪɴꜱ ᴜɴɪǫᴜᴇᴍᴇɴᴛ" : "⛔ ᴅᴇ́ꜱᴀᴄᴛɪᴠᴇ́";

		if (!sub || sub === "status" || sub === "info")
			return message.reply(getLang("status", modeLabel, uptime(), cfg.prefix || "─"));

		if (sub === "on") { setMode("on"); return message.reply(getLang("setOn")); }
		if (sub === "off") { setMode("off"); return message.reply(getLang("setOff", cfg.prefix || ".")); }
		if (sub === "admin" || sub === "adminonly") { setMode("adminOnly"); return message.reply(getLang("setAdmin")); }

		if (sub === "user") {
			const action = (args[1] || "").toLowerCase();
			const noPrefix = cfg.noPrefix_users || [];

			if (action === "list") {
				if (!noPrefix.length) return message.reply("⌀ ᴀᴜᴄᴜɴᴇ ᴇxᴄᴇᴘᴛɪᴏɴ ᴅ'ᴜᴛɪʟɪꜱᴀᴛᴇᴜʀ ᴇɴʀᴇɢɪꜱᴛʀᴇ́ᴇ");
				const lines = await Promise.all(noPrefix.map(async (id, i) => {
					const u = await usersData.get(id).catch(() => null);
					return `◦ ${i + 1}. ${u?.name || "Shinobi inconnu"} [${id}]`;
				}));
				return message.reply("✦ ᴜᴛɪʟɪꜱᴀᴛᴇᴜʀꜱ ᴇxᴇᴍᴘᴛᴇ́ꜱ ᴅᴇ ᴘʀᴇ́ꜰɪxᴇ :\n" + lines.join("\n"));
			}

			return message.reply("◈ ᴜᴛɪʟɪꜱᴀᴛɪᴏɴ : noprefix user list");
		}

		return message.SyntaxError();
	}
};
