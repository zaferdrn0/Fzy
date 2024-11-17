import express from 'express';
import { Customer, Service ,Event} from '../models/index.js'; 

const router = express.Router();

router.post('/add/:customerId', async (req, res) => {
  try {
    const { customerId } = req.params;
    const { serviceType, membershipType, membershipDuration, totalFee, trainerNotes } = req.body;

    if (!serviceType || !membershipType || !membershipDuration || !totalFee) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const customer = await Customer.findById(customerId);
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found.' });
    }

    const newService = new Service({
      customer: customerId,
      serviceType,
      membershipType,
      membershipDuration,
      totalFee,
      trainerNotes,
      membershipStartDate: new Date(),
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
