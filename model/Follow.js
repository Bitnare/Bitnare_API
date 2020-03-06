const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const followersSchema = new Schema({
    user: {type: Schema.Types.ObjectId,ref: 'User'},
    follower : {type:Schema.Types.ObjectId,ref:'User'}
});

const followingSchema = new Schema({
    user: {type: Schema.Types.ObjectId,ref: 'User'},
    following : {type:Schema.Types.ObjectId,ref:'User'}
});

const privateListSchema = new Schema({
    user:{type:Schema.Types.ObjectId,ref:'User'},
    follower:{type:Schema.Types.ObjectId,ref:'User'}
});

const followersExport = mongoose.model("Followers", followersSchema);
const followingExport = mongoose.model("Following", followingSchema);
const privateListExport = mongoose.model("PrivateList",privateListSchema);
module.exports = {
    followers: followersExport,
    followings: followingExport,
    privateList: privateListExport
}