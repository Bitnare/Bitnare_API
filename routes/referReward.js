const express = require ('express');
const router = express.Router();
const reward = require ("../model/Reward");
const user = require ("../model/User");
const auth = require ("../middleware/verifytoken");

router.post('/addRefer', function(req,res){
    const userId = req.user._id;
    const code = req.user.code;
    
});

