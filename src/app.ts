import {
    Message,
    Client,
    ClientConfig,
    middleware,
    MiddlewareConfig,
    WebhookEvent,
} from '@line/bot-sdk';
import Express, { Request, Response } from 'express';
import Service from './service';

const clientConfig: ClientConfig = {
    channelAccessToken: process.env.LINE_CHANNEL_ACCESS_TOKEN || '',
};

const middlewareConfig: MiddlewareConfig = {
    channelSecret: process.env.LINE_CHANNEL_SECRET || '',
};

const botClient = new Client(clientConfig);
const botMiddleware = middleware(middlewareConfig);

const app = Express();
const service = new Service();

app.get('/', async (request: Request, response: Response) => {
    return response.status(200).send({text: 'Hello world.'});
});

app.post('/webhook', botMiddleware, (request: Request, response: Response) => {
    console.log('/webhook');
    Promise
        .all(request.body.events.map(handleEvent))
        .then((result) => response.json(result))
        .catch((err) => {
            console.error(err);
            response.status(500).end();
        });
});

async function handleEvent(event: WebhookEvent): Promise<any> {
    if (event.type !== 'message' || event.message.type !== 'text') {
        return Promise.resolve(null);
    }

    var message: Message | Message[];
    switch(event.message.text){
        case 'get':
            message = await service.select(event.source)
            break;
        case 'button':
            message = service.buttonTemplate()
            break;
        case 'carousel':
            message = service.carouselTemplate()
            break;
        case 'profile':
            if(!event.source.userId){
                message = {
                    type: 'text',
                    text: '不明ユーザー'
                }
            }else{
                message = service.profileMessages(
                    await botClient.getProfile(event.source.userId)
                );
            }
            break;
        default:
            message = await service.insert(event.message, event.source)
            break;
    }

    return botClient.replyMessage(
        event.replyToken,
        message
    );
}

export default app;
