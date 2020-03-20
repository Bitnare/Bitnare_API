const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");
const validator = require('validator');
const uniqueValidator = require('mongoose-unique-validator');


const userSchema = new Schema({

    first_name: {
        type: String,
        required: true
    },
    middle_name: {
        type: String
    },
    last_name: {
        type: String,
        required: true
    },
    // dob         :  {type:Date, 
    //                  default:Date.now(), required: true},
    dob: {
        type: String,
        required: [true, 'Enter your date of birth'],
    },
    gender: {
        type: String,
        required: [true, 'Enter your gender']
    },
    hometown: {
        type: String,
        required: [true, 'Enter your hometown']
    },
    current_city: {
        type: String,
        required: [true, 'Enter your current address']
    },
    height: {
        type: String,
        required: [true, 'Enter your height']
    },
    weight: {
        type: String,
        required: [true, 'Enter your weight']
    },
    drink: {
        type: String,
        required: [true, 'Enter alcohol intake']
    },
    smoke: {
        type: String,
        required: [true, 'Enter smoke information']
    },
    education: {
        type: String,
        required: [true, 'Enter your education level']
    },
    skills: {
        type: String,
        required: [true, 'Enter your skills']
    },
    job_title: {
        type: String
    },
    company_name: {
        type: String
    },
    email: {
        type: String,
        required: [true, 'Enter your email'],
        unique: true,
        lowercase: true,
        validate: {
            validator: validator.isEmail,
            message: 'Enter a valid email',
            isAsync: false
        }
    },
    username: {
        type: String,
        required: [true, 'Enter username'],
        unique: true
    },
    password: {
        type: String,
        required: [true, 'Enter password'],
        minlength: [8, 'Enter valid password']
    },
    location: {
        // GeoJSON Point
        type: {
            type: String,
            enum: ['Point']
        },
        coordinates: {
            type: [Number],
            index: '2dsphere'
        }
    },
    profile_image: {
        type: [String]
    },
    tokens: [{
        token: {
            type: String,
        }
    }],
    code: {
        type: String
    }


});

//hashed password
userSchema.statics.checkCrediantialsDb = async(username, password, callback) => {
    const user = await User.findOne({
        username: username
    });
    if (user) {
        var hashedPassword = user.password;
        if (bcrypt.compareSync(password, hashedPassword)) {
            return user;
        }


    };
};


// //save longitude and latitude of  adress(requires city ,address and zipcode for increased accuracy
// // for example Chabahil, Kathmandu 44602)
// userSchema.pre('save',async function(next){
//     const loc = await geocoder.geocode(this.adress);
//     this.location={
//         type:'Point',
//         coordinates: [loc[0].longitude,loc[0].latitude],
//     }
//     next();
// })



userSchema.plugin(uniqueValidator);
const User = mongoose.model("User", userSchema);
module.exports = User;