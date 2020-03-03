const express = require('express');
const router = express.Router();
const multer = require('multer');
const postModel = require('../model/BitnarePosts.js');
const auth = require('../middleware/verifytoken.js');
//for stroing image destination and filename
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
    const postData = new postModel({
        postdescription: req.body.postdescription,
        postimage: req.files.map(file => {
            const imgPath = file.path;
            return imgPath;

        }),
        userid: userid,

    });
    try {
        const savePost = await postData.save();
        res.status(200).json({
            message: "Post added sucessfully",
            post: savePost
        })
    } catch (error) {
        res.status(500).json({
            error: error
        })
    }
});

//route to fetch all posts  
router.get('/all', async(req, res, next) => {
    try {
        const posts = await postModel.find().select('_id postdescription postdate postimage userid poststatus')
        res.status(200).json({
            posts: posts
        })
    } catch (error) {
        res.status(500).json({
            error: error
        })
    }
});

//route to delete particular user posts
router.delete('/delete/:postid', auth, async(req, res, next) => {
    const postid = req.params.postid;
    try {
        const postDelete = await postModel.remove({ _id: postid });
        res.status(200).json({
            message: "Your post is successfully deleted",

        })

    } catch (error) {
        res.status(500).json({
            error: error
        })
    }
})







router.get('/me', auth, async(req, res) => {
    // View logged in user profile
    res.send(req.user)
})


















module.exports = router;