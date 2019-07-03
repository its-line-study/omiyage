import pg from 'pg';
const databaseInfo = {connectionString: process.env.DATABASE_URL, ssh: true}

export default async function query(query: string) {
    const client = new pg.Client(databaseInfo);
    client.connect();
    const res = await client.query(query);
    console.log(res.rows);
    client.end();
    return res;
}
