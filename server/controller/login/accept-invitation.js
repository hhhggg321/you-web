/**
 * Accept Invitation Page
 */

'use strict';

module.exports = function (req, res) {
  var viewFilePath = 'login/accept-invitation';
  res.render(viewFilePath, {ENV_STAGE:process.env.ENV_STAGE});
};
