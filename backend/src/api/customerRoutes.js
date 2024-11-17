import express from 'express';
import { authenticate } from '../middleware/authentication.js';
import Customer from '../models/customer.js';

const router = express.Router();

router.get('/list', authenticate, async (req, res) => {
  try {
    const customers = await Customer.find({}, 'name email phone');

    res.status(200).json(customers);
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ message: 'Error fetching customers.' });
  }
});

router.get('/:id', authenticate, async (req, res) => {
  try {
    const { id } = req.params;

    const customer = await Customer.findById(id)
      .populate({
        path: 'services',
        populate: [
          { path: 'events' },
          { path: 'payments' }, 
        ],
      })
      .exec();

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found.' });
    }

    res.status(200).json(customer);
  } catch (error) {
    console.error('Error fetching customer details:', error);
    res.status(500).json({ message: 'Error fetching customer details.' });
  }
});

export default router;
