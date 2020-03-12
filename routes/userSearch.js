const express = require('express');
const router = express.Router();
const user = require("../model/User");
const auth = require('../middleware/verifytoken.js');


router.get('/:fullname',function(req,res){
    //send in pattern e.g Sachin-Khadka
    var terms = req.params.fullname.split('-');
    var regexString = "";

    for (let i = 0; i < terms.length; i++)
    {
        regexString += terms[i];
        if (i < terms.length - 1) regexString += '|';
        // console.log(i);
        // console.log(terms.length);
        // console.log(regexString);
    }

   
    var re = new RegExp(regexString, 'ig');
    
    user.aggregate([
    {"$project":{"fullname":{"$concat":["$first_name",{ $cond: {
        if: {
          $eq: ['$middle_name', ""]
        },
        then: {$concat: [" "]},
        else: {$concat: [" ","$middle_name"," "]}
  }},"$last_name"]}}},
    {"$match":{"fullname":re}}
    ]).exec(function(err, results) { 
         if(err){
            return res.status(500).json({success:false,message:err.message});
         }  
         else{
             return res.status(200).json({success:true,message:results});
         }
    } 
    )
})



module.exports = router;