const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const transactionSchema = new Schema({
    userid: {
        type: Schema.Types.ObjectId,
        ref: 'User'

    },
    debit: {
        type: Number,
        default: 0


    },
    credit: {
        type: Number,
    },
    transaction_type: {
        type: String
    },

    date: {
        type: Date,
        default: Date.now()

    }
});

const transactionModel = mongoose.model('transaction', transactionSchema);
module.exports = transactionModel;