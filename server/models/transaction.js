const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    date: { type: Date, required: true },
    type: { type: String, required: true },
    category: { type: mongoose.Schema.Types.ObjectId, required: true },
    description: { type: String, },
    amount: { type: Number, required: true },
    account: { type: String }
}, { timestamps: true });
const userModel = mongoose.model('transaction', userSchema);
module.exports = userModel;