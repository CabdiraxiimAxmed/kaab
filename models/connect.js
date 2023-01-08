const { Client } = require('pg');
const client = new Client({
  user: 'postgres',
  password: 'culusow145632$',
  host: 'localhost',
  database: 'kaab',
  port: 5432,
});

module.exports = client;
