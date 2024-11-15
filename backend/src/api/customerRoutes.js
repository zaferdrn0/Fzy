import express from 'express';
import { authenticate } from '../middleware/authentication.js';
import { Customer } from '../models/customer.js';

const router = express.Router();

// Create Customer route
router.post('/add',authenticate, async (req, res) => {
    try {
      const {
        firstName, lastName, email, phone, age, weight, type, details
      } = req.body;
  
      // Validate required fields
      if (!firstName || !lastName || !email || !phone || !age || !weight || !type) {
        return res.status(400).json({ message: 'All fields are required.' });
      }
  
      // Check if the email already exists
      const existingCustomer = await Customer.findOne({ email });
      if (existingCustomer) {
        return res.status(400).json({ message: 'Email is already registered.' });
      }
  
      // Create new customer
      const newCustomer = new Customer({
        name: { first: firstName, last: lastName },
        email,
        phone,
        age,
        weight,
        type,
        details,
      });
  
      // Save the customer to the database
      await newCustomer.save();
  
      // Send success response
      res.status(201).json({ message: 'Customer created successfully.', customer: newCustomer });
    } catch (error) {
      console.error('Error creating customer:', error);
      res.status(500).json({ message: 'Error creating customer.' });
    }
  });
  
  router.get('/list', authenticate, async (req, res) => {
    try {
      // Tüm kullanıcıları al
      const customers = await Customer.find();
  
      // Başarılı cevap gönder
      res.status(200).json({ customers });
    } catch (error) {
      console.error('Error fetching customers:', error);
      res.status(500).json({ message: 'Error fetching customers.' });
    }
  });

  router.get('/details/:id', authenticate, async (req, res) => {
    try {
      const customer = await Customer.findById(req.params.id);
      if (!customer) {
        return res.status(404).json({ message: 'Customer not found' });
      }
      res.status(200).json({ customer });
    } catch (error) {
      console.error('Error fetching customer details:', error);
      res.status(500).json({ message: 'Error fetching customer details.' });
    }
  });
  
  // Kullanıcı detaylarını güncelleme
  router.put('/details/:id', authenticate, async (req, res) => {
    try {
      const customer = await Customer.findByIdAndUpdate(req.params.id, req.body, {
        new: true, // Güncellenmiş veriyi döndür
        runValidators: true, // Validation'ı çalıştır
      });
      
      if (!customer) {
        return res.status(404).json({ message: 'Customer not found' });
      }
  
      res.status(200).json({ message: 'Customer details updated successfully', customer });
    } catch (error) {
      console.error('Error updating customer details:', error);
      res.status(500).json({ message: 'Error updating customer details.' });
    }
  });

export default router