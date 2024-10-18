import { WebSocketServer } from "ws";
import { ChatClient, Opcode, Payload, Role } from "./utils/types";
import { config } from "./config";
import { sendMessage } from "./modules/messageSending";
import { accountInitialisation } from "./opcodes/accountInitialisation";
import { receivedMessage } from "./opcodes/receivedMessage";
import { generateID } from "./utils/ids";

export const wss = new WebSocketServer({ port: 8080 });

const opcodes: Opcode[] = [
    {
        code: 0,
        function: receivedMessage
    },
    {
        code: 1,
        function: accountInitialisation
    }
];

wss.on("connection", function connection(ws: ChatClient, req) {
    ws.ipAddress = req.headers["cf-connecting-ip"]?.toString() || req.socket.remoteAddress!;
    ws.on("error", console.error);

    ws.on("message", function message(data) {
        try {
            const payload: Payload = JSON.parse(data.toString());
            const opcode = opcodes.find((o) => o.code === payload.op);
            if (!opcode) throw "Invalid opcode received";
            if (opcode.code !== 1 && !ws.initialised) throw "Attempt to use ws without init";
            opcode.function(ws, payload.d);
        } catch (e) {
            console.error(e);
            ws.close();
        }
    });

    // Initialise client and send system message
    ws.roles = 0;
    sendMessage(
        {
            userInfo: {
                username: "System",
                roles: Role.System
            },
            content:
                "Welcome to nin0chat! You are currently connected as an unauthenticated guest and cannot talk until you either login or set your username.",
            id: generateID()
        },
        ws
    );
});
