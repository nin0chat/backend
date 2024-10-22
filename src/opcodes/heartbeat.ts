import { ChatClient } from "../utils/types";

export function heartbeat(client: ChatClient) {
    client.lastHeartbeat = Date.now();
}
