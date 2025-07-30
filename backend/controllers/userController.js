var UserModel = require("../models/userModel.js");
var PhotoModel = require("../models/photoModel.js");
var CommentModel = require("../models/commentModel.js");
const csrf = require("csurf");

/**
 * userController.js
 *
 * @description :: Server-side logic for managing users.
 */
module.exports = {
    /**
     * userController.list()
     */
    list: function (req, res) {
        UserModel.find(function (err, users) {
            if (err) {
                return res.status(500).json({
                    message: "Error when getting user.",
                    error: err,
                });
            }

            return res.json(users);
        });
    },

    /**
     * userController.show()
     */
    show: function (req, res) {
        var id = req.params.id;

        UserModel.findOne({ _id: id }, function (err, user) {
            if (err) {
                return res.status(500).json({
                    message: "Error when getting user.",
                    error: err,
                });
            }

            if (!user) {
                return res.status(404).json({
                    message: "No such user",
                });
            }

            return res.json(user);
        });
    },

    /**
     * userController.create()
     */
    create: async function (req, res) {
        var user = new UserModel({
            username: req.body.username,
            password: req.body.password,
            email: req.body.email,
            photo_path: "/images/mufasa.png",
        });

        user.save(function (err, user) {
            if (err) {
                return res.status(500).json({
                    message: "Error when creating user",
                    error: err,
                });
            }
            return res.status(201).json(user);
        });
    },

    /**
     * userController.update()
     */
    update: function (req, res) {
        var id = req.params.id;

        UserModel.findOne({ _id: id }, function (err, user) {
            if (err) {
                return res.status(500).json({
                    message: "Error when getting user",
                    error: err,
                });
            }

            if (!user) {
                return res.status(404).json({
                    message: "No such user",
                });
            }

            user.username = req.body.username ? req.body.username : user.username;
            user.password = req.body.password ? req.body.password : user.password;
            user.email = req.body.email ? req.body.email : user.email;
            //user.photo_path = req.body.photo_path ? req.body.photo_path : user.photo_path;
            user.photo_path = "/images/" + req.file.filename ? "/images/" + req.file.filename : user.photo_path;

            user.save(function (err, user) {
                if (err) {
                    return res.status(500).json({
                        message: "Error when updating user.",
                        error: err,
                    });
                }

                return res.json(user);
            });
        });
    },

    /**
     * userController.remove()
     */
    remove: function (req, res) {
        var id = req.params.id;
        UserModel.findByIdAndRemove(id, function (err, user) {
            if (err) {
                return res.status(500).json({
                    message: "Error when deleting the user.",
                    error: err,
                });
            }

            return res.status(204).json();
        });
    },

    login: function (req, res, next) {
        UserModel.authenticate(req.body.username, req.body.password, function (err, user) {
            if (err || !user) {
                var err = new Error("Wrong username or paassword");
                err.status = 401;
                return next(err);
            }
            req.session.userId = user._id;

            return res.json(user);
        });
    },

    profile: function (req, res, next) {
        var userId = req.params.id;
        UserModel.findById(userId).exec(function (error, user) {
            if (error) {
                return next(error);
            } else {
                if (user === null) {
                    var err = new Error("Not authorized, go back!");
                    err.status = 400;
                    return next(err);
                } else {
                    return res.json(user);
                }
            }
        });
    },

    logout: function (req, res, next) {
        if (req.session) {
            req.session.destroy(function (err) {
                if (err) {
                    return next(err);
                } else {
                    return res.status(200).json({});
                }
            });
        } else {
            return res.status(200).json({});
        }
    },

    updatePicture: function (req, res) {
        var id = req.session.userId;

        UserModel.findOne({ _id: id }, function (err, user) {
            if (err) {
                return res.status(500).json({
                    message: "Error when getting user",
                    error: err,
                });
            }

            if (!user) {
                return res.status(404).json({
                    message: "No such user",
                });
            }

            var update = {
                photo_path: "/images/" + req.file.filename ? "/images/" + req.file.filename : user.photo_path,
            };

            UserModel.findOneAndUpdate({ _id: id }, update, { new: true }, function (err, updatedUser) {
                if (err) {
                    return res.status(500).json({
                        message: "Error when updating user.",
                        error: err,
                    });
                }

                return res.json(updatedUser);
            });
        });
    },

    countPictures: function (req, res) {
        var userId = req.params.id;

        PhotoModel.countDocuments({ postedBy: userId }, function (err, count) {
            if (err) {
                res.status(500).json({ error: err });
            } else {
                res.json({ count });
            }
        });
    },

    countComments: function (req, res) {
        var userId = req.params.id;

        CommentModel.countDocuments({ postedBy: userId }, function (err, count) {
            if (err) {
                res.status(500).json({ error: err });
            } else {
                res.json({ count });
            }
        });
    },

    countAllLikes: function (req, res) {
        var userId = req.params.id;
        console.log(userId);

        PhotoModel.find({ postedBy: userId }, function (err, photos) {
            if (err) {
                return res.status(500).json({
                    message: "Error when getting photos.",
                    error: err,
                });
            }

            console.log(photos.length);

            let count = photos.reduce(function (sum, photo) {
                return sum + photo.likedBy.length;
            }, 0);

            console.log(count);

            res.json({ count });
        });
    },

    checkSession: function (req, res) {
        if (req.session && req.session.userId) {
            return res.json({ success: true });
        } else {
            return res.json({ success: false });
        }
    },
};
