'use strict';

function getRoot(req, res) {
  res.send('processed: ' + req.query.message);
}

module.exports = getRoot;
