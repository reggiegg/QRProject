var mongoose = require('mongoose');
var PostSchema = mongoose.Schema({
    message: String,
    creationDate: { type: Date, default: Date.now }
});

var PostModel = module.exports = mongoose.model('post', PostSchema);
