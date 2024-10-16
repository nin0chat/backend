import { wss } from "..";
import { sendError, sendMessage } from "../modules/messageSending";
import { ChatClient, Payload, Role } from "../utils/types";

export function accountInitialisation(client: ChatClient, d: any) {
    if (d.anon) {
        if (!d.username || (d.username as String).length > 30) throw "Invalid username";
        try {
            wss.clients.forEach((cc) => {
                const c = cc as ChatClient;
                if (c.username === d.username) {
                    sendError(client, 1, "Username already taken");
                    throw "Username already taken";
                }
            });
        } catch {
            return;
        }
        client.username = d.username;
        client.role = -1;
        client.id = Math.floor(Math.random() * 1000000);
        sendMessage({
            userInfo: {
                username: "System",
                role: Role.Bot
            },
            content: `${client.username} *(guest)* has joined the chat. Say hi!\nCurrently ${
                wss.clients.size
            } user${wss.clients.size === 1 ? " is" : "s are"} online.`
        });
    }
}
