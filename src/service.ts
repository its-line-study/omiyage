import {
    Message,
    TextEventMessage,
    EventSource
} from '@line/bot-sdk'
import query from './dbClient';

export default class Service {
    async select(source: EventSource): Promise<Message> {
        const result = await query(`SELECT text FROM omiyage WHERE registered_user_id = ${source.userId}`);
        return {
            type: 'text',
            text: result.rows.join('\n')
        }
    }
    async insert(message: TextEventMessage, source: EventSource): Promise<Message> {
        const result = await query(`INSERT INTO omiyage (name, registered_user_id) VALUES ('${message.text}', '${source.userId}');`);
        return {
            type: 'text',
            text: `ok, ${result.rowCount} rows inserted!`
        }
    }
}
