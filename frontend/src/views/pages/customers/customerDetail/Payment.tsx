import React, { useState } from 'react';
import {
  TableContainer,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Modal,
  Box,
  TextField,
  MenuItem,
} from '@mui/material';
import { Customer } from '@/models/dataType';
import { useRouter } from 'next/router';
import { fetchBackendPOST } from '@/utils/backendFetch';

const PaymentTab = ({ customer }: { customer: Customer }) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    amount: '',
    date: '',
    service: '',
  });
  const router = useRouter();
  const customerId = router.query.customerId as string;

  const allPayments = customer.services.flatMap((service) =>
    service.payments.map((payment) => ({
      ...payment,
      serviceType: service.serviceType,
    }))
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const response = await fetchBackendPOST(`/payment/add/${customerId}`, {
        amount: formData.amount,
        date: formData.date,
        service: formData.service,
      });
      if (!response.ok) throw new Error('Failed to add payment');
      setOpen(false);
      window.location.reload(); // Yeni ödeme görünmesi için sayfayı yenile
    } catch (error) {
      console.error('Error creating payment:', error);
    }
  };

  return (
    <>
      <Button variant="contained" color="primary" onClick={() => setOpen(true)}>
        Add Payment
      </Button>
      <Modal open={open} onClose={() => setOpen(false)}>
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            p: 4,
          }}
        >
          <h2>Add Payment</h2>
          <form onSubmit={handleSubmit}>
            <TextField
              name="amount"
              label="Amount"
              type="number"
              fullWidth
              margin="normal"
              value={formData.amount}
              onChange={handleInputChange}
            />
            <TextField
              name="date"
              label="Date"
              type="datetime-local"
              fullWidth
              margin="normal"
              InputLabelProps={{ shrink: true }}
              value={formData.date}
              onChange={handleInputChange}
            />
            <TextField
              name="service"
              select
              label="Service"
              fullWidth
              margin="normal"
              value={formData.service}
              onChange={handleInputChange}
            >
              {customer.services.map((service) => (
                <MenuItem key={service._id} value={service._id}>
                  {service.serviceType}
                </MenuItem>
              ))}
            </TextField>
            <Button type="submit" variant="contained" color="primary">
              Submit
            </Button>
          </form>
        </Box>
      </Modal>
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
            {allPayments.map((payment, index) => (
              <TableRow key={index}>
                <TableCell>{new Date(payment.date).toLocaleString()}</TableCell>
                <TableCell>{payment.serviceType}</TableCell>
                <TableCell>{payment.amount} TL</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default PaymentTab;
