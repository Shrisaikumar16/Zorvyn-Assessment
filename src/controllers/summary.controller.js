import { Record } from '../models/record.model.js';
import mongoose from 'mongoose';

export const getDashboardSummary = async (req, res) => {
  try {
    // We filter by the logged-in user's ID
    const userId = new mongoose.Types.ObjectId(req.user._id);

    const stats = await Record.aggregate([
      { $match: { user: userId } }, // 1. Filter for current user
      {
        $facet: {
          // 2. Branch A: Calculate Totals
          "totals": [
            {
              $group: {
                _id: null,
                totalIncome: { $sum: { $cond: [{ $eq: ["$type", "income"] }, "$amount", 0] } },
                totalExpense: { $sum: { $cond: [{ $eq: ["$type", "expense"] }, "$amount", 0] } }
              }
            },
            {
              $project: {
                _id: 0,
                totalIncome: 1,
                totalExpense: 1,
                netBalance: { $subtract: ["$totalIncome", "$totalExpense"] }
              }
            }
          ],
          // 3. Branch B: Group by Category
          "categoryWise": [
            {
              $group: {
                _id: "$category",
                total: { $sum: "$amount" }
              }
            },
            { $sort: { total: -1 } }
          ],
          // 4. Branch C: Recent Activity
          "recentActivity": [
            { $sort: { date: -1 } },
            { $limit: 5 }
          ]
        }
      }
    ]);

    // Format the response for the frontend
    const result = stats[0];
    res.json({
      summary: result.totals[0] || { totalIncome: 0, totalExpense: 0, netBalance: 0 },
      categories: result.categoryWise,
      recent: result.recentActivity
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};