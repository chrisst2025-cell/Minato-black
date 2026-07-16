const axios = require("axios");

const API_BASE = process.env.FF_GIFT_API_URL || "https://ff-gift.onrender.com";
const REQUEST_TIMEOUT_MS = 150_000;

const lastResultMessageBySender = new Map();

module.exports.config = {
  name: "ffclaim",
  aliases: ["claimff", "ffgift"],
  version: "2.0.0",
  author: "chris st",
  role: 0,
  description: {
    en: "ʀᴇ́ᴄᴜᴘᴇ́ʀᴇʀ ᴜɴᴇ ʀᴇ́ᴄᴏᴍᴘᴇɴꜱᴇ ꜰʀᴇᴇ ꜰɪʀᴇ ᴘᴏᴜʀ ᴜɴ ꜱʜɪɴᴏʙɪ",
  },
  category: "game",
  guide: {
    en: "{pn} <ɪᴅ_ᴅᴜ_ꜱʜɪɴᴏʙɪ>",
  },
  cooldowns: 10,
  dependencies: {
    axios: "",
  },
};

module.exports.onStart = async function ({ api, event, args, message }) {
  const { messageID, senderID } = event;
  const uid = (args[0] || "").trim();

  const react = (emoji) => api.setMessageReaction(emoji, messageID, () => {}, true).catch(() => {});

  if (!uid || !/^\d{4,20}$/.test(uid)) {
    return react("❓");
  }

  await react("⏳");

  let apiResult;
  try {
    const response = await axios.post(
      `${API_BASE}/api/v1/dispatch-claim`,
      { uid },
      { timeout: REQUEST_TIMEOUT_MS }
    );
    apiResult = response.data;
  } catch (err) {
    await react("❌");
    const failText =
      err.code === "ECONNABORTED"
        ? "⌀ ʟ'ᴇɴᴠᴏɪ ᴅᴜ ᴘᴀʀᴄʜᴇᴍɪɴ ᴀ ᴘʀɪꜱ ᴛʀᴏᴘ ᴅᴇ ᴛᴇᴍᴘꜱ. ᴠᴇᴜɪʟʟᴇᴢ ʀᴇ́ᴇꜱꜱᴀʏᴇʀ ᴅᴀɴꜱ ǫᴜᴇʟǫᴜᴇꜱ ɪɴꜱᴛᴀɴᴛꜱ, ꜱʜɪɴᴏʙɪ."
        : "⌀ ᴊᴇ ɴ'ᴀɪ ᴘᴀꜱ ᴘᴜ ᴄᴏɴᴛᴀᴄᴛᴇʀ ʟᴇ ꜱᴇʀᴠɪᴄᴇ ᴅᴇꜱ ʀᴇ́ᴄᴏᴍᴘᴇɴꜱᴇꜱ ᴘᴏᴜʀ ʟ'ɪɴꜱᴛᴀɴᴛ. ʀᴇᴘᴏꜱᴇᴢ-ᴠᴏᴜꜱ ᴇᴛ ʀᴇ́ᴇꜱꜱᴀʏᴇᴢ ʙɪᴇɴᴛᴏ̂ᴛ.";
    await deliver(api, message, senderID, failText);
    return;
  }

  const finalText = apiResult.success
    ? `🎉 ʟᴇ ᴘᴀʀᴄʜᴇᴍɪɴ ᴀ ᴇ́ᴛᴇ́ ʟɪᴠʀᴇ́ ᴀᴠᴇᴄ ꜱᴜᴄᴄᴇ̀ꜱ ! ${apiResult.status_message}${apiResult.player_name ? `\n👤 ꜱʜɪɴᴏʙɪ: ${apiResult.player_name}` : ""}`
    : `❌ ᴜɴ ᴏʙꜱᴛᴀᴄʟᴇ ᴀ ʙʟᴏǫᴜᴇ́ ʟ'ᴇɴᴠᴏɪ : ${apiResult.status_message}`;

  await react(apiResult.success ? "✅" : "❌");
  await deliver(api, message, senderID, finalText);
};

async function deliver(api, message, senderID, text) {
  const prevID = lastResultMessageBySender.get(senderID);

  if (prevID) {
    try {
      await api.editMessage(text, prevID);
      return;
    } catch (_) {
      try {
        await api.unsendMessage(prevID);
      } catch (_) {}
    }
  }

  try {
    const sent = await message.reply(text);
    lastResultMessageBySender.set(senderID, sent.messageID);
  } catch (_) {}
    }
