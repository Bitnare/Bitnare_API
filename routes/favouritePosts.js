const express = require('express');
const router = express.Router();
const Post = require("../model/FavouritePosts");
const auth = require('../middleware/verifytoken.js');

//add favourites
router.post("/addFavourite/:id", auth, function(req,res){
    const userid = req.user._id;
    const post_id=req.params.id.toString();
    const favPost = new Post ({post_id:post_id,userid:userid});
    favPost.save()
           .then(function(favpost){
               res.send(favpost) ;
           }).catch(function(e){
                res.send(e);
           })
});

//get all favourites
router.get('/getFavourite', function(req, res) {
    const favPost = 
    Post.find()
            .select("-__v")
            .then(function(favPost) {
                res.send(favPost);
            }).catch(function(e) {
                res.send(e);
            });
});

//delete favourite by id
router.delete('/deleteFavourite/:id', function(req, res) {
    Post.findByIdAndDelete(req.params.id).then(function(favPost) {
        res.json({
            message: "Fav deleted"
        })
    }).catch(function(e) {
        res.send(e);
    });
});

module.exports = router;