var express = require('express');
// Vključimo multer za file upload
var multer = require('multer');
var upload = multer({dest: 'public/images/'});

var router = express.Router();
var photoController = require('../controllers/photoController.js');
var requiresLogin = require('../middleware/requiresLogin');

//GET
router.get('/', photoController.list);
router.get('/:id', photoController.show);

//POST
router.post('/', requiresLogin, upload.single('image'), photoController.create);

//PUT
router.put('/rate', requiresLogin, photoController.rate);
router.put('/flag', requiresLogin, photoController.flag);
router.put('/:id', requiresLogin, photoController.update);

//DELETE
router.delete('/:id', requiresLogin,photoController.remove);

module.exports = router;
