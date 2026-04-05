const FinancialRecord = require('../models/FinancialRecord');

// GET overall summary
const getSummary = async (req, res) => {
  try {
    const result = await FinancialRecord.aggregate([
      { $match: { isDeleted: false } },
      {
        $group: {
          _id: '$type',
          total: { $sum: '$amount' }
        }
      }
    ]);

    let totalIncome = 0;
    let totalExpenses = 0;

    result.forEach(item => {
      if (item._id === 'income') totalIncome = item.total;
      if (item._id === 'expense') totalExpenses = item.total;
    });

    res.json({
      totalIncome,
      totalExpenses,
      netBalance: totalIncome - totalExpenses
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// GET category wise totals
const getCategoryTotals = async (req, res) => {
  try {
    const result = await FinancialRecord.aggregate([
      { $match: { isDeleted: false } },
      {
        $group: {
          _id: { category: '$category', type: '$type' },
          total: { $sum: '$amount' },
          count: { $sum: 1 }
        }
      },
      { $sort: { total: -1 } }
    ]);

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// GET monthly trends
const getMonthlyTrends = async (req, res) => {
  try {
    const result = await FinancialRecord.aggregate([
      { $match: { isDeleted: false } },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            month: { $month: '$date' },
            type: '$type'
          },
          total: { $sum: '$amount' }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } }
    ]);

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// GET recent activity
const getRecentActivity = async (req, res) => {
  try {
    const records = await FinancialRecord.find({ isDeleted: false })
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 })
      .limit(10);

    res.json(records);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// GET weekly trends
const getWeeklyTrends = async (req, res) => {
  try {
    const result = await FinancialRecord.aggregate([
      { $match: { isDeleted: false } },
      {
        $group: {
          _id: {
            year: { $year: '$date' },
            week: { $week: '$date' },
            type: '$type'
          },
          total: { $sum: '$amount' }
        }
      },
      { $sort: { '_id.year': 1, '_id.week': 1 } }
    ]);

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = {
  getSummary,
  getCategoryTotals,
  getMonthlyTrends,
  getRecentActivity,
  getWeeklyTrends
};