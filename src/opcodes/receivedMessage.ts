import { wss } from "..";
import { generateID } from "../utils/ids";
import { sendError, sendMessage } from "../modules/messageSending";
import { ChatClient, Payload, Role } from "../utils/types";

export function receivedMessage(client: ChatClient, d: any) {
    const allowedCharacterLimit = client.roles! & Role.Guest ? 300 : 1000;
    if (d.content.length > 2000)
        return sendError(client, 0, `Message too long, max is ${allowedCharacterLimit} characters`);
    sendMessage({
        userInfo: {
            username: client.username!,
            roles: client.roles!
        },
        content: d.content,
        id: generateID()
    });
}
