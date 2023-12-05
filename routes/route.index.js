const express = require('express');
const app = express.Router();


// require('./endpoints/register')(app)
require('./endpoints/ireport')(app)
require('./endpoints/payment')(app)
require('./endpoints/auth')(app)
require('./endpoints/search')(app)
require('./endpoints/notification')(app)
require('./endpoints/status')(app)
require('./endpoints/residence')(app)
require('./endpoints/user')(app)
require('./endpoints/estate')(app)
require('./endpoints/artisan')(app)

module.exports = app;