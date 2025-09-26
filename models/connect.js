const { Client } = require('pg');
const client = new Client({
  user: 'postgres',
  password: '',
  host: 'localhost',
  database: 'kaab',
  port: 5432,
});

module.exports = client;
