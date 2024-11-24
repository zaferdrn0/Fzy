import React, { useState } from 'react';
import {
  Box,
  TextField,
  Button,
  Typography,
  Grid,
  Paper,
  Modal,
  Fade,
  useMediaQuery,
  useTheme,
} from '@mui/material';

interface AddCustomerModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: Record<string, any>) => void;
}

const AddCustomerModal: React.FC<AddCustomerModalProps> = ({ open, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    email: '',
    phone: '',
    birthDate: '',
    weight: '',
    address: {
      street: '',
      city: '',
      postalCode: '',
    },
  });

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Responsive kontrol

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
  
    if (name.startsWith('address.')) {
      const field = name.split('.')[1]; // "address.street" -> "street"
      setFormData((prev) => ({
        ...prev,
        address: {
          ...prev.address,
          [field]: value, // Sadece ilgili adres alanını güncelle
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value, // Diğer alanları güncelle
      }));
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(formData);
    setFormData({
      name: '',
      surname: '',
      email: '',
      phone: '',
      birthDate: '',
      weight: '',
      address: {
        street: '',
        city: '',
        postalCode: '',
      },
    }); // Formu temizle
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} closeAfterTransition>
      <Fade in={open}>
        <Paper
          elevation={3}
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: isMobile ? '90%' : 600,
            padding: 4,
          }}
        >
          <Typography variant="h5" component="h2" gutterBottom>
            Add New Customer
          </Typography>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Surname"
                  name="surname"
                  value={formData.surname}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Birth Date"
                  name="birthDate"
                  type="date"
                  value={formData.birthDate}
                  onChange={handleChange}
                  fullWidth
                  InputLabelProps={{
                    shrink: true,
                  }}
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Weight (kg)"
                  name="weight"
                  type="number"
                  value={formData.weight}
                  onChange={handleChange}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Address
                </Typography>
              </Grid>
              <Grid item xs={12}>
                <TextField
                  label="Street"
                  name="address.street"
                  value={formData.address.street}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="City"
                  name="address.city"
                  value={formData.address.city}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Postal Code"
                  name="address.postalCode"
                  value={formData.address.postalCode}
                  onChange={handleChange}
                  fullWidth
                />
              </Grid>
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                  <Button onClick={onClose} sx={{ mr: 2 }}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="contained" color="primary">
                    Add Customer
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </form>
        </Paper>
      </Fade>
    </Modal>
  );
};

export default AddCustomerModal;
