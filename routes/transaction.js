const express = require('express');
const router = express.Router();
const transaction = require('../model/transactions');
const mongoose = require('mongoose');
const auth = require('../middleware/verifytoken');


router.get('/details', auth, async(req, res) => {
    try {
        const userid = req.user._id;
        const totalpoints = await transaction.aggregate([

            { "$match": { "userid": new mongoose.Types.ObjectId(userid) } },
            {
                "$group": {
                    "_id": null,
                    "totalamount": { "$sum": "$credit" }
                }
            }
        ]);
        if (!totalpoints) throw error;

        const transdetail = await transaction.find()
            .populate('userid', 'username email first_name last_name ').where({ userid: userid });
        if (transdetail === null) {
            res.json({
                message: "Your transaction is null"
            })
        };

        res.status(200).json({
            success: true,
            message: "Your total debit points",
            total: totalpoints[0].totalamount,
            transdetail: transdetail

        })

    } catch (error) {
        res.send(error)
    }
})












module.exports = router;