import express from 'express';
import { authenticate } from '../middleware/authentication.js';
import { Customer,Appointment,Payment,Service,Subscription } from '../models/index.js';

const router = express.Router();

router.get('/list', authenticate, async (req, res) => {
    try {
      const services = await Service.find({});
      res.status(200).json(services);
    } catch (error) {
      console.error('Error fetching services:', error);
      res.status(500).json({ message: 'Error fetching services.' });
    }
  });

export default router;
