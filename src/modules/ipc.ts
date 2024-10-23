import { wss } from "..";
import { ChatClient } from "../utils/types";
import { psqlClient } from "./database";

// eslint-disable-next-line @typescript-eslint/no-require-imports
const pgIPC = require("pg-ipc");

export let ipc;

export function initIPC() {
    ipc = new pgIPC(psqlClient);
    ipc.on("kill", (msg) => {
        const { payload } = msg;
        wss.clients.forEach((c) => {
            const client = c as ChatClient;
            if (client.id === payload.target || client.username === payload.target) {
                client.close();
            }
        });
    });
}
