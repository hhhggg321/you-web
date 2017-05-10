/**
 * Main application routes
 */

'use strict';

// var errors = require('./controller/errors');
var homePage = require('./controller/home');
var login = require('./controller/login');
var register = require('./controller/register');
var acceptInvitation = require('./controller/login/accept-invitation');
var resetPassword = require('./controller/login/reset-password');
var verifyEmail = require('./controller/login/verify-email');
var path = require('path');

module.exports = function(app) {

  // Insert routes below
  //app.use('/api/things', require('./api/thing'));

  // All undefined asset or api routes should return a 404
  // app.route('/:url(api|auth|components|app|bower_components|assets)/*')
  //  .get(errors[404]);

  app.route('/reset-password')
    .get(resetPassword);

  app.route('/verify-email')
    .get(verifyEmail);

  app.route('/accept-invitation')
    .get(acceptInvitation);

  app.route('/login')
    .get(login);

  app.route('/register')
      .get(register);

  app.route('/*')
    .get(homePage);

  //All other routes should redirect to the index.html
  // app.route('/*')
  //   .get(function(req, res) {
  //     res.sendFile(path.resolve(app.get('appPath') + '/index.html'));
  //   });
};
