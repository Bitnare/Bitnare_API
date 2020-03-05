const express = require('express');
const router = express.Router();
const auth = require('../middleware/verifytoken.js');
const {followers} = require('../model/Follow');
const userPosts = require('../model/BitnarePosts');

router.get('/follower/posts',auth,(req,res)=>{
    followers.find({user : req.user._id })
    .select('-user -_id')
    .populate({
        path:' follower ',
        select: '_id'
    })
    .exec(function (err, data) {
        if (err) return handleError(err);
        return res.status(200).json(data);
      }); 

});
