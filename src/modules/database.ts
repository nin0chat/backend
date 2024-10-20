import pg from "pg";
import { config } from "../config";

const { Client } = pg;
export const psqlClient = new Client({
    user: config.postgresUser,
    password: config.postgresPassword,
    host: config.postgresHost || "127.0.0.1",
    port: config.postgresPort || 5432,
    database: config.postgresDatabase || "nin0chat"
});
psqlClient.connect();
