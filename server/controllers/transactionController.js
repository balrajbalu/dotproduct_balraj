const transactionModel = require('../models/transaction');
const mongoose = require('mongoose');
exports.getTransaction = async (req, res) => {
  try {
    const { page = 1, limit = 10, startDate, endDate, minAmount, maxAmount } = req.body;
    const query = { userId: mongoose.Types.ObjectId.createFromHexString(req.user.id) };

    if (startDate && endDate) {
      query.date = {
        $gte: new Date(startDate),
        $lte: new Date(endDate),
      };
    }

    if (minAmount || maxAmount) {
      query.amount = {};
      if (minAmount) query.amount.$gte = Number(minAmount);
      if (maxAmount) query.amount.$lte = Number(maxAmount);
    }
    const transactions = await transactionModel.aggregate([
      { $match: query },
      {
        $lookup: {
          from: 'categorys',
          localField: 'category',
          foreignField: '_id',
          as: 'categoryDetails'
        }
      },
      {
        $unwind: {
          path: '$categoryDetails',
          preserveNullAndEmptyArrays: true
        }
      },
      { $sort: { date: -1 } },
      { $skip: (page - 1) * limit },
      { $limit: Number(limit) },
      {
        $project: {
          _id: 1,
          userId: 1,
          date: 1,
          type: 1,
          description: 1,
          amount: 1,
          account: 1,
          category: '$categoryDetails.name',
          createdAt: 1
        }
      }
    ]);



    const total = await transactionModel.countDocuments(query);

    res.json({
      result: 1,
      data: transactions,
      pagination: {
        total,
        page: Number(page),
        limit: Number(limit),
        totalPages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ result: 0, message: 'Internal Server Error' });
  }
};
exports.createTransaction = async (req, res) => {
  try {
    const { date, entryType, category, description, amount, account } = req.body;

    if (!date || !entryType || !category || !amount) {
      return res.status(400).json({ result: 0, message: 'Missing required fields.' });
    }

    const newTransaction = new transactionModel({
      userId: req.user.id,
      date,
      type: entryType,
      category,
      description,
      amount,
      account
    });

    const savedTransaction = await newTransaction.save();

    return res.status(201).json({
      result: 1,
      message: 'Transaction created successfully.',
      data: savedTransaction
    });

  } catch (error) {
    console.error('Error creating transaction:', error.message);
    return res.status(500).json({
      result: 0,
      message: 'Internal server error.'
    });
  }
};
