import mongoose from 'mongoose';

const recordSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  type: { 
    type: String, 
    enum: ['income', 'expense'], 
    required: true 
  },
  category: { 
    type: String, 
    required: true // e.g., 'Food', 'Salary', 'Rent'
  },
  date: { type: Date, default: Date.now },
  description: { type: String },
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  }
}, { timestamps: true });

export const Record = mongoose.model('Record', recordSchema);