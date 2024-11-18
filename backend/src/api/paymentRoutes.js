import express from 'express';
import { Payment, Service, Customer } from '../models/index.js';
import mongoose from 'mongoose';

const router = express.Router();

router.post('/add/:customerId', async (req, res) => {
  try {
    const { customerId } = req.params;
    const { amount, date, service } = req.body;

    if (!amount || !date || !service) {
      return res.status(400).json({ message: 'Amount, date, and service are required.' });
    }

    if (!mongoose.Types.ObjectId.isValid(customerId) || !mongoose.Types.ObjectId.isValid(service)) {
      return res.status(400).json({ message: 'Invalid customer or service ID.' });
    }

    const customer = await Customer.findById(customerId).populate('services');
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found.' });
    }

    const targetService = customer.services.find((s) => s._id.toString() === service);
    if (!targetService) {
      return res.status(404).json({ message: 'Service not found for this customer.' });
    }

    const newPayment = new Payment({
      amount,
      date: new Date(date),
      service: targetService._id,
    });

    await newPayment.save();

    targetService.payments.push(newPayment._id);
    await targetService.save();

    res.status(201).json({ message: 'Payment added successfully.', payment: newPayment });
  } catch (error) {
    console.error('Error adding payment:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

export default router;
