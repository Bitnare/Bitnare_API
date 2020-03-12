const mongoose = require ('mongoose');
const Schema = mongoose.Schema;

const rewardSchema = new Schema ({
    referred_by:{
        type:Schema.Types.ObjectId,
        ref:'User'
    },
    referred_to:{
        type:Schema.Types.ObjectId,
        ref:'User'
    }
});

const rewardModel = mongoose.model('Reward', rewardSchema);
module.exports = rewardModel;