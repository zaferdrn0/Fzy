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

const UserInfoCard = ({ customer }: { customer: Customer }) => {
  const [openModal, setOpenModal] = useState(false);
  const [isActive, setIsActive] = useState(customer.isActive);
  const [formData, setFormData] = useState({
    firstName: customer.name.first,
    lastName: customer.name.last,
    email: customer.email,
    phone: customer.phone,
    weight: customer.weight,
  });

  const handleOpenModal = () => setOpenModal(true);
  const handleCloseModal = () => setOpenModal(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    try {
      const response = await fetchBackendPUT(`/customer/${customer._id}`, formData);
      if (response.ok) {
        alert('User updated successfully');
        handleCloseModal();
      } else {
        console.error('Failed to update user');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const toggleActiveStatus = async () => {
    try {
      const response = await fetchBackendPUT(`/customer/${customer._id}`,{isActive: !isActive});

      if (response.ok) {
        setIsActive((prev) => !prev);
        alert(`User ${!isActive ? 'activated' : 'suspended'} successfully`);
      } else {
        console.error('Failed to update user status');
      }
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <>
      <Card sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
          <Avatar sx={{ width: 120, height: 120, mb: 2 }} src="/default-avatar.png" />
          <Typography variant="h5">
            {`${customer.name.first.toUpperCase()} ${customer.name.last.toUpperCase()}`}
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
            {isActive ? 'Active' : 'Suspended'}
          </Typography>
        </Box>

        <Typography variant="h6" sx={{ mb: 2 }}>
          Details
        </Typography>
        <List dense>
          <ListItem>
            <ListItemText primary="Email" secondary={customer.email} />
          </ListItem>
          <ListItem>
            <ListItemText primary="Phone" secondary={customer.phone} />
          </ListItem>
          <ListItem>
            <ListItemText primary="Age" secondary={calculateAge(customer.birthDate)} />
          </ListItem>
          <ListItem>
            <ListItemText primary="Weight" secondary={`${customer.weight} kg`} />
          </ListItem>
        </List>

        <Box sx={{ mt: 2 }}>
          <Button variant="contained" fullWidth sx={{ mb: 1 }} onClick={handleOpenModal}>
            Edit
          </Button>
          <Button
            variant="outlined"
            color={isActive ? 'error' : 'success'}
            fullWidth
            onClick={toggleActiveStatus}
          >
            {isActive ? 'Suspend' : 'Activate'}
          </Button>
        </Box>
      </Card>

      {/* Edit Modal */}
      <Modal open={openModal} onClose={handleCloseModal} closeAfterTransition>
        <Fade in={openModal}>
          <Paper
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              width: 500,
              p: 4,
            }}
          >
            <Typography variant="h6" gutterBottom>
              Edit User
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <TextField
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
              />
              <TextField
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
              />
              <TextField
                label="Email"
                name="email"
                value={formData.email}
                onChange={handleChange}
              />
              <TextField
                label="Phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
              />
              <TextField
                label="Weight"
                name="weight"
                type="number"
                value={formData.weight}
                onChange={handleChange}
              />
              <Button variant="contained" onClick={handleSubmit}>
                Save
              </Button>
            </Box>
          </Paper>
        </Fade>
      </Modal>
      </>
  );
};

export default UserInfoCard;
