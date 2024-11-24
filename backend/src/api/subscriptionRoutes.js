import express from 'express';
import { authenticate } from '../middleware/authentication.js';
import { Customer,Appointment,Payment,Service,Subscription } from '../models/index.js';

const router = express.Router();

router.get('/:customerId', authenticate, async (req, res) => {
  const { customerId } = req.params;

  try {
    // Müşteriyle ilişkili abonelikleri bul ve Service bilgilerini iç içe ekle
    const subscriptions = await Subscription.find({ customerId })
      .populate('serviceId', 'type description') // Service bilgilerini dahil etmek için
      .lean();

    if (!subscriptions || subscriptions.length === 0) {
      return res.status(404).json({ message: 'No subscriptions found for this customer.' });
    }

    // Dönüşümü yap
    const formattedSubscriptions = subscriptions.map((sub) => ({
      _id: sub._id,
      durationDays: sub.durationDays,
      startDate: sub.startDate,
      sessionLimit: sub.sessionLimit,
      makeupSessions: sub.makeupSessions,
      fee: sub.fee,
      createdAt: sub.createdAt,
      updatedAt: sub.updatedAt,
      serviceId: sub.serviceId._id,
      serviceType: sub.serviceId.type, // Service type
      serviceDescription: sub.serviceId.description, // Service description
    }));

    // Dönüştürülmüş formatta döndür
    res.status(200).json(formattedSubscriptions);
  } catch (error) {
    console.error('Error fetching subscriptions:', error);
    res.status(500).json({ message: 'Internal server error while fetching subscriptions.' });
  }
});
router.post('/add', authenticate, async (req, res) => {
  try {
    const { customerId, serviceId, durationDays, startDate, sessionLimit, fee, makeupSessions } = req.body;

    // Validation
    if (!customerId || !serviceId || !durationDays || !startDate) {
      return res.status(400).json({ message: 'Required fields are missing.' });
    }

    // Default values
    const finalFee = fee || 0;
    const finalSessionLimit = sessionLimit || 8;
    const finalMakeupSessions = makeupSessions || 0;

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

    // Check for overlapping active subscription
    const overlappingSubscription = await Subscription.findOne({
      customerId,
      serviceId,
      startDate: { $gte: new Date(startDate) },
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
      makeupSessions: finalMakeupSessions, // Telafi dersleri ekleniyor
    });

    await newSubscription.save();

    // Populate service details
    const populatedSubscription = await Subscription.findById(newSubscription._id).populate('serviceId');

    // Format the response
    const formattedSubscription = {
      _id: populatedSubscription._id,
      durationDays: populatedSubscription.durationDays,
      startDate: populatedSubscription.startDate,
      sessionLimit: populatedSubscription.sessionLimit,
      makeupSessions: populatedSubscription.makeupSessions,
      fee: populatedSubscription.fee,
      createdAt: populatedSubscription.createdAt,
      updatedAt: populatedSubscription.updatedAt,
      serviceType: populatedSubscription.serviceId.type,
      serviceDescription: populatedSubscription.serviceId.description,
    };

    res.status(201).json({
      message: 'Subscription added successfully.',
      subscription: formattedSubscription,
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
  const { durationDays, startDate, sessionLimit, fee, makeupSessions } = req.body;

  try {
      // Aboneliği bul
      const subscription = await Subscription.findById(id).populate('serviceId');
      if (!subscription) {
          return res.status(404).json({ message: 'Subscription not found.' });
      }

      // İlgili aboneliğe ait randevuları kontrol et
      const relatedAppointments = await Appointment.find({ subscriptionId: id });

      // Katılınan ve planlanan toplam oturum sayısını hesapla
      const attendedCount = relatedAppointments.filter((appt) => appt.status === 'Geldi').length;
      const upcomingCount = relatedAppointments.filter((appt) => appt.status === 'İleri Tarihli').length;
      const missedCount = relatedAppointments.filter((appt) => appt.status === 'Gelmedi').length;
      const totalScheduled = attendedCount + upcomingCount + missedCount;

      // Yeni değerlerle toplam izin verilen oturum sayısını hesapla
      const newSessionLimit = sessionLimit !== undefined ? sessionLimit : subscription.sessionLimit;
      const newMakeupSessions = makeupSessions !== undefined ? makeupSessions : subscription.makeupSessions;
      const totalAllowed = newSessionLimit + newMakeupSessions;

      // Eğer toplam planlanan oturum sayısı yeni limitlerden büyükse güncellemeye izin verme
      if (totalScheduled > totalAllowed) {
          return res.status(400).json({
              message: `Cannot set sessionLimit (${newSessionLimit}) and makeupSessions (${newMakeupSessions}) lower than the total scheduled appointments (${totalScheduled}).`,
          });
      }

      // Güncellemeyi gerçekleştir
      const updatedSubscription = await Subscription.findByIdAndUpdate(
          id,
          {
              ...(durationDays && { durationDays }),
              ...(startDate && { startDate: new Date(startDate) }),
              ...(sessionLimit !== undefined && { sessionLimit }),
              ...(fee !== undefined && { fee }),
              ...(makeupSessions !== undefined && { makeupSessions }),
              updatedAt: Date.now(),
          },
          { new: true, runValidators: true }
      ).populate('serviceId'); // Güncellenmiş aboneliği tekrar populate ediyoruz

      if (!updatedSubscription) {
          return res.status(404).json({ message: 'Subscription not found after update.' });
      }

      // Yanıtı düzenli bir formata dönüştür
      const formattedSubscription = {
          _id: updatedSubscription._id,
          durationDays: updatedSubscription.durationDays,
          startDate: updatedSubscription.startDate,
          sessionLimit: updatedSubscription.sessionLimit,
          makeupSessions: updatedSubscription.makeupSessions,
          fee: updatedSubscription.fee,
          createdAt: updatedSubscription.createdAt,
          updatedAt: updatedSubscription.updatedAt,
          serviceType: updatedSubscription.serviceId.type,
          serviceDescription: updatedSubscription.serviceId.description,
      };

      res.status(200).json({
          message: 'Subscription updated successfully.',
          subscription: formattedSubscription,
      });
  } catch (error) {
      console.error('Error updating subscription:', error);
      res.status(500).json({ message: 'Internal server error.' });
  }
});

  



export default router;