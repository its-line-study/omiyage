import {
    Client,
    ClientConfig,
    middleware,
    MiddlewareConfig,
    WebhookEvent,
} from '@line/bot-sdk';
import Express, { Request, Response } from 'express';
import Service from './service';
const pg = require('pg');
const databaseInfo = {connectionString: process.env.DATABASE_URL, ssh: true}

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
    const client = new pg.Client(databaseInfo);
    client.connect();
    const res = await client.query('SELECT * from test;');
    console.log(res.rows);
    client.end();
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

    // const message = event.message.text === '1' ? 'A' : 'B';

    /**
     * TODO イベントの判定を別に
     * TODO DBアクセスは別ファイルに分けたい
     * TODO ロジック
     */

    return botClient.replyMessage(
        event.replyToken,
        await service.hoge(event.message, event.source)
    );
}

export default app;

