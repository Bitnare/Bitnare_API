const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const commentSchema = new Schema({

    commentdescription: {
        type: String
    },
    postid: {
        type: Schema.Types.ObjectId,
        ref: 'BitPosts'

    },
    userid: {
        type: Schema.Types.ObjectId,
        ref: 'User'


    },
    commentdate: {
        type: Date,
        default: Date.now()
    }

});


const commentModel = mongoose.model('comments', commentSchema);
module.exports = commentModel;