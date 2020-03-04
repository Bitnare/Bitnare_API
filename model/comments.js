const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const commentSchema = new Schema({

    commentdescription: {





    }












});


const commentModel = mongoose.model('comments', commentSchema);
module.exports = commentModel;