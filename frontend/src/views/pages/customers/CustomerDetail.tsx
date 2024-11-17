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

 

    return (
        <Box sx={{ p: 3 }}>
            <Grid container spacing={3}>
                {/* Left Side - User Info */}
                <UserInfoCard customer={customer} />

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
                            <MemberShipDetail customer={customer} />
                        </TabPanel>

                        {/* Services Tab */}
                        <Grid container spacing={3}>
-
                            <Grid item lg ={12}>
                            <TabPanel value={tabValue} index={1}>
                           <Service customer={customer}/>
                        </TabPanel>
                            </Grid>
                        </Grid>


                        {/* Sessions & Appointments Tab */}
                        <TabPanel value={tabValue} index={2}>
                            <EventTab customer={customer}/>
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