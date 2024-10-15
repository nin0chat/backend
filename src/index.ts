import { WebSocketServer } from "ws";
import { ChatClient, Payload, Role } from "./utils/types";
import { config } from "./config";
import { sendMessage } from "./modules/messageSending";

export const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", function connection(ws: ChatClient) {
    ws.on("error", console.error);

    ws.on("message", function message(data) {
        try {
            const payload: Payload = JSON.parse(data.toString());
        } catch (e) {
            console.error(e);
            ws.close();
        }
    });

    // Initialise client and send system message
    ws.role = Role.Guest;
    sendMessage(
        {
            userInfo: {
                username: "System",
                role: Role.Admin
            },
            content:
                "Welcome to nin0chat! You are currently connected as an unauthenticated guest and cannot talk until you either login or set your username."
        },
        ws
    );
});
