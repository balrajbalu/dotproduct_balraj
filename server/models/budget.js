const mongoose = require('mongoose');

const budgetSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    month: {
      type: Number,
      min: 1,
      max: 12,
      required: true,
    },
    year: {
      type: Number,
      required: true,
    },
    amount: {
      type: Number,
      required: true, 
    },
    categoryLimits: [
      {
        category: { type: String },
        limit: { type: Number },
      },
    ],
  },
  { timestamps: true }
);

const budgetModel = mongoose.model('budgets', budgetSchema);

module.exports = budgetModel;
