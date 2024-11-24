import express from 'express';
import { authenticate } from '../middleware/authentication.js';
import { Customer,Appointment,Payment,Service,Subscription } from '../models/index.js';

const router = express.Router();

router.get('/:customerId', authenticate, async (req, res) => {
    const { customerId } = req.params;

    try {
        const payments = await Payment.find({ customerId })
            .populate('serviceId', 'type description') // Service bilgilerini doldur
            .populate('subscriptionId', 'durationDays startDate') // Abonelik bilgilerini doldur
            .populate('appointmentId', 'date status'); // Randevu bilgilerini doldur

        if (!payments || payments.length === 0) {
            return res.status(404).json({ message: 'No payments found for this customer.' });
        }

        // Formatlı yanıt oluştur
        const formattedPayments = payments.map((payment) => ({
            _id: payment._id,
            customerId: payment.customerId,
            serviceId: payment.serviceId._id,
            serviceType: payment.serviceId.type,
            serviceDescription: payment.serviceId.description,
            subscriptionId: payment.subscriptionId?._id || null,
            appointmentId: payment.appointmentId?._id || null,
            appointmentDate: payment.appointmentId?.date || null,
            appointmentStatus: payment.appointmentId?.status || null,
            amount: payment.amount,
            status: payment.status,
            date: payment.date,
            createdAt: payment.createdAt,
        }));

        res.status(200).json(formattedPayments);
    } catch (error) {
        console.error('Error fetching payments:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});
router.post('/add', async (req, res) => {
    const { customerId, serviceId, subscriptionId, appointmentId, amount, date } = req.body;

    try {
        // Gerekli alanların kontrolü
        if (!customerId || !serviceId || !amount || !date) {
            return res.status(400).json({ message: 'Customer ID, Service ID, Amount, and Date are required.' });
        }

        // Müşteri doğrulama
        const customer = await Customer.findById(customerId);
        if (!customer) {
            return res.status(404).json({ message: 'Customer not found.' });
        }

        // Hizmet doğrulama
        const service = await Service.findById(serviceId);
        if (!service) {
            return res.status(404).json({ message: 'Service not found.' });
        }

        // Yeni ödeme oluşturma
        const newPayment = new Payment({
            customerId,
            serviceId,
            subscriptionId: subscriptionId || null,
            appointmentId: appointmentId || null,
            amount,
            date: new Date(date),
        });

        // Ödemeyi kaydetme
        await newPayment.save();

        res.status(201).json({ message: 'Payment added successfully.', payment: newPayment });
    } catch (error) {
        console.error('Error adding payment:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try {
        // Ödemeyi veritabanında bul ve sil
        const payment = await Payment.findByIdAndDelete(id);

        if (!payment) {
            return res.status(404).json({ message: 'Payment not found.' });
        }

        res.status(200).json({ message: 'Payment deleted successfully.', payment });
    } catch (error) {
        console.error('Error deleting payment:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

router.put('/:id', async (req, res) => {
    const paymentId = req.params.id;
    const { subscriptionId, appointmentId, ...updateData } = req.body;

    try {
        // Eğer subscriptionId veya appointmentId yoksa, hata döndür
        if (!subscriptionId && !appointmentId) {
            return res.status(400).json({
                message: 'Either subscriptionId or appointmentId must be provided.',
            });
        }

        // Eğer subscriptionId veya appointmentId boş bir string ise, null olarak ayarla
        const sanitizedData = {
            ...updateData,
            subscriptionId: subscriptionId === '' ? null : subscriptionId,
            appointmentId: appointmentId === '' ? null : appointmentId,
        };

        const updatedPayment = await Payment.findByIdAndUpdate(paymentId, sanitizedData, {
            new: true,
        });

        if (!updatedPayment) {
            return res.status(404).json({ message: 'Payment not found' });
        }

        res.status(200).json({ message: 'Payment updated successfully', payment: updatedPayment });
    } catch (error) {
        console.error('Error updating payment:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});


export default router;
