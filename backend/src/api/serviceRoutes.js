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

  router.get('/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      const serviceIds = [
        ...(await Payment.find({ customerId: id }).distinct('serviceId')),
        ...(await Appointment.find({ customerId: id }).distinct('serviceId')),
        ...(await Subscription.find({ customerId: id }).distinct('serviceId')),
      ];
  
      const services = await Service.find({ _id: { $in: serviceIds } }).lean();
  
      res.status(200).json(services);
    } catch (error) {
      console.error('Error fetching customer services:', error);
      res.status(500).json({ message: 'Error fetching customer services.' });
    }
  });

export default router;
