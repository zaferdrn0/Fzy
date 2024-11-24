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
        amount: 0,
        date: '',
    });
    const [filteredSubscriptions, setFilteredSubscriptions] = useState<Subscription[]>([]);
    const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

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
        } else {
            setFilteredSubscriptions([]);
            setFilteredAppointments([]);
        }
    }, [selectedService, subscriptions, appointments]);

    const handleChange = (e: { target: { name: any; value: any } }) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = () => {
        if (!formData.serviceId) {
            alert('Lütfen bir hizmet seçin.');
            return;
        }

        onSubmit({
            customerId,
            serviceId: formData.serviceId,
            subscriptionId: formData.subscriptionId || undefined,
            appointmentId: formData.appointmentId || undefined,
            amount: formData.amount,
            date: formData.date,
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
                        {filteredSubscriptions.length > 0 && (
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
                                        <MenuItem key={sub._id} value={sub._id}>
                                            {sub._id} - {new Date(sub.startDate).toLocaleDateString()}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        )}
                        {filteredAppointments.length > 0 && (
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
                                        <MenuItem key={appt._id} value={appt._id}>
                                            {new Date(appt.date).toLocaleDateString()} - {appt.status}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        )}
                        <TextField
                            fullWidth
                            label="Miktar"
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
                <Button fullWidth variant="contained" onClick={handleSubmit} disabled={!formData.serviceId}>
                    Ekle
                </Button>
            </Box>
        </Modal>
    );
};

export default AddPaymentModal;
