import { Box, Card, CardContent, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton, Grid } from '@mui/material';
import { Icon } from '@iconify/react';
import { useRouter } from 'next/router';
import AddCustomerModal from '@/components/customers/AddCustomer';
import { Dispatch, SetStateAction, useState } from 'react';
import { fetchBackendPOST } from '@/utils/backendFetch';
import { getCustomers } from '@/utils/customers/getCustomers';
import { Customer } from '@/models/dataType';

interface StatCardProps {
  title: string;
  value: number;
  change: number;
  subtitle: string;
  icon: string;
  color: string;
}

const StatCard = ({ title, value, change, subtitle, icon, color }: StatCardProps) => (
  <Card sx={{ height: '100%' }}>
    <CardContent>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography variant="h6" color="text.secondary">
            {title}
          </Typography>
          <Typography variant="h4" sx={{ my: 1 }}>
            {value.toLocaleString()}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography
              variant="body2"
              color={change >= 0 ? 'success.main' : 'error.main'}
              sx={{ display: 'flex', alignItems: 'center' }}
            >
              <Icon
                icon={change >= 0 ? 'mdi:trending-up' : 'mdi:trending-down'}
                style={{ marginRight: '4px' }}
              />
              {Math.abs(change)}%
            </Typography>
            <Typography variant="body2" color="text.secondary">
              {subtitle}
            </Typography>
          </Box>
        </Box>
        <Box
          sx={{
            backgroundColor: `${color}15`,
            p: 1,
            borderRadius: 2,
          }}
        >
          <Icon icon={icon} style={{ color, fontSize: '24px' }} />
        </Box>
      </Box>
    </CardContent>
  </Card>
);

const CustomerDashboard = ({ customers, setCustomers }: { customers: Customer[], setCustomers: Dispatch<SetStateAction<Customer[] | "loading">> }) => {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);

  const handleOpen = () => setModalOpen(true);
  const handleClose = () => setModalOpen(false);

  const handleSubmit = async (data: Record<string, any>) => {
    const addCustomer = await fetchBackendPOST("/customer/add", data);
    if (addCustomer.ok) {
      console.log("Customer added successfully");
      handleClose();
      await getCustomers(setCustomers);
    }
  };

  const totalCustomers = customers.length;
  const activeServices = customers.reduce((acc, customer) => acc + customer.services.length, 0);
  const totalRevenue = customers.reduce(
    (acc, customer) =>
      acc +
      customer.services.reduce((serviceAcc, service) => serviceAcc + service.totalFee, 0),
    0
  );

  const pilatesCustomers = customers.filter(customer =>
    customer.services.some(service => service.serviceType === 'pilates')
  ).length;

  const stats = [
    {
      title: 'Total Customers',
      value: totalCustomers,
      change: 12,
      subtitle: 'Last month',
      icon: 'mdi:account-group',
      color: '#4C6FFF',
    },
    {
      title: 'Active Services',
      value: activeServices,
      change: 8,
      subtitle: 'Last month',
      icon: 'mdi:clipboard-list',
      color: '#FF4C6F',
    },
    {
      title: 'Total Revenue',
      value: totalRevenue,
      change: 15,
      subtitle: 'Last month',
      icon: 'mdi:currency-usd',
      color: '#4CFF6F',
    },
    {
      title: 'Pilates Members',
      value: pilatesCustomers,
      change: 5,
      subtitle: 'Last month',
      icon: 'mdi:yoga',
      color: '#6F4CFF',
    },
  ];

  return (
    <Box sx={{ p: 3 }}>
      <AddCustomerModal
        open={modalOpen}
        onClose={handleClose}
        onSubmit={handleSubmit}
      />
      {/* Stat Cards */}
      <Grid container spacing={3}>
        {stats.map((stat, index) => (
          <Grid item key={index} lg={3} md={6} sm={12} xs={12}>
            <StatCard
              title={stat.title}
              value={stat.value}
              change={stat.change}
              subtitle={stat.subtitle}
              icon={stat.icon}
              color={stat.color}
            />
          </Grid>
        ))}
      </Grid>

      {/* Customers Table */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h5">Customers</Typography>
        <Button
          variant="contained"
          onClick={handleOpen}
          startIcon={<Icon icon="mdi:plus" />}
          sx={{ borderRadius: 2 }}
        >
          Add New Customer
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Name</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Phone</TableCell>
              <TableCell>Services</TableCell>
              <TableCell>Total Spent</TableCell>
              <TableCell>Active Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {customers.map(customer => (
              <TableRow key={customer._id}>
                <TableCell>
                  {customer.name.first} {customer.name.last}
                </TableCell>
                <TableCell>{customer.email}</TableCell>
                <TableCell>{customer.phone}</TableCell>
                <TableCell>
                  {customer.services.map(service => service.serviceType).join(', ')}
                </TableCell>
                <TableCell>
                  $
                  {customer.services.reduce((acc, service) => acc + service.totalFee, 0).toFixed(2)}
                </TableCell>
                <TableCell>
                  <Typography
                    sx={{
                      color: customer.isActive ? 'success.main' : 'error.main',
                    }}
                  >
                    {customer.isActive ? 'Active' : 'Inactive'}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <IconButton size="small">
                    <Icon icon="mdi:delete" />
                  </IconButton>
                  <IconButton
                    size="small"
                    onClick={() => router.push(`/customers/${customer._id}`)}
                  >
                    <Icon icon="mdi:eye" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default CustomerDashboard;
