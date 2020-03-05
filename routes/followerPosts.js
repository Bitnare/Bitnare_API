const express = require('express');
const router = express.Router();
const auth = require('../middleware/verifytoken.js');
const {followers} = require('../model/Follow');
const userPosts = require('../model/BitnarePosts');

router.get('/follower/posts',auth,async (req,res)=>{
    //get the list of followers
    let followerList = await followers.find({user : req.user._id })
    .select('-user -_id')
    .populate({
        path:' follower ',
        select: '_id'
    })
    .exec().then(async(followerList)=>{
        return followerList;
    })
    
    //return there posts
    let followerPosts = await Promise.all(followerList.map(async(follower)=>{
        const posts = await userPosts.find({userid:follower.follower._id});
        return posts;
    })).catch((err)=>console.log(err));

    
    res.status(200).json(followerPosts);
    
});

module.exports= router;