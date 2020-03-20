const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const rewardSchema = new Schema({
    referred_by: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    referred_to: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    time: {
        type: Date,
        default: Date.now()


    },
    refer_type: {
        type: String



    },
    cash_earned: {
        type: Number


    }
});

const rewardModel = mongoose.model('Reward', rewardSchema);
module.exports = rewardModel;