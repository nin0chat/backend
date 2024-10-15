import { WebSocketServer } from "ws";
import { ChatClient, Role } from "./utils/types";
import { config } from "./config";

const wss = new WebSocketServer({ port: 8080 });

wss.on("connection", function connection(ws: ChatClient) {
    ws.on("error", console.error);

    ws.on("message", function message(data) {
        console.log("received: %s", data);
    });

    // Initialise client and send system message
    ws.role = Role.Guest;
    ws.send(
        JSON.stringify({
            op: 0,
            d: {
                userInfo: {
                    username: "System",
                    role: Role.Admin
                },
                content:
                    "Welcome to nin0chat! You are currently connected as an unauthenticated guest and cannot talk until you either login or set your username."
            }
        })
    );
});
