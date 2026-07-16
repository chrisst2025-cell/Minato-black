"use strict";

if (!global.autoReactData) global.autoReactData = new Map();

const EMOJIS = [
    "🐍🤕🙎👺😏😩", "😩🌝😪🥲🙂🐤", "😏🍂🪺🤌🙃🐥",
    "😜😝😋😏😌😌😏", "😰😨😥😟😓😿", "😕🫤😯😮😏",
    "💜❤️🧡💥⚡🪴", "✨❤️‍🔥❤️‍🩹❤️‍🩹🗣️👤", "🐥🫦👄👀👂👏",
    "🔥🫁🫂🫶🤌🤙🤟", "❤️💌🩶🖤💜🎊", "✨💥💢💨💤🕳️🌟✨",
    "🫠✨🦋🌈🦄🍭🌸🎀", "🪐☄️🛸🌌🔭🌑🛰️🛡️", "🍓🍰🍦🍩🍪🥤🧁🍮",
    "🦁🐯🦒🐘🦏🐆🦓🦒", "🌊🐚⛵🏝️🐬🐙🐠🦞", "🍄🌿🍃🍀🌱🪴🎋🌻",
    "🎮🕹️👾🏎️🧩🎲🎯🎳", "🎸🎷🥁🎻🎹🎤🎧🎹", "🍕🍔🍟🌮🍣🍜🥗🥘",
    "🧘‍♀️🕯️🫧💎🧿🔮🏺📜", "🏰🎡🎢🎠🎪🎭🎨🎬", "🚀🛰️🛸👽👾🤖🎃👻",
    "🍎🍊🍋🥝🫐🍇🍐🍑", "⚽🏀🏈⚾🥎🎾🏐🏉", "🚗🚕🚙🚌🚎🏎️🚓🚑",
    "☀️🌤️⛅🌦️☁️🌧️⛈️🌩️", "🌹🌷🌻🌼🪷🪻💐🪴", "🧸🪁🪀🪄🎈🎁🎊🎉",
    "💻⌨️🖱️🖨️📱⌚📷🎥", "🏠🏡🏘️🛖🏢🏣🏥🏦", "🦉🦅🦜🕊️🦩🦚🦢🦆",
    "🐉🦖🐢🐊🐍🦎🐙🦞", "🏔️⛰️🌋🗻🪵🌵🌴", "🍵☕🍷🍹🍺🍻🥂🥤",
    "🥐🥖🥨🥯🥞🧇🍳🥓", "🛹🚲🛵🏍️🛶🚤🚢✈️", "🎭🎨🖌️🖍️🧵🧶🪡🧷",
    "🕰️⌛⏳⚖️🕯️🔦🔋🔌", "📓📔📒📕📗📘📙📚", "💍💎💄📿👠👡👢👞",
    "🧗‍♂️🚴‍♀️🏆🥇🥈🥉🏅🎖️", "🎭🎟️🎫🎬🎤🎧🎹", "🧪🧬🔬🔭📡🛰️🛸🌌",
    "🧺🪠🧹🧼🪣🧽🪒🧴", "🔑🗝️🔓🔒🔏🔐🚩", "💌🎀🎁🎈🏮🧧🎐🎎",
    "🧬💊🩹🩺🩸💉🧪", "🧸🧿🪬🧧🎐🪩🪅🪄", "🔱⚜️⚠️♻️🌀🛟🪁",
    "🫂💖💔❤️‍🔥✨❤️‍🩹", "🫀🧠🦷🦴👣👁️👄", "🌆🏙️🌃🌇🌉🌅🎆",
    "🌌🪐🌕🌒🌔🌗🌖🌘", "🌵🌾🌿🍃🍀🍂🍁🥀", "🍄🐚🪸🪹🪺🪨🪵🪴",
];

function isBotAdmin(senderID) {
    const cfg = global.GoatBot?.config;
    if (!cfg) return false;
    const id = String(senderID);
    return (cfg.adminBot     || []).map(String).includes(id)
        || (cfg.devUsers     || []).map(String).includes(id)
        || (cfg.premiumUsers || []).map(String).includes(id);
}

function getState(threadID) {
    return global.autoReactData.get(String(threadID)) || { active: false, mode: "all" };
}

function setState(threadID, active, mode) {
    global.autoReactData.set(String(threadID), { active, mode: mode || "all" });
}

function doReact(api, emoji, messageID, retries = 2) {
    try {
        api.setMessageReaction(emoji, messageID, (err) => {
            if (err && retries > 0) doReact(api, emoji, messageID, retries - 1);
        }, true);
    } catch (_) {
        if (retries > 0) doReact(api, emoji, messageID, retries - 1);
    }
}

