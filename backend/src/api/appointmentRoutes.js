import express from 'express';
import { authenticate } from '../middleware/authentication.js';
import { Customer,Appointment,Payment,Service,Subscription } from '../models/index.js';

const router = express.Router();

router.get('/:customerId', authenticate, async (req, res) => {
    const { customerId } = req.params;
  
    try {
      // Appointmentları getir ve Service bilgilerini ilişkilendir
      const appointments = await Appointment.find({ customerId })
        .populate('serviceId', 'type description') // Service modelinden sadece type ve description alanlarını al
        .lean();
  
      if (!appointments || appointments.length === 0) {
        return res.status(404).json({ message: 'No appointments found for this customer.' });
      }
  
      // Yanıtı düzenli bir formata dönüştür
      const formattedAppointments = appointments.map((appt) => ({
        _id: appt._id,
        date: appt.date,
        status: appt.status,
        notes: appt.notes,
        fee: appt.fee,
        isPaid: appt.isPaid,
        serviceType: appt.serviceId.type,
        serviceDescription: appt.serviceId.description,
        doctorReport: appt.doctorReport,
        massageDetails: appt.massageDetails,
        createdAt: appt.createdAt,
      }));
  
      res.status(200).json(formattedAppointments);
    } catch (error) {
      console.error('Error fetching appointments:', error);
      res.status(500).json({ message: 'Internal server error while fetching appointments.' });
    }
  });
  
  router.post('/add', authenticate, async (req, res) => {
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

        // Eğer bir abonelik seçilmişse sessionLimit kontrolü yap
        if (subscriptionId) {
            const subscription = await Subscription.findById(subscriptionId);

            if (!subscription) {
                return res.status(404).json({ message: 'Subscription not found.' });
            }

            // Mevcut randevuları kontrol et
            const existingAppointments = await Appointment.find({
                subscriptionId: subscriptionId,
                customerId: customerId,
                serviceId: serviceId,
                status: { $in: ['İleri Tarihli', 'Geldi'] } // Geçmiş ve aktif randevular
            });

            // Toplam katılınan ve ileri tarihli ders sayısını hesapla
            const totalAppointments = existingAppointments.length;

            // Eğer randevular sessionLimit'i aşarsa hata ver
            if (totalAppointments >= subscription.sessionLimit + subscription.makeupSessions) {
                return res.status(400).json({
                    message: `Randevu eklenemedi. Bu abonelik için maksimum ${subscription.sessionLimit} ders hakkına ulaşıldı.`,
                });
            }
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

        // Service ve Customer detaylarını doldurmak için
        const populatedAppointment = await Appointment.findById(newAppointment._id)
            .populate('serviceId', 'type description')
            .populate('customerId', 'name surname');

        // Formatlı yanıt
        const formattedAppointment = {
            _id: populatedAppointment._id,
            date: populatedAppointment.date,
            status: populatedAppointment.status,
            notes: populatedAppointment.notes,
            fee: populatedAppointment.fee,
            isPaid: populatedAppointment.isPaid,
            serviceId: populatedAppointment.serviceId._id,
            serviceType: populatedAppointment.serviceId.type,
            doctorReport: populatedAppointment.doctorReport,
            massageDetails: populatedAppointment.massageDetails,
            createdAt: populatedAppointment.createdAt,
            updatedAt: populatedAppointment.updatedAt,
        };

        res.status(201).json({
            message: 'Appointment added successfully.',
            appointment: formattedAppointment,
        });
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
    const { date, notes, fee, isPaid, doctorReport, massageDetails } = req.body;

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
        ).populate('serviceId', 'type description'); // Service bilgilerini doldur

        if (!updatedAppointment) {
            return res.status(404).json({ message: 'Appointment not found.' });
        }

        // Formatlı yanıt
        const formattedAppointment = {
            _id: updatedAppointment._id,
            date: updatedAppointment.date,
            status: updatedAppointment.status,
            notes: updatedAppointment.notes,
            fee: updatedAppointment.fee,
            isPaid: updatedAppointment.isPaid,
            serviceId: updatedAppointment.serviceId._id,
            serviceType: updatedAppointment.serviceId.type,
            doctorReport: updatedAppointment.doctorReport,
            massageDetails: updatedAppointment.massageDetails,
            createdAt: updatedAppointment.createdAt,
            updatedAt: updatedAppointment.updatedAt,
        };

        res.status(200).json({ message: 'Appointment updated successfully.', appointment: formattedAppointment });
    } catch (error) {
        console.error('Error updating appointment:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});
router.put('/status/:id', async (req, res) => {
    const { id } = req.params;
    const { status, notes } = req.body;

    if (!status) {
        return res.status(400).json({ message: 'Status is required.' });
    }

    try {
        // Randevuyu bul ve güncelle
        const updatedAppointment = await Appointment.findByIdAndUpdate(
            id,
            {
                status,
                ...(notes && { notes }),
                updatedAt: Date.now(),
            },
            { new: true, runValidators: true }
        ).populate('serviceId', 'type description'); // Service bilgilerini doldur

        if (!updatedAppointment) {
            return res.status(404).json({ message: 'Appointment not found.' });
        }

        // Formatlı yanıt
        const formattedAppointment = {
            _id: updatedAppointment._id,
            date: updatedAppointment.date,
            status: updatedAppointment.status,
            notes: updatedAppointment.notes,
            fee: updatedAppointment.fee,
            isPaid: updatedAppointment.isPaid,
            serviceId: updatedAppointment.serviceId._id,
            serviceType: updatedAppointment.serviceId.type,
            doctorReport: updatedAppointment.doctorReport,
            massageDetails: updatedAppointment.massageDetails,
            createdAt: updatedAppointment.createdAt,
            updatedAt: updatedAppointment.updatedAt,
        };

        res.status(200).json({
            message: 'Appointment status and notes updated successfully.',
            appointment: formattedAppointment,
        });
    } catch (error) {
        console.error('Error updating appointment status and notes:', error);
        res.status(500).json({ message: 'Internal server error.' });
    }
});



export default router;