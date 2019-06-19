import {
    Message,
    TextEventMessage,
    EventSource
} from '@line/bot-sdk'
const pg = require('pg');
const databaseInfo = {connectionString: process.env.DATABASE_URL, ssh: true}

export default class Service {
    async hoge(message: TextEventMessage, source: EventSource): Promise<Message> {
        const client = new pg.Client(databaseInfo);
        client.connect();
        const res = await client.query(`INSERT INTO omiyage (name, registered_user_id) VALUES ('${message.text}', '${source.userId}');`);
        console.log(res.rows);
        client.end();

        return {
            type: 'text',
            text: 'ok',
        }
    }
}

