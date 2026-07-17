"use strict";

const fs = require("fs-extra");
const path = require("path");

const CONFIG_FILE = path.join(process.cwd(), "config.json");

function saveConfig(cfg) {
	fs.writeJsonSync(CONFIG_FILE, cfg, { spaces: 2 });
}

function fmtDate(ts) {
	if (!ts) return "ᴊᴀᴍᴀɪꜱ";
	return new Date(ts).toLocaleString("fr-FR", { timeZone: "Europe/Paris", hour12: false }).replace(",", "");
}

function daysToMs(d) {
	return Math.floor(Number(d)) * 86400000;
}

function resolveUID(arg, event) {
	const mentions = Object.keys(event.mentions || {});
	if (mentions.length) return mentions[0];
	if (event.messageReply) return event.messageReply.senderID;
	if (arg && /^\d{10,}$/.test(arg)) return arg;
	return null;
}

module.exports = {
	config: {
		name: "premium",
		aliases: ["prem"],
		version: "2.0.0",
		author: "Chris",
		countDown: 3,
		role: 2,
		description: { en: "ɢᴇ́ʀᴇʀ ʟᴇꜱ ᴜᴛɪʟɪꜱᴀᴛᴇᴜʀꜱ ᴘʀᴇᴍɪᴜᴍ ᴅᴜ ʙᴏᴛ" },
		category: "owner",
		guide: { en: "{pn} add [@|ᴜɪᴅ|ʀᴇᴘʟʏ] [ᴊᴏᴜʀꜱ]\n{pn} remove [@|ᴜɪᴅ|ʀᴇᴘʟʏ]\n{pn} list | clear\n{pn} check [@|ᴜɪᴅ|ʀᴇᴘʟʏ]\n{pn} expire [@|ᴜɪᴅ] <ᴊᴏᴜʀꜱ>" }
	},

	langs: {
		en: {
			noId:        "⌀ ᴍᴇɴᴛɪᴏɴɴᴇᴢ, ʀᴇ́ᴘᴏɴᴅᴇᴢ ᴏᴜ ꜰᴏᴜʀɴɪꜱꜱᴇᴢ ᴜɴ ᴜɪᴅ ᴠᴀʟɪᴅᴇ",
			noDays:      "⌀ ᴠᴇᴜɪʟʟᴇᴢ ᴇɴᴛʀᴇʀ ᴜɴ ɴᴏᴍʙʀᴇ ᴅᴇ ᴊᴏᴜʀꜱ ᴠᴀʟɪᴅᴇ",
			added:       "✦ ᴀᴄᴄᴇ̀ꜱ ᴘʀᴇᴍɪᴜᴍ ᴀᴄᴄᴏʀᴅᴇ́\n◈ ᴜᴛɪʟɪꜱᴀᴛᴇᴜʀ : %1\n◈ ᴇxᴘɪʀᴀᴛɪᴏɴ : %2",
			alreadyPrem: "⌀ %1 ʙᴇ́ɴᴇ́ꜰɪᴄɪᴇ ᴅᴇ́ᴊᴀ̀ ᴅᴜ ꜱᴛᴀᴛᴜᴛ ᴘʀᴇᴍɪᴜᴍ",
			removed:     "✦ ᴀᴄᴄᴇ̀ꜱ ᴘʀᴇᴍɪᴜᴍ ʀᴇ́ᴠᴏǫᴜᴇ́\n◈ ᴜᴛɪʟɪꜱᴀᴛᴇᴜʀ : %1",
			notPrem:     "⌀ %1 ɴ'ᴇꜱᴛ ᴘᴀꜱ ᴘʀᴇᴍɪᴜᴍ",
			expireSet:   "✦ ᴇxᴘɪʀᴀᴛɪᴏɴ ᴍɪꜱᴇ ᴀ̀ ᴊᴏᴜʀ\n◈ ᴜᴛɪʟɪꜱᴀᴛᴇᴜʀ : %1\n◈ ᴇxᴘɪʀᴇ ʟᴇ    : %2",
			listEmpty:   "⌀ ᴀᴜᴄᴜɴ ꜱʜɪɴᴏʙɪ ᴘʀᴇᴍɪᴜᴍ ᴇɴʀᴇɢɪꜱᴛʀᴇ́",
			cleared:     "✦ %1 ᴜᴛɪʟɪꜱᴀᴛᴇᴜʀ(ꜱ) ᴘʀᴇᴍɪᴜᴍ ʀᴇᴛɪʀᴇ́(ꜱ) ᴀᴠᴇᴄ ꜱᴜᴄᴄᴇ̀ꜱ",
			checkPrem:   "✦ ᴠᴇ́ʀɪꜰɪᴄᴀᴛɪᴏɴ ᴘʀᴇᴍɪᴜᴍ\n◈ ᴜᴛɪʟɪꜱᴀᴛᴇᴜʀ : %1\n◈ ꜱᴛᴀᴛᴜᴛ      : %2\n◈ ᴇxᴘɪʀᴀᴛɪᴏɴ  : %3",
			checkNot:    "⌀ %1 ɴ'ᴀ ᴘᴀꜱ ᴅ'ᴀᴄᴄᴇ̀ꜱ ᴘʀᴇᴍɪᴜᴍ"
		}
	},

	onStart: async function ({ args, message, event, getLang, usersData }) {
		const sub = (args[0] || "").toLowerCase();
		const cfg = global.GoatBot.config;

		if (sub === "add") {
			const uid = resolveUID(args[1], event);
			if (!uid) return message.reply(getLang("noId"));
			const days = args[2] ? Number(args[2]) : null;
			if (cfg.premiumUsers.includes(uid)) return message.reply(getLang("alreadyPrem", uid));
			cfg.premiumUsers.push(uid);
			const raw = fs.readJsonSync(CONFIG_FILE);
			raw.premiumUsers = cfg.premiumUsers;
			let expStr = "ᴊᴀᴍᴀɪꜱ";
			if (days && !isNaN(days) && days > 0) {
				const expireTime = Date.now() + daysToMs(days);
				const data = await usersData.get(uid, "data", {});
				data.premiumExpireTime = expireTime;
				await usersData.set(uid, data, "data");
				expStr = fmtDate(expireTime);
			}
			saveConfig(raw);
			const name = (await usersData.get(uid).catch(() => null))?.name || uid;
			return message.reply(getLang("added", name, expStr));
		}

		if (sub === "remove") {
			const uid = resolveUID(args[1], event);
			if (!uid) return message.reply(getLang("noId"));
			if (!cfg.premiumUsers.includes(uid)) return message.reply(getLang("notPrem", uid));
			cfg.premiumUsers = cfg.premiumUsers.filter(id => id !== uid);
			const raw = fs.readJsonSync(CONFIG_FILE);
			raw.premiumUsers = cfg.premiumUsers;
			saveConfig(raw);
			try {
				const data = await usersData.get(uid, "data", {});
				delete data.premiumExpireTime;
				await usersData.set(uid, data, "data");
			} catch {}
			const name = (await usersData.get(uid).catch(() => null))?.name || uid;
			return message.reply(getLang("removed", name));
		}

		if (sub === "list") {
			const pList = cfg.premiumUsers || [];
			if (!pList.length) return message.reply(getLang("listEmpty"));
			const now = Date.now();
			const lines = await Promise.all(pList.map(async (uid, i) => {
				const u = global.db.allUserData.find(u => u.userID == uid);
				const exp = u?.data?.premiumExpireTime;
				const expStr = exp ? fmtDate(exp) : "ᴘᴇʀᴍᴀɴᴇɴᴛ";
				const badge = exp && exp < now ? "⚠ ᴇxᴘɪʀᴇ́" : "✅";
				return `◦ ${i + 1}. ${u?.name || uid}\n   ᴇxᴘɪʀᴀᴛɪᴏɴ : ${expStr} ${badge}`;
			}));
			return message.reply("✦ ᴍᴇᴍʙʀᴇꜱ ᴘʀᴇᴍɪᴜᴍ [" + pList.length + "] :\n" + lines.join("\n"));
		}

		if (sub === "check") {
			const uid = resolveUID(args[1], event);
			if (!uid) return message.reply(getLang("noId"));
			if (!cfg.premiumUsers.includes(uid)) return message.reply(getLang("checkNot", uid));
			const uRow = global.db.allUserData.find(u => u.userID == uid);
			const exp = uRow?.data?.premiumExpireTime;
			const now = Date.now();
			const status = !exp ? "✅ ᴘᴇʀᴍᴀɴᴇɴᴛ" : exp < now ? "⚠ ᴇxᴘɪʀᴇ́" : "✅ ᴀᴄᴛɪꜰ";
			return message.reply(getLang("checkPrem", uRow?.name || uid, status, exp ? fmtDate(exp) : "ᴊᴀᴍᴀɪꜱ"));
		}

		if (sub === "expire") {
			const uid = resolveUID(args[1], event);
			const days = Number(args[2]);
			if (!uid) return message.reply(getLang("noId"));
			if (!cfg.premiumUsers.includes(uid)) return message.reply(getLang("notPrem", uid));
			if (isNaN(days) || days <= 0) return message.reply(getLang("noDays"));
			const expireTime = Date.now() + daysToMs(days);
			const data = await usersData.get(uid, "data", {});
			data.premiumExpireTime = expireTime;
			await usersData.set(uid, data, "data");
			const name = (await usersData.get(uid).catch(() => null))?.name || uid;
			return message.reply(getLang("expireSet", name, fmtDate(expireTime)));
		}

		if (sub === "clear") {
			const count = cfg.premiumUsers.length;
			for (const uid of cfg.premiumUsers) {
				try {
					const data = await usersData.get(uid, "data", {});
					delete data.premiumExpireTime;
					await usersData.set(uid, data, "data");
				} catch {}
			}
			cfg.premiumUsers = [];
			const raw = fs.readJsonSync(CONFIG_FILE);
			raw.premiumUsers = [];
			saveConfig(raw);
			return message.reply(getLang("cleared", count));
		}

		return message.SyntaxError();
	}
};
