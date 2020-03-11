const express = require('express');
const router = express.Router();
const auth = require('../middleware/verifytoken.js');
const {followers} = require('../model/Follow');
const {privateList} = require('../model/Follow');
const userPosts = require('../model/BitnarePosts');
const {followings} = require('../model/Follow');
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
    
    //return there public posts
    let followerPosts = await Promise.all(followerList.map(async(follower)=>{
        const posts = await userPosts.find({userid:follower.follower._id,poststatus:false});
        return posts;
    })).catch((err)=>console.log(err));

    
    res.status(200).json(followerPosts);
    
});

router.get('/following/posts',auth,async (req,res)=>{
    //get the list of following
    let followingList = await followings.find({user : req.user._id })
    .select('-user -_id')
    .populate({
        path:' following ',
        select: '_id'
    })
    .exec().then(async(followingList)=>{
        return followingList;
    })
    
    //return there public posts
    let followingPosts = await Promise.all(followingList.map(async(following)=>{
        const posts = await userPosts.find({userid:following.following._id,poststatus:false});
        return posts;
    })).catch((err)=>console.log(err));

    
    res.status(200).json(followingPosts);
    
});

router.post('/follower/add/private',auth,async (req,res)=>{
    var followerData = {
        "follower": req.body.follower_id,
        "user": req.user._id
    };
    var privateFollower= new privateList(followerData);
    privateFollower.save().then(function(){
        return res.status(200).json({message:"Added to Private Follower List"});
       }).catch(err => {
        //  following.deleteOne();
        //  follower.deleteOne();
         res.status(500).send(
            err.errors
        );
    }).catch(err => {
        res.status(500).send(
            err.errors
        );
    })
});

router.get('/follower/private/posts',auth,async (req,res)=>{
    //get the list of users who have added you to their private list
    let privatefollowerList = await privateList.find({follower : req.user._id })
    .select('-_id')
    .populate({
        path:'user',
        select: 'username'
    })
    .exec().then(async(privatefollowerList)=>{
        return privatefollowerList;
    })
    
    //return there private posts
    let followingprivatePosts = await Promise.all(privatefollowerList.map(async(privatefollower)=>{
        const privateposts = await userPosts.find({userid:privatefollower.user._id,poststatus:true});
        return privateposts;
    })).catch((err)=>console.log(err));

    
    res.status(200).json(followingprivatePosts);
    
});

module.exports= router;