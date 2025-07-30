var express = require('express');
var router = express.Router();
var userController = require('../controllers/userController.js');
var multer = require('multer');
var upload = multer({dest: 'public/images/'});
var requiresLogin = require('../middleware/requiresLogin');

//GET
router.get('/', userController.list);
router.get('/checkSession', userController.checkSession);
router.get('/profile/:id', userController.profile);
router.get('/logout', userController.logout);
router.get('/pictureCount/:id', userController.countPictures);
router.get('/commentCount/:id', userController.countComments);
router.get('/allLikes/:id', userController.countAllLikes);
router.get('/:id', userController.show);


//POST
router.post('/', userController.create);
router.post('/login', userController.login);
router.post('/picture', requiresLogin, upload.single('image'), userController.updatePicture);

//PUT
router.put('/:id', requiresLogin, userController.update);

//DELETE
router.delete('/:id', requiresLogin, userController.remove);

module.exports = router;
