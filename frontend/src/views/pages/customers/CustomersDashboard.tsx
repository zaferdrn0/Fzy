import { Box, Typography, Button, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, IconButton } from '@mui/material';
import { Icon } from '@iconify/react';
import { useRouter } from 'next/router';
import AddCustomerModal from '@/components/customers/AddCustomer';
import { Dispatch, SetStateAction, useState } from 'react';
import { fetchBackendPOST } from '@/utils/backendFetch';
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
      const newCustomer = await addCustomer.json(); // Yeni müşteri verisini al
      setCustomers((prevCustomers) => {
        if (Array.isArray(prevCustomers)) {
          // prevCustomers bir dizi ise yeni müşteri ekle
          return [...prevCustomers, newCustomer.customer];
        }
        return prevCustomers; // Eğer değilse mevcut durumu koru
      });
      console.log('Müşteri başarıyla eklendi');
      handleClose();
    } else {
      console.error('Müşteri eklenirken hata oluştu');
    }
  };

  return (
    <Box sx={{ p: 3 }}>
      <AddCustomerModal open={modalOpen} onClose={handleClose} onSubmit={handleSubmit} />

      {/* Customers Table */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h5">Müşteriler</Typography>
        <Button
          variant="contained"
          onClick={handleOpen}
          startIcon={<Icon icon="mdi:plus" />}
          sx={{ borderRadius: 2 }}
        >
          Yeni Müşteri Ekle
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Ad ve Soyad</TableCell>
              <TableCell>E-posta</TableCell>
              <TableCell>Telefon</TableCell>
              <TableCell>Aktif Durum</TableCell>
              <TableCell align="right">İşlemler</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {customers.map((customer) => (
              <TableRow
                key={customer._id}
                hover
                sx={{ cursor: 'pointer' }}
                onClick={() => router.push(`/customers/${customer._id}`)} // Satır tıklamasıyla yönlendirme
              >
                {/* Name and Surname */}
                <TableCell>{customer.name} {customer.surname}</TableCell>
                {/* Email */}
                <TableCell>{customer.email}</TableCell>
                {/* Phone */}
                <TableCell>{customer.phone}</TableCell>

                {/* Active Status */}
                <TableCell>
                  <Typography
                    sx={{
                      color: customer.isActive ? 'success.main' : 'error.main',
                    }}
                  >
                    {customer.isActive ? 'Aktif' : 'Pasif'}
                  </Typography>
                </TableCell>
                {/* Actions */}
                <TableCell
                  align="right"
                  onClick={(e) => e.stopPropagation()} // Satır tıklanmasını önlemek için
                >
                  <IconButton
                    size="small"
                    onClick={() => console.log('Silme işlemi')}
                  >
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
