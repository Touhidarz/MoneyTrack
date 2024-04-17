const mongoose = require('mongoose');
const { Schema, model } = mongoose;

const TransactionSchema = new Schema({
    amount: { type: Number, required: true },
    selectedPayment: { type: String, required: true },
    datetime: { type: String, required: true },
});

const TransactionModel = model('Transaction', TransactionSchema);

module.exports = TransactionModel;
