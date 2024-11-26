import express from 'express';
import { authenticate } from '../middleware/authentication.js';
import { Customer,Appointment,Payment,Service,Subscription } from '../models/index.js';

const router = express.Router();

// Tüm müşterileri listeleme
router.get('/list', authenticate, async (req, res) => {
  try {
    const customers = await Customer.find({})

    res.status(200).json(customers);
  } catch (error) {
    console.error('Error fetching customers:', error);
    res.status(500).json({ message: 'Error fetching customers.' });
  }
});

router.post('/add', authenticate, async (req, res) => {
  try {
    const { name, surname, email, phone, birthDate, weight, address } = req.body;

    if (!name || !surname || !email || !phone || !birthDate || !weight) {
      return res.status(400).json({ message: 'All fields are required.' });
    }

    const existingCustomer = await Customer.findOne({ email });
    if (existingCustomer) {
      return res.status(400).json({ message: 'Customer with this email already exists.' });
    }

    const newCustomer = new Customer({
      name,
      surname,
      email,
      phone,
      birthDate: new Date(birthDate),
      weight: parseFloat(weight),
      address,
    });

    await newCustomer.save();

    res.status(201).json({ message: 'Customer created successfully.', customer: newCustomer });
  } catch (error) {
    console.error('Error adding customer:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
});

router.get('/:id', async (req, res) => {
  const { id } = req.params;

  try {
    // Müşteri bilgisi
    const customer = await Customer.findById(id).lean();
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    // İlişkili serviceId'leri bul
    const serviceIds = [
      ...(await Payment.find({ customerId: id }).distinct('serviceId')),
      ...(await Appointment.find({ customerId: id }).distinct('serviceId')),
      ...(await Subscription.find({ customerId: id }).distinct('serviceId')),
    ];

    // Servisleri getir
    const services = await Service.find({ _id: { $in: serviceIds } }).lean();

    // İlişkili verileri al
    const payments = await Payment.find({ customerId: id }).lean();
    const appointments = await Appointment.find({ customerId: id }).lean();
    const subscriptions = await Subscription.find({ customerId: id }).lean();

    // Tüm veriyi döndür
    res.status(200).json({
      ...customer,
      services,
      payments,
      appointments,
      subscriptions,
    });
  } catch (error) {
    console.error('Error fetching customer details:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.get('/dashboard/:customerId', authenticate, async (req, res) => {
  const { customerId } = req.params;

  try {
    // Fetch customer
    const customer = await Customer.findById(customerId).lean();
    if (!customer) {
      return res.status(404).json({ message: 'Customer not found' });
    }

    // Upcoming appointments (next 5)
    const upcomingAppointments = await Appointment.find({
      customerId,
      date: { $gte: new Date() },
    })
      .sort({ date: 1 })
      .limit(5)
      .populate('serviceId', 'type description')
      .lean();

    // Fetch active subscriptions
    const subscriptions = await Subscription.find({
      customerId,
      // Optionally, you can add conditions to find active subscriptions based on date
    }).lean();

    // For each subscription, calculate sessions attended and missed
    const subscriptionsData = await Promise.all(
      subscriptions.map(async (sub) => {
        // Find appointments linked to this subscription
        const appointments = await Appointment.find({
          subscriptionId: sub._id,
        }).lean();
    
        // Count sessions attended, missed, and upcoming
        const sessionsAttended = appointments.filter(
          (appt) => appt.status === 'Geldi'
        ).length;
        const sessionsMissed = appointments.filter(
          (appt) => appt.status === 'Gelmedi'
        ).length;
        const upcomingSessions = appointments.filter(
          (appt) => appt.status === 'İleri Tarihli'
        ).length;
    
        return {
          subscriptionId: sub._id,
          startDate: sub.startDate,
          durationDays: sub.durationDays,
          sessionLimit: sub.sessionLimit,
          sessionsAttended,
          sessionsMissed,
          upcomingSessions,
          progress: (sessionsAttended / sub.sessionLimit) * 100,
        };
      })
    );
    
    // Recent payments (last 5)
    const recentPayments = await Payment.find({ customerId })
      .sort({ date: -1 })
      .limit(5)
      .populate('serviceId', 'type description')
      .lean();

    res.status(200).json({
      customer,
      upcomingAppointments,
      subscriptions: subscriptionsData,
      recentPayments,
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
