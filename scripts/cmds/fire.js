const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports.config = {
  name: "fire",
  version: "1.3.0",
  role: 0,
  hasPrefix: true,
  aliases: ["burn", "spongeburn", "burnmeme"],
  description: "Generates a SpongeBob burn meme using the user's profile picture (reply, mention, or self)",
  usage: "fire | fire [@mention] | [reply to message] fire",
  credits: "Chris st",
  cooldown: 5
};

module.exports.run = async function ({ api, event }) {
  const { threadID, messageID, senderID, type, messageReply, mentions } = event;

  const cacheDir = path.join(__dirname, "cache");
  if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir, { recursive: true });

  let uid;
  if (type === "message_reply" && messageReply) {
    uid = messageReply.senderID;
  } else if (mentions && Object.keys(mentions).length > 0) {
    uid = Object.keys(mentions)[0];
  } else {
    uid = senderID;
  }

  const avatarUrl = `https://graph.facebook.com/${uid}/picture?width=512&height=512&access_token=6628568379%7Cc1e620fa708a1d5696fb991c1bde5662`;
  const apiUrl = `https://maybexenos.vercel.app/meme/burn?avatar=${encodeURIComponent(avatarUrl)}`;

  try {
    const response = await axios.get(apiUrl, {
      responseType: "arraybuffer",
      timeout: 20000
    });

    const imgPath = path.join(cacheDir, `burn_${Date.now()}_${uid}.png`);
    fs.writeFileSync(imgPath, Buffer.from(response.data));

    api.sendMessage({
      body: "  🔥          💥          💨",
      attachment: fs.createReadStream(imgPath)
    }, threadID, () => {
      if (fs.existsSync(imgPath)) fs.unlinkSync(imgPath);
    }, messageID);

  } catch (err) {
    console.error("Burn meme error:", err.message || err);

    let errorMsg = "Sorry, failed to generate the burn meme.";
    if (err.code === "ECONNABORTED") {
      errorMsg += "\nRequest timed out.";
    } else if (err.response) {
      errorMsg += `\nAPI responded with status ${err.response.status}.`;
    }

    api.sendMessage(errorMsg + "\nPlease try again later.", threadID, messageID);
  }
};
