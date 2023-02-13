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
const competition = require('./routes/competition');
const questions = require('./routes/question');
const rooms = require('./routes/room');
app.use('/users', user);
app.use('/competition', competition);
app.use('/questions', questions);
app.use('/rooms', rooms);
server.listen(2321);
