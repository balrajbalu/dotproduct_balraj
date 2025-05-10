const mongoose = require("mongoose");
const Transaction = require("../models/transaction");
const Budget = require("../models/budget");
exports.getSummary = async (req, res) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.user.id);

        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - 29);

        const summary = await Transaction.aggregate([
            {
                $match: {
                    userId,
                    date: { $gte: startDate, $lte: endDate }
                }
            },
            {
                $project: {
                    type: 1,
                    amount: 1,
                    dateStr: { $dateToString: { format: "%Y-%m-%d", date: "$date" } }
                }
            },
            {
                $group: {
                    _id: { type: "$type", date: "$dateStr" },
                    total: { $sum: "$amount" }
                }
            },
            {
                $group: {
                    _id: "$_id.type",
                    total: { $sum: "$total" },
                    daily: {
                        $push: {
                            k: "$_id.date",
                            v: "$total"
                        }
                    }
                }
            }
        ]);

        const income = summary.find((item) => item._id === "income") || { total: 0, daily: [] };
        const expense = summary.find((item) => item._id === "expense") || { total: 0, daily: [] };

        function normalizeDailyData(dailyArray) {
            const map = {};

            for (const { k, v } of dailyArray) {
                if (!map[k]) map[k] = 0;
                map[k] += v;
            }

            const data = [];
            const labels = [];
            const formatter = new Intl.DateTimeFormat("en-US", { month: "short", day: "numeric" });

            for (let i = 29; i >= 0; i--) {
                const d = new Date();
                d.setDate(endDate.getDate() - i);
                const key = d.toISOString().split("T")[0];
                data.push(map[key] || 0);
                labels.push(formatter.format(d));
            }

            return { data, labels };
        }

        const { data: incomeData, labels } = normalizeDailyData(income.daily);
        const { data: expenseData } = normalizeDailyData(expense.daily);
        const now = new Date();
        const budget = await Budget.findOne({
            userId,
            month: now.getMonth() + 1,
            year: now.getFullYear()
        });

        const budgetAmount = budget?.amount || 0;
        const utilization = budgetAmount ? Math.round((expense.total / budgetAmount) * 100) : 0;

        const data = [
            {
                title: "Income",
                value: `₹${income.total.toLocaleString()}`,
                interval: "Last 30 days",
                trend: "up",
                data: incomeData
            },
            {
                title: "Expenses",
                value: `₹${expense.total.toLocaleString()}`,
                interval: "Last 30 days",
                trend: "down",
                data: expenseData
            },
            {
                title: "Monthly Budget Utilization",
                value: budgetAmount ? `${utilization}%` : "0%",
                budgetAmount: budgetAmount ? `₹${budgetAmount.toLocaleString()}` : "Not set",
                interval: "Last 30 days",
                trend: "neutral",
                data: Array(30).fill(utilization)
            }
        ];

        return res.json({ result: 1, data, labels });

    } catch (err) {
        console.error("Error fetching summary:", err);
        return res.status(500).json({ result: 0, error: "Internal server error" });
    }
};

exports.getOverview = async (req, res) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.user.id);

        const now = new Date();
        const end = new Date(now.getFullYear(), now.getMonth() + 1, 1);
        const start = new Date(now.getFullYear(), now.getMonth() - 5, 1);
        const summary = await Transaction.aggregate([
            {
                $match: {
                    userId,
                    date: { $gte: start, $lt: end }
                }
            },
            {
                $project: {
                    type: 1,
                    amount: 1,
                    year: { $year: "$date" },
                    month: { $month: "$date" }
                }
            },
            {
                $group: {
                    _id: { type: "$type", year: "$year", month: "$month" },
                    total: { $sum: "$amount" }
                }
            }
        ]);

        // Get budget for each of last 6 months
        const budgets = await Budget.find({
            userId,
            $or: Array.from({ length: 6 }).map((_, i) => {
                const d = new Date(now.getFullYear(), now.getMonth() - (5 - i), 1);
                return { month: d.getMonth() + 1, year: d.getFullYear() };
            })
        });
        const monthLabels = [];
        const incomeMap = {};
        const expenseMap = {};
        const budgetMap = {};

        for (let i = 5; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const label = d.toLocaleString("en-US", { month: "short" }); // e.g., 'Apr'
            const key = `${d.getFullYear()}-${d.getMonth() + 1}`;
            monthLabels.push(label);
            incomeMap[key] = 0;
            expenseMap[key] = 0;
            budgetMap[key] = 0;
        }

        for (const item of summary) {
            const key = `${item._id.year}-${item._id.month}`;
            if (item._id.type === "income") {
                incomeMap[key] = item.total;
            } else if (item._id.type === "expense") {
                expenseMap[key] = item.total;
            }
        }
        for (const b of budgets) {
            const key = `${b.year}-${b.month}`;
            budgetMap[key] = b.amount;
        }

        const incomeData = [], expenseData = [], budgetData = [];
        for (let i = 5; i >= 0; i--) {
            const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const key = `${d.getFullYear()}-${d.getMonth() + 1}`;
            incomeData.push(incomeMap[key] || 0);
            expenseData.push(expenseMap[key] || 0);
            budgetData.push(budgetMap[key] || 0);
        }

        const series = [
            { id: "income", label: "Income", data: incomeData, stack: "A" },
            { id: "expenses", label: "Expenses", data: expenseData, stack: "A" },
            { id: "budget", label: "Monthly Budget", data: budgetData, stack: "A" }
        ];

        return res.json({
            result: 1,
            series,
            data: monthLabels
        });

    } catch (err) {
        console.error("Error fetching overview:", err);
        return res.status(500).json({ result: 0, error: "Internal server error" });
    }
};
exports.getCategory = async (req, res) => {
    try {
        const userId = new mongoose.Types.ObjectId(req.user.id);

        const categoryData = await Transaction.aggregate([
            {
                $match: {
                    userId,
                    type: "expense",
                }
            },
            {
                $group: {
                    _id: "$category",
                    value: { $sum: "$amount" }
                }
            },
            {
                $lookup: {
                    from: "categorys",
                    localField: "_id",
                    foreignField: "_id",
                    as: "categoryInfo"
                }
            },
            {
                $unwind: {
                    path: "$categoryInfo",
                    preserveNullAndEmptyArrays: true
                }
            },
            {
                $project: {
                    label: "$categoryInfo.name",
                    value: 1
                }
            },
            {
                $sort: { value: -1 }
            }
        ]);
        const totalSpent = categoryData.reduce((acc, item) => acc + item.value, 0);
        const formatIndianCurrency = (amount) => {
            if (amount >= 10000000) {
                return `₹${(amount / 10000000).toFixed(2)}Cr`;
            } else if (amount >= 100000) {
                return `₹${(amount / 100000).toFixed(2)}L`;
            } else if (amount >= 1000) {
                return `₹${(amount / 1000).toFixed(2)}K`;
            } else {
                return `₹${amount}`;
            }
        };
        return res.json({
            result: 1,
            data: categoryData,
            totalSpent: formatIndianCurrency(totalSpent),
        });

    } catch (err) {
        console.error("Error fetching category:", err);
        return res.status(500).json({ result: 0, error: "Internal server error" });
    }
};
