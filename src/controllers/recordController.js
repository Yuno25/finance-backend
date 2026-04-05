const FinancialRecord = require('../models/FinancialRecord');
const { validationResult } = require('express-validator');

// CREATE record
const createRecord = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { amount, type, category, date, notes } = req.body;

    const record = await FinancialRecord.create({
      amount,
      type,
      category,
      date,
      notes,
      createdBy: req.user._id
    });

    res.status(201).json({ message: 'Record created successfully', record });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// GET all records with filtering
const getAllRecords = async (req, res) => {
  try {
    const { type, category, startDate, endDate, page = 1, limit = 10 } = req.query;

    const filter = { isDeleted: false };

    if (type) filter.type = type;
    if (category) filter.category = { $regex: category, $options: 'i' };
    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    const skip = (parseInt(page) - 1) * parseInt(limit);
    const total = await FinancialRecord.countDocuments(filter);
    const records = await FinancialRecord.find(filter)
      .populate('createdBy', 'name email')
      .sort({ date: -1 })
      .skip(skip)
      .limit(parseInt(limit));

    res.json({
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      records
    });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// GET single record
const getRecordById = async (req, res) => {
  try {
    const record = await FinancialRecord.findOne({
      _id: req.params.id,
      isDeleted: false
    }).populate('createdBy', 'name email');

    if (!record) {
      return res.status(404).json({ message: 'Record not found' });
    }

    res.json(record);
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// UPDATE record
const updateRecord = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const record = await FinancialRecord.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      { ...req.body },
      { new: true }
    );

    if (!record) {
      return res.status(404).json({ message: 'Record not found' });
    }

    res.json({ message: 'Record updated successfully', record });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

// SOFT DELETE 
const deleteRecord = async (req, res) => {
  try {
    const record = await FinancialRecord.findOneAndUpdate(
      { _id: req.params.id, isDeleted: false },
      { isDeleted: true },
      { new: true }
    );

    if (!record) {
      return res.status(404).json({ message: 'Record not found' });
    }

    res.json({ message: 'Record deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error', error: err.message });
  }
};

module.exports = {
  createRecord,
  getAllRecords,
  getRecordById,
  updateRecord,
  deleteRecord
};