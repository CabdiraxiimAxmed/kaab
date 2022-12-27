const express = require('express');
const app = express();

// import routes
const user = require('./routes/user');
app.use('/users', user);
app.listen(2321);
