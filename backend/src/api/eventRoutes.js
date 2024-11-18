import express from 'express';
import { Event, Service, Customer } from '../models/index.js';
import { authenticate } from '../middleware/authentication.js';

const router = express.Router();

router.post('/add/:customerId',authenticate, async (req, res) => {
  try {
    const { customerId } = req.params;
    const { date, status, notes, service } = req.body;

    if (!date || !status || !service) {
      return res.status(400).json({ message: 'Date, status, and service are required.' });
    }

    const customer = await Customer.findById(customerId).populate('services');
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found.' });
    }

    const targetService = customer.services.find(
      (s) => s.serviceType === service
    );

    if (!targetService) {
      return res.status(404).json({ message: 'Service not found for this customer.' });
    }

    const newEvent = new Event({
      date: new Date(date),
      status,
      notes,
      service: targetService._id,
    });

    await newEvent.save();

    targetService.events.push(newEvent._id);
    await targetService.save();

    res.status(201).json({ message: 'Event added successfully.', event: newEvent });
  } catch (error) {
    console.error('Error adding event:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

export default router;
