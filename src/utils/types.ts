import { WebSocket } from "ws";

export const Role = {
    Uninitialised: -2,
    Guest: -1,
    User: 0,
    Embedder: 1,
    Bot: 2,
    Mod: 10,
    Admin: 20
};

export interface ChatClient extends WebSocket {
    ipAddress: string;
    id?: number;
    role?: number;
    username?: string;
}

export type Payload = {
    op: number;
    d: any;
};

export type Opcode = {
    code: number;
    function: (client: ChatClient, d: any) => void;
};
