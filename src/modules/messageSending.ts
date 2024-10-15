import { wss } from "..";
import { ChatClient } from "../utils/types";

type SendMessagePayload = {
    userInfo: {
        username: string;
        role: number;
    };
    content: string;
};

export function sendMessage(d: SendMessagePayload, client?: ChatClient) {
    if (client) {
        client.send(
            JSON.stringify({
                op: 0,
                d
            })
        );
    } else {
        wss.clients.forEach((client) => {
            client.send(
                JSON.stringify({
                    op: 0,
                    d
                })
            );
        });
    }
}
