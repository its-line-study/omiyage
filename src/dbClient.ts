const { Client } = require('pg');

export default new Client({
  connectionString: process.env.DATABASE_URL,
  ssl: true,
});
