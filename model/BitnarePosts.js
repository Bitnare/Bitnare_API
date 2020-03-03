const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const postSchema = new Schema({
    postdescription: {
        type: String,
        required: true

    },
    postdate: {
        type: Date,
        default: Date.now

    },
    userid: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    poststatus: {
        type: Boolean,
        default: false

    }
});

const postModel = mongoose.model("BitPosts", postSchema);
module.exports = postModel;