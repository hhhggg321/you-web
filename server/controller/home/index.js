/**
 * Home Page
 */

'use strict';

module.exports = function (req, res) {
  var viewFilePath = 'home/index';
  if (req.cookies.token == null) {
    res.redirect('/login');
  }
  else {
    res.render(viewFilePath, {title:'hi'});
  }
};
