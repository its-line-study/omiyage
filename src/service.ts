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
            text: `oid:${result.oid}, command:${result.command}, fields:${result.fields}, rowCount:${result.rowCount}, rows:${result.rows}`
        }
    }
}
