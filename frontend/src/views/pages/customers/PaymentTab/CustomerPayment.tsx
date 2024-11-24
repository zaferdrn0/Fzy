import React, { useState, useEffect } from 'react';
import {
    Typography,
    Divider,
    List,
    ListItem,
    ListItemText,
    Button,
    Box,
} from '@mui/material';
import { Icon } from '@iconify/react';
import { Service, Payment } from '@/models/dataType';
import AddPaymentModal from '@/components/payment/AddPaymentModal';
import UpdatePaymentModal from '@/components/payment/UpdatePaymentModal';
import { fetchBackendGET, fetchBackendPOST, fetchBackendPUT, fetchBackendDELETE } from '@/utils/backendFetch';
import { capitalizeFirstLetter } from '@/utils/capitalizeFirstLetter';
import { useRouter } from 'next/router';

interface CustomerPaymentsProps {
    services: Service[] | null;
}

const CustomerPayments: React.FC<CustomerPaymentsProps> = ({ services }) => {
    const [payments, setPayments] = useState<Payment[] | null>(null);
    const [openPaymentModal, setOpenPaymentModal] = useState<boolean>(false);
    const [openUpdatePaymentModal, setOpenUpdatePaymentModal] = useState<boolean>(false);
    const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);
    const router = useRouter()
    const { customerId } = router.query;

    const fetchPayments = async () => {
        try {
            const response = await fetchBackendGET(`/payment/${customerId}`);
            if (response.ok) {
                const data = await response.json();
                setPayments(data);
            } else {
                setPayments(null);
            }
        } catch (error) {
            console.error('Error fetching payments:', error);
            setPayments(null);
        }
    };

    useEffect(() => {
        fetchPayments();
    }, [customerId]);

    const handleAddPayment = async (paymentData: {
        customerId: string;
        serviceId: string;
        subscriptionId?: string;
        appointmentId?: string;
        amount: number;
        date: string;
    }) => {
        try {
            const response = await fetchBackendPOST('/payment/add', paymentData);
            if (response.ok) {
                const { payment } = await response.json();
                setPayments((prev) => (prev ? [...prev, payment] : [payment]));
                alert('Payment added successfully');
            } else {
                alert('Error adding payment.');
            }
        } catch (error) {
            console.error('Error adding payment:', error);
        }
    };

    const handleUpdatePayment = async (paymentData: {
        paymentId: string;
        amount?: number;
        date?: string;
        status?: string;
        serviceId?: string;
        subscriptionId?: string;
        appointmentId?: string;
    }) => {
        try {
            const response = await fetchBackendPUT(`/payment/${paymentData.paymentId}`, paymentData);
            if (response.ok) {
                const { payment } = await response.json();
                setPayments((prev) =>
                    prev ? prev.map((p) => (p._id === payment._id ? payment : p)) : null
                );
                alert('Payment updated successfully.');
            } else {
                alert('Error updating payment.');
            }
        } catch (error) {
            console.error('Error updating payment:', error);
        }
    };

    const handleDeletePayment = async (paymentId: string) => {
        try {
            const response = await fetchBackendDELETE(`/payment/${paymentId}`);
            if (response.ok) {
                setPayments((prev) => (prev ? prev.filter((p) => p._id !== paymentId) : null));
                alert('Payment deleted successfully');
            } else {
                alert('Error deleting payment.');
            }
        } catch (error) {
            console.error('Error deleting payment:', error);
        }
    };

    return (
        <div>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography variant="h6">Ödemeler</Typography>
                <Button onClick={() => setOpenPaymentModal(true)} variant="contained" size="small">
                    Ekle
                </Button>
            </Box>
            <AddPaymentModal
                open={openPaymentModal}
                onClose={() => setOpenPaymentModal(false)}
                onSubmit={handleAddPayment}
                customerId={customerId as string}
            />
            <UpdatePaymentModal
                open={openUpdatePaymentModal}
                onClose={() => setOpenUpdatePaymentModal(false)}
                onSubmit={handleUpdatePayment}
                payment={selectedPayment}
                customerId={customerId as string}
            />
            <Divider sx={{ my: 2 }} />
            {payments && payments.length > 0 ? (
                <List>
                    {payments.map((payment) => {
                        const service = services?.find((s) => s._id === payment.serviceId);
                        const serviceType = service ? capitalizeFirstLetter(service.type) : 'Bilinmiyor';
                        return (
                            <ListItem key={payment._id} sx={{ borderBottom: '1px solid #e0e0e0' }}>
                                <ListItemText
                                    primary={serviceType}
                                    secondary={`Tutar: ${payment.amount} TL | Tarih: ${new Date(
                                        payment.date
                                    ).toLocaleDateString()}`}
                                />
                                <Button
                                    sx={{ mr: 3 }}
                                    onClick={() => {
                                        setSelectedPayment(payment);
                                        setOpenUpdatePaymentModal(true);
                                    }}
                                    variant="contained"
                                    color="info"
                                    size="small"
                                    startIcon={<Icon icon="mdi:pencil" />}
                                >
                                    Düzenle
                                </Button>
                                <Button
                                    onClick={() => handleDeletePayment(payment._id)}
                                    variant="contained"
                                    color="error"
                                    size="small"
                                    startIcon={<Icon icon="mdi:delete" />}
                                >
                                    Sil
                                </Button>
                            </ListItem>
                        );
                    })}
                </List>
            ) : (
                <Typography color="text.secondary">Ödeme bulunmamaktadır.</Typography>
            )}
        </div>
    );
};

export default CustomerPayments;
