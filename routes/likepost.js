const express = require('express');
const router = express.Router();
const auth = require('../middleware/verifytoken');
const likeModel = require('../model/postlikes');

//route to post likes and unlike in particular posts
router.post('/like/:postid', auth, async(req, res) => {
    const postid = req.params.postid;
    const userid = req.user._id;
    const likestatus = req.body.likestatus;
    try {
        if (likestatus === true) {
            const updatelike = await likeModel.updateOne({ postid: postid }, {

                $set: {
                    likestatus: false
                }
            }).where({ userid: userid });
            res.status(200).json({
                success: true,
                message: "Post unliked",
                info: updatelike
            })


        } else {

            if (likestatus === false) {
                const updatelike = await likeModel.updateOne({ postid: postid }, {

                    $set: {
                        likestatus: true
                    }
                }).where({ userid: userid });
                res.status(200).json({
                    success: true,
                    message: "Post liked",
                    info: updatelike
                })



            } else {
                const likedetails = likeModel({
                    postid: postid,
                    userid: userid,

                })

                const savelike = await likedetails.save()
                res.status(200).json({
                    message: "Post Liked successfully",
                    likeinfo: savelike,
                    success: true

                });

            }

        }
    } catch (error) {
        res.send(error);
    }
});




//route to get likeinfos 
router.get('/likeinfo/:postid', auth, async(req, res) => {
    const postid = req.params.postid;
    const userid = req.user._id;
    try {

        const likeinfo = await likeModel.find({ postid: postid }).where({ likestatus: true })
            .populate('userid', 'username email first_name last_name');
        res.status(200).json({
            success: true,
            message: "like info details",
            likeinfo: likeinfo
        })



    } catch (error) {
        res.send(error);
    }
});

//count likes for particular posts 
router.get('/likecount/:postid', auth, async(req, res) => {
    const postid = req.params.postid;
    try {
        const countLike = await likeModel.count({ postid: postid }).where({ likestatus: true });
        res.status(200).json({
            status: true,
            likecount: countLike
        })

    } catch (error) {
        res.send(error);

    }
});
module.exports = router;