"use strict";

const path = require("path");
const fs   = require("fs-extra");
const api  = require("./lib/sifu-api");

const VALID_QUALITIES = ["360", "480", "720", "1080"];
const DEFAULT_QUALITY = "720";
const FALLBACK_LADDER = ["720", "480", "360", "240"];

module.exports = {
    config: {
        name:        "amv",
        aliases:     ["AMV", "animemv", "animevideo", "animeamv"],
        version:     "4.0.0",
        author:      "Chris",
        category:    "media",
        role:        0,
        countDown:   10,
        description: { en: "ʀᴇᴄʜᴇʀᴄʜᴇʀ ᴇᴛ ᴛᴇ́ʟᴇ́ᴄʜᴀʀɢᴇʀ ᴅᴇꜱ AMV ᴇɴ ǫᴜᴀʟɪᴛᴇ́ ʜᴅ" },
        guide:       { en: "{pn} [ʀᴇᴄʜᴇʀᴄʜᴇ|ᴜʀʟ] [-q 360|480|720|1080] [-list]\n{pn} pick <ɴᴜᴍᴇ́ʀᴏ>" },
    },

    onStart: async function ({ args, event, message, api: botApi }) {
        const ctx = {
            reply: message.reply.bind(message),
            event,
            api:   botApi,
        };
        return module.exports._run({ args: args || [], ctx });
    },

    _run: async function ({ args, ctx }) {
        const event = ctx.event || {};

        let mode = "search", quality = DEFAULT_QUALITY, query = "", pickNum = null;
        const rest = [];
        for (let i = 0; i < args.length; i++) {
            const a = args[i].toLowerCase();
            if (a === "-h" || a === "--help" || a === "help") { mode = "help"; break; }
            if (a === "-list" || a === "--list" || a === "list") { mode = "list"; continue; }
            if (a === "pick" || a === "-pick") {
                const n = parseInt(args[i + 1], 10);
                if (!isNaN(n)) { mode = "pick"; pickNum = n; i++; continue; }
            }
            if ((a === "-q" || a === "--quality") && VALID_QUALITIES.includes(args[i + 1])) {
                quality = args[i + 1]; i++; continue;
            }
            rest.push(args[i]);
        }
        query = rest.join(" ").trim();

        if (mode === "help") {
            return api.safeReply(ctx, [
                "🎥 ᴀᴍᴠ — ᴀɪᴅᴇ ᴅᴜ ᴍɪɴᴀᴛᴏ",
                "━━━━━━━━━━━━━━━━━━━━",
                "amv <ʀᴇᴄʜᴇʀᴄʜᴇ>          → ᴛʀᴏᴜᴠᴇʀ ᴇᴛ ᴛᴇ́ʟᴇ́ᴄʜᴀʀɢᴇʀ ʟᴇ ᴍᴇɪʟʟᴇᴜʀ AMV",
                "amv <ʀᴇᴄʜᴇʀᴄʜᴇ> -list    → ᴀꜰꜰɪᴄʜᴇʀ ʟᴇꜱ 6 ᴍᴇɪʟʟᴇᴜʀꜱ ʀᴇ́ꜱᴜʟᴛᴀᴛꜱ",
                "amv pick <ɴ>             → ᴛᴇ́ʟᴇ́ᴄʜᴀʀɢᴇʀ ʟᴇ ɴᴜᴍᴇ́ʀᴏ ɴ ᴅᴇ ʟᴀ ʟɪꜱᴛᴇ",
                "amv <ᴜʀʟ ʏᴏᴜᴛᴜʙᴇ>        → ᴛᴇ́ʟᴇ́ᴄʜᴀʀɢᴇʀ ᴅɪʀᴇᴄᴛᴇᴍᴇɴᴛ",
                "amv -q 360|480|720|1080  → ᴅᴇ́ꜰɪɴɪʀ ʟᴀ ǫᴜᴀʟɪᴛᴇ́ ᴅᴜ ᴠɪꜱᴜᴇʟ",
                "",
                "ᴀᴊᴏᴜᴛᴇ ᴀᴜᴛᴏᴍᴀᴛɪǫᴜᴇᴍᴇɴᴛ 'ᴀɴɪᴍᴇ AMV' ᴀ̀ ʟᴀ ʀᴇᴄʜᴇʀᴄʜᴇ.",
                "ʀᴇ́ᴅᴜᴄᴛɪᴏɴ ᴀᴜᴛᴏᴍᴀᴛɪǫᴜᴇ ꜱɪ ʟᴇ ᴘᴀʀᴄʜᴇᴍɪɴ ᴇꜱᴛ ᴛʀᴏᴘ ʟᴏᴜʀᴅ.",
            ].join("\n"));
        }

        if (!query && mode === "search") {
            return api.safeReply(ctx, [
                "⚠️ ᴠᴇᴜɪʟʟᴇᴢ ꜰᴏᴜʀɴɪʀ ᴜɴᴇ ʀᴇᴄʜᴇʀᴄʜᴇ ᴅ'AMV ᴏᴜ ᴜɴ ʟɪᴇɴ ʏᴏᴜᴛᴜʙᴇ, ꜱʜɪɴᴏʙɪ.",
                "",
                "ᴇxᴇᴍᴘʟᴇꜱ:",
                "  amv naruto",
                "  amv demon slayer -q 720",
                "  amv attack on titan -list",
                "  amv -h",
            ].join("\n"));
        }

        let progressId = null;
        const sendProgress = async (text) => {
            try {
                const m = await api.safeReply(ctx, text);
                if (m?.messageID) progressId = m.messageID;
            } catch (_) {}
        };
        const delProgress = () => {
            if (progressId) { try { ctx.api?.unsendMessage(progressId); } catch (_) {} progressId = null; }
        };
        const react = (e) => {
            try { if (ctx.api && event.messageID) ctx.api.setMessageReaction(e, event.messageID, () => {}, true); } catch (_) {}
        };

        try {
            await api.pruneCache();
            let videoUrl, videoTitle, videoUploader, videoDuration;

            if (mode === "pick") {
                const recalled = api.recallSearch("amv", ctx);
                if (!recalled) return api.safeReply(ctx, "❌ ᴀᴜᴄᴜɴᴇ ʟɪꜱᴛᴇ ᴀᴄᴛɪᴠᴇ ɴ'ᴀ ᴇ́ᴛᴇ́ ᴛʀᴏᴜᴠᴇ́ᴇ.\nᴇxᴇ́ᴄᴜᴛᴇᴢ ᴅ'ᴀʙᴏʀᴅ : amv <ʀᴇᴄʜᴇʀᴄʜᴇ> -list");
                const idx = pickNum - 1;
                if (idx < 0 || idx >= recalled.results.length) {
                    return api.safeReply(ctx, `❌ ᴄʜᴏɪx ɪɴᴠᴀʟɪᴅᴇ. ᴠᴇᴜɪʟʟᴇᴢ ᴄʜᴏɪꜱɪʀ ᴜɴ ɴᴏᴍʙʀᴇ ᴇɴᴛʀᴇ 1 ᴇᴛ ${recalled.results.length}.`);
                }
                const pick = recalled.results[idx];
                videoUrl      = api.normalizeYouTubeUrl(pick.url);
                videoTitle    = pick.title;
                videoUploader = pick.uploader;
                videoDuration = pick.duration;
                api.clearPicker("amv", ctx);
                react("📥");
                await sendProgress(
                    `📥 ᴘʀᴇ́ᴘᴀʀᴀᴛɪᴏɴ ᴅᴜ ᴛᴇ́ʟᴇ́ᴄʜᴀʀɢᴇᴍᴇɴᴛ ᴅᴇ ʟ'AMV...\n\n🎥 ${videoTitle}\n📺 ǫᴜᴀʟɪᴛᴇ́ : ${quality}ᴘ\n\n⏳ ᴠᴇᴜɪʟʟᴇᴢ ᴘᴀᴛɪᴇɴᴛᴇʀ, ᴊᴇ ꜰᴀɪꜱ ᴀᴜ ᴘʟᴜꜱ ᴠɪᴛᴇ...`
                );

            } else if (mode === "list") {
                react("🔍");
                const searchQuery = `${query} anime AMV`;
                await sendProgress(`🔍 ʀᴇᴄʜᴇʀᴄʜᴇ ᴅᴇꜱ AMV ᴇɴ ᴄᴏᴜʀꜱ...\n"${searchQuery}"\n⏳ ᴠᴇᴜɪʟʟᴇᴢ ᴘᴀᴛɪᴇɴᴛᴇʀ, ꜱʜɪɴᴏʙɪ...`);
                const imgPath = path.join(api.config.CACHE_DIR, `amv_list_${Date.now()}.png`);
                const imgResult = await api.downloadSearchImage(
                    "/api/video/search-image",
                    { q: searchQuery, limit: 6, cmd: "amv pick <1-6>" },
                    imgPath,
                );
                delProgress();
                if (!imgResult.results?.length) {
                    react("❌");
                    return api.safeReply(ctx, `❌ ᴀᴜᴄᴜɴ AMV ᴛʀᴏᴜᴠᴇ́ ᴘᴏᴜʀ "${query}".`);
                }
                api.rememberSearch("amv", ctx, imgResult.results, "video");
                react("✅");
                await api.safeReply(ctx, { attachment: fs.createReadStream(imgResult.path) });
                setTimeout(() => fs.unlink(imgResult.path).catch(() => {}), 12_000);
                return;

            } else {
                if (api.isYouTubeUrl(query)) {
                    videoUrl = api.normalizeYouTubeUrl(query);
                    react("📥");
                    await sendProgress(`📥 ʀᴇ́ᴄᴜᴘᴇ́ʀᴀᴛɪᴏɴ ᴅᴇ ʟ'AMV ᴅᴇᴘᴜɪꜱ ʟᴇ ʟɪᴇɴ...\n📺 ǫᴜᴀʟɪᴛᴇ́ : ${quality}ᴘ\n⏳ ᴠᴇᴜɪʟʟᴇᴢ ᴘᴀᴛɪᴇɴᴛᴇʀ...`);
                } else {
                    react("🎥");
                    const searchQuery = `${query} anime AMV`;
                    await sendProgress(`🎥 ʀᴇᴄʜᴇʀᴄʜᴇ ᴅ'ᴜɴ ʙᴇʟ AMV...\n"${searchQuery}"\n⏳ ᴠᴇᴜɪʟʟᴇᴢ ᴘᴀᴛɪᴇɴᴛᴇʀ, ꜱʜɪɴᴏʙɪ...`);
                    const data    = await api.httpGetJson("/api/music/search", { q: searchQuery, limit: 1 });
                    const results = data?.results || [];
                    if (!results.length || !results[0].url) {
                        delProgress();
                        react("❌");
                        return api.safeReply(ctx, `❌ ᴀᴜᴄᴜɴ AMV ᴛʀᴏᴜᴠᴇ́ ᴘᴏᴜʀ "${query}". ᴇꜱꜱᴀʏᴇᴢ ᴅ'ᴀᴜᴛʀᴇꜱ ᴍᴏᴛꜱ-ᴄʟᴇ́ꜱ.`);
                    }
                    const top     = results[0];
                    videoUrl      = api.normalizeYouTubeUrl(top.url);
                    videoTitle    = top.title;
                    videoUploader = top.uploader;
                    videoDuration = top.duration;
                    delProgress();
                    react("📥");
                    await sendProgress(
                        `📥 ᴘʀᴇ́ᴘᴀʀᴀᴛɪᴏɴ ᴅᴜ ᴛᴇ́ʟᴇ́ᴄʜᴀʀɢᴇᴍᴇɴᴛ ᴅᴇ ʟ'AMV...\n\n🎥 ${videoTitle}\n` +
                        `👤 ᴄʜᴀɪ̂ɴᴇ : ${videoUploader || "?"}\n📺 ǫᴜᴀʟɪᴛᴇ́ : ${quality}ᴘ\n\n⏳ ᴠᴇᴜɪʟʟᴇᴢ ᴘᴀᴛɪᴇɴᴛᴇʀ...`
                    );
                }
            }

            const reqIdx = VALID_QUALITIES.indexOf(quality);
            const ladder = [quality, ...FALLBACK_LADDER.filter(q => {
                const i = VALID_QUALITIES.indexOf(q);
                return i !== -1 && i < reqIdx;
            })];
            const videoId = api.extractVideoId(videoUrl);

            if (!videoTitle && videoUrl) {
                try {
                    const info    = await api.getInfo(videoUrl);
                    videoTitle    = info.title;
                    videoUploader = info.uploader;
                    videoDuration = info.duration;
                } catch (_) {}
            }

            let finalResult = null, finalQuality = quality, wasCached = false, finalElapsed = 0;

            for (let i = 0; i < ladder.length; i++) {
                const tryQ = ladder[i];
                let result = videoId ? await api.cacheLookup(videoId, `amv_${tryQ}`, "mp4") : null;
                const cached = !!result;

                if (!result) {
                    const targetPath = videoId
                        ? api.cacheFilenameFor(videoId, `amv_${tryQ}`, "mp4")
                        : path.join(api.config.CACHE_DIR, `tmp_amv_${Date.now()}.mp4`);
                    try {
                        const dl = await api.downloadToDisk("/api/music/video", { url: videoUrl, quality: tryQ }, targetPath);
                        result        = { path: dl.path, size: dl.size };
                        finalElapsed  = dl.elapsedMs;
                    } catch (err) {
                        if (i === ladder.length - 1) throw err;
                        continue;
                    }
                }

                if (result.size < 1024) {
                    await fs.unlink(result.path).catch(() => {});
                    if (i === ladder.length - 1) {
                        delProgress();
                        react("❌");
                        return api.safeReply(ctx, "❌ ʟᴇ ᴛᴇ́ʟᴇ́ᴄʜᴀʀɢᴇᴍᴇɴᴛ ᴀ ᴇ́ᴄʜᴏᴜᴇ́ — ʟᴇ ꜰɪᴄʜɪᴇʀ ᴇꜱᴛ ᴠɪᴅᴇ.");
                    }
                    continue;
                }

                const sizeMB = result.size / (1024 * 1024);
                if (sizeMB <= api.config.MAX_FILE_MB) {
                    finalResult  = result;
                    finalQuality = tryQ;
                    wasCached    = cached;
                    break;
                }

                if (i < ladder.length - 1) {
                    delProgress();
                    await sendProgress(`⚠️ ${tryQ}ᴘ = ${sizeMB.toFixed(1)} ᴍʙ → ʀᴇ́ᴅᴜᴄᴛɪᴏɴ ᴇɴ ᴄᴏᴜʀꜱ ᴠᴇʀꜱ ${ladder[i + 1]}ᴘ...`);
                }
            }

            delProgress();

            if (!finalResult) {
                react("❌");
                return api.safeReply(ctx,
                    `❌ ᴛᴏᴜᴛᴇꜱ ʟᴇꜱ ǫᴜᴀʟɪᴛᴇ́ꜱ ᴅᴇ́ᴘᴀꜱꜱᴇɴᴛ ʟᴀ ʟɪᴍɪᴛᴇ ᴅᴇ ᴍᴇꜱꜱᴇɴɢᴇʀ (${api.config.MAX_FILE_MB} ᴍʙ).\n` +
                    `ᴠᴇᴜɪʟʟᴇᴢ ᴄʜᴏɪꜱɪʀ ᴜɴᴇ ᴠɪᴅᴇ́ᴏ ᴘʟᴜꜱ ᴄᴏᴜʀᴛᴇ ᴏᴜ ᴜɴᴇ ǫᴜᴀʟɪᴛᴇ́ ɪɴꜰᴇ́ʀɪᴇᴜʀᴇ.`
                );
            }

            const fellBack = finalQuality !== quality;
            react("✅");
            await api.safeReply(ctx, {
                body: [
                    "🎥 ᴀᴍᴠ ʀᴇ́ᴄᴜᴘᴇ́ʀᴇ́ ᴀᴠᴇᴄ ꜱᴜᴄᴄᴇ̀ꜱ",
                    "━━━━━━━━━━━━━━━━━━━━",
                    `🎥 ᴛɪᴛʀᴇ      : ${videoTitle    || "?"}`,
                    videoUploader ? `👤 ᴄʜᴀɪ̂ɴᴇ     : ${videoUploader}` : null,
                    videoDuration ? `⏱ ᴅᴜʀᴇ́ᴇ      : ${api.formatDuration(videoDuration)}` : null,
                    `📺 ǫᴜᴀʟɪᴛᴇ́    : ${finalQuality}ᴘ${fellBack ? ` (ᴀᴅᴀᴘᴛᴇ́ ᴅᴇᴘᴜɪꜱ ${quality}ᴘ)` : ""}`,
                    `🔊 ᴀᴜᴅɪᴏ      : ✅ ᴀᴄᴛɪꜰ`,
                    `📦 ᴛᴀɪʟʟᴇ     : ${api.formatBytes(finalResult.size)}`,
                    wasCached ? `⚡ ꜱᴏᴜʀᴄᴇ     : ᴘᴀʀᴄʜᴇᴍɪɴ ᴄᴀᴄʜᴇ́ ⚡` : `⚡ ᴠɪᴛᴇꜱꜱᴇ    : ${api.formatElapsed(finalElapsed)}`,
                ].filter(Boolean).join("\n"),
                attachment: fs.createReadStream(finalResult.path),
            });

        } catch (error) {
            delProgress();
            react("❌");
            console.error("[amv] error:", error.message);
            return api.safeReply(ctx, api.formatError(error));
        }
    },
};
                
