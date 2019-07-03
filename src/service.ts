import {
    Message,
    TextEventMessage,
    EventSource
} from '@line/bot-sdk'
import query from './dbClient';

export default class Service {
    async hoge(message: TextEventMessage, source: EventSource): Promise<Message> {
        const result = await query(`INSERT INTO omiyage (name, registered_user_id) VALUES ('${message.text}', '${source.userId}');`);
        return {
            type: 'text',
            text: 'ok' + result.rows[0],
        }
    }
}