module.exports = {
    config: {
        name:        "autoreact",
        aliases:     ["reactall", "ar"],
        version:     "2.1.0",
        author:      "Chris",
        category:    "box",
        role:        0,
        countDown:   5,
        description: { en: "ʀᴇ́ᴀᴄᴛɪᴏɴ ᴀᴜᴛᴏᴍᴀᴛɪǫᴜᴇ ᴀᴜx ᴍᴇꜱꜱᴀɢᴇꜱ — ᴍᴏᴅᴇ ᴀᴅᴍɪɴ ᴏᴜ ᴘᴏᴜʀ ᴛᴏᴜꜱ" },
        guide:       { en: "{pn} on [admin|all]\n{pn} off\n{pn} status" },
    },

    onStart: async function ({ args, event, message }) {
        const threadID = String(event.threadID);
        const senderID = String(event.senderID || "");
        const subCmd   = (args[0] || "").toLowerCase();
        const modeArg  = (args[1] || "all").toLowerCase();
        const state    = getState(threadID);
        const prefix   = global.GoatBot.config.prefix;

        if (!subCmd || subCmd === "status") {
            if (!state.active) return message.reply("ℹ️ ʟ'ᴀᴜᴛᴏ-ʀᴇ́ᴀᴄᴛɪᴏɴ ᴇꜱᴛ ᴀᴄᴛᴜᴇʟʟᴇᴍᴇɴᴛ ᴅᴇ́ꜱᴀᴄᴛɪᴠᴇ́ᴇ.");
            return message.reply(
                "⚡ ᴇ́ᴛᴀᴛ ᴅᴇ ʟ'ᴀᴜᴛᴏ-ʀᴇ́ᴀᴄᴛɪᴏɴ\n" +
                "━━━━━━━━━━━━━━━━━━━━\n" +
                `ꜱᴛᴀᴛᴜᴛ : ACTIVÉ\n` +
                `ᴍᴏᴅᴇ   : ${state.mode === "all" ? "ᴛᴏᴜꜱ ʟᴇꜱ ꜱʜɪɴᴏʙɪꜱ" : "ᴀᴅᴍɪɴɪꜱᴛʀᴀᴛᴇᴜʀꜱ ᴜɴɪǫᴜᴇᴍᴇɴᴛ"}`
            );
        }

        if (!isBotAdmin(senderID)) {
            return message.reply("🔒 ꜱᴇᴜʟ ᴜɴ ᴀᴅᴍɪɴɪꜱᴛʀᴀᴛᴇᴜʀ ᴅᴜ ʙᴏᴛ ᴘᴇᴜᴛ ᴍᴏᴅɪꜰɪᴇʀ ʟ'ᴀᴜᴛᴏ-ʀᴇ́ᴀᴄᴛɪᴏɴ.");
        }

        if (subCmd === "on") {
            const mode = modeArg === "admin" ? "admin" : "all";
            setState(threadID, true, mode);
            return message.reply(
                `🫡⚡ ᴀᴜᴛᴏ-ʀᴇ́ᴀᴄᴛɪᴏɴ ᴀᴄᴛɪᴠᴇ́ᴇ !\n` +
                `📌 ᴍᴏᴅᴇ : ${mode === "all" ? "ᴛᴏᴜꜱ ʟᴇꜱ ꜱʜɪɴᴏʙɪꜱ 🎉" : "ᴀᴅᴍɪɴɪꜱᴛʀᴀᴛᴇᴜʀꜱ ᴜɴɪǫᴜᴇᴍᴇɴᴛ"}\n\n` +
                `💡 ᴄᴏɴꜱᴇɪʟꜱ :\n` +
                `   ${prefix}ar on        → ᴘᴏᴜʀ ᴛᴏᴜꜱ (ᴅᴇ́ꜰᴀᴜᴛ)\n` +
                `   ${prefix}ar on admin  → ᴀᴅᴍɪɴɪꜱᴛʀᴀᴛᴇᴜʀꜱ ᴜɴɪǫᴜᴇᴍᴇɴᴛ`
            );
        }

        if (subCmd === "off") {
            setState(threadID, false, state.mode);
            return message.reply("🤕⚡ ᴀᴜᴛᴏ-ʀᴇ́ᴀᴄᴛɪᴏɴ ᴅᴇ́ꜱᴀᴄᴛɪᴠᴇ́ᴇ !");
        }

        return message.reply(
            `ᴜᴛɪʟɪꜱᴀᴛɪᴏɴ :\n` +
            `  ${prefix}ar on           → ᴘᴏᴜʀ ᴛᴏᴜꜱ\n` +
            `  ${prefix}ar on admin     → ᴀᴅᴍɪɴɪꜱᴛʀᴀᴛᴇᴜʀꜱ ᴜɴɪǫᴜᴇᴍᴇɴᴛ\n` +
            `  ${prefix}ar off          → ᴅᴇ́ꜱᴀᴄᴛɪᴠᴇʀ\n` +
            `  ${prefix}ar status       → ᴠᴇ́ʀɪꜰɪᴇʀ ʟ'ᴇ́ᴛᴀᴛ`
        );
    },

    onChat: async function ({ event, api }) {
        if (!event?.threadID || !event?.messageID) return;

        const threadID = String(event.threadID);
        const senderID = String(event.senderID || "");
        const botID    = String(api.getCurrentUserID?.() || "");

        const state = getState(threadID);
        if (!state.active) return;
        if (senderID === botID) return;
        if (state.mode !== "all" && !isBotAdmin(senderID)) return;

        const emojiStr = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
        const chars    = [...emojiStr];
        const emoji    = chars[Math.floor(Math.random() * chars.length)];
        doReact(api, emoji, event.messageID);
    },
};
