import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../models/user.model.js';
import { Record } from '../models/record.model.js';

dotenv.config();

const seedData = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    
    // 1. Clear existing data
    await User.deleteMany();
    await Record.deleteMany();

    // 2. Create sample users
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@test.com',
      password: 'password123',
      role: 'Admin'
    });

    const analyst = await User.create({
      name: 'Analyst User',
      email: 'analyst@test.com',
      password: 'password123',
      role: 'Analyst'
    });

    const viewer = await User.create({
      name: 'Viewer User',
      email: 'viewer@test.com',
      password: 'password123',
      role: 'Viewer'
    });

    // 3. Create sample records for the Admin
    const categories = ['Salary', 'Food', 'Rent', 'Shopping', 'Investment', 'Utilities'];
    const records = [];

    for (let i = 0; i < 20; i++) {
      const type = i % 3 === 0 ? 'income' : 'expense';
      records.push({
        amount: Math.floor(Math.random() * 5000) + 100,
        type,
        category: categories[Math.floor(Math.random() * categories.length)],
        date: new Date(Date.now() - Math.floor(Math.random() * 1000000000)),
        description: `Sample ${type} entry ${i + 1}`,
        user: admin._id
      });
    }

    await Record.insertMany(records);

    console.log('Data Seeded Successfully!');
    console.log('Admin Login: admin@test.com | password123');
    console.log("Analyst Login: analyst@test.com | password123");
    console.log("Viewer Login: viewer@test.com | password123");
    process.exit();
  } catch (error) {
    console.error('Seeding failed:', error);
    process.exit(1);
  }
};

seedData();