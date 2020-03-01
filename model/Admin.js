const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require("bcrypt");
const uniqueValidator = require('mongoose-unique-validator');
const jwt = require('jsonwebtoken');


const adminSchema = new Schema({

    username    :  {
        type:String, 
        required: [true, 'Enter username'], 
        unique: true},
    password    :  {
        type:String, 
        required: [true,'Enter password'],
        minlength: [8,'Enter valid password']
    },
    tokens: [{
        token: {
            type: String,
          
        }
    }]
});

//hashed password
adminSchema.statics.checkCrediantialsDb = async (username, password,callback) => {
    const admin = await Admin.findOne({
        username: username
    });
    if (admin) {
        var hashedPassword= admin.password;
        if(bcrypt.compareSync(password, hashedPassword)) {
          return admin;
        }    
    };
}

//JWT
adminSchema.methods.generateAuthToken = async function (){
    const admin = this;
    const token = jwt.sign(
        {_id: admin._id.toString()}, 
        "bitnare",{
            expiresIn: "60m"
        });
        console.log(token);
        admin.tokens = admin.tokens.concat({
            token:token
        });
        await admin.save();
        return token;
};

adminSchema.plugin(uniqueValidator);
const Admin = mongoose.model("admin", adminSchema);
module.exports = Admin;