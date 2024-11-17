import { useState } from 'react';
import {
    Box,
    Typography,
    Tab,
    Tabs,
    Card,
    Avatar,
    Button,
    LinearProgress,
    List,
    ListItem,
    ListItemText,
    Grid,
    Paper,
    TableContainer,
    Chip,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
} from '@mui/material';
import { Icon } from '@iconify/react';
import { Customer, Event, Payment } from '@/models/exampleUser';
import { calculateAge } from '@/utils/calculateAge';
import { getMembershipStatus } from '@/utils/isMembershipActive';

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



const CustomerDetail = ({ customer }: CustomerDetailProps) => {
    const [tabValue, setTabValue] = useState(0);

    const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
        setTabValue(newValue);
    };

    // Tüm ödemeleri birleştir
    const getAllPayments = () => {
        const payments: Array<Payment & { serviceType: string }> = [];
        customer.services.forEach(service => {
            service.payments.forEach(payment => {
                payments.push({
                    ...payment,
                    serviceType: service.serviceType
                });
            });
        });
        return payments.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    };

    // Tüm seansları ve randevuları birleştir
    const getAllSessionsAndAppointments = () => {
        const allEvents: Array<Event & { serviceType: string }> = [];

        customer.services.forEach(service => {
            if (service.events) {
                service.events.forEach(event => {
                    allEvents.push({
                        ...event,
                        serviceType: service.serviceType,
                    });
                });
            }
        });

        return allEvents.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    };

    const getStatusColor = (status: string) => {
        switch (status) {
            case 'attended':
                return 'success';
            case 'missed':
                return 'error';
            case 'scheduled':
                return 'info';
            default:
                return 'default';
        }
    };

    return (
        <Box sx={{ p: 3 }}>
            <Grid container spacing={3}>
                {/* Left Side - User Info */}
                <Grid item xs={12} md={3}>
                    <Card sx={{ p: 3 }}>
                        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
                            <Avatar
                                sx={{ width: 120, height: 120, mb: 2 }}
                                src="/default-avatar.png"
                            />
                            <Typography variant="h5">{`${customer.name.first} ${customer.name.last}`}</Typography>
                            <Typography
                                variant="body2"
                                sx={{
                                    bgcolor: 'error.light',
                                    color: 'error.contrastText',
                                    px: 1,
                                    borderRadius: 1,
                                    mt: 1
                                }}
                            >
                                Subscriber
                            </Typography>
                        </Box>

                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                            <Box sx={{ textAlign: 'center' }}>
                                <Typography variant="h6">{customer.services.length}</Typography>
                                <Typography variant="body2" color="textSecondary">Services</Typography>
                            </Box>
                            <Box sx={{ textAlign: 'center' }}>
                                <Typography variant="h6">
                                    {getAllSessionsAndAppointments().length}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">Total Events</Typography>
                            </Box>
                        </Box>

                        <Typography variant="h6" sx={{ mb: 2 }}>Details</Typography>
                        <List dense>
                            <ListItem>
                                <ListItemText
                                    primary="Email"
                                    secondary={customer.email}
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemText
                                    primary="Phone"
                                    secondary={customer.phone}
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemText
                                    primary="Age"
                                    secondary={calculateAge(customer.birthDate)}
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemText
                                    primary="Weight"
                                    secondary={`${customer.weight} kg`}
                                />
                            </ListItem>
                        </List>

                        <Box sx={{ mt: 2 }}>
                            <Button
                                variant="contained"
                                fullWidth
                                sx={{ mb: 1 }}
                            >
                                Edit
                            </Button>
                            <Button
                                variant="outlined"
                                color="error"
                                fullWidth
                            >
                                Suspend
                            </Button>
                        </Box>
                    </Card>
                </Grid>

                {/* Right Side - Tabs & Content */}
                <Grid item xs={12} md={9}>
                    <Card>
                        <Tabs
                            value={tabValue}
                            onChange={handleTabChange}
                            sx={{ borderBottom: 1, borderColor: 'divider' }}
                        >
                            <Tab label="Overview" icon={<Icon icon="mdi:account-details" />} iconPosition="start" />
                            <Tab label="Services" icon={<Icon icon="mdi:medical-bag" />} iconPosition="start" />
                            <Tab label="Sessions & Appointments" icon={<Icon icon="mdi:calendar" />} iconPosition="start" />
                            <Tab label="Payments" icon={<Icon icon="mdi:currency-usd" />} iconPosition="start" />
                            <Tab label="History" icon={<Icon icon="mdi:history" />} iconPosition="start" />
                        </Tabs>

                        {/* Overview Tab */}
                        <TabPanel value={tabValue} index={0}>
                            <Grid container spacing={3}>
                                {/* Üyelik Durumu */}
                                <Grid item xs={12}>
                                    <Paper sx={{ p: 2, mb: 2 }}>
                                        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                                            <Icon icon="mdi:card-account-details" width={24} height={24} style={{ marginRight: 8 }} />
                                            Üyelik Durumu
                                        </Typography>
                                        <Grid container spacing={2}>
                                            {customer.services.map((service) => (
                                                <Grid item xs={12} md={12} key={service._id}>
                                                    <Box sx={{
                                                        p: 2,
                                                        border: 1,
                                                        borderColor: 'divider',
                                                        borderRadius: 1,
                                                        backgroundColor: service.membershipType === 'premium' ? 'action.hover' : 'transparent'
                                                    }}>
                                                        <Typography variant="subtitle1" sx={{ mb: 1, display: 'flex', alignItems: 'center' }}>
                                                            <Icon
                                                                icon={
                                                                    service.serviceType === 'pilates' ? 'mdi:yoga' :
                                                                        service.serviceType === 'massage' ? 'mdi:hand-heart' :
                                                                            'mdi:doctor'
                                                                }
                                                                width={20}
                                                                height={20}
                                                                style={{ marginRight: 8 }}
                                                            />
                                                            {service.serviceType.charAt(0).toUpperCase() + service.serviceType.slice(1)}
                                                            {service.membershipType && (
                                                                <Chip
                                                                    label={service.membershipType}
                                                                    size="small"
                                                                    color={service.membershipType === 'premium' ? 'primary' : 'default'}
                                                                    sx={{ ml: 1 }}
                                                                />
                                                            )}
                                                        </Typography>
                                                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                                                            <Typography variant="body2" color="text.secondary">
                                                                Toplam Ücret: {service.totalFee} TL
                                                            </Typography>
                                                            {service.membershipStartDate && (
                                                                <Typography variant="body2" color="text.secondary">
                                                                    {(() => {
                                                                        const { isActive, daysLeft } = getMembershipStatus(
                                                                            service.membershipStartDate,
                                                                            service.membershipDuration
                                                                        );
                                                                        return isActive
                                                                            ? `Kalan Süre: ${Math.ceil(daysLeft / 30)} ay (${daysLeft} gün)`
                                                                            : 'Expired';
                                                                    })()}
                                                                </Typography>
                                                            )}

                                                        </Box>
                                                        {service.trainerNotes && (
                                                            <Typography variant="body2" color="text.secondary">
                                                                Notlar: {service.trainerNotes}
                                                            </Typography>
                                                        )}
                                                    </Box>
                                                </Grid>
                                            ))}
                                        </Grid>
                                    </Paper>
                                </Grid>

                                {/* Yaklaşan Randevular */}
                                <Grid item xs={12} md={6}>
                                    <Paper sx={{ p: 2, height: '100%' }}>
                                        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                                            <Icon icon="mdi:calendar-clock" width={24} height={24} style={{ marginRight: 8 }} />
                                            Yaklaşan Randevular
                                        </Typography>
                                        {(() => {
                                            const upcomingEvents = getAllSessionsAndAppointments()
                                                .filter(event => new Date(event.date) > new Date())
                                                .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
                                                .slice(0, 3);

                                            return upcomingEvents.length > 0 ? (
                                                <List dense>
                                                    {upcomingEvents.map((event) => (
                                                        <ListItem key={event._id} sx={{
                                                            borderLeft: 2,
                                                            borderColor: 'primary.main',
                                                            mb: 1,
                                                            backgroundColor: 'background.paper'
                                                        }}>
                                                            <ListItemText
                                                                primary={
                                                                    <Typography variant="subtitle2">
                                                                        {new Date(event.date).toLocaleDateString('tr-TR', {
                                                                            weekday: 'long',
                                                                            year: 'numeric',
                                                                            month: 'long',
                                                                            day: 'numeric',
                                                                            hour: '2-digit',
                                                                            minute: '2-digit'
                                                                        })}
                                                                    </Typography>
                                                                }
                                                                secondary={
                                                                    <Box sx={{ display: 'flex', alignItems: 'center', mt: 0.5 }}>
                                                                        <Icon
                                                                            icon={
                                                                                event.serviceType === 'pilates' ? 'mdi:yoga' :
                                                                                    event.serviceType === 'massage' ? 'mdi:hand-heart' :
                                                                                        'mdi:doctor'
                                                                            }
                                                                            width={16}
                                                                            height={16}
                                                                            style={{ marginRight: 4 }}
                                                                        />
                                                                        {`${event.serviceType}}`}
                                                                    </Box>
                                                                }
                                                            />
                                                        </ListItem>
                                                    ))}
                                                </List>
                                            ) : (
                                                <Box sx={{ textAlign: 'center', py: 2 }}>
                                                    <Icon icon="mdi:calendar-blank" width={40} height={40} style={{ opacity: 0.5 }} />
                                                    <Typography color="text.secondary" sx={{ mt: 1 }}>
                                                        Yaklaşan randevu bulunmuyor
                                                    </Typography>
                                                </Box>
                                            );
                                        })()}
                                    </Paper>
                                </Grid>

                                {/* Aktivite Özeti */}
                                <Grid item xs={12} md={6}>
                                    <Paper sx={{ p: 2, height: '100%' }}>
                                        <Typography variant="h6" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                                            <Icon icon="mdi:chart-box" width={24} height={24} style={{ marginRight: 8 }} />
                                            Aktivite Özeti
                                        </Typography>
                                        {(() => {
                                            const allEvents = getAllSessionsAndAppointments();
                                            const completedEvents = allEvents.filter(event => event.status === 'attended');
                                            const missedEvents = allEvents.filter(event => event.status === 'missed');
                                            const attendanceRate = (completedEvents.length / allEvents.length) * 100;

                                            const monthlyTotalFee = customer.services.reduce((total, service) => total + service.totalFee, 0);
                                            const monthlyPayments = customer.services.reduce((total, service) => {
                                                return total + service.payments.reduce((sum, payment) => sum + payment.amount, 0);
                                            }, 0);

                                            return (
                                                <Box>
                                                    <LinearProgress
                                                        variant="determinate"
                                                        value={attendanceRate}
                                                        sx={{ height: 10, borderRadius: 5, mb: 2 }}
                                                    />
                                                    <Grid container spacing={2}>
                                                        <Grid item xs={6}>
                                                            <Typography variant="body2" color="text.secondary">Katılım Oranı</Typography>
                                                            <Typography variant="h6">{attendanceRate.toFixed(1)}%</Typography>
                                                        </Grid>
                                                        <Grid item xs={6}>
                                                            <Typography variant="body2" color="text.secondary">Toplam Seans</Typography>
                                                            <Typography variant="h6">{allEvents.length}</Typography>
                                                        </Grid>
                                                        <Grid item xs={6}>
                                                            <Typography variant="body2" color="text.secondary">Tamamlanan</Typography>
                                                            <Typography variant="h6" color="success.main">{completedEvents.length}</Typography>
                                                        </Grid>
                                                        <Grid item xs={6}>
                                                            <Typography variant="body2" color="text.secondary">Kaçırılan</Typography>
                                                            <Typography variant="h6" color="error.main">{missedEvents.length}</Typography>
                                                        </Grid>
                                                    </Grid>
                                                </Box>
                                            );
                                        })()}
                                    </Paper>
                                </Grid>
                            </Grid>
                        </TabPanel>

                        {/* Services Tab */}
                        <TabPanel value={tabValue} index={1}>
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Service Type</TableCell>
                                            <TableCell>Details</TableCell>
                                            <TableCell>Total Fee</TableCell>
                                            <TableCell>Start Date</TableCell>
                                            <TableCell>Days Left</TableCell> {/* Yeni sütun eklendi */}
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {customer.services.map((service) => {

                                            const { isActive, daysLeft } = getMembershipStatus(
                                                service.membershipStartDate || '',
                                                service.membershipDuration
                                            );
                                            // Üyelik durumunu ve kalan gün sayısını hesaplıyoruz
                                            return (
                                                <TableRow key={service._id}>
                                                    <TableCell>
                                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                                            <Icon
                                                                icon={
                                                                    service.serviceType === 'pilates'
                                                                        ? 'mdi:yoga'
                                                                        : service.serviceType === 'massage'
                                                                            ? 'mdi:hand-heart'
                                                                            : 'mdi:doctor'
                                                                }
                                                                width={24}
                                                                height={24}
                                                            />
                                                            <Typography sx={{ ml: 1 }}>
                                                                {service.serviceType.charAt(0).toUpperCase() + service.serviceType.slice(1)}
                                                            </Typography>
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell>
                                                        {service.membershipType && `Membership: ${service.membershipType}`}
                                                        {service.massageType && `Type: ${service.massageType}`}
                                                        {service.injuryType && `Injury: ${service.injuryType}`}
                                                    </TableCell>
                                                    <TableCell>{service.totalFee} TL</TableCell>
                                                    <TableCell>{new Date(service.createdAt).toLocaleDateString()}</TableCell>
                                                    <TableCell>
                                                        {service.membershipStartDate ? isActive ? `${daysLeft} days left` : 'Expired' : 0}
                                                    </TableCell>
                                                </TableRow>
                                            );
                                        })}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </TabPanel>

                        {/* Sessions & Appointments Tab */}
                        <TabPanel value={tabValue} index={2}>
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Date</TableCell>
                                            <TableCell>Service</TableCell>

                                            <TableCell>Status</TableCell>
                                            <TableCell>Notes</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {getAllSessionsAndAppointments().map((event) => (
                                            <TableRow key={event._id}>
                                                <TableCell>{new Date(event.date).toLocaleString()}</TableCell>
                                                <TableCell>{event.serviceType}</TableCell>

                                                <TableCell>
                                                    <Chip
                                                        label={event.status}
                                                        color={getStatusColor(event.status)}
                                                        size="small"
                                                    />
                                                </TableCell>
                                                <TableCell>{event.notes || '-'}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </TabPanel>

                        {/* Payments Tab */}
                        <TabPanel value={tabValue} index={3}>
                            <TableContainer>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Date</TableCell>
                                            <TableCell>Service</TableCell>
                                            <TableCell>Amount</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {getAllPayments().map((payment, index) => (
                                            <TableRow key={index}>
                                                <TableCell>{new Date(payment.date).toLocaleString()}</TableCell>
                                                <TableCell>{payment.serviceType}</TableCell>
                                                <TableCell>{payment.amount} TL</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </TabPanel>

                        {/* History Tab */}
                        <TabPanel value={tabValue} index={4}>
                            <List>
                                {getAllSessionsAndAppointments().map((event) => (
                                    <ListItem key={event._id}>
                                        <ListItemText
                                            primary={`${event.serviceType} - ${event.status}`}
                                            secondary={`${new Date(event.date).toLocaleString()} ${event.notes ? `- ${event.notes}` : ''}`}
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        </TabPanel>
                    </Card>
                </Grid>
            </Grid>
        </Box>
    );
}
export default CustomerDetail