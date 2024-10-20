import { wss } from "..";
import { generateID } from "../utils/ids";
import { sendError, sendMessage } from "../modules/messageSending";
import { ChatClient, Payload, Role } from "../utils/types";
import { moderateMessage } from "../modules/moderate";

export function receivedMessage(client: ChatClient, d: any) {
    const allowedCharacterLimit = client.roles! & Role.Guest ? 300 : 1000;
    if (d.content.length > 2000)
        return sendError(client, 0, `Message too long, max is ${allowedCharacterLimit} characters`);
    if (!d.content || d.content.length === 0) return;
    const moderatedMessage = moderateMessage(d.content);
    if (moderatedMessage.block)
        return sendError(client, 0, "Message blocked due to inappropriate content");
    if (moderatedMessage.newMessageContent !== d.content) {
        sendMessage(
            {
                userInfo: {
                    username: "System",
                    roles: Role.System,
                    id: "1"
                },
                content: `You have tried to say racist, sexual or brainrotted words in your message. These have been replaced by better words :) (if you keep doing this, you might be banned!)`,
                id: generateID()
            },
            client
        );
    }
    sendMessage({
        userInfo: {
            username: client.username!,
            roles: client.roles!,
            id: client.id!
        },
        content: moderatedMessage.newMessageContent,
        id: generateID()
    });
}
