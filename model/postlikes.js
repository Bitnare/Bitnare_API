const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const postSchema = new Schema({
    postid: {
        type: Schema.Types.ObjectId,
        ref: 'Bitposts'

    },
    userid: {
        type: Schema.Types.ObjectId,
        ref: 'User'

    },
    likestatus: {
        type: Boolean,
        default: true
    }

});


const likeModel = mongoose.model('likepost', postSchema);
module.exports = likeModel;