import { WebSocket } from "ws";

export const Role = {
    Guest: -1,
    User: 0,
    Embedder: 1,
    Bot: 2,
    Mod: 10,
    Admin: 20
};

export interface ChatClient extends WebSocket {
    id?: number;
    role?: number;
    username?: string;
}
