import express from 'express';
import { authenticate } from '../middleware/authentication.js';
import { Customer,Appointment,Payment,Service,Subscription } from '../models/index.js';

const router = express.Router();
router.post('/add', authenticate ,async (req, res) => {
    try {
        const {
            customerId,
            serviceId,
            subscriptionId = null,
            date,
            status = 'İleri Tarihli',
            notes = '',
            fee = 0,
            isPaid = false,
            doctorReport = {},
            massageDetails = {}
        } = req.body;

        // Validation
        if (!customerId || !serviceId || !date) {
            return res.status(400).json({ message: 'Customer, service, and date are required.' });
        }

        // Yeni randevu oluşturma
        const newAppointment = new Appointment({
            customerId,
            serviceId,
            subscriptionId,
            date,
            status,
            notes,
            fee,
            isPaid,
            doctorReport,
            massageDetails
        });

        await newAppointment.save();

        // Service detaylarını doldurmak için
        const populatedAppointment = await Appointment.findById(newAppointment._id)
            .populate('serviceId', 'type description')
            .populate('customerId', 'name surname');

        res.status(201).json({ message: 'Appointment added successfully.', appointment: populatedAppointment });
    } catch (error) {
        console.error('Error adding appointment:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});


// Önceki randevu bilgilerini getiren endpoint
router.get('/previous', async (req, res) => {
    const { customerId, serviceId } = req.query;

    try {
        // Gerekli parametrelerin kontrolü
        if (!customerId || !serviceId) {
            return res.status(400).json({ message: 'Customer ID and Service ID are required.' });
        }

        // Veritabanından ilgili randevuyu bul
        const lastAppointment = await Appointment.findOne({
            customerId,
            serviceId,
        })
            .sort({ createdAt: -1 }) // En son oluşturulan randevuyu getir
            .lean(); // Daha hızlı işlem için lean() kullanıyoruz

        if (!lastAppointment) {
            return res.status(404).json({ message: 'No previous appointment found.' });
        }

        // Randevu bilgilerini döndür
        res.status(200).json({ lastAppointment });
    } catch (error) {
        console.error('Error fetching previous appointment:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

// Delete subscription by ID
// Delete appointment by ID
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Randevuyu silme işlemi
        const deletedAppointment = await Appointment.findByIdAndDelete(id);
        if (!deletedAppointment) {
            return res.status(404).json({ message: 'Appointment not found.' });
        }

        res.status(200).json({ message: 'Appointment deleted successfully.' });
    } catch (error) {
        console.error('Error deleting appointment:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});

router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { date, notes, fee, isPaid, doctorReport, massageDetails } = req.body.data;

    try {
        // İlgili randevuyu bul ve güncelle
        const updatedAppointment = await Appointment.findByIdAndUpdate(
            id,
            {
                ...(date && { date: new Date(date) }),
                ...(notes && { notes }),
                ...(fee !== undefined && { fee }),
                ...(isPaid !== undefined && { isPaid }),
                ...(doctorReport && { doctorReport }),
                ...(massageDetails && { massageDetails }),
                updatedAt: Date.now(),
            },
            { new: true, runValidators: true }
        );

        if (!updatedAppointment) {
            return res.status(404).json({ message: 'Appointment not found.' });
        }

        res.status(200).json({ message: 'Appointment updated successfully.', appointment: updatedAppointment });
    } catch (error) {
        console.error('Error updating appointment:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});



export default router;