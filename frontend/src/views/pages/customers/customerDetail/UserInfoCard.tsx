// components/customerDetail/UserInfoCard.tsx

import React, { useState } from 'react';
import {
  Grid,
  Card,
  Box,
  Avatar,
  Typography,
  List,
  ListItem,
  ListItemText,
  Button,
  Modal,
  TextField,
  Fade,
  Paper,
} from '@mui/material';
import { Customer } from '@/models/dataType';
import { calculateAge } from '@/utils/calculateAge';
import { fetchBackendPUT } from '@/utils/backendFetch';

interface UserInfoCardProps {
  customer: Customer;
}

const UserInfoCard: React.FC<UserInfoCardProps> = ({ customer }) => {
  const [openModal, setOpenModal] = useState(false);
  const [isActive, setIsActive] = useState(customer.isActive);
  const [formData, setFormData] = useState({
    name: customer.name,
    surname: customer.surname,
    email: customer.email,
    phone: customer.phone,
    weight: customer.weight,
  });

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
        // Optionally, you can trigger a re-fetch or update parent state here
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
  );
};

export default UserInfoCard;
