/**
 * Login Page
 */

'use strict';

module.exports = function (req, res) {
  var viewFilePath = 'login/index';
  res.render(viewFilePath, {ENV_STAGE:process.env.ENV_STAGE});
};
