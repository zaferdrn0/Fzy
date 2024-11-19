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
      membershipStartDate: membershipStartDate || new Date(), 
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
router.put('/:serviceId', authenticate, async (req, res) => {
  try {
    const { serviceId } = req.params;
    const {
      membershipType,
      membershipDuration,
      membershipStartDate,
      totalFee,
      trainerNotes,
    } = req.body;

    const service = await Service.findById(serviceId);

    if (!service) {
      return res.status(404).json({ message: 'Service not found.' });
    }

    if (membershipType) service.membershipType = membershipType;
    if (membershipDuration) service.membershipDuration = membershipDuration;
    if (membershipStartDate) service.membershipStartDate = new Date(membershipStartDate);
    if (totalFee) service.totalFee = totalFee;
    if (trainerNotes) service.trainerNotes = trainerNotes;

    service.updatedAt = new Date(); 

    await service.save();

    res.status(200).json({ message: 'Service updated successfully.', service });
  } catch (error) {
    console.error('Error updating service:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});
router.delete('/:serviceId', authenticate, async (req, res) => {
  try {
    const { serviceId } = req.params;

    const service = await Service.findByIdAndDelete(serviceId);

    if (!service) {
      return res.status(404).json({ message: 'Service not found.' });
    }

    res.status(200).json({ message: 'Service deleted successfully.' });
  } catch (error) {
    console.error('Error deleting service:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});


export default router;
