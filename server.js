const express = require('express');
const http = require('http');
const client = require('./models/connect');
const app = express();
const server = http.createServer(app);
const { socketConnection } = require('./utils/socket');
// connect to the database
client.connect();

socketConnection(server);

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// import routes
const user = require('./routes/user');
const questions = require('./routes/question');
app.use('/users', user);
app.use('/questions', questions);
server.listen(2321);
