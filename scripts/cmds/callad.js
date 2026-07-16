"use strict";

const { getStreamsFromAttachment, log } = global.utils;
const mediaTypes = ["photo", 'png', "animated_image", "video", "audio"];

module.exports = {
	config: {
		name: "callad",
		aliases: ["calladmin", "rapport", "bug"],
		version: "1.7.0",
		author: "Chris",
		countDown: 5,
		role: 0,
		description: {
			vi: "gửi báo cáo, góp ý, báo lỗi,... của bạn về admin bot",
			en: "ᴇɴᴠᴏʏᴇʀ ᴜɴ ʀᴀᴘᴘᴏʀᴛ, ᴜɴᴇ ꜱᴜɢɢᴇꜱᴛɪᴏɴ ᴏᴜ ᴜɴ ʙᴜɢ ᴀᴜx ᴀᴅᴍɪɴɪꜱᴛʀᴀᴛᴇᴜʀꜱ"
		},
		category: "contacts admin",
		guide: {
			vi: "   {pn} <tin nhắn>",
			en: "   {pn} <ᴍᴇꜱsᴀɢᴇ>"
		}
	},

	langs: {
		vi: {
			missingMessage: "Vui lòng nhập tin nhắn bạn muốn gửi về admin",
			sendByGroup: "\n- Được gửi từ nhóm: %1\n- Thread ID: %2",
			sendByUser: "\n- Được gửi từ người dùng",
			content: "\n\nNội dung:\n─────────────────\n%1\n─────────────────\nPhản hồi tin nhắn này để gửi tin nhắn về người dùng",
			success: "Đã gửi tin nhắn của bạn về %1 admin thành công!\n%2",
			failed: "Đã có lỗi xảy ra khi gửi tin nhắn của bạn về %1 admin\n%2\nKiểm tra console để biết thêm chi tiết",
			reply: "⌖ Phản hồi từ admin %1:\n─────────────────\n%2\n─────────────────\nPhản hồi tin nhắn này để tiếp tục gửi tin nhắn về admin",
			replySuccess: "Đã gửi phản hồi của bạn về admin thành công!",
			feedback: "✎ Phản hồi từ người dùng %1:\n- User ID: %2%3\n\nNội dung:\n─────────────────\n%4\n─────────────────\nPhản hồi tin nhắn này để gửi tin nhắn về người dùng",
			replyUserSuccess: "Đã gửi phản hồi của bạn về người dùng thành công!",
			noAdmin: "Hiện tại bot chưa có admin nào"
		},
		en: {
			missingMessage: "⌀ ᴠᴇᴜɪʟʟᴇᴢ ᴇ́ᴄʀɪʀᴇ ʟᴇ ᴍᴇꜱꜱᴀɢᴇ ǫᴜᴇ ᴠᴏᴜꜱ ꜱᴏᴜʜᴀɪᴛᴇᴢ ᴛʀᴀɴꜱᴍᴇᴛᴛʀᴇ ᴀ̀ ʟ'ᴀᴅᴍɪɴɪꜱᴛʀᴀᴛɪᴏɴ",
			sendByGroup: "\n- ᴇɴᴠᴏʏᴇ́ ᴅᴇᴘᴜɪꜱ ʟᴇ ɢʀᴏᴜᴘᴇ : %1\n- ɪᴅ ᴅᴜ ɢʀᴏᴜᴘᴇ : %2",
			sendByUser: "\n- ᴇɴᴠᴏʏᴇ́ ᴇɴ ᴍᴇꜱꜱᴀɢᴇ ᴘʀɪᴠᴇ́",
			content: "\n\nᴍᴇꜱꜱᴀɢᴇ :\n─────────────────\n%1\n─────────────────\nʀᴇ́ᴘᴏɴᴅᴇᴢ ᴀ̀ ᴄᴇ ᴍᴇꜱꜱᴀɢᴇ ᴘᴏᴜʀ ᴄᴏɴᴛᴀᴄᴛᴇʀ ᴄᴇ ꜱʜɪɴᴏʙɪ",
			success: "🌿 ᴠᴏᴛʀᴇ ᴍᴇꜱꜱᴀɢᴇ ᴀ ᴇ́ᴛᴇ́ ᴛʀᴀɴꜱᴍɪꜱ ᴀᴠᴇᴄ ꜱᴜᴄᴄᴇ̀ꜱ ᴀ̀ %1 ᴀᴅᴍɪɴɪꜱᴛʀᴀᴛᴇᴜʀ(ꜱ) !\n%2",
			failed: "❌ ᴜɴᴇ ᴘᴇʀᴛᴜʀʙᴀᴛɪᴏɴ ᴇꜱᴛ ꜱᴜʀᴠᴇɴᴜᴇ ʟᴏʀꜱ ᴅᴇ ʟ'ᴇɴᴠᴏɪ ᴀ̀ %1 ᴀᴅᴍɪɴɪꜱᴛʀᴀᴛᴇᴜʀ(ꜱ)\n%2\nᴄᴏɴꜱᴜʟᴛᴇᴢ ʟᴀ ᴄᴏɴꜱᴏʟᴇ ᴘᴏᴜʀ ᴘʟᴜꜱ ᴅᴇ ᴅᴇ́ᴛᴀɪʟꜱ",
			reply: "⌖ ʀᴇ́ᴘᴏɴꜱᴇ ᴅᴇ ʟ'ᴀᴅᴍɪɴɪꜱᴛʀᴀᴛᴇᴜʀ %1 :\n─────────────────\n%2\n─────────────────\nʀᴇ́ᴘᴏɴᴅᴇᴢ ᴀ̀ ᴄᴇ ᴍᴇꜱꜱᴀɢᴇ ᴘᴏᴜʀ ᴘᴏᴜʀꜱᴜɪᴠʀᴇ ʟ'ᴇ́ᴄʜᴀɴɢᴇ",
			replySuccess: "🌿 ᴠᴏᴛʀᴇ ʀᴇ́ᴘᴏɴꜱᴇ ᴀ ᴇ́ᴛᴇ́ ᴛʀᴀɴꜱᴍɪꜱᴇ ᴀ̀ ʟ'ᴀᴅᴍɪɴɪꜱᴛʀᴀᴛɪᴏɴ !",
			feedback: "✎ ʀᴇᴛᴏᴜʀ ᴅᴜ ꜱʜɪɴᴏʙɪ %1 :\n- ɪᴅ ᴜᴛɪʟɪꜱᴀᴛᴇᴜʀ : %2%3\n\nᴍᴇꜱꜱᴀɢᴇ :\n─────────────────\n%4\n─────────────────\nʀᴇ́ᴘᴏɴᴅᴇᴢ ᴀ̀ ᴄᴇ ᴍᴇꜱꜱᴀɢᴇ ᴘᴏᴜʀ ʟᴜɪ ʀᴇ́ᴘᴏɴᴅʀᴇ",
			replyUserSuccess: "🌿 ᴠᴏᴛʀᴇ ʀᴇ́ᴘᴏɴꜱᴇ ᴀ ᴇ́ᴛᴇ́ ᴛʀᴀɴꜱᴍɪꜱᴇ ᴀᴜ ꜱʜɪɴᴏʙɪ !",
			noAdmin: "⌀ ʟᴇ ᴠɪʟʟᴀɢᴇ ɴ'ᴀ ᴘᴀꜱ ᴅ'ᴀᴅᴍɪɴɪꜱᴛʀᴀᴛᴇᴜʀ ᴘᴏᴜʀ ʟ'ɪɴꜱᴛᴀɴᴛ"
		}
	},

	onStart: async function ({ args, message, event, usersData, threadsData, api, commandName, getLang }) {
		const { config } = global.GoatBot;
		if (!args[0])
			return message.reply(getLang("missingMessage"));
		const { senderID, threadID, isGroup } = event;
		if (config.adminBot.length == 0)
			return message.reply(getLang("noAdmin"));
		const senderName = await usersData.getName(senderID);
		const msg = "== ✉️ ᴍᴇꜱꜱᴀɢᴇ ᴘᴏᴜʀ ʟ'ᴀᴅᴍɪɴɪꜱᴛʀᴀᴛɪᴏɴ ✉️ =="
			+ `\n- ɴᴏᴍ : ${senderName}`
			+ `\n- ɪᴅ  : ${senderID}`
			+ (isGroup ? getLang("sendByGroup", (await threadsData.get(threadID)).threadName, threadID) : getLang("sendByUser"));

		const formMessage = {
			body: msg + getLang("content", args.join(" ")),
			mentions: [{
				id: senderID,
				tag: senderName
			}],
			attachment: await getStreamsFromAttachment(
				[...event.attachments, ...(event.messageReply?.attachments || [])]
					.filter(item => mediaTypes.includes(item.type))
			)
		};

		const successIDs = [];
		const failedIDs = [];
		const adminNames = await Promise.all(config.adminBot.map(async item => ({
			id: item,
			name: await usersData.getName(item)
		})));

		for (const uid of config.adminBot) {
			try {
				const messageSend = await api.sendMessage(formMessage, uid);
				successIDs.push(uid);
				global.GoatBot.onReply.set(messageSend.messageID, {
					commandName,
					messageID: messageSend.messageID,
					threadID,
					messageIDSender: event.messageID,
					type: "userCallAdmin"
				});
			}
			catch (err) {
				failedIDs.push({
					adminID: uid,
					error: err
				});
			}
		}

		let msg2 = "";
		if (successIDs.length > 0)
			msg2 += getLang("success", successIDs.length,
				adminNames.filter(item => successIDs.includes(item.id)).map(item => ` <@${item.id}> (${item.name})`).join("\n")
			);
		if (failedIDs.length > 0) {
			msg2 += getLang("failed", failedIDs.length,
				failedIDs.map(item => ` <@${item.adminID}> (${adminNames.find(item2 => item2.id == item.adminID)?.name || item.adminID})`).join("\n")
			);
			log.err("CALL ADMIN", failedIDs);
		}
		return message.reply({
			body: msg2,
			mentions: adminNames.map(item => ({
				id: item.id,
				tag: item.name
			}))
		});
	},

	onReply: async ({ args, event, api, message, Reply, usersData, commandName, getLang }) => {
		const { type, threadID, messageIDSender } = Reply;
		const senderName = await usersData.getName(event.senderID);
		const { isGroup } = event;

		switch (type) {
			case "userCallAdmin": {
				const formMessage = {
					body: getLang("reply", senderName, args.join(" ")),
					mentions: [{
						id: event.senderID,
						tag: senderName
					}],
					attachment: await getStreamsFromAttachment(
						event.attachments.filter(item => mediaTypes.includes(item.type))
					)
				};

				api.sendMessage(formMessage, threadID, (err, info) => {
					if (err)
						return message.err(err);
					message.reply(getLang("replyUserSuccess"));
					global.GoatBot.onReply.set(info.messageID, {
						commandName,
						messageID: info.messageID,
						messageIDSender: event.messageID,
						threadID: event.threadID,
						type: "adminReply"
					});
				}, messageIDSender);
				break;
			}
			case "adminReply": {
				let sendByGroup = "";
				if (isGroup) {
					const { threadName } = await api.getThreadInfo(event.threadID);
					sendByGroup = getLang("sendByGroup", threadName, event.threadID);
				}
				const formMessage = {
					body: getLang("feedback", senderName, event.senderID, sendByGroup, args.join(" ")),
					mentions: [{
						id: event.senderID,
						tag: senderName
					}],
					attachment: await getStreamsFromAttachment(
						event.attachments.filter(item => mediaTypes.includes(item.type))
					)
				};

				api.sendMessage(formMessage, threadID, (err, info) => {
					if (err)
						return message.err(err);
					message.reply(getLang("replySuccess"));
					global.GoatBot.onReply.set(info.messageID, {
						commandName,
						messageID: info.messageID,
						messageIDSender: event.messageID,
						threadID: event.threadID,
						type: "userCallAdmin"
					});
				}, messageIDSender);
				break;
			}
			default: {
				break;
			}
		}
	}
};
								  
