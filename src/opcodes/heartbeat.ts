import { ChatClient } from "../utils/types";

export function heartbeat(client: ChatClient, d: any) {
    client.lastHeartbeat = Date.now();
}
