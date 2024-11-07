import { wss } from "..";
import { saveMessageToHistory } from "../modules/history";
import { ipc } from "../modules/ipc";
import { sendError, sendMessage } from "../modules/messageSending";
import { moderateMessage } from "../modules/moderate";
import { last10Messages } from "../modules/rateLimiting";
import { generateID } from "../utils/ids";
import { ChatClient, MessageTypes, Payload, Role } from "../utils/types";

export function receivedMessage(client: ChatClient, d: any) {
    const allowedCharacterLimit = client.roles! & Role.Guest ? 300 : 1000;
    if (d.content.length > 2000)
        return sendError(client, 0, `Message too long, max is ${allowedCharacterLimit} characters`);
    if (!d.content || d.content.length === 0) return;
    const moderatedMessage =
        client.roles! & Role.Mod
            ? {
                  newMessageContent: d.content,
                  block: false
              }
            : moderateMessage(d.content);
    if (moderatedMessage.block)
        return sendError(client, 0, "Message blocked due to inappropriate content");
    if (Date.now() - client.lastMessageTimestamp < 1000 && client.roles! & Role.Guest) {
        console.log(`Client ${client.id} is sending messages too quickly. IP: ${client.ipAddress}`);
        client.lastMessageTimestamp = Date.now();
        return sendError(
            client,
            0,
            "You are sending messages too quickly! Wait for 1 second before sending your next message. You can make an account to lift these limitations."
        );
    }
    if (!(client.roles! & Role.Mod) && !(client.roles! & Role.Admin)) {
        const lastMessages = last10Messages.slice(-3);
        if (
            lastMessages.length === 3 &&
            lastMessages.every((msg) => msg === moderatedMessage.newMessageContent)
        ) {
            return sendError(client, 0, "Globally, you cannot repeat messages.");
        }
        last10Messages.push(moderatedMessage.newMessageContent);
        if (last10Messages.length > 10) last10Messages.shift();
        client.last3MessageTimestamps = client.last3MessageTimestamps || [];
        client.last3MessageTimestamps.push(Date.now());
        if (client.last3MessageTimestamps.length > 3) client.last3MessageTimestamps.shift();

        if (
            client.last3MessageTimestamps.length === 3 &&
            client.last3MessageTimestamps[2] - client.last3MessageTimestamps[0] < 2000
        ) {
            return sendError(client, 0, "You are sending messages too quickly.");
        }
    }
    if (moderatedMessage.newMessageContent !== d.content) {
        sendMessage(
            {
                type: MessageTypes.GoodPerson,
                userInfo: {
                    username: "System",
                    roles: Role.System,
                    id: "1"
                },
                content:
                    "You have tried to say racist, sexual or brainrotted words in your message. These have been replaced by better words :) (if you keep doing this, you might be banned!)",
                id: generateID(),
                device: null,
                timestamp: Date.now()
            },
            client
        );
        ipc.notify("createDiscordMessage", {
            channel: "1298785684412436540",
            content: `User **${client.username}** has said something bad. Message: \n\`\`\`\n${d.content}\n\`\`\``
        });
    }

    const finalMessage = {
        type: 0,
        userInfo: {
            username: client.username!,
            roles: client.roles!,
            id: client.id!,
            bridgeMetadata: {}
        },
        timestamp: Date.now(),
        content: moderatedMessage.newMessageContent,
        id: generateID(),
        device: client.device,
		tag: {},
    };
	if (typeof d.tag == "object") Object.assign(finalMessage.tag, d.tag)
    if (d.bridgeMetadata && client.roles! & Role.Mod) {
        finalMessage.userInfo = {
            id: client.id!,
            roles: Role.User,
            username: d.bridgeMetadata.username,
            bridgeMetadata: {
                from: d.bridgeMetadata.from,
                color: d.bridgeMetadata.color
            }
        };
        finalMessage.type = MessageTypes.Bridge;
    }

    saveMessageToHistory(finalMessage);
    sendMessage(finalMessage);
    client.lastMessageTimestamp = Date.now();
}
