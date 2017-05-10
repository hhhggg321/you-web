/**
 * Forgot Password Page
 */

'use strict';

module.exports = function (req, res) {
  var viewFilePath = 'login/reset-password';
  res.render(viewFilePath, {ENV_STAGE:process.env.ENV_STAGE});
};
