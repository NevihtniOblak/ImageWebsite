var mongoose = require('mongoose');
var Schema   = mongoose.Schema;

var commentSchema = new Schema({
	'content' : String,
	'uploadTime' : Date,
	'postedOn' : {
	 	type: Schema.Types.ObjectId,
	 	ref: 'photo'
	},
	'postedBy' : {
	 	type: Schema.Types.ObjectId,
	 	ref: 'user'
	}
});

module.exports = mongoose.model('comment', commentSchema);
