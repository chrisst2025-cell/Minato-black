const { getTime } = global.utils;
const fs = require("fs-extra");
const path = require("path");

const CONFIG_FILE = path.join(process.cwd(), "config.json");

function resolveUIDs(args, event, offset = 1) {
	const mentions = Object.keys(event.mentions || {});
	if (mentions.length) return mentions;
	if (event.messageReply) return [event.messageReply.senderID];
	const ids = args.slice(offset).filter(a => /^\d+$/.test(a));
	return ids.length ? ids : [];
}

module.exports = {
	config: {
		name: "admin",
		aliases: ["adm"],
		version: "2.0.0",
		author: "chris st",
		countDown: 3,
		role: 2,
		description: { en: "ɢᴇ́ʀᴇʀ ʟᴇ ᴄᴏɴꜱᴇɪʟ ᴅᴇꜱ ʜᴏᴋᴀɢᴇ" },
		category: "owner",
		guide: {
			en: "   {pn} add [@|ᴜɪᴅ|ʀᴇᴘʟʏ] — ɴᴏᴍᴍᴇʀ ᴜɴ ɴᴏᴜᴠᴇᴀᴜ ʜᴏᴋᴀɢᴇ\n   {pn} remove [@|ᴜɪᴅ|ʀᴇᴘʟʏ] — ʀᴇᴛɪʀᴇʀ ᴜɴ ʜᴏᴋᴀɢᴇ ᴅᴇ ꜱᴇꜱ ꜰᴏɴᴄᴛɪᴏɴꜱ\n   {pn} list — ᴠᴏɪʀ ʟᴇꜱ ᴍᴇᴍʙʀᴇꜱ ᴅᴜ ᴄᴏɴꜱᴇɪʟ\n   {pn} check [@|ᴜɪᴅ|ʀᴇᴘʟʏ] — ᴠᴇ́ʀɪꜰɪᴇʀ ʟᴇ ʀᴀɴɢ ᴅ'ᴜɴ ꜱʜɪɴᴏʙɪ"
		}
	},

	langs: {
		en: {
			noUID:      "⌀ ᴠᴇᴜɪʟʟᴇᴢ ᴅᴇ́ꜱɪɢɴᴇʀ ᴜɴ ꜱʜɪɴᴏʙɪ (ᴛᴀɢ/ʀᴇ́ᴘᴏɴꜱᴇ/ᴜɪᴅ)",
			listEmpty:  "⌀ ʟᴇ ᴄᴏɴꜱᴇɪʟ ᴅᴇꜱ ʜᴏᴋᴀɢᴇ ᴇꜱᴛ ᴠɪᴅᴇ ᴘᴏᴜʀ ʟ'ɪɴꜱᴛᴀɴᴛ. ɴᴏᴜꜱ ᴅᴇᴠᴏɴꜱ ᴘʀᴏᴛᴇ́ɢᴇʀ ʟᴇ ᴠɪʟʟᴀɢᴇ.",
			isAdmin:    "✦ %1\n◈ ɪᴅ    : %2\n◈ ʀᴀɴɢ  : ʜᴏᴋᴀɢᴇ ᴅᴇ ᴋᴏɴᴏʜᴀ 🍃",
			isNotAdmin: "◈ %1\n◈ ɪᴅ    : %2\n◈ ʀᴀɴɢ  : ꜱʜɪɴᴏʙɪ ᴅᴜ ᴠɪʟʟᴀɢᴇ ✘"
		}
	},

	onStart: async function ({ message, args, usersData, event, getLang }) {
		const adminList = global.GoatBot?.config?.adminBot || [];
		const sub = (args[0] || "").toLowerCase();

		if (sub === "list" || sub === "-l") {
			if (!adminList.length) return message.reply(getLang("listEmpty"));
			const lines = await Promise.all(adminList.map(async (id, i) => {
				const u = await usersData.get(id).catch(() => ({ name: "Inconnu" }));
				return `◦ ${i + 1}. ${u.name || "Inconnu"} [${id}]`;
			}));
			return message.reply(
				`✦ ᴄᴏɴꜱᴇɪʟ ᴅᴇꜱ ʜᴏᴋᴀɢᴇ (${adminList.length}):\n`
				+ lines.join("\n")
			);
		}

		if (sub === "add" || sub === "-a") {
			const uids = resolveUIDs(args, event, 1);
			if (!uids.length) return message.reply(getLang("noUID"));
			const added = [], already = [];
			for (const uid of uids) {
				if (adminList.includes(uid)) { already.push(uid); continue; }
				adminList.push(uid);
				added.push(uid);
			}
			global.GoatBot.config.adminBot = adminList;
			const cfg = await fs.readJson(CONFIG_FILE);
			cfg.adminBot = adminList;
			await fs.writeJson(CONFIG_FILE, cfg, { spaces: 2 });
			const names = await Promise.all(added.map(async id => {
				const u = await usersData.get(id).catch(() => ({ name: "Inconnu" }));
				return `◦ ${u.name || "Inconnu"} [${id}]`;
			}));
			let msg = "";
			if (added.length) msg += `✦ ɴᴏᴜᴠᴇᴀᴜ x ʜᴏᴋᴀɢᴇ ɴᴏᴍᴍᴇ́ ꜱ (${added.length}):\n${names.join("\n")}\n◈ ᴅᴀᴛᴇ: ${getTime("DD/MM/YYYY HH:mm:ss")}\n`;
			if (already.length) msg += `⌀ ᴅᴇ́ᴊᴀ̀ ᴍᴇᴍʙʀᴇ ᴅᴜ ᴄᴏɴꜱᴇɪʟ: ${already.join(", ")}\n`;
			return message.reply(msg.trim());
		}

		if (sub === "remove" || sub === "-r" || sub === "del") {
			const uids = resolveUIDs(args, event, 1);
			if (!uids.length) return message.reply(getLang("noUID"));
			const removed = [], notFound = [];
			for (const uid of uids) {
				const idx = adminList.indexOf(uid);
				if (idx === -1) { notFound.push(uid); continue; }
				adminList.splice(idx, 1);
				removed.push(uid);
			}
			global.GoatBot.config.adminBot = adminList;
			const cfg = await fs.readJson(CONFIG_FILE);
			cfg.adminBot = adminList;
			await fs.writeJson(CONFIG_FILE, cfg, { spaces: 2 });
			const names = await Promise.all(removed.map(async id => {
				const u = await usersData.get(id).catch(() => ({ name: "Inconnu" }));
				return `◦ ${u.name || "Inconnu"} [${id}]`;
			}));
			let msg = "";
			if (removed.length) msg += `✦ ʀᴇᴛɪʀᴇ́ ꜱ ᴅᴜ ᴄᴏɴꜱᴇɪʟ ᴅᴇꜱ ʜᴏᴋᴀɢᴇ (${removed.length}):\n${names.join("\n")}\n`;
			if (notFound.length) msg += `⌀ ɴᴇ ꜰᴀɪᴛ ᴘᴀꜱ ᴘᴀʀᴛɪᴇ ᴅᴜ ᴄᴏɴꜱᴇɪʟ: ${notFound.join(", ")}\n`;
			return message.reply(msg.trim());
		}

		if (sub === "check" || sub === "-c") {
			const mentions = Object.keys(event.mentions || {});
			const id = mentions[0] || event.messageReply?.senderID || (args[1] && /^\d+$/.test(args[1]) ? args[1] : null) || event.senderID;
			const u = await usersData.get(id).catch(() => ({ name: "Inconnu" }));
			const name = u.name || "Inconnu";
			if (adminList.includes(id)) return message.reply(getLang("isAdmin", name, id));
			return message.reply(getLang("isNotAdmin", name, id));
		}

		return message.SyntaxError();
	}
};
					
