const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const favouriteSchema = new Schema({
    post_id:{
        type: Schema.Types.ObjectId,
        ref: 'BitPosts'
    },
    userid: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    }
});

const postModel = mongoose.model("FavPosts", favouriteSchema);
module.exports = postModel;