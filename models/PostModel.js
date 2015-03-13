var mongoose = require('mongoose');
var PostSchema = mongoose.Schema({
	uid: String,
    message: String,
    creationDate: { type: Date, default: Date.now }
});

var PostModel = module.exports = mongoose.model('post', PostSchema);
