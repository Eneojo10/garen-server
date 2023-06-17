const express = require('express')
const app = express.Router()


require('./endpoints/register')(app)
require('./endpoints/ireport')(app)
require('./endpoints/payment')(app)
require('./endpoints/auth')(app)
// require('./endpoints/configuration')(app)
// require('./endpoints/search')(app)
// require('./endpoints/filter')(app)
// require('./endpoints/notification')(app)
// require('./endpoints/contentMgt')(app)
// require('/endpoints/post')(app)
// require('/endpoints/reset')(app)
require('./endpoints/residence')(app)
// require('/endpoints/user')(app)
// require('/endpoints/verifyToken')(app)
module.exports = app