const express = require('express');
const router = express.Router();
const postModel = require('../model/BitnarePosts.js');
const auth = require('../middleware/verifytoken.js');

router.post('/add', auth, async(req, res) => {
    //const id = req.user._id;





});






router.get('/me', auth, async(req, res) => {
    // View logged in user profile
    res.send(req.user)
})


















module.exports = router;