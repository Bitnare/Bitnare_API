const express = require('express');
const router = express.Router();
const postModel = require('../model/BitnarePosts.js');
const auth = require('../middleware/verifytoken.js');

router.post('/add', auth, (req, res) => {

    res.json({
        message: "Aladin motherfuckers"
    })


});






router.get('/me', auth, async(req, res) => {
    // View logged in user profile
    res.send(req.user)
})


















module.exports = router;