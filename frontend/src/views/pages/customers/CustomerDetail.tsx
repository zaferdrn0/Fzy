// components/CustomerDetail.tsx

import React, { useState, useMemo } from 'react';
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
    LinearProgress,
    Divider,
    Paper,
    Modal,
    TextField,
    Fade,
    Avatar,
} from '@mui/material';
import { Icon } from '@iconify/react';
import { Customer, Service, Subscription, Payment, Appointment } from '@/models/dataType';
import { capitalizeFirstLetter } from '@/utils/capitalizeFirstLetter';
import { getStatusColor } from '@/utils/getStatusColor';
import { calculateAge } from '@/utils/calculateAge';
import { fetchBackendPUT } from '@/utils/backendFetch';

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
            {value === index && (
                <Box sx={{ p: 3 }}>
                    {children}
                </Box>
            )}
        </div>
    );
}

interface CustomerDetailProps {
    customer: Customer;
}

const CustomerDetail: React.FC<CustomerDetailProps> = ({ customer }) => {
    const [tabValue, setTabValue] = useState(0);
    const [selectedFilter, setSelectedFilter] = useState<'İleri Tarihli' | 'Kaçırdı' | 'Geldi' | 'Hepsi'>('Hepsi');
    const [openModal, setOpenModal] = useState(false);
    const [isActive, setIsActive] = useState(customer.isActive);
    const [formData, setFormData] = useState({
        name: customer.name,
        surname: customer.surname,
        email: customer.email,
        phone: customer.phone,
        weight: customer.weight,
    });

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    // Toplam ödeme ve bakiye hesaplama
    const servicesWithPaymentInfo = useMemo(() => {
        return customer.services.map((service) => {
            // Abonelikler bu hizmete ait olanlar ve aktif olanlar
            const serviceSubscriptions = customer.subscriptions.filter(
                (sub) => sub.serviceId === service._id && sub.isActive
            );

            // Toplam ücret: tüm aktif aboneliklerin ücretleri
            const totalFee = serviceSubscriptions.reduce((acc, sub) => acc + sub.fee, 0);

            // Toplam ödenen: bu hizmete ait tüm ödemeler
            const totalPaid = customer.payments
                .filter((payment) => payment.serviceId === service._id)
                .reduce((acc, payment) => acc + payment.amount, 0);

            const remainingBalance = totalFee - totalPaid;

            return {
                ...service,
                totalFee,
                totalPaid,
                remainingBalance,
            };
        });
    }, [customer.services, customer.subscriptions, customer.payments]);

    // Randevuların filtrelenmesi
    const filteredAppointments = useMemo(() => {
        if (selectedFilter === 'Hepsi') return customer.appointments;
        return customer.appointments.filter((appt) => appt.status === selectedFilter);
    }, [selectedFilter, customer.appointments]);

    // Aktivite Özeti için istatistikler
    const activityStats = useMemo(() => {
        const totalAppointments = customer.appointments.length;
        const attended = customer.appointments.filter((appt) => appt.status === 'Geldi').length;
        const missed = customer.appointments.filter((appt) => appt.status === 'Kaçırdı').length;
        const scheduled = customer.appointments.filter((appt) => appt.status === 'İleri Tarihli').length;
        const attendanceRate = totalAppointments > 0 ? (attended / totalAppointments) * 100 : 0;

        return {
            totalAppointments,
            attended,
            missed,
            scheduled,
            attendanceRate,
        };
    }, [customer.appointments]);

    // Yardımcı Fonksiyonlar
    const getAllSessionsAndPayments = (customer: Customer) => {
        const allAppointments = customer.appointments.map((appointment) => ({
            type: 'Randevu',
            date: appointment.date,
            serviceType: customer.services.find(service => service._id === appointment.serviceId)?.type || 'Bilinmiyor',
            notes: appointment.notes,
            status: appointment.status,
        }));

        const allPayments = customer.payments.map((payment) => ({
            type: 'Ödeme',
            date: payment.date,
            serviceType: customer.services.find(service => service._id === payment.serviceId)?.type || 'Bilinmiyor',
            notes: null,
            status: `${payment.amount} TL - ${payment.status}`,
        }));

        return [...allAppointments, ...allPayments].sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
        );
    };

    // Modal Fonksiyonları
    const handleOpenModal = () => setOpenModal(true);
    const handleCloseModal = () => setOpenModal(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: name === 'weight' ? Number(value) : value,
        }));
    };

    const handleSubmit = async () => {
        try {
            const response = await fetchBackendPUT(`/customer/${customer._id}`, formData);
            if (response.ok) {
                alert('Kullanıcı başarıyla güncellendi');
                handleCloseModal();
                // İsteğe bağlı: Güncellenmiş müşteri verisini almak için bir yöntem ekleyebilirsiniz
            } else {
                console.error('Kullanıcı güncellenemedi');
                alert('Kullanıcı güncellenirken bir hata oluştu');
            }
        } catch (error) {
            console.error('Hata:', error);
            alert('Bir hata oluştu');
        }
    };

    const toggleActiveStatus = async () => {
        try {
            const response = await fetchBackendPUT(`/customer/${customer._id}`, { isActive: !isActive });

            if (response.ok) {
                setIsActive((prev) => !prev);
                alert(`Kullanıcı başarıyla ${!isActive ? 'aktif edildi' : 'askıya alındı'}`);
            } else {
                console.error('Kullanıcı durumu güncellenemedi');
                alert('Kullanıcı durumu güncellenirken bir hata oluştu');
            }
        } catch (error) {
            console.error('Hata:', error);
            alert('Bir hata oluştu');
        }
    };

    return (
        <>
            <Box sx={{ p: 3 }}>
                <Grid container spacing={3}>
                    {/* Sol Taraf - Kullanıcı Bilgileri */}
                    <Grid item xs={12} sm={12} md={12} lg={3} xl={3}>
                        <Card sx={{ p: 3 }}>
                            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
                                <Avatar sx={{ width: 120, height: 120, mb: 2 }} src="/default-avatar.png" />
                                <Typography variant="h5">
                                    {`${customer.name.toUpperCase()} ${customer.surname.toUpperCase()}`}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    sx={{
                                        bgcolor: isActive ? 'success.light' : 'error.light',
                                        color: isActive ? 'success.contrastText' : 'error.contrastText',
                                        px: 1,
                                        borderRadius: 1,
                                        mt: 1,
                                    }}
                                >
                                    {isActive ? 'Aktif' : 'Askıya Alındı'}
                                </Typography>
                            </Box>

                            <Typography variant="h6" sx={{ mb: 2 }}>
                                Detaylar
                            </Typography>
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

                            <Box sx={{ mt: 2 }}>
                                <Button variant="contained" fullWidth sx={{ mb: 1 }} onClick={handleOpenModal}>
                                    Düzenle
                                </Button>
                                <Button
                                    variant="outlined"
                                    color={isActive ? 'error' : 'success'}
                                    fullWidth
                                    onClick={toggleActiveStatus}
                                >
                                    {isActive ? 'Askıya Al' : 'Aktif Et'}
                                </Button>
                            </Box>
                        </Card>
                    </Grid>
                    {/* Sağ Taraf - Sekmeler ve İçerik */}
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

                            {/* Genel Bakış Sekmesi */}
                            <TabPanel value={tabValue} index={0}>
                                <Typography variant="h6" gutterBottom>
                                    Hizmetler ve Ödeme Bilgileri
                                </Typography>
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

                            {/* Hizmetler Sekmesi */}
                            <TabPanel value={tabValue} index={1}>
                                <Typography variant="h6" gutterBottom>
                                    Hizmetler
                                </Typography>
                                <Divider sx={{ my: 2 }} />
                                <List>
                                    {customer.services.map((service) => (
                                        <ListItem key={service._id} sx={{ borderBottom: '1px solid #e0e0e0' }}>
                                            <ListItemText
                                                primary={service.type}
                                                secondary={service.description}
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            </TabPanel>

                            {/* Abonelikler Sekmesi */}
                            <TabPanel value={tabValue} index={2}>
                                <Typography variant="h6" gutterBottom>
                                    Abonelikler
                                </Typography>
                                <Divider sx={{ my: 2 }} />
                                {customer.subscriptions.length > 0 ? (
                                    <List>
                                        {customer.subscriptions.map((subscription) => {
                                            const service = customer.services.find(s => s._id === subscription.serviceId);
                                            const serviceType = service ? capitalizeFirstLetter(service.type) : 'Bilinmiyor';
                                            return (
                                                <ListItem key={subscription._id} sx={{ borderBottom: '1px solid #e0e0e0' }}>
                                                    <ListItemText
                                                        primary={serviceType}
                                                        secondary={
                                                            <>
                                                                <Typography variant="body2">
                                                                    Başlangıç Tarihi: {new Date(subscription.startDate).toLocaleDateString()}
                                                                </Typography>
                                                                <Typography variant="body2">
                                                                    Bitiş Tarihi: {new Date(subscription.endDate).toLocaleDateString()}
                                                                </Typography>
                                                                <Typography variant="body2">
                                                                    Oturum Limiti: {subscription.sessionLimit}
                                                                </Typography>
                                                                <Typography variant="body2">
                                                                    Ücret: {subscription.fee} TL
                                                                </Typography>
                                                            </>
                                                        }
                                                    />
                                                    <Chip
                                                        label={subscription.isActive ? 'Aktif' : 'Pasif'}
                                                        color={subscription.isActive ? 'success' : 'default'}
                                                    />
                                                </ListItem>
                                            );
                                        })}
                                    </List>
                                ) : (
                                    <Typography color="text.secondary">
                                        Aktif abonelik bulunmamaktadır.
                                    </Typography>
                                )}
                            </TabPanel>

                            {/* Randevular Sekmesi */}
                            <TabPanel value={tabValue} index={3}>
                                <Typography variant="h6" gutterBottom>
                                    Randevular
                                </Typography>
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
                                            return (
                                                <ListItem key={appointment._id} sx={{ borderBottom: '1px solid #e0e0e0' }}>
                                                    <ListItemText
                                                        primary={
                                                            <Box display="flex" alignItems="center" justifyContent="space-between">
                                                                <Typography variant="subtitle2" sx={{ fontWeight: 'bold' }}>
                                                                    {serviceType}
                                                                </Typography>
                                                                <Chip
                                                                    label={capitalizeFirstLetter(appointment.status)}
                                                                    color={getStatusColor(appointment.status)}
                                                                    size="small"
                                                                    sx={{ textTransform: 'capitalize' }}
                                                                />
                                                            </Box>
                                                        }
                                                        secondary={new Date(appointment.date).toLocaleString()}
                                                    />
                                                </ListItem>
                                            );
                                        })}
                                    </List>
                                ) : (
                                    <Typography color="text.secondary">
                                        Seçilen filtreye uygun randevu bulunmamaktadır.
                                    </Typography>
                                )}
                            </TabPanel>

                            {/* Ödemeler Sekmesi */}
                            <TabPanel value={tabValue} index={4}>
                                <Typography variant="h6" gutterBottom>
                                    Ödemeler
                                </Typography>
                                <Divider sx={{ my: 2 }} />
                                {customer.payments.length > 0 ? (
                                    <List>
                                        {customer.payments.map((payment) => {
                                            const service = customer.services.find(s => s._id === payment.serviceId);
                                            const serviceType = service ? capitalizeFirstLetter(service.type) : 'Bilinmiyor';
                                            return (
                                                <ListItem key={payment._id} sx={{ borderBottom: '1px solid #e0e0e0' }}>
                                                    <ListItemText
                                                        primary={`${serviceType} - ${payment.status}`}
                                                        secondary={`Tutar: ${payment.amount} TL | Tarih: ${new Date(payment.date).toLocaleDateString()}`}
                                                    />
                                                </ListItem>
                                            );
                                        })}
                                    </List>
                                ) : (
                                    <Typography color="text.secondary">
                                        Yapılmış ödeme bulunmamaktadır.
                                    </Typography>
                                )}
                            </TabPanel>

                            {/* Geçmiş Sekmesi */}
                            <TabPanel value={tabValue} index={5}>
                                <Typography variant="h6" gutterBottom>
                                    Geçmiş
                                </Typography>
                                <Divider sx={{ my: 2 }} />
                                <List>
                                    {getAllSessionsAndPayments(customer).map((item, index) => (
                                        <ListItem key={index} sx={{ borderBottom: '1px solid #e0e0e0' }}>
                                            <ListItemText
                                                primary={`${item.serviceType} - ${item.type}`}
                                                secondary={`${new Date(item.date).toLocaleString()}${item.notes ? ` - ${item.notes}` : ''} ${item.status ? ` - ${item.status}` : ''}`}
                                            />
                                        </ListItem>
                                    ))}
                                </List>
                            </TabPanel>
                        </Card>
                    </Grid>
                </Grid>
            </Box>

            {/* Düzenleme Modalı */}
            <Modal open={openModal} onClose={handleCloseModal} closeAfterTransition>
                <Fade in={openModal}>
                    <Paper
                        sx={{
                            position: 'absolute',
                            top: '50%',
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            width: { xs: '90%', sm: 500 },
                            p: 4,
                        }}
                    >
                        <Typography variant="h6" gutterBottom>
                            Kullanıcıyı Düzenle
                        </Typography>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                            <TextField
                                label="İsim"
                                name="name"
                                value={formData.name}
                                onChange={handleChange}
                                fullWidth
                            />
                            <TextField
                                label="Soyisim"
                                name="surname"
                                value={formData.surname}
                                onChange={handleChange}
                                fullWidth
                            />
                            <TextField
                                label="E-posta"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                fullWidth
                                type="email"
                            />
                            <TextField
                                label="Telefon"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                fullWidth
                                type="tel"
                            />
                            <TextField
                                label="Ağırlık (kg)"
                                name="weight"
                                type="number"
                                value={formData.weight}
                                onChange={handleChange}
                                fullWidth
                                inputProps={{ min: 0 }}
                            />
                            <Button variant="contained" onClick={handleSubmit}>
                                Kaydet
                            </Button>
                        </Box>
                    </Paper>
                </Fade>
            </Modal>
        </>
    )
                    }

    export default CustomerDetail;

