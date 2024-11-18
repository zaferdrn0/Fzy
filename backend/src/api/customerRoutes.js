import express from 'express';
import { authenticate } from '../middleware/authentication.js';
import { Customer, Service,Event,Payment } from '../models/index.js';

const router = express.Router();

router.get('/list',authenticate, async (req, res) => {
  try {
    const customers = await Customer.find({})
      .populate({
        path: 'services',
        select: 'serviceType membershipType membershipDuration membershipStartDate',
      });

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

    if (!customer) {
      return res.status(404).json({ message: 'Customer not found.' });
    }

    res.status(200).json(customer);
  } catch (error) {
    console.error('Error fetching customer details:', error);
    res.status(500).json({ message: 'Error fetching customer details.' });
  }
});

router.post('/add',authenticate, async (req, res) => {
  try {
    const { firstName, lastName, email, phone, birthDate, weight } = req.body;

    if (!firstName || !lastName || !email || !phone || !birthDate || !weight) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const existingCustomer = await Customer.findOne({ email });
    if (existingCustomer) {
      return res.status(400).json({ message: 'Customer with this email already exists.' });
    }

    const newCustomer = new Customer({
      name: {
        first: firstName,
        last: lastName,
      },
      email,
      phone,
      birthDate: new Date(birthDate), 
      weight: parseFloat(weight),
    });


    await newCustomer.save();

    res.status(201).json({ message: 'Customer created successfully.', customer: newCustomer });
  } catch (error) {
    console.error('Error adding customer:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

router.put('/:customerId', async (req, res) => {
  try {
    const { customerId } = req.params;
    const updatedData = req.body;

    const updatedCustomer = await Customer.findByIdAndUpdate(customerId, updatedData, {
      new: true, 
    });

    if (!updatedCustomer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    res.status(200).json({ message: 'Customer updated successfully', customer: updatedCustomer });
  } catch (error) {
    console.error('Error updating customer:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
