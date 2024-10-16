import { WebSocket } from "ws";

export const Role = {
    Guest: 1 << 6,
    User: 1 << 7,
    Bot: 1 << 8,
    System: 1 << 10,
    Mod: 1 << 11,
    Admin: 1 << 12
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
