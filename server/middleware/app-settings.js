'use strict';
var config = require('../config/environment');

module.exports = function AppSettings (req,res, next) {
    res.locals.appSettings = config.settings;
    next();
}
