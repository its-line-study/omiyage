import {
    Profile,
    TextEventMessage,
    EventSource,
    Message
} from '@line/bot-sdk'
import query from './dbClient';

export default class Service {
    profileMessages(profile: Profile): Message[]{
        var ret : Message[] = []
        if(profile.pictureUrl){
            ret.push({
                type: 'image',
                previewImageUrl: profile.pictureUrl,
                originalContentUrl: profile.pictureUrl
            });
        }
        if(profile.displayName){
            ret.push({
                type: 'text',
                text: profile.displayName
            });
        }
        if(profile.statusMessage){
            ret.push({
                type: 'text',
                text: profile.statusMessage
            });
        }
        return ret;
    }
    carouselTemplate(): Message {
        return {
            type: 'template',
            altText: 'test',
            template: {
                type: 'carousel',
                columns: [
                    {
                        text: 'カルーセル1',
                        actions: [
                            {
                                "type": "message",
                                "label": "get",
                                "text": "get"
                            }
                        ]
                    },
                    {
                        text: 'カルーセル2',
                        actions: [
                            {
                                "type": "message",
                                "label": "button",
                                "text": "button"
                            }
                        ]
                    },
                    {
                        text: 'カルーセル3',
                        actions: [
                            {
                                "type": "message",
                                "label": "carousel",
                                "text": "carousel"
                            }
                        ]
                    }
                ]
            }
        };
    }
    buttonTemplate(): Message {
        return {
            type: 'template',
            altText: 'test',
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
