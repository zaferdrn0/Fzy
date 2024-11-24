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
import { fetchBackendGET } from '@/utils/backendFetch';
import { Payment, Service, Subscription, Appointment } from '@/models/dataType';

interface UpdatePaymentModalProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: {
        paymentId: string;
        amount?: number;
        date?: string;
        status?: string;
        serviceId?: string;
        subscriptionId?: string;
        appointmentId?: string;
    }) => void;
    payment: Payment | null;
    customerId: string;
}

const UpdatePaymentModal: React.FC<UpdatePaymentModalProps> = ({
    open,
    onClose,
    onSubmit,
    payment,
    customerId,
}) => {
    const [services, setServices] = useState<Service[] | null>(null);
    const [subscriptions, setSubscriptions] = useState<Subscription[] | null>(null);
    const [appointments, setAppointments] = useState<Appointment[] | null>(null);
    const [formData, setFormData] = useState({
        amount: payment?.amount || 0,
        date: payment?.date || '',
        status: payment?.status || 'paid',
        serviceId: payment?.serviceId || '',
        subscriptionId: payment?.subscriptionId || '',
        appointmentId: payment?.appointmentId || '',
    });
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
        if (payment) {
            setFormData({
                amount: payment.amount || 0,
                date: payment.date || '',
                status: payment.status || 'paid',
                serviceId: payment.serviceId || '',
                subscriptionId: payment.subscriptionId || '',
                appointmentId: payment.appointmentId || '',
            });
        }
    }, [payment]);

    const handleChange = (e: { target: { name: string; value: any } }) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = () => {
        if (payment) {
            onSubmit({ paymentId: payment._id, ...formData });
            onClose();
        }
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
                <Typography variant="h6" gutterBottom>Ödeme Güncelle</Typography>
                <TextField
                    fullWidth
                    label="Tutar"
                    name="amount"
                    type="number"
                    value={formData.amount}
                    onChange={handleChange}
                    sx={{ mb: 2 }}
                />
                <TextField
                    fullWidth
                    label="Tarih"
                    name="date"
                    type="datetime-local"
                    value={formData.date.split('.')[0]} // ISO formatına dönüştür
                    onChange={handleChange}
                    sx={{ mb: 2 }}
                />
                <FormControl fullWidth sx={{ mb: 2 }}>
                    <InputLabel>Hizmet</InputLabel>
                    <Select
                        name="serviceId"
                        value={formData.serviceId}
                        onChange={handleChange}
                    >
                        {services?.map((service) => (
                            <MenuItem key={service._id} value={service._id}>
                                {service.type}
                            </MenuItem>
                        ))}
                    </Select>
                </FormControl>
                {formData.serviceId && (subscriptions ?? []).length > 0 && (
                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel>Abonelik</InputLabel>
                        <Select
                            name="subscriptionId"
                            value={formData.subscriptionId}
                            onChange={handleChange}
                        >
                            {(subscriptions ?? [])
                                .filter((sub) => sub.serviceId === formData.serviceId)
                                .map((sub) => (
                                    <MenuItem key={sub._id} value={sub._id}>
                                        {sub._id}
                                    </MenuItem>
                                ))}
                        </Select>
                    </FormControl>
                )}
                {formData.serviceId && (appointments ?? []).length > 0 && (
                    <FormControl fullWidth sx={{ mb: 2 }}>
                        <InputLabel>Randevu</InputLabel>
                        <Select
                            name="appointmentId"
                            value={formData.appointmentId}
                            onChange={handleChange}
                        >
                            {appointments
                                ?.filter((appt) => appt.serviceId === formData.serviceId)
                                .map((appt) => (
                                    <MenuItem key={appt._id} value={appt._id}>
                                        {new Date(appt.date).toLocaleString()}
                                    </MenuItem>
                                ))}
                        </Select>
                    </FormControl>
                )}
                <Button fullWidth variant="contained" onClick={handleSubmit}>
                    Güncelle
                </Button>
            </Box>
        </Modal>
    );
};

export default UpdatePaymentModal;
