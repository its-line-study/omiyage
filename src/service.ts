import {
    Message,
    TextEventMessage,
    EventSource
} from '@line/bot-sdk'
import query from './dbClient';

export default class Service {
    buttonTemplate(): Message {
        return {
            type: 'template',
            altText: '',
            template: {
                type: 'buttons',
                thumbnailImageUrl: 'https://placehold.jp/3d4070/ffffff/240x240.jpg?text=TEST',
                title: 'ボタンテンプレートのテスト',
                text: 'ボタンテンプレートのテスト本文',
                actions: [
                    {
                        "type": "message",
                        "label": "Buy",
                        "text": "get"
                    }
                ]
            }
        };
    }
    async select(source: EventSource): Promise<Message> {
        const result = await query(`SELECT name FROM omiyage WHERE registered_user_id = '${source.userId}';`);
        return {
            type: 'text',
            text: result.rows.map((row) => row.name).join('\n')
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
