import { useState } from 'react';
import {
    Box,
    Tab,
    Tabs,
    Card,
    List,
    ListItem,
    ListItemText,
    Grid,
    TableContainer,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
} from '@mui/material';
import { Icon } from '@iconify/react';
import { Customer, Event, Payment } from '@/models/dataType';
import UserInfoCard from './customerDetail/UserInfoCard';
import MemberShipDetail from './customerDetail/MemberShipDetail';

import Service from './customerDetail/Service';
import EventTab from './customerDetail/Event';
import PaymentTab from './customerDetail/Payment';

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

    const today = new Date();

    const getAllSessionsAndAppointments = () => {
        const allEvents = customer.services.flatMap((service) =>
            service.events
                .filter((event) => new Date(event.date) < today) // Bugünün tarihinden önceki etkinlikleri al
                .map((event) => ({
                    type: 'Event',
                    date: event.date,
                    serviceType: service.serviceType,
                    notes: event.notes,
                    status: event.status,
                }))
        );

        const allPayments = customer.services.flatMap((service) =>
            service.payments
                .filter((payment) => new Date(payment.date) < today) // Bugünün tarihinden önceki ödemeleri al
                .map((payment) => ({
                    type: 'Payment',
                    date: payment.date,
                    serviceType: service.serviceType,
                    notes: null,
                    status: `${payment.amount} TL`, // Ödemeler için tutarı göster
                }))
        );

        return [...allEvents, ...allPayments].sort(
            (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime() // Tarihe göre sıralama (yeniden eskiye)
        );
    };




    return (
        <Box sx={{ p: 3 }}>
            <Grid container spacing={3}>
                {/* Left Side - User Info */}
                <Grid item xs={12} sm={12} md={12} lg={3} xl={3}>
                    <UserInfoCard customer={customer} />
                </Grid>
                {/* Right Side - Tabs & Content */}
                <Grid item xs={12} sm={12} md={12} lg={9} xl={9}>
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
                            <MemberShipDetail customer={customer} />
                        </TabPanel>

                        {/* Services Tab */}
                        <Grid container spacing={3}>
                            -
                            <Grid item lg={12}>
                                <TabPanel value={tabValue} index={1}>
                                    <Service customer={customer} />
                                </TabPanel>
                            </Grid>
                        </Grid>


                        {/* Sessions & Appointments Tab */}
                        <TabPanel value={tabValue} index={2}>
                            <EventTab customer={customer} />
                        </TabPanel>

                        {/* Payments Tab */}
                        <TabPanel value={tabValue} index={3}>
                            <PaymentTab customer={customer} />
                        </TabPanel>

                        {/* History Tab */}
                        <TabPanel value={tabValue} index={4}>
                            <List>
                                {getAllSessionsAndAppointments().map((item, index) => (
                                    <ListItem key={index}>
                                        <ListItemText
                                            primary={`${item.serviceType} - ${item.type}`}
                                            secondary={`${new Date(item.date).toLocaleString()} ${item.notes ? `- ${item.notes}` : ''
                                                } ${item.status ? `- ${item.status}` : ''}`}
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