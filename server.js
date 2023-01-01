const express = require('express');
const client = require('./models/connect');
const app = express();
// connect to the database
client.connect();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// import routes
const user = require('./routes/user');
const questions = require('./routes/question');
app.use('/users', user);
app.use('/questions', questions);
app.listen(2321);
