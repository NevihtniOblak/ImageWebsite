var express = require('express');
var router = express.Router();
var commentController = require('../controllers/commentController.js');
var requiresLogin = require('../middleware/requiresLogin');

//GET
router.get('/', commentController.list);
router.get('/:id', commentController.show);

//POST
router.post('/', requiresLogin,commentController.create);

//PUT
router.put('/:id', requiresLogin, commentController.update);

//DELETE
router.delete('/:id', requiresLogin, commentController.remove);

module.exports = router;
