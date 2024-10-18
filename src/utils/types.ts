import { WebSocket } from "ws";

export const Role = {
    Guest: 1 << 0,
    User: 1 << 1,
    Bot: 1 << 2,
    System: 1 << 3,
    Mod: 1 << 4,
    Admin: 1 << 5
};

export interface ChatClient extends WebSocket {
    ipAddress: string;
    id?: string;
    roles?: number;
    username?: string;
    initialised?: boolean;
}

export type Payload = {
    op: number;
    d: any;
};

export type Opcode = {
    code: number;
    function: (client: ChatClient, d: any) => void;
};
