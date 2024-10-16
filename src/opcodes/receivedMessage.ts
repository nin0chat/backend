import { wss } from "..";
import { sendError, sendMessage } from "../modules/messageSending";
import { ChatClient, Payload, Role } from "../utils/types";

export function receivedMessage(client: ChatClient, d: any) {
    const allowedCharacterLimit = client.role === Role.Guest ? 300 : 1000;
    if (d.content.length > 2000)
        return sendError(client, 0, `Message too long, max is ${allowedCharacterLimit} characters`);
    sendMessage({
        userInfo: {
            username: client.username!,
            role: client.role!
        },
        content: d.content
    });
}
