const express = require('express');
const router = express.Router();
const multer = require('multer');
const postModel = require('../model/BitnarePosts.js');
const auth = require('../middleware/verifytoken.js');
//for storing image destination and filename
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + file.originalname);
    }
});

//filefilter for only selected type of image is inserted to database
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'image/png' ||
        file.mimetype === 'image/jpeg' ||
        file.mimetype === 'image/jpg') {
        cb(null, true)
    } else {
        cb(null, false)
    }
};
const upload = multer({ storage: storage, fileFilter: fileFilter });

//route to create posts 
router.post('/add', auth, upload.array('postimage', 10), async(req, res) => {
    const userid = req.user._id;
    const poststatus = req.body.poststatus;
    try {
        if (poststatus === 'private') {
            const postData = new postModel({
                postdescription: req.body.postdescription,
                postimage: req.files.map(file => {
                    const imgPath = file.path;
                    return imgPath;

                }),
                userid: userid,
                poststatus: true


            });

            const savePost = await postData.save();
            res.status(200).json({
                message: "Post added sucessfully",
                post: savePost
            })


        } else {
            const postData = new postModel({
                postdescription: req.body.postdescription,
                postimage: req.files.map(file => {
                    const imgPath = file.path;
                    return imgPath;

                }),
                userid: userid,
                poststatus: false


            });
            const savePost = await postData.save();
            res.status(200).json({
                message: "Post added sucessfully",
                post: savePost
            })
        }


    } catch (error) {
        res.status(500).json({
            error: error
        })
    }
});

//route to fetch all posts  
router.get('/all', async(req, res, next) => {
    try {
        const posts = await postModel.find().populate('userid', '-password').select('_id postdescription postdate postimage userid poststatus')
        res.status(200).json({
            posts: posts
        })
    } catch (error) {
        res.status(500).json({
            error: error
        })
    }
});

//route to fetch particular user posts
router.get('/myposts', auth, async(req, res, next) => {
    const id = req.user._id;
    try {
        const userposts = await postModel.find({ userid: id }).populate('userid', '-password');
        res.status(200).json({
            myposts: userposts
        })
    } catch (error) {
        res.status(400).json({

            error: error
        })
    }



});

//route to fetch particular any posts with id 

router.get('/:postid', async(req, res, next) => {
    const postid = req.params.postid;
    try {
        const fetchPosts = await postModel.findById({ _id: postid }).populate('userid', '-password');
        res.status(200).json({
            post: fetchPosts

        })
    } catch (error) {
        res.status(500).json({
            error: error
        })
    }
})




//route to update post 
router.patch('/update/:postid', auth, upload.array('postimage', 10), async(req, res) => {
    const userid = req.user._id;
    const postid = req.params.postid;
    const poststatus = req.body.poststatus;
    try {
        if (poststatus === 'private') {
            const updatePost = await postModel.updateOne({ _id: postid }, {
                $set: {
                    postdescription: req.body.postdescription,
                    postimage: req.files.map(file => {
                        const imgPath = file.path;
                        return imgPath;

                    }),
                    poststatus: true
                }
            }).where({ userid: userid });

            res.status(200).json({  
                updatepost: updatePost

            })
        } else {
            const updatePost = await postModel.updateOne({ _id: postid }, {
                $set: {
                    postdescription: req.body.postdescription,
                    postimage: req.files.map(file => {
                        const imgPath = file.path;
                        return imgPath;

                    }),

                    poststatus: false
                }
            }).where({ userid: userid });

            res.status(200).json({
                updatepost: updatePost
            });
        }
    } catch (error) {
        res.status(500).json({
            error: error
        })
    }

})




//route to delete particular user posts
router.delete('/delete/:postid', auth, async(req, res, next) => {
    const postid = req.params.postid;
    const userid = req.user._id;
    try {
        const postDelete = await postModel.remove({ _id: postid }).where({ userid: userid });
        res.status(200).json({
            message: "Your post is successfully deleted",

        })

    } catch (error) {
        res.status(500).json({
            error: error
        })
    }
})



module.exports = router;