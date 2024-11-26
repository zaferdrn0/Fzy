import React, { useState, useEffect } from 'react';
import {
    Modal,
    Box,
    Typography,
    TextField,
    Button,
    MenuItem,
    Select,
    FormControl,
    InputLabel,
    CircularProgress,
} from '@mui/material';
import { Service, Subscription, Appointment } from '@/models/dataType';
import { fetchBackendGET } from '@/utils/backendFetch';

interface AddPaymentModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (paymentData: {
        customerId: string;
        serviceId: string;
        subscriptionId?: string;
        appointmentId?: string;
        amount: number;
        date: string;
    }) => void;
    customerId: string;
}

const AddPaymentModal: React.FC<AddPaymentModalProps> = ({
    open,
    onClose,
    onSubmit,
    customerId,
}) => {
    const [services, setServices] = useState<Service[]>([]);
    const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
    const [appointments, setAppointments] = useState<Appointment[]>([]);
    const [selectedService, setSelectedService] = useState<string>('');
    const [formData, setFormData] = useState({
        serviceId: '',
        subscriptionId: '',
        appointmentId: '',
        amount: '',
        date: '',
    });
    const [filteredSubscriptions, setFilteredSubscriptions] = useState<Subscription[]>([]);
    const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState<boolean>(false);
    const [remainingBalance, setRemainingBalance] = useState<number | null>(null);

    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const [servicesResponse, subscriptionsResponse, appointmentsResponse] = await Promise.all([
                    fetchBackendGET(`/service/${customerId}`),
                    fetchBackendGET(`/subscription/${customerId}`),
                    fetchBackendGET(`/appointment/${customerId}`),
                ]);

                if (servicesResponse.ok) {
                    setServices(await servicesResponse.json());
                }
                if (subscriptionsResponse.ok) {
                    setSubscriptions(await subscriptionsResponse.json());
                }
                if (appointmentsResponse.ok) {
                    setAppointments(await appointmentsResponse.json());
                }
            } catch (error) {
                console.error('Error fetching data:', error);
            } finally {
                setLoading(false);
            }
        };

        if (open) {
            fetchData();
        }
    }, [open, customerId]);

    useEffect(() => {
        if (selectedService) {
            const subs = subscriptions.filter((sub) => sub.serviceId === selectedService);
            setFilteredSubscriptions(subs);

            const appts = appointments.filter((appt) => appt.serviceId === selectedService);
            setFilteredAppointments(appts);

            setFormData((prev) => ({ ...prev, serviceId: selectedService, subscriptionId: '', appointmentId: '' }));
            setRemainingBalance(null); // Reset remaining balance
        } else {
            setFilteredSubscriptions([]);
            setFilteredAppointments([]);
        }
    }, [selectedService, subscriptions, appointments]);

    useEffect(() => {
        // Backend'den gelen `remainingBalance` değerini al
        if (formData.subscriptionId) {
            const subscription = filteredSubscriptions.find((sub) => sub._id === formData.subscriptionId);
            if (subscription) setRemainingBalance(subscription.remainingBalance || 0);
        } else if (formData.appointmentId) {
            const appointment = filteredAppointments.find((appt) => appt._id === formData.appointmentId);
            if (appointment) setRemainingBalance(appointment.remainingBalance || 0);
        } else {
            setRemainingBalance(null);
        }
    }, [formData.subscriptionId, formData.appointmentId, filteredSubscriptions, filteredAppointments]);

    const handleChange = (e: { target: { name: string; value: string } }) => {
        const { name, value } = e.target;

        if (name === 'subscriptionId') {
            // Abonelik seçildiğinde randevu temizlenir
            setFormData((prev) => ({ ...prev, subscriptionId: value, appointmentId: '' }));
        } else if (name === 'appointmentId') {
            // Randevu seçildiğinde abonelik temizlenir
            setFormData((prev) => ({ ...prev, appointmentId: value, subscriptionId: '' }));
        } else if (name === 'amount' && remainingBalance !== null && +value > remainingBalance) {
            // Miktar kontrolü
            alert(`Girilen miktar kalan borçtan fazla olamaz! (${remainingBalance} TL)`);
            return;
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = () => {
        const { serviceId, subscriptionId, appointmentId, amount, date } = formData;

        if (!serviceId) {
            alert('Lütfen bir hizmet seçin.');
            return;
        }

        if (!amount || +amount <= 0) {
            alert('Lütfen geçerli bir miktar girin.');
            return;
        }

        if (!date) {
            alert('Lütfen bir tarih seçin.');
            return;
        }

        if (!subscriptionId && !appointmentId) {
            alert('Lütfen bir abonelik veya randevu seçin.');
            return;
        }

        onSubmit({
            customerId,
            serviceId,
            subscriptionId: subscriptionId || undefined,
            appointmentId: appointmentId || undefined,
            amount: +amount,
            date,
        });
        onClose();
    };

    if (loading) {
        return (
            <Modal open={open} onClose={onClose}>
                <Box sx={{ p: 4, bgcolor: 'background.paper', borderRadius: 2, width: 400, mx: 'auto', mt: 10 }}>
                    <Typography variant="h6" gutterBottom>Veriler Yükleniyor...</Typography>
                    <CircularProgress />
                </Box>
            </Modal>
        );
    }

    return (
        <Modal open={open} onClose={onClose}>
            <Box sx={{ p: 4, bgcolor: 'background.paper', borderRadius: 2, width: 400, mx: 'auto', mt: 10 }}>
                <Typography variant="h6" gutterBottom>Ödeme Ekle</Typography>
                <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Hizmet</InputLabel>
                    <Select
                        name="serviceId"
                        value={selectedService}
                        onChange={(e) => setSelectedService(e.target.value as string)}
                        fullWidth
                    >
                        {services.map((service) => (
                            <MenuItem key={service._id} value={service._id}>
                                {service.type}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                {selectedService && (
                    <>
                        {filteredSubscriptions.length > 0 && !formData.appointmentId && (
                            <FormControl fullWidth sx={{ mb: 2 }}>
                                <InputLabel>Abonelik</InputLabel>
                                <Select
                                    name="subscriptionId"
                                    value={formData.subscriptionId}
                                    onChange={handleChange}
                                    fullWidth
                                >
                                    <MenuItem value="">Seçim Yok</MenuItem>
                                    {filteredSubscriptions.map((sub) => (
                                        <MenuItem
                                            key={sub._id}
                                            value={sub._id}
                                            disabled={sub.remainingBalance <= 0} // Kalan borç 0 veya negatifse disable
                                        >
                                            {`${sub._id} - ${new Date(sub.startDate).toLocaleDateString()} - ${sub.remainingBalance > 0 ? `${sub.remainingBalance} TL` : 'Ödendi'
                                                }`}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        )}

                        {filteredAppointments.length > 0 && !formData.subscriptionId && (
                            <FormControl fullWidth sx={{ mb: 2 }}>
                                <InputLabel>Randevu</InputLabel>
                                <Select
                                    name="appointmentId"
                                    value={formData.appointmentId}
                                    onChange={handleChange}
                                    fullWidth
                                >
                                    <MenuItem value="">Seçim Yok</MenuItem>
                                    {filteredAppointments.map((appt) => (
                                        <MenuItem
                                            key={appt._id}
                                            value={appt._id}
                                            disabled={appt.remainingBalance <= 0} // Kalan borç 0 veya negatifse disable
                                        >
                                            {`${new Date(appt.date).toLocaleDateString()} - ${appt.status} - ${appt.remainingBalance > 0 ? `${appt.remainingBalance} TL` : 'Ödendi'
                                                }`}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        )}

                        <TextField
                            fullWidth
                            label={`Miktar (Kalan Borç: ${remainingBalance || 0} TL)`}
                            name="amount"
                            type="number"
                            value={formData.amount}
                            onChange={handleChange}
                            sx={{ mb: 2 }}
                        />
                        <TextField
                            fullWidth
                            type="datetime-local"
                            name="date"
                            value={formData.date}
                            onChange={handleChange}
                            sx={{ mb: 2 }}
                        />
                    </>
                )}
                <Button
                    fullWidth
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={!formData.serviceId}
                >
                    Ekle
                </Button>
            </Box>
        </Modal>
    );
};

export default AddPaymentModal;
