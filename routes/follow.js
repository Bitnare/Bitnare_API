const express = require('express');
const router = express.Router();
const auth = require('../middleware/verifytoken.js');
const {followers} = require('../model/Follow');
const {followings} = require('../model/Follow');
const users = require('../model/User');
router.get('/followers',auth,(req,res)=>{
    followers.find({user : req.user._id })
    .select('-user -_id')
    .populate({
        path:' follower ',
        select: 'username'
    }) 
    .exec(function (err, user) {
        if (err) return handleError(err);
        console.log('The Follower list is %s', JSON.stringify(user));
        // prints "The author is Ian Fleming"
      });
    
    
});

router.get('/following',auth,(req,res)=>{
    followings.find({user : req.user._id })
    .select('-user -_id')
    .populate({
        path:' following ',
        select: 'username'
    }) 
    .exec(function (err, user) {
        if (err) return handleError(err);
        console.log('The Following list is %s', JSON.stringify(user));
        // prints "The author is Ian Fleming"
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
        return res.status(200).json({
        'msg':  'Follwing increased and his followers increased'
        });
       }).catch(err => {
         following.deleteOne();
         follower.deleteOne();
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

module.exports = router;