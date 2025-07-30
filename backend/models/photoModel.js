var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var photoSchema = new Schema({
	'name' : String,
	'path' : String,
	'postedBy' : {
	 	type: Schema.Types.ObjectId,
	 	ref: 'user'
	},
	'views' : Number,
	'likes' : Number,
	'content' : String,
	'uploadTime': Date,
	'redFlags': Number,
	'likedBy' : [{
		type: Schema.Types.ObjectId,
		ref: 'user'
	}],
	'dislikedBy' : [{
		type: Schema.Types.ObjectId,
		ref: 'user'
	}],
	'redFlaggedBy' : [{
		type: Schema.Types.ObjectId,
		ref: 'user'
	}]
});

photoSchema.virtual("comments",{
	ref: "comment",
	localField: "_id",
	foreignField: "postedOn",
	justOne: false,
})

module.exports = mongoose.model('photo', photoSchema);
