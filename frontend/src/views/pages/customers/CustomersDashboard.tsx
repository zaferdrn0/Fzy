import { Box, Card, CardContent, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from '@mui/material';
import { Icon } from '@iconify/react';
import { useRouter } from 'next/router';
import AddCustomerModal from '@/components/customers/AddCustomer';
import { Dispatch, SetStateAction, useState } from 'react';
import { fetchBackendPOST } from '@/utils/backendFetch';
import { getCustomers } from '@/utils/customers/getCustomers';
import { Customer } from '@/models/dataType';

const CustomerDashboard = ({
  customers,
  setCustomers,
}: {
  customers: Customer[];
  setCustomers: Dispatch<SetStateAction<Customer[] | 'loading'>>;
}) => {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);

  const handleOpen = () => setModalOpen(true);
  const handleClose = () => setModalOpen(false);

  const handleSubmit = async (data: Record<string, any>) => {
    const addCustomer = await fetchBackendPOST('/customer/add', data);
    if (addCustomer.ok) {
      console.log('Customer added successfully');
      handleClose();
      await getCustomers(setCustomers);
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <AddCustomerModal open={modalOpen} onClose={handleClose} onSubmit={handleSubmit} />

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
              <TableCell>Active Status</TableCell>
              <TableCell align="right">Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {customers.map((customer) => (
              <TableRow key={customer._id}>
                {/* Name and Surname */}
                <TableCell>
                  {customer.name} {customer.surname}
                </TableCell>
                {/* Email */}
                <TableCell>{customer.email}</TableCell>
                {/* Phone */}
                <TableCell>{customer.phone}</TableCell>
                {/* Services */}
                <TableCell>
                  {customer.services.map((service) => service.type).join(', ')}
                </TableCell>
                {/* Total Spent */}
               
                {/* Active Status */}
                <TableCell>
                  <Typography
                    sx={{
                      color: customer.isActive ? 'success.main' : 'error.main',
                    }}
                  >
                    {customer.isActive ? 'Active' : 'Inactive'}
                  </Typography>
                </TableCell>
                {/* Actions */}
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
