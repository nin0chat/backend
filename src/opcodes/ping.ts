import { ChatClient, Payload } from "../utils/types";

export function ping(client: ChatClient) {
    const payload: Payload = {
        op: 3,
        d: {
            t: Date.now()
        }
    };

    client.send(JSON.stringify(payload));
}
