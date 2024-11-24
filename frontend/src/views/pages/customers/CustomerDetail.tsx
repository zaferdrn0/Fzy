import React, { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { Box, Tab, Tabs, Card, Grid, Typography, Avatar, Divider, CardContent, Button } from '@mui/material';
import { Icon } from '@iconify/react';
import { Customer, Service } from '@/models/dataType';
import { calculateAge } from '@/utils/calculateAge';
import { fetchBackendGET } from '@/utils/backendFetch';
import CustomerOverview from './OverviewTab/OverviewTabMenu';
import CustomerServices from './ServicesTab/CustomerServices';
import CustomerSubscriptions from './SubscriptionTab/CustomerSubscriptions';
import CustomerAppointments from './AppointmentTab/CustomerAppointment';
import CustomerPayments from './PaymentTab/CustomerPayment';

// TabPanel Component
interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;
  return (
    <div role="tabpanel" hidden={value !== index} {...other}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

// Main CustomerDetail Component
interface CustomerDetailProps {
  customer: Customer;
  setCustomer: Dispatch<SetStateAction<Customer | null>>;
}

const CustomerDetail: React.FC<CustomerDetailProps> = ({ customer, setCustomer }) => {
  const [tabValue, setTabValue] = useState(0);
  const [services, setServices] = useState<Service[] | null>(null);

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
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
  };

  useEffect(() => {
    getServices();
  }, []);

  return (
    <Box sx={{ p: 3 }}>
      <Grid container spacing={3}>
        {/* Customer Info Card */}
        <Grid item xs={12} sm={12} md={12} lg={3} xl={3}>
        <Card sx={{ maxWidth: 400, mx: 'auto', p: 3, borderRadius: 2, boxShadow: 3 }}>
      <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
        <Avatar
          sx={{ width: 100, height: 100, mb: 2 }}
          src="/default-avatar.png" // Varsayılan avatar
          alt={`${customer.name} ${customer.surname}`}
        />
        <Typography variant="h5" fontWeight="bold">
          {`${customer.name} ${customer.surname}`}
        </Typography>
        <Typography
          variant="body2"
          color="textSecondary"
          sx={{ backgroundColor: '#f5f5f5', borderRadius: '12px', px: 2, py: 1, mt: 1 }}
        >
          {customer.isActive ? 'Active' : 'Inactive'}
        </Typography>
      </Box>
      <Divider sx={{ my: 3 }} />
      <CardContent>
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          Detaylar
        </Typography>
        <Typography variant="body2" gutterBottom>
          <strong>E-posta:</strong> {customer.email}
        </Typography>
        <Typography variant="body2" gutterBottom>
          <strong>Telefon:</strong> {customer.phone}
        </Typography>
        <Typography variant="body2" gutterBottom>
          <strong>Yaş:</strong> {calculateAge(customer.birthDate)}
        </Typography>
        <Typography variant="body2" gutterBottom>
          <strong>Ağırlık:</strong> {customer.weight} kg
        </Typography>
        <Typography variant="body2" gutterBottom>
          <strong>Adres:</strong> {`${customer.address.street}, ${customer.address.city}, ${customer.address.postalCode}`}
        </Typography>
      </CardContent>
      <Divider sx={{ my: 3 }} />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
        <Button variant="outlined" color="primary">
          Edit
        </Button>
        <Button variant="outlined" color="error">
          Suspend
        </Button>
      </Box>
    </Card>
        </Grid>

        {/* Tabs and Content */}
        <Grid item xs={12} sm={12} md={12} lg={9} xl={9}>
          <Card>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              sx={{ borderBottom: 1, borderColor: 'divider' }}
              variant="scrollable"
              scrollButtons="auto"
            >
              <Tab
                label="Genel Bakış"
                icon={<Icon icon="mdi:account-details" />}
                iconPosition="start"
              />
              <Tab
                label="Hizmetler"
                icon={<Icon icon="mdi:medical-bag" />}
                iconPosition="start"
              />
              <Tab
                label="Abonelikler"
                icon={<Icon icon="mdi:subscription" />}
                iconPosition="start"
              />
              <Tab
                label="Randevular"
                icon={<Icon icon="mdi:calendar-clock" />}
                iconPosition="start"
              />
              <Tab
                label="Ödemeler"
                icon={<Icon icon="mdi:currency-usd" />}
                iconPosition="start"
              />
            </Tabs>

            {/* Tab Content */}
            <TabPanel value={tabValue} index={0}>
              <CustomerOverview />
            </TabPanel>
            <TabPanel value={tabValue} index={1}>
              <CustomerServices />
            </TabPanel>
            <TabPanel value={tabValue} index={2}>
              <CustomerSubscriptions
                services={services}
              />
            </TabPanel>
            <TabPanel value={tabValue} index={3}>
              <CustomerAppointments
                services={services}
              />
            </TabPanel>
            <TabPanel value={tabValue} index={4}>
              <CustomerPayments
                services={services}
              />
            </TabPanel>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
};

export default CustomerDetail;
