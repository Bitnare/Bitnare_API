const express = require('express');
const router = express.Router();
const auth = require('../middleware/verifytoken.js');
const {followers} = require('../model/Follow');
const {followings} = require('../model/Follow');

router.get('/followers',auth,(req,res)=>{
    followers.find({user : req.user._id })
    .select('-user -_id')
    .populate({
        path:' follower ',
        select: 'username'
    }) 
    .exec(function (err, data) {
        if (err) return handleError(err);
        return res.status(200).json(data);
      });
    
    
});

router.get('/following',auth,(req,res)=>{
    followings.find({user : req.user._id })
    .select('-user -_id')
    .populate({
        path:'following',
        select: 'username'
    }) 
    .exec(function (err, data) {
        if (err) return handleError(err);
        return res.status(200).json(data);
      });
});



router.post('/follow',auth,(req,res)=>{
    var followerData = {
        "follower": req.user._id,
        "user": req.body.follow_id
    };

    var followingData = {  
        "following":req.body.follow_id,
        "user":req.user._id
    }

    let following = new followings(followingData);
    let follower = new followers(followerData);
    
    following.save().then(function() { 
       follower.save().then(function(){
        return res.status(200).json({message:"Succesfully Followed"});
       }).catch(err => {
        //  following.deleteOne();
        //  follower.deleteOne();
         res.status(500).send(
            err.errors
        );
    })
    }).catch(err => {
        res.status(500).send(
            err.errors
        );
    })
});

router.post('/unfollow',auth,(req,res)=>{
    followings.deleteOne({following:req.body.follow_id,
    user:req.user._id}).then(()=>{
        followers.deleteOne({
            follower: req.user._id,user: req.body.follow_id}).then(()=>{
                return res.status(200).json({message:"Unfollowed Succesfully"});
            }).catch((err)=>{
                res.status(500).send(
                    err.errors
                ); 
            });
    })
    .catch((err)=>{
        res.status(500).send(
            err.errors
        );
    });

});

module.exports = router;