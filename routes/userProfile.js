const express = require('express');
const router = express.Router();
const user = require("../model/User");
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const multer = require('multer');
const saltRounds = 10;
const auth = require('../middleware/verifytoken.js');


//for storing image destination and filename
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './uploadProfile/');
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

//add user
router.post("/addUser", upload.array('profile_image', 10),(req, res) => {

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
                        "email": req.body.email,
                        "username": req.body.username,
                        "profile_image": req.files.map(file => {
                            const imgPath = file.path;
                            return imgPath;
                        }),
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
router.get('/getUsers', auth, function(req, res) {
    user.find()
        .select("-__v")
        .select("-tokens")
        .select("-password")
        .then(function(users) {
            res.send(users);
        }).catch(function(e) {
            res.send(e);
        });
});

//get user by id
router.get("/fetchUser/:id", auth, function(req, res) {
    var UserId = req.params.id.toString();
    console.log(UserId);

    user.find({
            _id: UserId
        })
        .select("-__v")
        .select("-password")
        .select("-tokens")
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
router.patch('/updateUser/:id', auth, upload.array('profile_picture',10),function(req, res) {
    UserId = req.params.id.toString();
    var updateUser = user.findById(UserId);
    var password = req.body.password;
    bcrypt.genSalt(saltRounds, function(err,salt){
        if (err){
            throw err
        }else{
            bcrypt.hash(password,salt,function(err, hashedPassword){
                if (err){
                    throw err
                }else{
                    req.body.profile_image=req.files.map(file => {
                        const imgPath = file.path;
                        return imgPath; 
                    });
                    req.body.password = hashedPassword
                    updateUser.update(req.body).then(function(updateuser) {
                        res.send({message: "updated"});
                
                    }).catch(function(e) {
                        res.send(e);
                    });
                }
            })
        }
    });
});

router.delete('/deleteUser/:id', auth, (req, res) => {
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

module.exports = router;