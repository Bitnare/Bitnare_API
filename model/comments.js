const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const commentSchema = new Schema({














});


const commentModel = mongoose.model('comments', commentSchema);
module.exports = commentModel;