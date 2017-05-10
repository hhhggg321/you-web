/**
 * Verify Email Page
 */

'use strict';

module.exports = function (req, res) {
  var viewFilePath = 'login/verify-email';
  res.render(viewFilePath, {ENV_STAGE:process.env.ENV_STAGE});
};
