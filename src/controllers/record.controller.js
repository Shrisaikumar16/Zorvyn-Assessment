import { Record } from '../models/record.model.js';

// @desc    Create a new financial record
// @route   POST /api/records
// @access  Private (Admin only based on your routes)
export const createRecord = async (req, res) => {
  try {
    // We attach the logged-in user's ID to the record
    const record = await Record.create({ 
      ...req.body, 
      user: req.user._id 
    });
    res.status(201).json(record);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Get all records with filtering
// @route   GET /api/records
// @access  Private
export const getRecords = async (req, res) => {
  try {
    const { startDate, endDate, category, type } = req.query;
    
    // CRITICAL: Only fetch records belonging to the logged-in user
    let query = { user: req.user._id };

    // Filtering Logic
    if (startDate && endDate) {
      query.date = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }
    if (category) query.category = category;
    if (type) query.type = type;

    const records = await Record.find(query).sort({ date: -1 });
    res.json(records);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update a record
// @route   PUT /api/records/:id
// @access  Private (Admin)
export const updateRecord = async (req, res) => {
  try {
    const { id } = req.params;

    // Find record AND check ownership in one query
    const record = await Record.findOneAndUpdate(
      { _id: id, user: req.user._id },
      req.body,
      { new: true, runValidators: true }
    );

    if (!record) {
      return res.status(404).json({ message: "Record not found or unauthorized" });
    }

    res.json(record);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// @desc    Delete a record
// @route   DELETE /api/records/:id
// @access  Private (Admin)
export const deleteRecord = async (req, res) => {
  try {
    const { id } = req.params;

    // Ensure the user deleting the record actually owns it
    const record = await Record.findOneAndDelete({ _id: id, user: req.user._id });

    if (!record) {
      return res.status(404).json({ message: "Record not found or unauthorized" });
    }

    res.json({ message: "Record deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};