const express = require('express');
const router = express.Router();
const user = require("../model/User");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const saltRounds = 10;

//add user
router.post("/addUser", (req, res) => {

    var dob = new Date(req.body.dob);

    var password = req.body.password;

    bcrypt.genSalt(saltRounds, function(err, salt) {
        if (err) {
            throw err
        } else {
            bcrypt.hash(password, salt, function(err, hashedPassword) {
                if (err) {
                    throw err
                } else {

                    data = {

                        "first_name": req.body.first_name,
                        "middle_name": req.body.middle_name,
                        "last_name": req.body.last_name,
                        "dob": dob,
                        "gender": req.body.gender,
                        "hometown": req.body.hometown,
                        "current_city": req.body.current_city,
                        "height": req.body.height,
                        "weight": req.body.weight,
                        "drink": req.body.drink,
                        "smoke": req.body.smoke,
                        "education": req.body.education,
                        "skills": req.body.skills,
                        "job_title": req.body.job_title,
                        "company_name": req.body.company_name,
                        // "user_type"     : req.body.user_type,
                        "email": req.body.email,
                        "username": req.body.username,
                        "password": hashedPassword

                    }

                    var addUser = new user(data);
                    addUser.save().then(function() {
                        res.send({
                            message: "Sucessful "
                        });

                    }).catch(err => {
                        res.status(500).send(
                            err.errors
                        );
                    })
                }

            })
        }
    });
});

//login user
router.post('/login', async function(req, res) {

    if (req.body.username == "") {
        res.json({
            message: "Username is empty"
        });
    } else if (req.body.password == "") {
        res.json({
            message: "Password is empty"
        });

    } else {
        try {
            const users = await user.checkCrediantialsDb(req.body.username, req.body.password);

            if (users) {
                //create and assign token for users
                const token = jwt.sign({ _id: users._id, username: users.username }, "Bitnare", { expiresIn: "1hr" });
                return res.status(200).json({
                    message: "Token created successfully",
                    token: token,

                })


            } else {
                res.json({
                    message: "User not found"
                });
            }
        } catch (e) {
            console.log(e);
        }
    }
});

//get user all
router.get('/getUsers', function(req, res) {
    user.find()
        .select("-__v")
        .select("-password")
        .then(function(users) {
            res.send(users);
        }).catch(function(e) {
            res.send(e);
        });
});

//get user by id
router.get("/fetchUser/:id", function(req, res) {
    var UserId = req.params.id.toString();
    console.log(UserId);

    user.find({
            _id: UserId
        })
        .select("-__v")
        .select("-password")
        .then(function(getuser) {
            if (getuser) {
                var dob = getuser[0].dob;
                var current = new Date();
                var dob = new Date(dob);
                res.send(getuser);
            }
        }).catch(function(e) {
            res.send(e);
        });
});

//update user by id
router.put('/updateUser/:id', function(req, res) {
    UserId = req.params.id.toString();
    user.findByIdAndUpdate(UserId, req.body, {
        new: true
    }).then(function(updateuser) {
        res.send(updateuser);

    }).catch(function(e) {
        res.send(e);
    });
});

//delete user by id
router.delete('/deleteUser/:id', function(req, res) {
    user.findByIdAndDelete(req.params.id).then(function(user) {
        res.json({
            message: "User deleted"
        })
    }).catch(function(e) {
        res.send(e);
    });
});

//search user by skills and interests
router.post('/searchUser', function(req, res) {
    // var skills = req.body.skills;
    var job_title = req.body.job_title;

    user.find({
            // 'skills': new RegExp(skills, 'i'),   
            'job_title': new RegExp(job_title, 'i')

        }).select("-__v")
        .select("-password")
        .select("-tokens")
        .then(function(listing) {
            res.send(listing);
        }).catch(function(e) {
            res.send(e);
        })
});

// //search user by age and location
// router.post('/searchUser', function (req,res){
//     var min_age = req.body.min_age;
//     var max_age = req.body.max_age;

//     var current = new Date();
//     // var min_age = new min_age();
//     console.log(min_age + "-" + max_age);

//     var min = current.getFullYear() - min_age;
//     var max = current.getFullYear() - max_age;

//     var min_range = new Date(min + "-" + current.getUTCMonth() + "-" + current.getUTCDay());
//     var max_range = new Date(max + "-" + current.getUTCMonth() + "-" + current.getUTCDay());

//     console.log(min_range);
//     console.log(max_range);

//     user.find({
//          $or : [{
//         "location" :    { $near :
//             {
//               $geometry : {
//                  type : "Point" ,
//                  coordinates : [req.body.longitude,req.body.latitude] },
//               $maxDistance : 1000*10 // gets users within 10 km maximum distance
//             }
//          },

//         'dob': {
//             $gte: max_range,
//             $lte: min_range
//         }
//     }]

//     }).then(function (listing) {
//         console.log(listing);
//             res.send(listing);
//         }).catch(function (e) {
//             res.send(e)
//     });

// });

module.exports = router;