import { Router } from 'express';
import { User } from '../models/User.js';
import { ImmigrationCase } from '../models/ImmigrationCase.js';
import { News } from '../models/News.js';

const router = Router();

// Test route to create sample data
router.post('/create-test-data', async (req, res) => {
  try {
    // Create a test user
    const user = await User.create({
      email: 'test@example.com',
      password: 'Password123!',
      firstName: 'John',
      lastName: 'Doe',
      role: 'user'
    });

    // Create a test immigration case
    const immigrationCase = await ImmigrationCase.create({
      userId: user._id,
      caseNumber: 'CASE-2024-001',
      caseType: 'Citizenship',
      status: 'pending',
      priority: 'medium',
      description: 'Test immigration case'
    });

    // Create test news
    const news = await News.create({
      title: 'Immigration Law Update 2024',
      content: 'New immigration policies have been announced...',
      source: 'Immigration News Daily',
      url: 'https://example.com/news/1',
      category: ['policy', 'updates'],
      publishedAt: new Date()
    });

    res.json({
      message: 'Test data created successfully',
      data: {
        user: {
          id: user._id,
          email: user.email
        },
        case: {
          id: immigrationCase._id,
          caseNumber: immigrationCase.caseNumber
        },
        news: {
          id: news._id,
          title: news.title
        }
      }
    });

  } catch (error) {
    res.status(500).json({
      message: 'Error creating test data',
      error: error.message
    });
  }
});

// Route to view all users
router.get('/users', async (req, res) => {
  const users = await User.find().select('-password');
  res.json(users);
});

// Route to view all cases
router.get('/cases', async (req, res) => {
  const cases = await ImmigrationCase.find();
  res.json(cases);
});

// Route to view all news
router.get('/news', async (req, res) => {
  const news = await News.find();
  res.json(news);
});

export default router;