var PhotoModel = require('../models/photoModel.js');
const csrf = require("csurf");


/**
 * photoController.js
 *
 * @description :: Server-side logic for managing photos.
 */
module.exports = {

    /**
     * photoController.list()
     */
    list: function (req, res) {
        PhotoModel.find()
        .populate('postedBy')
        .exec(function (err, photos) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting photo.',
                    error: err
                });
            }
            var data = [];
            data.photos = photos;

            return res.json(photos);
        });
    },

    /**
     * photoController.show()
     */
    show: function (req, res) {
        var id = req.params.id;
        console.log("show backend");
    
        PhotoModel.findOne({_id: id})
            .populate({
                path: 'comments',
                populate: {
                    path: 'postedBy',
                    model: 'user'
                }
            })
            .populate('postedBy')
            .exec(function (err, photo) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when getting photo.',
                        error: err
                    });
                }
    
                if (!photo) {
                    return res.status(404).json({
                        message: 'No such photo'
                    });
                }

                const jsonPhoto = photo.toJSON({ virtuals: true });
                return res.json(jsonPhoto);
            });
    },
    

    /**
     * photoController.create()
     */
    create: function (req, res) {
        console.log("hello");
        var photo = new PhotoModel({
			name : req.body.name,
			path : "/images/"+req.file.filename,
			postedBy : req.session.userId,
			views : 0,
			likes : 0,
            content: req.body.content,
            uploadTime: new Date(),
            redFlags: 0,
            likedBy: [],
            dislikedBy: [],
            redFlaggedBy: []
        });

        photo.save(function (err, photo) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when creating photo',
                    error: err
                });
            }

            return res.status(201).json(photo);
        });
    },

    /**
     * photoController.update()
     */
    update: function (req, res) {
        var id = req.params.id;

        PhotoModel.findOne({_id: id}, function (err, photo) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting photo',
                    error: err
                });
            }

            if (!photo) {
                return res.status(404).json({
                    message: 'No such photo'
                });
            }

            photo.name = req.body.name ? req.body.name : photo.name;
			photo.path = req.body.path ? req.body.path : photo.path;
			photo.postedBy = req.body.postedBy ? req.body.postedBy : photo.postedBy;
			photo.views = req.body.views ? req.body.views : photo.views;
			photo.likes = req.body.likes ? req.body.likes : photo.likes;
            photo.content = req.body.content ? req.body.content : photo.content;
            photo.uploadTime = req.body.uploadTime ? req.body.uploadTime : photo.uploadTime;
            photo.redFlags = req.body.redFlags ? req.body.redFlags : photo.redFlags;
            photo.likedBy = req.body.likedBy ? req.body.likedBy : photo.likedBy;
            photo.dislikedBy = req.body.dislikedBy ? req.body.dislikedBy : photo.dislikedBy;
            photo.redFlaggedBy = req.body.redFlaggedBy ? req.body.redFlaggedBy : photo.redFlaggedBy;


            photo.save(function (err, photo) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating photo.',
                        error: err
                    });
                }

                return res.json(photo);
            });
        });
    },

    /**
     * photoController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;

        PhotoModel.findByIdAndRemove(id, function (err, photo) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when deleting the photo.',
                    error: err
                });
            }

            return res.status(204).json();
        });
    },

    rate: function (req, res) {
        var id = req.body.photoId;
        var userId = req.session.userId;

        console.log("rate backend");
    
        PhotoModel.findOne({_id: id}, function (err, photo) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting photo',
                    error: err
                });
            }
    
            if (!photo) {
                return res.status(404).json({
                    message: 'No such photo'
                });
            }
    
            var action = req.body.action;
    
            if (action === 'like') {

                if(photo.likedBy.includes(userId)){
                    photo.likedBy.remove(userId);
                }
                else{
                    photo.likedBy.push(userId); 
                    photo.dislikedBy.remove(userId)
                }
    

            } else if (action === 'dislike') {

                if(photo.dislikedBy.includes(userId)){
                    photo.dislikedBy.remove(userId);
                }
                else{
                    photo.dislikedBy.push(userId);
                    photo.likedBy.remove(userId)
                }

            }

            photo.likes = photo.likedBy.length - photo.dislikedBy.length;

            photo.save(function (err, updatedPhoto) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating photo.',
                        error: err
                    });
                }
    
                return res.json(updatedPhoto);
            });
        });
    },

    flag: function (req, res) {
        var id = req.body.photoId;
        var userId = req.session.userId;

        console.log(userId)

    
        PhotoModel.findOne({_id: id}, function (err, photo) {
            if (err) {
                return res.status(500).json({
                    message: 'Error when getting photo',
                    error: err
                });
            }
    
            if (!photo) {
                return res.status(404).json({
                    message: 'No such photo'
                });
            }
    
            if(photo.redFlaggedBy.includes(userId)){
                photo.redFlaggedBy.remove(userId);
            }
            else{
                photo.redFlaggedBy.push(userId);
            }
            photo.redFlags = photo.redFlaggedBy.length;

            photo.save(function (err, updatedPhoto) {
                if (err) {
                    return res.status(500).json({
                        message: 'Error when updating photo.',
                        error: err
                    });
                }
    
                return res.json(updatedPhoto);
            });
        });
    }
    
};
