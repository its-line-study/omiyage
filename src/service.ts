import {
    TextEventMessage,
    EventSource,
    TemplateMessage,
    TextMessage
} from '@line/bot-sdk'
import query from './dbClient';

export default class Service {
    buttonTemplate(): TemplateMessage {
        return {
            type: 'template',
            altText: '',
            template: {
                type: 'buttons',
                text: 'ボタンテンプレートのテスト本文',
                actions: [
                    {
                        "type": "message",
                        "label": "get",
                        "text": "get"
                    }
                ]
            }
        };
    }
    async select(source: EventSource): Promise<TextMessage> {
        const result = await query(`SELECT name FROM omiyage WHERE registered_user_id = '${source.userId}';`);
        return {
            type: 'text',
            text: result.rows.map((row) => row.name).join('\n')
        }
    }

    async insert(message: TextEventMessage, source: EventSource): Promise<TextMessage> {
        const result = await query(`INSERT INTO omiyage (name, registered_user_id) VALUES ('${message.text}', '${source.userId}');`);
        return {
            type: 'text',
            text: `ok, ${result.rowCount} rows inserted!`
        }
    }
}
