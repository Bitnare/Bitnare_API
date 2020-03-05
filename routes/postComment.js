const express = require('express');
const router = express.Router();
const commentModel = require('../model/postComments');
const auth = require('../middleware/verifytoken');





//route to get all comments 
router.get('/all', auth, async(req, res) => {
    try {
        const allComments = await commentModel.find();
        res.status(200).json({
            success: true,
            comment: allComments
        })
    } catch (error) {
        res.send(error);
    }



})

//route to add comment to posts
router.post('/add/:postid', auth, async(req, res) => {
    const userid = req.user._id;
    const postid = req.params.postid;

    try {
        const addComment = new commentModel({
            commentdescription: req.body.commentdescription,
            postid: postid,
            userid: userid
        })
        const savecomment = await addComment.save();
        res.status(200).json({
            Message: "Comment successfully added",
            comments: savecomment,
            success: true

        })
    } catch (error) {
        res.send(error);
    }
})

//route to fetch all comment of particular post
router.get('/:postid', auth, async(req, res) => {
    const postid = req.params.postid;
    const userid = req.user._id;
    try {
        const getComment = await commentModel.find({ postid: postid }).populate('userid', 'username email')
        res.status(200).json({
            success: true,
            comment: getComment


        })
    } catch (error) {
        res.send(error);

    }

});

//route to update comment
router.patch('/update/:commentid', auth, async(req, res, next) => {
    const commentid = req.params.commentid;
    const userid = req.user._id;
    try {
        const updateComment = await commentModel.updateOne({ _id: commentid }, {
            $set: {
                commentdescription: req.body.commentdescription
            }


        })

        res.status(200).json({
            success: true,
            message: "Your comment is updated"
        })

    } catch (error) {
        res.send(error)

    }
})

//route to delete comment 
router.delete('/delete/:commentid', auth, async(req, res) => {
    try {
        const deletecomment = await commentModel.remove({ _id: req.params.commentid });
        res.status(200).json({

            success: true,
            Message: "Sucessfully deleted"

        })
    } catch (error) {
        res.send(error);

    }
});



















module.exports = router;