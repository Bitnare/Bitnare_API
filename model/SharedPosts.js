const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const sharedPostsSchema = new Schema({
    post_id:{
        type: Schema.Types.ObjectId,
        ref: 'BitPosts',
    },
    userid: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

const sharedModel = mongoose.model("SharedPosts", sharedPostsSchema);
module.exports = sharedModel;