import { WebSocket } from "ws";

enum Role {
    Guest = -1,
    User = 0,
    Embedder = 1,
    Bot = 2,
    Mod = 10,
    Admin = 20
}

export interface ChatClient extends WebSocket {
    id?: number;
    role?: Role;
    username?: string;
}
