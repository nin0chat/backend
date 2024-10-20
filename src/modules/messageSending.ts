import { wss } from "..";
import { ChatClient } from "../utils/types";

type SendMessagePayload = {
    userInfo: {
        username: string;
        roles: number;
        id: string;
    };
    timestamp?: number;
    content: string;
    id: string;
    device: string | null;
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

export function sendError(client: ChatClient, code: number, message: string) {
    client.send(
        JSON.stringify({
            op: -1,
            d: {
                code,
                message
            }
        })
    );
}
