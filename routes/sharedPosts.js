const express = require('express');
const router = express.Router();
const sharedPosts = require("../model/SharedPosts");
const auth = require('../middleware/verifytoken.js');
const posts = require("../model/BitnarePosts");


router.post("/share", auth, function(req,res){
    const userid = req.user._id;
    const post_id=req.body.postid;
    // const orginal_Ownerid = posts.findById(post_id).select('userid');
    const sharePost = new sharedPosts ({post_id:post_id,userid:userid});
    sharePost.save()
    .then(function(sharePost){
        res.send(sharePost);
    }).catch(function(e){
        res.send(e);
    })
});


router.get('/getSharedPosts',auth,function(req, res) {
    const userid = req.user._id;
    sharedPosts.find({userid:userid})
    .select("-__v")
    .populate('post_id')
    .then(function(sharedPost) {
        res.send(sharedPost);
    }).catch(function(e) {
        res.send(e);
    });
});


router.delete('/unshare',auth, function(req, res) {
    const postid = req.body.postid;
    const userid = req.user._id;
  
    sharedPosts.findOneAndRemove({post_id:postid,userid:userid}).then(function(sharedPosts) {
        res.status(200).json({
            status: true,
            message: "Post unshared"
        })
    }).catch(function(e) {
        res.status(500).json({
            status: false,
            message:e.message
        })
    });
});

module.exports = router;