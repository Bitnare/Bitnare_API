const express = require('express');
const router = express.Router();
const user = require("../model/User");
const auth = require('../middleware/verifytoken.js');
const geocoder = require('../utils/geocoder');

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

//search user through address and distance
// pass in the current address of the user in the request which may be comming from browser or mobile
// in the url
router.get('/:address/:distance',async (req,res)=>{
    const {address,distance} = req.params;
    // get longitude and latiude from geolocation
    try{
    const loc = await geocoder.geocode(address);
    const latitude= loc[0].latitude;
    const longitude = loc[0].longitude;

    // Calc radius using radians
    // Divide distance by radius of earth
    // Earth radius = 6,378 km
    const radius = distance / 6378 ;
    
    //find users by current adress and km
    const users = await user.find({
        location:{
            $geoWithin : { $centerSphere:[[longitude,latitude],radius]}
        }
    });

    res.status(200).json({
        success:true,
        count:users.length,
        data :users
    });
    }
    catch(e){
        res.status(200).json({
            success:false,
            data:e
    });
    }

})

// search user through longitude and latitude
router.post('/searchUser',async function (req, res){
    try{
      const sphere=  [req.body.longitude,req.body.latitude];
      console.log(sphere);

    const users= await user.find({
        location:{
            $near :
            {
                $geometry : {
                   type : "Point" ,
                   coordinates : [parseFloat(req.body.longitude),parseFloat(req.body.latitude)] }, // gets users within 10 km maximum distance
              }
         }   
    });
    res.status(200).json({
        success:true,
        count:users.length,
        data :users
    });
}
catch(e){
    res.status(200).json({
        success:false,
        data:e
});
}
});


module.exports = router;