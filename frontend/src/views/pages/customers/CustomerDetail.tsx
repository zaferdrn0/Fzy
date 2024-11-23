import React, { useState, useMemo, useEffect, SetStateAction, Dispatch } from 'react';
import {
    Box,
    Tab,
    Tabs,
    Card,
    List,
    ListItem,
    ListItemText,
    Grid,
    Typography,
    ButtonGroup,
    Button,
    Chip,
    Divider,
    Avatar,
} from '@mui/material';
import { Icon } from '@iconify/react';
import { Appointment, Customer, Payment, Service, Subscription } from '@/models/dataType';
import { capitalizeFirstLetter } from '@/utils/capitalizeFirstLetter';
import { calculateAge } from '@/utils/calculateAge';
import AddSubscriptionModal from '@/components/subscriptions/AddSubscription';
import { fetchBackendDELETE, fetchBackendGET, fetchBackendPOST, fetchBackendPUT } from '@/utils/backendFetch';
import { getMembershipStatus } from '@/utils/isMembershipActive';
import AddAppointmentModal from '@/components/appointments/AddAppointmentModal';
import UpdateSubscriptionModal from '@/components/subscriptions/UpdateSubscriptionModal';
import UpdateAppointmentModal from '@/components/appointments/UpdateAppointmentModal';
import AddPaymentModal from '@/components/payment/AddPaymentModal';
import UpdatePaymentModal from '@/components/payment/UpdatePaymentModal';

interface TabPanelProps {
    children?: React.ReactNode;
    index: number;
    value: number;
}

