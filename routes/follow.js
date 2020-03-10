const express = require('express');
const router = express.Router();
const auth = require('../middleware/verifytoken.js');
const {followers} = require('../model/Follow');
const {followings} = require('../model/Follow');
const {privateList} = require('../model/Follow');



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
    if(req.body.follow_id === req.user._id){
        res.status(500).send({
            success:false,
            msg:'You cannot follow yourself'
        }
        );
    }
    else{
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
}
});

router.post('/unfollow',auth,(req,res)=>{   
    followings.findOneAndRemove({following:req.body.follow_id,user:req.user._id})
    .exec()
    .then(function(followings){
        if(!followings){
            throw Error("Could not be unfollowed");
        }      
    })
    .then(followers.findOneAndRemove({follower: req.user._id,user: req.body.follow_id}).exec()
    .then(function(followers){
        if(!followers){
            throw Error("Could not be unfollowed");
        }    
    }))
    .then(privateList.findOneAndRemove({user :req.body.follow_id ,follower:req.user._id}).exec()
    .then(function(privateFollowers){
        if(!privateFollowers){
            return res.status(200).json({status:true,userStatus:"Not on the private list",message:"Succesfully unfollowed"})
        }
        else{
            return res.status(200).json({status:true,userStatus:"On the private list",message:"Succesfully unfollowed"})
        }
    }))
    .catch(function(err){
           return res.status(500).json({status:false,message:err.message})
        })     
    }
    );

module.exports = router;