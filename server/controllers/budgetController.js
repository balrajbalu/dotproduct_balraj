const budgetModel = require('../models/budget');
const transactionModel = require('../models/transaction');
const dayjs = require('dayjs');
const mongoose = require('mongoose');
exports.createBudget = async (req, res) => {
  try {
    const { month, year, amount, categoryLimits } = req.body;
    const userId = req.user.id;

    const newBudget = new budgetModel({ userId, month, year, amount, categoryLimits });
    await newBudget.save();

    res.status(201).json({result:1, message: 'Budget created successfully',newBudget});
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
}
exports.getBudgets = async (req, res) => {
  try {
    const userId = mongoose.Types.ObjectId.createFromHexString(req.user.id);

    const results = [];

    for (let i = 0; i < 6; i++) {
      const date = dayjs().subtract(i, 'month');
      const month = date.month() + 1;
      const year = date.year();
      const budget = await budgetModel.findOne({ userId, month, year });

      if (!budget) continue;

      const startDate = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0));
      const endDate = new Date(Date.UTC(year, month, 0, 23, 59, 59));
      const transactions = await transactionModel.aggregate([
        {
          $match: {
            userId,
            date: { $gte: startDate, $lte: endDate },
            type: 'expense'
          },
        },
        {
          $group: {
            _id: null,
            totalSpent: { $sum: '$amount' },
          },
        },
      ]);
      const spent = transactions[0]?.totalSpent || 0;
      const overBudget = spent > budget.amount;
      const percentageSpent = Math.min((spent / budget.amount) * 100, 100)
      results.push({
        budget: budget.amount,
        spent,
        remaining: budget.amount - spent,
        overBudget,
        percentageSpent,
        month,
        year,
      });
    }
    return res.status(200).json({
      result: 1,
      data: results.sort((a, b) => {
        if (b.year === a.year) return b.month - a.month;
        return b.year - a.year;
      }),
      message: 'Fetched budgets with expenses for the last 6 months',
    });

  } catch (error) {
    console.error('getBudgets error:', error);
    return res.status(500).json({ result: 0, message: 'Server error', error });
  }
};
