import express from 'express';
import { Customer, Service } from '../models/index.js';
import { authenticate } from '../middleware/authentication.js';

const router = express.Router();

router.post('/add/:customerId', authenticate, async (req, res) => {
  try {
    const { customerId } = req.params;
    const { serviceType, membershipType, membershipDuration, totalFee, trainerNotes, membershipStartDate } = req.body;

    if (!serviceType) {
      return res.status(400).json({ message: 'Service type is required.' });
    }

    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found.' });
    }

    const newService = new Service({
      customer: customerId,
      serviceType,
      membershipType: membershipType || null,
      membershipDuration: membershipDuration || null,
      totalFee: totalFee || null,
      trainerNotes: trainerNotes || null,
      membershipStartDate: membershipStartDate || new Date(), // Varsayılan tarih atanır
    });

    await newService.save();

    customer.services.push(newService._id);
    await customer.save();

    res.status(201).json({ message: 'Service added successfully.', service: newService });
  } catch (error) {
    console.error('Error adding service:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

export default router;