function TabPanel(props: TabPanelProps) {
    const { children, value, index, ...other } = props;

    return (
        <div
            role="tabpanel"
            hidden={value !== index}
            {...other}
        >
            {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
        </div>
    );
}

interface CustomerDetailProps {
    customer: Customer;
    setCustomer: Dispatch<SetStateAction<Customer | null>>;
}

const CustomerDetail: React.FC<CustomerDetailProps> = ({ customer, setCustomer }) => {
    const [tabValue, setTabValue] = useState(0);
    const [selectedFilter, setSelectedFilter] = useState<'İleri Tarihli' | 'Kaçırdı' | 'Geldi' | 'Hepsi'>('Hepsi');
    const [openSubscriptionModal, setOpenSubscriptionModal] = useState<boolean>(false);
    const [services, setServices] = useState<Service[] | null>(null);
    const [openAppointmentModal, setOpenAppointmentModal] = useState(false);
    const [openSubscriptionUpdateModal, setOpenSubscriptionUpdateModal] = useState(false);
    const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);
    const [selectedAppointment, setSelectedAppointment] = useState<Appointment | null>(null);
    const [openAppointmentUpdateModal, setOpenUpdateAppointmentModal] = useState<boolean>(false)
    const [openPaymentModal, setOpenPaymentModal] = useState(false);
    const [openUpdatePaymentModal, setOpenUpdatePaymentModal] = useState(false);
    const [selectedPayment, setSelectedPayment] = useState<Payment | null>(null);


    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    const handleAddSubscription = async (data: {
        customerId: string;
        serviceId: string;
        durationDays: number;
        startDate: string;
        sessionLimit?: number;
        fee?: number;
    }) => {
        try {
            const response = await fetchBackendPOST('/subscription/add', data); // API'ye istek gönder
            if (response.ok) {
                const { subscription } = await response.json(); // Yeni aboneliği çek
                alert('Subscription added successfully');

                setCustomer((prevCustomer) => {
                    if (!prevCustomer) return null;

                    // Yeni hizmet, dönen subscription'daki serviceId nesnesinden alınır.
                    const newService = subscription.serviceId;

                    // Hizmet listesi güncelleniyor. Eğer yeni hizmet zaten varsa, eklenmiyor.
                    const updatedServices = prevCustomer.services.some((service) => service._id === newService._id)
                        ? prevCustomer.services
                        : [...prevCustomer.services, newService];

                    return {
                        ...prevCustomer,
                        services: updatedServices, // Hizmetleri güncelle
                        subscriptions: [...prevCustomer.subscriptions, subscription], // Abonelikleri güncelle
                    };
                });
            } else {
                const errorData = await response.json();
                alert(`Error adding subscription: ${errorData.message}`);
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An unexpected error occurred while adding the subscription.');
        }
    };
    const handleAddAppointment = async (appointmentData: {
        customerId: string;
        serviceId: string;
        date: string;
        notes?: string;
        fee: number;
        isPaid: boolean;
        doctorReport?: {
            diagnosis?: string;
            injuryType?: string;
            notes?: string;
        };
        massageDetails?: {
            massageType?: string;
            notes?: string;
        };
    }) => {
        try {
            const response = await fetchBackendPOST('/appointment/add', appointmentData);

            if (response.ok) {
                const newAppointment = await response.json();

                // Yeni randevuyu müşteri objesine ekleme
                setCustomer((prevCustomer) => {
                    if (!prevCustomer) return null;
                    return {
                        ...prevCustomer,
                        appointments: [...prevCustomer.appointments, newAppointment.appointment],
                    };
                });

                alert('Appointment added successfully.');
            } else {
                alert('Error adding appointment.');
            }
        } catch (error) {
            console.error('Error adding appointment:', error);
        }
    };

    const handleUpdateAppointment = async (data: {
        appointmentId: string;
        date?: string;
        notes?: string;
        fee?: number;
        isPaid?: boolean;
        doctorReport?: {
            diagnosis?: string;
            injuryType?: string;
            notes?: string;
        };
        massageDetails?: {
            massageType?: string;
            notes?: string;
        };
    }) => {
        try {
            const response = await fetchBackendPUT(`/appointment/${data.appointmentId}`, { data });

            if (response.ok) {
                const updatedAppointment = await response.json();

                setCustomer((prevCustomer) => {
                    if (!prevCustomer) return null;

                    return {
                        ...prevCustomer,
                        appointments: prevCustomer.appointments.map((appt) =>
                            appt._id === updatedAppointment.appointment._id
                                ? updatedAppointment.appointment
                                : appt
                        ),
                    };
                });

                alert('Appointment updated successfully.');
            } else {
                alert('Error updating appointment.');
            }
        } catch (error) {
            console.error('Error updating appointment:', error);
        }
    };

    const handleDeletePayment = async (paymentId: string) => {
        try {
            const response = await fetchBackendDELETE(`/payment/${paymentId}`);
            if (response.ok) {
                const { payment } = await response.json();
                alert('Payment deleted successfully');

                // Ödemeyi mevcut müşteri objesinden kaldır
                setCustomer((prevCustomer) => {
                    if (!prevCustomer) return null;

                    return {
                        ...prevCustomer,
                        payments: prevCustomer.payments.filter((p) => p._id !== payment._id),
                    };
                });
            } else {
                alert('Error deleting payment.');
            }
        } catch (error) {
            console.error('Error deleting payment:', error);
        }
    };

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
                alert('Payment added successfully');

                // Yeni ödemeyi mevcut müşteri objesine ekleme
                setCustomer((prevCustomer) => {
                    if (!prevCustomer) return null; // Önceki müşteri null ise işlem yapılmaz

                    return {
                        ...prevCustomer,
                        payments: [...(prevCustomer.payments || []), payment], // Ödemeleri güncelle
                    };
                });
            } else {
                alert('Error adding payment.');
            }
        } catch (error) {
            console.error('Error adding payment:', error);
        }
    };

    const handleOpenUpdateModal = (payment: Payment) => {
        setSelectedPayment(payment);
        setOpenUpdatePaymentModal(true);
    };

    const handleCloseUpdateModal = () => {
        setSelectedPayment(null);
        setOpenUpdatePaymentModal(false);
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

                setCustomer((prevCustomer) => {
                    if (!prevCustomer) return null;
                    return {
                        ...prevCustomer,
                        payments: prevCustomer.payments.map((p) =>
                            p._id === payment._id ? payment : p
                        ),
                    };
                });

                alert('Payment updated successfully.');
            } else {
                alert('Error updating payment.');
            }
        } catch (error) {
            console.error('Error updating payment:', error);
        }
    };


    const getServices = async () => {
        try {
            const response = await fetchBackendGET(`/service/list`);
            if (response.ok) {
                const data = await response.json();
                setServices(data);
            } else {
                console.error('Failed to fetch services');
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }


    const handleUpdateSubscription = async (data: {
        subscriptionId: string;
        durationDays?: number;
        startDate?: string;
        sessionLimit?: number;
        fee?: number;
    }) => {
        try {
            const response = await fetchBackendPUT(`/subscription/${data.subscriptionId}`, { data });

            if (response.ok) {
                const updatedSubscription = await response.json();

                setCustomer((prevCustomer) => {
                    if (!prevCustomer) return null;

                    return {
                        ...prevCustomer,
                        subscriptions: prevCustomer.subscriptions.map((sub) =>
                            sub._id === updatedSubscription.subscription._id
                                ? updatedSubscription.subscription
                                : sub
                        ),
                    };
                });

                alert('Subscription updated successfully.');
            } else {
                alert('Error updating subscription.');
            }
        } catch (error) {
            console.error('Error updating subscription:', error);
        }
    };


    const servicesWithPaymentInfo = useMemo(() => {
        return customer.services.map((service) => {
            // Aboneliklerin geçerlilik durumunu kontrol et
            const serviceSubscriptions = customer.subscriptions.filter((sub) => {
                const { isActive } = getMembershipStatus(sub.startDate, sub.durationDays);
                return sub.serviceId === service._id && isActive;
            });

            // Randevuların toplam ücretlerini al
            const serviceAppointments = customer.appointments.filter(
                (appt) => appt.serviceId === service._id
            );

            // Aboneliklerden gelen toplam ücret
            const totalSubscriptionFee = serviceSubscriptions.reduce((acc, sub) => acc + sub.fee, 0);

            // Randevulardan gelen toplam ücret
            const totalAppointmentFee = serviceAppointments.reduce((acc, appt) => acc + appt.fee, 0);

            // Tüm ödemeler (abonelik ve randevu dahil)
            const totalPaid = customer.payments
                .filter((payment) => payment.serviceId === service._id)
                .reduce((acc, payment) => acc + payment.amount, 0);

            // Kalan bakiye hesaplama
            const totalFee = totalSubscriptionFee + totalAppointmentFee;
            const remainingBalance = totalFee - totalPaid;

            return {
                ...service,
                totalFee, // Toplam ücret (abonelik + randevular)
                totalPaid, // Ödenen toplam miktar
                remainingBalance, // Kalan bakiye
            };
        });
    }, [customer.services, customer.subscriptions, customer.appointments, customer.payments]);



    const filteredAppointments = useMemo(() => {
        if (selectedFilter === 'Hepsi') return customer.appointments;
        return customer.appointments.filter((appt) => appt.status === selectedFilter);
    }, [selectedFilter, customer.appointments]);


    useEffect(() => {
        getServices()
    }, [])

    return (
        <Box sx={{ p: 3 }}>
            <Grid container spacing={3}>
                <Grid item xs={12} sm={12} md={12} lg={3} xl={3}>
                    <Card sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
                            <Avatar sx={{ width: 120, height: 120, mb: 2 }} src="/default-avatar.png" />
                            <Typography variant="h5">
                                {`${customer.name.toUpperCase()} ${customer.surname.toUpperCase()}`}
                            </Typography>
                        </Box>
                        <Typography variant="h6" sx={{ mb: 2 }}>Detaylar</Typography>
                        <List dense>
                            <ListItem>
                                <ListItemText primary="E-posta" secondary={customer.email} />
                            </ListItem>
                            <ListItem>
                                <ListItemText primary="Telefon" secondary={customer.phone} />
                            </ListItem>
                            <ListItem>
                                <ListItemText primary="Yaş" secondary={calculateAge(customer.birthDate)} />
                            </ListItem>
                            <ListItem>
                                <ListItemText primary="Ağırlık" secondary={`${customer.weight} kg`} />
                            </ListItem>
                        </List>
                    </Card>
                </Grid>

                <Grid item xs={12} sm={12} md={12} lg={9} xl={9}>
                    <Card>
                        <Tabs
                            value={tabValue}
                            onChange={handleTabChange}
                            sx={{ borderBottom: 1, borderColor: 'divider' }}
                            variant="scrollable"
                            scrollButtons="auto"
                        >
                            <Tab label="Genel Bakış" icon={<Icon icon="mdi:account-details" />} iconPosition="start" />
                            <Tab label="Hizmetler" icon={<Icon icon="mdi:medical-bag" />} iconPosition="start" />
                            <Tab label="Abonelikler" icon={<Icon icon="mdi:subscription" />} iconPosition="start" />
                            <Tab label="Randevular" icon={<Icon icon="mdi:calendar-clock" />} iconPosition="start" />
                            <Tab label="Ödemeler" icon={<Icon icon="mdi:currency-usd" />} iconPosition="start" />
                            <Tab label="Geçmiş" icon={<Icon icon="mdi:history" />} iconPosition="start" />
                        </Tabs>

                        <TabPanel value={tabValue} index={0}>
                            <Typography variant="h6" gutterBottom>Hizmetler ve Ödeme Bilgileri</Typography>
                            <Divider sx={{ my: 2 }} />
                            {servicesWithPaymentInfo.map((service) => (
                                <Box
                                    key={service._id}
                                    sx={{ mb: 3, p: 2, border: 1, borderColor: 'divider', borderRadius: 2 }}
                                >
                                    <Typography variant="subtitle1" gutterBottom>
                                        {capitalizeFirstLetter(service.type)}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary">
                                        Toplam Ücret: {service.totalFee} TL
                                    </Typography>
                                    <Typography variant="body2" color="success.main">
                                        Ödenen: {service.totalPaid.toFixed(2)} TL
                                    </Typography>
                                    <Typography variant="body2" color="error.main">
                                        Kalan Bakiye: {service.remainingBalance.toFixed(2)} TL
                                    </Typography>
                                </Box>
                            ))}
                        </TabPanel>

                        <TabPanel value={tabValue} index={1}>
                            <Typography variant="h6" gutterBottom>Hizmetler</Typography>
                            <Divider sx={{ my: 2 }} />
                            <List>
                                {customer.services.map((service) => (
                                    <ListItem key={service._id} sx={{ borderBottom: '1px solid #e0e0e0' }}>
                                        <ListItemText primary={service.type} secondary={service.description} />
                                    </ListItem>
                                ))}
                            </List>
                        </TabPanel>

                        <TabPanel value={tabValue} index={2}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                <Typography variant="h6">Abonelikler</Typography>
                                <Button onClick={() => setOpenSubscriptionModal(true)} variant="contained" size="small">Ekle</Button>
                            </Box>
                            <UpdateSubscriptionModal
                                open={openSubscriptionUpdateModal}
                                onClose={() => setOpenSubscriptionUpdateModal(false)}
                                onSubmit={handleUpdateSubscription}
                                subscription={selectedSubscription!}
                            />
                            <AddSubscriptionModal
                                open={openSubscriptionModal}
                                onClose={() => setOpenSubscriptionModal(false)}
                                onSubmit={handleAddSubscription}
                                services={services}
                                customerId={customer._id}
                            />
                            <Divider sx={{ my: 2 }} />
                            {customer.subscriptions.length > 0 ? (
                                <List>
                                    {customer.subscriptions.map((subscription) => {
                                        const service = customer.services.find((s) => s._id === subscription.serviceId);
                                        const serviceType = service ? capitalizeFirstLetter(service.type) : 'Bilinmiyor';

                                        const { isActive, daysLeft } = getMembershipStatus(
                                            subscription.startDate,
                                            subscription.durationDays
                                        );

                                        const handleDeleteSubscription = async () => {
                                            try {
                                                const response = await fetchBackendDELETE(`/subscription/${subscription._id}`);
                                                if (response.ok) {
                                                    alert('Subscription deleted successfully');
                                                    setCustomer((prevCustomer) => {
                                                        if (!prevCustomer) return null;
                                                        return {
                                                            ...prevCustomer,
                                                            subscriptions: prevCustomer.subscriptions.filter((sub) => sub._id !== subscription._id),
                                                        };
                                                    });
                                                } else {
                                                    alert('Error deleting subscription.');
                                                }
                                            } catch (error) {
                                                console.error('Error deleting subscription:', error);
                                            }
                                        };

                                        return (
                                            <ListItem key={subscription._id} sx={{ borderBottom: '1px solid #e0e0e0' }}>
                                                <ListItemText
                                                    primary={serviceType}
                                                    secondary={`Başlangıç: ${new Date(subscription.startDate).toLocaleDateString()} | Kalan Gün: ${daysLeft}`}
                                                />

                                                <Chip
                                                    label={isActive ? 'Aktif' : 'Pasif'}
                                                    color={isActive ? 'success' : 'default'}
                                                />
                                                <Box>
                                                    <Icon
                                                        icon="mdi:pencil"
                                                        color="blue"
                                                        style={{ cursor: 'pointer', marginRight: 8 }}
                                                        onClick={() => {
                                                            setSelectedSubscription(subscription);
                                                            setOpenSubscriptionUpdateModal(true);
                                                        }}
                                                    />
                                                </Box>
                                                <Button
                                                    onClick={() => handleDeleteSubscription()}
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
                                <Typography color="text.secondary">Aktif abonelik bulunmamaktadır.</Typography>
                            )}
                        </TabPanel>

                        <TabPanel value={tabValue} index={3}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                <Typography variant="h6">Randevular</Typography>
                                <Button onClick={() => setOpenAppointmentModal(true)} variant="contained" size="small">Ekle</Button>
                            </Box>
                            <UpdateAppointmentModal
                                open={openAppointmentUpdateModal}
                                onClose={() => setOpenUpdateAppointmentModal(false)}
                                onSubmit={handleUpdateAppointment}
                                appointment={selectedAppointment!}
                            />
                            <AddAppointmentModal
                                open={openAppointmentModal}
                                onClose={() => setOpenAppointmentModal(false)}
                                onSubmit={handleAddAppointment}
                                customerId={customer._id}
                                services={services}
                            />
                            <Divider sx={{ my: 2 }} />
                            <ButtonGroup fullWidth sx={{ mt: 2, mb: 2 }}>
                                <Button
                                    variant={selectedFilter === 'İleri Tarihli' ? 'contained' : 'outlined'}
                                    onClick={() => setSelectedFilter('İleri Tarihli')}
                                >
                                    İleri Tarihli
                                </Button>
                                <Button
                                    variant={selectedFilter === 'Kaçırdı' ? 'contained' : 'outlined'}
                                    onClick={() => setSelectedFilter('Kaçırdı')}
                                >
                                    Kaçırdı
                                </Button>
                                <Button
                                    variant={selectedFilter === 'Geldi' ? 'contained' : 'outlined'}
                                    onClick={() => setSelectedFilter('Geldi')}
                                >
                                    Geldi
                                </Button>
                                <Button
                                    variant={selectedFilter === 'Hepsi' ? 'contained' : 'outlined'}
                                    onClick={() => setSelectedFilter('Hepsi')}
                                >
                                    Hepsi
                                </Button>
                            </ButtonGroup>
                            {filteredAppointments.length > 0 ? (
                                <List>
                                    {filteredAppointments.map((appointment) => {
                                        const service = customer.services.find((s) => s._id === appointment.serviceId);
                                        const serviceType = service ? capitalizeFirstLetter(service.type) : 'Bilinmiyor';

                                        const handleDeleteAppointment = async () => {
                                            try {
                                                const response = await fetchBackendDELETE(`/appointment/${appointment._id}`);
                                                if (response.ok) {
                                                    alert('Appointment deleted successfully');
                                                    setCustomer((prevCustomer) => {
                                                        if (!prevCustomer) return null;
                                                        return {
                                                            ...prevCustomer,
                                                            appointments: prevCustomer.appointments.filter((appt) => appt._id !== appointment._id),
                                                        };
                                                    });
                                                } else {
                                                    alert('Error deleting appointment.');
                                                }
                                            } catch (error) {
                                                console.error('Error deleting appointment:', error);
                                            }
                                        };

                                        return (
                                            <ListItem key={appointment._id} sx={{ borderBottom: '1px solid #e0e0e0' }}>
                                                <ListItemText
                                                    primary={serviceType}
                                                    secondary={`Tarih: ${new Date(appointment.date).toLocaleDateString()} | Durum: ${appointment.status}`}
                                                />
                                                <Box>
                                                    <Icon
                                                        icon="mdi:pencil"
                                                        color="blue"
                                                        style={{ cursor: 'pointer', marginRight: 8 }}
                                                        onClick={() => {
                                                            setSelectedAppointment(appointment);
                                                            setOpenUpdateAppointmentModal(true);
                                                        }}
                                                    />
                                                </Box>
                                                <Button
                                                    onClick={() => handleDeleteAppointment()}
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
                                <Typography color="text.secondary">Randevu bulunmamaktadır.</Typography>
                            )}
                        </TabPanel>

                        <TabPanel value={tabValue} index={4}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                                <Typography variant="h6">Ödemeler</Typography>
                                <Button onClick={() => setOpenPaymentModal(true)} variant="contained" size="small">Ekle</Button>
                            </Box>
                            <AddPaymentModal
                                open={openPaymentModal}
                                onClose={() => setOpenPaymentModal(false)}
                                onSubmit={handleAddPayment}
                                customerId={customer._id}
                                services={customer.services}
                                subscriptions={customer.subscriptions}
                                appointments={customer.appointments}
                            />
                            <UpdatePaymentModal
                                open={openUpdatePaymentModal}
                                onClose={handleCloseUpdateModal}
                                onSubmit={handleUpdatePayment}
                                payment={selectedPayment}
                                services={customer.services}
                                subscriptions={customer.subscriptions}
                                appointments={customer.appointments}
                            />
                            <Divider sx={{ my: 2 }} />
                            {customer.payments.length > 0 ? (
                                <List>
                                    {customer.payments.map((payment) => {
                                        const service = customer.services.find((s) => s._id === payment.serviceId);
                                        const serviceType = service ? capitalizeFirstLetter(service.type) : 'Bilinmiyor';
                                        return (
                                            <ListItem key={payment._id} sx={{ borderBottom: '1px solid #e0e0e0' }}>
                                                <ListItemText
                                                    primary={serviceType}
                                                    secondary={`Tutar: ${payment.amount} TL | Tarih: ${new Date(payment.date).toLocaleDateString()}`}
                                                />
                                                <Button onClick={() => handleOpenUpdateModal(payment)}>Güncelle</Button>
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
                        </TabPanel>
                        <TabPanel value={tabValue} index={5}>
    <Typography variant="h6" gutterBottom>Geçmiş</Typography>
    <Divider sx={{ my: 2 }} />

    {/* Ödenmiş Ödemeler */}
    <Typography variant="subtitle1" gutterBottom>Ödenmiş Ödemeler</Typography>
    <List>
        {customer.payments.filter(payment => new Date(payment.date) < new Date()).map(payment => {
            const service = customer.services.find(s => s._id === payment.serviceId);
            const serviceType = service ? capitalizeFirstLetter(service.type) : 'Bilinmiyor';

            return (
                <ListItem key={payment._id} sx={{ borderBottom: '1px solid #e0e0e0' }}>
                    <ListItemText
                        primary={serviceType}
                        secondary={`Tutar: ${payment.amount} TL | Tarih: ${new Date(payment.date).toLocaleDateString()}`}
                    />
                </ListItem>
            )
        })}
    </List>
</TabPanel>



                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
};

export default CustomerDetail;
