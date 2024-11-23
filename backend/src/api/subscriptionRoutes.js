import express from 'express';
import { authenticate } from '../middleware/authentication.js';
import { Customer,Appointment,Payment,Service,Subscription } from '../models/index.js';

const router = express.Router();
router.post('/add', authenticate, async (req, res) => {
  try {
      const { customerId, serviceId, durationDays, startDate, sessionLimit, fee } = req.body;

      // Validation
      if (!customerId || !serviceId || !durationDays || !startDate) {
          return res.status(400).json({ message: 'Required fields are missing.' });
      }

      // Default values
      const finalFee = fee || 0;
      const finalSessionLimit = sessionLimit || 8;

      // Check if customer exists
      const customer = await Customer.findById(customerId);
      if (!customer) {
          return res.status(404).json({ message: 'Customer not found.' });
      }

      // Check if service exists
      const service = await Service.findById(serviceId);
      if (!service) {
          return res.status(404).json({ message: 'Service not found.' });
      }
      // Kontrol: Aynı hizmet için çakışan bir aktif abonelik var mı?
    const overlappingSubscription = await Subscription.findOne({
      customerId,
      serviceId,
      startDate: { $gte: new Date(startDate) }
    });

    if (overlappingSubscription) {
      return res.status(400).json({ message: 'An active subscription already exists for this service.' });
    }


      // Create subscription
      const newSubscription = new Subscription({
          customerId,
          serviceId,
          durationDays,
          startDate: new Date(startDate),
          sessionLimit: finalSessionLimit,
          fee: finalFee,
      });

      await newSubscription.save();

      // Populate service details
      const populatedSubscription = await Subscription.findById(newSubscription._id).populate('serviceId');

      res.status(201).json({
          message: 'Subscription added successfully.',
          subscription: populatedSubscription,
      });
  } catch (error) {
      console.error('Error adding subscription:', error);
      res.status(500).json({ message: 'Internal server error.' });
  }
});
// Delete subscription by ID
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;

    // Delete the subscription directly
    const deletedSubscription = await Subscription.findByIdAndDelete(id);
    if (!deletedSubscription) {
        return res.status(404).json({ message: 'Subscription not found.' });
    }

    res.status(200).json({ message: 'Subscription deleted successfully.' });
} catch (error) {
    console.error('Error deleting subscription:', error);
    res.status(500).json({ message: 'Internal server error.' });
}
});

router.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { durationDays, startDate, sessionLimit, fee } = req.body.data;

  try {
      // İlgili aboneliği bul ve güncelle
      const updatedSubscription = await Subscription.findByIdAndUpdate(
          id,
          {
              ...(durationDays && { durationDays }),
              ...(startDate && { startDate: new Date(startDate) }),
              ...(sessionLimit !== undefined && { sessionLimit }),
              ...(fee !== undefined && { fee }),
              updatedAt: Date.now(),
          },
          { new: true, runValidators: true }
      );

      if (!updatedSubscription) {
          return res.status(404).json({ message: 'Subscription not found.' });
      }

      res.status(200).json({ message: 'Subscription updated successfully.', subscription: updatedSubscription });
  } catch (error) {
      console.error('Error updating subscription:', error);
      res.status(500).json({ message: 'Internal server error.' });
  }
});



export default router;