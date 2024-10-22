import { wss } from "..";
import { generateID } from "../utils/ids";
import { sendError, sendMessage } from "../modules/messageSending";
import { ChatClient, Payload, Role } from "../utils/types";
import { moderateMessage } from "../modules/moderate";
import { last10Messages } from "../modules/rateLimiting";
import { saveMessageToHistory } from "../modules/history";

export function receivedMessage(client: ChatClient, d: any) {
    const allowedCharacterLimit = client.roles! & Role.Guest ? 300 : 1000;
    if (d.content.length > 2000)
        return sendError(client, 0, `Message too long, max is ${allowedCharacterLimit} characters`);
    if (!d.content || d.content.length === 0) return;
    const moderatedMessage = moderateMessage(d.content);
    if (moderatedMessage.block)
        return sendError(client, 0, "Message blocked due to inappropriate content");
    if (Date.now() - client.lastMessageTimestamp < 1000 && client.roles! & Role.Guest) {
        console.log(`Client ${client.id} is sending messages too quickly. IP: ${client.ipAddress}`);
        client.lastMessageTimestamp = Date.now();
        return sendError(
            client,
            0,
            `You are sending messages too quickly! Wait for 1 second before sending your next message. You can make an account to lift these limitations.`
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
                type: 3,
                userInfo: {
                    username: "System",
                    roles: Role.System,
                    id: "1"
                },
                content: `You have tried to say racist, sexual or brainrotted words in your message. These have been replaced by better words :) (if you keep doing this, you might be banned!)`,
                id: generateID(),
                device: null,
                timestamp: Date.now()
            },
            client
        );
    }

    var type = 0;

    if (client.id === "000665514498199552") {
        type = 4;
    }

    const finalMessage = {
        type: type,
        userInfo: {
            username: client.username!,
            roles: client.roles!,
            id: client.id!
        },
        timestamp: Date.now(),
        content: moderatedMessage.newMessageContent,
        id: generateID(),
        device: client.device
    };
    saveMessageToHistory(finalMessage);
    sendMessage(finalMessage);
    client.lastMessageTimestamp = Date.now();
}
