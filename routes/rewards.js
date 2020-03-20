const express = require('express');
const router = express.Router();
const user = require("../model/User");
const auth = require('../middleware/verifytoken.js');
const reward = require('../model/Reward.js');



//route to get all my rewards history
router.get('/details', auth, async(req, res) => {
    const userid = req.user._id;
    try {
        const rewards = await reward.find({ referred_by: userid }).populate('referred_to', 'username email first_name', '-__v');
        res.status(200).json({
            success: true,
            rewarddetails: rewards
        })
    } catch (error) {
        res.send(error)
    }


});
























module.exports = router;