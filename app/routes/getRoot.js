function getRoot(req, res){
    'use strict';
    res.send('processed: ' + req.query.message);
}

module.exports = getRoot;
