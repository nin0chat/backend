import { compare } from "bcrypt";

import { wss } from "..";
import { psqlClient } from "../modules/database";
import { sendError, sendMessage } from "../modules/messageSending";
import { moderateMessage, onlyLettersAndNumbers } from "../modules/moderate";
import { generateID } from "../utils/ids";
import { ChatClient, MemberListUser, MessageTypes, Payload, Role } from "../utils/types";

export async function validateDevice(client: ChatClient, d: any) {
    if (!d.device || !["web", "mobile", "bot"].includes(d.device)) {
        return sendError(client, 1, "Invalid device");
    }
    client.device = d.device;
}

export async function accountInitialisation(client: ChatClient, d: any) {
    if (d.anon) {
        if (!d.username || (d.username as string).length > 30) throw "Invalid username";
        try {
            wss.clients.forEach((cc) => {
                const c = cc as ChatClient;
                if (c.username === d.username) {
                    sendError(client, 1, "Username already taken");
                    throw "Username already taken";
                }
            });
        } catch {
            return;
        }

        const moderatedUsername = moderateMessage(d.username);
        if (moderatedUsername.newMessageContent !== d.username)
            return sendError(client, 1, "Username contains bad words");
        if (!onlyLettersAndNumbers(d.username))
            return sendError(client, 1, "Username contains non alphanumeric chars");

        validateDevice(client, d);

        client.username = d.username;
        client.roles = Role.Guest;
        client.id = generateID();
        client.initialised = true;
        client.send(
            JSON.stringify({
                op: 1,
                d: {
                    type: 0,
                    id: client.id,
                    username: client.username,
                    roles: client.roles
                }
            })
        );
        sendMessage({
            type: 1,
			userInfo: {
				username: client.username!,
				roles: Role.System | client.roles!,
				id: client.id!,
			},
            content: `${client.username} *(guest)* has joined the chat. Say hi!\nCurrently ${
                wss.clients.size
            } user${wss.clients.size === 1 ? " is" : "s are"} online.`,
            id: generateID(),
            device: null,
            timestamp: Date.now()
        });
    } else {
        try {
            if (!d.token) client.close();
            const userID = (d.token as string).split(".")[0];
            const seed = (d.token as string).split(".")[1];
            const token = (d.token as string).split(".")[2];
            // Verify token
            const query = await psqlClient.query(
                "SELECT token FROM tokens WHERE id=$1 AND seed=$2",
                [userID, seed]
            );
            if (query.rows.length === 0) {
                return setTimeout(() => {
                    sendError(client, 1, "Invalid token");
                }, 3000);
            }
            for (const row of query.rows) {
                const verification = await compare(token, row.token);
                if (!verification) {
                    return setTimeout(() => {
                        sendError(client, 1, "Invalid token");
                    }, 3000);
                }
                break;
            }
            // Get user info
            const userQuery = await psqlClient.query("SELECT * FROM users WHERE id=$1", [userID]);
            if (userQuery.rowCount !== 1) return sendError(client, -1, "Could not find user");
            const user = userQuery.rows[0];
            if (!user.activated) return sendError(client, 1, "Account not activated");
            // Initialise client
            validateDevice(client, d);
            client.username = user.username;
            client.id = user.id;
            client.roles = parseInt(user.role);
            client.initialised = true;
            try {
                wss.clients.forEach((cc) => {
                    const c = cc as ChatClient;
                    if (c.username === user.username && (c.roles || -12) & Role.Guest) {
                        sendError(
                            c,
                            1,
                            "As you took the username of a registered user, and that user logged in, you have been disconnected."
                        );
                        c.close();
                    }
                });
            } catch {
                return;
            }
            client.send(
                JSON.stringify({
                    op: 1,
                    d: {
                        type: 0,
                        id: client.id,
                        username: client.username,
                        roles: client.roles,
                        device: client.device
                    }
                })
            );
            sendMessage({
                type: MessageTypes.Join,
                userInfo: {
                    username: client.username!,
                    roles: Role.System | client.roles!,
                    id: client.id!,
                },
                content: `${client.username} has joined the chat. Say hi!\nCurrently ${
                    wss.clients.size
                } user${wss.clients.size === 1 ? " is" : "s are"} online.`,
                id: generateID(),
                device: null,
                timestamp: Date.now()
            });
        } catch {
            client.close();
        }
    }
    const users: MemberListUser[] = [];
    for (const client of wss.clients) {
        const c = client as ChatClient;
        if (!c.initialised) continue;
        users.push({
            id: c.id!,
            username: c.username!,
            roles: c.roles!
        });
    }
    for (const client of wss.clients) {
        client.send(
            JSON.stringify({
                op: 4,
                d: {
                    users
                }
            })
        );
    }
}
